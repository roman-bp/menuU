document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('myModal');
    const closeModal = document.getElementById('closeModal');
    const cartButton = document.getElementById('cartButton');
    const cartList = document.getElementById('cartList');
    const cartCounter = document.getElementById('cartItemCount');
    const cartCounterModal = document.getElementById('cartCounterModal');
    const sendToTelegramButton = document.getElementById('sendToTelegram');
    const orderTime = document.getElementById('orderTime');
    const customerNameInput = document.getElementById('customerName');
    const customerPhoneInput = document.getElementById('customerPhone');
    const deliveryAddressInput = document.getElementById('deliveryAddress');

    const selectedCards = new Map();

    setupEventListeners();
    loadAndDisplayCards('all');

    function setupEventListeners() {
        closeModal.addEventListener('click', () => modal.style.display = 'none');
        window.addEventListener('click', (event) => {
            if (event.target === modal) modal.style.display = 'none';
        });
        cartButton.addEventListener('click', () => {
            updateCartUI();
            modal.style.display = 'block';
        });
        sendToTelegramButton.addEventListener('click', sendToTelegram);

        document.getElementById('cardContainer').addEventListener('click', function(event) {
            if (event.target.tagName === 'BUTTON' && event.target.classList.contains('addToCart')) {
                const title = event.target.dataset.title;
                const price = parseFloat(event.target.dataset.price);
                addToCart(title, price);
            }
        });

        document.querySelectorAll('.navbar a').forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const category = this.getAttribute('href').substring(1);
                loadAndDisplayCards(category);
            });
        });
    }

    function loadAndDisplayCards(category) {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                const filteredData = category === 'all' ? data : data.filter(card => card.category === category);
                createCards(filteredData);
            })
            .catch(error => console.error('Ошибка при загрузке данных из JSON:', error));
    }

    function createCards(cardsData) {
        const cardContainer = document.getElementById('cardContainer');
        cardContainer.innerHTML = '';
        cardsData.forEach(cardData => {
            const cardElement = createCardElement(cardData);
            cardContainer.appendChild(cardElement);
        });
        initializeCarousel();
    }

    function createCardElement(cardData) {
        const card = document.createElement('div');
        card.className = 'card';
        const imgContainer = document.createElement('div');
        imgContainer.className = 'slider-container';
        cardData.photoFileName.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = cardData.title;
            imgContainer.appendChild(img);
        });
        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';
        cardContent.innerHTML = `
            <h2>${cardData.title}</h2>
            <p>${cardData.description}</p>
            <p>Цена: ${cardData.price} грн</p>
            <button class="addToCart" data-title="${cardData.title}" data-price="${cardData.price}">Добавить в корзину</button>
        `;
        card.appendChild(imgContainer);
        card.appendChild(cardContent);
        return card;
    }

    function initializeCarousel() {
        $('.slider-container').not('.slick-initialized').slick({
            dots: true,
            infinite: true,
            speed: 300,
            slidesToShow: 1,
            adaptiveHeight: true
        });
    }

    function addToCart(title, price) {
        const current = selectedCards.get(title) || { count: 0, price: price };
        current.count += 1;
        selectedCards.set(title, current);
        updateCartUI();
    }

    function removeFromCart(title) {
        const current = selectedCards.get(title);
        if (!current) return;
        current.count -= 1;
        if (current.count <= 0) {
            selectedCards.delete(title);
        } else {
            selectedCards.set(title, current);
        }
        updateCartUI();
    }

    function updateCartUI() {
        cartList.innerHTML = '';
        let total = 0;
        selectedCards.forEach((value, key) => {
            const item = document.createElement('li');
            item.textContent = `${key}: ${value.count} шт. - ${value.price * value.count} грн`;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Удалить';
            removeButton.classList.add('removeFromCart');
            removeButton.dataset.title = key;
            item.appendChild(removeButton);
            cartList.appendChild(item);
            total += value.price * value.count;
        });
        cartCounter.textContent = Array.from(selectedCards.values()).reduce((acc, { count }) => acc + count, 0);
        cartCounterModal.textContent = `Всего: ${total} грн`;
        orderTime.textContent = `Общая стоимость: ${total} грн`;
    }

    function sendToTelegram() {
        const message = generateTelegramMessage();
        console.log('Отправка сообщения в Telegram: ', message);
        // Замените 'YOUR_TELEGRAM_BOT_TOKEN' и 'YOUR_CHAT_ID' на ваши данные
        const telegramBotToken = '6852234273:AAGtNELD5wP9Kw-SOx_9l8uPKyS9fPj8aCk';
        const chatId = '720338217';
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
        .then(data => console.log('Telegram response:', data))
        .catch(error => console.error('Error sending to Telegram:', error));
    }

    function generateTelegramMessage() {
        let message = 'Заказ:\n\n';
        selectedCards.forEach((value, key) => {
            message += `${key}: ${value.count} шт. - ${value.price * value.count} грн\n`;
        });
        const total = Array.from(selectedCards.values()).reduce((acc, { count, price }) => acc + (count * price), 0);
        message += `\nВсего товаров: ${cartCounter.textContent}, на сумму: ${total} грн.`;
        message += `\nИмя клиента: ${customerNameInput.value}`;
        message += `\nТелефон клиента: ${customerPhoneInput.value}`;
        message += `\nАдрес доставки: ${deliveryAddressInput.value}`;
        return message;
    }
});
