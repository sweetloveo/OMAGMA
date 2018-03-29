(function() {
	'use strict';

	angular
			.module('app')
			.controller('gearCtrl', gearCtrl);

	gearCtrl.$inject = ['$q','$scope','$state', 'Users', 'Auth', '$stateParams' ,'$firebaseArray','$firebaseObject','cfpLoadingBar','cfpLoadingBar'];

	function gearCtrl($q,$scope,$state, Users, Auth, $stateParams,$firebaseArray, $firebaseObject , cfpLoadingBar) {
        cfpLoadingBar.start();
		var vm = this;
		vm.company_id = $stateParams.id;
		vm.group_id = $stateParams.group;
		vm.selected = String($stateParams.selected).length;
		vm.addGear = addGear;
		vm.opt = opt;
        vm.gear = {};
		vm.svf = svf;
		vm.filterStringList = filterStringList;
		vm.Outputspeed = Outputspeed;
		vm.deletegear = Deletegear;
		vm.updateGearDesignation = updateGearDesignation;
		vm.updateGearBuildinType = updateGearBuildinType;
		vm.updateMotorDesignation = updateMotorDesignation;
		vm.updateMotorType = updateMotorType;
		vm.selectstring = selectstring;
        vm.savegearmotor = savegearmotor;

        vm.loadData = {data:[]}
        vm.GearunitOption = {data:[]};
        vm.gearUnitSizeOption = {data:[]};
        vm.gearRatioOption = {data:[]};
        vm.gearTorqueOption = {data:[]};
        vm.gearBuildinTypeOption = {data:[]};
        vm.gearHollowOrOutputShaftOption = {data:[]};
        vm.gearOutputFlangeOption = {data:[]};
        vm.gearDriveFlangeOption = {data:[]};
        vm.gearOptionOption = {data:[]};
        vm.motorDesignOption = {data:[]};
        vm.motorFrameSizeOption = {data:[]};
        vm.motorPoleOption = {data:[]};
        vm.motorPowerOption = {data:[]};
        vm.motorVoltageDOption = {data:[]};
        vm.motorVoltageYOption = {data:[]};
        vm.motorCurrentOption = {data:[]};
        vm.motorSpeedOption = {data:[]};
        vm.motorBuildinTypeOption = {data:[]};
        vm.motorShaftOption = {data:[]};
        vm.motorOptionOption = {data:[]};
        vm.efficOption = {data:[]};

        function savegearmotor(gear) {
            gear.$save().then(function (data) {});

            var ref = firebase.database().ref('/GearmotorMachine');
            var obj = $firebaseArray(ref)
            obj.$loaded().then(function (data) {
                var count =0;
                 for(var i=0;i<=data.length-1;i++){

                     if(data[i].gearmotor === gear.$id){
                         count++;
                         data[i].activate = 'False';
                         data[i].gearmotor = '';
                         console.log(data[i].$id+' == '+gear.$id);
                         obj.$save(data[i]).then(function (value) {
                             swal(" Saved complete!", "Affect to Machine "+count+" unit", "success"); })

                     }

                 }
                 if(count === 0)
                 {
                     swal(" Saved complete!", "save gearmotor completed!", "success");
                 }
            }
            )


        }

		function filterStringList(userInput,dropdown,key) {

            updateGearDesignation();
            updateGearBuildinType();
            updateMotorDesignation();
            updateMotorType();
            selectstring(userInput,key);
            var filter = $q.defer();
            var normalisedInput = userInput.toLowerCase();

            var filteredArray = dropdown.filter(function(country) {
                return country.toLowerCase().indexOf(normalisedInput) === 0;
            });

            filter.resolve(filteredArray);
            return filter.promise;
        };

        function removeDuplicates(arr){
            let unique_array = []
            for(let i = 0;i < arr.length; i++){
                if(unique_array.indexOf(arr[i]) == -1){
                    unique_array.push(arr[i])
                }
            }
            return unique_array
        }

        function Loadoption() {

            var ref = firebase.database().ref('/gearmotor');
            var obj = $firebaseArray(ref)
            obj.$loaded().then(function (data) {
            	vm.loadData.data = data;

                for(var i=0;i<=data.length-1;i++){

                    vm.GearunitOption.data.push(vm.loadData.data[i].gearUnitDesign);
                    vm.gearUnitSizeOption.data.push(vm.loadData.data[i].gearUnitSize);
                    vm.gearRatioOption.data.push(vm.loadData.data[i].gearRatio);
                    vm.gearTorqueOption.data.push(vm.loadData.data[i].gearTorque);
                    vm.gearBuildinTypeOption.data.push(vm.loadData.data[i].gearBuildinType);
                    vm.gearHollowOrOutputShaftOption.data.push(vm.loadData.data[i].gearHollowOrOutputShaft);
                    vm.gearOutputFlangeOption.data.push(vm.loadData.data[i].gearOutputFlange);
                    vm.gearDriveFlangeOption.data.push(vm.loadData.data[i].gearDriveFlange);
                    vm.gearOptionOption.data.push(vm.loadData.data[i].gearOption);
                    vm.efficOption.data.push(vm.loadData.data[i].effic);

                    vm.motorDesignOption.data.push(vm.loadData.data[i].motorDesign);
                    vm.motorFrameSizeOption.data.push(vm.loadData.data[i].motorFrameSize);
                    vm.motorPoleOption.data.push(vm.loadData.data[i].motorPole);
                    vm.motorPowerOption.data.push(vm.loadData.data[i].motorPower);
                    vm.motorVoltageDOption.data.push(vm.loadData.data[i].motorVoltageD);
                    vm.motorVoltageYOption.data.push(vm.loadData.data[i].motorVoltageY);
                    vm.motorCurrentOption.data.push(vm.loadData.data[i].motorCurrent);
                    vm.motorSpeedOption.data.push(vm.loadData.data[i].motorSpeed);
                    vm.motorBuildinTypeOption.data.push(vm.loadData.data[i].motorBuildinType);
                    vm.motorShaftOption.data.push(vm.loadData.data[i].motorShaft);
                    vm.motorOptionOption.data.push(vm.loadData.data[i].motorOption);

                }
                vm.GearunitOption.data = removeDuplicates(vm.GearunitOption.data);
                vm.gearUnitSizeOption.data = removeDuplicates(vm.gearUnitSizeOption.data);
                vm.gearRatioOption.data = removeDuplicates(vm.gearRatioOption.data);
                vm.gearTorqueOption.data = removeDuplicates(vm.gearTorqueOption.data);
                vm.gearBuildinTypeOption.data = removeDuplicates(vm.gearBuildinTypeOption.data);
                vm.gearHollowOrOutputShaftOption.data = removeDuplicates(vm.gearHollowOrOutputShaftOption.data);
                vm.gearOutputFlangeOption.data = removeDuplicates(vm.gearOutputFlangeOption.data);
                vm.gearDriveFlangeOption.data = removeDuplicates(vm.gearDriveFlangeOption.data);
                vm.gearOptionOption.data = removeDuplicates(vm.gearOptionOption.data);
                vm.efficOption.data = removeDuplicates(vm.efficOption.data);

                vm.motorDesignOption.data = removeDuplicates(vm.motorDesignOption.data);
                vm.motorFrameSizeOption.data = removeDuplicates(vm.motorFrameSizeOption.data);
                vm.motorPoleOption.data = removeDuplicates(vm.motorPoleOption.data);
                vm.motorPowerOption.data = removeDuplicates(vm.motorPowerOption.data);
                vm.motorVoltageDOption.data = removeDuplicates(vm.motorVoltageDOption.data);
                vm.motorVoltageYOption.data = removeDuplicates(vm.motorVoltageYOption.data);
                vm.motorCurrentOption.data = removeDuplicates(vm.motorCurrentOption.data);
                vm.motorSpeedOption.data = removeDuplicates(vm.motorSpeedOption.data);
                vm.motorBuildinTypeOption.data = removeDuplicates(vm.motorBuildinTypeOption.data);
                vm.motorShaftOption.data = removeDuplicates(vm.motorShaftOption.data);
                vm.motorOptionOption.data = removeDuplicates(vm.motorOptionOption.data);

            })


        }
		////// Start! Set form value from database ///////////

        vm.selectedDropdownItem = null;
        Loadoption();

        ////// End! Set form value from database ///////////

        function selectstring(data,key) {

			switch (key)
			{	case 'GearunitOption' : vm.gear.gearUnitDesign = data;break;
                case 'gearUnitSize' : vm.gear.gearUnitSize = data;break;
                case 'gearRatio' : vm.gear.gearRatio = data;break;
                case 'gearTorque' : vm.gear.gearTorque = data;break;
                case 'gearBuildinType' : vm.gear.gearBuildinType = data;break;
                case 'gearHollowOrOutputShaft' : vm.gear.gearHollowOrOutputShaft = data;break;
                case 'gearOutputFlange' : vm.gear.gearOutputFlange = data;break;
                case 'gearDriveFlange' : vm.gear.gearDriveFlange = data;break;
                case 'gearOption' : vm.gear.gearOption = data;break;

                case 'motorDesign' : vm.gear.motorDesign = data;break;
                case 'motorFrameSize' : vm.gear.motorFrameSize = data;break;
                case 'motorPole' : vm.gear.motorPole = data;break;
                case 'motorPower' : vm.gear.motorPower = data;break;
                case 'motorVoltageD' : vm.gear.motorVoltageD = data;break;
                case 'motorVoltageY' : vm.gear.motorVoltageY = data;break;
                case 'motorCurrent' : vm.gear.motorCurrent = data;break;
                case 'motorSpeed' : vm.gear.motorSpeed = data;break;
                case 'motorBuildinType' : vm.gear.motorBuildinType = data;break;
                case 'motorShaft' : vm.gear.motorShaft = data;break;
                case 'motorOption' : vm.gear.motorOption = data;break;
                case 'effic' : vm.gear.effic = data;break;
			}
            updateGearDesignation();
            updateGearBuildinType();
            updateMotorDesignation();
			updateMotorType();

        }

		Auth.$onAuthStateChanged(function(authData) {
			vm.authData = authData;
			if(vm.authData) {
				vm.user = Users.get(vm.authData);
				vm.user.$loaded()
					.then(function(user) {
						console.log('ล็อกอินมาด้วย:: '+vm.authData.email);
					})
			} else {
				$state.go('login');
			}
		})
		function Outputspeed(a,b) {
			var answer = Math.round(a/b);
			return answer;

        }
        function opt(a,ef,b,c) {
            var answer  = Math.round(9550 * a * ef/(b/c));
            return answer;
        }
        function svf(a,b) {

			var answer  = a /b;
			answer = answer.toFixed(2);

			return answer
        }
		getGear();

		if(vm.selected > 10)
		{
			var ref = firebase.database().ref('/gearmotor').child($stateParams.selected);
			var obj = $firebaseObject(ref)
			obj.$loaded().then(function (data) {
				vm.gear = data;

			})
		}
	
		function getGear() {
			var ref = firebase.database().ref('/gearmotor');
			var obj = $firebaseArray(ref);
			obj.$loaded()
				.then(function(gear) {
					vm.gearformdb = gear;
                    cfpLoadingBar.complete();
				})
		}
		function Deletegear(id) {
			vm.gearformdb.$remove(id).then(function (value) {
                    var ref = firebase.database().ref('/GearmotorMachine');
                    var obj = $firebaseArray(ref)
                    obj.$loaded().then(function (data) {
                            var count =0;
                            for(var i=0;i<=data.length-1;i++){

                                if(data[i].gearmotor === id.$id){
                                    count++;
                                    data[i].activate = 'False';
                                    console.log(data[i].$id+' == '+id.$id);
                                    obj.$save(data[i]).then(function (value) {
                                        swal(" Deleted complete!", "Affect to Machine "+count+" unit", "success"); })

                                }

                            }
                        }
                    )

			})


		}

		function addGear() {
			console.log('eiei');
			var ref = firebase.database().ref('/gearmotor');
			var obj = $firebaseArray(ref);
			obj.$add(vm.gear)
				.then( function(data) {
					console.log(data.toString().slice(46,66));

					swal("Good job!", "Gearmotor has been saved", "success");
					$state.go('dashboard.machineAdd',{id: vm.company_id, group: vm.group_id,selected:data.toString().slice(46,66)});

				});
		}
		
		function updateGearDesignation() {
			vm.gear.gearDesignation = (vm.gear.gearUnitDesign && vm.gear.gearUnitSize) ? vm.gear.gearUnitDesign + vm.gear.gearUnitSize : '';
		}

		function updateGearBuildinType() {
			vm.gear.gearType = (vm.gear.gearBuildinType && vm.gear.gearUnitSize) ? vm.gear.gearBuildinType + vm.gear.gearUnitSize : '';
		}

		function updateMotorDesignation() {
			vm.gear.motorDesignation = (vm.gear.motorDesign && vm.gear.motorFrameSize && vm.gear.motorPole) ? vm.gear.motorDesign + vm.gear.motorFrameSize + vm.gear.motorPole : '';
		}
		
		function updateMotorType() {
			vm.gear.motorType = (vm.gear.motorDesignation && vm.gear.motorBuildinType) ? vm.gear.motorDesignation + '/' + vm.gear.motorBuildinType: '';
		}

	}
})();
