module.exports = (function(){
    var Crawler = require("crawler");

    // Retrieve
    var MongoClient = require('mongodb').MongoClient;

    class TracedCrawler {
        constructor(options) {
          // options will include: site name, starting URL, index callback, article callback

          this.options = options;

          MongoClient.connect("mongodb://localhost:27017/tracedcrawler", function(err, db) {
              if(err) {
                  console.log("Couldn't connect.");
                  console.dir(err);
                  process.kill();
              }
              db.createCollection('articles', function(err, collection) {
                  if(err) {
                      console.log("Couldn't create articles collection.");
                      console.dir(err);
                      process.kill();
                  }
                  this.collection = collection;
                  this.setupCrawler();
                  this.indexCrawler.queue(this.options.startURL);

              }.bind(this));
          }.bind(this));
        }
        queueArticle(URL){
          this.collection.findOne({URL: URL}, function(err, article){
              if(err){
                  console.log("Article exist check failed.");
                  console.log(err);
              } else if(article === null){
                  // not in the database already
                  // so let's queue it
                  console.log("Queueing an article: " + URL);
                  this.articleCrawler.queue(URL);
              } else {
                  console.log("Skipping an article: " + URL);
              }
          }.bind(this));
        }


        setupCrawler(){
            this.indexCrawler = new Crawler({
                "maxConnections":2,

                "callback":function(error,result,done) {
                    if(error) {
                        console.log("Error getting page.");
                        console.dir(error);
                        return;
                    }

                    this.options.indexCallback(error, result, done, this.indexCrawler, this.queueArticle.bind(this));
                }.bind(this)
            });

            this.articleCrawler = new Crawler({
                "maxConnections":2,

                "callback":function(error, result, done) {
                    if(error) {
                        console.log("Error getting page.");
                        console.dir(error);
                        return;
                    }
                    console.log("Loaded article: " + result.request.uri.href);
                    var articleData = {
                       HTML: result.body,
                       URL: result.request.uri.href,
                       retDate: new Date,
                       text: this.options.getArticleText(result.$).trim(),
                       site: this.options.site
                    };
                    this.collection.insert(articleData, {w: 1}, function(err, result) {
                        console.log("Inserting article data.");
                        console.log(articleData);
                        if(err) {
                            console.log("Couldn't save article data.");
                            console.dir(err);
                            process.kill();
                        }
                        done();
                    });
                }.bind(this)
            });
        }
    }
    return TracedCrawler;
})();
