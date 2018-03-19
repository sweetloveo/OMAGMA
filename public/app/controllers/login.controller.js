(function() {
	'use strict';

	angular
			.module('app')
			.controller('loginCtrl', loginCtrl);

	loginCtrl.$inject = ['$state', 'Users', 'Auth'];

	function loginCtrl($state, Users, Auth) {
		var vm = this;

		vm.errorMessage = "";
		vm.loading = false;

		vm.login = function(userData) {
			vm.loading = true;
			Users.login(userData)
				.then(function() {
					$state.go('dashboard.company');
					vm.loading = false;
				})
				.catch(function(error) {
					if(error == false){
                        swal({
                            title: "Oops. Your account is suspend.",
                            text: " Please contact administrator.",
                            type: "error"
                        })

					}
					else{
                        swal({
                            title: "Oops. Wrong e-mail or password.",
                            text: " Please try again or contact administrator.",
                            type: "error"
                        })

					}

                    vm.loading = false;
				})
		}


	}
})();
