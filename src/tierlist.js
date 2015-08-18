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
        
        $http
            .get('gods.json')
            .then(function (response) {
                $scope.gods = angular.copy(response.data);
                $scope.availableGods = angular.copy(response.data);
            })
    }
})();