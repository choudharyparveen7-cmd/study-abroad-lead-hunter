const fs = require("fs");
const https = require("https");
const querystring = require("querystring");

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const keywords = [
"study abroad",
"study in singapore",
"study in australia",
"study in canada",
"study in germany",
"study abroad without ielts",
"no ielts courses abroad",
"vocational courses abroad",
"cheap universities abroad",
"student visa help",
"visitor visa canada",
"work visa australia",
"study in europe free",
"scholarship abroad",
"diploma abroad"
];

const locations = [
"Delhi",
"Haryana",
"Punjab",
"Uttar Pradesh",
"Rajasthan",
"Madhya Pradesh",
"Himachal Pradesh"
];

let leads = [];

async function fetchReddit(keyword) {

const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&limit=10`;

return new Promise((resolve) => {

https.get(url, {headers:{'User-Agent':'lead-scanner'}}, res => {

let data="";

res.on("data", chunk => data += chunk);

res.on("end", () => {

try {

const json = JSON.parse(data);

json.data.children.forEach(post => {

leads.push({
source:"Reddit",
title:post.data.title,
link:"https://reddit.com"+post.data.permalink
});

});

}catch(e){}

resolve();

});

}).on("error",()=>resolve());

});

}

async function fetchGoogle(keyword){

const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(keyword)}`;

return new Promise((resolve)=>{

https.get(url,res=>{

let data="";

res.on("data",chunk=>data+=chunk);

res.on("end",()=>{

try{

const json = JSON.parse(data);

json[1].forEach(q=>{

leads.push({

source:"Google Suggest",

title:q,

link:"Search Google"

});

});

}catch(e){}

resolve();

});

}).on("error",()=>resolve());

});

}

async function scan(){

for(const k of keywords){

await fetchReddit(k);

await fetchGoogle(k);

}

for(const loc of locations){

await fetchGoogle(`study abroad ${loc}`);

}

}

function saveCSV(){

let csv="Source,Title,Link\n";

leads.forEach(l=>{

csv += `"${l.source}","${l.title}","${l.link}"\n`;

});

fs.writeFileSync("study_abroad_leads.csv",csv);

}

async function sendEmail(){

const boundary="----leadscanner";

const message=

`From: ${EMAIL_USER}

To: ${EMAIL_USER}

Subject: Study Abroad Leads

MIME-Version: 1.0

Content-Type: multipart/mixed; boundary=${boundary}

--${boundary}

Content-Type: text/plain

New study abroad leads attached.

--${boundary}

Content-Type: text/csv; name="study_abroad_leads.csv"

Content-Disposition: attachment; filename="study_abroad_leads.csv"

${fs.readFileSync("study_abroad_leads.csv")}

--${boundary}--`;

const auth = Buffer.from(`${EMAIL_USER}:${EMAIL_PASS}`).toString("base64");

const options={

host:"smtp.gmail.com",

port:465,

method:"POST",

path:"/",

headers:{

Authorization:`Basic ${auth}`

}

};

}

async function run(){

console.log("Scanning study abroad leads...");

await scan();

saveCSV();

console.log("Leads collected:",leads.length);

}

run();
