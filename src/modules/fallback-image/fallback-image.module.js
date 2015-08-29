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
            var missingDefault = 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAICAgICAQICAgIDAgIDAwYEAwMDAwcFBQQGCAcJCAgHCAgJCg0LCQoMCggICw8LDA0ODg8OCQsQERAOEQ0ODg7/wAALCAAyADIBASIA/8QAGgAAAwEBAQEAAAAAAAAAAAAABwgJBgUECv/EADQQAAEDAwMCBAQFAwUAAAAAAAECAwQFBhEAByESMQgTIkEVUWFxFHOBobEJMjM1QpGi4f/aAAgBAQAAPwD0eLPfak1TxmbgxZUgOKoco0+M0VYS0pkJSpR/XJ1Ki+d76xPvJDtJfQ2+SS08tHV0AnggHjJwO+uIKfe1eqdKqSXTUpLj4T5vm9fWsnt9Tye2nP288LdVq0Zi5a28aagpAbYcQArjkjn768O53hbS1BqNQtmoLjSS2oSGzgh0Z5T9jxpHtsUy7X8Zds0+VAIfFYbhvsq+S1hOR+x19JMBfRQoSQOAwgf9RqH/AI9S5b39TPeSnwJXmRqjXlzEuNnhSHsODGPbk6EG0G0ju4t0JQwsuTCtDcWOE5BAHK1n2Hb99Vx208Nkij2FEh1WmUtp5hSZEWS010usupUF9Cz/ALk5HcY79tHSuNx6TbEOA4801IyfMSFggKPJI+mg/d9PcNtOOuS0IQ8OEdQBP6anTfFtMUjx17S1qntBlydWWoshRHC8LBz98E6tZDUkUiKMnhlP8DUtvGjs4zel3uXxbbFUTc1PpURVZQ6ylcSUz0HpW0pPqDgxghXBxwc92Z8Fe1VKtrwhRbsiwTUbmqvmOqCW8rATkJSM9u2snvPvZv5CRMoFMtKTQ4yVENvjoYKu4yVuHnj2A0I9i6Ru1du5zXxyrSp0RyX5Mp6VK87BPuCRxoS771be+k+IS4LYjPfhoVNlllLiH0guJ4IWMg+x10tqqBc1x3jalavpt2UaXV234Pm4yhYbUkKynuOQf01XKI4fhcb8pP8AGt5e+yNGuQ01tTKX4ERaVSmVA9D3khRbCwCCU5VzjtgHB1maTHp1kVl+mW7S2qTRozilNRY59DeTkgA+2SddG4bw29rlAMe6ILZcb/vWGk8ce51g7dr+3btb6qQ/SbYgsqAiMzpiGHpWCFKW2k/3f8nS775SrFX4oahUm3IlRizG0lxPmAq6xwFJ+n/mhZS61T5O78CmUpCG4aMLc6RxkEAafKKUfDY/5Sfb6aYiZS3rm2nnRFz36ZMeSSzMjL6XI7nsofPB7g8EcaTqTdBo12VW36vNVNnRldBkPHCnyOCo/U9/11watT6BWYBlF5TrjaepyK2v1vfJIHvzoM7lVdibbSGq7thUW2oiCIwdpqFrSMYCk4Vke3bSi0BmXK3WfUmm1RbC1dC36ijobjozyPUrOPpjOjZZ8GKL7qFVp4LlPivtREvgcOOqVk4+wH7jVBYiXPhUb0H/ABJ9voNNK2H4dHkodbLAS6Rj2znU8N76ApzcGsVSK95EpDyikj3GdL7btwLj3xEfqk51h6MsEp6vSojRbvCfDva2HJEi64zUVKP8KnulwfbnSt1iJBgqj2+xccZcypzW4qVrV6WUqUB1rV8hkZ061bsO17H28se27flNz4LElpx6chQV+LdUQVukjjk9vkAB7aZSO3FFPYAAx5af41n/AB8zZkC1bMTBlvQkqnr6gw6UA8A+x0KtwQFU0qV6lFlGSec+gaR27PS64U+k88jj30Bp8qUmY+lMl1Kes8Bw41iUPOuV0LcdWteT6lKJOqLbevvPbE275ry3cTWMdaicc6eSP/p7H5af41//2Q==';
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    // Listen for errors on the element and if there are any replace the source with the fallback source
                    var errorHandler = function () {
                        element.off('error', errorHandler);
                        var newSrc = attr.fallbackSrc || missingDefault;
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