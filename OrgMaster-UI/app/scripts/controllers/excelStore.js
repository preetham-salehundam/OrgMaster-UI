'use strict';

angular.module('orgMasterUiApp')
  .controller('excelStoreCtrl', ['$scope','$state','ajaxService','$stateParams','$rootScope',function ($scope,$state,ajaxService,$stateParams,$rootScope) {
      $scope.store={};
      $scope.userAuthData = $stateParams.userAuthData||{};
		console.log($scope.userAuthData);
    	$scope.fetchUploadedDocs = function (user_id) {
    		ajaxService('get', '/uploadedDocs?user_id='+user_id).then(function onSuccess(response) {
				console.log(response);
				$scope.store.uploadedDocs = response?response.data.uploaded_docs:[];
                $rootScope.uploadedDocsCount=$scope.store.uploadedDocs.length;
    		}, function onFailure(err) {
				console.error(err);
    		});

		};
        $scope.fetchUploadedDocs($scope.userAuthData.username);
        $scope.openDoc=function(doc){
            $state.go('dashboard',{doc_data:doc})
        }
  }]);