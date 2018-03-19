(function() {
	'use strict';

	angular
			.module('app')
			.controller('dashboardCtrl', dashboardCtrl);

	dashboardCtrl.$inject = ['$scope', '$state', '$firebaseArray', '$firebaseObject', 'Users', 'Auth','cfpLoadingBar','cfpLoadingBar'];

	function dashboardCtrl($scope, $state, $firebaseArray, $firebaseObject, Users, Auth,cfpLoadingBar) {
        cfpLoadingBar.start();
		var vm = this;

		vm.logout = logout;
		vm.addCompany = addCompany;
		vm.showCompany = showCompany;
		vm.deleteCompany = deleteCompany;
		vm.deleteDoc = deleteDoc;
		vm.showDoc = showDoc;
		vm.closeQr = closeQr;
		vm.updateGearDesignation = updateGearDesignation;
		vm.updateGearBuildinType = updateGearBuildinType;
		vm.updateMotorDesignation = updateMotorDesignation;
		vm.updateMotorType = updateMotorType;
		vm.submitGear = submitGear;
		vm.deleteGear = deleteGear;
		
		vm.companies = [];
		vm.gears = [];
		vm.docs = [];
		vm.selectedDoc = {};
		vm.showAddCompany = false;
		vm.page = 'dashboard';
		vm.showQrDoc = false;
		
		getCompany();
		getGears();

		function logout() {
			console.log('log out');
			Users.logout();
			$state.go('login');
		}

		Auth.$onAuthStateChanged(function(authData) {
			vm.authData = authData;
			if(vm.authData) {
				vm.user = Users.get(vm.authData);
				vm.user.$loaded();
			} else {
				$state.go('login');
			}
		})	

		function addCompany(company) {
			var ref = firebase.database().ref('/company');
			var obj = $firebaseArray(ref);
			obj.$add({
					name: company.name
				})
				.then(function(data) {
					console.log(data);
					vm.showAddCompany = false;
					vm.newCompany.name = '';
					swal("Good job!", "Company has been added", "success");
				})
				.catch(function(error) {
					console.log(error);
				})
		}

		function getCompany() {
			var ref = firebase.database().ref('/company');
			var obj = $firebaseArray(ref);
			obj.$loaded()
				.then(function(data) {
					vm.companies = data;
                    cfpLoadingBar.complete();
				})
		}

		function showCompany(company) {
			var ref = firebase.database().ref('/company').child(company.$id);
			var obj = $firebaseObject(ref);
			obj.$loaded()
				.then(function(data) {
					vm.selectedCompany = data;
					getDocs();
					vm.page = 'company';
				})
		}

		function deleteCompany(company) {
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
								vm.companies.$remove(company)
									.then(function() {
										swal("Deleted!", "Your data has been deleted.", "success");
									})
						} else {
								swal("Cancelled", "Your data is safe :)", "error");
						}
					});
		}

		function showDoc(doc) {
			console.log('a');
			vm.selectedDoc = doc;
			vm.showQrDoc = true;
		}

		function closeQr() {
			vm.selectedDoc = {};
			vm.showQrDoc = false;
		}

		function deleteDoc(doc) {
			swal({
				title: "Are you sure?",
				text: "Your will not be able to recover file",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete it!",
				cancelButtonText: "No, cancel!",
				closeOnConfirm: false,
				closeOnCancel: false }, 
					function(isConfirm){ 
						if (isConfirm) {
							var storageRef = firebase.storage().ref("docs").child(vm.selectedCompany.$id).child(doc.timestamp + doc.name);
							storageRef.delete().then(function() {
								swal("Deleted!", "Your file has been deleted.", "success");
							}).catch(function(error) {
								// Uh-oh, an error occurred!
								console.log(error);
							});
						} else {
								swal("Cancelled", "Your file is safe :)", "error");
						}
					});

		}

		function getDocs() {
			vm.docs = [];
			var ref = firebase.database().ref('/company').child(vm.selectedCompany.$id).child('docs');
			var obj = $firebaseArray(ref);
			obj.$loaded()
				.then(function(data) {
					vm.docs = data;
				})
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

		function submitGear() {
			var ref = firebase.database().ref('/gear');
			var obj = $firebaseArray(ref);
			obj.$add(vm.gear)
				.then(function() {
					console.log('Save gear Successfully');
					vm.gear = {};
					vm.page = 'gear';
					swal("Good job!", "Company has been added", "success");
				})
				.catch(function(error) {
					console.log(error);
				})
		}

		function getGears() {
			var ref = firebase.database().ref('/gear');
			var obj = $firebaseArray(ref);
			obj.$loaded()
				.then(function(gears) {
					vm.gears = gears;
					getGearSuggestion(gears);
					
				})
		}

		function deleteGear(gear) {
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
								vm.gears.$remove(gear)
									.then(function() {
										swal("Deleted!", "Your data has been deleted.", "success");
									})
						} else {
								swal("Cancelled", "Your data is safe :)", "error");
						}
					});
		}

		function getGearSuggestion(gears) {
			vm.gearSuggestion = {};
			for (var key in gears[0]) {
				vm.gearSuggestion[key] =  _.sortedUniq(_.map(gears, function(val) {
					return val[key];
				}));
			}
	}


	}
})();
