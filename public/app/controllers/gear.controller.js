(function() {
	'use strict';

	angular
			.module('app')
			.controller('gearCtrl', gearCtrl);

	gearCtrl.$inject = ['$q','$scope','$state', 'Users', 'Auth', '$stateParams' ,'$firebaseArray','$firebaseObject','cfpLoadingBar','cfpLoadingBar'];

    /**
     * Object for mapping between options field and record field
     */
    var option_Mapping = {
        'GearunitOption'                    :   'gearUnitDesign',
        'gearUnitSizeOption'                :   'gearUnitSize',
        'gearRatioOption'                   :   'gearRatio',
        'gearTorqueOption'                  :   'gearTorque',
        'gearBuildinTypeOption'             :   'gearBuildinType',
        'gearHollowOrOutputShaftOption'     :   'gearHollowOrOutputShaft',
        'gearOutputFlangeOption'            :   'gearOutputFlange',
        'gearDriveFlangeOption'             :   'gearDriveFlange',
        'gearOptionOption'                  :   'gearOption',
        'efficOption'                       :   'effic',
        'motorDesignOption'                 :   'motorDesign',
        'motorFrameSizeOption'              :   'motorFrameSize',
        'motorPoleOption'                   :   'motorPole',
        'motorPowerOption'                  :   'motorPower',
        'motorVoltageDOption'               :   'motorVoltageD',
        'motorVoltageYOption'               :   'motorVoltageY',
        'motorCurrentOption'                :   'motorCurrent',
        'motorSpeedOption'                  :   'motorSpeed',
        'motorBuildinTypeOption'            :   'motorBuildinType',
        'motorShaftOption'                  :   'motorShaft',
        'motorOptionOption'                 :   'motorOption'
    };

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

        vm.loadData = { data:[] };

        initOptionData();

        function initOptionData() {
            for (var option in option_Mapping) {
                vm[option] = { data: [] };
            }
        }

        function savegearmotor(gear) {
            console.log(gear);
            
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

		function filterStringList(userInput, key) {
            selectstring(userInput,key);
            updateGearDesignation();
            updateGearBuildinType();
            updateMotorDesignation();
            updateMotorType();

            var filter = $q.defer();
            var normalisedInput = userInput.toLowerCase();

            var filteredArray = vm[key].data.filter(function(country) {
                return country.toLowerCase().indexOf(normalisedInput) === 0;
            });

            filter.resolve(filteredArray);

            return filter.promise;
        };

        function mergeOption(object) {
            for (var option in option_Mapping) {
                var field = option_Mapping[option];

                if (
                    object[field] &&
                    vm[option].data.indexOf(object[field]) === -1
                ) {
                    vm[option].data.push(object[field]);
                }
            }
        }

        function sortOption()
        {
            for (var option in option_Mapping) {
                vm[option].data.sort();
            }
        }

        function Loadoption() {

            var ref = firebase.database().ref('/gearmotor');
            var obj = $firebaseArray(ref);
            
            obj.$loaded().then(function (data) {
            	vm.loadData.data = data;

                vm.loadData.data.forEach(mergeOption);

                sortOption();
            });
        }
		////// Start! Set form value from database ///////////

        vm.selectedDropdownItem = null;
        Loadoption();

        ////// End! Set form value from database ///////////

        function selectstring(value, key) {
            console.log(value, key);
            
            if(option_Mapping.hasOwnProperty(key)) {
                vm.gear[option_Mapping[key]] = value;
            }
            
			// switch (key)
			// {	case 'GearunitOption' : vm.gear.gearUnitDesign = data;break;
            //     case 'gearUnitSize' : vm.gear.gearUnitSize = data;break;
            //     case 'gearRatio' : vm.gear.gearRatio = data;break;
            //     case 'gearTorque' : vm.gear.gearTorque = data;break;
            //     case 'gearBuildinType' : vm.gear.gearBuildinType = data;break;
            //     case 'gearHollowOrOutputShaft' : vm.gear.gearHollowOrOutputShaft = data;break;
            //     case 'gearOutputFlange' : vm.gear.gearOutputFlange = data;break;
            //     case 'gearDriveFlange' : vm.gear.gearDriveFlange = data;break;
            //     case 'gearOption' : vm.gear.gearOption = data;break;

            //     case 'motorDesign' : vm.gear.motorDesign = data;break;
            //     case 'motorFrameSize' : vm.gear.motorFrameSize = data;break;
            //     case 'motorPole' : vm.gear.motorPole = data;break;
            //     case 'motorPower' : vm.gear.motorPower = data;break;
            //     case 'motorVoltageD' : vm.gear.motorVoltageD = data;break;
            //     case 'motorVoltageY' : vm.gear.motorVoltageY = data;break;
            //     case 'motorCurrent' : vm.gear.motorCurrent = data;break;
            //     case 'motorSpeed' : vm.gear.motorSpeed = data;break;
            //     case 'motorBuildinType' : vm.gear.motorBuildinType = data;break;
            //     case 'motorShaft' : vm.gear.motorShaft = data;break;
            //     case 'motorOption' : vm.gear.motorOption = data;break;
            //     case 'effic' : vm.gear.effic = data;break;
            // }

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
			vm.gear.motorType = (vm.gear.motorDesignation && vm.gear.motorBuildinType) ? vm.gear.motorDesignation + '/' + vm.gear.motorBuildinType : '';
		}

	}
})();
