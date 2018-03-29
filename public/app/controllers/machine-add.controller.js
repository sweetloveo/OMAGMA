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
		vm.machine_id = $stateParams.machineId;
		vm.selected = $stateParams.selected;
		vm.machine = {};
		vm.datenow = moment().format("DD/MM/YYYY");
		vm.editMachine = editMachine;

		vm.addMachine = addMachine;

		getCurrentSelected();

		if (vm.machine_id)
		{
            var ref = firebase.database().ref('/GearmotorMachine').child($stateParams.machineId);
            var obj = $firebaseObject(ref);
            obj.$loaded().then(function (data) {

                vm.machine = data;
                console.log(vm.machine);
			})

		}

		function getCurrentSelected() {

			var ref = firebase.database().ref('/gearmotor').child($stateParams.selected);
			var obj = $firebaseObject(ref);
			obj.$loaded().then(function (data) {
				vm.gear = data;
                vm.machine.Overhaul = moment().format("DD/MM/YYYY");
				vm.machine.power = vm.gear.motorPower;
                vm.machine.activate = 'True';
				vm.machine.type =  vm.gear.driveType;
				vm.machine.ratio = vm.gear.gearRatio;
				vm.machine.speed = vm.gear.opspeed;
				vm.machine.torque = vm.gear.optorque;
				vm.machine.sf = vm.gear.sf;
				vm.machine.voltagesystem = 230/400;
				vm.machine.ratedcurrent = vm.gear.motorVoltage;
				vm.machine.gearmotor = $stateParams.selected;
                vm.machine.ratedcurrent = vm.gear.motorVoltageD+'/'+vm.gear.motorVoltageY;
                vm.machine.motorflange = vm.gear.gearOutputFlange;
                vm.machine.shaftflange = vm.gear.gearHollowOrOutputShaft+'/'+vm.gear.gearOutputFlange;

                cfpLoadingBar.complete();

			})
		}


        function addMachine() {
console.log(vm.machine);
               var ref = firebase.database().ref('/GearmotorMachine');
               var obj = $firebaseArray(ref);
               obj.$add(
				   vm.machine
			   )
                   .then(function(gear) {
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

			console.log(vm.machine.gearmotor +'/'+ vm.gear.$id);

				if(vm.machine.gearmotor !== vm.gear.$id){
                    vm.machine.activate = 'True';
                    vm.machine.gearmotor = vm.gear.$id;

				}
                vm.machine.Overhaul = moment().format("DD/MM/YYYY");
                vm.machine.$save().then(function (data) {
                    swal("Saved success!", "Machine has been edited", "success");
                    $state.go('dashboard.machine',{id:vm.company_id,group:vm.group_id});
                })


			}



	}
	
})();