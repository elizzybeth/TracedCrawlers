var Crawler = require("crawler");

// Retrieve
var MongoClient = require('mongodb').MongoClient;

var setupCrawler = function(collection){
    var c = new Crawler({
        "maxConnections":2,

        // This will be called for each crawled page
        "callback":function(error,result,done) {
            if(error) {
                console.log("Error getting page.");
                console.dir(error);
                return;
            }
            const $ = result.$;
            var rx = /^http:\/\/www.palmerreport.com/;

            console.log("Got URL:" + rx);

            if(rx.test(result.request.uri.href)) {
                // on the index page
                console.log("On the index: " + result.request.uri.href);
                $(".fl-post-grid-title a").each(function(index,a) {
                    console.log(a.attribs.href);
                    collection.findOne({URL: a.attribs.href}, function(err, article){
                        if(err){
                            console.log("Article exist check failed.");
                            console.log(err);
                        } else if(article === null){
                            // not in the database already
                            // so let's queue it
                            console.log("Queueing an article: " + a.attribs.href);
                            c.queue(a.attribs.href);
                        } else {
                            console.log("Skipping an article: " + a.attribs.href);
                        }
                    });
                });
//              console.log($(".page-numbers a").attr("href"));
               c.queue($(".page-numbers a").attr("href"));

            } else {
                console.log("Loaded article: " + result.request.uri.href);
            }


             var articleData = {
                // HTML: $('html').prop('outerHTML'),
                URL: result.request.uri.href,
                author: $(".fl-post-author > a").text().trim(),
                title: $(".fl-post-title").text().trim(),
                // patribotics has no sections
                // section: $(".print-only + .prop-name > a").text().trim(),
                pubDate: new Date($(".fl-post-date").text()),
                retDate: new Date,
                // links:[],
                text: $(".fl-post-content.clearfix > p").text().trim()
            };

            collection.insert(articleData, {w: 1}, function(err, result) {
                console.log("Inserting article data.");
                console.log(articleData);
                if(err) {
                    console.log("Couldn't save article data.");
                    console.dir(err);
                    process.kill();
                }
            });

          done();
        }
    });
    c.queue("http://www.palmerreport.com/");
};

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/palmerreport", function(err, db) {
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
        setupCrawler(collection);

    });
});

// Queue just one URL, with default callback

// archive page: http://www.slate.com/full_slate.html
