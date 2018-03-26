
var TracedCrawler = require("./crawlerabstracted.js");
var currentPage = 1;
var nextToQueue;

const options = {
    site: "dailycaller",
    getArticleText: function($){
        return $(".thepost.post.article-content > p").text();
    },
    startURL: "http://dailycaller.com/section/entertainment/",
    indexCallback: function(error, result, done, indexCrawler, queueArticle){
      result.$(".box-post > h2 > a").each(function(index,a) {
          console.log(a.attribs.href);
          queueArticle(a.attribs.href);
      });
      /*
      console.log("Next page: ");
      console.log(result.$(".show-for-medium-up > a")[0].attribs.href);
      indexCrawler.queue(result.$(".show-for-medium-up > a")[0].attribs.href);
      */

      if(currentPage < 51){
          console.log("Next page: ");
          nextToQueue = "http://dailycaller.com/section/entertainment/page/" + currentPage;
          console.log(nextToQueue);
          indexCrawler.queue(nextToQueue);
          currentPage++;
      }

    done();
    }
};

var crawler = new TracedCrawler(options);
