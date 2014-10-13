'use strict';

// Komics controller
angular.module('komics')
.controller('KomicsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Komics', 'Reviews',
	function($scope, $stateParams, $location, Authentication, Komics, Reviews ) {
		$scope.authentication = Authentication;
		$scope.review_state = false;
		$scope.review_list_state = false;
		$scope.policy = 'ewogICJleHBpcmF0aW9uIjogIjIwMjAtMDEtMDFUMDA6MDA6MDBaIiwKICAiY29uZGl0aW9ucyI6IFsKICAgIHsiYnVja2V0IjogImtvbWljYnVja2V0In0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAidXBsb2Fkcy8iXSwKICAgIHsiYWNsIjogInB1YmxpYy1yZWFkIn0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRmaWxlbmFtZSIsICIiXSwKICAgIFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLCAwLCA1MjQyODgwMDBdCiAgXQp9';
		//function to upload comic images
		$scope.onFileSelect = function($files) {
			$scope.files = $files;
			$scope.imageUrl = [];
			if($scope.files) {
				console.log($files);
				for (var i in $scope.files) {
					if($scope.files[i].type === 'image/jpeg' || $scope.files[i].type === 'image/png' || $scope.files[i].size < 600000) {
						var reader = new FileReader();
						reader.onload = function(e) {
							$scope.imageUrl.push({path: e.target.result});
							console.log($scope.imageUrl);
						};
						reader.readAsDataURL($scope.files[i]);
						$scope.correctFormat = true;
					} else {
						alert('error');
						$scope.correctFormat = false;
					}
				}
			}
		};


		// $scope.onFileSelect =function($files) {
		// 	$scope.uploadedFile = [];
		// 	$scope.progress = [];
		// 	$scope.uploadResult = [];
		// 	$scope.imageUrl = [];
		// 	$scope.selectedFiles = $files;
		// 	if($scope.files) {
		// 		for(var i = 0; i < $files.length; i++) {
		// 			var $file = $files[i];
		// 			$scope.progress[i] = -1;
		// 			$scope.start(i);
		// 		}
		// 	}
		// };

		// $scope.start = function(indexOftheFile) {
		// 	// var formData = {
		// 	// 	key: "",
		// 	// 	AWSAccessKeyID: "",
		// 	// 	acl: 'private',
		// 	// 	success_action_redirect: "komics/",
		// 	// 	policy: "",
		// 	// 	signature: ""
		// 	// };

		// 	$scope.progress[indexOftheFile] = 0;
		// 	$scope.uploadedFile[indexOftheFile] = $upload.upload({
		// 		url: 'http://komicbucket.s3.amazonaws.com/',
		// 		method: 'POST',
		// 		headers: {
		// 			'Content-Type':$scope.files[indexOftheFile].type
		// 		},
		// 		data: {
		// 			key: $scope.selectedFiles[indexOftheFile].name + '_' + Date(),
		// 			AWSAccessKeyID: 'AKIAJJLPFKFD34W6ESIA',
		// 			acl: 'public-read',
		// 			// success_action_status: '201',
		// 			// success_action_redirect: 'komics/',
		// 			policy: $scope.policy,
		// 			signature: 'jwrZJ1OjbQYSIz4FtlASQlweFDc=',
		// 			filename: $scope.selectedFiles[indexOftheFile].name
		// 		},
		// 		file: $scope.selectedFiles[indexOftheFile]
		// 	});
		// 	$scope.uploadedFile[indexOftheFile].then(function(response) {
		// 		$timeout(function() {
		// 			alert('1');
		// 			console.log('timeOut function');
		// 			$scope.uploadResult.push(response.data);
		// 			console.log(response.data);
		// 		});
		// 	}, function(response) {
		// 		console.log(response);
		// 		if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
		// 		alert('2');
		// 	}, function(evt) {
		// 		//Math.min is to fix IE which reports 200% sometimes
		// 		$scope.progress[indexOftheFile] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
		// 		console.log(evt);
		// 		alert('3');
		// 	});

		// 	console.log($scope.uploadedFile[indexOftheFile]);

		// 	$scope.uploadedFile[indexOftheFile].xhr(function(xhr) {
		// 		console.log($scope.uploadedFile[indexOftheFile]);
		// 		console.log(xhr);
		// 		alert('xhr');
		// 	});
		// };

		// Create new Komic
		$scope.create = function() {
			// Create new Komic object
			var komic = new Komics ({
				title: this.title,
				description: this.description,
				genres: this.genres,
				
			});
			komic.images = $scope.imageUrl;
			// Redirect after save
			komic.$save(function(response) {
				$location.path('komics/' + response._id);

				// Clear form fields
				$scope.title = '';
				$scope.description = '';
				$scope.genre = '';
				$scope.images = [];
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Add Review to Komic
		$scope.addReview = function() {
			var review = new Reviews ({
				komicId: $scope.komic._id,
				rating: this.rating,
				review: this.review
				//displayName: $scope.user.displayName
			});
			console.log(review);
			$scope.komic.reviews.push({review: this.review, rating: this.rating, user: Authentication.user.displayName, created: Date.now()});
			review.$save(function(response) {
				console.log(review);
				$scope.komic = response;
				console.log(response);
			},function(errorResponse) {
				$scope.error =errorResponse.data.message;
			});
			$scope.review_state = false;
			$scope.review = '';
		};


		// Remove Review from Komic
		$scope.removeReview = function(rev) {
			var review = new Reviews({
				komicId: $scope.komic._id,
				_id: rev._id
			});

			review.$remove(function(response) {
				for (var i in $scope.komic.reviews) {
					if ($scope.komic.reviews[i] === rev) {
						$scope.komic.reviews.splice(i, 1);
					}
				} 
			},function(errorResponse) {
					$scope.error = errorResponse.data.message;
				
			});
		};

		// Remove existing Komic
		$scope.remove = function( komic ) {
			if ( komic ) { komic.$remove();

				for (var i in $scope.komics ) {
					if ($scope.komics [i] === komic ) {
						$scope.komics.splice(i, 1);
					}
				}
			} else {
				$scope.komic.$remove(function() {
					$location.path('komics');
				});
			}
		};

		// Update existing Komic
		$scope.update = function() {
			var komic = $scope.komic ;

			komic.$update(function() {
				$location.path('komics/' + komic._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Komics
		$scope.find = function() {
			$scope.komics = Komics.query();
		};

		// Find existing Komic
		$scope.findOne = function() {
			$scope.komic = Komics.get({ 
				komicId: $stateParams.komicId
			});
		};

		$scope.show_review = function() {
        	$scope.review_state = !$scope.review_state;
      	};

      	$scope.show_review_list = function() {
        	$scope.review_list_state = !$scope.review_list_state;
      	};


      	// $scope.show_review_list = function() {
      	// 	for (var i in $scope.komic.reviews) 
      	// };
	}
]);