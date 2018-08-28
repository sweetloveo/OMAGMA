(function () {
	'use strict';

	angular
		.module('app')
		.controller('machineCtrl', machineCtrl);

	machineCtrl.$inject = ['Users','$firebaseObject', '$firebaseArray', '$stateParams','Auth','cfpLoadingBar'];

	function machineCtrl(Users,$firebaseObject, $firebaseArray, $stateParams,Auth, cfpLoadingBar) {
        cfpLoadingBar.start();
		var vm = this;

		vm.company_id = $stateParams.id;
		vm.group_id = $stateParams.group;
		vm.selected = $stateParams.selected;
		vm.group = {};
		vm.gearmotors = [];
		vm.getGearttype = getGearttype;
		vm.gearOrderBy = 'data.machineno.value';
		vm.loading = false;
		vm.hasGearMotors = true;
		vm.setGearOrderBy = setGearOrderBy;

        Auth.$onAuthStateChanged(function(authData) {
			vm.authData = authData;

            if(vm.authData) {
                vm.user = Users.get(vm.authData);
            } else {
                $state.go('login');
            }
        });
		function getGearttype(KEY) {
            var ref = firebase.database().ref('/gearmotor').child(KEY);
            var obj = $firebaseObject(ref);
            return obj.$loaded()
                .then(function(gearmotors) {
                    return gearmotors
                });
		}
		
		getCurrentCompany(vm.company_id);

		function getCurrentCompany(company_id) {
			var ref = firebase.database().ref('/company').child(company_id);
			var obj = $firebaseObject(ref);
			vm.loading = true;

			obj.$loaded()
				.then(function (company) {
					vm.selectedCompany = company;
					vm.group = company.group[vm.group_id];

					cfpLoadingBar.complete();
				})
				.then(_getGear.bind(this))
				.then(_constructGear.bind(this));
		}
	
		function _getGear() {
			var ref = firebase.database().ref('/GearmotorMachine');
			var obj = $firebaseObject(ref);
			return obj.$loaded()
								.then(function(gearmotors) {
									return gearmotors
								});
		}

		function _constructGear(gear) {
			vm.gearmotors = _.map(vm.group.machine, function (val, key) {
				var maintenance = _.last(_.values(val.maintenance));
				var checkup = _.last(_.values(val.checkup));
				return {
					id: key,
					data: gear[val.id],
					data_id: val.id,
					maintenance_url: (maintenance) ? maintenance.url : '',
					checkup_url: (checkup) ? checkup.url : '',
				};
			});

			for(let loop = 0;loop<=vm.gearmotors.length-1;loop++)
			{
                var a = getGearttype(vm.gearmotors[loop].data.gearmotor);
                a.then(function (value) {
                    vm.gearmotors[loop].data.gearType = value;
				});
			}

			vm.loading = false;
			vm.hasGearMotors = vm.gearmotors.length > 0;
		}

		function setGearOrderBy(order) {
			if (vm.gearOrderBy === order) {
				vm.gearOrderBy = '-' + order;
			} else {
				vm.gearOrderBy = order;
			}
		}


	}
	
})();