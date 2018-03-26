
var TracedCrawler = require("./crawlerabstracted.js");

const options = {
    site: "forwardprogressives",
    getArticleText: function($){
        return $(".entry-content > p").text();
    },
    startURL: "https://forwardprogressives.com/category/editorspicks/",
    indexCallback: function(error, result, done, indexCrawler, queueArticle){

      result.$(".entry-title > a").each(function(index,a) {
          console.log(a.attribs.href);
          queueArticle(a.attribs.href);
      });
      console.log("Next page: ");
      console.log(result.$(".pagination-next > a")[0].attribs.href);
      indexCrawler.queue(result.$(".pagination-next > a")[0].attribs.href);
      // then call indexCrawler.queue(on the next page of article index, however get that);
    done();
    }
};

var crawler = new TracedCrawler(options);
