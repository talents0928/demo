//默认依赖jQuery


var cp = {} ;

$.extend(cp,{
	
	
	showMessage : function(){
		
		
		
	},
	
	nav : function(obj,cb){
		var mode = { SINGLE : 1,MULTI :2 ,MORE :3 }
		obj = unionData(obj,4);
		var $navTp = $('.navTp') ;
		var currMode = mode.SINGLE ;
		
		
		var boss = $.tmpl('navCpTmpl',obj).appendTo($navTp) ;
		//点击筛选头
		boss.on('tap','.nav-head',function(){
			var lists = $(this).tmplItem().data ;
			lists.navType=1; lists.navMode = lists.navMode || mode.SINGLE ;
			if($(this).is('.nav-head-active')){
				$(this).removeClass('nav-head-active');
				$('.nav-black').remove();
			}else{
				$('.nav-head-active').removeClass('nav-head-active');
				$(this).addClass('nav-head-active');
			
				currMode = lists.navMode ;
				if($('.nav-body').length){
					$('.nav-body-tmpl').tmplItem().data = lists.navMode ; $('.nav-body-tmpl').tmplItem().update() ;
					$('.nav-body').append($.tmpl('navBoxTmpl',lists)) ;
					ut.iScroll('#nav-box-1');
				}else {
					createBlack().appendTo($navTp).append(createBody(lists.navMode).find('.nav-body').append($.tmpl('navBoxTmpl',lists)).end()) ;
					ut.iScroll('#nav-box-1');
				}
			}
			
		});
		$(document).on('tap','.nav-listTp',function(){
			
			var $this = $(this); var navType = Number($this.attr('navType'));
			var lists = $this.tmplItem().data ; 
			
			if(lists['type'+(lists.typeLevel+1)+'s'] == undefined){
				if(currMode == mode.SINGLE){
					$this.addClass('nav-end-active');
					clear(lists);
				}else if(currMode == mode.MULTI){
//					$('.nav-end-active').removeClass('nav-end-active');
					$this.addClass('nav-end-active');
				}else if(currMode == mode.MORE){
					$('.nav-end-active').removeClass('nav-end-active');
					$this.addClass('nav-end-active');
					if($('.nav-preMark').length){
						$('.nav-preMark').tmplItem().data.mark = lists ;
					}
				}
				
				return false;
			}else{
				if(navType!=1){
					$this.parent().find('.nav-list-active').removeClass('nav-list-active');
				}else{
					$('.nav-preMark').removeClass('nav-preMark');
					$this.addClass('nav-preMark') ;
					$.each($this.parent().find('.nav-list-active'),function(index,value){
						if($(value).tmplItem().data.mark == undefined ){
							$(value).removeClass('nav-list-active');
						}
					})
				}
				$this.addClass('nav-list-active');
				lists.navType = navType+1 ;
				
				var count = $('.nav-box').length ;
				if(navType == count){
					$.tmpl('navBoxTmpl',lists).css('left','100%').appendTo('.nav-body') ;
					ut.iScroll('#nav-box-'+(navType+1));
					tidy();
				}else{
					for(var i=0 ;i<count-navType;i++){
						if(i==0){
							var tmpl = $('#nav-box-'+(navType+i+1)).children('#listUp').tmplItem() ;
							tmpl.data = lists ; tmpl.update();
							ut.iScroll('#nav-box-'+(navType+i+1));
						}else{
							$('#nav-box-'+(navType+i+1)).remove();
						}
					}
					tidy();
				}
			}
			
		});
		//不限
		$(document).on('tap','.nav-clear',function(){
			
			var index = $(this).parents('.nav-box').index() ;
			if(index==0){
				$('.nav-end-active').removeClass('nav-end-active');
				$(this).addClass('nav-end-active');
				$.each($('.nav-list1'),function(index,value){
					$(value).tmplItem().data.mark = null ;
				});
				clear();
			}else{
				$('.nav-end-active').removeClass('nav-end-active');
				$(this).addClass('nav-end-active');
				var arr = [] ;
				$.each($(this).siblings('.nav-listTp')||[],function(index,value){
					var data = $(value).tmplItem().data ;
					Array.prototype.push.apply(arr,getMarksData(data));
				});
				if($('.nav-preMark').length){
					var preMark = $('.nav-preMark').tmplItem().data ;
					preMark.mark = arr ;
					preMark.mark2 = $(this).tmplItem().data ; 
				}
				if(currMode == mode.SINGLE){
					clear();
				}
			}
			
		});
		
		function getMarksData(data){
			var arr = [] ;
			if(data['type'+(data.typeLevel+1)+'s']!=undefined){
				$.each(data['type'+(data.typeLevel+1)+'s'],function(index,value){
					Array.prototype.push.apply(arr,getMarksData(value));
				});
				return arr ;
			}else{
				arr.push(data) ;
				return arr;
			}
		};
		//点击黑幕收回
		$(document).on('tap','.nav-black',function(e){
			if($(e.target).is('.nav-black')){
				$('.nav-head-active').tmplItem().update();
				$('.nav-black').remove();
			}
		});
		
		//确认
		$(document).on('tap','.nav-sure',function(){
			clear ();
		});
		//重置
		$(document).on('tap','.nav-reset',function(){
			$('.nav-end-active').removeClass('nav-end-active');
			$('.nav-list-active').removeClass('nav-list-active');
			$('.nav-box:not([id=nav-box-1])').remove();
			$.each($('.nav-list1'),function(index,value){
				$(value).tmplItem().data.mark = null ;
			});
			tidy();
		});
		function clear(data){
			
			setTimeout(function(){
				
				console.log(currMode) ;
				
				var $ele = $('.nav-head-active').tmplItem();
				$('.nav-head-active').removeClass('nav-head-active');
//				$ele.data.marks = $ele.data.marks || [] ;
				$ele.data.marks = [] ; $ele.data.marks2 = null ;
				
				if(currMode == mode.SINGLE||currMode == mode.MULTI){
					if($('.nav-end-active').length==1 && $('.nav-end-active').is('.nav-clear')){
						if($('.nav-preMark').length){
							 var data = $('.nav-preMark').tmplItem().data ;
							Array.prototype.push.apply($ele.data.marks,data.mark);
							$ele.data.marks2 = data.mark2 || null ;
							data.mark2 = data.mark = null ;
 						}
						
					}else{
						$.each($('.nav-end-active'),function(index,value){
							$ele.data.marks.push($(value).tmplItem().data) ;
						}) ;
					}
					
				}else if(currMode == mode.MORE){
					$.each($('.nav-list1'),function(index,value){
						var data = $(value).tmplItem().data ;
						if(data.mark){
							if(typeof data.mark == 'Array'){
								Array.prototype.push.apply($ele.data.marks,data.mark);
								$ele.data.marks2 = data.mark2 || null ;
							}else{
								$ele.data.marks.push(data.mark) ;
							}
							data.mark2 = data.mark = null ;
						}
					}) ;
				}
				if($ele.data.marks.length == 0){
					$ele.data.marks = null ;
				}
				$ele.update();
				$('.nav-black').remove();
//				var arr = [] ;
//				$.each($('.nav-mark'),function(index,value){
//					Array.prototype.push.call(arr,$(value).tmplItem().data.marks);
//				}) ;
				cb&&cb();
			},200);
		}
		function tidy(){
			var count = $('.nav-box').length ; var val = Math.round(100/count*10)/10 ;
			setTimeout(function(){
				$.each($('.nav-box'),function(index,value){
					$(value).css({'width':val+'%','left':val*index+'%'}) ;
				});
			},0);
		}
		function createBlack(){
			return $('<div></div>').addClass('nav-black').css({
				'background':'rgba(0,0,0,0.4)', 'width':'100%',
				'z-index' : 1 , 'position':'absolute' , 'overflow' : 'hidden' ,
				'height': (ut.client.modeH-80)+'px' 
			});
		}
		function createBody(mode){
			mode = mode || 1 ;
			return $.tmpl('navBodyTmpl',mode) ;
		};
		function unionData(data,num){
			if(data.length<=num){
				return {types:data} ;
			}
			var arr = [];
				arr[num-1]={ type1Id:99,typeLevel:1,type1NameCn: "所有",navMode:mode.MORE,type2s:[]};
			for(var i=0;i<data.length;i++){
				if(i<num-1){
					arr[i]=(data[i]);
				}else{
					arr[num-1].type2s.push(data[i]);
				}
			}
			return {types:arr} ;
		}
		
	},
	sift : function(obj,cb){
		
		var mode = { SINGLE : 1,MULTI :2 ,MORE :3 } ;
		var $siftTp = $('.siftTp') ;
		
		var base = $.tmpl('siftTmpl',obj).appendTo($siftTp) ;
		
		
		
		
	},
banner : function(options){
		
		options = $.extend({
			auto : true , //是否自动轮播
			interval : 4000, //播放间隔
			bullets : true ,	//是否带轮播子弹提示
			timer : 1000 ,	//切换速度
			isFull :  false , //图片是否满屏
			height : 'auto'	//轮播高度
		},options);
		
		var status = [{left:'-100%'},{left:'0%'},{left:'100%'}];
		var $ele = $('.bannerTp');
		var $ul = $ele.find('ul').css({
			position : 'relative',
			height : options.height+'px' 
		});
		$ele.find('img').css({
			'height': options.height+'px' ,
			'max-width' : '100%',
			'width' : options.isFull ? '100%' : 'auto' ,
			'display' : 'block' ,
			'margin' : 'auto'
		});
		var lis = $ele.find('li').css({
			'webkitTransition' : 'all '+options.timer+'ms linear',
			position : 'absolute',
			'line-height' : 0,
			top: '0px',
			'background' : 'black' ,
			height : options.height+'px' ,
			width: '100%'
		}).remove();;
		
		
		var banner = {
			move : false ,
			curr : 0 ,
			length : lis.length 
		};
		
		$(lis.get(0)).css(status[1]).appendTo($ul);
		//获取banner的高
		if(options.height != 'auto'){
			$ul.css({ height : options.height+'px'});
		}else{
			var minHeight = 0;
			var interval = setInterval(function(){
				var height = $ul.find('li').height() ;
				if(height>minHeight){
					minHeight = height ;
					$ul.height(height);
				}
			},100);
		}
		
		if(options.bullets){
			var bullets = $('<div></div>').addClass('banner-bullets').appendTo($ele);
			for(var i =0;i<banner.length;i++){
				$('<div></div>').addClass('banner-bullet').appendTo(bullets);
			}
			$('.banner-bullet:eq(0)').addClass('banner-bullet-active');
		}
		
		
		$(document).on('swipeLeft','.bannerTp ul',function(){
			if(banner.length==1||banner.move){
				return ;
			}
			banner.move = true ;
			var next = banner.curr +1 > banner.length-1 ? 0 : banner.curr +1 ;
			var currEle = $(this).find('li').one('webkitTransitionEnd',function(){
				banner.move = false ;
				$(this).remove();
			});
			var addEle = $(lis.get(next)).css(status[2]).appendTo($ul);
			setTimeout(function(){
				currEle.css(status[0]) ;
				addEle.css(status[1]);
			},10);
			banner.curr = next ;
			activeBullet(banner.curr);
		});
		$(document).on('swipeRight','.bannerTp ul',function(){
			if(banner.length==1||banner.move){
				return ;
			}
			banner.move = true ;
			var next = banner.curr -1<0? banner.length-1 : banner.curr-1 ;
			var currEle = $(this).find('li').one('webkitTransitionEnd  ',function(){
				banner.move = false ;
				$(this).remove();
			});
			var addEle = $(lis.get(next)).css(status[0]).appendTo($ul);
			setTimeout(function(){
				currEle.css(status[2]) ;
				addEle.css(status[1]);
			},10);
			banner.curr = next ;
			activeBullet(banner.curr);
		});
		
		if(options.auto){
			setInterval(function(){
				if(banner.move){
					return false ;
				}
				$('.bannerTp ul').trigger('swipeLeft');
			},options.interval);
		}
		
		function activeBullet(curr){
			$('.banner-bullet').removeClass('banner-bullet-active');
			$('.banner-bullet:eq('+curr+')').addClass('banner-bullet-active');
		}
		
	}
	,
	
	
	demo : function(){
		
		
	}
	
	
	
	
	
});