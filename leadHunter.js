const fs = require("fs");
const https = require("https");

const OUTPUT = "study_abroad_leads.csv";
const HISTORY = "history.json";

const platforms = [
{ name:"Reddit", url:q=>`https://www.reddit.com/search.json?q=${encodeURIComponent(q)}&limit=25` },
{ name:"Quora", url:q=>`https://www.google.com/search?q=site:quora.com+${encodeURIComponent(q)}` },
{ name:"YouTube", url:q=>`https://www.google.com/search?q=site:youtube.com+${encodeURIComponent(q)}` },
{ name:"Facebook", url:q=>`https://www.google.com/search?q=site:facebook.com+${encodeURIComponent(q)}` },
{ name:"Telegram", url:q=>`https://www.google.com/search?q=site:t.me+${encodeURIComponent(q)}` }
];

const keywords = [
"study abroad without ielts",
"study abroad consultants india",
"study in singapore indian students",
"cheap universities abroad india",
"vocational courses abroad",
"study in europe free",
"student visa help",
"study in canada after 12th",
"work visa abroad",
"visitor visa canada"
];

const intentKeywords = [
"how",
"help",
"which",
"best",
"cheap",
"without ielts",
"consultant",
"visa",
"admission",
"scholarship"
];

let history = new Set();
let leads = [];

if (fs.existsSync(HISTORY)) {
JSON.parse(fs.readFileSync(HISTORY)).forEach(l=>history.add(l));
}

function scoreLead(title){

let score = 0;

intentKeywords.forEach(k=>{
if(title.toLowerCase().includes(k)) score += 10;
});

if(title.includes("India")) score += 20;
if(title.includes("student")) score += 15;
if(title.includes("visa")) score += 15;

return score;

}

function addLead(source,title,link){

if(history.has(link)) return;

const score = scoreLead(title);

history.add(link);

leads.push({
source,
title,
link,
score
});

}

async function fetchReddit(keyword){

const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&limit=50`;

return new Promise(resolve=>{

https.get(url,{headers:{'User-Agent':'lead-finder'}},res=>{

let data="";

res.on("data",c=>data+=c);

res.on("end",()=>{

try{

const json = JSON.parse(data);

json.data.children.forEach(post=>{

const title = post.data.title;
const link = "https://reddit.com"+post.data.permalink;

addLead("Reddit",title,link);

});

}catch(e){}

resolve();

});

}).on("error",()=>resolve());

});

}

function generateSearchLeads(){

keywords.forEach(keyword=>{

platforms.forEach(p=>{

const search =
"https://www.google.com/search?q=" +
encodeURIComponent(`site:${p.name.toLowerCase()}.com ${keyword} india`);

addLead(p.name,keyword,search);

});

});

}

function saveCSV(){

leads.sort((a,b)=>b.score-a.score);

let csv="Source,Topic,Score,Open Link\n";

leads.forEach(l=>{

const link =
`=HYPERLINK("${l.link}","Open Discussion")`;

csv += `"${l.source}","${l.title}","${l.score}","${link}"\n`;

});

fs.writeFileSync(OUTPUT,csv);

}

function saveHistory(){

fs.writeFileSync(
HISTORY,
JSON.stringify([...history],null,2)
);

}

async function run(){

console.log("Scanning platforms...");

for(const k of keywords){

await fetchReddit(k);

}

generateSearchLeads();

saveCSV();

saveHistory();

console.log("Total leads:",leads.length);

}

run();
