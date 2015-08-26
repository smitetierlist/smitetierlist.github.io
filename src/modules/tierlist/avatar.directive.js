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
            templateUrl: 'lib/template/avatar.html'
        };
    }
})();