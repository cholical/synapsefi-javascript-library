(function () {

	'use strict';
	var app;

	app = angular.module('rise');
	app.controller('dashboardCtrl', ['$scope', '$state', 'dashboardSvc', function dashboardCtrl($scope, $state, dashboardSvc){

		// $scope.test = function () {
		// 	dashboardSvc.test().then(function (data) {
		// 		$scope.result = data;
		// 	});
		// }

	}]);
}());