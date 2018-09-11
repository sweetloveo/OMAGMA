(function () {
	'use strict';

	angular
		.module('app')
		.controller('machineDescriptionCtrl', machineDescriptionCtrl);

		machineDescriptionCtrl.$inject = ['Auth','Users', 'Gear', '$scope', '$firebaseObject', '$firebaseArray', '$stateParams','$state','cfpLoadingBar'];

	function machineDescriptionCtrl(Auth, Users, Gear, $scope, $firebaseObject, $firebaseArray, $stateParams,$state, cfpLoadingBar) {
        cfpLoadingBar.start();
		var vm = this;

		vm.company_id = $stateParams.id;
		vm.group_id = $stateParams.group;
		vm.machine_id = $stateParams.machineId;
		vm.group = {};
		vm.mantenance = {};
        vm.checkup = {};
        vm.Getcompany = Getcompany;
        vm.addmt = addmt;
        vm.addcu = addcu;
		vm.gear = [];
		vm.deletemachine = deletemachine;
		vm.gear_data = {};
		vm.Gear = Gear;
		vm.gearmotor = {};
		$scope.machine_image = {};
		vm.deleteGearDetail = deleteGearDetail;

		Auth.$onAuthStateChanged(function(authData) {
			vm.authData = authData;
			if(vm.authData) {
				vm.user = Users.get(vm.authData);
				vm.user.$loaded()
					.then(function(user) {
                        vm.user = user;
                        if(vm.user.profile.level === "admin"){
                        	vm.admin = 1;
						}
					})
			} else {
				$state.go('login');
			}
		})
		getCurrentGear(vm.company_id);

		function Getcompany() {
            var ref = firebase.database().ref('/gearmotor');
            var obj = $firebaseArray(ref);
            obj.$loaded()
                .then(function(gear) {
                    vm.gearformdb = gear;
                })
        }
		function addmt(data) {

            var ref = firebase.database().ref('/company/' + vm.company_id + '/group/' + vm.group_id + '/machine/' + vm.gear.$id + '/maintenance/'+ vm.uniqid);
            var data_descibe = $firebaseObject(ref);
            data_descibe.$loaded().then(function (data123) { var old = data123;
            old.maintainer = data.maintainer
			old.cause = data.cause;
            old.date = data.date;
            data_descibe.$save(old).then(function (data) {
                swal("Added!", "Your data has been Added.", "success");
                vm.showdetail_mt = false;
			});
            console.log(old)});

        }
        function addcu(data) {
            var ref = firebase.database().ref('/company/' + vm.company_id + '/group/' + vm.group_id + '/machine/' + vm.gear.$id + '/checkup/'+ vm.uniqid);
            var data_descibe = $firebaseObject(ref);
            data_descibe.$loaded().then(function (data123) { var old = data123;
                old.temp = data.temp
                old.oil = data.oil;
                old.amp = data.amp;
                old.checker = data.checker;
                old.date = data.date;

                data_descibe.$save(old).then(function (data) {
                    swal("Added!", "Your data has been Added.", "success");
                    vm.showdetail_cu = false;
                });
                console.log(old)});


        }
        function getGearttype(KEY) {
            var ref = firebase.database().ref('/gearmotor').child(KEY);
            var obj = $firebaseObject(ref);
            return obj.$loaded()
                .then(function(gearmotors) {
					vm.gearmotor = gearmotors;

                    return gearmotors
                });
        }

		function getCurrentGear(company_id) {
			var ref = firebase.database().ref('/company/' + company_id + '/group/' + vm.group_id + '/machine/' + vm.machine_id);
			var obj = $firebaseObject(ref);
			obj.$loaded()
				.then(function (gear) {
					vm.gear = gear;
					console.log(vm.gear.id);
                    cfpLoadingBar.complete();
				})
				.then(_getGearDetail.bind(this, 'maintenance'))
				.then(_getGearDetail.bind(this, 'checkup'))
				.then(_getGearDetail.bind(this, 'images'))
				.then(_getGear.bind(this))
				.then(_constructGear.bind(this));
		}

		function _getGearDetail(key) {
			var ref = firebase.database()
				.ref('/company/' + vm.company_id + '/group/' + vm.group_id + '/machine/' + vm.machine_id + '/' + key);
			var obj = $firebaseArray(ref);
			return obj.$loaded()
								.then(function (data) {
									vm[key] = data;
									return vm[key];
								});
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
			var keyy ;
			vm.gear_data = _.find(gear, function (v, k) {
				if(k === vm.gear.id){
                    keyy = k;
				}
                return k === vm.gear.id;
			});
			vm.gear_data.$id = keyy;
			
			if (vm.gear_data.gearmotor.length) {
				var a = getGearttype(vm.gear_data.gearmotor);
				a.then(function (value) {
					vm.gear_data.gearType = value.gearType;
					vm.gear_data.motorType = value.motorType;
				})
			} else {
				vm.gear_data.gearType = '-';
				vm.gear_data.motorType = '-';
			}
            

		}


		function deletemachine() {

            var ref = firebase.database().ref('/GearmotorMachine/'+vm.gear.id);
            var obj = $firebaseObject(ref)
            obj.$remove().then(function (data) {

			vm.gear.$remove().then(function (value) {
				if(vm.checkup[0] || vm.mantenance[0]) {
                    firebase.storage().ref('/company').child(vm.company_id).child(vm.group_id).child(vm.machine_id).delete().then(function (value2) {
                        swal("Deleted!", "Your data has been deleted.", "success");
                    })
                }
                else {
                    swal("Deleted!", "Your data has been deleted.", "success");

				}
                $state.go('dashboard.machine',{id:vm.company_id,group:vm.group_id});


        }).catch(function (reason) {console.log(reason); });

        })
		}

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
								firebase.storage().ref().child(data.ref).delete();
								vm[key].$remove(data)
									.then(function() {
										swal("Deleted!", "Your data has been deleted.", "success");
									})
						} else {
								swal("Cancelled", "Your data is safe :)", "error");
						}
					});
			
		}

		$scope.$on('$dropletReady', function whenDropletReady() {
			$scope.machine_image.allowedExtensions(['png', 'jpg', 'bmp', 'gif']);
			$scope.machine_maintenance.allowedExtensions(['pdf']);
			$scope.machine_checkup.allowedExtensions(['pdf']);
		});

		function uploadFile(key, files) {
			_.forEach(files, function(file) {
				if(!file.uploading) {
					file.uploading = true;
					var fileName = file.file.name;
					var fileData = file.file;
					
					var time = moment().format("DD/MM/YYYY");
					var storageRef = firebase.storage().ref('/company').child(vm.company_id).child(vm.group_id).child(vm.machine_id).child(key).child(time + fileName);
					var uploadTask = storageRef.put(fileData);
					uploadTask.on('state_changed', function(snapshot){

					}, function(error) {
						console.log(error);
					}, function() {
						var downloadURL = uploadTask.snapshot.downloadURL;
						var ref = firebase.database().ref('/company/' + vm.company_id + '/group/' + vm.group_id + '/machine/' + vm.gear.$id).child(key);
						var file_array = $firebaseArray(ref);
						file_array.$add({
							name: fileName,
							url: downloadURL,
							ref: '/company/' + vm.company_id + '/' + vm.group_id + '/' + vm.machine_id + '/' + key +'/' + time + fileName, 
							timestamp: time
						}).then(function (data) {vm.uniqid = data.key});
						file.deleteFile();
						if(key === "maintenance"){
                            vm.showdetail_mt = true;

						}
                        else if(key === "checkup"){
                            vm.showdetail_cu = true;

                        }

					});
				}
			});
		}

		$scope.$on('$dropletFileAdded', function dropletFileAdded() {
			var image_files = $scope.machine_image.getFiles($scope.machine_image.FILE_TYPES.VALID);
			var machine_maintenance = $scope.machine_maintenance.getFiles($scope.machine_maintenance.FILE_TYPES.VALID);
			var machine_checkup = $scope.machine_checkup.getFiles($scope.machine_checkup.FILE_TYPES.VALID);
			uploadFile('images', image_files);
			uploadFile('maintenance', machine_maintenance);
			uploadFile('checkup', machine_checkup);
		});

	}
	
})();