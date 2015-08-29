function preloader($q, $rootScope) {

    function Preloader(imageLocations) {
        this.imageLocations = imageLocations;
        this.imageCount = this.imageLocations.length;
        this.loadCount = 0;
        this.errorCount = 0;
        this.states = {
            PENDING: 1,
            LOADING: 2,
            RESOLVED: 3
        };
        this.state = this.states.PENDING;
        this.deferred = $q.defer();
        this.promise = this.deferred.promise;
    }

    Preloader.preloadImages = function (imageLocations) {

        var preloader = new Preloader(imageLocations);

        return ( preloader.load() );

    };

    Preloader.prototype = {

        constructor: Preloader,
        isInitiated: function isInitiated() {

            return ( this.state !== this.states.PENDING );

        },
        isResolved: function isResolved() {

            return ( this.state === this.states.RESOLVED );

        },
        load: function load() {

            if (this.isInitiated()) {
                return ( this.promise );
            }

            this.state = this.states.LOADING;

            for (var i = 0; i < this.imageCount; i++) {
                this.loadImageLocation(this.imageLocations[i].icon);
            }

            return ( this.promise );
        },
        tryResolve: function () {
            if (this.loadCount + this.errorCount === this.imageCount) {

                this.state = this.states.RESOLVED;
                this.deferred.resolve(this.imageLocations);
            }
        },
        handleImageError: function handleImageError(imageLocation) {
            this.errorCount++;
            this.tryResolve();
        },
        handleImageLoad: function handleImageLoad(imageLocation) {
            this.loadCount++;
            this.deferred.notify({
                percent: Math.ceil(this.loadCount / this.imageCount * 100),
                imageLocation: imageLocation
            });
            this.tryResolve();
        },
        loadImageLocation: function loadImageLocation(imageLocation) {

            var preloader = this;

            // When it comes to creating the image object, it is critical that
            // we bind the event handlers BEFORE we actually set the image
            // source. Failure to do so will prevent the events from proper
            // triggering in some browsers.
            var image = $(new Image())
                .load(function (event) {
                    // Since the load event is asynchronous, we have to
                    // tell AngularJS that something changed.
                    $rootScope.$apply(function () {
                            preloader.handleImageLoad(event.target.src);
                            // Clean up object reference to help with the
                            // garbage collection in the closure.
                            preloader = image = event = null;
                        }
                    );

                })
                .error(function (event) {
                    // Since the load event is asynchronous, we have to
                    // tell AngularJS that something changed.
                    $rootScope.$apply(
                        function () {
                            preloader.handleImageError(event.target.src);
                            preloader = image = event = null;
                        }
                    );

                })
                .prop("src", imageLocation);
        }

    };

    return ( Preloader );
}

preloader.$inject = ['$q', '$rootScope'];
angular
    .module('smitetierlist')
    .factory("preloader", preloader);