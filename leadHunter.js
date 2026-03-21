const fs = require("fs");

// 📅 Output file (daily)
const OUTPUT = `leads_${new Date().toISOString().split("T")[0]}.doc`;
const HISTORY = "history.json";

// 🎯 Keywords (focused but not too narrow)
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

// 🔍 Platforms (high signal)
const platforms = [
"reddit.com/r/Indians_StudyAbroad",
"reddit.com/r/StudyAbroad",
"reddit.com/r/gradadmissions",
"quora.com"
];

let history = new Set();
let leads = [];

// 📂 Load history (avoid duplicates)
if (fs.existsSync(HISTORY)) {
try {
JSON.parse(fs.readFileSync(HISTORY)).forEach(l => history.add(l));
} catch {
console.log("⚠️ History corrupted. Resetting...");
}
}

// ➕ Add lead
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

// 🔥 Generate leads (balanced filtering)
function generateLeads() {

keywords.forEach(keyword => {

platforms.forEach(platform => {

// ✅ Primary query (question intent)
let searchQuery =
`site:${platform} ${keyword} "how" OR "can I" OR "what" OR "help"`;

let link =
"https://www.google.com/search?q=" +
encodeURIComponent(searchQuery) +
"&tbs=qdr:w&num=20";

addLead(platform, `${keyword} (questions)`, link);

// ✅ Fallback query (ensures results)
let fallbackQuery =
`site:${platform} ${keyword}`;

let fallbackLink =
"https://www.google.com/search?q=" +
encodeURIComponent(fallbackQuery) +
"&tbs=qdr:w&num=20";

addLead(platform, `${keyword} (general)`, fallbackLink);

});

});

}

// 📄 Create Word file
function createFile() {

let html = `
<html>
<body>

<h2>ICEC - Weekly Study Abroad Leads</h2>

<table border="1" style="border-collapse:collapse;font-family:Arial">

<tr>
<th>Date</th>
<th>Platform</th>
<th>Topic</th>
<th>Open Link</th>
</tr>
`;

if (leads.length === 0) {
html += `
<tr>
<td colspan="4">No leads found. Try adjusting keywords.</td>
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

// 💾 Save history
function saveHistory() {
fs.writeFileSync(HISTORY, JSON.stringify([...history], null, 2));
}

// 🚀 Run
function run() {

console.log("🔍 Generating study abroad leads...");

generateLeads();

createFile();

saveHistory();

console.log("✅ Leads Generated:", leads.length);
console.log("📁 File:", OUTPUT);

}

run();
