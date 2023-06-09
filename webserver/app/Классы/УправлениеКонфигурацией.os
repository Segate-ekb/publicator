#Использовать json
&Пластилин Перем ФайловыеОперации;
&Пластилин Перем НастройкиПубликатора;
&ЛогПубликатора Перем Лог;

&Желудь
Процедура ПриСозданииОбъекта()
КонецПроцедуры

Функция ПрочитатьКонфиг() Экспорт
	Лог.Отладка("Приступаем к чтению Json c настройками.");
	Конфиг = ФайловыеОперации.ПрочитатьТекстФайла(НастройкиПубликатора.ПутьККонфигу);
	ПарсерJSON = Новый ПарсерJSON;
	Возврат ПарсерJSON.ПрочитатьJSON(?(ЗначениеЗаполнено(Конфиг), Конфиг, "{}"),,,Истина);
КонецФункции

Процедура ЗаписатьКонфиг(Знач Конфиг) Экспорт
	Лог.Отладка("Приступаем к обновлению Json c конфигом.");

	Если Не ТипЗнч(Конфиг) = Тип("Строка") Тогда
		Лог.Отладка("Передана не json строка. Сериализуем.");
		ПарсерJSON = Новый ПарсерJSON;
		Конфиг = ПарсерJSON.ЗаписатьJSON(Конфиг);
	КонецЕсли;
	ФайловыеОперации.ЗаписатьТекстФайла(НастройкиПубликатора.ПутьККонфигу, Конфиг);
	Лог.Информация("Файл конфигурации успешно обновлен.");
КонецПроцедуры

Процедура ЗаписатьНастройки(Знач Настройки) Экспорт
	Лог.Отладка("Приступаем к обновлению Json c настройками.");

	Если Не ТипЗнч(Настройки) = Тип("Строка") Тогда
		Лог.Отладка("Передана не json строка. Сериализуем.");
		ПарсерJSON = Новый ПарсерJSON;
		Настройки = ПарсерJSON.ЗаписатьJSON(Настройки);
	КонецЕсли;
	ФайловыеОперации.ЗаписатьТекстФайла(НастройкиПубликатора.ПутьКНастройкам, Настройки);
	Лог.Информация("Файл конфигурации успешно обновлен.");
КонецПроцедуры

Функция ВернутьТекстКонфига() Экспорт
	ТекстКонфига = ФайловыеОперации.ПрочитатьТекстФайла(НастройкиПубликатора.ПутьККонфигу);
	Возврат ?(ЗначениеЗаполнено(ТекстКонфига), ТекстКонфига, "{""bases"":[], ""crs"":[]}");
КонецФункции

Функция ВернутьТекстНастроек() Экспорт
	ТекстКонфига = ФайловыеОперации.ПрочитатьТекстФайла(НастройкиПубликатора.ПутьКНастройкам);
	Возврат ?(ЗначениеЗаполнено(ТекстКонфига), ТекстКонфига, "{""publicationServerUrl"":""http://localhost""}");
КонецФункции

