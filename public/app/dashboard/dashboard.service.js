(function () {

  "use strict";
  var app;
  app = angular.module('rise');

  app.factory('dashboardSvc', ['$http', '$log', function dashboardSvc($http, $log) {

  	var test = function () {
  		var params = {
        test: ""
      }
  		return $http.post("/test", params).then(function (response) {
  			return response.data;
  		});
  	}

    return {
    	test: test
    };
  }]);

}());
