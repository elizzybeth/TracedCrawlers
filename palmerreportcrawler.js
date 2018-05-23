var TracedCrawler = require("./crawlerabstracted.js");

const options = {
    site: "palmerreport",
    getArticleText: function($){
        return $(".fl-post-content.clearfix > p").text();
    },
    startURL: "http://www.palmerreport.com/",
    indexCallback: function(error, result, done, indexCrawler, queueArticle){

      result.$(".fl-post-grid-title a").each(function(index,a) {
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
