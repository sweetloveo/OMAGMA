(function() {
	'use strict';

	angular
			.module('app')
			.controller('mainCtrl', mainCtrl);

	mainCtrl.$inject = ['$scope', 'Auth', 'Users'];

	function mainCtrl($scope, Auth, Users) {
		var vm = this;
	}
})();
