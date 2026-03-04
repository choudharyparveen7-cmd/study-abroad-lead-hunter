const TELEGRAM_TOKEN = "AAH2J_NkTxkyv0nHZPN6WEF6tJlL2PUYuwM";
const CHAT_ID = "1719285475";

const keywords = [
"study abroad help",
"study abroad consultant",
"study abroad without IELTS",
"no IELTS courses abroad",
"study in singapore",
"study in singapore without IELTS",
"vocational courses abroad",
"diploma courses abroad",
"study in europe free",
"tuition free universities europe",
"study visa help",
"student visa process",
"visitor visa canada",
"visitor visa australia",
"work visa abroad",
"study abroad consultant delhi",
"study visa consultant delhi"
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

const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&sort=new&limit=5`;

const res = await fetch(url,{
headers:{
"User-Agent":"study-abroad-lead-bot"
}
});

const data = await res.json();

for (let post of data.data.children){

const title = post.data.title;
const link = "https://reddit.com" + post.data.permalink;

const message =
`🎓 Study Abroad Lead Found

Keyword: ${keyword}

Title:
${title}

Link:
${link}`;

await sendTelegram(message);

}

}

}

scan();
