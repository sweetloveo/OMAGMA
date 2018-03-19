(function() {
	'use strict';

	angular
			.module('app')
			.controller('mainCtrl', mainCtrl);

	mainCtrl.$inject = ['$scope', 'Auth', 'Users'];

	function mainCtrl($scope, Auth, Users) {
		var vm = this;

		// Auth.$onAuthStateChanged(function(authData) {
		// 	vm.authData = authData;
		// 	if(vm.authData) {
		// 		vm.user = Users.get(vm.authData);
		// 		vm.user.$loaded()
		// 			.then(function(user) {
		// 				console.log(user);
		// 			})
		// 	}
		// })	

	}
})();
