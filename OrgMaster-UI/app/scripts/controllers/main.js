'use strict';

/**
 * @ngdoc function
 * @name orgMasterUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the orgMasterUiApp
 */
angular.module('orgMasterUiApp')
  .controller('MainCtrl', ['$scope','$state','userAuthService',function ($scope,$state,userAuthService) {
    	// $scope.login=function(){
    	// 	$state.go('dashboard');
    	// };
			

			$scope.logout=function($event){
				if($event)$event.preventDefault();
				userAuthService.invalidateSession();

				
			}
  }]);

