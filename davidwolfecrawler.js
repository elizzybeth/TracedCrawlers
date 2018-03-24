
var TracedCrawler = require("./crawlerabstracted.js");

const options = {
    site: "davidwolfe",
    getArticleText: function($){
        return $(".entry-content > p").text();
    },
    startURL: "https://www.davidwolfe.com/category/news/",
    indexCallback: function(error, result, done, indexCrawler, queueArticle){

      result.$(".entry-title > a").each(function(index,a) {
          console.log(a.attribs.href);
          queueArticle(a.attribs.href);
      });
      console.log("Next page: ");
      console.log(result.$(".pagination-next.alignright > a")[0].attribs.href);
      indexCrawler.queue(result.$(".pagination-next.alignright > a")[0].attribs.href);
      // then call indexCrawler.queue(on the next page of article index, however get that);
    done();
    }
};

var crawler = new TracedCrawler(options);
