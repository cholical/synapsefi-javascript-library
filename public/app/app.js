(function () {

  'use strict';
  var app = angular.module('rise', ['ui.router', 'ui.bootstrap', 'ui.bootstrap.modal', 'ngCookies']);

  app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', configRoutes]);

  function configRoutes ($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'app/home/home.html',
        controller: 'homeCtrl'
      })
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'dashboardCtrl'
      })

    $urlRouterProvider.otherwise('/home');

    // $locationProvider.html5Mode({
    //   enabled: true
    // });

  };

  app.run(['$rootScope', '$timeout', '$state', '$cookies', function ($rootScope, $timeout, $state, $cookies) {

  }]);

}());
