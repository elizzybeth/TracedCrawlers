/* Tues morning:

Not sure why the jQuery is failing. npm installed jQuery, getting the console.error(


C:\Users\eliza\Desktop\TracedCrawlers\patriboticscrawler.js:25
                $(".entry-title a").each(function(index,a) {
                                   ^

TypeError: Cannot read property 'each' of undefined
    at Object.callback (C:\Users\eliza\Desktop\TracedCrawlers\patriboticscrawler.js:25:36)
);

Is this because it's not recognizing .each? or not recognizing the .entry-title because it's an h2, not a div?

*/


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
            var rx = /^https:\/\/patribotics.blog/;

            console.log("Got URL:" + rx);

            if(rx.test(result.request.uri.href)) {
                // on the index page
                console.log("On the index: " + result.request.uri.href);
                $(".entry-title a").each(function(index,a) {
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
//                c.queue($(".load-more-button a")[0].href);
// Not sure what to do about the "older posts" button
                return;
            } else {
                console.log("Loaded article: " + result.request.uri.href);
            }
/* from Slate
            var singlePage = $(".single-page a");
            if (singlePage.length){
                console.log("Switching to single page: " + singlePage[0].href);
                c.queue(singlePage[0].href);
                return;
            }
*/

/* Next up, fix this:
            var articleData = {
                HTML: $('html').prop('outerHTML'),
                URL: result.request.uri.href,
                authors: [],
                title: $(".entry-title").text().trim(),
                section: $(".print-only + .prop-name > a").text().trim(),
                pubDate: new Date($(".pub-date").text()),
                retDate: new Date,
                links:[],
                paragraphs:[]
            };

            $(".text.parbase.section > p").each(function(index,p) {
                articleData.paragraphs.push($(p).text().trim());
            });
            // Join array elements into a string.
            articleData.fullText = articleData.paragraphs.join(" ");

            // Then turn all new lines into spaces (with replace function).
            articleData.fullText = articleData.fullText.replace(/[\r\n]/," ");

            // Then turn all double spaces into single spaces (replace).
            articleData.fullText = articleData.fullText.replace(/\s\s+/," ");

            // Then trim off the final space at end.
            articleData.fullText = articleData.fullText.trim();

            // Then count words with string.split.
            articleData.wordCount = articleData.fullText.split(" ").length;

            // fill authors array
            $("#main_byline a").each(function(index,a){
                articleData.authors.push($(a).text().trim());
            });

            // $ is a jQuery instance scoped to the server-side DOM of the page
            $(".body a").each(function(index,a) {
                var text = $(a).text().trim();
                if(text !== "More..." && text !== "Join In" && text !== "" && text !== undefined){
                    articleData.links.push({
                        text: text,
                        href: a.href,
                        length: text.length,
                        wordCount: text.split(" ").length
                    });
                }
            });
            collection.insert(articleData, {w: 1}, function(err, result) {
                if(err) {
                    console.log("Couldn't save article data.");
                    console.dir(err);
                    process.kill();
                }
            });
*/
          done();
        }
    });
    c.queue("https://patribotics.blog/");
};

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/patribotics", function(err, db) {
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
