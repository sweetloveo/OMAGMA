(function () {
	'use strict';

	angular
		.module('app')
		.controller('machineAddCtrl', machineAddCtrl);

	machineAddCtrl.$inject = ['$firebaseObject', '$firebaseArray', '$stateParams','$state','cfpLoadingBar'];

	function machineAddCtrl($firebaseObject, $firebaseArray, $stateParams,$state, cfpLoadingBar) {
        cfpLoadingBar.start();
		var vm = this;

		vm.company_id = $stateParams.id;
		vm.group_id = $stateParams.group;
		vm.machineedit = $stateParams.machine;
		vm.selected = $stateParams.selected;
		vm.machine = {};
		vm.editMachine = editMachine;

		vm.addMachine = addMachine;

		getCurrentSelected();

		if (vm.machineedit)
		{
            var ref = firebase.database().ref('/GearmotorMachine').child($stateParams.machine);
            var obj = $firebaseObject(ref);
            obj.$loaded().then(function (data) {
                vm.machine = data;
			})

		}

		function getCurrentSelected() {

			var ref = firebase.database().ref('/gearmotor').child($stateParams.selected);
			var obj = $firebaseObject(ref);
			obj.$loaded().then(function (data) {
				vm.gear = data;
				vm.machine.power = vm.gear.motorPower;
                vm.machine.activate = 'True';
				vm.machine.type =  vm.gear.driveType;
				vm.machine.ratio = vm.gear.gearRatio;
				vm.machine.speed = vm.gear.motorSpeed / vm.gear.gearRatio;
				vm.machine.torque = ((9550 * vm.gear.motorPower) / (vm.gear.motorSpeed / vm.gear.gearRatio ));
				vm.machine.sf = (vm.gear.gearTorque / ((9550 * vm.gear.motorPower) / (vm.gear.motorSpeed / vm.gear.gearRatio )));
				vm.machine.voltagesystem = 230/400;
				vm.machine.ratedcurrent = vm.gear.motorVoltage;
				vm.machine.gearmotor = $stateParams.selected;

                cfpLoadingBar.complete();

			})
		}

				/*function addGearMotor() {
					return new Promise(function (resolve, reject) {
						var ref = firebase.database().ref('/gearmotors');
						var obj = $firebaseArray(ref);
						obj.$add({
							type: {
								value: vm.machine.type,
							},
							power: {
								value: vm.machine.power
							},
							ratio: {
								value: vm.machine.ratio
							},
							speed: {
								value: vm.machine.speed
							},
							torque: {
								value: vm.machine.torque
							},
							sf: {
								value: vm.machine.sf
							},
							voltagesystem: {
								value: vm.machine.voltagesystem
							},
							layoutno: {
								value: vm.machine.layoutno
							},
							machineno: {
								value: vm.machine.machineno
							},
							serialno: {
								value: vm.machine.serialno
							}

						})
							.then(function(ref) {
								resolve(ref.key);
							})
							.catch(function(error) {
								reject(error);
							});
					});
				}*/

        function addMachine() {

               var ref = firebase.database().ref('/GearmotorMachine');
               var obj = $firebaseArray(ref);
               obj.$add(
				   vm.machine
			   )
                   .then(function(gear) {
					   console.log('IDIDJAAAAAA------||'+gear.toString().slice(53,73));
					   var ref = firebase.database().ref('/company').child(vm.company_id).child('/group').child(vm.group_id).child('/machine');
					   var obj = $firebaseArray(ref);
					   obj.$add(
						   {id:gear.toString().slice(53,73)}
					   ).then(function () {
						   swal("Good job!", "Machine has been added", "success");
						   $state.go('dashboard.machine',{id:vm.company_id,group:vm.group_id});
					   })

                   })
                   .catch(function(error) {
                       swal("Error", error, "error");
                   });
		   }

			function editMachine() {

                vm.machine.activate = 'True';
                vm.machine.$save().then(function (data) {
                    swal("Saved success!", "Machine has been edited", "success");
                    $state.go('dashboard.machine',{id:vm.company_id,group:vm.group_id});
                })


			}



        //
        // function getCurrentCompany(company_id) {
		// 	var ref = firebase.database().ref('/company').child(company_id);
		// 	var obj = $firebaseObject(ref);
		// 	obj.$loaded()
		// 		.then(function (company) {
		// 			vm.selectedCompany = company;
		// 			vm.group = company.group[vm.group_id];
		// 		})
		// 		.then(_getGear.bind(this))
		// 		.then(_constructGear.bind(this));
		// }
        //
		// function _getGear() {
		// 	var ref = firebase.database().ref('/gearmotors');
		// 	var obj = $firebaseObject(ref);
		// 	return obj.$loaded()
		// 						.then(function(gearmotors) {
		// 							return gearmotors
		// 						});
		// }
        //
		// function _constructGear(gear) {
		// 	vm.gearmotors = _.map(vm.group.gearmotors, function (val, key) {
		// 		var maintenance = _.last(_.values(val.maintenance));
		// 		var checkup = _.last(_.values(val.checkup));
		// 		return {
		// 			id: key,
		// 			data: gear[val.id],
		// 			maintenance_url: (maintenance) ? maintenance.url : '',
		// 			checkup_url: (checkup) ? checkup.url : '',
		// 		};
		// 	});
		// }
        //
		// function setGearOrderBy(order) {
		// 	if (vm.gearOrderBy === order) {
		// 		vm.gearOrderBy = '-' + order;
		// 	} else {
		// 		vm.gearOrderBy = order;
		// 	}
		// }


	}
	
})();