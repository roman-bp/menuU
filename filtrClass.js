// Функция для фильтрации карточек
function filterCards(category) {
    // Скрываем все карточки
    $('.card').hide();
    // Показываем только карточки, которые соответствуют выбранной категории
    $('.' + category).show();
}

// Обработчики кликов для навбара
$(document).ready(function() {
    $('.navbar a').click(function() {
        // Получаем категорию из атрибута href (например, #hot-dishes)
        var category = $(this).attr('href').replace('#', '');
        // Фильтруем карточки по этой категории
        filterCards(category);
        // Предотвращаем стандартное поведение ссылки
        return false;
    });
});
