
function sendToTelegram() {
    const telegramBotToken = '6852234273:AAGtNELD5wP9Kw-SOx_9l8uPKyS9fPj8aCk';
    const chatId = '720338217';

    const message = generateTelegramMessage();
    const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

    fetch(telegramApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Telegram response:', data);
        })
        .catch(error => console.error('Error sending to Telegram:', error));
}

function generateTelegramMessage() {
    let message = 'Замовлення в корзині:\n\n';

    let totalOrderAmount = 0;

    selectedCards.forEach((data, cardTitle) => {
        const { count, price } = data;
        const itemAmount = price * count;
        totalOrderAmount += itemAmount;

        message += `${cardTitle}: ${count} шт. - ${itemAmount} грн\n`;
    });

    message += `\nЗагальна кількість: ${cartCounter.textContent} шт.`;
    message += `\nЗагальна вартість замовлення: ${totalOrderAmount} грн`;

    const customerName = customerNameInput.value.trim();
    const customerPhone = customerPhoneInput.value.trim();
    const deliveryAddress = deliveryAddressInput.value.trim();

    if (customerName !== '') {
        message += `\nІм'я клієнта: ${customerName}`;
    }

    if (customerPhone !== '') {
        message += `\nТелефон клієнта: ${customerPhone}`;
    }

    if (deliveryAddress !== '') {
        message += `\nАдреса доставки: ${deliveryAddress}`;
    }

    return message;
}
});

