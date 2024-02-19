document.addEventListener('DOMContentLoaded', function () {
    const cardContainer = document.getElementById('cardContainer');
    const modal = document.getElementById('myModal');
    const closeModal = document.getElementById('closeModal');
    const modalContent = document.getElementById('cartContent');
    const cartButton = document.getElementById('cartButton');
    const cartList = document.getElementById('cartList');
    const cartCounter = document.getElementById('cartCounter');
    const cartCounterModal = document.getElementById('cartCounterModal');
    const sendToTelegramButton = document.getElementById('sendToTelegram');

    const selectedCards = new Map();

    cartButton.addEventListener('click', function () {
        updateCartUI();
        modal.style.display = 'block';
    });

    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    sendToTelegramButton.addEventListener('click', function () {
        sendToTelegram();
    });

    fetch('data.json')
        .then(response => response.json())
        .then(createCards)
        .catch(error => console.error('Помилка при завантаженні даних з JSON:', error));

    function createCards(cardsData) {
        cardContainer.innerHTML = '';

        cardsData.forEach(cardData => {
            const card = createCardElement(cardData);
            cardContainer.appendChild(card);
        });
    }

    function createCardElement(cardData) {
        const card = document.createElement('div');
        card.className = 'card';

        const img = document.createElement('img');
        img.src = `img/${cardData.photoFileName}`;
        img.alt = 'Фото';

        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';

        const title = document.createElement('h2');
        title.textContent = cardData.title;

        const description = document.createElement('p');
        description.textContent = cardData.description;

        const details = createDetailsElement(cardData);

        const detailsLink = document.createElement('a');
        detailsLink.href = '#';
        detailsLink.className = 'card-link';
        detailsLink.textContent = 'Подробнее';
        detailsLink.dataset.card = JSON.stringify(cardData);

        detailsLink.addEventListener('click', function (event) {
            event.preventDefault();
            displayModalContent(cardData);
            modal.style.display = 'block';
        });

        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Добавить в корзину';
        addToCartButton.addEventListener('click', function () {
            addToCart(cardData.title);
            updateCartUI();
        });

        cardContent.appendChild(title);
        cardContent.appendChild(description);
        cardContent.appendChild(detailsLink);
        cardContent.appendChild(addToCartButton);

        card.appendChild(img);
        card.appendChild(cardContent);

        return card;
    }

    function createDetailsElement(cardData) {
        const details = document.createElement('div');
        details.className = 'details';

        if (Array.isArray(cardData.additionalField1)) {
            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'slider-container';

            cardData.additionalField1.forEach(imageSrc => {
                const image = document.createElement('img');
                image.src = imageSrc;
                image.alt = 'Изображение слайдера';
                sliderContainer.appendChild(image);
            });

            details.appendChild(sliderContainer);
        } else if (cardData.additionalField1.endsWith('.jpg') || cardData.additionalField1.endsWith('.png')) {
            const image = document.createElement('img');
            image.src = cardData.additionalField1;
            image.alt = 'Изображение';
            details.appendChild(image);
        } else {
            details.innerHTML = `<p>${cardData.additionalField1}</p>`;
        }

        details.innerHTML += `
            <p>Сложность: ${cardData.difficulty}</p>
            <p>Время приготовления: ${cardData.time}</p>
            <p>Калорийность: ${cardData.calories}</p>
        `;

        return details;
    }

    function updateCartUI() {
        let totalCount = 0;

        cartList.innerHTML = '';
        selectedCards.forEach((count, cardTitle) => {
            const cartItem = document.createElement('li');
            cartItem.textContent = `${cardTitle} (выбрано ${count} раз)`;

            const removeFromCartButton = document.createElement('button');
            removeFromCartButton.textContent = 'Удалить из корзины';
            removeFromCartButton.className = 'remove-from-cart';
            removeFromCartButton.dataset.cardTitle = cardTitle;

            removeFromCartButton.addEventListener('click', function () {
                removeFromCart(cardTitle);
                updateCartUI();
            });

            cartItem.appendChild(removeFromCartButton);
            cartList.appendChild(cartItem);

            totalCount += count;
        });

        cartCounter.textContent = totalCount;
        cartCounterModal.textContent = totalCount;
    }

    function displayModalContent(cardData) {
        modalContent.innerHTML = '';

        const modalTitle = document.createElement('h2');
        modalTitle.textContent = cardData.title;

        const modalDescription = document.createElement('p');
        modalDescription.textContent = cardData.description;

        const modalDetails = createDetailsElement(cardData);

        modalContent.appendChild(modalTitle);
        modalContent.appendChild(modalDescription);
        modalContent.appendChild(modalDetails);
    }

    function addToCart(cardTitle) {
        if (selectedCards.has(cardTitle)) {
            selectedCards.set(cardTitle, selectedCards.get(cardTitle) + 1);
        } else {
            selectedCards.set(cardTitle, 1);
        }
    }

    function removeFromCart(cardTitle) {
        if (selectedCards.has(cardTitle)) {
            const count = selectedCards.get(cardTitle);
            if (count > 1) {
                selectedCards.set(cardTitle, count - 1);
            } else {
                selectedCards.delete(cardTitle);
            }
        }
    }

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

        selectedCards.forEach((count, cardTitle) => {
            message += `${cardTitle}: ${count} шт.\n`;
        });

        message += `\nЗагальна кількість: ${cartCounter.textContent} шт.`;

        return message;
    }
});
