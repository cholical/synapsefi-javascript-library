(function () {

  "use strict";
  var app;
  app = angular.module('rise');

  app.factory('homeSvc', ['$http', '$log', function homeSvc($http, $log) {

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
