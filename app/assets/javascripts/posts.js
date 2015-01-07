angular.module('sandbox')
.controller('PostsController', [ '$scope', 'RailsData',
function ($scope, RailsData) {
  RailsData.$init();

  $scope.posts = RailsData.posts.data
  $scope.save = RailsData.posts.save;
  $scope.add = function () {
    RailsData.posts.data.push({});
  };

  $scope.$watch('posts', function() {
    $scope.changed = RailsData.posts.changed();
    // we could even make this auto-save the obj, probably with a
    // timed delay

    // we could also provide a factory function within the RailsData
    // service to auto-generate this
  }, true);

  console.log('RailsData service:');
  console.log(RailsData);

}]);

angular.module('sandbox')
.factory('RailsData', [ '$resource', function ($resource) {
  var railsData = {};

  var init = function() {
    angular.forEach(railsBindings, function(value, key) {
      railsData[key] = {
        data: angular.copy(value.data),
        original: value.data,
        changed: function() {
          return !angular.equals(railsData[key].data, railsData[key].original);
        },
        save: function() {
          console.log('This would save to ' + value.url);
          // we would want to actually call either $http on the
          // provided URL, or maybe setup $resource

          // we would also want to check for the presence of url data
          // before generating this function
        }

        // we could generate other functions based on options pushed
        // to the data array
      };

    });
  };

  railsData.$init = init;

  return railsData;
}]);
