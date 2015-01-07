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

  // adds a hash for change detection, and generates an
  // AngularJS $resource instance if the obj has a 'url' property
  // when called with an array, simply return an array with
  // toResource called on each array member
  function toResource(railsObj) {

    if (railsObj instanceof Array) {
      // recursion!
      return railsObj.map(
        function(currentValue, index, array) {
          return toResource(currentValue);
      });
    }

    if (typeof(railsObj.url) == 'undefined') {
      // no URL; just generate and attach the hash
      railsObj['_orig'] = MD5.hex(JSON.stringify(railsObj));
      return railsObj;
    } else {
      // has a URL; generate a $resource object then attach the hash
      var resourceKlass = $resource(railsObj.url);
      var resourceObj = new resourceKlass(railsObj);
      resourceObj['_orig'] = MD5.hex(JSON.stringify(resourceObj));
      return resourceObj;
    }
  }

  // picks up railsBindings and brings them into this Angular service
  var init = function() {
    angular.forEach(railsBindings, function(value, key) {
      railsData[key] = toResource(value);
    });
  };

  // detects changes by comparing MD5 hashes
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
