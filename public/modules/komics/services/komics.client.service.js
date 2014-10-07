'use strict';

//Komics service used to communicate Komics REST endpoints
angular.module('komics').factory('Komics', ['$resource',
	function($resource) {
		return $resource('komics/:komicId', { komicId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);