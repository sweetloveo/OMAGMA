(function() {
	'use strict';

	angular
			.module('app')
			.controller('reportCtrl', reportCtrl);

	reportCtrl.$inject = ['$scope', '$state', '$stateParams', '$firebaseArray', '$firebaseObject', 'Users', 'Auth','cfpLoadingBar'];

	function reportCtrl($scope, $state, $stateParams, $firebaseArray, $firebaseObject, Users, Auth, cfpLoadingBar) {
        cfpLoadingBar.start();
		var vm = this;

		vm.logout = logout;
		vm.process = process;
		vm.report = {};
		vm.getAll = getAll;
        vm.showPrint = false;
		vm.checkup = false;
		vm.maintenance = false;
		vm.getCompany = getCompany;


        getCompany();
        function getCompany() {
            var ref = firebase.database().ref('/company');
            var obj = $firebaseArray(ref);
            obj.$loaded()
                .then(function(data) {
                    vm.companies = data;
                    cfpLoadingBar.complete();

                })
        }


        async  function getAll(key) {

            vm.dataa = new Array();

						var ref2 = firebase.database()
							.ref('/company/'+ vm.report.company.$id+'/group');
						var obj2 = $firebaseArray(ref2);
					   await obj2.$loaded().then(async function (data2) {

							for(let i2=0;i2<=data2.length-1;i2++){
								var ref3 = firebase.database()
									.ref('/company/'+ vm.report.company.$id+'/group/'+data2[i2].$id+'/machine');
								var obj3 = $firebaseArray(ref3);
								await obj3.$loaded().then(async function (data3) {
									//console.log('Group'+data2[i2].$id+'ของCompany:'+i+'|Group in >');
									//console.log(data3);
									for(let i3=0;i3<=data3.length-1;i3++){

										var ref4 = firebase.database()
											.ref('/company/'+ vm.report.company.$id+'/group/'+data2[i2].$id+'/machine/'+data3[i3].$id+'/'+key);
										var obj4 = $firebaseArray(ref4);
										await obj4.$loaded().then(async function (data4) {
											for(let ee = 0;ee<=data4.length-1;ee++){

												if(data4[ee]!=undefined){
													await vm.dataa.push(data4[ee]);
												}
											}

										})

									}
								})

							}
						});


            return vm.dataa;

		}
		async function days(data,d,d2,key) {
        	var  data1 =[];
        	for(let i=0;i<=data.length-1;i++){
                let dd = new Date(data[i].date);
        		if (d <= dd && dd <= d2){
        			data1.push(data[i]);
				}
			}
        	if(data1.length > 0 ){
        		if(key === 'maintenance'){
        			vm.maintenance = data1;
				}
				else
				{
					vm.checkup = data1;
				}
                vm.showPrint = true;
                $scope.$apply()

			}
        	else{
                swal({
                    title: "Oops. Not found.",
                    text: " Please try again and recheck your form date",
                    type: "error"
                })
			}
        }

		function process(data) {
			var d = new Date(data.start);
			var d2 = new Date(data.end);
            console.log(data.key);
			if (data.key === 'maintenance'){
                getAll('maintenance').then(function (result) {
                  days(result,d,d2,data.key);

				});



			}
			else if (data.key === 'checkup')
			{
                getAll('checkup').then(function (result) {
                    days(result,d,d2,data.key);

                });

			}

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
	}
})();
