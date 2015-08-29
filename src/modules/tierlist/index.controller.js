(function () {
    'use strict';

    function IndexController($scope, $http) {
        $scope.gods = [];
        $scope.availableGods = [];
        $scope.tiers = {
            'ss': {name: 'SS', color: 'red', gods: []},
            'splus': {name: 'S+', color: 'blue', gods: []},
            's': {name: 'S', color: 'blue', gods: []},
            'sminus': {name: 'S-', color: 'blue', gods: []},
            'aplus': {name: 'A+', color: 'green', gods: []},
            'a': {name: 'A', color: 'green', gods: []},
            'aminus': {name: 'A-', color: 'green', gods: []},
            'b': {name: 'B', color: 'grey', gods: []},
            'c': {name: 'C', color: 'grey', gods: []},
            'd': {name: 'D', color: 'grey', gods: []}
        };
        $scope.drop = drop;
        $scope.resetGod = resetGod;


        function drop(god, event, tier) {
            removeFromAnyTier(god);
            removeFromAvailableGods(god);
            addToTier(tier, god);
        }

        function resetGod(god, event) {
            if (removeFromAnyTier(god) === true) {
                $scope.availableGods.push(god);
            }
        }


        function addToTier(tier, god) {
            if ($scope.tiers.hasOwnProperty(tier) && $scope.tiers[tier].gods.indexOf(god) === -1) {
                $scope.tiers[tier].gods.push(god);
            }
        }

        function removeFromAvailableGods(god) {
            var index = $scope.availableGods.indexOf(god);
            if (index !== -1) {
                $scope.availableGods.splice(index, 1);
            }
        }

        function removeFromAnyTier(god) {
            for (var key in $scope.tiers) if ($scope.tiers.hasOwnProperty(key)) {
                var index = $scope.tiers[key].gods.indexOf(god);
                if (index !== -1) {
                    $scope.tiers[key].gods.splice(index, 1);
                    return true;
                }
            }
            return false;
        }

        $http
            .get('gods.json')
            .then(function (response) {
                var gods = response.data;
                gods.forEach(function (god) {
                    god.icon = 'lib/assets/icons/' + god.id + '.jpg';
                });
                $scope.gods = angular.copy(gods);
                $scope.availableGods = angular.copy(gods);
            });
    }

    IndexController.$inject = ['$scope', '$http'];

    angular
        .module('smitetierlist')
        .controller('IndexController', IndexController);
})();