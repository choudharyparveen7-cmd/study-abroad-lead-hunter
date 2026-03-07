const fs = require("fs");

const OUTPUT = "study_abroad_leads.doc";
const HISTORY = "history.json";

const keywords = [
"study abroad without IELTS India",
"study in Singapore Indian students",
"cheap universities abroad India",
"vocational courses abroad India",
"study in Europe free Indian students",
"student visa help India",
"study in Canada after 12th India",
"work visa abroad India",
"visitor visa Canada India",
"study abroad consultants India advice"
];

const platforms = [
"reddit.com",
"quora.com",
"youtube.com",
"facebook.com",
"linkedin.com",
"t.me"
];

let history = new Set();
let leads = [];

if (fs.existsSync(HISTORY)) {
JSON.parse(fs.readFileSync(HISTORY)).forEach(l => history.add(l));
}

function addLead(source,title,link){

if(history.has(link)) return;

history.add(link);

leads.push({
date: new Date().toLocaleDateString(),
source,
title,
link
});

}

function generateLeads(){

keywords.forEach(keyword=>{

platforms.forEach(platform=>{

const searchQuery = `site:${platform} ${keyword}`;

const link =
"https://www.google.com/search?q=" +
encodeURIComponent(searchQuery) +
"&tbs=qdr:w";

addLead(platform,keyword,link);

});

});

}

function createWordTable(){

let html = `
<html>
<body>

<h2>Weekly Study Abroad Leads</h2>

<table border="1" style="border-collapse:collapse">

<tr>
<th>Date</th>
<th>Source</th>
<th>Topic</th>
<th>Link</th>
</tr>
`;

leads.forEach(l=>{

html += `
<tr>
<td>${l.date}</td>
<td>${l.source}</td>
<td>${l.title}</td>
<td><a href="${l.link}">Open Discussion</a></td>
</tr>
`;

});

html += `
</table>
</body>
</html>
`;

fs.writeFileSync(OUTPUT,html);

}

function saveHistory(){

fs.writeFileSync(
HISTORY,
JSON.stringify([...history],null,2)
);

}

function run(){

console.log("Generating weekly study abroad leads...");

generateLeads();

createWordTable();

saveHistory();

console.log("Total leads:",leads.length);

}

run();
