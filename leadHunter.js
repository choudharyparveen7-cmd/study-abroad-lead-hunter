const TELEGRAM_TOKEN = "AAH2J_NkTxkyv0nHZPN6WEF6tJlL2PUYuwM";
const CHAT_ID = "1719285475";

const keywords = [
"study abroad help",
"study abroad consultant",
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
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
chat_id: CHAT_ID,
text: message
})
});

}

async function scan(){

for (let keyword of keywords){

const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&sort=new&limit=5`;

const res = await fetch(url);

const data = await res.json();

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

}

}

scan();
