
var TracedCrawler = require("./crawlerabstracted.js");

var httpRegEx = /^http(s)?/;
var slashRegEx = /^\/\//;

function fixDWLinks(URL){
  if(httpRegEx.test(URL)){
    console.log("Checked a link, nothing added: ");
    console.log(URL);
    return(URL);
  } else if (slashRegEx.test(URL)) {
    console.log("Checked a link, added http: ");
    console.log(URL);
    return("http:" + URL);
  } else {
    console.log("Checked a link, added http://www.dailywire.com: ");
    console.log(URL);
    return("http://www.dailywire.com" + URL);
  }
}

function APICallURL(pageNumber){
    var offset = 15 * (pageNumber - 1);
    return "https://www.dailywire.com/api/v1/articles/retrieve.json?limit=15&offset=" + offset;
}

var currentPage = 1;


const options = {
    site: "dailywire",
    getArticleText: function($){
        return $(".field-body > p").text();
    },
    startURL: APICallURL(currentPage),


    indexCallback: function(error, result, done, indexCrawler, queueArticle){
      //console.log(result.$(".btn-secondary-md.load-more")[0]);
        var articleDataArray = JSON.parse(result.body);

        articleDataArray.forEach(function(article){
            queueArticle(fixDWLinks(article.url));
        });
        currentPage++;
        if(currentPage < 151){
            indexCrawler.queue(APICallURL(currentPage));
        }
    done();
    }
};

var crawler = new TracedCrawler(options);
