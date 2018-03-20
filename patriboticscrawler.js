var TracedCrawler = require("./crawlerabstracted.js");

const articleURLs = [
  "https:\/\/patribotics.blog\/2017\/09\/22\/exclusive-fisa-target-svb-bank-server-sent-cambridge-analytica-data-to-trump\/",
  "https:\/\/patribotics.blog\/2017\/05\/31\/exclusive-devin-nunes-top-secret-clearance-has-been-revoked\/",
  "https:\/\/patribotics.blog\/2017\/04\/01\/alfa-bank-trump-tower-and-a-social-media-impeachment\/",
  "https:\/\/patribotics.blog\/2018\/03\/20\/cambridge-analytica-next-their-links-to-russian-propaganda\/",
  "https:\/\/patribotics.blog\/2018\/03\/10\/did-carter-page-call-devin-nunes-from-moscow\/",
  "https:\/\/patribotics.blog\/2018\/02\/25\/putins-wikileaks-host-mob-laundromat-funded-gop\/",
  "https:\/\/patribotics.blog\/2018\/01\/02\/trump-russia-collusion-why-muellers-not-thinking-small\/",
  "https:\/\/patribotics.blog\/2018\/01\/01\/exclusive-new-york-times-moscow-hack-compromised-papers-emails\/",
  "https:\/\/patribotics.blog\/2017\/12\/01\/exclusive-erik-prince-worked-for-chinese-intelligence-pence-targeted\/",
  "https:\/\/patribotics.blog\/2017\/11\/24\/exclusive-brexit-referendum-may-need-to-be-redone\/",
  "https:\/\/patribotics.blog\/2017\/11\/09\/exclusive-china-syndrome-xi-and-putin-partnered-in-u-s-election-interference\/",
  "https:\/\/patribotics.blog\/2017\/11\/05\/exclusive-sources-general-flynn-wept-as-he-asked-fbi-to-spare-mike-flynn-jr\/",
  "https:\/\/patribotics.blog\/2017\/10\/29\/exclusive-mueller-has-dozens-of-sealed-indictments-including-on-donald-trump\/",
  "https:\/\/patribotics.blog\/2017\/10\/29\/mueller-meltdown-trump-other-suspects-squeal-online-over-charges\/",
  "https:\/\/patribotics.blog\/2017\/10\/26\/exclusive-farages-brexit-team-mueller-interview-over-cambridge-analytica\/",
  "https:\/\/patribotics.blog\/2017\/09\/24\/exclusive-trey-gowdy-connected-pac-linked-to-russias-hack-of-america\/",
  "https:\/\/patribotics.blog\/2017\/09\/22\/exclusive-sources-paul-manaforts-secret-florida-storage-facility\/",
  "https:\/\/patribotics.blog\/2017\/09\/20\/fun-with-fisa-the-trump-russia-treason-timeline\/",
  "https:\/\/patribotics.blog\/2017\/09\/18\/the-curious-case-of-the-march-for-truth-and-the-bulgarian-hacker\/",
  "https:\/\/patribotics.blog\/2017\/08\/29\/a-note-on-patribotics-louise-mensch\/",
  "https:\/\/patribotics.blog\/2017\/08\/15\/pimpotus-trump-models-and-russias-human-traffickers\/",
  "https:\/\/patribotics.blog\/2017\/08\/07\/rex-tillerson-under-criminal-investigation-for-wayne-tracker-fraud\/",
  "https:\/\/patribotics.blog\/2017\/08\/04\/scot-sedition-june-24-treasonmeeting-2\/",
  "https:\/\/patribotics.blog\/2017\/07\/20\/fox-news-under-fbi-investigation-fcc-broadcasting-license-under-threat\/",
  "https:\/\/patribotics.blog\/2017\/07\/18\/exclusive-eric-schneiderman-had-donald-trump-under-state-surveillance\/",
  "https:\/\/patribotics.blog\/2017\/07\/18\/exclusive-gchq-has-recordings-of-donald-trump-jr-and-kushners-russia-meeting\/",
  "https:\/\/patribotics.blog\/2017\/07\/15\/exclusive-donald-trump-called-into-a-trump-tower-russian-spy-meeting\/",
  "https:\/\/patribotics.blog\/2017\/06\/29\/exclusive-sigint-on-kushnerivanka-inside-russian-embassy\/",
  "https:\/\/patribotics.blog\/2017\/06\/29\/exclusive-reince-wanted-to-run-nato-sigint-on-trumps-treasonweasels\/",
  "https:\/\/patribotics.blog\/2017\/06\/25\/exclusive-sheriff-clarke-attacked-black-lives-matter-on-putins-orders\/",
  "https:\/\/patribotics.blog\/2017\/06\/23\/carolina-conspiracy-jack-posobiec-and-the-fakes-that-forced-comeys-hand\/",
  "https:\/\/patribotics.blog\/2017\/06\/21\/hostkey-west-trumps-miami-red-square\/",
  "https:\/\/patribotics.blog\/2017\/06\/18\/exclusive-sessions-ordered-two-comey-memos-rosenstein-not-recuse\/",
  "https:\/\/patribotics.blog\/2017\/06\/17\/daughtergate-ivanka-trump-scrubbed-from-trump-poker-shell-companies\/",
  "https:\/\/patribotics.blog\/2017\/06\/13\/exclusive-russian-ambassador-kislyaks-phone-hacked-by-five-eyes\/",
  "https:\/\/patribotics.blog\/2017\/06\/13\/exclusive-director-comey-legally-taped-calls-meetings-with-trump\/",
  "https:\/\/patribotics.blog\/2017\/06\/09\/paul-ryan-taped-with-russian-ambassador-on-gop-money-laundering\/",
  "https:\/\/patribotics.blog\/2017\/06\/08\/comey-day-meticulously-executed-testimony-was-counterintelligence-plan\/",
  "https:\/\/patribotics.blog\/2017\/06\/08\/comey-day-cometh-heres-what-to-expect\/",
  "https:\/\/patribotics.blog\/2017\/05\/31\/exclusive-federal-marshals-execute-seizure-warrants-at-trump-tower\/",
  "https:\/\/patribotics.blog\/2017\/05\/29\/donald-trump-sealed-indictment-started-with-eric-schneiderman\/",
  "https:\/\/patribotics.blog\/2017\/05\/28\/op-ed-imagine-theres-no-donald-what-if-the-45th-president-were-orrin-hatch\/",
  "https:\/\/patribotics.blog\/2017\/05\/25\/naveed-jamali-tweets-he-was-a-source-on-the-fisa-warrant-story\/",
  "https:\/\/patribotics.blog\/2017\/05\/25\/milo-yiannopoulus-has-an-account-with-a-fisa-targeted-russian-bank\/",
  "https:\/\/patribotics.blog\/2017\/05\/23\/exclusive-marshal-of-the-supreme-court-warned-trump-over-muslim-ban\/",
  "https:\/\/patribotics.blog\/2017\/05\/22\/mike-flynn-turns-on-trump-talks-to-fbi\/",
  "https:\/\/patribotics.blog\/2017\/05\/20\/exclusive-judiciary-committee-considering-articles-of-impeachment\/",
  "https:\/\/patribotics.blog\/2017\/05\/17\/comeys-fbi-computer-illegally-accessed-data-given-to-russian-diplomats\/",
  "https:\/\/patribotics.blog\/2017\/05\/16\/exclusive-u-s-marshals-readying-plan-approved-by-justice-dept-official\/",
  "https:\/\/patribotics.blog\/2017\/05\/15\/exclusive-fbi-no-longer-glomar-ing-on-politicized-leaks-to-giuliani\/",
  "https:\/\/patribotics.blog\/2017\/05\/14\/exclusive-sealed-indictment-granted-against-donald-trump\/",
  "https:\/\/patribotics.blog\/2017\/05\/13\/trumps-presidency-ended-may-9th-hatch-getting-security-briefings\/",
  "https:\/\/patribotics.blog\/2017\/05\/11\/sources-russia-probe-means-president-hatch-rico-case-against-gop\/",
  "https:\/\/patribotics.blog\/2017\/05\/11\/exclusive-comey-day-first-trump-russia-arrests-possible-thursday\/",
  "https:\/\/patribotics.blog\/2017\/05\/06\/exclusive-six-fisa-warrants-granted-in-trump-russia-cases\/",
  "https:\/\/patribotics.blog\/2017\/05\/01\/exclusive-sean-spicer-tweeted-a-bitcoin-address-not-his-password\/",
  "https:\/\/patribotics.blog\/2017\/04\/29\/sources-boris-epshteyn-paid-russian-hackers-for-both-team-trump-and-fsb\/",
  "https:\/\/patribotics.blog\/2017\/04\/23\/did-donald-trump-commission-russias-hack-of-the-us-election-himself\/",
  "https:\/\/patribotics.blog\/2017\/04\/16\/carter-page-went-to-moscow-with-a-tape-of-donald-trump-offering-treason-for-hacking\/",
  "https:\/\/patribotics.blog\/2017\/04\/16\/mike-flynns-treason-tour-global-russian-propaganda-coordinated-with-trump\/",
  "https:\/\/patribotics.blog\/2017\/04\/04\/putins-hacker-wikileaks-host-pyotr-chayanov-hacked-americas-vote-system-and-the-dnc\/",
  "https:\/\/patribotics.blog\/2017\/03\/28\/kushner-and-trump-taped-at-secret-trump-tower-meetings-with-russians\/",
  "https:\/\/patribotics.blog\/2017\/03\/27\/did-nunes-leak-fisa-warrant-info-via-white-house-lawyer-michael-ellis\/",
  "https:\/\/patribotics.blog\/2017\/03\/27\/boris-epshteyn-named-in-july-fisa-application-did-nunes-obstruct-justice\/",
  "https:\/\/patribotics.blog\/2017\/03\/14\/wikileaks-hands-keys-to-putins-russian-hacker-readers-leakers-tracked\/",
  "https:\/\/patribotics.blog\/2017\/03\/12\/wikileaks-is-connected-to-russia-despite-their-claimswikileaks-is-connected-to-russia-despite-their-claims\/",
  "https:\/\/patribotics.blog\/2017\/02\/26\/planespotting-michael-cohens-amazing-journey-louise-mensch\/",
  "https:\/\/patribotics.blog\/2017\/02\/14\/the-carolina-conspiracy-putin-catfished-weiner-louise-mensch\/",
  "https:\/\/patribotics.blog\/2017\/02\/07\/jeff-sessions-attorney-general-suspect\/",
  "https:\/\/patribotics.blog\/2017\/01\/17\/dear-mr-putin-lets-play-chess-louise-mensch-trump-russia\/"
];

const options = {
    site: "patribotics",
    getArticleText: function($){
        return $(".entry-content.clearfix > p").text();
    },
    startURL: "https://patribotics.blog/",
    indexCallback: function(error, result, done, indexCrawler, queueArticle){

      articleURLs.forEach(URL => queueArticle(URL));

/*      result.$(".entry-title a").each(function(index,a) {
          console.log(a.attribs.href);
          queueArticle(a.attribs.href);
      });

      // then call indexCrawler.queue(on the next page of article index, however get that);
*/
    }
};

var crawler = new TracedCrawler(options);
