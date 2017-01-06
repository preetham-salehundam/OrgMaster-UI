'use strict';

/**
 * @ngdoc function
 * @name orgMasterUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the orgMasterUiApp
 */
angular.module('orgMasterUiApp')
  .controller('SigninCtrl', ['$scope','$state','$rootScope','userAuthService','$stateParams',function ($scope,$state,$rootScope,userAuthService,$stateParams) {
	$rootScope.user.LoggedInUser={};  
  	$scope.user={};
	$scope.persisitUserObj={};
    	$scope.login=function(){
    		if($scope.user.username && $scope.user.password){
				$scope.user.authenticated=true;
				$scope.persisitUserObj.username=$scope.user.username ;
				$scope.persisitUserObj.authenticated=$scope.user.authenticated;
				userAuthService.setUserObj($scope.persisitUserObj);
				userAuthService.saveUserAuthState();
				$rootScope.user.LoggedInUser=$scope.persisitUserObj;


				if($stateParams.doc_id && $stateParams.doc_id!=''){
					$state.go('dashboard',{doc_id:$stateParams.doc_id});
				}else{
					$state.go('excelstore');
				}

    			
    		}else{
    			return false;
    		}
				//$event.preventDefault();
    		};
  
    		
  }]);
