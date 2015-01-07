angular.module('sandbox')
.controller('PostsController', [ '$scope', 'RailsData',
function ($scope, RailsData) {
  RailsData.$init();

  $scope.posts = RailsData.posts
  $scope.save = RailsData.posts.save;
  $scope.add = function () {
    RailsData.posts.push({});
  };

  $scope.$watch('posts', function() {
    $scope.changed = RailsData.$changed(RailsData.posts); // ????
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

  function withoutOrig(obj) {
    return _.omit(obj, '_orig');
  }

  var MD5 = new Hashes.MD5;

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
      railsObj['_orig'] = MD5.hex(JSON.stringify(railsObj));
      return railsObj;
    } else {
      // has a URL; generate a $resource object
      var resourceKlass = $resource(railsObj.url);
      var resourceObj = new resourceKlass(railsObj);
      resourceObj['_orig'] = MD5.hex(JSON.stringify(resourceObj));
      return resourceObj;
    }
  }

  var init = function() {
    angular.forEach(railsBindings, function(value, key) {
      railsData[key] = toResource(value);
    });
  };
  var changed = function(obj) {
    if (obj instanceof Array) {
      return obj.some(
        function(currentValue, index, array) {
          return changed(currentValue);
      });

    } else {
      return !(MD5.hex( JSON.stringify(withoutOrig(obj)) ) === obj._orig)
    }
  }

  railsData.$init = init;
  railsData.$changed = changed;

  return railsData;
}]);
