const req = require('express/lib/request');
const TelegramBot = require('node-telegram-bot-api');
const config = require('./cfg.json');
const bot = new TelegramBot(config.token, {polling: true});
const {gameOptions, againOptions} = require('./options.js')
const chats = {

}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадю цифру от 0 до 9, а ты должен ее отгадать!');
            const randomNum = Math.floor(Math.random() * 10);
            chats[chatId] = randomNum;
            await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Имя и Фамилия'},
        {command: '/game', description: 'Игра'}
    ])

        bot.on('message', async (msg) =>{
        const text = msg.text;
        const chatId = msg.chat.id;
        if(msg.text === '/start'){
            await bot.sendMessage(chatId, 'Добро пожаловать в мой телеграм-бот')
            return bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/b50/063/b5006369-8faa-44d7-9f02-1ca97d82cd49/1.webp')
        }
        if(msg.text === '/info'){
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}, а твоя фамилия ${msg.from.last_name}`)
        }
        if(msg.text === '/game'){
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!')
        console.log(msg)
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again'){
            return startGame(chatId);
        }
        if(data ==  chats[chatId]){
            return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
        } 
        else{
            return bot.sendMessage(chatId, `К сожалению ты не угадал, загаданая цифра была ${chats[chatId]}`, againOptions);
        } 
        console.log(msg)
    })
}

start();
