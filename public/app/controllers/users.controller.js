(function() {
	'use strict';

	angular
			.module('app')
			.controller('usersCtrl', usersCtrl);

	usersCtrl.$inject = ['Users', '$firebaseArray', 'Auth','cfpLoadingBar','$http'];

	function usersCtrl(Users, $firebaseArray, Auth, cfpLoadingBar,$http) {
        cfpLoadingBar.start();
		var vm = this;

		vm.errorMessage = "";
		vm.loading = false;
		vm.users = {};
		vm.getAll = getAll;
		vm.available = available;
		vm.deleteUser = deleteUser;
		vm.resetPassword = resetPassword;
		vm.addUser = addUser;
		vm.usersedit = edit;

		function edit(user) {
			if(vm.oldbegin.Time === user.profile.Time)
			{
                if(user.profile.level === 'admin'){
                    user.profile.Available = 'ปกติ';
                    user.profile.ExpireAt = '-';
                    user.profile.Time = 'ถาวร';
                    vm.users.$save(user);
                }
                vm.users.$save(user);
			}
			else{

                if(user.profile.Time === '1 ปี'){
                    user.profile.Available = 'ปกติ';
                    user.profile.ExpireAt = moment().add(1, 'years').format('DD/MM/YYYY');
                    vm.users.$save(user);
                }
                else if(user.profile.Time === '5 ปี'){
                    user.profile.Available = 'ปกติ';
                    user.profile.ExpireAt = moment().add(5 ,'years').format('DD/MM/YYYY');
                    vm.users.$save(user);
                }
                else if(user.profile.Time === 'ถาวร'){
                    user.profile.Available = 'ปกติ';
                    user.profile.ExpireAt = '-';
                    vm.users.$save(user);
                }

                else
                {
                    user.profile.Available = 'ปกติ';
                    user.profile.ExpireAt = moment().add(15, 'days').format('DD/MM/YYYY');
                    vm.users.$save(user);

                }

			}
			if(vm.oldbegin.Available === user.profile.Available)
			{
                vm.users.$save(user);
			}
			else {
				if(user.profile.Available === 'ปกติ'){
                    vm.users.$save(user);
				}
				else{

                    user.profile.ExpireAt = "หมดอายุ";
                    vm.users.$save(user);
				}
			}



        }

		getAll();

		function available(user) {
			if(moment().format("DD/MM/YYYY") === user.profile.ExpireAt)
			{

				user.profile.Available = "ถูกระงับ";
                vm.users.$save(user)
                return user.profile.ExpireAt;

			}

			else if(user.profile.ExpireAt === "หมดอายุ"){
				return user.profile.ExpireAt;

			}
            else if(user.profile.ExpireAt === "-"){
                user.profile.Available = "ปกติ";
                return user.profile.ExpireAt;

            }

			else{

                return moment(user.profile.ExpireAt, "DD/MM/YYYY").fromNow();

			}
        }

		function getAll() {
			Users
				.getAll()
				.then(function (users) {
					vm.users = users
                    cfpLoadingBar.complete();
				})
				.then(getCompany.bind(this));
		}

		Auth.$onAuthStateChanged(function(authData) {
			vm.authData = authData;
			if(vm.authData) {
				vm.user = Users.get(vm.authData);
			} else {
				$state.go('login');
			}
		});

		function getCompany() {
			var ref = firebase.database().ref('/company');
			var obj = $firebaseArray(ref);
			obj.$loaded()
				.then(function(data) {
					vm.companies = data;
					vm.companies.push({name:'Add company'},{name:'-'});
					console.log(vm.companies);
				})
		}

        function addCompany(company) {
            var ref = firebase.database().ref('/company');
            var obj = $firebaseArray(ref);
            obj.$add(
                {name:company}
            )
                .then(function(data) {
                    console.log(data);
                })
                .catch(function(error) {
                    console.log(error);
                })
        }

		function addUser(user) {
			if(user.company.name === 'Add company'){
                user.company.name = vm.newCompany.name;
                addCompany(vm.newCompany.name);
			}
			Users.addUser(vm.user, user)
				.then(function(data) {
					vm.newUser = {};
					vm.showAddUser = false;
					vm.successMessage = "สมัครสมาชิกเรียบร้อยแล้ว";
				}, function(error) {
					vm.errorMessage = error.message;
				})
		}

		function deleteUser(user) {
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
								vm.users.$remove(user)
									.then(function() {
										console.log(user);

                                        $http.get("https://us-central1-omagma-abe44.cloudfunctions.net/deleteUser?text="+user.$id)
                                            .then(function(response) {
                                            	console.log(response);
                                                swal("Deleted!", "Your data has been deleted.", "success");
                                            });


                                        // var config = {
                                        //     apiKey: "AIzaSyCOkR5vjW5O6gpwSisaUMH_aGAaYO2kUIw",
                                        //     authDomain: "omagma-abe44.firebaseapp.com",
                                        //     databaseURL: "https://omagma-abe44.firebaseio.com",
                                        //     projectId: "omagma-abe44",
                                        //     storageBucket: "omagma-abe44.appspot.com",
                                        //     messagingSenderId: "151045131643"
                                        // };
                                        // var second = firebase.initializeApp(config ,moment().format("h:mm:ss"));
                                        // var credential = firebase.auth.EmailAuthProvider.credential(user.profile.email, "123456");
                                        //
                                        // // second.auth().signInWithCredential(credential).then(function(firebaseUser) {
                                        // //     console.log("Signed in as:", firebaseUser.uid);
                                        // //     var deleteuser = second.auth().currentUser;
                                        // //     deleteuser.delete().then(function() {
                                        // //         console.log("User removed successfully!");
                                        // //         swal("Deleted!", "Your data has been deleted.", "success");
                                        // //     }).catch(function(error) {
                                        // //         console.error("Error: ", error);
                                        // //     });
                                        // // }).catch(function(error) {
                                        // //     console.error("Authentication failed:", error);
                                        // // });
									})
						} else {
								swal("Cancelled", "Your data is safe :)", "error");
						}
					});
		}

		function resetPassword(email) {
			swal({
				title: "Send reset password?",
				text: "Reset password email will be sent to user.",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, send it!",
				cancelButtonText: "No, cancel",
				closeOnConfirm: false,
				closeOnCancel: false }, 
					function(isConfirm){ 
						if (isConfirm) {
							Users.sendPasswordResetEmail(email);
						} else {
							swal("Cancelled", "Your request was cancel", "error");
						}
					});

		}

	}
})();
