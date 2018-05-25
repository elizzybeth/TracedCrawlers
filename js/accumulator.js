/*
Wish list:
  Aggregate frequency lists by political affiliation
  Get "vocabulary size" of each site = unique words / total words

*/

var MongoClient = require('mongodb').MongoClient;

// find unique list of sites
async function findSites(articles){
  var sites = await articles.distinct("site");
  return sites;
}

async function asyncForEach(array, callback){
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

// for each site, find all the frequencyObjects for that site
async function getFrequencyObjectBySite(articles){
  var sites = await findSites(articles);
  var results = {};
  var sorted = {};


  for(var i=0; i < sites.length; i++){
    results[sites[i]] = await getOneSiteFrequencyObject(sites[i], articles);
    sorted[sites[i]] = await sortFrequencyArray(makeFrequencyArray(results[sites[i]]));
  }

  return sorted;
}

async function saveSorted(sorted, sitesCollection){
  var size = await Object.keys(sorted).length; // prob can delete
  /*
  var idIncrementer = 1;
  for(var key in sorted){
    frequencyObjectsBySite.insert({"_id": idIncrementer}, {"site": key, "frequency": site[key]}, {upsert: true});
  }
  */

  for(var i=0; i < size; i++){
    //console.log(sorted[i]);
    var site = Object.keys(sorted)[i];
    var update = {"site": site, "frequency": sorted[site]};
    console.log(update);
    await sitesCollection.updateOne({"_id": i}, {$set: update}, {upsert: true});
  }
}

function makeFrequencyArray(obj){
  var frequencyArray = Object.keys(obj).map(key => ({word: key, count: obj[key]}));
  return frequencyArray;
}

function sortFrequencyArray(FA){
    function compare(a, b){
      if(a.count < b.count){
        return 1;
      } else if(a.count > b.count){
        return -1;
      } else {
        return 0;
      }
    }
    var sortedFA = FA.sort(compare);
    return sortedFA;
}

async function getOneSiteFrequencyObject(site, articles){
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

  return accumulator;
}


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
    db.createCollection('sitesCollection', async function(err,sitesCollection){
      if(err) {
        console.log("Couldn't create frequencyObjects collection.");
        console.dir(err);
        process.kill();
      }
      var sorted = await getFrequencyObjectBySite(articles);
      saveSorted(sorted, sitesCollection);
    });
  });
});
