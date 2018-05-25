var MongoClient = require('mongodb').MongoClient;

const left = ["palmerreport", "occupydemocrats", "bipartisanreport", "davidwolfe", "forwardprogressives"];
const right = ["foxnews", "conservativetribune", "dailycaller", "newsmax", "redstate", "breitbart", "theblaze", "infowars"];

async function makeFrequencyArray(obj){
  var frequencyArray = Object.entries(obj);
  return frequencyArray;
}

async function sortFrequencyArray(FA){
    function compare(a, b){
      if(a[1] < b[1]){
        return 1;
      } else if(a[1] > b[1]){
        return -1;
      } else {
        return 0;
      }
    }
    var sortedFA = await FA.sort(compare);
    return sortedFA;
}

async function sortOpposite(FA){
  function compare(a, b){
    if(a[1] > b[1]){
      return 1;
    } else if(a[1] < b[1]){
      return -1;
    } else {
      return 0;
    }
  }
  var sortedOpposite = await FA.sort(compare);
  return sortedOpposite;
}

async function sortByParty(sitesCollection, party){
  var accumulator = {};
  var wordCount = 0;
  var accumulatorRight = {};
  var wordCountLeft = 0;
  var wordCountRight = 0;

  for(var site in party){
    var record = await sitesCollection.findOne({"site": party[site]});
    for(var i = 0; i < record.frequency.length; i++){
      var word = record.frequency[i].word;
      var count = record.frequency[i].count;
      if(accumulator.hasOwnProperty(word)){
        accumulator[word] += count;
      } else {
        accumulator[word] = count;
      }
      wordCount += count;
    }
  }
  return accumulator;
}

async function proportion(sorted){
  var unique = await sorted.length;
  var proportionArray = [];
  //console.log(sorted);
  for(var frequencyIncrement = 0; frequencyIncrement < unique; frequencyIncrement++){
    wordFrequency = sorted[frequencyIncrement];
    var word = wordFrequency[0];
    var frequency = wordFrequency[1];
    var proportion = frequency/unique;
    proportionArray.push([word, proportion]);
  }
  return proportionArray;
}

function compareFrequencies(leftProportion, rightProportion){
  var compared = [];
  var leftUnique = [];
  var rightUnique = [];
  var foundMatch = 0;
  var difference = 0;
  for(var i = 0; i < leftProportion.length; i++){
    let leftFA = leftProportion[i];
    let leftWord = leftFA[0];
    let leftValue = leftFA[1];
    for(var j = 0; j < rightProportion.length; j++){
      let rightFA = rightProportion[j];
      let rightWord = rightFA[0];
      let rightValue = rightFA[1];
      if(leftWord === rightWord){
        foundMatch = 1;
        difference = leftValue - rightValue;
      }
    }
    if(foundMatch === 0){
      leftUnique.push(leftWord);
      difference = leftValue;
    }
    foundMatch = 0;
    compared.push([leftWord, difference]);
  }
  for(var rightFA in rightProportion){
    if(compared.hasOwnProperty(rightFA[0])){
      compared[rightFA[0]][1] += difference;
    } else {
      rightUnique.push(rightFA[0]);
      compared.push([rightFA[0]], rightFA[1]);
    }
  }
  return compared;
}


MongoClient.connect("mongodb://localhost:27017/tracedcrawler", function(err, db){
  if(err) {
    console.log("Couldn't connect.");
    console.dir(err);
    process.kill();
  }
  db.createCollection('sitesCollection', async function(err, sitesCollection){
    if(err) {
      console.log("Couldn't create articles collection.");
      console.dir(err);
      process.kill();
    }
    db.createCollection('byPoliticalParty', async function(err,byPoliticalParty){
      if(err) {
        console.log("Couldn't create byPoliticalParty collection.");
        console.dir(err);
        process.kill();
      }
      var rightObj = await sortByParty(sitesCollection, right);
      var rightFA = await makeFrequencyArray(rightObj);
      var rightSorted = await sortFrequencyArray(rightFA);
      var rightProportion = await proportion(rightSorted);

      var leftObj = await sortByParty(sitesCollection, left);
      var leftFA = await makeFrequencyArray(leftObj);
      var leftSorted = await sortFrequencyArray(leftFA);
      var leftProportion = await proportion(leftSorted);

      var compared = await compareFrequencies(leftProportion, rightProportion);
//      var comparedSorted = await sortFrequencyArray(compared);
//      console.log(comparedSorted);
      var comparedSortedReverse = await sortOpposite(compared);
      console.log(comparedSortedReverse);
    });
  });
});
