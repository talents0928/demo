/**
 * @author viggo
 * @date 2016-12-01
 */
var serverHost = 'http://' + window.location.host+'/'+window.location.pathname.split('/')[1]+'/';
window.cdnHost = window.cdnHost || serverHost ;

var ut = ut||{};
var body = body ? body : 'body'; //全局对象，所有文本容器
var helpMap = [] ; //引用对象映射组

(function(){
	/**
	*	是否开启debug模式
	*	<script type='text/javascript' debug='true' src='utils.js'></script>
	*/
	var isDebug = $('script[src*=utils][debug=true]').length ;
	var asset = (function(){
		// 资源路径配置
		var path = $('script[src*=utils]').attr('src') ;
		path = path.slice(0,path.indexOf('js/utils'));
		return {
			baseUrl : [path+'js/lib',path+'js/lib/unZip'][isDebug],
			cssPath : ['../../css/','../../../css/'][isDebug],
			conponentPath : ['../component','../../component'][isDebug],
		}
	})();
	var paths = {

//				_common : cssPath+'/common',
				_normalize : asset.cssPath + '/normalize',
				_ueditor : asset.cssPath + '/ueditor',
				_componentJs :  asset.conponentPath + '/component' ,
				_mobiscrollCss : asset.cssPath + 'mobiscroll.min',

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
				_mobiscroll : ['mobiscroll.min','mobiscroll.min'][isDebug],
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
		shim : {
			_easelJs : { exports : 'cc' },
			_wxdt : { exports : 'dd' }
		}
	});

	$.holdReady(true);
	window.onload = function(){
		require(['_componentJs','tmpl','normalizeCss'].concat(getReqMap()),function(){
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


/** 本地require函数 */
ut.require = function(arr,cb){
	$.holdReady(true);
	require(arr,function(){
		cb&&cb();$.holdReady(false);
	});
};
/** 自定义define函数，自动收集映射 */
ut.define = function(name,deps,cb){
	helpMap.push(name);
	define(name,deps,cb) ;
};

/** 
 * 多行字符串处理函数
 * @param {Object} fn
 */
ut.mutiStr = function(fn) {
	return fn.toString().split('\n').slice(1,-1).join('\n') + '\n' ;
};
/**
 * 使用字符串创建函数
 * @param {Object} fn
 */
ut.template = function(fn){
	var $tmpl = $(ut.mutiStr(fn));
	$.template($tmpl.attr('id'),$tmpl.html().replace(/.{1}@/g,function(str){
		return str=='\\@' ? '@' : str.replace(/@/g,'$');
	}));
};


ut.define('tmpl',['_template','jquery'],function(){
	$.each( $('script[type]:not([type*=javascript])'), function(index,value){
		var $value = $(value).remove();
		$.template($value.attr('id'),$value.html().replace(/.{1}@/g,function(str){
			return str=='\\@' ? '@' : str.replace(/@/g,'$');
		}));
	});
});

ut.define('cookie',['_cookie'],function(){
	//console.log(cookie);
});
ut.define('mobiscroll',['_mobiscroll','css!_mobiscrollCss'],function(){
	
	ut.mobiscroll = function($,opts){
		var curr = new Date();
		
		$.mobiscroll().datetime($.extend({
			context : body ,
			minWidth:110,
			height:60,
	        theme: undefined,     // Specify theme like: theme: 'ios' or omit setting to use default 
	        mode: 'mixed',       // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
	        display: 'modal', // Specify display mode like: display: 'bottom' or omit setting to use default 
	        lang: 'zh',       // Specify language like: lang: 'pl' or omit setting to use default
	        headerText : "<div class='fullw flex tac' style='font-size:28px;line-height:60px;'><div class='flex1'>年</div><div class='flex1'>月</div><div class='flex1'>日</div>"
	        				+
	        			"<div class='flex1'>时</div><div class='flex1'>分</div></div>" ,
	        minDate: curr,  // More info about minDate: http://docs.mobiscroll.com/2-14-0/datetime#!opt-minDate
	        maxDate: (new Date()).setFullYear(curr.getFullYear+2),   // More info about maxDate: http://docs.mobiscroll.com/2-14-0/datetime#!opt-maxDate
	        cancelText : "<div style='font-size:28px;'>取消</div>" ,
			setText : "<div style='font-size:28px;'>确定</div>" ,
	        stepMinute: 1  // More info about stepMinute: http://docs.mobiscroll.com/2-14-0/datetime#!opt-stepMinute
	    },opts));
	};
	
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
ut.define('wx',['_wx'],function(data){
	ut.wx = data ;
});
ut.define('wxPay',function(){
	var wechatCfg ;
	function onBridgeReady(){
        WeixinJSBridge.invoke('getBrandWCPayRequest', {
            "appId": wechatCfg.appId, //公众号名称，由商户传入     
            "timeStamp": wechatCfg.timeStamp, //时间戳，自1970年以来的秒数     
            "nonceStr": wechatCfg.nonceStr, //随机串     
            "package": wechatCfg.pkg,
            "signType": wechatCfg.signType, //微信签名方式:     
            "paySign": wechatCfg.paySign //微信签名 
        }, function(res){
            if (res.err_msg == "get_brand_wcpay_request:ok") {
				wechatCfg.cb && wechatCfg.cb();
            }else{
            	if(wechatCfg.failcb){
            		wechatCfg.failcb(res)
            	}else{
            		alert('支付失败');
            	}
			}
        });
	} ;
	/**
	 * @param config{object} 微信支付配置
	 * @param cb{function} 微信支付后回掉
	 */
	ut.wxPay = function(config,cb,failcb){
		wechatCfg = config ;
		wechatCfg.cb = cb ;
		wechatCfg.failcb = failcb ;
		if (typeof WeixinJSBridge == "undefined") {
	        if (document.addEventListener) {
	            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
	        }
	        else if (document.attachEvent) {
	            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
	            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
	        }
	    }else {
	        onBridgeReady();
	    }
	};
});
/** 微信地图 **/
ut.define('wxdt',['_wxdt'],function(data){
	ut.wxdt = function(elementId,x,y){
		var map = new qq.maps.Map(document.getElementById(elementId),{
	        // 地图的中心地理坐标。
	        center: new qq.maps.LatLng(39.916527,116.397128)
	    });
		return map ; 
	} ;
});
/**
 * ut.jumpMap 根据经纬度跳转地图
 * @param x 经度
 * @param y 纬度
 * @param title 地图标题（必填）
 */
ut.jumpMap = function(x,y,title){
	if(x&&y&&title){
		var href = "http://apis.map.qq.com/uri/v1/marker?marker=coord:"+x+","+y+";title:"+title+";";
		location = href ;
	}else{
		var str = !x ? 'x' : !y ? 'y' : 'title' ;
		try{
			ut.showMsg('未传入参数'+str);
		}catch(e){}
		
	}
} ;
/**
 * 手机摇一摇函数
 * @param {Function} start 起摇函数
 * @param {Function} end 结束函数
 */
ut.mutation = function(start,end){
	 if (window.DeviceMotionEvent) { 
		 window.addEventListener('devicemotion',deviceMotionHandler, false);  
	 }

	   var SHAKE_THRESHOLD = 500;  
	   var last_update = 0 ;  
	   var x, y, z, last_x, last_y, last_z;  
	   var setTimer  ;
     
	   function deviceMotionHandler(eventData) { 
		   
	     var curTime = new Date().getTime();  
	     if ((curTime - last_update)> 500) {  
	    	 var acceleration =eventData.accelerationIncludingGravity;  
	         var diffTime = curTime -last_update;  
	         last_update = curTime;  
	         x = acceleration.x;  
	         y = acceleration.y;  
	         z = acceleration.z;  
	         var speed = Math.abs(x +y + z - last_x - last_y - last_z) / diffTime * 10000;  
	         
	          if (speed > SHAKE_THRESHOLD) {  
	                 if(setTimer){
	                 	clearTimeout(setTimer) ;
	                 }else{
	                 	start && start();
	                 	SHAKE_THRESHOLD = 300 ;
	                 }
	                 setTimer = setTimeout(function(){
	                 	setTimer  = null ;
	                 	SHAKE_THRESHOLD = 500 ;
	                 	end&&end();
	                 },1200) ;
	     		}  
	         last_x = x;  
	         last_y = y;  
	         last_z = z;  
	      }  
	   }  
};
/** 获得GPS地理位置列表 */
ut.define('addr',['iScroll'],function(){
	ut.addr = function(position,cb){
		ut.template(function(){/*
			<script type='x' id='cpAddrTmpl'>
				<div class='full pa00 bb' style='background:white;padding:10px 0px;z-index:99;' id='ADDEESSWrap'>
					<ul class='fs28'>
					<div class='ADDRESSTp' style='line-height:72px;padding:15px 20px; '>
						<div class='' style='color:#161616;'>不显示位置</div>
					</div>
					<div style='margin:auto 20px;height:1px;background:#EEEEEE;'></div>
					<div class='ADDRESSTp' style='line-height:72px;padding:15px 20px;' name='@{result.address_component.city}'>
						<div class='' style='color:#161616;'>@{@data.result.address_component.city}</div>
					</div>
					<div style='margin:auto 20px;height:1px;background:#EEEEEE;'></div>
					{{each @data.result.pois||[]}}
					<div class='ADDRESSTp' style='line-height:1.4;padding:15px 20px;' name='@{title}' as='op3' >
						<div class='' style='color:#161616;'>@{title}</div>
						<div class='fs24' style='color:#737373;'>@{address}</div>
					</div>
					<div style='margin:auto 20px;height:1px;background:#EEEEEE;'></div>
					{{/each}}
					</ul>
				</div>
			</script>
		*/});
		var key = 'F6QBZ-HTB3W-I32RN-OBDBO-2A5SS-5EFT4';
		ONSUCC =  function(back){
			$.tmpl('cpAddrTmpl',back).appendTo(sky).on('tap','.ADDRESSTp',function(){
				var name = $(this).attr('name') ;
				$('#ADDEESSWrap').fadeOut(350,function(){
					$(this).remove();
				}) ;
				cb && cb(name) ;
			});
			ut.iScroll('#ADDEESSWrap');
		} ;
		$.ajax({
			type:'GET',
			dataType: 'jsonp',
			url : 'http://apis.map.qq.com/ws/geocoder/v1/?location='+position.latitude+','+position.longitude+'&key='+key+'&get_poi=1&output=jsonp&callback=ONSUCC',
		});
	};
});
ut.define('playVideo',['http://qzs.qq.com/tencentvideo_v1/js/tvp/tvp.player.js'],function(data){
	
	//介绍地址：http://blog.sina.com.cn/s/blog_7f95e24b0101db2r.html
	function getVideoId(url){
		url = url||'';
		var id = url.match(/(?:vid=)(\w{11})/i);
		id = id ? id[1] : id ;
		var arr = url.split('/');
		return id || arr[arr.length-1].split('.')[0] ;
	};
	function configParam(player,obj){
		$.each(obj,function(i,v){
			player.addParam(i,v) ;
		});
	};
	/**
	 * 腾讯视频播放调起函数
	 * @param {Object} express
	 * @param {Object} url
	 * @param {Object} opts
	 */
	ut.playVideo = function(express,url,opts){
		if(typeof url=='object'){
			opts = url ;
			url = null ;
		}
		opts = opts||{};
		var id = getVideoId(url);
		//定义视频对象
		var video = new tvp.VideoInfo();
		video.setVid(id||"a01225kc3i9");
		var player = new tvp.Player(opts.width||640,opts.height||360);
	    player.setCurVideo(video);
	    
	    configParam(player,$.extend({
	    	//设置精简皮肤，仅点播有效
	    	flashskin : "http://imgcache.qq.com/minivideo_v1/vd/res/skins/TencentPlayerMiniSkin.swf" ,
	    	//是否自动播放 0 不 1 是
	    	autoplay : 0,
			wmode : 'transparent',
			adplay : 0 ,
			//给视频开始添加默认图片
//			pic : "http://img1.gtimg.com/ent/pics/hv1/75/182/1238/80547435.jpg" ,
			showcfg : 1
	    },opts));
	    
	    player.write(express);
	    return player ;
	}
});

ut.define('normalizeCss',['css!_normalize']);

ut.define('iScroll',['_iscroll'],function(){
    ut.iScroll = function(wrapId,options){
    	if(typeof options == 'boolean' && options === true ){
    		options = { scrollX: true, scrollY: false } ;
    	}
    	$(wrapId).addClass('preventDefault');
    	var scroll = new IScroll(wrapId,$.extend({
    		useTransition: true,
    		scrollX: false, scrollY: true,
	    	scrollbars: false ,fadeScrollbars: true ,
    		preventDefault: false , deceleration : 0.008 ,
	    	HWCompositing : ut.UA().system != 'os'
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

ut.define('flux',['_flux','jquery'],function(data){
	ut.flux = function($ele,opts){
		var f = new flux.slider('#slider',$.extend({
			autoplay: true,
			pagination: false,
			transitions : ['blocks2'],
			delay: 4500,
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

ut.define('easelJs',['_easelJs','_tweenJs','_soundJs'],function(data){
	
	ut.easelJs = createjs ;

});
ut.define('soundJs',['_soundJs'],function(data){

	var Sound = (function(){
		var _instances = {} ;
		return {
			createSound : function(rgt,cb){
				var _this = this ;
				createjs.Sound.addEventListener("fileload", function(){
					createjs.Sound.removeAllEventListeners("fileload") ;
					cb&&cb(_instances[rgt.id]) ;
				});
				createjs.Sound.registerSound(rgt);
				_instances[rgt.id] = createjs.Sound.createInstance(rgt.id) ;
			},
			getSound : function(path,cb){
				var rgt = typeof path == 'object' ? path : {id:path,src:path} ;
				var sound = _instances[rgt.id] ;
				if(sound){
					cb && cb(sound);
				}else{
					this.createSound(rgt,cb) ;
				}
			}
		};
	})();
	
	ut.soundJs = function(path,cb){
		Sound.getSound(path,cb);
	};

});
/**
 * velocity
 * 一个高效的动画函数
 */
ut.define('velocity',['_velocity'],function(data){
	
});

/**
 * ueditorText
 * 实现文本编辑前后同步
 * 2016-10-31
 */
ut.define('ueditor',['css!_ueditor'],function(data){
	ut.ueditor = function(context,rate){
		context = context || "<div></div>" ;
		rate = rate || 2 ;
		ut.template(function(){/*
			<script type='x' id='ueditorTmpl'>
				<ueditor>
				<style type='text/css'>
					.ueditorTp{ 
						-webkit-transform-origin : 0 0 ;
						-webkit-transform:scale(rate);
						font-size: 16px;
						text-align:justify;
					}
					.ueditorTp *{
						box-sizing: border-box;
					    -webkit-box-sizing: border-box;
					    max-width:100%;
					}
				</style>
				<div class='ueditorHTp'>
					<div class='ueditorTp'>{{html @data}}</div>
				</div>
				</ueditor>
			</script>
		*/});
		setTimeout(function(){
			$('.ueditorTp img').css({'max-width':'100%','height':'auto'});
			$('.ueditorTp').width($('.ueditorHTp').width()/rate);
			$('.ueditorHTp').height($('.ueditorTp').height()*rate);
			ut.watch("$('.ueditorTp').height()",function(now,old){
				$('.ueditorHTp').height(now*rate);
			});
		},100);
		
		return $.tmpl('ueditorTmpl',context).html().replace(/scale\(rate\)/g,function(b){
			return 'scale('+rate+')';
		});
	};
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
	//设置阻止事件冒泡的div
	$(document).on('touchmove','.preventDefault',function(e){
		if( !$(e.target).is('textarea,video') ){
			e.preventDefault();
		}
	});
}();

	/**
	 * <input required="＊＊必填" pattern="number" error="＊＊输入有误"  />
	 * #pattern 匹配格式
	 * #error 错误提示
	 * #required 标识必填字段
	 * date 2016-09-28
	 */	
	function Verify(failcb){
		this.settings = {
				alpha : /^[a-zA-Z]+$/,
		        alpha_numeric : /^[a-zA-Z0-9]+$/,
		        integer : /^[-+]?\d+$/,
		        number : /^[-+]?\d*(?:[\.\,]\d+)?$/,
	
		        // amex, visa, diners
		        card : /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
		        cvv : /^([0-9]){3,4}$/,
		        //身份证号码
		        cardId : /^(\d{17}|\d{14})[\dXx]{1}$/,
		        //电话号码
		        tel : /^\d{11}$/ ,
		        //中文名
		        nameCn : /^[\u2E80-\uFE4F]+$/,
	
		        // http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
		        email : /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,
	
		        // http://blogs.lse.ac.uk/lti/2008/04/23/a-regular-expression-to-match-any-url/
		        url: /^(https?|ftp|file|ssh):\/\/([-;:&=\+\$,\w]+@{1})?([-A-Za-z0-9\.]+)+:?(\d+)?((\/[-\+~%\/\.\w]+)?\??([-\+=&;%@\.\w]+)?#?([\w]+)?)?/,
	
		        // #FFF or #FFFFFF
		        color : /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
		} ;
		this.failcb = failcb || function(){};
	};
	Verify.prototype.canPass = function($value){
		
		var val = $value.val()||'' ;
		if( $value.prop('required') && val == '' ){
			this.target = $value ;
			var required = $value.get(0).getAttribute('required') ;
			this.error = required== '' ? '内容填写不全' : required ;
			return false ;
		}
		var pattern = $value.attr('pattern') ;
		if( pattern){
			pattern = this.settings[pattern] || pattern ;
			this.target = $value ;
			this.error = $value.attr('error') || '填写格式不正确' ;
			return typeof pattern == 'function' ? pattern($value) : val==''||new RegExp(pattern).test(val) ;
		}
		return true ;
	};
	Verify.prototype.check = function($form){
		$form = $form || $(document) ;
		var isPass = true ;
		var _this = this ;
		$form.find('[required],[pattern]').each(function(index,value){
			if(!_this.canPass($(value))){
				return isPass = false ;
			}
		});
		if(!isPass){
			this.failcb(this.error , this.target);
		}
		return isPass ;
	};
	
	ut.verify = function($form,failcb){
		if(typeof $form == 'function'){
			$form = $(document) ;
			failcb = $form ;
		}
		var v = new Verify(failcb);
		return v.check();
	};


/** 智能转换json对象 **/
ut.jsonTo = function(str){
	try{
		return JSON.parse(str||null)||{} ;
	}catch(e){ return {} ; }
};
/** 设备嗅探 **/
//date 2016-10-11
ut.UA = function(){
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
		isAndroid : _system == 'android' ,
		isPC : !/ipad|iphone|android/.test(s) ,
		isWX : /MicroMessenger/i.test(s),
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
};


(function(){
	//date 2016-9-27
	function Heartbeat(){
		var vendors = ['webkit', 'moz'];
	    for (var i = 0; i < vendors.length && !this.requestAnimationFrame; ++i) {
	        var vp = vendors[i];
	        window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
	        window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
	                                   || window[vp+'CancelRequestAnimationFrame']);
	    }
		if(!window.requestAnimationFrame || !window.cancelAnimationFrame){
			var lastTime = 0;
	        window.requestAnimationFrame = function(callback) {
	            var now = Date.now();
	            var nextTime = Math.max(lastTime + 16, now);
	            return setTimeout(function() { 
					callback(lastTime = nextTime);
				},nextTime - now);
	        };
	        window.cancelAnimationFrame = clearTimeout;
		};
	}
	Heartbeat.prototype.watch = function(fn,callback,self){
		var _this = this ;
		self = self || window ;
		function loop(timestamp){
			var result = fn&&fn.call(self,timestamp);
			callback && callback(result);
			_this.RAFID = window.requestAnimationFrame(loop) ;
		};
		loop() ;
		return this;
	};
	Heartbeat.prototype.stop = function(){
		window.cancelAnimationFrame(this.RAFID||null);
	};
	window.Heartbeat = Heartbeat ;
	ut.watch = function(express,listener,self){
		var fn ;
		self = self || window ;
		if(typeof express == 'string'){
			try{
				fn = new Function("return "+express);
			}catch(e){
				console.error('表达式错误');
				return ;
			}
		}else{
			fn = express ;
		}
		var old = fn.call(self);
		return new Heartbeat().watch(fn,function(res){
			if(res !== old){
				listener(res,old) ;
				old = res ;
			}
		},self);
	};
	
})();



/**
*	client  
*	调用方法 ut.client.box();
*	@param modeW{int} 设计宽度
*	@parse modeH{int} 设计高度
**/
ut.client = window.client = (function(){
	//date 2016-11-9
	var client = { 
		modeW : 640 , modeH : 1008 , error : 1.3 , perW : 0.72 ,
		config : function(config){
			return $.extend(client,config) , this;
		}
	};
	client.config({
		ZI02 : -200 ,
		ZI01 : -100 ,
		ZI00 : 0 ,
		ZI11 : 100 ,
		ZI12 : 200 ,
		ZI13 : 300 
	});
	Object.defineProperties(client,{
		w : { get : function(){ return window.innerWidth ; } },
		h : { get : function(){ return window.innerHeight ; } },
		//屏幕宽高比率
		ratio : { get : function(){ return this.w / this.h ; } }
	});
	client.getX = function(x){ return ( x - this.gbox.offset().left ) / this.scaleW ; };
	client.getY = function(y){ return y / this.scaleH ; };
	
	
	client.box = function(modeW,modeH){
		
		var self = this ;
		this.modeW = modeW || this.modeW ;
		this.modeH = modeH || (modeW ? false : this.modeH ) ;
		
		//添加必须样式
		this.gboxlayer = self.createCss(".gboxLayer {pointer-events: none;}.gboxLayer * {pointer-events: auto;}");
		var content = $('body').children(':not(script,style,title,meta,link)') ;
		window.body = this.gbox = this.addLayer({
			name : 'gbox' ,
			parent : { position : 'relative','z-index' : self.ZI00 }
		}).append(content);
		this.sky = this.addLayer({
			name : 'sky' ,
			parent : { top:'auto', 'z-index' : self.ZI12 }
		});
		this.underground = this.addLayer({
			name : 'underground' ,
			parent : {'z-index' : self.ZI02}
		});
		this.exec();
		this.events();
	} ;
	client.events = function(){
		var self = this;
		$(window).on('resize orientationchange',function(){
			if(!$(document.activeElement).is('input,textarea')){ 
				self.exec();
			}
		});
		var timer = null ;
		$(window).on('scroll',function(e){
			var abs = Math.abs($('body').scrollTop()+self.seeH - self.gbox.parent().height()) ;
			if(abs<=5){
				timer = timer||setTimeout(function(){
					$(window).trigger('scrollEnd');
					timer = null ;
				},100) ;
			}
		});
		self.gbox.parent().height(self.gbox.height()*self.scaleH);
		ut.watch("this.gbox.height()*this.scaleH",function(now,old){
			self.gbox.parent().height(now);
		},this);
		this.mutationObserver(this.gbox.get(0),function(mutations){
			self.gbox.find('[fixed]').appendTo(self.sky);
		},{
			'attributeFilter' : ['fixed']
		});
	};
	client.exec = function(){
		
		if(ut.UA().isPC){
//			如果pc窗体同高设置
			this.perW = this.modeH ? this.modeW*this.h/this.modeH/this.w : 0.6 ;
		}
		if(this.modeH){
			this.imbalance  = this.ratio / (this.modeW/this.modeH) ;
			this.isBalance = this.imbalance <= this.error ? true : false ;
		}else{
			this.isBalance = false ;
		}
		
		this.seeH = this.h ;
		/** 还未判断modeH的情况 **/
		this.minPerW = this.modeH ? this.modeW*this.seeH/(this.modeH * this.w ) : 0 ;
		this.factPerW = this.perW >= this.minPerW ? this.perW : this.minPerW ;
		
		this.seeW = this.ratio >= 1 ? this.w * this.factPerW : this.w ;
		
		
		this.scaleW = this.seeW/this.modeW;
		this.scaleH = this.isBalance ? this.seeH / this.modeH : this.scaleW ;
		//调整显示比例,使div等比显示
		this.adjust = this.scaleW/this.scaleH ;
		//屏幕对象参数
		this.screenW = this.modeW ;
		this.screenH = this.seeH / this.scaleH ;
		
		this.refreshLayers();
	};
	client.refreshLayers = function(){
		
		var self = this ;
		$.each(this.layers||[],function(i,v){
			self[v.name].config = v ;
			self[v.name].parent().css($.extend({
				width : self.seeW + 'px', 
				'min-height' : self.seeH + 'px',
				'pointer-events' : 'none' ,
				margin : 'auto' ,
				position : 'fixed',
				top:0,right:0,left:0,bottom:0,
				overflow : 'hidden'
			},v.parent));
			self[v.name].css($.extend({
				width : self.modeW + 'px',
				
				'min-height': ( v.name=='gbox' &&  self.modeH ) ? self.modeH : self.seeH/self.scaleH ,
//				'min-height' : self.seeH/self.scaleH+'px',
				overflow : 'hidden',
				position : 'absolute',
				transformOrigin : '0 0',
				transform : 'scale('+self.scaleW+','+self.scaleH+')'
			},v.self)).addClass('flexColumn gboxLayer');
		});
		self.rectify = self.createCss(".rectify{-webkit-transform:scaleY("+self.scaleW/self.scaleH+")}",self.rectify) ;
		return ;
	} ;
	client.addLayer = function(config){
		this.layers = this.layers || [] ;
		this.layers.push(config);
		return this[config.name] = $("<div><div class='"+config.name+"'></div></div>").appendTo('body').children();
	};
	client.mutationObserver = function(target,cb,config){
		var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver ;
		cb = cb || new Function() ;
		var observer = new MutationObserver(cb);
		config = $.extend({ 
			'childList': true,
	        'subtree': true ,
	        'attributeFilter' : ['style','fixed','class'] ,
	        'attributes' : true ,
	        'characterData' : false,
	        'attributeOldValue' : false,
	        'characterDataOldValue' : false
		},config) ;
		observer.observe(target,config);
		return observer ;
	};
	/**
	 * 创建临时css样式
	 * @param {Object} styles  例：'.box{width:100px;}'
	 */
	client.createCss = function(styles){
		var ele = document.createElement('style');
		ele.type = 'text/css';
		ele.innerHTML=ele.innerHTML+styles;
		$('head').append(ele);
	};
	
	client.flex = function(modeW){
		this.modeW = modeW || this.modeW ;
		$('meta[name=viewport]').attr('content','width=device-width,initial-scale=1.0,user-scalable=no') ;
		$('html,body').css({'height':'100%'});
		this.gbox = $(body).addClass('gbox') ;
		this.modeH = this.gbox.height();
		if(this.preventDefault){
			$(document).on('touchstart touchmove',function(e){ 
				if( !$(e.target).is('input,textarea,select,video,a') ){
					e.preventDefault();
				}
			});
		}
	};
	
	return client ;
})() ;

/** 数组拓展 */

(function(){
	/**
	 * 数组填充
	 * @param {Number} minLength 最小长度
	 * @param {Number} colum 长度倍数填充
	 */
	Array.prototype.fill = function(minLength , colum){
		minLength = Math.max(minLength,this.length);
		var fix = ( colum ? Math.ceil(minLength / colum)*colum : minLength ) - this.length  ;
		return this.concat(new Array(fix));
	};
	Array.prototype.remove = function(index){
		var target = this[index] ;
		var $this = this.slice(0,index).concat(this.slice(index+1,this.length)) ;
		this.length = 0 ;
		Array.prototype.push.apply(this,$this) ;
		return target ;
	};
	/** 
	 * 数组筛选
	 * @param {String|Function} rules 筛选字符串或函数 'name:1,age:12' | function(){ return true }
	 * @param {boolean} inv 是否反选
	 */
	Array.prototype.grep = function(rules,inv){
		var ret = [] , retVal ;
		inv = !!inv ;
		var callback = typeof rules =="function" ? rules : function(v,i){
			return isMatch(v,rules.split(','));
		};
		for ( var i = 0, length = this.length; i < length; i++ ) {
			retVal = !!callback( this[ i ], i );
			if ( inv !== retVal ) {
				ret.push( this[ i ] );
			}
		}
		return ret ;
		
		function isMatch(value,arr){
			var match = true ;
			for(v in arr){
				var ar  = arr[v].split(':');
				if( toString(value[ar[0]]) != ar[1] ){
					match = false
					break;
				}
			}
			return match ;
		};
		function toString(value){
			if(value === undefined){
				return "undefined" ;
			}
			if(value === null){
				return "null" ;
			}
			return value.toString();
		};
	};
	/**
	 * 数组排序
	 * @param {Array|String} keys 排序字段
	 * @param {Array|Boolean} descs 是否降序对应排序字段 true表示降序
	 * @param {Function} custom 自定义函数
	 */
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

	$.each('fill sortData grep remove'.split(' '),function(index,value){
		Object.defineProperty(Array.prototype, value , {enumerable : false });
	});
})();

/**
 * 加载效果函数
 * date 2016-10-11
 */
ut.loader = (function(){
	var Loader = new Function();
	var path = (function(){ return this.slice(0,this.indexOf('js/utils')) }).call($('script[src*=utils]').attr('src'));
	var timer = 0;
	
	Loader.prototype = {
		constructor : 'Loader',
		path : path ,
		delay : 300 ,
		loopTime : 800 ,
		expand : function(){ 
			var self  = this ;
			if(!this.timeoutId){
				this.startTime = Date.now();
				this.timeoutId = setTimeout(function(){
					self.create();
				},this.delay);
			}
		},
		over : function(){ 
			var self = this;
			var timer  = Date.now() - this.startTime;
			timer = this.loopTime - timer + this.delay ;
			setTimeout(function(){
				clearTimeout(self.timeoutId);
				self.timeoutId = null ;
				self.destory();
			},timer);
		},
		clone : function(isCommon){
			var L =  $.extend(true,{},this);
			if(isCommon){
				L.expand = L.over = new Function();
			}
			return L ;
		}
		
	};
	Loader.prototype.create = function(){
		
		var element = "<div><div><img/></div></div>" ;
		var centerClass = {'position' : 'fixed','top' : '0', 'left' : '0','bottom' : '0' , 'right' : '0', 'margin' : 'auto' };
		var size1 = '56px',size2 = '140px' ; 
		
		var $this = $(element) ;
		$this.css($.extend(centerClass,{'z-index' : '999'})).addClass('preventDefault');
		$this.children('div').css($.extend({},centerClass,{
			'width' : size2 , 'height' : size2, 'display' : 'block' ,
			'webkitTransform':'scale('+ut.client.scaleW+') translateY(-25%)',
			'border-radius' : '10px' , 'background' : 'rgba(0,0,0,0.55)'
		}));
		$this.find('img').css($.extend({},centerClass,{
			'display' : 'block' , 'width' : size1 , 'height' : size1 
		})).attr('src',this.path+"js/asset/load.gif");
		$this.appendTo('body'); 
		this.ele = $this ;
	};
	Loader.prototype.destory = function(){
		var $ele = this.ele ;
		$ele && $ele.remove(), $ele=null;
	};
	return (new Loader());
})();
//加载更多的效果
+function(){
	var m = ut.loaderMore = ut.loader.clone();
	m.create = function(){
		var element = "<div class='loadingTp' style='text-index:1.4em;'><span class='pr'><img></img>加载中，请稍后...</span></div>" ;
		this.loaderTp = $('.loaderTp').clone() ;
		var $this = $(element) ;
		$this.find('img').css({display:'inline-block',position:'absolute',top:'-6px',left:'-45px'})
		.attr('src',this.path+"js/asset/load.gif");
		$('.loaderTp').empty().append($this);
	};
	m.destory = function(){
		$('.loaderTp').replaceWith(this.loaderTp);
	};
}();

/**
 * 数据融合,增删改演示
 * 
 * 属性 ： 增，改
 * 对象 ： 增，删 ，改
 * 数组 ： 增，删 ，改
 * 
 * {	
 * 		teacher1 : {
 * 			identiy : 'teacher',
 * 			age : 35 ,
 * 			family : {
 * 				sons : 3,
 * 				father : 'angular'
 * 			}
 * 			children : [
 * 				{id : 1, name:'andy',age:10},
 * 				{id : 2, name:'tader',age:11}，
 * 				{id : 5, name:'spring',age:10}
 *			],
 * 			students: [1,2]
 * 		}
 * }
 * +
 * {	
 * 		teacher1 : {
 * 			age : 36 ，
 * 			family : {} //传递空的对象，则删除该对象
 * 			addrees : '海淀一路' ，//添加新的属性
 * 			children : [
 * 				{id : 2}, //根据所包含的id找到对应的对象进行修改，如果只包含id删除否则修改操作
 * 				{id : 4, name:'viggo',age:10},
 * 				{id : 1, name:'andy',age:13} 修改数组中id为1的对象 
 * 			]
 * 			students: []
 * 		}
 * }
 * ==>
 * {	
 * 		teacher1 : {
 * 			identiy : 'teacher',
 * 			age : 36 ,
 * 			addrees : '海淀一路' ，
 * 			children : [
 * 				{id : 1, name:'andy',age:13},
 * 				{id : 4, name:'viggo',age:10},
 * 				{id : 5, name:'spring',age:10}
 *			],
 * 			students: []
 * 		}
 * }
 * 
 */
ut.extend = function(){
	//date 2016-09-29
	addMark(Array.prototype.slice.call(arguments,1)) ;
	return tidy(extend.apply(null, arguments));
	
	function addMark(args){
		//如果对象为空或只含有id属性，添加标记destory:true 
		$.each(args||[],function(index,value){
			if( typeof value == 'object' && value!= null ){
				addMark(value) ;
				var len  = Object.keys(value).length ;
				if(('id' in value && len ==1)|| len == 0 ){
					value.destory  = true ;
				}
			}
		}) ;
	};
	function tidy(data){
		$.each(data||[],function(index,value){
			//防止无限循环
			if(value===data){
				return ;
			}
			if(index == 'destory'){
				delete data[index] ;
				return ;
			}
			if(jQuery.isPlainObject(value)||jQuery.isArray(value)){
				if(value['destory']){
					if(jQuery.isArray(data)){
						data = data.slice(0,index).concat(data.slice(index+1,data.length));
						tidy(data);
						return false;
					}else{
						delete data[index] ;
					}
				}else{
					data[index] = tidy(value);
				}
			}
		});
		return data;
	};
	
	function extend(){
		var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = true;

		if ( typeof target === "boolean" ) {
			deep = target;
			target = arguments[1] || {};
			i = 2;
		}
		if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
			target = {};
		}
		if ( length === i ) {
			target = this;
			--i;
		}
		for ( ; i < length; i++ ) {
			if ( (options = arguments[ i ]) != null ) {
				
				//清除数组
				if(jQuery.isArray(options)&&jQuery.isArray(target)&&!options.length){
					target = [] ;
				}
				
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}

					if( jQuery.isPlainObject(copy) && ('id' in copy)&&jQuery.isArray(options)&&jQuery.isArray(target)){
						src = $.grep(target,function(value,index){
							return (value.id === copy.id)&&((name = index)||true)?true:false;
						})[0];
						if(src){
							target[ name ] = extend( deep, src, copy );
						}else{
							target.push(extend( deep, {}, copy )) ;
						}
					}
					// Recurse if we're merging plain objects or arrays
					else if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && jQuery.isArray(src) ? src : [];

						} else {
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[ name ] = extend( deep, clone, copy );

					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
				
			}
		};
		return target ;
	}
	
};


(function (){
	//date 2016-10-12
	var origin = window.pageData || {} ;
	window.root  = origin.data || {};
	
	//向后台发送ajax请求
	ut.send = function(url,cb,failcb,errorcb,params,loader,options){
		var args = analyse(arguments);
		//设置默认失败回调
		args.failcb = args.failcb || function(back){
			try{ ut.showMsg(back.msg); }catch(e){}
		} ; 
		args.params = args.params instanceof jQuery ? args.params.serialize() : args.params ;
		args.loader = args.loader || ut.loader;
		args.loader.expand();
		$.ajax($.extend({
			method : 'post',
			url : serverHost + args.url,
			timeout: 60000,
			data : args.params||{},
			success : function(back){
				console.log(back);
				back = back || {};
				ut.extend(origin,$.extend(true,{},back)) ;
				back.data = back.data||{};
				root.result = back.data.result ;
				//移动msg 到back.data下面
				back.msg && ( back.data.msg = back.msg ) ;
				if( back.callback === true ){
					args.cb && args.cb(back.data,back);
				}else{
					console.error('callback false') ;
					args.failcb(back.data,back);
				}
				args.loader.over();
			},
			error : function(XMLHttpRequest, textStatus, errorThrown){
				args.loader.over();
				args.errorcb && args.errorcb(textStatus);
				console.log(textStatus);
			}
		},args.options));
	};
	
	function analyse(pas){
		var args = {} ;
		args.url = $.grep(pas,function(v,i){
			return typeof v == 'string' ;
		})[0];
		var funs = $.grep(pas,function(v,i){
			return typeof v == 'function' ;
		}) ;
		args.cb = funs[0];
		args.failcb = funs[1];
		args.errorcb = funs[2];
		args.loader = $.grep(pas,function(v,i){
			return v.constructor == 'Loader';
		})[0];
		args.options = $.grep(pas,function(v,i){
			return typeof v == 'object' && isOption(v);
		})[0];
		args.params = $.grep(pas,function(v,i){
			return typeof v == 'object' && !isOption(v) && v.constructor != 'Loader';
		})[0];
		return args ;
		function isOption(obj){
			var need = ['url','timeout','async','beforeSend','cache','complete','contentType','data','dataType','error','global','success'].join(' ');
			var flag = true ;
			for(var i in obj){
				if(! new RegExp("\\b"+i+"\\b").test(need) ){
					flag = false ;
					break ;
				}
			};
			return flag ;
		};
	};
	
})();

/**
 * 拓展日前对象
 * @param {Object} fmt 日期格式
 */
Date.prototype.format = function(fmt){
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
    if (new RegExp("(" + k + ")").test(fmt)) 
		fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
/**
 * 时间处理对象
 */
ut.timer = function(t){
	if(!t){
		return new Date();
	}
	t = t.toString();
	return t.length==13 ? new Date(Number(t)) : getDate(t);
	function getDate(str){
		var arr = str.match(/\d+/g) ;
		arr[1] = parseInt(arr[1] , 10) - 1 ;
		return eval('new Date(' + arr + ')');
	};
};

	
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
		if(size==0){
			excuEnd() ;
		}
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
						if(args[i]&&args[i]!=''){
							if( !isObject(args[i]) ){
								args[i] = { id: args[i].match(/(\w+)\./)[1] , src:args[i] };
							}
							args[i].src = url ? url + '/' + args[i].src : args[i].src ;
							_list.push(args[i]);
						}
					}
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
 * 来自 Zepto.js
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
