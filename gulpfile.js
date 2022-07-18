// Определяем переменную "preprocessor"
let preprocessor = 'sass' // Выбор препроцессора в проекте - sass или less

// Определяем константы Gulp
const { src, dest, parallel, series, watch } = require('gulp')

// Подключаем Browsersync
const browserSync = require('browser-sync').create()

// Подключаем gulp-concat
const concat = require('gulp-concat')

// Подключаем gulp-uglify-es
const uglify = require('gulp-uglify-es').default

// Подключаем модули gulp-sass и gulp-less
const sass = require('gulp-sass')(require('sass'))
const less = require('gulp-less')

// Подключаем Autoprefixer
const autoprefixer = require('gulp-autoprefixer')

// Подключаем модуль gulp-clean-css
const cleancss = require('gulp-clean-css')

// Подключаем Pug
const pug = require('gulp-pug')


// Определяем логику работы Browsersync
function browsersync() {
	browserSync.init({ // Инициализация Browsersync
		server: { baseDir: 'app/' }, // Указываем папку сервера
		notify: true, // Включаем уведомления
		online: true // Режим работы: true или false
	})
}

function scripts() {
	return src([ // Берем файлы из источников
		// 'node_modules/jquery/dist/jquery.min.js', // Пример подключения библиотеки
		'app/js/app.js', // Пользовательские скрипты, использующие библиотеку, должны быть подключены в конце
	])
		.pipe(concat('app.min.js')) // Конкатенируем в один файл
		.pipe(uglify()) // Сжимаем JavaScript
		.pipe(dest('app/js/')) // Выгружаем готовый файл в папку назначения
		.pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
}

function styles() {
	return src('app/' + preprocessor + '/app.' + preprocessor + '') // Выбираем источник: "app/sass/app.sass" или "app/less/app.less"
		.pipe(eval(preprocessor)()) // Преобразуем значение переменной "preprocessor" в функцию
		.pipe(concat('app.min.css')) // Конкатенируем в файл app.min.js
		.pipe(autoprefixer({ overrideBrowserslist: ['last 3 versions'], grid: true, cascade: true })) // Создадим префиксы с помощью Autoprefixer
		.pipe(cleancss( { level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ } )) // Минифицируем стили
		.pipe(dest('app/css/')) // Выгрузим результат в папку "app/css/"
		.pipe(browserSync.stream()) // Сделаем инъекцию в браузер
}

function pugToHtml() {
	return src('app/pug/*.pug')
		.pipe(pug({
			pretty: '\t'
		}))
		.pipe(dest('app'))
}

function startWatch() {

	// Выбираем все файлы JS в проекте, а затем исключим с суффиксом .min.js
	watch(['app/**/*.js', '!app/**/*.min.js'], scripts)

	// Мониторим файлы препроцессора на изменения
	watch('app/**/' + preprocessor + '/**/*', styles)

	// Мониторим файлы Pug
	watch('app/pug/**/*.pug', pugToHtml)

	// Мониторим файлы HTML на изменения
	watch('app/*.html').on('change', browserSync.reload)

}

// Экспортируем функцию browsersync() как таск browsersync. Значение после знака = это имеющаяся функция.
exports.browsersync = browsersync

// Экспортируем функцию scripts() в таск scripts
exports.scripts = scripts

// Экспортируем функцию styles() в таск styles
exports.styles = styles

// Экспортируем дефолтный таск с нужным набором функций
exports.default = parallel(styles, scripts, pugToHtml, browsersync, startWatch)

