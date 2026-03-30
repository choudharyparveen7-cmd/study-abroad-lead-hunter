const fs = require("fs");

const OUTPUT = `leads_${new Date().toISOString().split("T")[0]}.doc`;
const HISTORY = "history.json";

// 🎯 Keywords
const keywords = [
"study abroad India",
"study abroad after BTech",
"study abroad biotech",
"masters abroad India",
"student visa help India",
"study in Canada India",
"study in Australia India",
"study in Europe Indian students"
];

// 🎯 Subreddits (high quality)
const subreddits = [
"Indians_StudyAbroad",
"studyAbroad",
"gradadmissions"
];

let history = new Set();
let leads = [];

// Load history
if (fs.existsSync(HISTORY)) {
try {
JSON.parse(fs.readFileSync(HISTORY)).forEach(l => history.add(l));
} catch {}
}

// Add lead (avoid duplicates)
function addLead(source, title, link) {

if (history.has(link)) return;

history.add(link);

leads.push({
date: new Date().toLocaleDateString(),
source,
title,
link
});

}

// 🔥 Generate Reddit-based leads (NO GOOGLE)
function generateLeads() {

keywords.forEach(keyword => {

subreddits.forEach(sub => {

// Question-based search
const query = `${keyword} (how OR what OR can OR help)`;

// Reddit search URL (past week)
const link = `https://www.reddit.com/r/${sub}/search/?q=${encodeURIComponent(query)}&sort=new&t=week`;

addLead(`reddit/${sub}`, keyword, link);

});

});

}

// Create Word file
function createFile() {

let html = `
<html>
<body>

<h2>ICEC - Fresh Reddit Leads (Last 7 Days)</h2>

<table border="1" style="border-collapse:collapse;font-family:Arial">

<tr>
<th>Date</th>
<th>Platform</th>
<th>Topic</th>
<th>Open</th>
</tr>
`;

if (leads.length === 0) {
html += `
<tr>
<td colspan="4">No leads found</td>
</tr>
`;
} else {

leads.forEach(l => {
html += `
<tr>
<td>${l.date}</td>
<td>${l.source}</td>
<td>${l.title}</td>
<td><a href="${l.link}">Open</a></td>
</tr>
`;
});

}

html += `
</table>
</body>
</html>
`;

fs.writeFileSync(OUTPUT, html);
}

// Save history
function saveHistory() {
fs.writeFileSync(HISTORY, JSON.stringify([...history], null, 2));
}

// Run
function run() {

console.log("Generating Reddit-based leads...");

generateLeads();

createFile();

saveHistory();

console.log("Leads generated:", leads.length);

}

run();
