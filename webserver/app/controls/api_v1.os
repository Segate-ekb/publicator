&Пластилин Перем УправлениеКонфигурацией;
&Пластилин Перем АпачУправлятор;
&Пластилин Перем АпачМодификаторКонфига;
&ЛогПубликатора Перем Лог;

&Контроллер("/api/v1/")
Процедура ПриСозданииОбъекта()

КонецПроцедуры

&ТочкаМаршрута("getconfig.json")
Процедура ПолучитьКонфиг(Ответ) Экспорт
	JsonСтрока = УправлениеКонфигурацией.ВернутьТекстКонфига();
	Ответ.УстановитьТипКонтента("json");
	Ответ.ТелоТекст = JsonСтрока;
	Ответ.заголовки.Вставить("Access-Control-Allow-Origin", "*");
	Ответ.УстановитьСостояниеОК();
КонецПроцедуры

&ТочкаМаршрута("updateconfig")
Процедура ПерезаписатьКонфиг(Запрос, ТелоЗапросОбъект, Ответ) Экспорт
	Если не Запрос.Метод = "POST" Тогда
		Ответ.Модель = Новый Структура();
		Ответ.Модель.Вставить("КодСостояния", 405);
		Ответ.Модель.Вставить("ТекстСообщения", "Недопустимый метод!");
		Ответ.Модель.Вставить("Запрос", Запрос);
		Возврат;
	КонецЕсли;

	Если не ЗначениеЗаполнено(ТелоЗапросОбъект) Тогда
		Лог.Ошибка("Некорректно заполнено тело запроса. Ожидается Json!");
		Ответ.Модель = Новый Структура();
		Ответ.Модель.Вставить("КодСостояния", 400);
		Ответ.Модель.Вставить("ТекстСообщения", "Некорректно заполнено тело запроса. Ожидается Json!");
		Ответ.Модель.Вставить("Запрос", Запрос);
		Возврат;
	КонецЕсли;

	УправлениеКонфигурацией.ЗаписатьКонфиг(Запрос.Тело);
	АпачМодификаторКонфига.ОпубликоватьБазы(УправлениеКонфигурацией.ПрочитатьКонфиг());
	Ответ.заголовки.Вставить("Access-Control-Allow-Origin", "*");
	Ответ.УстановитьСостояниеОК();
КонецПроцедуры

&ТочкаМаршрута("ws/start")
Процедура Старт(Ответ) Экспорт
	АпачУправлятор.ЗапуститьАпач();
	Ответ.УстановитьСостояниеОК();
КонецПроцедуры

&ТочкаМаршрута("ws/stop")
Процедура Стоп(Ответ) Экспорт
	АпачУправлятор.ОстановитьАпач();
	Ответ.УстановитьСостояниеОК();
КонецПроцедуры

&ТочкаМаршрута("ws/restart")
Процедура Рестарт(Ответ) Экспорт
	АпачУправлятор.ПерезапуститьАпач();
	Ответ.УстановитьСостояниеОК();
КонецПроцедуры

