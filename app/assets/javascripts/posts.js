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

  // generate a $resource if the obj has a url
  function toResource(railsObj) {

    if (railsObj instanceof Array) {
      // recursion
      return railsObj.map(
        function(currentValue, index, array) {
          return toResource(currentValue);
      });
    }

    if (typeof(railsObj.url) == 'undefined') {
      return railsObj;
    } else {
      // has a URL; generate a $resource object
      var resourceObj = $resource(railsObj.url);
      return new resourceObj(railsObj);
    }
  }

  var MD5 = new Hashes.MD5;

  var init = function() {
    angular.forEach(railsBindings, function(value, key) {
      railsData[key] = {
        data: toResource(value.data),

        // stores the MD5 hash of the obj to detect changes later
        original: MD5.hex( JSON.stringify( toResource(value.data) ) ),

        // compares current obj with the MD5 hash
        changed: function() {
          return !( MD5.hex(JSON.stringify(railsData[key].data)) === railsData[key].original );
        }

        // we could generate other functions based on options pushed
        // to the data array
      };

    });
  };

  railsData.$init = init;

  return railsData;
}]);
