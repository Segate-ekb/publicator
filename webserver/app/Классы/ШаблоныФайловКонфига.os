&Желудь
Процедура ПриСозданииОбъекта()
КонецПроцедуры

Функция defaultVrd() Экспорт
	Возврат  "<?xml version=""1.0"" encoding=""UTF-8""?>
|<point xmlns=""http://v8.1c.ru/8.2/virtual-resource-system""
|		xmlns:xs=""http://www.w3.org/2001/XMLSchema""
|		xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance""
|		base=""/%1""
|		ib=""%2""
|		%3>
|	%4
|	%5
|	%6
|</point>";
КонецФункции

Функция КонфигПубликации() Экспорт
	Возврат  "Alias ""/%1"" ""/%2/""
			|<Directory ""/%2/"">
			|	AllowOverride All
			|	Options None
			|	Require all granted
			|	SetHandler 1c-application
			|	ManagedApplicationDescriptor ""/%3""
			|</Directory>";
КонецФункции

Функция КонфигПубликацииСервераХранилища() Экспорт
	 Возврат  "Alias ""/%1"" ""/%2/""
			|<Directory ""/%2/"">
			|	AllowOverride All
			|	Require all granted
			|   Order allow,deny
			|	Allow from all
			|	SetHandler 1cws-process
			|</Directory>";

КонецФункции

Функция СекцияPoint() Экспорт
	Возврат "<point name=""%1""
|			alias=""%2""
|			enable=""%3""
|			reuseSessions=""%4""
|			sessionMaxAge=""%5""
|			poolSize=""%6""
|			poolTimeout=""%7""/>";
КонецФункции

Функция СекцияService() Экспорт
	Возврат "<service name=""%1""
|			rootUrl=""%2""
|			enable=""%3""
|			reuseSessions=""%4""
|			sessionMaxAge=""%5""
|			poolSize=""%6""
|			poolTimeout=""%7""/>";
КонецФункции

Функция oidc() Экспорт
	Возврат "<openidconnect>
|    <providers>
|       <![CDATA[%1]]>
|    </providers>
|%2
|</openidconnect>";

КонецФункции	

Функция base_onec_config() Экспорт
	Возврат "LoadModule _1cws_module %1
|AddHandler 1cws-process .1ccr
|
|# Тут будут описания всех подключенных конфигураций";
КонецФункции

Функция crsPublication() Экспорт
	Возврат "<?xml version=""1.0"" encoding=""UTF-8""?>
|	<repository connectString=""%1""/>";
КонецФункции