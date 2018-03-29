(function() {
	'use strict';

	angular
			.module('app')
			.config(config);

	config.$inject = ['$stateProvider', '$urlRouterProvider'];

	function config($stateProvider, $urlRouterProvider){
		var login = {
			name: 'login',
			url: '/login',
			templateUrl: 'pages/login.html',
		    controller: 'loginCtrl',
		    controllerAs: 'vm'
		}
		var signup = {
			name: 'signup',
			url: '/signup',
			templateUrl: 'pages/signup.html',
		    controller: 'signupCtrl',
		    controllerAs: 'vm'
		}
		var dashboard = {
			name: 'dashboard',
			url: '/dashboard',
			templateUrl: 'pages/dashboard.html',
			controller: 'dashboardCtrl',
			controllerAs: 'vm'
		}
		var users = {
			name: 'dashboard.users',
			url: '/users',
			templateUrl: 'pages/users/users.html',
			controller: 'usersCtrl',
			controllerAs: 'vm'
		}
		var gearselect = {
			name: 'dashboard.gearselect',
			url: '/company/:id/:group/gmselect',
			templateUrl: 'pages/gear/gear.html',
			controller: 'gearCtrl',
			controllerAs: 'vm'
		}
		var gearselected = {
			name: 'dashboard.gmselected',
			url: '/company/:id/:group/gmselect/:selected',
			templateUrl: 'pages/gear/gear-single.html',
			controller: 'gearCtrl',
			controllerAs: 'vm'
		}
		var gearSingle = {
			name: 'dashboard.gearSingle',
			url: '/company/:id/:group/gmselect/add',
			templateUrl: 'pages/gear/gear-single.html',
			controller: 'gearCtrl',
			controllerAs: 'vm'
		}
		
		var company = {
			name: 'dashboard.company',
			url: '/company',
			templateUrl: 'pages/company/company.html',
			controller: 'companyCtrl',
			controllerAs: 'vm'
		}
        var report = {
            name: 'dashboard.report',
            url: '/report',
            templateUrl: 'pages/report/report.html',
            controller: 'reportCtrl',
            controllerAs: 'vm'
        }
		var companySingle = {
			name: 'dashboard.companySingle',
			url: '/company/:id',
			templateUrl: 'pages/company/company-single.html',
			controller: 'companyCtrl',
			controllerAs: 'vm'
		}
		var machine = {
			name: 'dashboard.machine',
			url: '/company/:id/:group',
			templateUrl: 'pages/company/machine.html',
			controller: 'machineCtrl',
			controllerAs: 'vm'
		}
		var machineDescription = {
			name: 'dashboard.machineDescription',
			url: '/company/:id/:group/machine/des/:machineId',
			templateUrl: 'pages/company/machine-description.html',
			controller: 'machineDescriptionCtrl',
			controllerAs: 'vm'
		}
		var machineMaintenance = {
			name: 'dashboard.machineMaintenance',
			url: '/company/:id/:group/:machine/maintenance',
			templateUrl: 'pages/company/machine-maintenance.html',
			controller: 'maintenanceCtrl',
			controllerAs: 'vm'
		}
		var machineCheckup = {
			name: 'dashboard.machineCheckup',
			url: '/company/:id/:group/:machine/checkup',
			templateUrl: 'pages/company/machine-checkup.html',
			controller: 'checkupCtrl',
			controllerAs: 'vm'
		}
		var machineAdd = {
			name: 'dashboard.machineAdd',
			url: '/company/:id/:group/machine/add/:selected',
			templateUrl: 'pages/company/machine-add.html',
			controller: 'machineAddCtrl',
			controllerAs: 'vm'
		}
        var machineEdit = {
            name: 'dashboard.machineEdit',
            url: '/company/:id/:group/machine/edit/:machineId/:selected',
            templateUrl: 'pages/company/machine-add.html',
            controller: 'machineAddCtrl',
            controllerAs: 'vm'
        }

		$stateProvider.state(login);
		$stateProvider.state(signup);
		$stateProvider.state(dashboard);
		$stateProvider.state(company);
		$stateProvider.state(companySingle);
		$stateProvider.state(users);
        $stateProvider.state(report);
		$stateProvider.state(gearselected);
		$stateProvider.state(gearselect);
		$stateProvider.state(gearSingle);
		$stateProvider.state(machine);
		$stateProvider.state(machineDescription);
		$stateProvider.state(machineAdd);
		$stateProvider.state(machineEdit);
		$stateProvider.state(machineMaintenance);
		$stateProvider.state(machineCheckup);
		$urlRouterProvider.otherwise("/login");
	}
})();
