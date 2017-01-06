'use strict';

angular.module('orgMasterUiApp')
  .controller('excelStoreCtrl', ['$scope','$state','ajaxService','$stateParams','$rootScope','host','Upload','$timeout',function ($scope,$state,ajaxService,$stateParams,$rootScope,host,Upload,$timeout) {
      $scope.store={};
      $scope.userAuthData = $stateParams.userAuthData||{};
		console.log($scope.userAuthData);
		$(document).ready(function () {
		    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
		    $('.modal').modal();
		  });
		
    	$scope.fetchUploadedDocs = function (user_id) {
    		ajaxService('get', '/uploadedDocs?user_id='+user_id).then(function onSuccess(response) {
				console.log(response);
				$scope.store.uploadedDocs = response?response.data.uploaded_docs:[];
                $rootScope.user.uploadedDocsCount=$scope.store.uploadedDocs.length;
    		}, function onFailure(err) {
				console.error(err);
    		});

		};
        $scope.fetchUploadedDocs($scope.userAuthData.username);
        $scope.openDoc=function(doc){
            $state.go('dashboard',{doc_id:doc._id})
        }
        $scope.downloadFile=function(doc){
        	var downloadUrl =  host+"/downloadXl?doc_id="+doc._id;
        	window.location.href=downloadUrl;
        }
        
        //upload code
        
        $scope.uploadDoc = function () {
        	$('#modal1').modal('open');
    		};
        
        $scope.submit = function () {
            if ($scope.form.file.$valid && $scope.file) {
              $scope.upload($scope.file);
              console.log($scope.file);
            }
          };

          // upload on file select or drop
      		$scope.uploadedFiles=[];
      		$scope.uploadedPercent={};
          $scope.upload = function (file) {
      			if (file) {
      				var uploadUrl = host + "/parseUpload?user_id=Preetham"; //change
              Upload.upload({
      					url: uploadUrl,
      					data: { file: file, 'username': 'Preetham' } //change
              }).then(function (resp) {
      					console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
      					$scope.uploadedFiles.push({"name":resp.config.data.file.name,"fileDetails":resp.data});
      						$scope.showUploadFiles=true;
      						$scope.showUploadMsg=false;
              }, function (resp) {
      					console.log('Error status: ' + resp.status);
              }, function (evt) {
      					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      					$scope.uploadedPercent[evt.config.data.file.name.replace(' /g',"")]=progressPercentage;
      					console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
              });
      			}

          };
          // for multiple files:
          $scope.uploadFiles = function (files) {
            if (files && files.length) {
              for (var i = 0; i < files.length; i++) {
                Upload.upload({ data: { file: files[i] } });
              }
              // or send them all together for HTML5 browsers:
              //Upload.upload({..., data: {file: files}, ...})...;
            }
          }
          

      		$scope.clearUploadedFile=function($event){
      			$event.preventDefault();
      			$scope.uploadedFiles=[];
      			$scope.showUploadFiles=false;
      			$scope.showUploadMsg=true;
      			$timeout(function(){
      				$state.reload();
      			},500)
      			

      		}
        
        
  }]);