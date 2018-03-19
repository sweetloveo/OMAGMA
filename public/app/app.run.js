(function() {
	'use strict';

	angular
			.module('app')
			.run(appRun);

	appRun.$inject = ['$rootScope'];

	function appRun($rootScope) {

		moment.locale('th');
		var config = {
			apiKey: "AIzaSyCOkR5vjW5O6gpwSisaUMH_aGAaYO2kUIw",
			authDomain: "omagma-abe44.firebaseapp.com",
			databaseURL: "https://omagma-abe44.firebaseio.com",
			projectId: "omagma-abe44",
			storageBucket: "omagma-abe44.appspot.com",
			messagingSenderId: "151045131643"
		};
		firebase.initializeApp(config);
	}
})();
