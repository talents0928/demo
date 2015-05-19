

var ut  = {};


ut.cookie = function(){
	console.log(1);

	require(['cookie'],function(){
		console.log('我执行了！');
	});
};


define(['touch2'],function(a){

	return a;

});