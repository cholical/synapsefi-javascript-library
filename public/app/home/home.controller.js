(function () {

	'use strict';
	var app;

	app = angular.module('rise');
	app.controller('homeCtrl', ['$scope', '$state', 'homeSvc', function homeCtrl($scope, $state, homeSvc){

		$scope.showCreateAccount = false;
		$scope.loginEmail = "";
		$scope.loginPassword = "";

		// $scope.test = function () {
		// 	homeSvc.test().then(function (data) {
		// 		$scope.result = data;
		// 	});
		// }

	}]);
}());