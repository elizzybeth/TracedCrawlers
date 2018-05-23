
var TracedCrawler = require("./crawlerabstracted.js");

var httpRegEx = /^http(s)?/;
var slashRegEx = /^\/\//;

function fixLinks(URL){
  if(httpRegEx.test(URL)){
    console.log("Checked a link, nothing added: ");
    console.log(URL);
    return(URL);
  } else if (slashRegEx.test(URL)) {
    console.log("Checked a link, added http: ");
    console.log(URL);
    return("http:" + URL);
  } else {
    console.log("Checked a link, added https://www.theblaze.com: ");
    console.log(URL);
    return("https://www.theblaze.com" + URL);
  }
}

function APICallURL(pageNumber){
    var offset = 20 * (pageNumber - 1);
    return "https://premium.theblaze.com/api/v2/channels/13/feed_items?page=3&filter=all&offset=" + offset;
}

var currentPage = 1;


const options = {
    site: "theblaze",
    getArticleText: function($){
        return $(".entry-content.article-styles > p").text();
    },
    startURL: APICallURL(currentPage),


    indexCallback: function(error, result, done, indexCrawler, queueArticle){
        var articleDataObject = JSON.parse(result.body);
        var articleDataArray = articleDataObject.feed_items;

        articleDataArray.forEach(function(article){
              console.log(article.item_link);
            queueArticle(fixLinks(article.item_link));
        });
        currentPage++;

        if(currentPage < 151){
            indexCrawler.queue(APICallURL(currentPage));
        }
    done();
    }
};

var crawler = new TracedCrawler(options);
