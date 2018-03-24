
var TracedCrawler = require("./crawlerabstracted.js");

const options = {
    site: "bipartisanreport",
    getArticleText: function($){
        return $(".entry-content > p").text();
    },
    startURL: "http://bipartisanreport.com/",
    indexCallback: function(error, result, done, indexCrawler, queueArticle){

      result.$(".type-post.status-publish > a").each(function(index,a) {
          console.log(a.attribs.href);
          queueArticle(a.attribs.href);
      });
      console.log("Next page: ");
      console.log(result.$(".nav-previous > a")[0].attribs.href);
      indexCrawler.queue(result.$(".nav-previous > a")[0].attribs.href);
      // then call indexCrawler.queue(on the next page of article index, however get that);
    done();
    }
};

var crawler = new TracedCrawler(options);
