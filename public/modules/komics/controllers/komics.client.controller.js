'use strict';

// Komics controller
angular.module('komics')
.controller('KomicsController', ['$scope', '$stateParams', '$location', '$upload', '$timeout', '$http', 'Authentication', 'Koms', 'Komics', 'Reviews',
	function($scope, $stateParams, $location, $upload, $timeout, $http, Authentication, Koms, Komics, Reviews ) {
		$scope.authentication = Authentication;
		$scope.review_state = false;
		$scope.review_list_state = false;
		$scope.loading = false;

		$scope.imageindex = 0;
		$scope.enablenav = false;


		//function to upload comic images
		$scope.onFileSelect = function($files) {
			$scope.files = $files;
			$scope.imageFiles = [];
			$scope.uploadResult = [];
			if($scope.files) {
				for (var i in $scope.files) {
					if($scope.files[i].type === 'image/jpeg' || $scope.files[i].type === 'image/png' || $scope.files[i].size < 600000) {
						$scope.correctFormat = true;
					} else {
						alert('error');
						alert('Wrong file format...');
						$scope.correctFormat = false;
					}
					$scope.start(i);

				}
			}
		};

		$scope.start = function(indexOftheFile) {
			$scope.loading = true;
			var formData = {
				key: $scope.files[indexOftheFile].name,
				AWSAccessKeyID: 'AKIAJQYBMDUWZVLR6ZGA',
				acl: 'private',
				policy: 'ewogICJleHBpcmF0aW9uIjogIjIwMjAtMDEtMDFUMDA6MDA6MDBaIiwKICAiY29uZGl0aW9ucyI6IFsKICAgIHsiYnVja2V0IjogImtvbWljYnVja2V0In0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAiIl0sCiAgICB7ImFjbCI6ICJwcml2YXRlIn0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRmaWxlbmFtZSIsICIiXSwKICAgIFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLCAwLCA1MjQyODgwMDBdCiAgXQp9',
				signature: 'CNs+4S/Ms5sCgbITIksXcyHBgas=',
				filename: $scope.files[indexOftheFile].name,
				'Content-Type':$scope.files[indexOftheFile].type
			};
			
			$scope.imageFiles[indexOftheFile] = $upload.upload({
				url: 'https://komicbucket.s3-us-west-2.amazonaws.com/',
				method: 'POST',
				headers: {
					'Content-Type':$scope.files[indexOftheFile].type
				},
				data: formData,
				file: $scope.files[indexOftheFile]
			});
			console.log(indexOftheFile);
			$scope.imageFiles[indexOftheFile].then(function(response) {
				$timeout(function() {
					$scope.loading = false;
					//alert('uploaded');
					var imageUrl = 'https://komicbucket.s3-us-west-2.amazonaws.com/' + $scope.files[indexOftheFile].name;
					$scope.uploadResult.push(imageUrl);
				});
			}, function(response) {
				console.log(response);
				$scope.loading = false;
				if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
				alert('Connection Timed out');
			}, function(evt) {
				
			});

			console.log($scope.imageFiles[indexOftheFile]);

			$scope.imageFiles[indexOftheFile].xhr(function(xhr) {
				//alert('xhr');
			});
			
		};


		// Create new Komic
		$scope.create = function() {
			// Create new Komic object
			var komic = new Komics ({
				title: this.title,
				description: this.description,
				genre: this.genre,
				images: $scope.uploadResult
			});
			komic.$save(function(response){
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
				review: this.review,
				name: this.name
			});
			$scope.komic.reviews.push({review: this.review, rating: this.rating, name: this.name, user: Authentication.user.displayName, created: Date.now()});
			review.$save(function(response) {
				$scope.komic = response;
			}, function(errorResponse) {
				$scope.error =errorResponse.data.message;
			});
			//$scope.review_state = false;
			$scope.review = '';
			$scope.rating = '';
			$scope.name = '';
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
		$scope.remove = function(komic) {
			if ( komic ) {
			console.log(komic); 
				komic.$remove();

				for (var i in $scope.komics ) {
					if ($scope.komics [i] === komic ) {
						$scope.komics.splice(i, 1);
					}
				}
			} else {
				console.log($scope.komic);
				$scope.komic.$remove(function() {
					$location.path('komics');
				});
			}
		};

		// Update existing Komic
		$scope.update = function() {
			console.log('i was called');
			var komic = $scope.komic ;
			console.log(komic);
			komic.$update(function() {
				console.log('i was called 3');
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
		// $scope.findOne = function() {
		// 	$scope.komic = Komics.get({ 
		// 		komicId: $stateParams.komicId
		// 	});
		// };
		$scope.next = function(nextvalue){
			if(nextvalue < $scope.komic.images.length){
				$scope.imageindex++;
				$scope.enablenav = true;
			}
			else {
				nextvalue = $scope.komic.images.length;
				$scope.enablenav = false;
			}
		};

		$scope.prev = function(nextvalue){
			if(nextvalue > 0){
			$scope.imageindex--;
			$scope.enablenav = true;
			}
			else
				$scope.imageindex = 0;
				$scope.enablenav = false;
		};


		// $scope.prevPageDisabled = function() {
		//     return $scope.imageindex === 0 ? 'disabled' : '';
		//  };


		// $scope.nextPageDisabled = function() {
		//     return $scope.currentPage === $scope.pageCount() ? 'disabled' : '';
		// };


		$scope.findOne = function(){
			$http.get('komics/' + $stateParams.komicId).success(function(response){
				$scope.komic = response;
			});
		};
		
		$scope.load_komic_by_genre = function() {
			$http.get($stateParams.genre).success(function(response) {
				$scope.komic_result = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.show_review = function() {
        	$scope.review_state = !$scope.review_state;

      	};

      	$scope.show_review_list = function() {
        	$scope.review_list_state = !$scope.review_list_state;
      	};
      	$scope.searchData = Koms.koms;
      	$scope.search = function() {
            $http.get('/search/?' + $scope.myform + '=' + $scope.userQuery)
                .success(
                    function(response) {
                    	console.log(response);
                    	if (response.length === 0){
                    		Koms.noSearchData = true;
                    		$scope.nosearchData = Koms.noSearchData;
                            $scope.userQuery = '';
                    		$location.path('search');
                    		// location.assign('#!/search');
                    		// location.reload();


                    	}
                    	else{
                    	Koms.noSearchData = false;
                    	$scope.nosearchData = Koms.noSearchData;
                        Koms.koms = response;
                        $scope.searchData = Koms.koms;
                        $scope.userQuery = '';
                        $location.path('search');
                        // location.assign('#!/search');
                        // location.reload();
                    }
                    }).error(function(data) {
                    console.log('there was an error');
                });
        };
        $scope.checkpath = function(){
        	// console.log($location);
        		if ($location.$$absUrl === 'http://localhost:3000/#!/search')
        		{
        			return true;
        		}
        		else{
        			return false;
        		}
        };

      	// $scope.show_review_list = function() {
      	// 	for (var i in $scope.komic.reviews) 
      	// };
	}
])
.config(function($sceProvider) {
// Completely disable SCE.  For demonstration purposes only!
// Do not use in new projects.
$sceProvider.enabled(false);
});