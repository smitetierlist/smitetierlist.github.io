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
            template: '<img ng-if="god" class="avatar" id="{{god.name}}" ng-src="{{god.icon}}" ng-drag="true" ng-drag-data="god">'
        };
    }
})();