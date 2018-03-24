
var TracedCrawler = require("./crawlerabstracted.js");

const options = {
    site: "occupydemocrats",
    getArticleText: function($){
        return $(".post-content.entry-content.cf > p").text();
    },
    startURL: "http://occupydemocrats.com/",
    indexCallback: function(error, result, done, indexCrawler, queueArticle){

      result.$(".post-title.entry-header a").each(function(index,a) {
          console.log(a.attribs.href);
          queueArticle(a.attribs.href);
      });
      console.log("Next page: ");
      console.log(result.$(".next.page-numbers")[0].attribs.href);
      indexCrawler.queue(result.$(".next.page-numbers")[0].attribs.href);

      // then call indexCrawler.queue(on the next page of article index, however get that);
    done();
    }
};

var crawler = new TracedCrawler(options);
