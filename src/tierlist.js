(function () {
    angular
        .module('smitetierlist', ['ngDraggable'])
        .controller('IndexController', IndexController);

    function IndexController($scope, $http) {
        $scope.gods = [];
        $scope.availableGods = [];
        $scope.tiers = {
            'ss': {color: 'red', gods: []},
            'splus': {color: 'blue', gods: []},
            's': {color: 'blue', gods: []},
            'sminus': {color: 'blue', gods: []},
            'aplus': {color: 'green', gods: []},
            'a': {color: 'green', gods: []},
            'aminus': {color: 'green', gods: []},
            'b': {color: 'grey', gods: []},
            'c': {color: 'grey', gods: []},
            'd': {color: 'grey', gods: []}
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
                $scope.gods = angular.copy(response.data);
                $scope.availableGods = angular.copy(response.data);
            })
    }
})();