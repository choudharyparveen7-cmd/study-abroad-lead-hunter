const fs = require("fs");

const OUTPUT = `leads_${new Date().toISOString().split("T")[0]}.doc`;
const HISTORY = "history.json";

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

const platforms = [
"reddit.com/r/Indians_StudyAbroad",
"reddit.com/r/StudyAbroad",
"reddit.com/r/gradadmissions",
"quora.com"
];

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

// Load history
if (fs.existsSync(HISTORY)) {
try {
JSON.parse(fs.readFileSync(HISTORY)).forEach(l => history.add(l));
} catch {
console.log("Resetting history...");
}
}

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

function generateLeads() {

keywords.forEach(keyword => {

platforms.forEach(platform => {

questionPatterns.forEach(q => {

const searchQuery =
`site:${platform} ${keyword} "${q}" intitle:${q}`;

const link =
"https://www.google.com/search?q=" +
encodeURIComponent(searchQuery) +
"&tbs=qdr:w";

addLead(platform, `${keyword} (${q})`, link);

});

});

});

}

function createWordTable() {

let html = `
<html>
<body>

<h2>Fresh Study Abroad Leads</h2>

<table border="1" style="border-collapse:collapse">

<tr>
<th>Date</th>
<th>Platform</th>
<th>Topic</th>
<th>Link</th>
</tr>
`;

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

html += `
</table>
</body>
</html>
`;

fs.writeFileSync(OUTPUT, html);
}

function saveHistory() {
fs.writeFileSync(HISTORY, JSON.stringify([...history], null, 2));
}

function run() {
console.log("Running lead hunter...");

generateLeads();
createWordTable();
saveHistory();

console.log("New Leads:", leads.length);
}

module.exports = { run };
