var MongoClient = require('mongodb').MongoClient;

// find unique list of sites
async function findSites(articles){
  var sites = await articles.distinct("site");
  return sites;
}

// for each site, find all the frequencyObjects for that site
async function getFrequencyObjectBySite(articles){
  var sites = await findSites(articles);
  console.log(sites);
  var results = {};
  sites.forEach(async function(site){
    console.log(site);
    results[site] = await getOneSiteFrequencyObject(site, articles);
    process.exit();
  });
  return results;
}

async function getOneSiteFrequencyObject(site, articles) {
  var FOCursor = await articles.find({"site": site},{"frequency": true});
  var FOArray = await FOCursor.toArray();
  var accumulator = {};
  var wordCount = 0;
  FOArray.forEach(function({frequency}){
    Object.keys(frequency).forEach(function(word){
      if(accumulator.hasOwnProperty(word)){
        accumulator[word] += frequency[word];
      } else {
        accumulator[word] = frequency[word];
      }
      wordCount += frequency[word];
    });
  });
  console.log(accumulator);
  console.log(wordCount);
  return 1;
}


/*


// reduce the frequencyObjects

// from [one frequency object] to [meta frequency object]




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
    getFrequencyObjectBySite(articles);
  })


});
