const fs = require("fs");

const OUTPUT = "study_abroad_leads.doc";
const HISTORY = "history.json";

// 🔑 Intent-based keywords
const keywords = [
"study abroad India",
"study abroad after BTech",
"study abroad biotech students",
"masters abroad India",
"student visa India help",
"study in Canada India",
"study in Australia India",
"study in Europe Indian students"
];

// 🎯 High-quality platforms only
const platforms = [
"reddit.com/r/Indians_StudyAbroad",
"reddit.com/r/StudyAbroad",
"reddit.com/r/gradadmissions",
"quora.com"
];

// 🧠 Question patterns (real student intent)
const questionPatterns = [
"how",
"what",
"which",
"can I",
"should I",
"help",
"advice"
];

let history = new Set();
let leads = [];

// 📂 Load history to avoid duplicates
if (fs.existsSync(HISTORY)) {
try {
JSON.parse(fs.readFileSync(HISTORY)).forEach(l => history.add(l));
} catch (e) {
console.log("History file corrupted, resetting...");
}
}

// ➕ Add lead (avoid duplicates)
function addLead(source, title, link){

if(history.has(link)) return;

history.add(link);

leads.push({
date: new Date().toLocaleDateString(),
source,
title,
link
});

}

// 🔍 Generate only QUESTION-based leads (last 7 days)
function generateLeads(){

keywords.forEach(keyword=>{

platforms.forEach(platform=>{

questionPatterns.forEach(q=>{

const searchQuery =
`site:${platform} ${keyword} "${q}" intitle:${q}`;

const link =
"https://www.google.com/search?q=" +
encodeURIComponent(searchQuery) +
"&tbs=qdr:w"; // 🔥 last 7 days only

addLead(platform, `${keyword} (${q})`, link);

});

});

});

}

// 📄 Create Word file
function createWordTable(){

let html = `
<html>
<body>

<h2>Weekly Study Abroad Leads (Fresh Queries Only)</h2>

<table border="1" style="border-collapse:collapse;font-family:Arial">

<tr>
<th>Date</th>
<th>Platform</th>
<th>Topic</th>
<th>Open Link</th>
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

fs.writeFileSync(OUTPUT, html);

}

// 💾 Save history (prevents repetition daily)
function saveHistory(){

fs.writeFileSync(
HISTORY,
JSON.stringify([...history], null, 2)
);

}

// 🚀 Run
function run(){

console.log("Generating fresh study abroad leads...");

generateLeads();

createWordTable();

saveHistory();

console.log("New leads generated:", leads.length);

}

run();
