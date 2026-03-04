import fetch from "node-fetch";
import XLSX from "xlsx";
import nodemailer from "nodemailer";

const keywords = [
"study abroad",
"study abroad without IELTS",
"study in canada",
"study in australia",
"study in singapore",
"study abroad after 12th",
"cheap universities abroad",
"student visa help",
"study visa consultant",
"visitor visa canada",
"work visa abroad",
"study abroad india"
];

const intentWords = [
"help","consultant","agent","visa rejected",
"how to apply","fees","scholarship","guide"
];

let leads = [];

function scoreLead(text){
let score = 0;
intentWords.forEach(word=>{
 if(text.toLowerCase().includes(word)) score+=2;
});
return score;
}

async function scanReddit(){
for(let keyword of keywords){

 const url=`https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&limit=10`;
 const res=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0'}});
 const text=await res.text();

 if(!text.includes('"children"')) continue;

 const data=JSON.parse(text);

 for(let post of data.data.children){

  const title=post.data.title;
  const score=scoreLead(title);

  if(score>=2){
   leads.push({
    Platform:"Reddit",
    Keyword:keyword,
    Title:title,
    Link:"https://reddit.com"+post.data.permalink,
    Score:score
   });
  }

 }

}
}

function scanInstagram(){
keywords.forEach(keyword=>{
leads.push({
 Platform:"Instagram",
 Keyword:keyword,
 Title:"Instagram posts about "+keyword,
 Link:`https://www.instagram.com/explore/tags/${keyword.replace(/\s/g,'')}/`,
 Score:2
});
});
}

function scanQuora(){
keywords.forEach(keyword=>{
leads.push({
 Platform:"Quora",
 Keyword:keyword,
 Title:"Questions about "+keyword,
 Link:`https://www.quora.com/search?q=${encodeURIComponent(keyword)}`,
 Score:2
});
});
}

function scanYouTube(){
keywords.forEach(keyword=>{
leads.push({
 Platform:"YouTube",
 Keyword:keyword,
 Title:"Videos discussing "+keyword,
 Link:`https://www.youtube.com/results?search_query=${encodeURIComponent(keyword)}`,
 Score:1
});
});
}

function scanTwitter(){
keywords.forEach(keyword=>{
leads.push({
 Platform:"X (Twitter)",
 Keyword:keyword,
 Title:"Tweets about "+keyword,
 Link:`https://twitter.com/search?q=${encodeURIComponent(keyword)}`,
 Score:1
});
});
}

function scanGoogle(){
keywords.forEach(keyword=>{
leads.push({
 Platform:"Google",
 Keyword:keyword,
 Title:"Discussion threads for "+keyword,
 Link:`https://www.google.com/search?q=${encodeURIComponent(keyword+" discussion forum")}`,
 Score:1
});
});
}

function createExcel(){

const ws=XLSX.utils.json_to_sheet(leads);
const wb=XLSX.utils.book_new();

XLSX.utils.book_append_sheet(wb,ws,"Leads");

XLSX.writeFile(wb,"study_abroad_leads.xlsx");
}

async function sendEmail(){

let transporter=nodemailer.createTransport({
 service:"gmail",
 auth:{
  user:process.env.EMAIL_USER,
  pass:process.env.EMAIL_PASS
 }
});

await transporter.sendMail({
 from:process.env.EMAIL_USER,
 to:"pkc.consultancy@gmail.com",
 subject:"AI Study Abroad Lead Report",
 text:"Attached Excel contains collected leads.",
 attachments:[
  {
   filename:"study_abroad_leads.xlsx",
   path:"study_abroad_leads.xlsx"
  }
 ]
});

}

async function run(){

await scanReddit();

scanInstagram();

scanQuora();

scanYouTube();

scanTwitter();

scanGoogle();

createExcel();

await sendEmail();

}

run();
