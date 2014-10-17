'use strict';

//Setting up route
angular.module('komics').config(['$stateProvider',
	function($stateProvider) {
		// Komics state routing
		$stateProvider.
		state('listKomics', {
			url: '/komics',
			templateUrl: 'modules/komics/views/list-komics.client.view.html'
		}).
		state('createKomic', {
			url: '/komics/create',
			templateUrl: 'modules/komics/views/create-komic.client.view.html'
		}).
		state('viewKomic', {
			url: '/komics/:komicId',
			templateUrl: 'modules/komics/views/view-komic.client.view.html'
		}).
		state('editKomic', {
			url: '/komics/:komicId/edit',
			templateUrl: 'modules/komics/views/edit-komic.client.view.html'
		}).
		state('searchKomic', {
			url: '/search_page/:genre',
			templateUrl: 'modules/komics/views/search-komic.client.view.html'
		});
	}
]);