$.couch.app(function(app) {

  // Mustache template for a single chirp
  var chirpTemplate = "{{#chirps}}\n<li id=\"{{_id}}\" class=\"chirp\">\n  <div class=\"chirp-body\">{{body}}</div>\n  <div class=\"chirp-date\">{{created_at}}</div>\n</li>\n{{/chirps}}";

  /**
   * Saves the given chirp to our database
   *
   * @param chirp
   *            The chirp object to save
   * @param callback
   *            The callback to be called with the successfully saved chirp
   *            document as an argument
   */
  function saveChirp(chirp, callback) {
    var doc = {
      _id: new Date().getTime() + "",
      type: "chirp",
      body: chirp,
      created_at: new Date().getTime()
    };

    app.db.saveDoc(doc, {
      success: function(data) {
        $.log("Saved document: " + doc._id);
        if ($.isFunction(callback)) callback(doc);
      }
    });
  }

  /**
   * Binds the #add-chirp-submit-button element to saving a chirp
   */
  $('#add-chirp-submit-button').live('click', function(event) {
    event.preventDefault();
    var chirpBody = $('#add-chirp-body').val();
    saveChirp(chirpBody, function(doc) {
      $('#add-chirp-body').val('');
    });
  });

  /**
   * Query the 'recent-chirps' view when this script loads, update the #chirps
   * element with the results
   *
   * <pre>
   * <code>
   * > curl -X GET http://couch/db/_design/design-doc/_view/recent-chirps
   * {"total_rows":4,"offset":0,"rows":[
   *   {"id":"1315944878223","key":1315944878223,"value":{...}},
   *   {"id":"1315944966718","key":1315944966718,"value":{...}},
   *   {"id":"1315945053099","key":1315945053099,"value":{...}},
   *   {"id":"1315945940161","key":1315945940161,"value":{...}}
   * ]}
   * </code>
   * </pre>
   */
  app.view('recent-chirps', {
    descending: true,
    success: function(data) {
      var rows = [];
      for (var i in data.rows) {
        if (data.rows[i].value) {
          var value = data.rows[i].value;
          rows.push({
            _id: value._id,
            body: value.body,
            created_at: new Date(value.created_at)
          });
        }
      }
      $('#chirps').prepend($.mustache(chirpTemplate, {chirps: rows}));
    }
  });

  /**
   * Queries our database for its info, so we can grab the latest
   * update_seq, i.e., the current number of updates to the database.
   *
   * <pre>
   * <code>
   *   > curl -X GET http://couch/db
   *   {
   *     "db_name": "foo",
   *     "doc_count": 11,
   *     "doc_del_count": 0,
   *     "update_seq": 22,
   *     "purge_seq": 0,
   *     "compact_running": false,
   *     "disk_size": 143449,
   *     "instance_start_time": "1315945046506731",
   *     "disk_format_version": 5,
   *     "committed_update_seq": 22
   *   }
   * </code>
   * </pre>
   *
   * From there, we can register for changes (listening to the /_changes
   * resource), starting from the latest update sequence, and add new
   * chirps to our UI as they come in.
   *
   * Note, it's fun to run this and watch the changes come in:
   *
   * <pre>
   *   <code>curl -X GET 'http://couch/db/_changes?feed=continuous'</code>
   * </pre>
   */
  app.db.info({
    success: function(data) {
      window.db_info = data;
      var since = (data.update_seq || 0);
      app.db.changes(since, {include_docs: true}).onChange(function(changes) {
        var docs = [];
        for (var i in changes.results) {
          if (changes.results[i].doc) {
            var doc = changes.results[i].doc;
            if (doc.type === "chirp") {
              docs.push({
                _id: doc._id,
                body: doc.body,
                created_at: new Date(doc.created_at)
              });
            }
          }
        }
        $('#chirps').prepend($.mustache(chirpTemplate, {chirps: docs}));
      });
    }
  });

});
