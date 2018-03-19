(function() {
	'use strict';

	angular
			.module('app')
			.factory('Auth', Auth);

	Auth.$inject = ['$firebaseAuth'];

	function Auth($firebaseAuth) {
		return $firebaseAuth();
	}
})();
