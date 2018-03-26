
var TracedCrawler = require("./crawlerabstracted.js");

var httpRegEx = /^http(s)?/;
var slashRegEx = /^\/\//;

function fixFoxLinks(URL){
  if(httpRegEx.test(URL)){
    console.log("Checked a link, nothing added: ");
    console.log(URL);
    return(URL);
  } else if (slashRegEx.test(URL)) {
    console.log("Checked a link, added http: ");
    console.log(URL);
    return("http:" + URL);
  } else {
    console.log("Checked a link, added http://www.foxnews.com: ");
    console.log(URL);
    return("http://www.foxnews.com" + URL);
  }
}

const options = {
    site: "foxnews",
    getArticleText: function($){
        return $(".article-body").find("p").text();
    },
    startURL: "http://www.foxnews.com",
    indexCallback: function(error, result, done, indexCrawler, queueArticle){

      result.$(".title > a").each(function(index,a) {
          console.log(a.attribs.href);
          queueArticle(fixFoxLinks(a.attribs.href));
      });
      console.log("Next page: ");
      result.$(".more > a").each(function(index,a){
          console.log(a.attribs.href);
          indexCrawler.queue(fixFoxLinks(a.attribs.href));
      });
    done();
    }
};

var crawler = new TracedCrawler(options);
