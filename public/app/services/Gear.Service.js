(function() {
	'use strict';

	angular
			.module('app')
			.factory('Gear', Gear);

	Gear.$inject = ['$q', '$firebaseArray', '$firebaseObject'];

	function Gear($q, $firebaseArray, $firebaseObject) {
        // solving current problem about some invalid options
        var invalidData = {
            'gear': {
                'gearBuildinType': [],
                'gearOption': ['-']
            },
            'motor': {
                'motorBuildinType': ['FG'],
                'motorOption': ['-']
            }
        };

        return {
            isInvalid: function isInvalid(part, field, assertValue) {
                var isInvalid = false;
                
                if (invalidData[part] && invalidData[part][field]) {
                    isInvalid = invalidData[part][field].indexOf(
                        assertValue.trim().toUpperCase()
                    ) !== -1;
                }

                return isInvalid;
            },

            getGearType: function getGearType(obj) {
                var gearType = '';
                
                if(
                    obj &&
                    obj.gearBuildinType &&
                    obj.gearUnitSize &&
                    !this.isInvalid('gear', 'gearBuildinType', obj.gearBuildinType)
                ) {
                    gearType += obj.gearBuildinType + obj.gearUnitSize;
                }

                gearType += this.getGearOption(obj);

                return gearType;
            },

            getGearOption: function getGearOption(obj) {
                var gearOption = '',
                    prefix;
                
                if (
                    obj &&
                    obj.gearOption &&
                    !this.isInvalid('gear', 'gearOption', obj.gearOption)
                ) {
                    prefix = obj.gearOption.indexOf('/') === -1 ? '/' : '';

                    gearOption = prefix + obj.gearOption;
                }

                return gearOption;
            },

            getMotorType: function getMotorType(obj) {
                var motorType = '';
    
                if(obj && obj.motorDesignation) {
                    motorType = obj.motorDesignation;
    
                    if(
                        obj.motorBuildinType &&
                        !this.isInvalid('motor', 'motorBuildinType', obj.motorBuildinType)
                    ) {
                        motorType += obj.motorBuildinType;
                    }

                    motorType += this.getMotorOption(obj);
                }

                return motorType;
            },

            getMotorOption: function getMotorOption(obj) {
                var motorOption = '',
                    prefix;
                
                if (
                    obj &&
                    obj.motorOption &&
                    !this.isInvalid('motor', 'motorOption', obj.motorOption)
                ) {
                    prefix = obj.motorOption.indexOf('/') === -1 ? '/' : '';

                    motorOption = prefix + obj.motorOption;
                }

                return motorOption;
            },

            getFullType: function getFullType(obj) {
                var gearFullOption = '',
                    gearWithOption = this.getGearType(obj),
                    motorWithOption = this.getMotorType(obj);

                if (obj) {
                    if (gearWithOption.length) {
                        gearFullOption += gearWithOption;
                    }

                    if (motorWithOption.length) {
                        if (gearFullOption.length) {
                            gearFullOption += ' ';
                        }
                        
                        gearFullOption += motorWithOption;
                    }

                    if (!gearFullOption.length) {
                        gearFullOption = '-';
                    }
                }
                

                return gearFullOption;
            },

            getFirebaseGear: function getFirebaseGear(key) {
                var ref = firebase.database().ref('/gearmotor').child(key);

                return $firebaseObject(ref).$loaded()
                    .then(function(gearmotor) {
                        return gearmotor;
                    });
            }
        };
	}
})();
