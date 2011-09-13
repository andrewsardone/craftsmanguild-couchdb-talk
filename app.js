var couchapp = require('couchapp'),
    path     = require('path');

var ddoc = {
  _id: '_design/app'
};

ddoc.views = {
  "recent-chirps": {
    map: function(doc) {
      if (doc.type === "chirp" && doc.created_at) {
        emit(doc.created_at, doc);
      }
    }
  }
};

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;
