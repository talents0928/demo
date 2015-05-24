

var ut  = {};





require.config({


	paths : {

		jquery2 : "jquery-1.10.2.min",
		touch2 : "touch-0.2.10"


	}

});




require(['jquery2'],function(){
	console.log($);
});



// ut.cookie = function(){
// 	console.log(1);

// 	require(['cookie'],function(){
// 		console.log('我执行了！');
// 	});
// };

// define('1',['touch2'],function(a){

// 	return a;

// });
// define('4',['jquery'],function(a){

// 	return a;

// });
// define('2',['touch'],function(a){

// 	return a;

// });
// define('cookie2',['cookie'],function(){
// 	//console.log($.cookie);
// });



// ut.useModule = function(id){

// 	require(id);
// };

// ut.useModule(['2']);