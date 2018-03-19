(function () {
	'use strict';

	angular
		.module('app')
		.controller('checkupCtrl', checkupCtrl);

		checkupCtrl.$inject = ['Auth','Users','$firebaseObject', '$firebaseArray', '$stateParams','cfpLoadingBar'];

	function checkupCtrl(Auth,Users,$firebaseObject, $firebaseArray, $stateParams, cfpLoadingBar) {
        cfpLoadingBar.start();
		var vm = this;

		vm.company_id = $stateParams.id;
		vm.group_id = $stateParams.group;
		vm.gearmotor_id = $stateParams.machine;
		vm.checkup = {};
		vm.setOrderBy = setOrderBy;
		vm.deleteGearDetail = deleteGearDetail;

        Auth.$onAuthStateChanged(function(authData) {
            vm.authData = authData;
            if(vm.authData) {
                vm.user = Users.get(vm.authData);
            } else {
                $state.go('login');
            }
        });
		getCurrentCompany(vm.company_id);
		function deleteGearDetail(key, data) {
			swal({
					title: "Are you sure?",
					text: "Your will not be able to recover data",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete it!",
					cancelButtonText: "No, cancel!",
					closeOnConfirm: false,
					closeOnCancel: false },
				function(isConfirm){
					if (isConfirm) {
						console.log(data.ref);
						firebase.storage().ref().child(data.ref).delete();
						vm.curemove.$remove(data)
							.then(function() {
								swal("Deleted!", "Your data has been deleted.", "success");
								vm.checkup = _.map(vm.curemove, (val, key) => {
										return val
									});
							})
					} else {
						swal("Cancelled", "Your data is safe :)", "error");
					}
				});

		}

		function getCurrentCompany(company_id) {
			var ref = firebase.database().ref('/company').child(company_id);
			var obj = $firebaseObject(ref);
			obj.$loaded()
				.then(function (company) {
					vm.group = company.group[vm.group_id];
                    cfpLoadingBar.complete();
					return vm.group.machine[vm.gearmotor_id];
				})
				.then(getGearDetail.bind(this))
				.then(getCheckup);
		}

		function getGearDetail(gear) {
			var ref = firebase.database().ref('/GearmotorMachine').child(gear.id);
			var obj = $firebaseObject(ref);
			vm.gearmotor = obj;
		}
		function getCheckup() {
			var ref = firebase.database()
						.ref('/company')
						.child(vm.company_id)
						.child('group')
						.child(vm.group_id)
						.child('machine')
						.child(vm.gearmotor_id)
						.child('checkup');
						
			var obj = $firebaseArray(ref);
			obj.$loaded()
				.then(function (checkup) {
					vm.curemove = checkup;
					vm.checkup = _.map(vm.curemove, (val, key) => {
						return val
					});
				});
		}
	
		function setOrderBy(order) {
			if (vm.orderBy === order) {
				vm.orderBy = '-' + order;
			} else {
				vm.orderBy = order;
			}
		}

	}
	
})();