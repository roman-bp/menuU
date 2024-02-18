document.addEventListener('DOMContentLoaded', function () {
    const cardContainer = document.getElementById('cardContainer');
    const modal = document.getElementById('myModal');
    const closeModal = document.getElementById('closeModal');
    const modalContent = document.getElementById('modalContent');
    const cartList = document.getElementById('cartList');

    const selectedCards = new Map();

    cardContainer.addEventListener('click', function (event) {
        const target = event.target;
        if (target.classList.contains('card-link')) {
            const cardData = JSON.parse(target.dataset.card);
            displayModalContent(cardData);
            modal.style.display = 'block';
        }
    });

    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    cardContainer.addEventListener('click', function (event) {
        const target = event.target;
        if (target.classList.contains('add-to-cart')) {
            const cardTitle = target.dataset.cardTitle;
            selectedCards.set(cardTitle, (selectedCards.get(cardTitle) || 0) + 1);
            updateCartUI();
        }
    });

    cartList.addEventListener('click', function (event) {
        const target = event.target;
        if (target.classList.contains('remove-from-cart')) {
            const cardTitle = target.dataset.cardTitle;
            if (selectedCards.has(cardTitle)) {
                selectedCards.set(cardTitle, selectedCards.get(cardTitle) - 1);
                if (selectedCards.get(cardTitle) === 0) {
                    selectedCards.delete(cardTitle);
                }
            }
            updateCartUI();
        }
    });

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            createCards(data);
        })
        .catch(error => console.error('Ошибка при загрузке данных из JSON:', error));

    function createCards(cardsData) {
        cardsData.forEach(cardData => {
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

            const addToCartButton = document.createElement('button');
            addToCartButton.textContent = 'Добавить в корзину';
            addToCartButton.className = 'add-to-cart';
            addToCartButton.dataset.cardTitle = cardData.title;

            cardContent.appendChild(title);
            cardContent.appendChild(description);
            cardContent.appendChild(detailsLink);
            cardContent.appendChild(addToCartButton);

            card.appendChild(img);
            card.appendChild(cardContent);

            cardContainer.appendChild(card);
        });
    }

    function createDetailsElement(cardData) {
        const details = document.createElement('div');
        details.className = 'details';

        if (cardData.additionalField1 && Array.isArray(cardData.additionalField1)) {
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
            details.innerHTML = `
                <p>${cardData.additionalField1}</p>
            `;
        }

        details.innerHTML += `
            <p>Сложность: ${cardData.difficulty}</p>
            <p>Время приготовления: ${cardData.time}</p>
            <p>Калорийность: ${cardData.calories}</p>
        `;

        return details;
    }

    function displayModalContent(cardData) {
        modalContent.innerHTML = '';
        if (cardData.additionalField1 && Array.isArray(cardData.additionalField1)) {
            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'slider-container-modal';

            cardData.additionalField1.forEach(imageSrc => {
                const image = document.createElement('img');
                image.src = imageSrc;
                image.alt = 'Изображение слайдера';
                sliderContainer.appendChild(image);
            });

            modalContent.appendChild(sliderContainer);
        } else {
            const additionalField = document.createElement('p');
            additionalField.textContent = cardData.additionalField1;
            modalContent.appendChild(additionalField);
        }

        modalContent.innerHTML += `
            <p>Сложность: ${cardData.difficulty}</p>
            <p>Время приготовления: ${cardData.time}</p>
            <p>Калорийность: ${cardData.calories}</p>
        `;
    }

    function updateCartUI() {
        cartList.innerHTML = '';

        const cardCounts = {};

        selectedCards.forEach((count, cardTitle) => {
            if (cardCounts[cardTitle]) {
                cardCounts[cardTitle] += count;
            } else {
                cardCounts[cardTitle] = count;
            }
        });

        for (const [cardTitle, count] of Object.entries(cardCounts)) {
            const cartItem = document.createElement('li');
            cartItem.textContent = `${cardTitle} (Количество: ${count})`;

            const removeFromCartButton = document.createElement('button');
            removeFromCartButton.textContent = 'Удалить из корзины';
            removeFromCartButton.className = 'remove-from-cart';
            removeFromCartButton.dataset.cardTitle = cardTitle;

            cartItem.appendChild(removeFromCartButton);
            cartList.appendChild(cartItem);
        }
    }
});
