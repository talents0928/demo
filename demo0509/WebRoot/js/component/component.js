/**
 * 默认依赖jQuery
 * 不支持压缩 
 */

var ut = ut||{};

$.extend(ut,{
	
	showMsg : function(msg,opts,cb){
		
		ut.template(function(){/*
			<script type='x' id='msgTmpl'>
				<style text='text/css' >
					.msg-quit{ width:50px;line-height:50px;top:6px;right:10px;z-index:2;font-size:40px;color:#b2b2b2 ; }
				</style>
				<div class='pa00 full fs28 tac' fixed style='background:rgba(0,0,0,0.3);z-index:99;' id='msg'>
					<div class='pa auto2 oh flexColumn' style='height:300px;width:480px;border-radius:10px;top:45%;'>
						<div class='msg-quitTp msg-quit pa tac'>×</div>
						<div class='fullw pr c-black-2' style='height:200px;background:#fff;'>
							<div class='auto2' style='width:80%;'>{{html @data}}</div>
						</div>
						<div class='fullw pr c-white-1 msg-sureTp' style='height:100px;background:#fff;margin-top:-1px;'>
							<div class='ma' style='height:1px;width:420px;background:#E3E3E3;'></div>
							<div class='auto2 fullw msg-btn c-black-1'>确定</div>
						</div>
					</div>
				</div>
			</script>
		*/});
		
		if(typeof opts =='function'){
			cb = opts ; opts = false;
		}
		$.tmpl('msgTmpl',msg).appendTo(client.sky).on('tap','.msg-sureTp',function(){
			$(this).parents('#msg').fadeOut(300,function(){
				$(this).remove();
				cb && cb();
			});
		}).on('tap','.msg-quitTp',function(){
			$(this).parents('#msg').fadeOut(300,function(){
				$(this).remove();
			});
		}) ;
		if(opts&&opts.btnText){
			$('#msg .msg-btn').text(opts.btnText) ;
		}
		
	},
	
	demo : function(){
		
		
	}
	
	
});