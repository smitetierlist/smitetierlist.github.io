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