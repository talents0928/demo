



var R = angular.module('Autils',[]) ;
//R.config(configure)
R
.controller('uCtrl',['$scope',function($scope){
	var student = {};
	$scope.student = student ;
	student.name = '何川';
	student.age = '45' ;
	
}])
;

configure.$inject = ['$controllerProvider','$compileProvider','$provide'];
function configure($controllerProvider, $compileProvider, $provide) {
	var module = app;
	module.registerController = $controllerProvider.register;
	module.registerDirective = $compileProvider.directive;
	module.registerFactory = $provide.factory;
	module.registerService = $provide.service;
}

