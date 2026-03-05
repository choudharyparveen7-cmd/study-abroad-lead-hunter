const fs = require("fs");
const https = require("https");

const OUTPUT = "study_abroad_leads.csv";
const HISTORY = "history.json";

const keywords = [
"study abroad",
"study abroad without IELTS",
"study in Singapore",
"study in Australia",
"study in Canada",
"cheap universities abroad",
"vocational courses abroad",
"study in europe free",
"student visa help",
"scholarship abroad"
];

const sources = [
{
name:"Google",
url:(q)=>`https://www.google.com/search?q=${encodeURIComponent(q)}`
},
{
name:"Reddit",
url:(q)=>`https://www.reddit.com/search/?q=${encodeURIComponent(q)}`
},
{
name:"Quora",
url:(q)=>`https://www.quora.com/search?q=${encodeURIComponent(q)}`
},
{
name:"YouTube",
url:(q)=>`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`
},
{
name:"DuckDuckGo",
url:(q)=>`https://duckduckgo.com/?q=${encodeURIComponent(q)}`
}
];

let history = new Set();
let leads = [];

if(fs.existsSync(HISTORY)){
JSON.parse(fs.readFileSync(HISTORY)).forEach(l=>history.add(l));
}

function addLead(source,title,link){

if(history.has(link)) return;

history.add(link);

leads.push({
source,
title,
link
});
}

function generateLeads(){

keywords.forEach(k=>{

sources.forEach(s=>{

const link = s.url(k);

addLead(s.name,k,link);

});

});

}

function saveCSV(){

let csv="Source,Title,Link\n";

leads.forEach(l=>{
csv += `"${l.source}","${l.title}","${l.link}"\n`;
});

fs.writeFileSync(OUTPUT,csv);

}

function saveHistory(){

fs.writeFileSync(HISTORY,JSON.stringify([...history],null,2));

}

async function run(){

console.log("Generating study abroad leads...");

generateLeads();

saveCSV();

saveHistory();

console.log("Leads created:",leads.length);

}

run();
