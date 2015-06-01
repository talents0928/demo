/**
 * @author xiong
 */



var serverHost = 'http://' + window.location.host+'/'+window.location.pathname.split('/')[1]+'/';

window.cdnPath = window.cdnPath || (function(){
	return 'http://' + window.location.host+'/'+window.location.pathname.split('/')[1]+'/';
})();







var ut = {};

/**
*	对象配置
*	文件路径引用
**/

var help = ['client','cookie','touch','initTmpl','iScroll','easelJs','soundJs','foundation'];
var cssPath = '../../css/';
var paths = {

				_common : cssPath+'/common',
				_normalize : cssPath + '/normalize',
				_foundationCss : cssPath + '/foundation.min',

				jquery : 'jquery-1.10.2.min',
				_touch : 'touch-0.2.10',
				_template : 'jquery.tmpl.min',
				_iscroll : 'iscroll',
				_easelJs : 'easeljs-0.8.1.min',
				_soundJs : 'soundjs-0.6.1.min',
				_foundation : 'foundation.min',
				_cookie : 'jquery.cookie'

			};

/**
*	设置一个全局的body对象;
*	所有文本的容器
**/

var body = body ? body : 'body';

function getReqMap(){

	var finded = {};
	var reqObj = help;
	var reqArr = [];

	$("script").each(function(index,value){

		var html = $(value).html().replace(/\/\/.*\n/g,'');
		var arr = html.match(/\.(\w+)(?=\W)/g);
		$.each(arr||[],function(index,value){
			value = value.match(/[^\.]+/g)[0];
			finded[value] = true;
		});

	});
	for( var i=0 ; i<reqObj.length ; i++ ){
		if(finded[reqObj[i]]){
			reqArr.push(reqObj[i]);
		}
	}
	return reqArr ;
};

/**
*	初始化requireJs 配置 
*	加载基本资源
**/
(function(){


		require.config({

			baseUrl : './js/lib',
			//baseUrl : './js/lib/libCopy',

			paths : paths,

			map : {
				'*' : {
					css : 'css'
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

		var baseAsset = (function(){
			var arr = ['jquery',];
			return arr;
		})();
		
		//加载不等待的css资源
		require(['normalizeCss','commonCss']);

		require(baseAsset,function(){
			var arr = getReqMap();
			$(function(){
				ut.$_deps();
				require(arr,function(){
					var len  = ut._list.length ;
					for(var i =0 ; i < len; i++){
						ut._list.shift()();
					}
				});
			});
		});
	
})();


define('touch',['_touch'],function(a){
	ut.touch = a ;

});
define('initTmpl',['_template','jquery'],function(){
	$.fn.initTmpl = function(data){
		return this.html(function(){
			return $(this).html().replace(/@/g,'$');
		}).tmpl(data);
	};
});

define('cookie',['_cookie'],function(){

	//console.log(cookie);
});

define('commonCss',['css!_common']);
define('normalizeCss',['css!_normalize']);
define('foundationCss',['css!_foundationCss']);
define('foundation',['foundationCss','_foundation']);

define('iScroll',['_iscroll'],function(){
    ut.iScroll = function(wrapId){
    	var scroll = new IScroll(wrapId, {
			useTransition: true,
	    	vScroll: true,
	    	vScrollbar: false,
			preventDefault: false
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



ut._list = [];
ut.ready = function(callback){

	this._list.push(callback);

};

ut.reqCss = function(arr,callback){
	require(arr,function(){
		callback && callback();
	});
};


//默认绑定事件  按钮事件
ut.$_deps = function(){
	
		
	$(document.body).on('touchstart mousedown', function(e){
		var $node  = $(e.target);
		var $target = $node.is('[as]') ? $node : $node.parents('[as]').length ? $node.parents('[as]') : false;
		$target && $target.addClass($target.attr('as'));
		
	});
	$(document.body).on('touchend mouseup', function(e){
		var $node  = $(e.target);
		var $target = $node.is('[as]') ? $node : $node.parents('[as]').length ? $node.parents('[as]') : false;
		$target && $target.removeClass($target.attr('as'));
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
						console.log('它居然还杂i');
					}
						
				},4000);
			},600);
		};
		this.out = function(){
			that.ele.remove();
		};
	});
};

/**
*	client 适配对象
*	调用方法 setBox();
*	@param modeW{int} 设计宽度
*	@parse modeH{int} 设计高度
**/

define('client',function(){

	ut.client = (function(){
		client = {};
		client.modeH = 960;
		client.modeW = 640;
		
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
		client.error = 1.2;
		
		client.init = function(){

			//屏幕宽度失调率
			this.imbalance = this.w/(this.h*this.ratio);
			this.isBalance = this.imbalance>this.error?false:true;
			this.seeH = this.h;
			this.seeW = this.isBalance ? this.w : this.h*this.ratio;
			
			this.scaleW = this.seeW/this.modeW;
			this.scaleH = this.modeH ? this.seeH/this.modeH : this.scaleW;
		};
		
		client.gbox = $("<div class='gbox'></div>");

		client.setBox = function(modeW,modeH){

			if(!window.body || window.body == 'body'){
				this.gbox.append($('body').html()).wrap("<div></div>").parent().appendTo($('body').empty());
				window.body = this.gbox ;
			}

			client.modeW = modeW || client.modeW ;
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
		
		$(window).on('resize',function(){
			client.setBox();
		});
		$(window).on('orientationchange',function(){
			client.setBox();
		});

		return client;
		
	})();

});

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
            if (desc) 
                return b[key] - a[key];
            else 
                return a[key] - b[key];
        }
        
    });
    return re;  
};


var _getAllurl = function(cmd,options){
//		return 'http://' + window.location.host+'/'+window.location.pathname.split('/')[1]+'/'+cmd;
		
		return serverHost + cmd;
	};
//向后台发送ajax请求
ut.send = function(url,cb,options){
	ut.waiter.expand();
	$.ajax({
		method : 'post',
		url : _getAllurl(url,options),
		timeout: 20000,
		data : options||{},
		success : function(data){
			ut.waiter.out();
			if(data&&data.callback==true){
				cb&&cb(data.data,data);
			}else{
				ut.showMsg(data.msg);
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown){
			ut.waiter.out();
			console.log(textStatus);
		}
	});
};

ut.sendForm = function(url,form,cb){
	ut.waiter.expand();
	form.ajaxSubmit({
		url: _getAllurl(url),
		success: function(data){
			console.log(data);
			if(data&&data.callback){
				cb&&cb(data.data,data);
			}else{
				console.log(data.msg);
				ut.showMsg(data.msg);
			}
			ut.waiter.out();
			
		},
	});
}
	


ut.manage = (function(){

	function isArray ( obj ){
		return toString.call(obj) == "[object Array]" ? true : false ;
	};
	function loadList ( manage ) {
		var size = manage.list.length ;
		var count = size ;
		var miss = 0;

		for( var i=0; i<size; i++ ){
			var img = new Image();
			img.src = manage.list.pop();
			
			if(img.complete){
				count --;
				excuEnd();
			}else{
				img.onload = function(){
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
			if(count == 0){
				miss > 0 ? manage.failback( miss ) : manage.callback();
			}
		}
	}

	return {
			
			list : [],
			add : function( args , url ){

				if(isArray(args)){
					if(url){
						var i , len = args.length ;
						for( i=0; i<len; i++ ){
							args[i] =  url + args[i] ;
						}
					}
					Array.prototype.push.apply(this.list,args);
				}
				return this;
			},
			start : function(){
				loadList(this);
			},
			setCallback : function( cb ,failcb ){
				this.cb = cb;
				this.failcb = failcb || this.cb;
				return this;
			},
			callback : function(){
				this.cb&&this.cb();
			},
			failback : function(miss){
				console.error('miss is '+miss);
				this.failcb&&this.failcb();
			}

				
	};
})();


