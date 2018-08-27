(function() {
	'use strict';

	angular
			.module('app')
			.factory('Users', Users);

	Users.$inject = ['$q', '$firebaseArray', '$firebaseObject', 'Auth'];

	function Users($q, $firebaseArray, $firebaseObject, Auth) {
		var usersRef = firebase.database().ref().child('users');

		var users = {
			signup: signup,
			addUser: addUser,
			login: login,
			logout: logout,
			get: get,
			add: add,
			update: update,
			getAll: getAll,
			sendPasswordResetEmail
		};
		return users;

		function expirecal(time) {
			if (time === "1 ปี"){
				return moment().add(1, 'years').format('DD/MM/YYYY');
			}
			else if (time === "5 ปี"){
                return moment().add(5, 'years').format('DD/MM/YYYY');
            }
            else if (time === "ถาวร"){
                return '-';
            }
			else
			{
                return moment().add(15, 'days').format('DD/MM/YYYY');
			}
        }

		function signup(userData) {
			var defer = $q.defer();

			Auth.$createUserWithEmailAndPassword(userData.email, userData.password)
				.then(function(authData) {
					users.add(authData, userData)
						.then(function(data) {
							defer.resolve(data);
							Auth.$signOut();
						}).catch(function(error) {
							defer.reject(error);
						})
				}, function(error) {
					defer.reject(error);
				});
			return defer.promise;
		}

		function addUser(currentUser, userData) {
            var config = {
                apiKey: "AIzaSyCOkR5vjW5O6gpwSisaUMH_aGAaYO2kUIw",
                authDomain: "omagma-abe44.firebaseapp.com",
                databaseURL: "https://omagma-abe44.firebaseio.com"
            };
            var second = firebase.initializeApp(config ,moment().format("h:mm:ss"));


			var defer = $q.defer();

			second.auth().createUserWithEmailAndPassword(userData.email, userData.password)
				.then(function(authData) {
                    second.auth().sendPasswordResetEmail(userData.email);
					// current.sendEmailVerification()
					users.add(authData, userData)
						.then(function(data) {
							second.auth().signOut()
								.then(function (data) {
									defer.resolve(authData)
								})
								.catch(function(error) {
									console.log(error);
								});
						}).catch(function(error) {
							defer.reject(error);
						})
				}, function(error) {
					defer.reject(error);
				});
			return defer.promise;
		}

		function login(userData) {
			var defer = $q.defer();

			Auth.$signInWithEmailAndPassword(userData.email,userData.password)
				.then(function(authData) {

                    var ref = usersRef.child(authData.uid);
                    var obj = $firebaseObject(ref);
                    obj.$loaded()
                        .then(function(data) {
                            if(data.profile.Available === "ถูกระงับ"){
                                Auth.$signOut();
                                defer.reject(false);
                            }
                            else{

                                defer.resolve(authData);
                            }
                        })
                        .catch(function(error) {
                            console.error("Error:", error);
                        });
				}, function(error) {
					defer.reject(error);
				})
			return defer.promise;
		}

		function logout() {
			Auth.$signOut();
		}

		function update(authData, userData) {
			var defer = $q.defer();
			
				if(!authData.uid) {
					defer.reject("ERROR UID");
					return defer.promise;
				}

				var user = usersRef.child(authData.uid);

				user.update({
					profile: {
						name: userData.name || user.profile.name,
						email: userData.email || user.profile.email,
						level: userData.level || user.profile.level,
						company: userData.company || user.profile.company,
						updatedAt: Date.now()
					}
				}).then(function(data) {
							defer.resolve(data);
						}, function(error) {
							defer.reject(error);
						});
				return defer.promise;
		}

		function add(authData,userData) {
			var defer = $q.defer();

			if(!authData.uid) {
				defer.reject("ERROR UID");
				return defer.promise;
			}

			var user = usersRef.child(authData.uid);
			user.set({
				profile: {
					name: userData.name,
					email: userData.email,
					level: userData.level || 'user',
					company: {
						name: userData.company.name || ''
					},
                    Time: userData.time,
					Available:"ปกติ",
					createdAt: moment().format("DD/MM/YYYY"),
                    ExpireAt: expirecal(userData.time)
        }
			}).then(function(data) {
		      	defer.resolve(data);
                swal("Welcome "+userData.name+"!", "You has been registered", "success");
		      }, function(error) {
		      	defer.reject(error);
		      });
     return defer.promise;
		}

		function get(authData) {
			var defer = $q.defer();

			if(!authData.uid) {
				defer.reject("ERROR UID");
				return defer.promise;
			}
			
			var ref = usersRef.child(authData.uid);
			
			var user = $firebaseObject(ref);

			return user;
		}

		function getAll() {
			var defer = $q.defer();
			var user = $firebaseArray(firebase.database().ref('/users'));
			user.$loaded()
				.then(function(users) {
					defer.resolve(users)
					console.log(users);
				})
				.catch(function(error) {
					console.log(error);
					defer.reject(error);
				})
			return defer.promise;
		}
		
		function sendPasswordResetEmail(emailAddress) {
			firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
				swal({
					title: "Email was sent",
					text: "Please check inbox to reset your password",
					type: "success"
				});
			}).catch(function(error) {
				console.log(error);
				swal({
					title: "Some error occurs",
					text: error.code + " Please contact administrator.",
					type: "error"
				})
			});
		}


	}
})();
