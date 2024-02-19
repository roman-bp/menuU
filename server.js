const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/sendToTelegram', (req, res) => {
    const { cartData } = req.body;

    if (cartData) {
        // Замініть 'YOUR_BOT_TOKEN' на реальний токен вашого бота
        const botToken = 'YOUR_BOT_TOKEN';
        // Замініть 'YOUR_CHAT_ID' на реальний ID вашого чату в Telegram
        const chatId = 'YOUR_CHAT_ID';

        const message = `Нове замовлення!\n\n${formatCartData(cartData)}`;

        axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: chatId,
            text: message,
        })
        .then(response => {
            console.log('Message sent to Telegram:', response.data);
            res.status(200).send('Message sent to Telegram');
        })
        .catch(error => {
            console.error('Error sending message to Telegram:', error.response.data);
            res.status(500).send('Error sending message to Telegram');
        });
    } else {
        res.status(400).send('Bad Request: Missing cartData');
    }
});

function formatCartData(cartData) {
    let formattedData = '';

    cartData.forEach((count, cardTitle) => {
        formattedData += `${cardTitle} (выбрано ${count} раз)\n`;
    });

    return formattedData;
}

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
