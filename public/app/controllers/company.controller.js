(function() {
	'use strict';

	angular
			.module('app')
			.controller('companyCtrl', companyCtrl);

	companyCtrl.$inject = ['$scope', '$state', '$stateParams', '$firebaseArray', '$firebaseObject', 'Users', 'Auth','cfpLoadingBar'];

	function companyCtrl($scope, $state, $stateParams, $firebaseArray, $firebaseObject, Users, Auth, cfpLoadingBar) {
        cfpLoadingBar.start();
		var vm = this;

		vm.logout = logout;
		vm.addCompany = addCompany;
		vm.addGroup = addGroup;
		vm.deletegroup = deletegroup;
		vm.deleteCompany = deleteCompany;
		vm.deleteDoc = deleteDoc;
		vm.showDoc = showDoc;
		vm.closeQr = closeQr;
		
		
		vm.companies = [];
		vm.docs = [];
		vm.selectedDoc = {};
		vm.showAddCompany = false;
		vm.showAddGroup = false;
		vm.showQrDoc = false;

		if($stateParams.id) {
			getCurrentCompany($stateParams.id);
		} else {
			getCompany();
		}

		function logout() {
			console.log('log out');
			Users.logout();
			$state.go('login');
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

		function addCompany(company) {
			var ref = firebase.database().ref('/company');
			var obj = $firebaseArray(ref);
			obj.$add(
				{name:company.name}
				)
				.then(function(data) {
					console.log(data);
					swal("Good job!", "Company has been added", "success");
				})
				.catch(function(error) {
					console.log(error);
				})
		}

		function addGroup(group) {
			var ref = firebase.database().ref('/company').child($stateParams.id).child('/group');
			var obj = $firebaseArray(ref);
			obj.$add({
					name: group.name
				})
				.then(function(data) {
					vm.showAddGroup = false;
					vm.newGroup.name = '';
					swal("Good job!", "Group has been added", "success");
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

		function getCurrentCompany(company_id) {
			var ref = firebase.database().ref('/company').child(company_id);
			var obj = $firebaseObject(ref);
			obj.$loaded()
				.then(function (data) {
					vm.selectedCompany = data;
                    cfpLoadingBar.complete();
					if($stateParams.group) {
						vm.group = data.group[$stateParams.group];

                        cfpLoadingBar.complete();
					}
					getDocs();
				});
		}
		function deletegroup(groupselected) {
			var ref = firebase.database().ref('/company').child($stateParams.id).child('/group').child(groupselected);
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
						ref.remove()
							.then(function() {
								swal("Deleted!", "Your data has been deleted.", "success");
							})
					} else {
						swal("Cancelled", "Your data is safe :)", "error");
					}
				});


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

		$scope.$on('$dropletReady', function whenDropletReady() {
			$scope.interface.allowedExtensions([/.+/]);
		});

		$scope.$on('$dropletFileAdded', function dropletFileAdded() {
			var files = $scope.interface.getFiles($scope.interface.FILE_TYPES.VALID);
			_.forEach(files, function(file) {
				if(!file.uploading) {
					file.uploading = true;
					var fileName = file.file.name;
					var fileData = file.file;
					
					var time = Date.now().toString();
					var storageRef = firebase.storage().ref("docs").child(vm.selectedCompany.$id).child(time + fileName);
					var uploadTask = storageRef.put(fileData);
					uploadTask.on('state_changed', function(snapshot){

					}, function(error) {
						console.log(error);
					}, function() {
						var downloadURL = uploadTask.snapshot.downloadURL;
						var ref = firebase.database().ref('/company').child(vm.selectedCompany.$id).child('docs');
						var docs = $firebaseArray(ref);
						docs.$add({
							name: fileName,
							url: downloadURL,
							timestamp: time
						});
						file.deleteFile();
						// getDocs()
					});
				}
			});
		});


	}
})();
