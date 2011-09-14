# Ann Arbor Craftsman Guild &mdash; CouchDB & CouchApps

Here are the slides and example code from my CouchDB &amp; CouchApps talk at the [Ann Arbor Craftsman Guild](http://twitter.com/CraftsmanGuild).

## About Chirpr

Chripr is the example app we wrote &mdash; a single user Twitter clone. Its Couch design document is declared in `app.js` and built using Mikeal Roger's [couchapp](https://github.com/mikeal/node.couchapp.js) utility. The easiest way to grab `couchapp` is via [npm](http://npmjs.org/):

    npm install --global couchapp

Then, within the repo, simply create a target database on your CouchDB of choice and deploy the app:

    curl -X PUT http://localhost:5984/chirpr
    couchapp push app.js http://localhost:5984/chirpr

### Note

Chirpr is a really trivial app. Its sole purpose is to demonstrate serving resources from Couch which then query Couch from the client. Of course, expanding could create jQuery spaghetti code. You might take a look at:

  - [Backbone.js](http://documentcloud.github.com/backbone/) with [backbone-couchdb](http://janmonschke.com/projects/backbone-couchdb.html) 
  - [SproutCore 2.0](https://github.com/sproutcore/sproutcore20)

  - [Sammy.js](http://sammyjs.org/)

  - [Data.js](http://substance.io/michael/data-js)
