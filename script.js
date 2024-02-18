document.addEventListener('DOMContentLoaded', function () {
    const cardContainer = document.getElementById('cardContainer');
    const modal = document.getElementById('myModal');
    const closeModal = document.getElementById('closeModal');
    const modalContent = document.getElementById('modalContent');

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

            cardContent.appendChild(title);
            cardContent.appendChild(description);
            cardContent.appendChild(detailsLink);

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
});
