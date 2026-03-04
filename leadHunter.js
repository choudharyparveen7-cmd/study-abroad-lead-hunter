const TELEGRAM_TOKEN = "8601740613:AAH2J_NkTxkyv0nHZPN6WEF6tJlL2PUYuwM";
const CHAT_ID = "1719285475";

const keywords = [
"study abroad",
"study abroad without IELTS",
"study in singapore",
"vocational courses abroad",
"study in europe free",
"study visa help",
"visitor visa canada",
"work visa abroad",
"study abroad consultant delhi"
];

async function sendTelegram(message){

await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
chat_id: CHAT_ID,
text: message
})
});

}

async function scan(){

for (let keyword of keywords){

try{

const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&limit=5`;

const res = await fetch(url,{
headers:{
"User-Agent":"Mozilla/5.0"
}
});

const text = await res.text();

if(!text.includes('"children"')){
console.log("Reddit blocked request for:", keyword);
continue;
}

const data = JSON.parse(text);

for (let post of data.data.children){

const title = post.data.title;
const link = "https://reddit.com" + post.data.permalink;

const message =
`🎓 Study Abroad Lead

Keyword: ${keyword}

${title}

${link}`;

await sendTelegram(message);

}

}catch(err){

console.log("Error scanning keyword:", keyword);

}

}

}

scan();
