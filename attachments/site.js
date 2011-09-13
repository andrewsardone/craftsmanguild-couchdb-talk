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


});
