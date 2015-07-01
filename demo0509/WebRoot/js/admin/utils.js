/**
 * @author xiong
 */

//图片上传服务器地址
//var imgRoot = 'http://ouya.gz.1251386936.clb.myqcloud.com/shop/';
var imgRoot = 'http://' + window.location.host+'/'+window.location.pathname.split('/')[1]+'/';

//var serverHost = 'http://192.168.3.200/shop/';

var serverHost = 'http://' + window.location.host+'/'+window.location.pathname.split('/')[1]+'/';

var ut = {};

(function(){
	
	var _getAllurl = function(cmd,options){
//		return 'http://' + window.location.host+'/'+window.location.pathname.split('/')[1]+'/'+cmd;
		
		return serverHost + cmd;
	};
	
	window.lay = new (function(){
		var that = this;
		this.gifHref = './img/new/load.gif';
		this.size = '25px';
		this.size2 = '70px;'
		this.ctrl = 'expandTp';
		this.autoStyle = "position:absolute;top:0;left:0;right:0;bottom:0;margin:auto;";
		this.dom = "<div class='"+this.ctrl+"' style='position:fixed;width:100vw;height:100vh;top:0;left:0;z-index:99999;'>" +
				"<div style='"+this.autoStyle+"width:"+this.size2+";height:"+this.size2+";display:none;background:rgba(0,0,0,0.5);border-radius:10px;'>"+
				"<div style='"+this.autoStyle+"width:"+this.size+";height:"+this.size+";' >" +
				"<img src='"+this.gifHref+"'></img></div></div>" +
				"</div>";
		this.ele = $(this.dom);
		this.expand = function(){
			$('.'+that.ctrl).remove();
			that.ele.appendTo('body');
			setTimeout(function(){
				if($('.'+that.ctrl).length){
					that.ele.find('div').show();
				}
			},600);
		};
		this.out = function(){
			$('.'+that.ctrl).remove();
		};
		
	});
	
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
	
	//显示一个弹窗
	ut.showMsg = function(msg){
		//return false;
		if(!$('#msgModal').length)
			$('<div id="msgModal" class="reveal-modal text-center small" data-reveal><p>'+msg+'</p></div>').appendTo('body');
		else
			$('#msgModal p').text(msg);
		
		$('#msgModal').foundation('reveal', 'open');
	}
	
	//上传图片，会弹出一个图片选择框
	//需要引入js/lib/jquery.form.min.js
//	ut.showImgUpload = function(cb){
//		
//		var callback = cb;
//		
//		if(!$('#imgUploadPanel').length){
//			$('<div id="imgUploadPanel" class="reveal-modal text-center" data-reveal><form id="imgUploadForm" method="POST" enctype="multipart/form-data"><div class="row"><div class="column small-3 inline">上传图片</div><div class="column small-6"><input type="text" readonly="true"></div><div class="column small-3 end"><label><div class="button tiny radius">选择图片</div><input type="file" accept="image/*" name="upfile" style="display:none;"></input></label></div></div></form><div class="row" style="margin-top:20px;"><div class="column small-4 small-centered"><div class="button radius" id="submitImg">确定</div></div></div></div>').appendTo('body');
//			
//			$('#imgUploadPanel [type=file]').on('change',function(){
//				$('#imgUploadPanel [type=text]').val($(this).fieldValue()[0]);
//			});
//			
//			
//		}
//		
//		$('#imgUploadPanel #submitImg').off('click').on('click',function(){
//			if($('#imgUploadPanel [type=file]').fieldValue()[0]){
//				$('#imgUploadForm').ajaxSubmit({
//					url: serverHost+'jsp/controller.jsp?action=uploadimage',
//					success: function(resp){
//						console.info(serverHost + JSON.parse(resp).url);
//						callback && callback(serverHost + JSON.parse(resp).url);
//						$('#imgUploadPanel').foundation('reveal', 'close');
//						$('#imgUploadForm').resetForm();
//						
//					},
//				});
//			}else{
//				alert('请选择图片');
//			}
//			
//		});
//		
//		$('#imgUploadPanel').foundation('reveal', 'open');
//	}
	
	
	//显示通用图片上传框
	ut.showImgUpload = function(callback){
		
		if(!$('#imgUploadPanel').length){
			$('<div id="imgUploadPanel" class="reveal-modal text-center" data-reveal></div>').appendTo('body');
		}
		
		$('#imgUploadPanel').foundation('reveal', 'open', serverHost + 'dialogs/imgUpload.htm');
		
		//清除上一次调用时的绑定
		$('#imgUploadPanel').off();
		
		//绑定选择本地图片按钮
		$('#imgUploadPanel').on('change','[type=file]',function(){
			$('#imgUploadPanel [type=text]').val($(this).fieldValue()[0]);
		});
		
		
		var submitImg = function(url){
			console.info(url);
			callback && callback(url);
			$('#imgUploadPanel').foundation('reveal', 'close');
			$('#imgUploadForm').resetForm();
		}
		
		//绑定tab1提交按钮
		$('#imgUploadPanel').on('click','#submitImg',function(){
			if($('#imgUploadPanel [type=file]').fieldValue()[0]){
				$('#imgUploadForm').ajaxSubmit({
					url: imgRoot+'jsp/controller.jsp?action=uploadimage',
					success: function(resp){
						var res = eval('('+resp+')');
						if(res.state == 'SUCCESS'){
							submitImg(serverHost + JSON.parse(resp).url);
						}else{
							alert(res.state);
						}
					},
				});
			}else{
				alert('请选择图片');
			}
		});
		
		
		//绑定选择图片
		$('#imgUploadPanel').on('click','#selImgs>li',function(){
			$('#selImgs img').removeClass('imgSelected');
			$(this).find('img').addClass('imgSelected');
		});
		
		//绑定切换tab2按钮
		$('#imgUploadPanel').on('click','[href=#panel2]',function(){
			$.ajax({
				method :'POST',
				url: imgRoot+'jsp/controller.jsp?action=listimage',
				success: function(imgs){
					$('#selImgs').empty();
					
					var list = eval('('+imgs+')').list.reverse();
//					console.info(list)
					$.each(list||[],function(i,v){
						$('<li><img src='+imgRoot+v.url+'></li>').appendTo('#selImgs');
					});
					
					$(document).foundation('reveal', 'reflow');
				},
				
				contentType: "application/x-www-form-urlencoded",
				
			});
		});
		
		//绑定tab2选择图片按钮
		$('#imgUploadPanel').on('click','#submitImg2',function(){
			var selected = $('.imgSelected');
			if(selected.length){
//				console.info(selected[0])
				submitImg(selected.attr('src'));
			}else{
				alert('请选择图片');
			}
		});
		
	}
	
	 $.fn.initTmpl = function(data){
			return this.html(function(){
				return $(this).html().replace(/@/g,'$');
			}).tmpl(data);
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
                    'sss': 1,
                    'ss': 2,
                    's': 3,
                    'a': 4,
                    'b': 5,
                    'c': 6,
                    'd': 7
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
	
	
	//显示一个顶部下拉菜单
	//使用示例：ut.showDropMenu([{text:'1F',url:'act/view.page'},{text:'2F',url:'inquiry/index.page'},{text:'3F',url:'inquiry/index.page'},{text:'4F',url:'inquiry/index.page'},{text:'5F',url:'inquiry/index.page'},{text:'6F',url:'inquiry/index.page'},{text:'7F',url:'inquiry/index.page'}]);
	ut.showDropMenu = function(menus,switchText){
		$('#topDropMenu,#topDropMenuMask').remove();
		$('<div id="topDropMenu" open="0" style="z-index:100;background:white;width:100%;position:absolute;bottom:100%;left:0%;width:100%;color:white;text-align:center;"><div style="width:100%;bottom:0px;height:2px;position:absolute;left:0px;background:#b3b3b5;"></div><div id="topDrawMenuSwitch" style="position:absolute;left:6%;top:98%;width:80px;width:6rem;background:url(img/downArrow.png);background-size:100% 100%;"><div style="min-height:50px;padding-top:15px;box-sizing:border-box;">'+(switchText||'请选择')+'</div><div style="width: 0;height: 0;border-style: solid;border-width: 24px 40px 0px 40px;border-color:transparent;"></div></div></div>').appendTo('body');
		
		$.each(menus||{},function(i,v){
			$('<div style="width:25%;min-height:50px;line-height:50px;text-align:center;float:left;color:black;position:relative;">'+v.text+(i%4==3?'':'<div style="height:60%;top:20%;width:1px;position:absolute;right:0px;background:#b3b3b5;"></div>')+'<div style="width:100%;bottom:0px;position:absolute;left:0px;height:1px;background:#b3b3b5;"></div></div>').appendTo('#topDropMenu').bind('click',function(){
				window.location.href = (v.url || (window.location.href+'#'));
			});
			
		});
		
		$('#topDrawMenuSwitch').bind('click',function(){
			if($('#topDropMenu').attr('isopen') == 1){
				$('#topDropMenu').css({bottom:'100%',top:'auto'});
				$('#topDropMenu').attr('isopen','0');
				$('#topDropMenuMask').remove();
			}else{
				$('#topDropMenu').css({bottom:'auto',top:'0px'});
				$('#topDropMenu').attr('isopen','1');
				$('<div id="topDropMenuMask" style="width:100%;height:100%;top:0px;left:0px;position:absolute;background:rgba(0,0,0,0.5);z-index:99;"></div>').appendTo('body');
			}
			
		});
	}
	
})();