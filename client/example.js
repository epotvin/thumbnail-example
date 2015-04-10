angular.module('example', ['angular-meteor', 'ui.router']);

angular.module("example").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
    function ($urlRouterProvider, $stateProvider, $locationProvider) {

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $stateProvider
            .state('app', {
                url: '/',
                templateUrl: 'client/example.ng.html',
                controller: 'ExampleCtrl'
            })
            .state('app.image', {
                url: ':imageId',
                templateUrl: 'client/image.ng.html',
                controller: 'ImageCtrl'
            });
    }]);

angular.module('example').controller('ExampleCtrl', ['$meteor', '$scope', function ($meteor, $scope) {

    $scope.images = $meteor.collection(Images, false);

    $scope.addImage = function () {
        $('<input type="file">').bind("change", function (event) {
            Images.insert(event.target.files[0]);
        }).click();
    };

    $scope.url = function (image, store) {
        if (!image || !image.url) return null;

        return image.copies && image.copies[store] ? image.url({store: store}) + '&updatedAt=' + image.copies[store].updatedAt.getTime() : '';
    }

}]);

angular.module('example').controller('ImageCtrl', ['$scope', '$meteor', '$stateParams', function ($scope, $meteor, $stateParams) {
    $scope.image = $meteor.object(Images, $stateParams.imageId, false);

    $scope.update = function() {
        $meteor.call('setThumbnail', $scope.image._id, $scope.coordinates);
    }

}]);

angular.module('example').directive('cropper', function () {
    return {
        restrict: 'A',
        scope: {
            coordinates: '='
        },
        link: function (scope, element) {
            element.click(function () {
                element.cropper({
                    aspectRatio: 1,
                    crop: function (data) {
                        scope.$apply(function() {
                            scope.coordinates = data;
                        });
                    }
                });
            });
        }
    }
});