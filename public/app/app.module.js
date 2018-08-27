(function() {
	'use strict';

	angular
			.module('app',[
				'ui.router',
				'firebase',
				'ngDroplet',
				'monospaced.qrcode',
				'ngPrint',
				'720kb.datepicker',
				'inputDropdown',
				'ngAnimate',
				'angular-loading-bar'
			]).config(function(cfpLoadingBarProvider) {
        		cfpLoadingBarProvider.includeSpinner = false;
    		});

})();
