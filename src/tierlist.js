(function () {
    angular
        .module('smitetierlist', [])
        .controller('IndexController', IndexController);

    function IndexController($scope, $http) {
        $scope.gods = [];
        $http
            .get('gods.json')
            .then(function(response){
                $scope.gods = response.data;
            })
    }
})();