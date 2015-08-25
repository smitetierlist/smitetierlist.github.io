(function () {
    'use strict';
    /**
     * Angular Image Fallback
     * (c) 2014 Daniel Cohen. http://dcb.co.il
     * License: MIT
     * https://github.com/dcohenb/angular-img-fallback
     * [MODIFIED]
     */
    angular.module('imageFallback', [])
        .directive('fallbackSrc', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    // Listen for errors on the element and if there are any replace the source with the fallback source
                    var errorHandler = function () {
                        element.off('error', errorHandler);
                        var newSrc = attr.fallbackSrc;
                        if (element[0].src !== newSrc) {
                            element[0].src = newSrc;
                        }
                    };
                    element.on('error', errorHandler);
                }
            };
        })
        .directive('loadingSrc', function () {
            // Load the image source in the background and replace the element source once it's ready
            var linkFunction = function (scope, element, attr) {
                element[0].src = attr.loadingSrc;
                var img = new Image();
                img.src = scope.imgSrc;
                img.onload = function () {
                    img.onload = null;
                    if (element[0].src !== img.src) {
                        element[0].src = img.src;
                    }
                };
            };

            return {
                restrict: 'A',
                compile: function (el, attr) {
                    // Take over the ng-src attribute to stop it from loading the image
                    attr.imgSrc = attr.ngSrc;
                    delete attr.ngSrc;

                    return linkFunction;
                }
            };
        });
})();
(function () {
    'use strict';

    angular
        .module('smitetierlist', ['ngDraggable', 'imageFallback']);
})();
(function () {
    'use strict';

    angular
        .module('smitetierlist')
        .directive('avatar', avatarDirective);

    function avatarDirective() {
        return {
            restrict: 'E',
            scope: {
                god: '=god'
            },
            template: '<img ng-if="god" class="avatar" id="{{god.name}}" ng-src="{{god.icon}}" ' +
                'fallback-src="/lib/assets/icons/kappa.jpg" ng-drag="true" ng-drag-data="god">'
        };
    }
})();
(function () {
    'use strict';

    angular
        .module('smitetierlist')
        .controller('IndexController', IndexController);

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
})();