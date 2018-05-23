var MongoClient = require('mongodb').MongoClient;

// find unique list of sites
function findSites(articles){
  articles.distinct("site",(function(err,sites){
    console.log(sites);
  }))
}

/*

// for each site, find all the frequencyObjects for that site
// reduce the frequencyObjects

// from [one frequency object] to [meta frequency object]


function frequencyObjectToMeta(metaFrequencyObject, frequencyObject){
  Object.keys(frequencyObject).forEach(function(word){
    if(metaFrequencyObject.hasOwnProperty(word)){
      metaFrequencyObject[word] += frequencyObject[word];
    } else {
      metaFrequencyObject[word] = frequencyObject[word];
    }
  });
}

// imagine we have array called articles that's an array of frequencyObject-having objects; this will be the result of a mongo query, that's only frequencyObjects

var metaFrequencyObject = articles.reduce(function(accumulator, article){ //
  frequencyObjectToMeta(accumulator, article.frequencyObject);
  return accumulator;
},{});

*/

MongoClient.connect("mongodb://localhost:27017/tracedcrawler", function(err, db){
  if(err) {
    console.log("Couldn't connect.");
    console.dir(err);
    process.kill();
  }
  db.createCollection('articles', function(err,articles){
    if(err) {
      console.log("Couldn't create articles collection.");
      console.dir(err);
      process.kill();
    }
    // put function calls here
    findSites(articles);
  })


});
