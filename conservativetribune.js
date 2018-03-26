
var TracedCrawler = require("./crawlerabstracted.js");
var currentPage = 1;
var nextToQueue;

const options = {
    site: "conservativetribune",
    getArticleText: function($){
        return $(".entry-content > p").text();
    },
    startURL: "https://conservativetribune.com/",
    indexCallback: function(error, result, done, indexCrawler, queueArticle){

      result.$(".entry-content > a").each(function(index,a) {
          console.log(a.attribs.href);
          queueArticle(a.attribs.href);
      });
      if(currentPage < 251){
          console.log("Next page: ");
          nextToQueue = "https://conservativetribune.com/page/" + currentPage;
          console.log(nextToQueue)
          indexCrawler.queue(nextToQueue)
          currentPage++;
      }

      done();
    }
};

var crawler = new TracedCrawler(options);
