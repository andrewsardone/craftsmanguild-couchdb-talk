var couchapp = require('couchapp'),
    path     = require('path');

var ddoc = {
  _id: '_design/app'
};

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;
