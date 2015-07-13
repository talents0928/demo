/**
 * @author xiong
 */



var serverHost = 'http://' + window.location.host+'/'+window.location.pathname.split('/')[1]+'/';

window.cdnHost = window.cdnHost || (function(){
	return 'http://' + window.location.host+'/'+window.location.pathname.split('/')[1]+'/';
})();




var ut = {};

/**
*	对象配置
*	文件路径引用
**/

var help = ['','tmpl','cookie','touch','initTmpl','iScroll','easelJs','soundJs','tweenJs','foundation','wx',''];

/**
 *	是否开启debug模式
 */
var isDebug = $('script[src*=utils][debug=true]').length == 0 ? 0 : 1 ;
/**
 *  资源路径配置
 */
var asset = window.currAsset || {
	cssPath : ['../../css/','../../../css/'][isDebug],
	baseUrl : ['./js/lib','./js/lib/libCopy'][isDebug],
	
	'':''
}
var paths = {

//				_common : cssPath+'/common',
				_normalize : asset.cssPath + '/normalize',
				_foundationCss : asset.cssPath + '/foundation.min',

				//jquery : 'jquery-1.10.2.min',
				_css : ['css.min','css'][isDebug],
				_touch : ['touch-0.2.14.min','touch-0.2.14'][isDebug],
				_template : ['jquery.tmpl.min','jquery.tmpl.min'][isDebug],
				_iscroll : ['iscroll','iscroll'][isDebug],
				_easelJs : ['easeljs-0.8.1.min','easeljs-0.8.1.combined'][isDebug],
				_soundJs : ['soundjs-0.6.1.min','soundjs-0.6.1.combined'][isDebug],
				_tweenJs : ['tweenjs-0.6.1.min','tweenjs-0.6.1.combined'][isDebug],
				_foundation : ['foundation.min','foundation.min'][isDebug],
				_cookie : ['jquery.cookie','jquery.cookie'][isDebug],
				_wx : ['http://res.wx.qq.com/open/js/jweixin-1.0.0'],

				'':''
			};

/**
*	设置一个全局的body对象;
*	所有文本的容器
**/

var body = body ? body : 'body';

function getReqMap(){

	var finded = {} ,
		reqObj = help.concat() ;

	$("script").each(function(index,value){

		var html = $(value).html().replace(/\/\/.*\n/g,'');
		var arr = html.match(/\.\s*\w+(?=\W*)/g);
		$.each(arr||[],function(index,value){
			value = value.match(/[^\.\s]+/g)[0];
			finded[value] = true;
		});

	});
	for( var i=0 ; i<reqObj.length ; i++ ){
		if(!finded[reqObj[i]]){
			delete reqObj[i] ;
		}
	}
	return reqObj ;
};

/**
*	初始化requireJs 配置 
*	加载基本资源
**/
(function(){

		require.config({

			baseUrl : asset.baseUrl,
			paths : paths,
			map : {
				'*' : {
					css : '_css'
				}
			},
			shim : {

				_touch : {
					exports : 'touch'
				},
				_easelJs : {
					exports : 'cc'
				}
			}

		});

		//加载不等待的css资源
		require(['normalizeCss','']);

		$(function(){
			var arr = getReqMap();
			require(arr,function(){
				var len  = ut._list.length ;
				for(var i =0 ; i < len; i++){
					ut._list.shift()();
				}
			});
		});
	
})();


define('touch',['_touch'],function(a){
	ut.touch = a ;

});
define('tmpl',['_template','jquery'],function(){

	$.each( $('script:not([type*=javascript])'), function(index,value){
		$(value).html(function(){
			return $(this).html().replace(/@/g,'$');
		}) ;
	});

	$.fn.initTmpl = $.fn.tmpl ;
});
define('initTmpl',['tmpl'],function(){  });

define('cookie',['_cookie'],function(){

	//console.log(cookie);
});
define('wx',['_wx'],function(wx){
	ut.wx = wx ;
});

//define('commonCss',['css!_common']);
define('normalizeCss',['css!_normalize']);
define('foundationCss',['css!_foundationCss']);
define('foundation',['foundationCss','_foundation']);

define('iScroll',['_iscroll'],function(){
    ut.iScroll = function(wrapId,options){
    	var scroll = new IScroll(wrapId, $.extend({
			useTransition: true,
	    	vScroll: true,
	    	vScrollbar: false,
			preventDefault: false
	    },options||{}));
    	
    	scroll.on('scrollStart',function(){
    		this.refresh();
    	});
    	return scroll ;
    };
});

define('easelJs',['_easelJs'],function(data){

	ut.easelJs = createjs ;

});
define('soundJs',['_soundJs'],function(data){

	ut.soundJs = createjs ;

});
define('tweenJs',['_tweenJs'],function(data){

	ut.soundJs = createjs ;

});




ut._list = [];
ut.ready = function(callback){

	this._list.push(callback);

};
/**
*	请求css资源方法
*	@param arr{Array} 映射资源列表
**/
ut.reqCss = function(arr,callback){
	require(arr,function(){
		callback && callback();
	});
};


$(document).on('mousedown', function(e){
	var $node  = $(e.target);
	var $target = $node.is('[as]') ? $node : $node.parents('[as]') ;
	$target.length && $target.addClass($target.attr('as'));
	
});
$(document).on('mouseup', function(e){
	var $node  = $(e.target);
	var $target = $node.is('[as]') ? $node : $node.parents('[as]') ;
	$target.length && $target.removeClass($target.attr('as'));
});

ut.waiter = new (function(){

	var that = this;
	this.gifHref = 'js/asset/load.gif';
	this.size = '25px';
	this.size2 = '70px';
	this.ctrl = 'expandTp';
	this.autoStyle = "position:absolute;top:0;left:0;right:0;bottom:0;margin:auto;";
	this.dom = "<div class='"+this.ctrl+"' style='position:fixed;width:100vw;height:100vh;top:0;left:0;z-index:99999;'>" +
			"<div style='"+this.autoStyle+"width:"+this.size2+";height:"+this.size2+";display:none;background:rgba(0,0,0,0.5);border-radius:10px;'>"+
			"<div style='"+this.autoStyle+"width:"+this.size+";height:"+this.size+";' >" +
			"<img src='"+this.gifHref+"' style='width:100%;'></img></div></div>" +
			"</div>";
	
	this.expand = function(){
		$('.'+that.ctrl).remove();
		this.ele = $(this.dom);
		that.ele.appendTo('body');
		setTimeout(function(){
			if($('.'+that.ctrl).length){
				that.ele.find('div').show();
			}
			setTimeout(function(){
				if(that){
					that.ele.remove();
				}
					
			},4000);
		},600);
	};
	this.out = function(){
		that.ele.remove();
	};
});


/**
*	client 适配对象
*	调用方法 setBox();
*	@param modeW{int} 设计宽度
*	@parse modeH{int} 设计高度
**/
ut.client = (function(){
	var client = {};
	client.modeH = 1280;
	client.modeW = 720;
	
	Object.defineProperties(client,{
		w : {
			get : function(){
				return window.innerWidth ;
			}
		},
		h : {
			get : function(){
				return window.innerHeight ;
			}
		}
	});

	//正确屏幕的宽高比
	client.ratio = client.modeW/client.modeH;
	client.error = 1.35;
	
	client.init = function(){

		//屏幕宽度失调率
		this.imbalance = this.w/(this.h*this.ratio);
		this.isBalance = this.imbalance>this.error?false:true;
		this.seeH = this.h;
		this.seeW = this.isBalance ? this.w : this.h*this.ratio;
		
		this.scaleW = this.seeW/this.modeW;
		this.modeH = this.isSingle ? this.seeH/this.scaleW : this.modeH ;
		this.scaleH = this.seeH/this.modeH ;
	};
	
	client.gbox = $("<div class='gbox'></div>");

/**
 * 解析正确的手势位置
 */
	client.unX = function(x){
		return ( x - this.gbox.offset().left ) / this.scaleW ;
	};
	client.unY = function(y){
		return y / this.scaleH ;
	};
	client.setBox = function(modeW,modeH){

		if(!window.body || window.body == 'body'){
			if($('.gbox').length){
				this.gbox = $('.gbox') ;
			}else{
				this.gbox.append($('body').children(':not(script):not(style)'))
					.wrap("<div></div>").parent().appendTo($('body'));
			}
			setDefault();
			window.body = this.gbox ;
		}
		client.modeW = modeW || client.modeW ;
		client.isSingle = client.isSingle || ( ( modeW ^ modeH ) ? true : false );
		client.modeH = modeH || ( modeW ? null : client.modeH ) ;
		

		this.init();

		this.gbox.parent().css({

			width : this.seeW + 'px',
			height : this.seeH + 'px',
			margin : 'auto',
			overflow : 'hidden',
			position : 'absolute',
			top : '0',
			left : '0',
			right : '0'

		});
		this.gbox.css({

			width : this.modeW + 'px',
			height : this.modeH ? (this.modeH + 'px') : this.seeH/this.scaleW+'px',
			position : 'absolute',
			overflow : 'hidden',
			left : 0,
			top : 0,
			transformOrigin : '0 0',
			transform : 'scale('+this.scaleW+','+this.scaleH+')'

		});

	};
	
	function setDefault(){
		$(window).on('resize orientationchange',function(){
			client.setBox();
		});
		$(document).on('touchmove',function(e){
			e.preventDefault();
		});
	}

	return client;
	
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
}
//通用方法，按照某个字段对data进行排序，data可以是array或者object
//key是排序用的字段，desc表示是否降序，desc为true表示降序，不传则默认升序
ut.sortData = function(data, key, desc){
    //key是数组;
    var re;
    if (typeof data == 'array') 
        re = data;
    else 
        re = ut.toArray(data);
   
    function compare(a, b, i){
        //i key数组中的第几个
        i = i || 0;
        if (a[key[i]] == b[key[i]]) {
            return key.length > i ? compare(a, b, i + 1) : false;
        }
        else {
            if (typeof a[key[i]] == 'number') {
                return desc ? b[key[i]] - a[key[i]] : a[key[i]] - b[key[i]];
            }
            else {
                return false;
            }
        }
        
    };
    
    re.sort(function(a, b){
        if (key instanceof Array) {
            return compare(a, b);
        }
        else {
            return desc ? (b[key] - a[key]) : (a[key] - b[key]) ;
        }
        
    });
    return re;  
};


function _getAllurl( cmd ){
	return serverHost + cmd;
};
//向后台发送ajax请求
ut.send = function(url,cb,options){

	if(typeof cb != 'function'){
		options = cb ;
		cb = false ;
	}

	if(options instanceof jQuery){
		options = options.serialize() ;
	}

	ut.waiter.expand();
	$.ajax({
		method : 'post',
		url : _getAllurl(url),
		timeout: 8000,
		data : options||{},
		success : function(data){
			console.log(data);
			ut.waiter.out();
			if( data && data.callback === true ){
				cb && cb(data.data,data);
			}else{
				console.error('callback false') ;
				//ut.showMsg(data.msg);
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown){
			ut.waiter.out();
			console.log(textStatus);
		}
	});
};

// ut.sendForm = function(url,form,cb){
// 	ut.waiter.expand();
// 	form.ajaxSubmit({
// 		url: _getAllurl(url),
// 		success: function(data){
// 			console.log(data);
// 			if(data&&data.callback){
// 				cb&&cb(data.data,data);
// 			}else{
// 				console.log(data.msg);
// 				//ut.showMsg(data.msg);
// 			}
// 			ut.waiter.out();
// 		},
// 	});
// }

	
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
			var img = new Image();
			var obj = _list.pop() ;
			
			img.src = obj.src ? obj.src : obj ;
			obj.id && ( _cacheList[obj.id] = img );
			
			if(img.complete){
				count --;
				excuEnd();
			}else{
				img.onload = function(evt){
					count --;
					excuEnd();
				}
				img.onerror = function(){
					count --;
					miss ++ ;
					excuEnd() ;
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
					if(url){
						for(var i=0; i< args.length; i++ ){
							if( isObject(args[i]) ){
								args[i].src = url + '/' + args[i].src ;
							}else{
								args[i] =  url + '/' + args[i] ;
							}
						}
					}
					Array.prototype.push.apply(_list,args);
				}
				return this;
			},
			start : function(){
				loadList(this);
			},
			getImgById : function( id ){
				return _cacheList[id] ;
			},
			setCallback : function( cb ,failcb ){
				_cb = cb ;
				_failcb = failcb || _cb ;
				return this;
			}
				
	};
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
