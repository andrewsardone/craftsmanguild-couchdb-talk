$.couch.app(function(app) {

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

});
