(function(mk) {

    'use strict';

    mk.calc = {};

    mk.calc.types = {
        'units': {
            'Barbarian': [20, [25, 40, 60, 80, 100, 150], 1, 1],
            'Archer': [25, [50, 80, 120, 160, 200, 300], 1, 2],
            'Goblin': [30, [25, 40, 60, 80, 100], 1, 3],
            'Giant': [120, [500, 1000, 1500, 2000, 2500, 3000], 5, 4],
            'Wall_Breaker': [120, [1000, 1500, 2000, 2500, 3000, 3500], 2, 5],
            'Balloon': [600, [2000, 2500, 3000, 3500, 4000, 4500], 5, 6],
            'Wizard': [600, [1500, 2000, 2500, 3000, 3500], 4, 7],
            'Healer': [900, [5000, 6000, 8000, 10000], 14, 8],
            'Dragon': [1800, [25000, 30000, 36000, 42000], 20, 9],
            'P-E-K-K-A-': [2700, [30000, 35000, 42000, 50000], 25, 10]
        },
        'dark': {
            'Minion': [45, [6, 7, 8, 9, 10], 2, 1],
            'Hog Rider': [300, [30, 35, 40, 45, 50], 5, 2],
            'Valkyrie': [900, [70, 100, 130, 160], 8, 3],
            'Golem': [2700, [450, 525, 600, 675, 750], 30, 4],
            'Witch': [1200, [250, 350], 12, 5]
        },
        'spells': {
            'Lightning': [1800, [15000, 16500, 18000, 20000, 22000, 24000], 1, 1],
            'Healing': [1800, [20000, 22000, 24000, 26500, 29000, 32000], 1, 2],
            'Rage': [2700, [30000, 33000, 36000, 40000, 44000], 1, 3],
            'Jump': [2700, [30000, 38000], 1, 4],
            'Freeze': [2700, [35000, 40000, 45000], 1, 5]
        }
    };

    mk.calc.saveMappingKeys = [
        'barracks-levels-1',
        'barracks-levels-2',
        'barracks-levels-3',
        'barracks-levels-4',
        'dark-barracks-levels-1',
        'dark-barracks-levels-2',
        'armyCamps',
        'spellFactoryLevel',
        'Barbarian',
        'Archer',
        'Goblin',
        'Giant',
        'Wall_Breaker',
        'Balloon',
        'Wizard',
        'Healer',
        'Dragon',
        'P-E-K-K-A-',
        'Barbarian-level',
        'Archer-level',
        'Goblin-level',
        'Giant-level',
        'Wall_Breaker-level',
        'Balloon-level',
        'Wizard-level',
        'Healer-level',
        'Dragon-level',
        'P-E-K-K-A--level',
        'Barbarian-subtract',
        'Archer-subtract',
        'Goblin-subtract',
        'Giant-subtract',
        'Wall_Breaker-subtract',
        'Balloon-subtract',
        'Wizard-subtract',
        'Healer-subtract',
        'Dragon-subtract',
        'P-E-K-K-A--subtract',
        'Lightning',
        'Healing',
        'Rage',
        'Jump',
        'Lightning-level',
        'Healing-level',
        'Rage-level',
        'Jump-level',
        'Minion',
        'Hog Rider',
        'Valkyrie',
        'Golem',
        'Minion-level',
        'Hog Rider-level',
        'Valkyrie-level',
        'Golem-level',
        'Minion-subtract',
        'Hog Rider-subtract',
        'Valkyrie-subtract',
        'Golem-subtract',
        'Freeze',
        'Freeze-level',
        'Witch',
        'Witch-level',
        'Witch-subtract'
    ];

    mk.calc.dataObjectToArray = function(dataObject) {
        var dataArray = [];

        mk.calc.saveMappingKeys.forEach(function(key) {
            var value;
            if (dataObject.hasOwnProperty(key)) {
                value = dataObject[key];
            } else {
                value = 0;
            }
            dataArray.push(value);
        });

        return dataArray;
    };

    mk.calc.dataArrayToObject = function(dataArray) {
        var dataObject = {};

        mk.calc.saveMappingKeys.forEach(function(key, index) {
            if (dataArray[index] === undefined) {
                dataObject[key] = 0;
            } else {
                dataObject[key] = dataArray[index];
            }
        });

        return dataObject;
    };

    var DataStorage = function(key) {
        this.key = key;

        this.load = function(isLoadSource) {
            var data = localStorage.getItem(this.key);
            data = (data && JSON.parse(data)) || [];
            if (isLoadSource) {
                return data;
            }
            data = data.map(function(dataArray) {
                return mk.calc.dataArrayToObject(dataArray);
            });
            return data;
        };

        this.save = function(dataObjects) {
            var dataArrays = dataObjects.map(function(dataObject) {
                return mk.calc.dataObjectToArray(dataObject);
            });
            localStorage.setItem(this.key, JSON.stringify(dataArrays));
        };
    };

    var BarracksContainer = function(maxCount, selectName, queueLengths) {
        this.barracks = [];
        this.maxCount = maxCount;
        this.queueLengths = queueLengths;

        var i;
        for (i = 1; i <= this.maxCount; i++) {
            var barrack = document.getElementById(selectName + '-' + i);
            this.barracks.push(barrack);
        }

        this.setDefaults = function() {
            this.barracks.forEach(function(el) {
                var saved = mk.calc.savedData.get(el.getAttribute('id'));
                if (saved !== undefined && saved !== null) {
                    el.options[saved].selected = true;
                }
            });
        };

        this.updateSavedData = function() {
            this.barracks.forEach(function(el) {
                mk.calc.savedData.set(el.getAttribute('id'), el.selectedIndex);
            });
        };

        this.getMaxLevel = function() {
            return Math.max.apply(null, this.barracks.map(function(el) {
                return parseInt(el.value, 10);
            }));
        };

        this.getAllNormalized = function() {
            return this.barracks.map(function(el) {
                return {
                    'level': parseInt(el.value, 10),
                    'queueLength': this.queueLengths[el.value]
                };
            }, this);
        };

        this.getQueue = function() {
            return this.barracks.map(function(el) {
                return {
                    'num': el.getAttribute('id').slice(-1),
                    'time': 0,
                    'space': 0,
                    'maxSpace': this.queueLengths[el.value],
                    'units': {},
                    'level': parseInt(el.value, 10)
                };
            }, this);
        };

        this.getElements = function() {
            return this.barracks;
        };

        this.getMaxCount = function() {
            return this.maxCount;
        };

        this.getCapLevel = function() {
            return this.barracks[0].options[this.barracks[0].options.length - 1].value;
        };

        this.getActiveCount = function() {
            return this.barracks.filter(function(b){
                return b.value > 0;
            }).length;
        };
    };

    mk.calc.savedDataStorage = new DataStorage('data3');
    mk.calc.savedDataAll = new mk.MultiDict(mk.calc.savedDataStorage.load());
    mk.calc.savedData = mk.calc.savedDataAll.retrieve(0);

    mk.calc.allBarracks = {
        'units': new BarracksContainer(
            4,
            'barracks-levels',
            [0, 20, 25, 30, 35, 40, 45, 50, 55, 60, 75]
        ),
        'dark': new BarracksContainer(
            2,
            'dark-barracks-levels',
            [0, 40, 50, 60, 70, 80]
        )
    };

    mk.calc.armyCamps = document.getElementById('army-camps');
    mk.calc.spellFactoryLevel = document.getElementById('spell-factory-level');

}(window.mk));
