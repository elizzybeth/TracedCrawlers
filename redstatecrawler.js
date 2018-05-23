
var TracedCrawler = require("./crawlerabstracted.js");
var currentPage = 1;
var nextToQueue;

const options = {
    site: "redstate",
    getArticleText: function($){
        return $(".col-xs-11.article-text > p").text();
    },
    startURL: "https://www.redstate.com/sections/front-page-stories/",
    indexCallback: function(error, result, done, indexCrawler, queueArticle){
      result.$(".large-card-bottom > h2 > a").each(function(index,a) {
          console.log(a.attribs.href);
          queueArticle(a.attribs.href);
      });

      if(currentPage < 51){
          console.log("Next page: ");
          nextToQueue = "https://www.redstate.com/sections/front-page-stories/page/" + currentPage;
          console.log(nextToQueue);
          indexCrawler.queue(nextToQueue);
          currentPage++;
      }

    done();
    }
};

var crawler = new TracedCrawler(options);
