// Данные взяты из: https://ru.wikipedia.org/wiki/Население_субъектов_Российской_Федерации
var populationData = {
    "Москва": {
        "population": 12506468,
        "percent": 8.51
    },
    "Московская область": {
        "population": 7503385,
        "percent": 5.11
    },
    "Краснодарский край": {
        "population": 5603420,
        "percent": 3.81
    },
    "Санкт-Петербург": {
        "population": 5351935,
        "percent": 3.64
    },
    "Свердловская область": {
        "population": 4325256,
        "percent": 2.94
    },
    "Ростовская область": {
        "population": 4220452,
        "percent": 2.87
    },
    "Башкортостан": {
        "population": 4063293,
        "percent": 2.77
    },
    "Татарстан": {
        "population": 3894284,
        "percent": 2.65
    },
    "Челябинская область": {
        "population": 3493036,
        "percent": 2.38
    },
    "Нижегородская область": {
        "population": 3234752,
        "percent": 2.2
    },
    "Самарская область": {
        "population": 3193514,
        "percent": 2.17
    },
    "Дагестан": {
        "population": 3063885,
        "percent": 2.09
    },
    "Красноярский край": {
        "population": 2876497,
        "percent": 1.96
    },
    "Ставропольский край": {
        "population": 2800674,
        "percent": 1.91
    },
    "Новосибирская область": {
        "population": 2788849,
        "percent": 1.9
    },
    "Кемеровская область": {
        "population": 2694877,
        "percent": 1.83
    },
    "Пермский край": {
        "population": 2623122,
        "percent": 1.79
    },
    "Волгоградская область": {
        "population": 2521276,
        "percent": 1.72
    },
    "Саратовская область": {
        "population": 2462950,
        "percent": 1.68
    },
    "Иркутская область": {
        "population": 2404195,
        "percent": 1.64
    },
    "Алтайский край": {
        "population": 2350080,
        "percent": 1.6
    },
    "Воронежская область": {
        "population": 2333768,
        "percent": 1.59
    },
    "Оренбургская область": {
        "population": 1977720,
        "percent": 1.35
    },
    "Омская область": {
        "population": 1960081,
        "percent": 1.33
    },
    "Республика Крым": {
        "population": 1913731,
        "percent": 1.3
    },
    "Приморский край": {
        "population": 1913037,
        "percent": 1.3
    },
    "Ленинградская область": {
        "population": 1813816,
        "percent": 1.23
    },
    "Ханты-Мансийский автономный округ": {
        "population": 1655074,
        "percent": 1.13
    },
    "Белгородская область": {
        "population": 1549876,
        "percent": 1.06
    },
    "Удмуртия": {
        "population": 1513044,
        "percent": 1.03
    },
    "Тюменская область": {
        "population": 1498779,
        "percent": 1.02
    },
    "Тульская область": {
        "population": 1491855,
        "percent": 1.02
    },
    "Чечня": {
        "population": 1436981,
        "percent": 0.98
    },
    "Владимирская область": {
        "population": 1378337,
        "percent": 0.94
    },
    "Пензенская область": {
        "population": 1331655,
        "percent": 0.91
    },
    "Хабаровский край": {
        "population": 1328302,
        "percent": 0.9
    },
    "Тверская область": {
        "population": 1283873,
        "percent": 0.87
    },
    "Кировская область": {
        "population": 1283238,
        "percent": 0.87
    },
    "Ярославская область": {
        "population": 1265684,
        "percent": 0.86
    },
    "Ульяновская область": {
        "population": 1246618,
        "percent": 0.85
    },
    "Чувашия": {
        "population": 1231117,
        "percent": 0.84
    },
    "Брянская область": {
        "population": 1210982,
        "percent": 0.82
    },
    "Вологодская область": {
        "population": 1176689,
        "percent": 0.8
    },
    "Липецкая область": {
        "population": 1150201,
        "percent": 0.78
    },
    "Рязанская область": {
        "population": 1121474,
        "percent": 0.76
    },
    "Курская область": {
        "population": 1115237,
        "percent": 0.76
    },
    "Архангельская область": {
        "population": 1111031,
        "percent": 0.76
    },
    "Томская область": {
        "population": 1078280,
        "percent": 0.73
    },
    "Забайкальский край": {
        "population": 1072806,
        "percent": 0.73
    },
    "Тамбовская область": {
        "population": 1033552,
        "percent": 0.7
    },
    "Астраханская область": {
        "population": 1017514,
        "percent": 0.69
    },
    "Ивановская область": {
        "population": 1014646,
        "percent": 0.69
    },
    "Калужская область": {
        "population": 1012156,
        "percent": 0.69
    },
    "Калининградская область": {
        "population": 994599,
        "percent": 0.68
    },
    "Бурятия": {
        "population": 984511,
        "percent": 0.67
    },
    "Якутия": {
        "population": 964330,
        "percent": 0.66
    },
    "Смоленская область": {
        "population": 949348,
        "percent": 0.65
    },
    "Кабардино-Балкария": {
        "population": 865828,
        "percent": 0.59
    },
    "Курганская область": {
        "population": 845537,
        "percent": 0.58
    },
    "Республика Коми": {
        "population": 840873,
        "percent": 0.57
    },
    "Мордовия": {
        "population": 805056,
        "percent": 0.55
    },
    "Амурская область": {
        "population": 798424,
        "percent": 0.54
    },
    "Мурманская область": {
        "population": 753557,
        "percent": 0.51
    },
    "Орловская область": {
        "population": 747247,
        "percent": 0.51
    },
    "Северная Осетия": {
        "population": 701765,
        "percent": 0.48
    },
    "Марий Эл": {
        "population": 682333,
        "percent": 0.46
    },
    "Костромская область": {
        "population": 643324,
        "percent": 0.44
    },
    "Псковская область": {
        "population": 636546,
        "percent": 0.43
    },
    "Республика Карелия": {
        "population": 622484,
        "percent": 0.42
    },
    "Новгородская область": {
        "population": 606476,
        "percent": 0.41
    },
    "Ямало-Ненецкий автономный округ": {
        "population": 538547,
        "percent": 0.37
    },
    "Хакасия": {
        "population": 537513,
        "percent": 0.37
    },
    "Сахалинская область": {
        "population": 490181,
        "percent": 0.33
    },
    "Ингушетия": {
        "population": 488043,
        "percent": 0.33
    },
    "Карачаево-Черкесия": {
        "population": 466305,
        "percent": 0.32
    },
    "Адыгея": {
        "population": 453376,
        "percent": 0.31
    },
    "Севастополь": {
        "population": 436670,
        "percent": 0.3
    },
    "Тыва": {
        "population": 321722,
        "percent": 0.22
    },
    "Камчатский край": {
        "population": 315557,
        "percent": 0.21
    },
    "Калмыкия": {
        "population": 275413,
        "percent": 0.19
    },
    "Республика Алтай": {
        "population": 218063,
        "percent": 0.15
    },
    "Еврейская автономная область": {
        "population": 162014,
        "percent": 0.11
    },
    "Магаданская область": {
        "population": 144091,
        "percent": 0.1
    },
    "Чукотский автономный округ": {
        "population": 49348,
        "percent": 0.03
    },
    "Ненецкий автономный округ": {
        "population": 43997,
        "percent": 0.03
    }
};