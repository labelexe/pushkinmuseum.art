$(document).ready(function() {

	//задаем границы интервала, который видим, когда на страницу только перешли
	var billInterval = 0; //на сколько месяцев вперед хотим видеть события
console.log($(".section--afisha .scroller--p ul li:first-child a").attr("id"));
	var toggle = $(".section--afisha .scroller--p ul li:first-child a").attr("id");

	var day0, month0, year0, day1, month1, year1, building;    

	var selectDay = $("#select_day");
    	selectMonthYear = $("#select_month_year");
        selectMonth = $("#select_month");
		$("#wrapper_month").hide();
		selectMonth.prop("disabled", true);
        selectYear = $("#select_year");
		$("#wrapper_year").hide();
		selectYear.prop("disabled", true);

		if ($("div").is("#building_id")) {
			building = $("#building_id").text();
			$(".js-content-control-btn").removeClass("active");
			billInterval = 1;
		}
		selectBuilding = $("#select_building");
		needless_buildings = $("#needless_buildings").text();
    var categories_list;
		if ($("div").is("#event_type_id")) {
			categories_list = $("#event_type_id").text();console.log(categories_list);
			$(".js-content-control-btn").removeClass("active");
			billInterval = 1;
		}
	var keywords;
		if ($("div").is("#keywords")) {
			keywords = $("#keywords").text();
			toggle = "plus1minus2";
		}
	console.log("k="+keywords);
	console.log(toggle);
        console.log(day0);
         console.log(month0);
         console.log(year0);
         console.log(day1);
         console.log(month1);
         console.log(year1);
         console.log(building);
		console.log(needless_buildings);
         console.log(categories_list);

	//асинхронная функция вывода набора блоков-событий, сформированного скриптом events_slick.php, в <div id="bill">
    function loadEventsList() {
		
		$("#bill").load("/events/blocks/events_expectation.php");

        var url_param = window.location.search;
        if (url_param.indexOf("lang=") >= 0) {
            lang = url_param.substr(url_param.indexOf("lang=") + 5, 2);
        } else {
            lang = "ru";
        }

		var layout;
		if ($("#bill").hasClass('masonry_wrapper')) layout = "masonry";
		if ($("#bill").hasClass('slider_wrapper')) layout = "slider";
		
        whatLoad = toggle == "" ? "/events/blocks/events_query.php" : "/events/blocks/events_list.php";
         
        $("#bill").load(whatLoad, {
             	filter: toggle,
                day0: day0,
                month0: month0,
                year0: year0,
                day1: day1,
                month1: month1,
                year1: year1,
                building: building,
				needless_buildings: needless_buildings,
                categories: categories_list,
				keywords: keywords,
                lang: lang,
				layout: layout
            },

            function(response, status, xhr) {

				switch(layout){
					case 'masonry':
                         $('.js-grid').masonry({
                              itemSelector: '.grid-item',
                              columnWidth: '.grid-sizer'
                         }).imagesLoaded(function() {
                              		$('.js-grid').masonry('reload');
                              });
						 break;
					case 'slider':
                          var bill = {
                              infinite: false,
                              slidesToShow: 1,
                              slidesToScroll: 1,
                              centerMode: true,
                              variableWidth: true,
                              dots: false,
                              arrows: true
                          };

                          $('.js-multiple-items-slider').each(function() {
                              $(this).slick(bill);
                          });
                          
                          if (keywords == 11154){console.log(keywords);
                             $today = new Date();
                             $today.setDate($today.getDate()-1);
                             $numToday = $today.valueOf() * 0.001;
                             $max_actual_slide = 50;
                             $('.js-bill .item--card').each(function(){console.log($(this).attr('class')+" "+$numToday);
                                 if ($(this).attr('data-date') < $numToday){//что раньше сегодняшнего дня, бледнеет
                                     $(this).css("opacity", "0.4");
                                 }
                                 if ($(this).attr('data-date') >= $numToday && +($(this).parent().attr("data-slick-index")) < $max_actual_slide){//сдвигаем слайдер на первое из того, что сегодня или позже
                                     $max_actual_slide = +($(this).parent().attr("data-slick-index"));
                                 }
                             });
                             $('.js-bill').slick('slickGoTo', $max_actual_slide);		
                          }
                          
                         console.log(toggle); 
            	}
			}
        );
    }

	//формирует массив из дат заданного месяца с днями недели 
	//(набор данных для <select id="select_day">, который будет меняться соответственно значению <select id="select_month_year">)
    function changeSelectDays(month) {
        var now = new Date(); now.setHours(0, 0, 0, 0);
			
		//список начинается с первого дня заданного месяца, но если это текущий месяц, то список начинается с сегодняшнего числа
        firstDay = new Date(now.getFullYear(), month, 1, 0, 0, 0, 0); if (now > firstDay) firstDay = now;
		//и заканчивается последним днем заданного месяца
        lastDay = new Date(now.getFullYear(), +month + 1, 0, 0, 0, 0, 0);
        //формат вывода дат в списке: число и день недели
		var days_options = {
            day: 'numeric',
            weekday: 'short'
        }
		
		//заводим массив и, перебирая дни от первого до последнего, заполняем его объектами вида {значение списка=число; строка списка=число+день недели}
		var days = [];
		days.push({
                id: 0,
                text: "---"
            });
        d = new Date();
                                       
        for (d = firstDay; d <= lastDay; d.setDate(d.getDate() + 1)) {
                                       
            days.push({
                id: d.getDate(),
                text: d.toLocaleString("ru", days_options)
            });
        }

        return days;

    }

    //формирует массив из дат заданного месяца заданного года с днями недели 
	//(набор данных для <select id="select_day">, который будет меняться соответственно значениям <select id="select_month"> и <select id="select_year">)
    function changeSelectDaysArchive(month, year) {
        	
		//список начинается с первого дня заданного месяца
        firstDay = new Date(year, month, 1, 0, 0, 0, 0);
		//и заканчивается последним днем заданного месяца
        lastDay = new Date(year, +month + 1, 0, 0, 0, 0, 0);

        //формат вывода дат в списке: число и день недели
		var days_options = {
            day: 'numeric',
            weekday: 'short'
        }
		
		//заводим массив и, перебирая дни от первого до последнего, заполняем его объектами вида {значение списка=число; строка списка=число+день недели}
		var days = [];
		days.push({
                id: 0,
                text: "---"
            });
        d = new Date();
                                       
        for (d = firstDay; d <= lastDay; d.setDate(d.getDate() + 1)) {
                                       
            days.push({
                id: d.getDate(),
                text: d.toLocaleString("ru", days_options)
            });
        }

        return days;

    }
                                       
    //вычисляет год: если номер месяца слишком большой (>11), значит, это следующий год                                   
    function calcYearByMonthYear(monthyear) {
        var d = new Date();
        y = d.getFullYear();
        if (monthyear > 11) y++;
        return y;
    }

	
    var pbl_Date0 = new Date(); //по умолчанию: начало интервала - сегодняшняя дата
	day0 = pbl_Date0.getDate();
    month0 = pbl_Date0.getMonth();
    year0 = pbl_Date0.getFullYear();

    pbl_Date1 = new Date();
	//pbl_Date1 = pbl_Date0;
    pbl_Date1.setFullYear(pbl_Date0.getFullYear(), pbl_Date0.getMonth() + billInterval); //конец интервала - через billInteval месяцев
    day1 = pbl_Date1.getDate();
    month1 = pbl_Date1.getMonth();
    year1 = pbl_Date1.getFullYear();

	//начальное заполнение <div id="bill">
	loadEventsList();
	
	//теперь приводим в порядок фильтры

    //сначала у невидимых селектов, которые видны, если нажать кнопку "Архив"

	var months = [];
	months.push({
                id: -1,
                text: "---"
            });
	array_current_month = new Date();//2018, 0, 1, 0, 0, 0, 0
	var months_options = {
        month: 'long',
    };
    for (i = 0; i <= 11; i++) {
        array_current_month.setMonth(i, 1);
        months.push({
            id: i,
            text: array_current_month.toLocaleString("ru", months_options)
        });
    }
    
    //делаем этот массив набором данных для <select id="select_month">
    selectMonth.select2({
        data: months
    });
                       
    var years = [];
    for (i = 1912; i <= year1; i++) {
        years.push({
            id: i,
            text: i
        });
    } 
    //делаем этот массив набором данных для <select id="select_year">
    selectYear.select2({
        data: years
    });                         

	//собираем массив месяцев с текущего до через ровно год
    var months_years = [];
    array_current_date = new Date(pbl_Date0.getFullYear(), pbl_Date0.getMonth(), 1, 0, 0, 0);
    var months_years_options = {
        month: 'long',
        year: 'numeric'
    };
    for (i = 0; i <= 11; i++) {
        array_current_date.setFullYear(pbl_Date0.getFullYear(), pbl_Date0.getMonth() + i);
        months_years.push({
            id: pbl_Date0.getMonth() + i, //array_current_date.getMonth(),
            text: array_current_date.toLocaleString("ru", months_years_options).slice(0, -3)
        });
    }

	//делаем этот массив набором данных для <select id="select_month_year">
    selectMonthYear.select2({
        data: months_years
    });

	//а <select id="select_day"> присваиваем набор данных в зависимости от текущего месяца
    selectDay.select2({
        data: changeSelectDays(selectMonthYear.val())
    });
	selectDay.val(new Date().getDate()).trigger("change");

	//когда будем выбирать месяц-год, набор данных <select id="select_day"> тоже будет меняться
    selectMonthYear.on("select2:select", function() {
        selectDay.empty();
        selectDay.select2({
            minimumResultsForSearch: Infinity,
            data: changeSelectDays(selectMonthYear.val())
        });
    });

	//когда будем выбирать месяц, набор данных <select id="select_day"> тоже будет меняться
    selectMonth.on("select2:select", function() {
        selectDay.empty();
        selectDay.select2({
            minimumResultsForSearch: Infinity,
            data: changeSelectDaysArchive(selectMonth.val(), selectYear.val())
        });
    });

	//когда будем выбирать год, набор данных <select id="select_day"> тоже будет меняться
    selectYear.on("select2:select", function() {
        selectDay.empty();
        selectDay.select2({
            minimumResultsForSearch: Infinity,
            data: changeSelectDaysArchive(selectMonth.val(), selectYear.val())
        });
    });


	//что происходит, когда пользователь выбирает фильтр
	//в зависимости от его выбора подготавливаем список параметров и с этими параметрами запускаем функцию заполнения <div id="bill">

	//один конкретный день и месяц
	//(они имеют один одинаковый класс, на него и вешаем событие)
	$(".one_date_select").on("select2:select", function() {
         toggle = "";
		//выбранная дата
        day0 = selectDay.val();
		if (selectMonthYear.prop("disabled")){
          	year0 = selectYear.val();
            month0 = selectMonth.val();
        } else {
          	year0 = calcYearByMonthYear(selectMonthYear.val());
            month0 = selectMonthYear.val()<12 ? selectMonthYear.val() : selectMonthYear.val()-12;
        }
		//параметром для events_slick.php всегда бывает интервал, здесь он схлопнулся: 
		if (day0 != 0){
            //до одного дня, если выбрано конкретное число
            day1 = day0;
            month1 = month0;
            year1 = year0;
		} else {
			if (month0 != -1){
                 //до всех дней месяца, если выбран 0
                 day0 = 1;
                 day1 = new Date(year0, +month0 + 1, 0, 0, 0, 0, 0).getDate();
				 month1 = month0;
        		 year1 = year0;
            } else {
				//и до всех дней года, если еще и месяц выбран -1
				day0 = 1;
				month0 = 0;
				day1 = 31;
				month1 = 11;
			}
		}
		console.log(day0+"."+month0+"."+year0+"-"+day1+"."+month1+"."+year1);
        loadEventsList();
    });

	//типы событий (обрабатывается множественный выбор из списка)
    $('div.section--with-filters__filter__categories').click(function() {
        categories_list = "";
        $('div.section--with-filters__filter__categories button.active').each(function(i, elem) {
            categories_list += $(elem).attr("id") + ",";
        });
        categories_list = categories_list.replace(/,$/, "");
        loadEventsList();
    });

	//здание (список однозначный)
    $("#select_building").on("select2:select", function() {
        building = selectBuilding.val();
        loadEventsList();
    });

    //кнопка "Сегодня" - интервал состоит из одного сегодняшнего дня
    $("#today").click(function() {
		$("#wrapper_month").hide();
		$("#wrapper_year").hide();
		$("#wrapper_month_year").show();
		selectMonth.prop("disabled", true);
		selectYear.prop("disabled", true);
		selectMonthYear.prop("disabled", false);

        var crntDate = new Date();
        selectMonthYear.val(crntDate.getMonth()).trigger("change");

		selectDay.empty();
        selectDay.select2({
            minimumResultsForSearch: Infinity,
            data: changeSelectDays(selectMonthYear.val())
        });
		selectDay.val(crntDate.getDate()).trigger("change");

        day0 = selectDay.val();
        month0 = selectMonthYear.val();
        day1 = day0;
        month1 = month0;
         
		toggle = "today";
         
        loadEventsList();
    });

    //кнопка "Завтра" - интервал состоит из одного завтрашнего дня
	$("#tomorrow").click(function() {
		$("#wrapper_month").hide();
		$("#wrapper_year").hide();
		$("#wrapper_month_year").show();
		selectMonth.prop("disabled", true);
		selectYear.prop("disabled", true);
		selectMonthYear.prop("disabled", false);

        var tmrwDate = new Date();
		tmrwDate.setDate(tmrwDate.getDate() + 1);console.log(tmrwDate);

        selectMonthYear.val(tmrwDate.getMonth()).trigger("change");

		selectDay.empty();
        selectDay.select2({
            minimumResultsForSearch: Infinity,
            data: changeSelectDays(selectMonthYear.val())
        });
		selectDay.val(tmrwDate.getDate()).trigger("change");
        
        day0 = selectDay.val();
        month0 = selectMonthYear.val();
        day1 = day0;
        month1 = month0;
         
        toggle = "tomorrow";
         
        loadEventsList();
    });

    //кнопка "На неделе" - от ближайшего назад понедельника до ближайшего вперед воскресенья
	$("#week").click(function() {
		$("#wrapper_month").hide();
		$("#wrapper_year").hide();
		$("#wrapper_month_year").show();
		selectMonth.prop("disabled", true);
		selectYear.prop("disabled", true);
		selectMonthYear.prop("disabled", false);

        var curDate = new Date();
        curWeekDay = curDate.getDay(); if (curWeekDay == 0) curDate.setDate(curDate.getDate() - 1);

        nearestMonday = new Date();
		nearestMonday.setDate(curDate.getDate() - curWeekDay + 1);

        nearestSunday = new Date();
        nearestSunday.setDate(curDate.getDate() + 7 - curWeekDay);

        day0 = nearestMonday.getDate();
        month0 = nearestMonday.getMonth();
		year0 = nearestMonday.getFullYear();
        day1 = nearestSunday.getDate();
        month1 = nearestSunday.getMonth();
		year0 = nearestSunday.getFullYear();
        
		toggle = "week";
         
        loadEventsList();
    });

    //кнопка "На выходных" - ближайшие суббота с воскресеньем
	$("#weekend").click(function() {
		$("#wrapper_month").hide();
		$("#wrapper_year").hide();
		$("#wrapper_month_year").show();
		selectMonth.prop("disabled", true);
		selectYear.prop("disabled", true);
		selectMonthYear.prop("disabled", false);

        var curDate = new Date();
        curWeekDay = curDate.getDay();
        nearestMonday = new Date();
        nearestSaturday = new Date();

        if (curWeekDay == 0) curDate.setDate(curDate.getDate() - 1);

        nearestMonday.setDate(curDate.getDate() + 6 - curWeekDay);
        nearestSaturday.setDate(curDate.getDate() + 7 - curWeekDay);

        day0 = nearestMonday.getDate();
        month0 = nearestMonday.getMonth();
		year0 = nearestMonday.getFullYear();
        day1 = nearestSaturday.getDate();
        month1 = nearestSaturday.getMonth();
		year1 = nearestSaturday.getFullYear();
                                    
        toggle = "weekend";                            
                                    
        loadEventsList();
    });

	//кнопка "Архив" - показываем селекты месяца и года
	$("#archive").click(function() {
        $("#wrapper_month").show();
		$("#wrapper_year").show();
		$("#wrapper_month_year").hide();
		selectMonth.prop("disabled", false);
		selectYear.prop("disabled", false);
		selectMonthYear.prop("disabled", true);

		var crntDate = new Date();
        selectMonth.val(crntDate.getMonth()).trigger("change");
		selectYear.val(crntDate.getFullYear()).trigger("change");

		selectDay.empty();
        selectDay.select2({
            minimumResultsForSearch: Infinity,
            data: changeSelectDaysArchive(selectMonth.val(), selectYear.val())
        });
		selectDay.val(crntDate.getDate()).trigger("change");
        //loadEventsList();
    });

	//кнопка "На 30 дней" - от сегодня до через 30 дней
	$("#this_month").click(function() {
		$("#wrapper_month").hide();
		$("#wrapper_year").hide();
		$("#wrapper_month_year").show();
		selectMonth.prop("disabled", true);
		selectYear.prop("disabled", true);
		selectMonthYear.prop("disabled", false);

        var crntDate = new Date();
        selectMonthYear.val(crntDate.getMonth()).trigger("change");
		var dateAfter30 = new Date();
		dateAfter30.setDate(dateAfter30.getDate() + 30);

		selectDay.empty();
        selectDay.select2({
            minimumResultsForSearch: Infinity,
            data: changeSelectDays(selectMonthYear.val())
        });
		selectDay.val(crntDate.getDate()).trigger("change");
        
        day0 = crntDate.getDate();
        month0 = crntDate.getMonth();
		year0 = crntDate.getFullYear();
        day1 = dateAfter30.getDate();
        month1 = dateAfter30.getMonth();
		year1 = dateAfter30.getFullYear();
         
        toggle = "this_month"; 
         
        loadEventsList();
    });

})