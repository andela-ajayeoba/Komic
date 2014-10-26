'use strict';

//Komics service used to communicate Komics REST endpoints
var app = angular.module('komics');


app.factory('Komics', ['$resource',
	function($resource) {
		return $resource('komics/:komicId', { 
			komicId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
app.factory('Reviews', ['$resource',
	function($resource) {
		return $resource('komics/:komicId/reviews/:id', { 
			komicId: '@komicId', 
			reviewId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
app.factory('Koms', ['$http', function($http) {
    var actions = {
        koms: []
    };
    actions.noSearchData=false;
    // actions.like = function(product) {
    //     return $http.put('/products/' + product._id + '/like')
    //         .success(function(data) {
    //             product.likes += 1;
    //             product.likesView = false;
    //         });
    // };
    // actions.dislike = function(product) {
    //     return $http.put('/products/' + product._id + '/dislike')
    //         .success(function(data) {
    //             product.likes -= 1;
    //             product.likesView = true;
    //         });
    // };
    // actions.addComment = function(id, comment) {
    //     return $http.post('/products/' + id + '/comments', comment);
    // };
    // actions.likeComment = function(product, comment) {
    //     return $http.put('/products/' + product._id + '/comments/' + comment._id + '/like')
    //         .success(function(data) {
    //             comment.likes += 1;
    //             comment.likesView = false;
    //         });
    // };
    // actions.dislikeComment = function(product, comment) {
    //     return $http.put('/products/' + product._id + '/comments/' + comment._id + '/dislike')
    //         .success(function(data) {
    //             comment.likes -= 1;
    //             comment.likesView = true;
    //         });

    // };
    return actions;
}]);