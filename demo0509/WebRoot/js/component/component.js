//默认依赖jQuery


var cp = {} ;

$.extend(cp,{
	
	
	showMessage : function(){
		
		
		
	},
	
	nav : function(obj,cb){
		var data = unionData(obj,4);
		var expand = $('<div></div>').addClass('pa fullw nav-expandTp').css({
			'background':'rgba(0,0,0,0.5)',
			'z-index' : 5 ,
			'height': (ut.client.modeH-80)+'px' 
		});
		var container = $('<div></div>').addClass('nav-container oh pr').css({'background':'white','height':'65%','width':'100%'}) ;
		var fatherEle = $('.navTp') ;
		$.tmpl('navTmpl',data).appendTo(fatherEle)
		.on('tap','.nav-item',function(){
			var lists = $(this).tmplItem().data ;
			if($(this).is('.nav-item-active')){
				var $ele = $('.nav-item-active').tmplItem();
				$ele.data.mark = false ;$ele.update();
				$('.nav-item-active').removeClass('nav-item-active');
				$('.nav-expandTp').remove();
			}else{
				$('.nav-item-active').removeClass('nav-item-active');
				$(this).toggleClass('nav-item-active');
				if($('.nav-expandTp').length){
					$('.nav-container').empty().append(container.empty().append($.tmpl('navLC1Tmpl',lists))) ;
					ut.iScroll('#nav-container1');
				}else{
					$(expand).appendTo(fatherEle).append(container.empty().append($.tmpl('navLC1Tmpl',lists))) ;
					ut.iScroll('#nav-container1');
				}
				
			}
		}) ;
		$(document).on('tap','.nav-list1',function(){
			var lists = $(this).tmplItem().data ;
			if(lists['type'+(lists.typeLevel+1)+'s'] == undefined){
				$(this).addClass('nav-end-active');
				clear(lists);
				return false;
			}
			$('.nav-list1-active').removeClass('nav-list1-active');
			$(this).addClass('nav-list1-active');
			if($('.nav-container3').length){
				$('.nav-container3').remove();
			}
			if($('.nav-container2').length){
				$('.navLi2').tmplItem().data = lists ;
				$('.navLi2').tmplItem().update();
				ut.iScroll('#nav-container2');
			}else{
				$('.nav-container').append($.tmpl('navLC2Tmpl',lists)) ;
				ut.iScroll('#nav-container2');
			}
			setTimeout(function(){
				$('.nav-container1,.nav-container2').css({width:'50%'}) ;
				$('.nav-container2').css({left:'50%'}) ;
			},0);
			
		});
		$(document).on('tap','.nav-list2',function(){
			var lists = $(this).tmplItem().data ;
			if(lists['type'+(lists.typeLevel+1)+'s'] == undefined){
				$(this).addClass('nav-end-active');
				clear(lists);
				return false;
			}
			$('.nav-list2-active').removeClass('nav-list2-active');
			$(this).addClass('nav-list2-active');
			
			if($('.nav-container3').length){
				$('.navLi3').tmplItem().data = lists ;
				$('.navLi3').tmplItem().update();
				ut.iScroll('#nav-container3');
			}else{
				$('.nav-container').append($.tmpl('navLC3Tmpl',lists)) ;
				ut.iScroll('#nav-container3');
				setTimeout(function(){
					$('.nav-container1,.nav-container2,.nav-container3').css({width:'33.3%'}) ;
					$('.nav-container2').css({left:'33%'}) ;
					$('.nav-container3').css({left:'66%'}) ;
				},0);
			}
			
		});
		$(document).on('tap','.nav-list3',function(){
			var lists = $(this).tmplItem().data ;
			//$('.nav-end-active').removeClass('nav-end-active');
			$(this).addClass('nav-end-active');
			clear(lists);
		});
		$(document).on('tap','.nav-container',function(event){
			event.stopPropagation();
		});
		$(document).on('tap','.nav-expandTp',function(){
			$('.nav-item-active').trigger('tap');
		});
		function clear(data){
			setTimeout(function(){
				var $ele = $('.nav-item-active').tmplItem();
				$('.nav-item-active').removeClass('nav-item-active');
				$ele.data.mark = data ;
				$ele.update();
				$('.nav-expandTp').remove();
				var arr = [] ;
				$.each($('.nav-mark'),function(index,value){
					arr.push($(value).tmplItem().data);
				}) ;
				cb&&cb(arr);
			},200);
		}
		function unionData(data,num){
			if(data.length<=num){
				return {types:data} ;
			}
			var arr = [];
				arr[num-1]={ type1Id:99,typeLevel:1,type1NameCn: "所有",type2s:[]};
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
	
	
	demo : function(){
		
		
	}
	
	
	
	
	
});