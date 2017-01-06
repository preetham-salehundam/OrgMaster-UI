'use strict';

/**
 * @ngdoc overview
 * @name orgMasterUiApp
 * @description
 * # orgMasterUiApp
 *
 * Main module of the application.
 */
var app=angular
  .module('orgMasterUiApp', [
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'ui.router',
    'ngFileUpload',
    'ui.bootstrap'
  ]);


 app.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){

 	$stateProvider
 	.state('signin',{

 		url:'/signin/:doc_id',
 		templateUrl:'../views/signin.html',
 		controller:'SigninCtrl',
		 authenticate:false
 	})
 	.state('dashboard',{

 		url:'/dashboard',
 		templateUrl:'../views/dashboard.html',
 		controller:'DashboardController',
		 params:{
			 userAuthData:undefined,
			 doc_id:undefined
		 },
		 authenticate:true
		
 	})
	 .state('excelstore',{

 		url:'/excelstore',
 		templateUrl:'../views/excelstore.html',
 		controller:'excelStoreCtrl',
		  params:{
			 userAuthData:undefined
		 },
		 authenticate:true
 	});
 	$urlRouterProvider.when('','/signin');
 }]);

 app.run(['$templateCache','$rootScope', '$state','userAuthService','$cookies',function($templateCache,$rootScope,$state,userAuthService,$cookies){
 		 $templateCache.put('dialog.html','<div class="modal-header">'+
					                                	'<h3 class="modal-title"></i><b>Success</b></h3>'+
					                                	'</div>'+
					                                	'<div class="modal-body">'+
					                                	'<p><b>Message:</b>&nbsp<em>{{DialogCtrl.message}}</em></p>'+
					                                	'</div>'+
					                                	'<div class="modal-footer"><button class="btn btn-primary" type="button" ng-click="$dismiss(\'dismissed\')">Close</button>'+
					                                	'</div>');

		$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
			if (toState.authenticate && !userAuthService.isUserLogged()){
			// User isn’t authenticated
			$state.transitionTo("signin");
			event.preventDefault(); 
			}else if( toState.authenticate  && userAuthService.isUserLogged()){
				var userObj={"username":$cookies.get('user_id'),"authenticated":true};
				userAuthService.setUserObj(userObj)
				toParams.userAuthData=userObj;
			}
  });									
  $rootScope.user={};
  $rootScope.user.LoggedInUser=userAuthService.getUserObj();	
 }])

app.service('userAuthService',function($cookies,sessionTimeout,$state){
	this.userObj={};
	this.cookieValid = $cookies.get('userAuthStatus');
	
	this.getUserObj=function(){
		if(this.userObj.authenticated){
		return this.userObj;
		}else if(this.cookieValid && this.cookieValid !=''){
			this.userObj.username=$cookies.get('user_id');
			if(this.userObj.username && this.userObj.username!=''){
				this.userObj.authenticated=true;
			}
			return this.userObj;
		}
	};
	this.setUserObj=function(userObj){
		this.userObj = userObj;
	};
	this.saveUserAuthState=function(){
		// var time=	$filter('date')('GMT');
		// console.log(time);
		var validaity=new Date();//in milli secs

		var validUpto = new Date().setMinutes(sessionTimeout);
		$cookies.put('user_id',this.userObj.username,{expires:new Date(validUpto)});
		$cookies.put('userAuthStatus',true,{expires:new Date(validUpto)});
		this.cookieValid=$cookies.get('userAuthStatus');
	}
	this.invalidateSession=function(cookieValue){
			this.userObj={};
			$cookies.remove('user_id');
			$cookies.remove('userAuthStatus');
			$state.go('signin');
	}
	this.isUserLogged=function(){
		if(this.userObj.authenticated && this.cookieValid && this.cookieValid!=''){
			return true;
		}else if(this.cookieValid && this.cookieValid!=''){
			this.userObj.username=$cookies.get('user_id');
			if(this.userObj.username && this.userObj.username!=''){
				this.userObj.authenticated=true;
			}
				
			return true;
		}else{
			return false;
		};
	};
});
app.factory('userAuthFactory',function($q,userAuthService){
	return function(){
		var defer=$q.defer();
		if(userAuthService.isUserLogged()){
			defer.resolve(userAuthService.getUserObj());
		}else{
			defer.reject("user session not found");
		}
		return defer.promise;

	}
})
app.constant('host','http://localhost:3000');
app.constant('sessionTimeout','60');// in minutes
app.factory('ajaxService',function($http,host){


return function(method,url){
	var url= host+url;
	return $http[method](url);
};


});
app.service('exceptionDetails',function(){
		var errordata={};
		this.setErrorDetails=function(error){
			errordata.exception=error;
		}
		this.getErrorDetails=function(){
			return errordata;
		}
	})   
app.factory('DailogService',['$uibModal','$log','$state','exceptionDetails',function($uibModal,$log,snapShotService,$state,exceptionDetails){
			var Dialog={};
			Dialog.openDialog=function(template,msg){
									try{
										if(!template){
											throw "undefined template name!"
										}
									Dialog.modalInstance=$uibModal.open({
							    		animation:true,
							    		templateUrl:template,//'additionalInfoDisclaimer.html',
							    		controller:['$uibModalInstance','$uibModalStack',function($uibModalInstance,$uibModalStack){
							    			this.message=msg;
							    			this.ok = function() {
							    				snapShotService.capture();
							    				$state.go('contactus');
							    				exceptionDetails.setErrorDetails(msg);
							    				$uibModalInstance.close("reported");
							    				$uibModalStack.dismissAll("reported");
						                    };
							    		}],
							    		controllerAs:'DialogCtrl',
							    		/*scope:$scope,*/
							    		size:"modal-sm",
							    		/*//windowClass:'error-modal-window',
*/							    		backdrop:'static',//to prevent modal from closing on clicking on backdrop
							    		keyboard:false,//to prevent modal from closing while hitting esc
							    	
							    	})
								}
								catch(err){
									$log.error(err);
								}
			
			};
			Dialog.getModalInstance=function(){
											try{
												if(!Dialog.modalInstance){
													throw "Invalid Modal instance!"
												}
												return Dialog.modalInstance;
											}catch(err){
												$log.error(err)
											}
								
			};
		
		return Dialog;
		
		
	}])