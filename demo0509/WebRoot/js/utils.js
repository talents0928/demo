/**
 * @author xiong
 */

//图片上传服务器地址
//var imgRoot = 'http://ouya.gz.1251386936.clb.myqcloud.com/shop/';
var imgRoot =  'http://' + window.location.host+'/'+window.location.pathname.split('/')[1]+'/';

//var serverHost = 'http://192.168.3.200/shop/';

var serverHost = 'http://' + window.location.host+'/'+window.location.pathname.split('/')[1]+'/';

window.cdnPath = window.cdnPath || (function(){
	return 'http://' + window.location.host+'/'+window.location.pathname.split('/')[1]+'/';
})();







var ut = {};

function getReqMap(){

	var map = {};
	var unMap = ['ut.ready','ut.reqCss'];
	var needMap = ['cookie'];

	$('script').each(function(index,value){

		//加载ut.方法的自动引入
		var html = $(value).html().replace(/\/\/.*\n/g,'');
		var arr = html.match(/ut.(\w+)(?=[.\( \)])/g);
		$.each(arr||[],function(index,value){
			// map[value.split('.')[1]] = true;
			map[value] = true;
		});

		//加载$.插件的自动引入
		$.each(needMap||[],function(index,value){
			var reg = new RegExp('\\$\.'+value,'g');
			if(reg.test(html)){
				map['$.'+value] = true;
			};
		});

	});
	for(var i=0;i<unMap.length;i++){
		delete map[unMap[i]];
	}
	return Object.keys(map);
};

/**
*	初始化requireJs 配置 
*	加载基本资源
**/
(function(){



		var cssPath = '../../css/';

		require.config({

			baseUrl : './js/lib',

			paths : {

				common : cssPath+'/common',

				jquery : 'jquery-1.10.2.min',
				touch : 'touch-0.2.10',
				cookie : 'jquery.cookie'

			},

			map : {
				'*' : {
					css : 'css'
				}
			},

			shim : {

				touch : {
					exports : 'touch'
				},
				cookie : {
					exports : "cookie"
				}
			}


		});

		var baseAsset = (function(){
			var arr = ['jquery','jquery'];
			return arr;
		})();


		require(baseAsset,function(){
			var arr = getReqMap();
			require(arr,function(){
				$(function(){
					var len  = ut._list.length ;
					for(var i =0 ; i < len; i++){
						ut._list.shift()();
					}
				});
			});
		});
	
})();


define('ut.touch',['touch'],function(touch){


	ut.touch = touch ;

});

define('$.cookie',['cookie'],function(){

	//console.log(cookie);
});

define('commonCss',['css!common'],function(){

});



ut._list = [];
ut.ready = function(callback){

	this._list.push(callback);

};

ut.reqCss = function(arr){
	require(arr);
};





/**
	client 适配对象
	调用方法 setBox();
	@parse w 设计宽度
	@parse h 设计高度
**/

define('ut.client',function(){

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
		client.error = 1.0;
		
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

			if(!window.gbox){
				this.gbox.append($('body').html()).wrap("<div></div>").parent().appendTo($('body').empty());
				window.gbox = this.gbox ;
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


//  $.fn.initTmpl = function(data){
// 	return this.html(function(){
// 		return $(this).html().replace(/@/g,'$');
// 	}).tmpl(data);
// };


ut.initFunc = function(){






(function(){
	
	var _getAllurl = function(cmd,options){
//		return 'http://' + window.location.host+'/'+window.location.pathname.split('/')[1]+'/'+cmd;
		
		return serverHost + cmd;
	};
	
	// window.lay = new (function(){
	// 	var that = this;
	// 	//this.gifHref = window.Path||'.'+'/img/new/load.gif';
	// 	this.size = '25px';
	// 	this.size2 = '70px;'
	// 	this.ctrl = 'expandTp';
	// 	this.autoStyle = "position:absolute;top:0;left:0;right:0;bottom:0;margin:auto;";
	// 	this.dom = "<div class='"+this.ctrl+"' style='position:fixed;width:100vw;height:100vh;top:0;left:0;z-index:99999;'>" +
	// 			"<div style='"+this.autoStyle+"width:"+this.size2+";height:"+this.size2+";display:none;background:rgba(0,0,0,0.5);border-radius:10px;'>"+
	// 			"<div style='"+this.autoStyle+"width:"+this.size+";height:"+this.size+";' >" +
	// 			"<img src='"+this.gifHref+"'></img></div></div>" +
	// 			"</div>";
	// 	this.ele = $(this.dom);
	// 	this.expand = function(){
	// 		$('.'+that.ctrl).remove();
	// 		that.ele.appendTo('body');
	// 		setTimeout(function(){
	// 			if($('.'+that.ctrl).length){
	// 				that.ele.find('div').show();
	// 			}
	// 		},600);
	// 	};
	// 	this.out = function(){
	// 		$('.'+that.ctrl).remove();
	// 	};
		
	// });
	
	//向后台发送ajax请求
	ut.send = function(url,cb,options){
		lay.expand();
		$.ajax({
			method : 'post',
			url : _getAllurl(url,options),
			timeout: 20000,
			data : options||{},
			success : function(data){
				lay.out();
				if(data&&data.callback==true){
					cb&&cb(data.data,data);
				}else{
					ut.showMsg(data.msg);
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown){
				lay.out();
				console.log(textStatus);
			}
		});
	};
	
	 $.fn.initTmpl = function(data){
			return this.html(function(){
				return $(this).html().replace(/@/g,'$');
			}).tmpl(data);
		};
	
	
	//默认绑定事件  按钮事件
		
	$(function(){
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
	});
		
	
	ut.toArray = function(obj){
		
		var re = $.map(obj ||
        {}, function(value, index){
            if ($.isPlainObject(value)) 
                value._key = index;
            return value;
        });
        return re;
	}
	
	ut.sendForm = function(url,form,cb){
		lay.expand();
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
				lay.out();
				
			},
		});
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
        function localCompare(a, b, type){
        	
            var obj = {
                'gradegrade': {
                   
                }
            };
            
            return obj[type] ? obj[type][a] - obj[type][b] : a.localeCompare(b);
        };
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
                    return desc ? localCompare(a[key[i]], b[key[i]], key[i]) : localCompare(b[key[i]], a[key[i]], key[i]);
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
	
	
	
})();








};

