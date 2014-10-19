'use strict';

/**
 * Profile module for user profile and related content.
 */

angular
    .module('wechat.template', [
      'ngRoute',
      'koan.common',
      'wechat.common'
    ])
    .config(function ($routeProvider) {
      $routeProvider
          .when('/templates', {
            title: '自定义菜单',
            templateUrl: 'modules/template/template.html',
            controller: 'TemplateCtrl'
          });
    });