$(document).ready(function() {

    var selectCountry = $("#select_country");
    	selectAuthor = $("#select_author");
        selectPeriod = $("#select_period");
		selectCollector = $("#select_collector");
    var country, author, period, collector;
	var params = [];
	param_strs = location.search.replace(/^\?/,"").split("&");
	if (param_strs.length > 0 && param_strs[0] !== ""){
         for(i in param_strs){
             param_str = param_strs[i].split("=");
             params[param_str[0]] = param_str[1];//для множественного выбора - .split(",");
         };
	}

$(".js-collect-select").select2();

	//асинхронная функция вывода набора блоков про музейные предметы, сформированного скриптом objects_query.php, в <div class="section__inner padding">
    function loadObjectsList() {

        var url_param = window.location.search;
		var lang;
        if (url_param.indexOf("lang=") >= 0) {
            lang = url_param.substr(url_param.indexOf("lang=") + 5, 2);
        } else {
            lang = "ru";
        }

        $("#list").get("/data/fonds/objects_query.php", {
				limit: 6,
                lang: lang,
				type: $("#list").attr("attr-type"),
				country: country,
				author: author,

            },

            function(response, status, xhr) {
               $('.js-grid').masonry({
                    itemSelector: '.grid-item',
                    columnWidth: '.grid-sizer'
               }).imagesLoaded(function() {
               		$('.js-grid').masonry('reloadItems');
               });
			}
        );
    }

	if ($('a').is('.btn__show-more')){

         $('.grid-item').hide();
         $('.grid-item').slice(0, 9).show();

         $('.btn__show-more').on('click', function(e) {
             e.preventDefault();
             $('.grid-item:hidden').slice(0, 9).slideDown();
         		$('.js-grid').masonry({
                         itemSelector: '.grid-item',
                         columnWidth: '.grid-sizer'
                    });
console.log($('.grid-item:hidden').length);
         })
	}
      
     
	//когда пользователь выбирает фильтр,
	//в зависимости от его выбора подготавливаем список параметров и с этими параметрами запускаем функцию заполнения <div class="section__inner padding">

	$(".js-collect-select").on("select2:select", function() {
         if ($(this).attr("id") == "select_order"){
             var url_params = window.location.toString().split("?");
             url = url_params[0];
             param_old = url_params[1] != undefined ? url_params[1] : ""; 
             order = "order=" + $(this).val();
              console.log(param_old.search(/order=-?1/));
             param_new = (param_old.search(/order=-?1/) >= 0) ? param_old.replace(/order=-?1/, order) : order + (param_old != "" ? "&"+param_old : "");
             window.location.assign(url + "?" + param_new); 
         } else {
             var select_id_parts = $(this).attr("id").split("_");
             param = select_id_parts[1];
             if (param == "combi"){
                 for(i=2; i<select_id_parts.length; i++){
                     param += "_" + select_id_parts[i];
                 }
             }
             if (!(param in params)){
                 params[param] = [];
             }
             params[param] = $(this).val();//для множественного выбора - .push($(this).val());
             url_params = [];
             for(param in params){
                 url_params.push(param + "=" + params[param]);//для множественного выбора - params[param].join()
             }
             window.location.assign(location.origin + location.pathname + "?" + url_params.join("&") + "#objects");
         }
    });
                                                    
     
    $("ul.select_rating>li>a").click(function() {
		param = "rating";
		if (!(param in params)){
			params[param] = [];
		}
		params[param] = $(this).attr("id");//для множественного выбора - .push($(this).val());
		url_params = [];
		for(param in params){
			url_params.push(param + "=" + params[param]);//для множественного выбора - params[param].join()
		}
		window.location.assign(location.origin + location.pathname + "?" + url_params.join("&") + "#objects");

    });

	$("h2>span.close").on("click", function() {
        url_params = []; console.log(params);                                      
        for (param in params){
            if (params[param] == $(this).attr("id")) {console.log("id");
                delete params[param];
            } else {console.log("url_params.push(param +  + params[param])");
                url_params.push(param + "=" + params[param]);//для множественного выбора - params[param].join()                               
            }                                   
        }  console.log(url_params);                                     
    	window.location.assign(location.origin + location.pathname + "?" + url_params.join("&") + "#objects");                                       
    });

})	