ymaps.ready(init);

function init() {
    // Создаем выпадающую панель с поисковыми подсказками и прикрепляем ее к HTML-элементу по его id.
    var suggestView1 = new ymaps.SuggestView('suggest1');
    // Задаем собственный провайдер поисковых подсказок и максимальное количество результатов.
    var suggestView2 = new ymaps.SuggestView('suggest2', {provider: provider, results: 3});
}
