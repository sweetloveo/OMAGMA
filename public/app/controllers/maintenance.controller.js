(function () {
	'use strict';

	angular
		.module('app')
		.controller('maintenanceCtrl', maintenanceCtrl);

		maintenanceCtrl.$inject = ['Auth','Users','$firebaseObject', '$firebaseArray', '$stateParams','cfpLoadingBar'];

	function maintenanceCtrl(Auth,Users,$firebaseObject, $firebaseArray, $stateParams, cfpLoadingBar) {
        cfpLoadingBar.start();
		var vm = this;

		vm.company_id = $stateParams.id;
		vm.group_id = $stateParams.group;
		vm.gearmotor_id = $stateParams.machine;
		vm.maintenance = {};
		vm.setOrderBy = setOrderBy;
		vm.deleteGearDetail =  deleteGearDetail;

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
						vm.mcremove.$remove(data)
							.then(function() {
								swal("Deleted!", "Your data has been deleted.", "success");
								vm.maintenance = _.map(vm.mcremove, (val, key) => {
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
                    cfpLoadingBar.complete();
					vm.group = company.group[vm.group_id];
					return vm.group.machine[vm.gearmotor_id];

				})
				.then(getGearDetail.bind(this))
				.then(getMaintenance);
		}

		function getGearDetail(gear) {
			var ref = firebase.database().ref('/GearmotorMachine').child(gear.id);
			var obj = $firebaseObject(ref);
			vm.gearmotor = obj;
		}
		function getMaintenance() {
			var ref = firebase.database()
						.ref('/company')
						.child(vm.company_id)
						.child('group')
						.child(vm.group_id)
						.child('machine')
						.child(vm.gearmotor_id)
						.child('maintenance');
						
			var obj = $firebaseArray(ref);
			obj.$loaded()
				.then(function (maintenance) {
					vm.mcremove = maintenance;
					vm.maintenance = _.map(vm.mcremove, (val, key) => {
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