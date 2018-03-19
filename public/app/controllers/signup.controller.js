(function() {
	'use strict';

	angular
			.module('app')
			.controller('signupCtrl', signupCtrl);

	signupCtrl.$inject = ['$state', '$stateParams', 'Users', 'Auth'];

	function signupCtrl($state, $stateParams, Users, Auth) {
		var vm = this;

		/** Variables **/
		vm.errorMessage = "";
		vm.successMessage = "";
		vm.user = {};
		vm.user.type = $stateParams.type;


		/** Functions **/
		vm.signup = signup;

		function signup(user) {
			Users.signup(user)
				.then(function(data) {
					vm.signupMessage = "สมัครสมาชิกเรียบร้อยแล้ว";
					console.log(data);
					$state.go('dashboard');
				}, function(error) {
					console.log('เอ๋อจ้าา ::'+error);
					vm.signupMessage = error.message;
				})
		}

	}
})();
