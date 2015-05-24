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





(function(callback){

	//return ;
	var seajsPath = 'js/lib/require.js' ;

	var node = document.createElement('script'); 
		node.setAttribute("type","text/javascript"); 
		node.setAttribute("src",seajsPath);  
		addOnload(node,callback);
	
	var doc = document;
	var head = doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement ;
	var baseElement = head.getElementsByTagName("base")[0] ;
	baseElement ?
      head.insertBefore(node, baseElement) :
      head.appendChild(node) ;


     function addOnload(node,callback) {
		  var supportOnload = "onload" in node
		  if (supportOnload) {
		    node.onload = onload
		    node.onerror = function() {
		      console.error('load fail');
		      onload()
		    }
		  }
		  else {
		    node.onreadystatechange = function() {
		      if (/loaded|complete/.test(node.readyState)) {
		        onload()
		      }
		    }
		  }
		 function onload() {
		    // Ensure only run once and handle memory leak in IE
		    node.onload = node.onerror = node.onreadystatechange = null

		    head.removeChild(node);
		    // Dereference the node
		    node = null

		    callback()
		 }
	}


})(function(){

		require.config({

			baseUrl : './js/lib',

			paths : {

				cssPath : '../../css/',
				

				jquery : 'jquery-1.10.2.min',
				touch : 'touch-0.2.10',
				cookie : 'jquery.cookie'

			},

			map : {
				'*' : {
					css : 'css'
				}
			}


		});




		require(['jquery'],function(){

			$('script').each(function(index,value){


					var arr = $(value).html().match(/(?:ut.)\w+(?:[.])/g);

					console.log(arr);

			});

			$(function(){


				var len  = ut._list.length ;
				for(var i =0 ; i < len; i++){
					ut._list.shift()();
				}
			});
			

		});
	

});




ut._list = [];
ut.ready = function(callback){

	this._list.push(callback);

};


ut.map = {

	getTouch : 1
};


ut.getTouch = function(){


	define('1',['touch'],function(a){
		console.log('funckkk');
		return a;
	});
	define('2',function(){
		return {
			a : 1 ,
			b : 2
		}
	});
	obj = require(['2']);
	//console.log(obj);
	return obj;

};


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





ut.client = (function(){
	client = {};
	client.modeH = 960;
	client.modeW = 640;
	
	client.w = window.innerWidth;
	client.h = window.innerHeight;
	//正确屏幕的宽高比
	client.ratio = client.modeW/client.modeH;
	client.error = 1.2;
	
	client.init = function(){
		this.w = window.innerWidth;
		this.h = window.innerHeight;
		
		
		//屏幕宽度失调率
		this.imbalance = this.w/(this.h*this.ratio);
		this.isBalance = this.imbalance>this.error?false:true;
		
		
		this.seeH = this.h;
		this.seeW = this.isBalance ? this.w : this.h*this.ratio;
		
		this.scaleW = this.seeW/this.modeW;
		this.scaleH = this.seeH/this.modeH;
		
	};
	
	client.gbox = $("<div class='gbox'></div>");

	client.setBox = function(){

		if(!window.gbox){
			this.gbox.append($('body').html()).wrap("<div></div>").parent().appendTo($('body').empty());
			window.gbox = this.gbox ;
		}


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
			height : this.modeH + 'px',
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


};

