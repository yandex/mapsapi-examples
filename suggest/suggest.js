ymaps.ready(init);

function init() {
    // Создаём выпадающую панель с поисковыми подсказками и прикрепляем к HTML-элементу по его id.
    var suggestView1 = new ymaps.SuggestView('suggest1');
    // Задаём собственный провайдер поисковых подсказок и количество результатов.
    var suggestView2 = new ymaps.SuggestView('suggest2', {provider: provider, results: 3});
}
