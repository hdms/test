/**
 * ...
 * @author ...m-honda
 * --------------------
 * 
 */
var global = global || {};

!function(d,w){
    "user srtict";
    /*===========================================================
     *lib
     *=========================================================== */
    var rand = function(min,max){
	return (Math.random() * (max-min)+min) || 0;
    };
    var hitRect = function(x1,y1,w1,h1,x2,y2,w2,h2){
	return !(x1+w1<x2||x2+w2<x1||y1+h1<y2||y2+h2<y1);
    };
    var radian = Math.PI / 180;
    function log(obj){
	w.console.log(obj);
    };
    function isCanvasSuported(){
	var elm = d.createElement('canvas');
	return !!(elm.getContext && elm.getContext('2d'));
    };
    w.requestAnimationFrame = (function() {
	return window.requestAnimationFrame ||
	    window.webkitRequestAnimationFrame ||
	    window.mozRequestAnimationFrame ||
	    window.msRequestAnimationFrame ||
	    window.oRequestAnimationFrame ||
	    function(f) { return window.setTimeout(f, 1000 / FPS); };
    }());
    w.cancelRequestAnimationFrame = (function() {
	return window.cancelRequestAnimationFrame ||
	    window.webkitCancelRequestAnimationFrame ||
	    window.mozCancelRequestAnimationFrame ||
	    window.msCancelRequestAnimationFrame ||
	    window.oCancelRequestAnimationFrame ||
	    function(id) { window.clearTimeout(id); };
    }());

    if(typeof w.cosole === "undefined"){
	w.cosole = {};
    };
    if(typeof w.cosole.log !== "function"){
	w.cosole.log = function(arg){
	    return(arg);
	};
    }
    function log(arg){
	w.apply ? 
	    w.console.log.apply(w.console,arguments) : 
	    w.console.log(arg);
    };

    function Point(x, y) {
	this.x = x || 0;
	this.y = y || 0;
    }
    Point.add = function(p1, p2) {
	return new Point(p1.x + p2.x, p1.y + p2.y);
    };
    Point.distance = function(p1,p2){
	//三平方
	var a = p1.x - p2.x;
	var b = p1.y - p2.y;
	return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    };
    Point.interpolate = function(p1,p2,t){
	//内分点
	var x = p1.x * (1 - t) + p2.x * t;
	var y = p1.y * (1 - t) + p2.y * t;
	return new Point(x, y);
    };
    Point.prototype = {    
	add : function(p) {
	    return Point.add(this, p);
	},
	distance : function(p){
	    return Point.distance(this,p);
	},
	dump : function(){
	    log(this);
	},
	offset : function(x,y){
	    this.x += x || 0;
	    this.y += y || 0;
	},
	interpolate : function (p, t){
	    return Point.interpolate(this, p, t);   
	}
    };
    function extend(s, c){
	function f(){};
	f.prototype = s.prototype;
	c.prototype = new f();
	c.prototype.__super__ = s.prototype;  
	c.prototype.__super__.constructor = s;
	c.prototype.constructor = c;
	return c;
    };

    global.Point = Point;
    global.addEv = function(obj,type,func){
	obj.addEventListener ? 
	    obj.addEventListener(type,func,false)
	    : obj.attachEvent('on' + type,func);
    };
    global.log = log;
    w.log = log;
    /*===========================================================
     * conf
     *=========================================================== */
    /*===========================================================
     * variavle
     *=========================================================== */
    global.wObject;
    //global.headUrl = "http://localhost/honda/work/portfolio/html5/";
    global.headUrl = "http://www.hnd.x0.com/";
    /*===========================================================
     * const
     *=========================================================== */
    function init(){
	try{
	    w.removeEventListener("load",init,false);
	}catch(e){
	    w.detachEvent("onload", init);
	};
	// --------------------------------------
	global.TopImgFunc();
	global.FormFunc();
	global.PageTransit();
	global.wObject = global.WorksFunc();
	global.ResizeFunc();
	global.OtherFunc();
	// --------------------------------------
	addListener();
    };
    /*===========================================================
     * event
     *=========================================================== */
    function addListener(){
	w.onresize =  function(){
	    global.ResizeFunc();

	};



    };
    /*===========================================================
     * under ie8
     *=========================================================== */
    var ieVer = false;
    /*@cc_on

     @if (@_jscript_version >= 9)
     ieVer=true;
     @else
     ieVer=false;
     @end

     @*/
    function underIE(){
	// ---
	init();
    };
    /*===========================================================
     * query request
     *=========================================================== */
    var isQuery;
    var url = w.location.href;
    var req = url.slice(url.lastIndexOf('/') + 1);
    req.indexOf("?",0) > 0 ? isQuery = true : isQuery = false;
    /*===========================================================
     * userAgent
     *=========================================================== */
    function UA(){
	var ua = 'PC'
	var str = navigator.userAgent;
	if(str.match('iPhone'))ua = 'iPhone';
	if(str.match('iPad')) ua = 'iPad';
	if(str.match('iPod')) ua = 'iPod';
	if(str.match('Android')) ua='Android';
	return ua;
    };
    //============================================================
    try{
	isQuery ? w.addEventListener("DOMContentLoaded", underIE, false) : 
	    w.addEventListener("DOMContentLoaded", init, false);
	w.addEventListener("load",function(){
	},false)
    }catch(e){
	//under ie 8
	if(!isQuery && ieVer){
	    w.attachEvent("onload", init)
	}else{
	    w.attachEvent("onload", underIE);
	};
    };
}(document,window);

global.TopImgFunc = (function(d,w){
    return function(){
	"user srtict";
	/*===========================================================
	 * variavle
	 *=========================================================== */
	var main = this;
	var alp = 0;
	var target;
	var num = 0;
	var imgList = [];
	var val = 0.05;
	var IMGNUM = 3;
	var FADETIME = 5;
	var LOOPTIME = 10000;
	var HEADSTR = "img/top_";
	var FOOTSTR = ".jpg";
	/*===========================================================
	 * const
	 *=========================================================== */
	function Main(){

	    var hidden = (window.SVGAngle == void 0) ? $("#logoSvg") : $("#logoImg"); 
		var logo = (window.SVGAngle !== void 0) ? $("#logoSvg") : $("#logoImg"); 
	    hidden.css({"display" : "none"});
		logo.css({"display" : "block"});

	    target = d.getElementById("topImg");
	    target.style.opacity = 0;
	    for(var i = 0; i < IMGNUM; ++i){
		var preload = d.createElement("img");
		var src = global.headUrl + HEADSTR + i.toString() + FOOTSTR;
		preload.src = src;
		imgList.push(src);
	    };
	    loop();
	};
	var fadeIn = function(){
	    alp += val;
	    target.style.opacity = alp;
	    if(alp < 1){
		w.setTimeout(fadeIn,FADETIME);
	    }else{
		target.style.opacity = 1;
		w.setTimeout(loop,LOOPTIME);
	    };
	};
	var fadeOut = function(){
	    alp -= val;
	    target.style.opacity = alp;
	    if(alp > 0){
		w.setTimeout(fadeOut,FADETIME);
	    }else{
		target.style.opacity = 0;
		change();
		loop();
	    };
	};
	function loop(){
	    var alp = target.style.opacity;
	    alp == 0 ? fadeIn() : fadeOut();
	};
	function change(){
	    (num < IMGNUM - 1) ? num++ : num = 0;
	    target.src = imgList[num];
	};
	return new Main();
    };
})(document,window);

global.FormFunc = (function(d,w){
    return function(){
	"user srtict";
	/*===========================================================
	 * variavle
	 *=========================================================== */
	var main = this;
	var URL = "php/send.php";
	/*===========================================================
	 * const
	 *=========================================================== */
	function Main(){
	    //
	    $('form').submit(function(){
		var error = true;
		$('.error').html("※");
		$('.error').css({'display':'none'});

		$(':text,textarea').filter('.required').each(function(){
		    if($(this).val()==""){
			error = false;
			$(this).parent().find('.error').css({'display':'inline'});
		    }
		    $(this).filter('.mail').each(function(){
			if($(this).val() && !$(this).val().match(/.+@.+\..+/g)){
			    error = errorMethod($(this).parent(),"※メールアドレスの形式が異なります");
			}
		    });
		    $(this).filter('.check').each(function(){
			if($(this).val() && $(this).val()!=$("#address").val()){
			    error = errorMethod($(this).parent(),"※メールアドレスの内容が異なります");
			}
		    });
		})
		$(':text').filter('.number').each(function(){
		    if($(this).val() && isNaN($(this).val())){
			error = errorMethod($(this).parent(),"※数値のみ入力可能です");
		    }
		})
		function errorMethod(target,mess){
		    target.find(".error").html(mess);
		    target.find(".error").css({'display':'inline'});
		    return false;
		};
		var data = {
		    message:$('#message').val(),
		    name:$('#name').val(),
		    address:$('#address').val(),
		    number:$('#number').val()
		};
		
		if(!error){
		    return false;
		}else{
		    $.ajax({
			url : URL,
			type : 'post',
			data : data,
			datatype : 'json',
			success:function(res){
			    result();
			}
		    });
		    return false;
		}
	    });
	    function result(){
		$("#sended").animate({
		    "opacity":"toggle"
		},{complete:null});
	    }
	};
	return new Main();
    };
})(document,window);



global.PageTransit = (function(d,w){
    return function(){
	"user srtict";
	/*===========================================================
	 * variavle
	 *=========================================================== */
	var main = this;
	var DIFF = 130;
	var TIME = 500;

	/*===========================================================
	 * const
	 *=========================================================== */
	function Main(){
	    if (window.history && window.history.pushState){
		w.history.replaceState("index","","");
	    }
	    var elm;
	    //elm = $("a[href ^= '#']");
	    elm = $("a").not(".ui,.link,.swipebox");

	    elm.click(function(e){
		e.preventDefault();

		var url = "";
		var href = $(this).attr("href");
		var pos;
		if(href == '/worksMain'){
		    url += "works/";
		    url += $(this).attr('name');
		    pos = $('#works').offset().top - DIFF + 70;
	
	
		}else{
//		    url += href;
		    //url += "works/";
		    // url += $(this).attr('name');

		    var target = $(href == "" || href  == "/top" ? 'html' : '#' + href.slice(1));
		    pos = (target == 'html') ? 0 : (target.offset().top) - DIFF;
		}
		move(pos);

		//w.history.pushState(href,null,global.headUrl + url);
		return false;
	    });

	    $(window).on("popstate",function(e){
	    	if (!e.originalEvent.state) return; 
	    	e.preventDefault();
	    	var state = e.originalEvent.state;
		var pos;
		switch(state){
		case "/works" :
		    pos = $('#works').offset().top - DIFF;
		    move(pos);
		    global.wObject.hideContent();
		    break;
		case "/worksMain" :
		    pos = $('#works').offset().top - DIFF + 70;
		    move(pos);
		    global.wObject.showContent(global.wObject.getId());
		    break;
		};
	    	return false;
	    });
	    function move(pos){
		$("html, body").animate({scrollTop : pos}, TIME, "swing");
	    };


	};
	return new Main();
    };
})(document,window);

global.WorksFunc = (function(d,w){
    return function(){
	"user srtict";
	/*===========================================================
	 * variavle
	 *=========================================================== */
	var main;
	var scrollElm = $('#navWrap');
	var wImg = $('.wImg');
	var wInfo = $('.info');
	var wToggle = false;
	var currentPoint = new global.Point(0,0);
	var duration = 500;
	var mDuration = 300;
	var diff,h,h2;
	var currentId;
	/*===========================================================
	 * const
	 *=========================================================== */
	function Main(){
	    addMouseEvent();
	    this.setDiff = function (ws){
		diff = ws > 1200 ? parseInt(200) : parseInt(150);
		h = ws > 1200 ? parseInt(680) : parseInt(600);
		h2 = ws > 1200 ? parseInt(330) : parseInt(280);
	    };
	};
	function addMouseEvent(){

	    $(".showContent").mouseenter(function(){
		var target = $(this).find(".detail").find("div");	
		target.css({"display":"table-cell"});
	    });
	    $(".showContent").mouseleave(function(){
		$(".detail div").css({"display":"none"});
	    });
	    $(window).mouseleave(function(){
//		$(".detail div").css({"display":"none"});
	    });

	    $('.ui').click(function(){
		var type = $(this).attr('id');
		uiEvent(type);
		return false;
	    });
	    $('.showContent').bind("click touchstart",function(){
		var id = $(this).attr('id');
		showContent(id);
		return false;
	    });


	};
	function showContent(id){
	    currentId = id;
	    $('#worksNav').animate({'height':'0px','opacity':0});
	    $('#worksList').children().fadeOut(0);
	    $('#worksList').find('#c' + id.slice(1)).fadeIn('slow');
	    $('#worksMain').fadeIn('slow');

	    $('#worksMain').animate({'height':h + 'px','opacity':1},
				    {complete : function(){w.setTimeout(toggle,200)},easing: 'swing'});
	};
	function toggle(){
	    var left,comp;

	    if(wToggle){
		left = "0%";
		wInfo.fadeOut("fast");
		comp = function(){

		};
	    }else{
		left = "48%";
		comp = function(){
		    wInfo.fadeIn();
		};
	    };
	    wToggle = !wToggle;

	    wImg.animate({'left' :  left } ,{
		duration : mDuration,
		complete : comp
	    });
	};
	function getId(){
	    return currentId;
	};	


	function hideContent(){
		$("html, body").animate({scrollTop : $('#works').offset().top - 130}, 500, "swing");
	    $('#worksMain').animate({'height':'0px','opacity':0});
	    $('#worksNav').animate({'height':h2 + 'px','opacity':1},{complete : function(){
		wToggle = true;
		toggle();
	    }});

	};

	Main.prototype.getId = getId;
	Main.prototype.showContent = showContent;
	Main.prototype.hideContent = hideContent;


	function uiEvent(type){
	    var x;
	    var comp;

	    switch(type){
	    case 'scrollRight' :
		x = -diff;
		comp = function(){
		    $('#navWrap li:first').insertAfter('#navWrap li:last');
		    scrollElm.css({left : 0});
		};
		scrollElm.animate({'left' :  x } ,{
		    duration : duration,
		    complete : comp
		});
	        break;
	    case 'scrollLeft' :
		x = 0;
		scrollElm.css({left : -(diff)});
		$('#navWrap li:last').insertBefore('#navWrap li:first');
		comp = function(){
		    return;
		};
		scrollElm.animate({'left' :  x } ,{
		    duration : duration,
		    complete : comp
		});
	        break;
	    case  'hide' :
		hideContent();
		w.history.pushState(null,null,global.headUrl + "works");
		break;
	    case 'showInfo' :
		toggle();
		break;
	    default :
	        return false;
	    };



	};
	return new Main();
    };
})(document,window);



global.OtherFunc = (function(d,w){
    return function(){
	"user srtict";
	/*===========================================================
	 * variavle
	 *=========================================================== */
	var main = this;
	/*===========================================================
	 * const
	 *=========================================================== */
	function Main(){
	    $(".swipebox").swipebox();		
	    return this;
	};
	return new Main();
    };
})(document,window);

global.ResizeFunc = (function(d,w){
    return function(){
	"user srtict";
	/*===========================================================
	 * variavle
	 *=========================================================== */
	var main = this;
	var w,h;
	/*===========================================================
	 * const
	 *=========================================================== */
	function Main(){
	    w = $(window).width();
	    h = $(window).height();

	    global.wObject.setDiff(w)

	    return this;
	};
	return new Main();
    };
})(document,window);


global.empty = (function(d,w){
    return function(){
	"user srtict";
	/*===========================================================
	 * variavle
	 *=========================================================== */
	var main = this;
	/*===========================================================
	 * const
	 *=========================================================== */
	function Main(){
	    //
	};
	return new Main();
    };
})(document,window);




