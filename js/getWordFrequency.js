var MongoClient = require('mongodb').MongoClient;

const stopwords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", "been", "before", "being",
"below", "between", "both", "but", "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has", "have",
"having", "how", "if", "in", "into", "is", "it", "its", "itself", "of", "on", "or", "out", "over", "so", "some", "such", "than", "that", "the", "then", "there", "these",
"this", "those", "through", "to", "under", "until", "up", "was", "were", "what", "when", "where", "which", "while", "with", "would"];

async function getWordFrequency(articles, article) {
  var textSplit = article.text.toLowerCase().split(/[\W]+/);
  textSplit.sort();
  var wordcount = textSplit.length;
  var frequencyObject = makeFrequencyObject(textSplit);

/* SAVE MAKING AN ARRAY FOR SOURCE COMPARISON
  var frequencyObjectArray = makeFrequencyArray(frequencyObject[0]);
  frequencyObjectArray.sort((a,b) => b.count - a.count);
*/

  var update = {"frequency": frequencyObject, wordcount, "changed": 1};
  await articles.updateOne({_id: article._id},
      {$set: update}
  );

/*
  function makeFrequencyArray(obj){
    return Object.keys(obj).map(key => ({word: key, count: obj[key]}));
  }
*/

  function makeFrequencyObject(words) {
    var word = null;
    var count = 0;

    var frequencyObject = {};

    for(var i = 0; i < words.length; i++) {
      if(stopwords.indexOf(words[i]) === -1){
          if(words[i] != word){
            if(count > 0){
              frequencyObject[word] = count;
            }
            word = words[i];
            count = 1;
          } else {
            count++;
          }
      }
    }
    frequencyObject[word] = count;
    return frequencyObject;
  }
}

async function iterateArticles(articles){
  let article;

  while(article = await articles.findOne({changed:{$exists:false}})){
    console.log(article.URL);
    await getWordFrequency(articles, article);
  };
  console.log("After loop.");
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
    iterateArticles(articles);
  })


});
