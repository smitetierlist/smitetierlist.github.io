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
            $scope.availableGods.splice($scope.availableGods.indexOf(god), 1);
            $scope.tiers[tier].gods.push(god);
        }

        function resetGod(god, event) {
            for (var key in $scope.tiers) if ($scope.tiers.hasOwnProperty(key)) {
                var index = $scope.tiers[key].gods.indexOf(god);
                if (index !== -1) {
                    $scope.tiers[key].gods.splice(index, 1);
                    $scope.availableGods.push(god);
                    break;
                }
            }
        }

        $http
            .get('gods.json')
            .then(function (response) {
                $scope.gods = angular.copy(response.data);
                $scope.availableGods = angular.copy(response.data);
            })
    }
})();