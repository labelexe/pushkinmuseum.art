//дебаунс для правильного ресайза
function debounce(func, wait, immediate) {
	var timeout;
	return function () {
		var context = this, args = arguments;
		var later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

//туггл для функций
jQuery.fn.clickToggle = function (a, b) {
	function cb() { [b, a][this._tog ^= 1].call(this); }
	return this.on("click", cb);
};

// возвращает cookie с именем name, если есть, если нет, то undefined
function getCookie(name) {
	var matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

// устанавливает cookie с именем name и значением value
// options - объект с свойствами cookie (expires, path, domain, secure)
function setCookie(name, value, options) {
	options = options || {};

	var expires = options.expires;

	if (typeof expires == "number" && expires) {
		var d = new Date();
		d.setTime(d.getTime() + expires * 1000);
		expires = options.expires = d;
	}
	if (expires && expires.toUTCString) {
		options.expires = expires.toUTCString();
	}

	value = encodeURIComponent(value);

	var updatedCookie = name + "=" + value;

	for (var propName in options) {
		updatedCookie += "; " + propName;
		var propValue = options[propName];
		if (propValue !== true) {
			updatedCookie += "=" + propValue;
		}
	}

	document.cookie = updatedCookie;
}

// удаляет cookie с именем name
function deleteCookie(name) {
	setCookie(name, "", {
		expires: -1
	})
}

//получаем случайное число от min до max
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

//аккордеон
(function ($) {
	$.fn.vmenuModule = function (option) {
		var obj,
			item;
		var options = $.extend({
			Speed: 220,
			autostart: true,
			autohide: 1
		},
			option);
		obj = $(this);

		item = obj.find("ul").parent("li").children("button");
		item.attr("data-option", "off");

		item.unbind('click').on("click", function (e) {
			e.preventDefault();
			var a = $(this);
			if (options.autohide) {
				a.parent().parent().find("button[data-option='on']").parent("li").children("ul").slideUp(options.Speed / 1.2,
					function () {
						$(this).parent("li").children("button").attr("data-option", "off");
					})
			}
			if (a.attr("data-option") == "off") {
				a.parent("li").children("ul").slideDown(options.Speed,
					function () {
						a.attr("data-option", "on");
					});
			}
			if (a.attr("data-option") == "on") {
				a.attr("data-option", "off");
				a.parent("li").children("ul").slideUp(options.Speed)
			}
		});
		if (options.autostart) {
			obj.find("button").each(function () {

				$(this).parent("li").parent("ul").slideDown(options.Speed,
					function () {
						$(this).parent("li").children("button").attr("data-option", "on");
					})
			})
		}

	}
})(jQuery);


//проверка на несколько классов
$.fn.hasAnyClass = function () {
	for (var i = 0; i < arguments.length; i++) {
		var classes = arguments[i].split(" ");
		for (var j = 0; j < classes.length; j++) {
			if (this.hasClass(classes[j])) {
				return true;
			}
		}
	}
	return false;
};



$(document).ready(function () {

	//определим девайс и ОС и добавим класс к <html/>
	var htmlTag = document.querySelector('html');
	htmlTag.className += (' ' + platform.name.toLowerCase() + ' ' + platform.os.family.toLowerCase());

	//десктоп панель настроек
	var callControl = $('.js-call-control'),
		mainControlsSectionBlock = $('.main-controls-section-block');

	callControl.click(function (e) {

		e.stopPropagation();

		$(this).find(mainControlsSectionBlock).toggleClass('opened');
		$(this).find(".main-controls__button").toggleClass('active');

		callControl.not(this).each(function () {
			$(this).find(mainControlsSectionBlock).removeClass('opened');
			$(this).find(".main-controls__button").removeClass('active');
		});

	});

	//код бэкендера для того, чтобы если страница выводится через поиск, подкрасить слово, которое искали
	var url_param = decodeURIComponent(window.location.search);
	var param_find = "";
	if (url_param.indexOf("find=") >= 0) {
		param_find = url_param.substr(url_param.indexOf("find=") + 5);
	}

	if (param_find != "") {
		var reg = new RegExp(param_find, "gi");
		$("main div").each(function (i, item) {
			item.innerHTML = item.innerHTML.replace(reg, function (str, offset, s) {
				return "<needle>" + str + "</needle>"; console.log("Строка " + s + "столбец " + offset);
			});
		});
	}

	//console.log($("section div").text());

	$('.js-call-search').click(function (e) {
		$('.form-search input').focus();
	});
	mainControlsSectionBlock.click(function (e) {
		e.stopPropagation();
	});
	$(document).click(function () {
		callControl.find(mainControlsSectionBlock).removeClass('opened');
		callControl.find(".main-controls__button").removeClass('active');
		$(".js-btn-share-block").removeClass('open');
	});



	/*      $("#term, #condition").change(function () {console.log("jsfhskjdf");
					 if ($("#term").is(':checked') &&
							 $("#condition").is(':checked') ) {
							 $('.subscribe-form-btn').attr('disabled', false);
					 } else {
							 $('.subscribe-form-btn').attr('disabled', true);
					 }
				});*/
	$(".term, .condition").change(function () {
		console.log($(this).parent().siblings().find("input"));
		if ($(this).is(':checked') && $(this).parent().siblings().find("input").is(':checked')) {
			console.log("yes");
			$(this).parent().siblings('input:submit').attr('disabled', false);
		} else {//console.log($(this).parent().siblings());
			$(this).parent().siblings('input:submit').attr('disabled', true);
		}
	});
	
    

	//меню-бургер
	var burger = $('.js-burger'),
		menu = $('.menu-mobile'),
		close = $('.js-notifs-close'),
		notifsTop = $('.header__notifications__inner');
	bodyOverflow = $('body');//добавил верстальщик 14.07.18


	burger.click(function () {
		notifsTop.toggleClass('hidden');
		burger.toggleClass("active");
		menu.toggleClass("opened");
		bodyOverflow.toggleClass("overflowYhidden");//добавил верстальщик 14.07.18
	});
	close.click(function () {
		notifsTop.addClass('closed');
	});


	//мобильная версия панели-настроек
	var mobileMenu = $('.js-mobile-menu'); console.log(mobileMenu.parent());
	mobileMenu.click(function () {
		var panels = $('.menu-mobile__panels'),
			list = $('.menu-mobile__list'),
			panelsBlock = $('.menu-mobile__panels__block'),
			langPanel = $('.mobile-language'),
			copyright = $('.menu-mobile__copyright');

		$(this).toggleClass("active");
		panelsBlock.removeClass("active");

		var name = $(this).data("name");

		$('.' + name).addClass('active');
		mobileMenu.not(this).each(function () {
			$(this).removeClass('active');
		});
		if (mobileMenu.hasClass('active')) {
			list.addClass('hide');
			panels.removeClass('hide');
			copyright.addClass("absolute");

		} else {
			list.removeClass('hide');
			panels.addClass('hide');
			copyright.removeClass("absolute");
		}

		if (name = 'mobile-search') {
			setTimeout(function () {
				$('.form--mobile-search').focus();
			}, 1);
		}

		if (name = 'mobile-language') {
			if ((langPanel.find('li').length > 5) && ($(window).height() < 640)) {
				copyright.removeClass("absolute");
			}
		}
	});


	//пункт Внимание в мобильной версии /можно заменить на аккордеон/
	$('.js-call-notifs').click(function (e) {
		e.preventDefault();
		var notifs = $('.mobile-notifs'),
			notifsList = $('.mobile-notifs-list'),
			notifsListHeight = notifsList.innerHeight();

		$(this).toggleClass('active');
		notifs.toggleClass('opened');

		if (notifs.hasClass('opened')) {
			notifs.css('height', notifsListHeight);

		} else {
			notifs.css('height', 0);
		}
	});


	//закрывашка для мобильного поиска
	$('.form--mobile-search').on("input", function () {
		if ($(this).val().length > 0) {
			$('.js-clear-search').addClass('show');
		} else $('.js-clear-search').removeClass('show');

	});
	$('.js-clear-search').click(function () {
		$('.form--mobile-search').val('');
		$(this).removeClass('show');
	});


	//слайдер на главной странице
	/*
	у ссылки в слайдере на событие есть data-ticket, который тянется к кнопке Купить под слайдером
	 */
	var mainSliderSets = {
		autoplay: true,
		autoplaySpeed: 3000,
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		centerMode: true,
		variableWidth: true,
		dots: true,
		arrows: false,
		responsive: [
			{
				breakpoint: 848,
				settings: {
					variableWidth: false,
					centerMode: true,
					centerPadding: '0px'
				}
			}
		]
	};
	var sliderWithArrowsSets = {
		autoplay: true,
		autoplaySpeed: 3000,
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		centerMode: true,
		variableWidth: true,
		dots: true,
		arrows: true,
		responsive: [
			{
				breakpoint: 848,
				settings: {
					variableWidth: false,
					centerMode: true,
					centerPadding: '0px',
					arrows: false
				}
			}
		]
	};
	var sliderWithCollectionItem = {
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		centerMode: false,
		variableWidth: false,
		dots: true,
		arrows: true,
		fade: true,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					// centerMode: true,
					// centerPadding: '0px',
					arrows: false
				}
			}
		]
	};
	var sliderFotos = {
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		centerMode: false,
		variableWidth: false,
		dots: true,
		arrows: false,
		fade: true
		// responsive: [
		//     {
		//         breakpoint: 1024,
		//         settings: {
		//             // centerMode: true,
		//             // centerPadding: '0px',
		//             arrows: false
		//         }
		//     }
		// ]
	};

	// новый вид слайдер, придуманный бэкендером для вывода единичной картинки без каких-либо средств листания
	var sliderOnePicture = {
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		centerMode: false,
		variableWidth: false,
		dots: false,
		arrows: false,
		fade: true
		// responsive: [
		//     {
		//         breakpoint: 1024,
		//         settings: {
		//             // centerMode: true,
		//             // centerPadding: '0px',
		//             arrows: false
		//         }
		//     }
		// ]
	};

	function initSlider(initClass, sliderSets, dataAttr) {
		var mainSlider = $(initClass).slick(sliderSets).on('afterChange', function (event, slick, currentSlide, nextSlide) {
			var attr = $(slick.$slides.get(currentSlide)).data(dataAttr);

			$('.slider-btn-buy').attr('href', attr);
			$('.js-slider-title').html(attr);
		});
		var attr = $('.slick-slide.slick-current.slick-active').data(dataAttr);

		$('.slider-btn-buy').attr('href', attr);
		//код изменен бэкендером по следующей причине:
		//при присвоении значения переменной attr, с целью дальнейшего использования его, как подписи слайда и надписи на кнопке "Купить билет"
		//предполагалось, что на странице присутствует только один слайдер и, как следствие, только один элемент класса .slick-slide.slick-current.slick-active
		//а когда слайдеров больше, то надо искать строго брата того элемента .js-slider-title, в который пишем текст
		$('.js-slider-title').html($(this).parents('.main-slider__inner').find('.slick-slide.slick-current.slick-active').data(dataAttr));
	}
	initSlider('.js-main-slider', mainSliderSets, 'ticket');
	//$('.js-main-slider').slick('slickGoTo',Math.ceil( ($('.js-main-slider .slick-track').children().length-4) / 2 )-1);
	initSlider('.js-slider-with-arrows', sliderWithArrowsSets, 'title');
	initSlider('.js-slider-fotos', sliderFotos, 'title');
	initSlider('.js-slider-one-picture', sliderOnePicture, 'title');

	function adaptiveSlider() {
		var height = $(window).height();
		$('.js-slider-collection-item .slick-slide').css('height', height - 55);
		$('.js-call-dz').click(function (e) {
			e.preventDefault();

			var dzLink = $(this).attr('data-dz');

			// console.log(dzLink);
			$('.js-dz-iframe').attr('src', dzLink);
			$('.dz-iframe').addClass('open');
		});
		$('.js-close-dz').click(function (e) {
			$('.js-dz-iframe').attr('src', '');
			$('.dz-iframe').removeClass('open');
		});
	}
	initSlider('.js-slider-collection-item', sliderWithCollectionItem, 'title');
	adaptiveSlider();


	//кнопки переключеня контентом в секции, и в афише кнопка фильтра/добавление window.history
	function contentControl() {
		$('.js-content-control').each(function () {
			var block = $(this),
				btnFirst = $(this).find('.btn-first');

			$(this).find('.js-content-control-btn').click(function (e) {
				var blockName = $(this).attr('data-target');

				window.history.pushState('', 'Title', blockName);

				//если ссылка пуста
				if ($(this).attr('href') == '') {
					e.preventDefault();
				}

				var width = $(this).outerWidth(),
					widthWindow = $(window).width(),
					offsetLeft = $(this).offset().left,
					offsetRight = (widthWindow - (offsetLeft + width)),
					scroller = block.find('.scroller');

				if (offsetRight < 30) {
					scroller.animate({ scrollLeft: '+=' + (-offsetRight + widthWindow / 4) }, 300);
				}
				if (offsetLeft < 30) {
					scroller.animate({ scrollLeft: '-=' + (-offsetLeft + widthWindow / 4) }, 300);
				}

				$(this).addClass('active');
				block.find('.js-content-control-btn').not(this).each(function () {
					$(this).removeClass('active');


					//на странице с афишей фильтр доступен всегда
					if (!$('body').hasClass('afisha-page')) {
						$('.js-hidden-filter').removeClass('opened');
					}

					//для ситуации двух ul меню, сборс active
					$(this).parent().removeClass('active');
				});
				checkIfFirstIsActive();
				$grid.masonry();
			});

			function checkIfFirstIsActive() {
				if (!btnFirst.hasClass('active') && $(window).width() < 1024) {
					btnFirst.addClass('btn--np');
				} else btnFirst.removeClass('btn--np');
			}

			checkIfFirstIsActive();
		});
	}
	contentControl();

	$('.js-call-filter').click(function (e) {
		e.preventDefault();
		$('.js-hidden-filter').addClass('opened');
	});

	//кнопки категорий в секции афиша
	$('.js-categories-control-btn').click(function () {
		// e.preventDefault();
		if (!$(this).hasClass('btn--unavailable')) {
			$(this).toggleClass('active');
		}
	});


	//трансформация списка в аккордион в мобиле
	function accordion() {
		var content = $('.accordion--mobile .accordion-content');

		if ($(window).width() < 1024) {
			$('.js-accordion--mobile').vmenuModule({
				Speed: 400,
				autostart: false,
				autohide: true
			});
			content.removeClass('display');
		}
		else {
			content.addClass('display');
		}
		$('.js-accordion').vmenuModule({
			Speed: 400,
			autostart: false,
			autohide: true
		});

	}
	accordion();


	//переключения между двумя списками кнопок управления контентом
	function headerControl() {
		$('.section__header__controls').each(function () {
			var first = $(this).find('.first'),
				second = $(this).find('.second'),
				firstWidth = first.width(),
				secondWidth = second.width();

			$(this).find('.js-control-menu').clickToggle(function () {
				first.css('width', firstWidth);
				setTimeout(function () {
					first.css('width', 0);
					second.addClass('full-width');
					setTimeout(function () {
						second.css('width', secondWidth);
					}, 100);
				}, 100);
			}, function () {
				first.css('width', firstWidth);
				setTimeout(function () {
					second.css('width', 0);
					second.addClass('null-width');
				}, 100);
			});
		});
	}
	headerControl();


	//слайдер афиша с адаптивом
	var multipleItemsSliderSets = {
		infinite: false,
		slidesToShow: 1,
		slidesToScroll: 1,
		centerMode: true,
		variableWidth: true,
		dots: false,
		arrows: true,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					arrows: true,
				}
			}
		]
	};

	$('.js-multiple-items-slider').each(function () {console.log('.js-multiple-items-slider');
		$(this).slick(multipleItemsSliderSets);
	});

	function multipleItemsSliderSettings() {

		$('.js-multiple-items-slider').each(function () {
			var $this = $(this);

			function unwrap() {
				$this.slick('unslick');
				$this.find('.slide .item').unwrap();
				$this.find('.slide').remove();
			}
			function reset(num) {
				var divs = $this.find('.item');
				for (var i = 0; i < divs.length; i += num) {
					divs.slice(i, i + num).wrapAll("<div class='slide'></div>");
				}
			}
			if ($(window).width() < 1280) {
				unwrap();
				reset(3);
				$(this).slick(multipleItemsSliderSets);
			}
			if ($(window).width() >= 1280) {
				unwrap();
				reset(4);
				$(this).slick(multipleItemsSliderSets);
			}
			if ($(window).width() < 1024) {
				unwrap();
				reset(1);
				$(this).slick(multipleItemsSliderSets);
			}
		});
	}
	//multipleItemsSliderSettings();

	//код бэкендера для того, чтобы слайды, относящиеся к прошедшим событиям, бледнели и сдвигались влево
	$today = new Date();
	$today.setDate($today.getDate() - 1);
	$numToday = $today.valueOf() * 0.001; console.log($numToday);
	$max_actual_slide = 50;
	if ($("div").is(".js-bill")) { console.log("is"); } else { console.log("isn't"); }
	$('.js-bill .item--card').each(function () {
		if ($(this).attr('data-date') < $numToday) {//что раньше сегодняшнего дня, бледнеет
			$(this).css("opacity", "0.4");
		}
		if ($(this).attr('data-date') >= $numToday && +($(this).parent().attr("data-slick-index")) < $max_actual_slide) {//сдвигаем слайдер на первое из того, что сегодня или позже
			$max_actual_slide = +($(this).parent().attr("data-slick-index"));
		}
	});
	$('.js-bill').slick('slickGoTo', $max_actual_slide);

	//для видео
	function videoLoad() {
		$('video:not(#promovideo)').mediaelementplayer({
			features: ['']
		});
	}
	videoLoad();

	// $.get('content.html', function(data) {
	//     $(".test").html(data);
	//     call();
	// });

	// function call() {
	//     $('.click').click(function() {
	//         $(this).addClass('opened');
	//     });
	// }

	function tabs() {
		$('[data-toggle="tab"]').click(function (e) {
			e.preventDefault();
			var $this = $(this);
			var $grid = $('.js-grid').imagesLoaded(function () {
				$grid.masonry({
					// options

					itemSelector: '.grid-item',
					columnWidth: '.grid-sizer'
				});
			});

			function masonryForDesktop() {
				var $gridDesktop = $('.js-grid--desktop').imagesLoaded(function () {
					$gridDesktop.masonry({
						// options

						itemSelector: '.grid-item',
						columnWidth: '.grid-sizer'
					});

					if ($(window).width() < 1024) {
						$gridDesktop.masonry('destroy');
					} else $gridDesktop
				});
			}
			masonryForDesktop();

			if (!($this.hasClass('loaded'))) {

				var loadUrl = $this.attr('href'),
					target = $this.attr('data-target'),
					preloader = $this.closest('.section--tabs').find('.preloader--content');
				preloader.css('display', 'block');


				callAjaxContent(loadUrl, target, preloader);
				$this.addClass('loaded');
			}

			$this.tab('show');
		});
	}
	tabs();


	function callAjaxContent(loadUrl, target, preloader) {
		var div = $('.tab-pane__common-content');
		$.get(loadUrl, function (data) {


			$(target).find(div).html(data);
			accordion();
			videoLoad();
			// btnMoreText();
			masonryForDesktop();
			mapFloors();
			blindVersion();


		}).done(function () {
			$(preloader).css('display', 'none');
		}).fail(function () {
			$(target).html('Что-то пошло не так...');
			$(preloader).css('display', 'none');
		}).always(function () {

		});

	}



	//загружаем contents в табы / загружаем по ссылке
	var array = ['#friends', '#tours', '#departments', '#first-floor', '#second-floor', 'gallery-2-floor', 'gallery-3-floor', '#expositions_main', '#buildings'];
	$(function () {
		$('.section--tabs').each(function () {
			var preloader = $(this).closest('.section--tabs').find('.preloader--content');

			$(this).find('[data-toggle="tab"]').each(function () {
				var target = $(this).attr('data-target'),
					hash = window.location.hash;

				if (~array.indexOf(target) && target == hash) {
					// var loadUrl = '../artmuseum/raw/' + window.location.hash.slice(1) + '.html',
					var loadUrl = '/raw/' + window.location.hash.slice(1) + '.html',
						div = $('[data-target="' + target + '"]'),
						section = div.parents('.section'),
						num = 40; //это для воздуха
					target = hash;


					callAjaxContent(loadUrl, target, preloader);


					$(target).parents('.tab-content').find('.tab-pane').removeClass('active');

					// $('.js-content-control-btn').removeClass('active');
					div.parents('ul').find('.js-content-control-btn').removeClass('active');

					div.addClass('active');
					$(target).addClass('active');
					setTimeout(function () {
						$('html,body').animate({
							scrollTop: section.offset().top - num
						}, 'slow');
					}, 100)

				}
				else {
					if ($(this).hasClass('active') && $(this).attr('href') != "") {
						loadUrl = $(this).attr('href');
						target = $(this).attr('data-target');

						callAjaxContent(loadUrl, target, preloader);
					}
				}
			});
		});
	});

	//
	$(function () {
		$('.js-select').each(function () {
			$(this).select2({
				minimumResultsForSearch: Infinity,
				placeholder: $(this).attr('data-placeholder'),
				tags: true
			})

		});

	});
	//$( '.section--with-filters__filter__inner' ).scroll(function() {
	//    $(".js-select").select2("close");
	//});




	//подменю у главного меню
	$(function () {
		var menu = $('.js-main-menu-hover'),
			under = $('.main-menu-under'),
			dropdown = $('.js-dropdown'),
			hoverInner = $('.hover--inner'),
			dropdownInner = $('.dropdown--inner'),
			headerControls = $('.header__controls'),
			h = 0;

		function reset() {
			under.removeClass('visible');
			dropdown.removeClass('visible');
			dropdownInner.removeClass('visible');
			menu.removeClass('active');
			h = 0;
		}

		menu.on("mouseenter", function () {
			var $this = $(this),
				num = $this.attr('data-dropdown');

			if (num != undefined) {
				var width = $this.offset(),
					id = $('#' + num);

				$this.addClass('active');
				dropdown.removeClass('visible');

				id.addClass('visible').css('left', width.left);
				under.addClass('visible');
				under.css('height', id.height());

				$(".main-controls__button").removeClass('active');
				$(".main-controls-section-block").removeClass('opened');

				h = id.height();
				console.log(h);
			} else {
				$this.removeClass('active');
				reset();
			}
		});



		menu.on("mouseout", function () {
			menu.removeClass('active');
		});

		// код скрипта изменен бэкендером!
		//это также потребовало внесения изменений в верстку:
		//класс hover--inner теперь присвоен не <a>, а <li>,
		//зато теперь меню можно наращивать сколько угодно,
		//хотя, возможно, фронтендер напишет это более грамотно
		hoverInner.on("mouseenter", function () {
			var thisHeight = 0;
			$(this).children('ul').addClass('visible');


			if ($(this).children('ul').height() > h) {
				under.css('height', $(this).children('ul').height());
			}

		});
		hoverInner.on("mouseleave", function () {
			console.log($(this).attr("id"));
			$(this).children('ul').removeClass('visible');
		});
		under.on("mouseleave", function () {
			reset();
		});
		headerControls.on("mouseenter", function () {
			reset();
		});
	});

	var $grid = $('.js-grid').imagesLoaded(function () {
		$grid.masonry({
			// options

			itemSelector: '.grid-item',
			columnWidth: '.grid-sizer'
		});
	});

	function masonryForDesktop() {
		var $gridDesktop = $('.js-grid--desktop').imagesLoaded(function () {
			$gridDesktop.masonry({
				// options

				itemSelector: '.grid-item',
				columnWidth: '.grid-sizer'
			});

			if ($(window).width() < 1024) {
				$gridDesktop.masonry('destroy');
			} else $gridDesktop
		});
	}
	masonryForDesktop();


	function blindVersion() {
		var html = $("html"),
			body = $("body"),
			img = $("img"),

			contrast = $(".js-contrast-version"),
			normal = $(".js-normal-version"),
			font = $(".js-font"),

			contrastCookie = getCookie("contrast"),
			imgCookie = getCookie("img"),
			fontCookie = getCookie("font");

		function show() { $("img").show(); $("svg").show(); $(".video-container").show();  $(".video-preview").show();}
		function hide() { $("svg").hide(); $("img").hide(); $(".video-container").hide(); $(".video-preview").hide(); }

		contrast.on('click', function () {
			html.addClass('contrast');
			$(this).addClass('active');
			normal.removeClass('active');
			hide();
			setCookie("contrast", "on");

			$grid.masonry();
		});
		normal.on('click', function () {
			html.removeClass('contrast');
			$(this).addClass('active');
			contrast.removeClass('active');
			show();
			setCookie("contrast", "off");

			$grid.masonry();
		});

		if (contrastCookie == 'on') {
			contrast.addClass('active');
			normal.removeClass('active');
			html.addClass('contrast');
			// img.hide();
			hide();
			$grid.masonry();
		} else {
			contrast.removeClass('active');
			normal.addClass('active');
			html.removeClass('contrast');
			show();
			$grid.masonry();
		}

	};
	blindVersion();

	function adaptiveText() {

		var textAdditional = $('.text-additional'),
			textAdditionalHtml = textAdditional.html(),
			textMain = $('.js-text-main'),
			textMainHtml = textMain.html();

		if ($('.additional-text').length > 0) {
			if ($(window).width() < 1024) {
				if ($('.add').length < 1) {
					textMain.append('<div class="add">' + textAdditionalHtml + '</div>');
					textMain.children('p,div').not(':first-child').wrapAll('<div class="wrapit" />');
					textMain.children('p:first-child').append('<button class="underline-text more-text color-warm-grey-two js-btn-more-text"><span class="text">ЧИТАТЬ ДАЛЬШЕ</span></button>');
				}
				$('.js-btn-more-text').on('click', function () {
					$('.wrapit').addClass('show');
					$(this).addClass('hide');
				});
			}
			if ($(window).width() >= 1024) {
				textMain.children('.wrapit').children().unwrap();
				$('.add').remove();
				$('.js-btn-more-text').remove();
			}
		}

	}

	adaptiveText();

	var lightGallery = $(".js-gallery").lightGallery({
		selector: '.js-gallery-item',
		counter: false,
		download: false,
		pager: true,
		actualSize: false,
		zoom: false,
		thumbnail: false,
		share: false,
		fullScreen: false,
		autoplayControls: false,
		enableSwipe: false,
		enableDrag: true,
		hideBarsDelay: 999999
	});

	function adaptiveLightGallery() {
		if ($(window).width() < 580) {

			function logic() {
				$(".lg-sub-html").wrapInner('<div class="lg-sub-html__inner js-lg-info"></div>');
				$(".lg-sub-html").prepend('<div class="lg-sub-html__badge js-lg-info-call">i</div>');
				$(".lg-sub-html__inner").prepend('<div class="close js-lg-info-close"></div><div class="lg-sub-html__head">Информация</div> ');
				$('.js-lg-info-call').on('click', function () {
					$('.js-lg-info').addClass('show');
					$('.lg-outer').addClass('lg-outer-back');
				});
				$('.js-lg-info-close').on('click', function () {
					$('.js-lg-info').removeClass('show');
					$('.lg-outer').removeClass('lg-outer-back');
				});
			}
			lightGallery.on('onAferAppendSlide.lg', function () {
				if ($('.js-lg-info').length < 1) {
					logic();
				}
			});
			lightGallery.on('onAfterSlide.lg', function () {
				if ($('.js-lg-info').length < 1) {
					logic();
				}
			});
		}
	}
	adaptiveLightGallery();

	//кнопка вернуться назад
	$('.js-go-to-prev').on("click", function (e) {
		e.preventDefault();
		window.history.go(-1);
	});


	//выбираем случайный фон для страницы 404, сам объект pageNotFoundObj находится на странице
	function setRandomBackground() {
		if (typeof pageNotFoundObj != "undefined") {
			var randomNum = getRandomInt(0, pageNotFoundObj.length - 1);
			console.log(pageNotFoundObj[randomNum].pic);
			$('.js-full-page-background').css('background-image', 'url(' + pageNotFoundObj[randomNum].pic + ')');
			$('.js-full-page-background-title').html(pageNotFoundObj[randomNum].desc);
		}
	}
	setRandomBackground();


	//кнопка показать больше текста
	function btnMoreText() {
		// $(".js-more-text").on('click',  function(){
		$(document).on('click', '.js-more-text', function () {
			console.log("btn");
			$(this).prev(".js-additional-text").slideToggle(400);
			$(this).toggleClass('no-underline');
			$(this).find('.icon').toggleClass('show');
			buf = $(this).attr("rel");
			$(this).attr("rel", $(this).find('.text').text());
			$(this).children('.text').text(buf);
		});
	}
	btnMoreText();


	//вызов попапа с описанием в мобильной версии на странице предмета коллекции
	$(".js-popup-description-call").on("click", function () {
		$(this).next('.js-popup-description').addClass('open');
	});
	$(".js-popup-description-close").on("click", function () {
		$(this).parent('.js-popup-description').removeClass('open');
	});


	//плавный фокус на области со слайдером на странице предмета коллекции
	(function ($) {
		$(function () {
			var div = $('.slider--collection-item'),
				divHeight = div.height(),
				offset = div.offset(),
				windowPosition = $(window).scrollTop();

			$(window).scroll(function () {
				clearTimeout($.data(this, "scrollCheck"));
				windowPosition = $(window).scrollTop();
				$.data(this, "scrollCheck", setTimeout(function () {
					if ((div.length > 0) && (windowPosition > offset.top - 100) && (windowPosition < offset.top + divHeight / 4)) {
						$("html, body").animate({ scrollTop: offset.top });
					}
				}, 550));
			});
		});
	})(jQuery);


	//логика работы с картой этажей
	function mapFloors() {
		$('.floor-map').each(function () {
			var hall = $('.map-hall'),
				link = $('.map-link'),
				num = $('.num-link'),
				linksBlock = $('.map-links'),
				hallsBlock = $('.map-svg'),
				html = $('html');

			function linkChangeColor(id, $this) {

				$('.map-hall[data-hall="' + id + '"]').addClass('hover').addClass('active');
				$this.addClass('hover');
				$this.addClass('active');
			}

			function hallChangeColor(id, $this) {
				// console.log(id);
				linksBlock.find('#' + id).addClass('hover').addClass('active');
				$this.addClass('hover');
				$this.addClass('active');
			}

			function mapChangeColorReset() {
				hall.removeClass('hover').removeClass('active');
				link.removeClass('hover').removeClass('active');
			}

			if (html.hasAnyClass('ios', 'mobile', 'android')) {
				link.click(function (e) {
					if ($(this).hasClass('active') == true) {
						return true
					} else {
						e.preventDefault();
						mapChangeColorReset();
						var $this = $(this),
							id = $this.attr('id');

						linkChangeColor(id, $this);
					}
				});
				hall.click(function (e) {
					if ($(this).hasClass('active') == true) {
						return true
					} else {
						e.preventDefault();
						mapChangeColorReset();
						var $this = $(this),
							id = $this.attr('data-hall');

						hallChangeColor(id, $this);
					}
				});
			} else {
				link.hover(
					function () {
						var $this = $(this),
							id = $this.attr('id');

						linkChangeColor(id, $this);

					}, function () {
						mapChangeColorReset();
					}
				);
				num.hover(
					function () {
						var $this = $(this),
							id = $this.attr('data-num');

						$('#' + id).addClass('hover');

						linkChangeColor(id, $this);
					}, function () {

					}
				);
				hall.hover(
					function () {
						var $this = $(this),
							id = $this.attr('data-hall');
						hallChangeColor(id, $this);
					}, function () {
						mapChangeColorReset();
					}
				);
			}
		})
	}





	//логика работы с кварталом, объект objQuarter на странице
	function mapQuarter() {
		var building = $('.quarter-building'),
			svg = $('.quarter-map'),
			popup = $('.quarter-popup'),
			name = $('.quarter-popup__name'),
			description = $('.quarter-popup__desc'),
			html = $('html');


		if (html.hasAnyClass('ios', 'mobile', 'android')) {
			building.click(function (e) {
				if ($(this).hasClass('active') == true) {
					return true
				} else {
					building.removeClass('active').removeClass('filled');
					e.preventDefault();
					var $this = $(this),
						svgOffsetTop = svg.offset().top,
						id = $this.attr('data-quarter');
					var offsetLeft = $this.position().left;
					var offsetTop = $this.position().top;
					console.log(objQuarter[id].name, $this);
					$this.addClass('filled');
					name.html(objQuarter[id].name);
					description.html(objQuarter[id].description);
					var height = popup.innerHeight();
					popup.css({ "top": offsetTop - svgOffsetTop - height + 50, "left": offsetLeft - 150 }).addClass('visible');

					$this.addClass('active');
				}
			});
		} else {
			building.hover(
				function () {
					var $this = $(this),
						svgOffsetTop = svg.offset().top,
						id = $this.attr('data-quarter');

					// linkChangeColor(id, $this);
					var offsetLeft = $this.position().left;
					var offsetTop = $this.position().top;
					console.log(objQuarter[id].name, $this);
					$this.addClass('filled');
					name.html(objQuarter[id].name);
					description.html(objQuarter[id].description);
					var height = popup.innerHeight();
					popup.css({ "top": offsetTop - svgOffsetTop - height + 50, "left": offsetLeft - 150 }).addClass('visible');

				}, function () {
					popup.removeClass('visible');
					building.removeClass('filled');
				}
			);
		}
	}
	mapQuarter();


	var arrResult = [];
	/* $('.form-search').on('submit', function (e) {
			 e.preventDefault();
			 var val = $(this).find('input').val();

			 arrResult.push(val);

			 search('/php/search.php');

			 notifsTop.removeClass('hidden');
			 burger.removeClass("active");
			 menu.removeClass("opened");


			 //console.log(arrResult);
	 });*/

	function search(loadUrl, target, preloader) {
		var div = $('.search--section');
		$.get(loadUrl, { lang: "ru", needle: arrResult[0] },
			function (data) {


				div.html(data);
				// tabs();
				$('[data-toggle="tab"]').click(function (e) {
					$(this).tab('show');
				});
				contentControl();

				//searchResultsMore();
				$('.search-val').html(arrResult[0]);


			}).done(function () {
				$(preloader).css('display', 'none');
			}).fail(function () {
				$(target).html('Что-то пошло не так...');
				$(preloader).css('display', 'none');
			}).always(function () {

			});

	}


	function searchResultsMore() {
		var item = $(".search-results li"),
			btn = $(".js-btn-more-items"),

			num = 20;

		if (item.length <= num) {
			btn.hide();
		}

		item.slice(0, num).show();

		var clicks = num / 2;

		btn.click(function (e) {
			e.preventDefault();

			clicks = clicks * 2; //
			$(".search-results li:hidden").slice(0, clicks).show().addClass("animated slideInUp");
			if ($(".search-results li:hidden").length == 0) {
				$(this).hide();
			}

		});
	};

	$(function () {
		var wrap = $('.js-marquee-wrap'),
			block = $('.js-marquee'),
			blockWidth = block.width(),
			wrapWidth = wrap.width();
		console.log(blockWidth, wrapWidth);
		if (blockWidth >= wrapWidth) {
			console.log('ads');
			wrap.addClass('marquee-on');
			block.marquee({
				//speed in milliseconds of the marquee
				duration: 30000,
				//gap in pixels between the tickers
				gap: 400,
				//time in milliseconds before the marquee will start animating
				delayBeforeStart: 500,
				//'left' or 'right'
				direction: 'left',
				pauseOnHover: true,
				startVisible: true,
				//true or false - should the marquee be duplicated to show an effect of continues flow
				duplicated: true
			});
		}
	});

	//текст кнопок для шеринга
	$('.ya-share2__item_service_facebook .ya-share2__title').html('Поделиться в Facebook');
	$('.ya-share2__item_service_vkontakte .ya-share2__title').html('Поделиться в Vk.com');
	$('.ya-share2__item_service_twitter .ya-share2__title').html('Поделиться в Twitter');

	$('.js-btn-share').click(function (e) {
		e.stopPropagation(); console.log("share");
		$(this).next('.js-btn-share-block').toggleClass('open');
		$(this).toggleClass('color-greyish-brown');
	});

	//определяем размеры картинок лого партнеров
	$('.js-pics-count').each(function () {
		var $this = $(this).find('.logo-partner');

		if ($this.length > 1) {
			$this.addClass('logo-partner--several');
		}
	});

	//правильный пересчет функций на ресайз
	var resizeFn = debounce(function () {
		accordion();
		adaptiveText();
		multipleItemsSliderSettings();
		masonryForDesktop();
		console.log('Ресайз окна, слайдер встал на место');
	}, 300);


	//resizeFn();

	$(window).on("resize", resizeFn);
	//$(document).ready(resizeFn);
	//$(document).on("page:load", resizeFn);
	//$(window).load(resizeFn);

});

/* Для страницы друзья музея */
$('.cards-full-info').next().hide();
$('.cards-full-info').click(function () {
	$(this).next().slideToggle();
	$('.cards-full-info').not(this).next().stop(true, true).slideUp();
});

$(".menu-mobile__list li a").one("click", false);
$(".hidden-submenu li a").trigger("click");

/* Скрипт для кнопки, которая скрывает следующий за ним блок */
$('.custom-filter-btn').next().hide();

$('.custom-filter-btn').click(function () {
	$(this).next().toggle();
	$('.custom-filter-btn').not(this).next().stop(true, true).slideUp();
	$(this).toggleClass("opened");
});

//для popup с видео 
$('.popup-video').magnificPopup({
  type: 'iframe',
  mainClass: 'mfp-fade',
  removalDelay: 160,
  preloader: false,

  fixedContentPos: false
});
jQuery(window).on('load', function(){
    jQuery(window).resize();
});
