/**
 * @author xiong
 */



var serverHost = 'http://' + window.location.host+'/'+window.location.pathname.split('/')[1]+'/';

window.cdnHost = window.cdnHost || (function(){
	return 'http://' + window.location.host+'/'+window.location.pathname.split('/')[1]+'/';
})();

/**
*	设置一个全局的body对象;
*	所有文本的容器
**/

var body = body ? body : 'body';

var ut = {};

/**
*	引用对象映射组
**/
var helpMap = [] ;

(function(){


/**
 *	是否开启debug模式
 *	<script type='text/javascript' debug='true' src='utils.js'></script>
 */
var isDebug = $('script[src*=utils][debug=true]').length == 0 ? 0 : 1 ;
/**
 *  资源路径配置
 */
var asset = (function(){
	var path = $('script[src*=utils]').attr('src') ;
	path = path.slice(0,path.indexOf('js/utils'));
	return {
		baseUrl : [path+'js/lib',path+'js/lib/libCopy'][isDebug],
		cssPath : ['../../css/','../../../css/'][isDebug],
		conponentPath : ['../component','../../component'][isDebug],
	}
})();
var paths = {

//				_common : cssPath+'/common',
				_normalize : asset.cssPath + '/normalize',
				_component :  asset.conponentPath + '/component.html' ,
				_componentJs :  asset.conponentPath + '/component' ,


				//jquery : 'jquery-1.10.2.min',
				_css : ['css.min','css'][isDebug],
				_text : ['text.min','text'][isDebug],
				_template : ['jquery.tmpl.min','jquery.tmpl'][isDebug],
				_iscroll : ['iscroll.min','iscroll'][isDebug],
				_flux : ['flux.min','flux'][isDebug],
				_easelJs : ['easeljs-0.8.1.min','easeljs-0.8.1.combined'][isDebug],
				_soundJs : ['soundjs-0.6.1.min','soundjs-0.6.1.combined'][isDebug],
				_tweenJs : ['tweenjs-0.6.1.min','tweenjs-0.6.1.combined'][isDebug],
				_velocity : ['velocity.min','velocity'][isDebug],
				_cookie : ['jquery.cookie.min','jquery.cookie'][isDebug],
				_custom : ['custom.min','custom'][isDebug],
				_wx : ['http://res.wx.qq.com/open/js/jweixin-1.0.0'],
				_wxdt : ['http://map.qq.com/api/js?v=2.exp'],

				'':''
			};

/**
*	初始化requireJs 配置 
*	加载基本资源
**/
(function(){

	//判断是否依赖require对象
	if(!window.require){
		window.define = new Function() ;
		return false ;
	}
	
		require.config({

			baseUrl : asset.baseUrl,
			paths : paths,
			map : {
				'*' : {
					css : '_css',
					text : '_text'
				}
			},
			config : {
				_text : {
					useXhr : function(url, protocol, hostname, port){
						return true;
					}
				}
			},
			shim : {
				_easelJs : {
					exports : 'cc'
				},
				_wxdt : {
					exports : 'dd'
				}
			}
		});

		$.holdReady(true);
		
		window.onload = function(){
			require(['component','tmpl','normalizeCss'].concat(getReqMap()),function(){
				$.holdReady(false);
			});
		};
		
		function getReqMap(){
			var finded = {} , reqObj = helpMap.concat() ;
			$("script").each(function(index,value){
				var html = $(value).html().replace(/\/\/.*\n/g,'');
				var arr = html.match(/\.\s*\w+(?=\W*)/g);
				$.each(arr||[],function(index,value){
					value = value.match(/[^\.\s]+/g)[0];
					finded[value] = true;
				});
			});
			for( var i=0 ; i<reqObj.length ; i++ ){
				if(!finded[reqObj[i]]){ delete reqObj[i] ; }
			}
			return reqObj ;
		};
	
})();


/**
 * 自定义require函数
 */
ut.require = function(arr,cb){
	$.holdReady(true);
	require(arr,function(){
		cb&&cb();
		$.holdReady(false);
	})
};

/**
 * 自定义define函数，自动收集映射
 */
ut.define = function(name,deps,cb){
	helpMap.push(name);
	define(name,deps,cb) ;
};
ut.define('tmpl',['_template','jquery'],function(){
	$.each( $('script:not([type*=javascript])'), function(index,value){
		var $value = $(value);
		$.template($value.attr('id'),$value.html().replace(/.{1}@/g,function(str){
			return str=='\\@' ? '@' : str.replace(/@/g,'$');
		}));
	});
});
ut.define('component',['text!_component','_template','_componentJs'],function(data){
	var ele = createStyle();
	var cpMap = getCpMap();
	$.each($(data),function(index,value){
		var $value = $(value);
		if($value.is('script')){
			$.template($value.attr('id'),$value.html().replace(/.{1}@/g,function(str){
				return str=='\\@' ? '@' : str.replace(/@/g,'$');
			}));
		}else if( $value.is('style')){
			var cpFunc = $value.attr('cpFunc') ;
			if( !cpFunc || cpMap[cpFunc] ){
				$value.appendTo(ele);
			}
		}
	});
	function createStyle(){
		var head = document.getElementsByTagName('head')[0];
		var ele = document.createElement('style');
		ele.type='text/css';
		head.appendChild(ele);
		return ele ;
	};
	function getCpMap(){
		var cpMap = {} ;
		$('script').each(function(index,value){
			var html = $(value).html().replace(/\/\/.*\n/g,'');
			var arr = html.match(/\s+cp\s*\.\s*\w+(?=\W*)/g);
			$.each(arr||[],function(index,value){
				value = /.*\.\s*(\w+)/g.exec(value)[1];
				cpMap[value] = true;
			});
		});
		return cpMap ;
		
	};
});

ut.define('cookie',['_cookie'],function(){
	//console.log(cookie);
});

ut.define('countdown',['_custom'],function(){
	var countdown = $.fn.countdown ;
	$.fn.countdown = function(options){
		var tcd = this.attr('cd')||0 ;
		countdown.call(this,$.extend({
			until: +tcd,
	        compact: true,
	        format: tcd>86400?'DHMS':'HMS',
	        onExpiry: function(){  }
		},options));
	};
});
ut.define('flux',['_flux','jquery'],function(data){
	ut.flux = function($ele,opts){
		var f = new flux.slider('#slider',$.extend({
			autoplay: true,
			pagination: false,
			transitions : ['blocks2'],
			delay: 4500,
			animDelay : false ,
			controls : false,
			captions: true,
			bullets : true ,
			captionsStyle : { 'font-size':'24px',padding: '14px 1em' },
			bulletsStyle : {bottom : '17px',right:'12px'} ,
			width:640,
			height:380,
			onTransitionEnd : null
		},opts)); 
		return f ;
	};
});
ut.define('wx',['_wx'],function(data){
	ut.wx = data ;
});
ut.define('wxdt',['_wxdt'],function(data){
	ut.wxdt = function(elementId,x,y){
		var map = new qq.maps.Map(document.getElementById(elementId),{
	        // 地图的中心地理坐标。
	        center: new qq.maps.LatLng(39.916527,116.397128)
	    });
		return map ; 
	} ;
		
});

//define('commonCss',['css!_common']);
ut.define('normalizeCss',['css!_normalize']);


ut.define('iScroll',['_iscroll'],function(){
    ut.iScroll = function(wrapId,options){
    	if(typeof options == 'boolean' && options === true ){
    		options = { scrollX: true, scrollY: false } ;
    	}
    	
    	var scroll = new IScroll(wrapId,$.extend({
    		useTransition: true,
    		scrollX: false, scrollY: true,
	    	scrollbars: false ,fadeScrollbars: true ,
    		preventDefault: false , deceleration : 0.004 ,
	    	HWCompositing : ut.UA.system != 'os'
	    },options||{}));
    	
    	//this.y == this.maxScrollY 表示划至最后
    	scroll.on('scrollStart',function(){
    		var $ele = $(this.wrapper).children() ;
    		if( $ele.height()!=this.scrollerHeight || $ele.width()!=this.scrollerWidth ){ 
    			this.refresh(); 
    		}
    	});
    	return scroll ;
    };
    
});
ut.bookmark = function(eleTp,iscroll){
	var scrollY = Number(localStorage.getItem('scrollY'));
	if(scrollY){
		iscroll.scrollTo(0,scrollY,0);
		localStorage.removeItem('scrollY') ;
	}
	$(document).on('tap',eleTp,function(){
		localStorage.setItem('scrollY',iscroll.y);
	});
};

ut.define('easelJs',['_easelJs','_tweenJs','_soundJs'],function(data){
	
	ut.easelJs = createjs ;

});
ut.define('soundJs',['_soundJs'],function(data){
	ut.soundJs = createjs ;
});
ut.define('velocity',['_velocity'],function(data){
	
});


+function(){
	
	$(document).on('touchstart mousedown','[as]',function(e){
		$(this).addClass(function(){
			return $(this).attr('as') ;
		}).one('touchend mouseup',function(){
			$(this).removeClass($(this).attr('as'));
		});
	});
	//设置默认href属性效果
	$(document).on('tap','[href]',function(e){
		location.href  = $(this).attr('href') ;
	});
	
}();

ut.loader = (function(){
	
	var path = $('script[src*=utils]').attr('src') ;
		path = path.slice(0,path.indexOf('js/utils'));
	var href = path+"js/asset/loading.gif" ;
	var element = "<div class='' ><div><img/></div></div>" ;
	var centerClass = {'position' : 'absolute','top' : '0', 'left' : '0','bottom' : '0' , 'right' : '0', 'margin' : 'auto' };
	var size1 = '28px',size2 = '70px' ;
	var curr ;
	
	function create(){
		var $this = $(element) ;
		$this.css($.extend(centerClass,{'z-index' : '999'}));
		$this.children('div').css($.extend({},centerClass,{
			'width' : size2 , 'height' : size2, 'display' : 'none' , 'webkitTransform':'scale(2) translateY(-25%)',
			'border-radius' : '10px' , 'background' : 'rgba(0,0,0,0.55)'
		}));
		$this.find('img').css($.extend({},centerClass,{
			'display' : 'block' , 'width' : size1 , 'height' : size1 
		})).attr('src',href);
		return $this ;
	};
	
	return {
		expand : function(){
			this.remove();
			curr = create().appendTo('body');
			setTimeout(function(){ curr && curr.find('div').show(); },250);
		},
		remove : function(){ curr && curr.remove(); curr = null ; }
	}
})();


/**
*	client 适配对象
*	调用方法 ut.client.box();
*	@param modeW{int} 设计宽度
*	@parse modeH{int} 设计高度
**/
ut.client = (function(){
	var client = {}; client.modeH = 1008; client.modeW = 640;
	
	Object.defineProperties(client,{
		w : { get : function(){ return window.innerWidth ; } },
		h : { get : function(){ return window.innerHeight ; } }
	});

	//正确屏幕的宽高比
	client.ratio = client.modeW/client.modeH; client.error = 1.35;
	
	client.init = function(){
		//屏幕宽度失调率
		this.imbalance = this.w/(this.h*this.ratio);
		this.isBalance = this.imbalance>this.error?false:true;
		//实际显示高宽
		this.seeH = this.h;
		this.seeW = this.isBalance ? this.w : this.h*this.ratio;
		
		this.scaleW = this.seeW/this.modeW;
		this.modeH = this.isSingle ? this.seeH/this.scaleW : this.modeH ;
		this.scaleH = this.seeH/this.modeH ;
	};
	
	client.gbox = $("<div class='gbox'></div>");

	// 解析正确的手势位置  
	client.unX = function(x){ return ( x - this.gbox.offset().left ) / this.scaleW ; };
	client.unY = function(y){ return y / this.scaleH ; };
	client.box = function(modeW,modeH){

		if( window.body== undefined || window.body == 'body'){
			//如果body未定义或指向非适配后的值则认为未适配
			this.gbox.append($('body').children(':not(script,style)')).wrap("<div></div>").parent().appendTo('body');
			setDefault(); window.body = this.gbox ;
		}
		client.modeW = modeW || client.modeW ;
		client.isSingle = client.isSingle || (!modeH && modeW) ? true : false;
		client.modeH = modeH || ( modeW ? null : client.modeH ) ;

		this.init();
		this.gbox.parent().css({
			width : this.seeW + 'px', height : this.seeH + 'px',
			margin : 'auto', overflow : 'hidden',
			position : 'absolute', top : '0', left : '0', right : '0'
		});
		this.gbox.css({
			width : this.modeW + 'px', height : this.modeH ? (this.modeH + 'px') : this.seeH/this.scaleW+'px',
			position : 'absolute', overflow : 'hidden', left : 0, top : 0, transformOrigin : '0 0', transform : 'scale('+this.scaleW+','+this.scaleH+')'
		});
		$('body').css('background','black');
	};
	
	function setDefault(){
		$(window).on('resize orientationchange',function(){
			if(!$(document.activeElement).is('input,textarea')){ client.box(); }
		});
		$(document).on('touchstart touchmove',function(e){ 
			if( !(e.type=='touchstart' && $(e.target).is('input,textarea,select,video,a')) ){
				e.preventDefault();
			}
		});
		
	}
	client.flex = function(modeW){
		this.modeW = modeW ? modeW : this.modeW ;
		$('meta[name=viewport]').attr('content','width='+this.modeW+',user-scalable=no') ;
		$('html,body').css({'height':'100%'});
		this.gbox = $(body).addClass('gbox') ;
		this.modeH = this.gbox.height();
	};
	return client;
	
})();

//设备嗅探
ut.UA = (function(){
	var s = navigator.userAgent.toLowerCase();
	var match = /(os)[ \/]([\w_]+)/.exec(s) || /(android)[ \/]([\w.]+)/.exec(s) ||[];
	var _version = match[2] || "0" , _system = match[1] || "" ;
	function compareVer(v1){
		v1 = v1.toString().split('.') ; 
		var v2 = _system == 'os'? _version.split('_') : _version.split('.') , result = 0;
		for(var i =0;i<v1.length&&i<v2.length;i++){
			result = v2[i] - v1[i] ;
			if(result!=0) break ;
		}
		return result ;
	};
	return { 
		system : _system ,
		version : _version ,
		isIpad : /ipad/.test(s) ,
		isIphone : /iphone/.test(s) ,
		isAndroid : this.system == 'android' ,
		verEq : function(str){
			return compareVer(str) == 0 ? true : false ;
		},
		verLess : function(str){
			return compareVer(str) < 0 ? true : false ;
		},
		verGreater : function(str){
			return compareVer(str) >= 0 ? true : false ;
		},
		is : function(str){
			str = str.toLowerCase();
			return s.indexOf(str)==-1? false : true ;
		}
	} ;
})();


//数组方法


(function(){
	
	function toArray(obj){
		return $.map(obj ||{},function(value, index){
            if ($.isPlainObject(value))
                value._key = index;
            return value;
		});
	};
	ut.get = function(obj){
		return toArray(obj);
	};
	//拓展数组方法
	Array.prototype.fill = function(colum, minLength){
		var re = toArray(this);
	    if (minLength && re.length < minLength) 
	        re = re.concat(new Array(minLength - re.length));
	    else {
	        var fix = Math.ceil(re.length / colum) * colum - re.length;
	        if (fix) 
	            re = re.concat(new Array(fix));
	    }
	    return re;
	};
	Array.prototype.filter = function(rule, isother){
		
	    var copy = $.extend({}, this);
	    
	    function isChild(ob, rule){
	        for(var i in rule){
	        	if(ob[i]==undefined)
	        		return false;
	        }
	        return true;
	    };
	    function find(ob,rule){
	    	if(isChild(ob,rule)){
	    		for(var i in rule){
	    			if(ob[i]!=rule[i])
	    				return false;
	    		}
	    		return true;
	    	}else{
	    		for(var i in ob){
	    			if (typeof ob[i] == 'object' && ob[i] != null && find(ob[i],rule)) {
	    				return true;
	    			}
	    		}
	    	}
	    	return false;
	    };
	    
	    for(var i in copy){
	    	if( (isother&&find(copy[i], rule)) || (!isother&&!find(copy[i],rule)) ){
	    		 delete copy[i];
	    	}
	    }
	    return toArray(copy);
	};
	//通用方法，按照某个字段对data进行排序，data可以是array或者object
	//key是排序用的字段，desc表示是否降序，desc为true表示降序，不传则默认升序
	Array.prototype.sortData = function(keys, descs ,custom){
	    //key是数组;
	    var re =  this ;
	    
	    keys = keys instanceof Array ? keys : [keys] ;
	    descs = descs instanceof Array ? descs : [descs] ;
	    
	    function compare(a,b,i){
	    	i = i || 0 ;
	    	if( typeof keys[i] == undefined ){
	    		return false
	    	}
	    	var key = keys[i] , desc = descs[i] || false ;
	    	var av = a[key] , bv = b[key] ;
	    	if( custom && (key in custom)){
	    		av = custom[key][av];
	    		bv = custom[key][bv];
	    	}
	    	
	    	
	    	if( av === bv ){
	    		return compare(a, b, i + 1) ;
	    	}else{
	    		if(typeof av == 'number'){
	    			return desc ? bv - av : av - bv ;
	    		}else{
	    			return desc ? av.localeCompare(bv) : bv.localeCompare(av) ;
	    		}
	    		
	    	}
	    	
	    };
	    
	    return re.sort(function(a,b){
	    	return compare(a,b);
	    });
	   
	};

	$.each('fill sortData filter'.split(' '),function(index,value){
		Object.defineProperty(Array.prototype, value , {enumerable : false });
	});
	
})();



ut.getArray = function(num){
	return (new Array(num));
};
ut.toArray = function(obj){
		
	var re = $.map(obj ||
    {}, function(value, index){
        if ($.isPlainObject(value)) 
            value._key = index;
        return value;
    });
    return re;
};



(function (){
	
	var origin = window.pageData || {} ;
	window.root  = origin.data || {};
	//向后台发送ajax请求
	ut.send = function(url,cb,failcb,errorcb,options){

		if(cb && typeof cb != 'function'){
			options = cb ;
			cb = false ;
		}
		if(failcb && (typeof failcb != 'function')){
			options = failcb ;
			failcb = false ;
		}
		if(errorcb && (typeof errorcb != 'function')){
			options = errorcb ;
			errorcb = false ;
		}
		if(options instanceof jQuery){
			options = options.serialize() ;
		}

		ut.loader.expand();
		$.ajax({
			method : 'post',
			url : serverHost + url,
			timeout: 60000,
			data : options||{},
			success : function(data){
				console.log(data);
				ut.loader.remove();
				$.extend(true,origin,data);
				if( data && data.callback === true ){
					cb && cb(data.data,data);
				}else{
					console.error('callback false') ;
					failcb && failcb(data);
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown){
				ut.loader.remove();
				errorcb && errorcb(textStatus);
				console.log(textStatus);
			}
		});
	};
	
	
})();




/**
 * 时间处理对象
 */
ut.timer = (function(){
	function format (fmt) { //author: meizz 
		fmt = fmt || "yyyy-MM-dd" ;
	    var o = {
	        "M+": this.getMonth() + 1, //月份 
	        "d+": this.getDate(), //日 
	        "h+": this.getHours(), //小时 
	        "m+": this.getMinutes(), //分 
	        "s+": this.getSeconds(), //秒 
	        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
	        "S": this.getMilliseconds() //毫秒 
	    };
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
	    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    return fmt;
	}
	return {
		getTime : function(nS,fmt){
			var date = new Date(parseInt(nS) * 1);
			return format.call(date, fmt) ;
		},
		getOldTime : function(nS){
			return new Date(parseInt(nS) * 1).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");     
		}
	};
})();

	
/**
*	manage 简易加载图片对象
*
**/

ut.manage = (function(){


	var _cb , _failcb , _list = [] , _cacheList = {};

	function isArray ( obj ){
		return toString.call(obj) == "[object Array]" ? true : false ;
	};
	function isObject ( obj ){
		return toString.call(obj) == "[object Object]" ? true : false ;
	};
	function loadList ( manage ) {
		var size = _list.length , count = size , miss = 0;

		for( var i=0; i<size; i++ ){
			
			var img = new Image(); var obj = _list.pop() ;
			img.src = obj.src ;
			_cacheList[ obj.id ] = img ;
			
			if(img.complete){
				count --; excuEnd();
			}else{
				img.onload = img.onerror = function(e){
					count --;
					if( e.type == 'error' ){miss ++}
					excuEnd();
				}
			}
			
		}
		function excuEnd(){
			manage.rate = ( size-count ) / size * 100;
			if(count == 0){
				miss > 0 ? failback( miss ) : callback();
			}
		}
	}
	function callback (){
		_cb && _cb();
	}
	function failback (miss){
		console.error('miss is '+miss);
		_failcb && _failcb();
	}
	return {
			
			rate : 0 ,
			add : function( args , url ){

				if(isArray(args)){
					for(var i=0; i< args.length; i++ ){
						
						if( !isObject(args[i]) ){
							args[i] = { id: args[i].match(/(\w+)\./)[1] , src:args[i] };
						}
						args[i].src = url ? url + '/' + args[i].src : args[i].src ;
					}
					Array.prototype.push.apply(_list,args);
				}
				return this;
			},
			start : function(){ loadList(this); },
			getImgById : function( id ){ return _cacheList[id] ; },
			setCallback : function( cb ,failcb ){
				_cb = cb ; _failcb = failcb || _cb ;
				return this;
			}
				
	};
})();


})();

/**
 * copy touch.js 手势事件
 * 
 */

//Zepto.js
//(c) 2010-2015 Thomas Fuchs
//Zepto.js may be freely distributed under the MIT license.

;(function($){
	var touch = {},
	touchTimeout, tapTimeout, swipeTimeout, longTapTimeout,
	longTapDelay = 750,
	gesture
	
	function swipeDirection(x1, x2, y1, y2) {
		return Math.abs(x1 - x2) >=
		Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
	}
	
	function longTap() {
		longTapTimeout = null
		if (touch.last) {
			touch.el.trigger('longTap')
			touch = {}
		}
	}
	
	function cancelLongTap() {
		if (longTapTimeout) clearTimeout(longTapTimeout)
		longTapTimeout = null
	}
	
	function cancelAll() {
		if (touchTimeout) clearTimeout(touchTimeout)
		if (tapTimeout) clearTimeout(tapTimeout)
		if (swipeTimeout) clearTimeout(swipeTimeout)
		if (longTapTimeout) clearTimeout(longTapTimeout)
		touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
		touch = {}
	}
	
	function isPrimaryTouch(event){
		return (event.pointerType == 'touch' ||
		event.pointerType == event.MSPOINTER_TYPE_TOUCH)
		&& event.isPrimary
	}
	
	function isPointerEventType(e, type){
		return (e.type == 'pointer'+type ||
		e.type.toLowerCase() == 'mspointer'+type)
	}
	
	$(document).ready(function(){
	
	if(!("ontouchend" in document)){
		  $(document).on('click',function(e){
			  $(e.target).trigger('tap') ;
		  });
		  return ;
	}
	
	var now, delta, deltaX = 0, deltaY = 0, firstTouch, _isPointerType
	
	if ('MSGesture' in window) {
		gesture = new MSGesture()
		gesture.target = document.body
	}
	
	$(document)
	.bind('MSGestureEnd', function(e){
		 e = e.originalEvent || e ;
		 var swipeDirectionFromVelocity =
		   e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null;
		 if (swipeDirectionFromVelocity) {
		   touch.el.trigger('swipe')
		   touch.el.trigger('swipe'+ swipeDirectionFromVelocity)
		 }
	})
	.on('touchstart MSPointerDown pointerdown', function(e){
		 e = e.originalEvent || e ;
		 if((_isPointerType = isPointerEventType(e, 'down')) &&
			!isPrimaryTouch(e)) return
		 firstTouch = _isPointerType ? e : e.touches[0]
		 if (e.touches && e.touches.length === 1 && touch.x2) {
			 // Clear out touch movement data if we have it sticking around
			 // This can occur if touchcancel doesn't fire due to preventDefault, etc.
			 touch.x2 = undefined
			 touch.y2 = undefined
		 }
		 now = Date.now()
		 delta = now - (touch.last || now)
		 touch.el = $('tagName' in firstTouch.target ?
		   firstTouch.target : firstTouch.target.parentNode)
		 touchTimeout && clearTimeout(touchTimeout)
		 touch.x1 = firstTouch.pageX
		 touch.y1 = firstTouch.pageY
		 if (delta > 0 && delta <= 250) touch.isDoubleTap = true
		 touch.last = now
		 longTapTimeout = setTimeout(longTap, longTapDelay)
		 // adds the current touch contact for IE gesture recognition
		 if (gesture && _isPointerType) gesture.addPointer(e.pointerId);
	})
	.on('touchmove MSPointerMove pointermove', function(e){
		 e = e.originalEvent || e ;
		 if((_isPointerType = isPointerEventType(e, 'move')) &&
		   !isPrimaryTouch(e)) return
		 firstTouch = _isPointerType ? e : e.touches[0]
		 cancelLongTap()
		 touch.x2 = firstTouch.pageX
		 touch.y2 = firstTouch.pageY
		
		 deltaX += Math.abs(touch.x1 - touch.x2)
		 deltaY += Math.abs(touch.y1 - touch.y2)
	})
	.on('touchend MSPointerUp pointerup', function(e){
		 e = e.originalEvent || e ;
		 if((_isPointerType = isPointerEventType(e, 'up')) &&
		   !isPrimaryTouch(e)) return
		 cancelLongTap()
	
		 // swipe
		 if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
		     (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))
		
		   swipeTimeout = setTimeout(function() {
		     touch.el.trigger('swipe')
		     touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
		     touch = {}
		   }, 0)
		
		 // normal tap
		 else if ('last' in touch)
		   // don't fire tap when delta position changed by more than 30 pixels,
		   // for instance when moving to a point and back to origin
		   if (deltaX < 30 && deltaY < 30) {
		     // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
		     // ('tap' fires before 'scroll')
		     tapTimeout = setTimeout(function() {
		
		       // trigger universal 'tap' with the option to cancelTouch()
		       // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
		       var event = $.Event('tap')
		       event.cancelTouch = cancelAll
		       touch.el.trigger(event)
		
		       // trigger double tap immediately
		       if (touch.isDoubleTap) {
		         if (touch.el) touch.el.trigger('doubleTap')
		         touch = {}
		       }
		
		       // trigger single tap after 250ms of inactivity
		       else {
		         touchTimeout = setTimeout(function(){
		           touchTimeout = null
		           if (touch.el) touch.el.trigger('singleTap')
		           touch = {}
		         }, 250)
		       }
		     }, 0)
		   } else {
		     touch = {}
		   }
	   deltaX = deltaY = 0
	
	})
	// when the browser window loses focus,
	// for example when a modal dialog is shown,
	// cancel all ongoing events
	.on('touchcancel MSPointerCancel pointercancel', cancelAll)
	
	// scrolling the window indicates intention of the user
	// to scroll, not tap or swipe, so cancel all ongoing events
	$(window).on('scroll', cancelAll)
	});
	['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
	'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(eventName){
		$.fn[eventName] = function(callback){ return this.on(eventName, callback) }
	})
})(jQuery)
