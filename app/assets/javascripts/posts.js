angular.module('sandbox')
.controller('PostsController', [ '$scope', 'RailsData',
function ($scope, RailsData) {
  RailsData.$init();

  $scope.posts = RailsData.posts
  $scope.add = function () {
    RailsData.posts.push({});
  };

  $scope.$watch('posts', function() {
    $scope.changed = RailsData.$changed(RailsData.posts);
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
  var MD5 = new Hashes.MD5;

  function withoutAttached(obj) { return _.omit(obj, '_orig', '_changed', '_update'); }

  // adds a hash for change detection
  var attachChangeDetection = function (obj) {
    obj['_orig'] = MD5.hex(JSON.stringify(obj));
    obj['_changed'] = function (){ return changed(obj) };
    obj['_update'] = function () {
      obj.$update(function(val,hdrs) {
        attachChangeDetection(obj);
      });
    };
    // just an alias for now
    obj['_delete'] = function () { obj.$delete(); };
  }

  // detects changes by comparing MD5 hashes
  var changed = function(obj) {
    if (obj instanceof Array) {
      return obj.some(
        function(currentValue, index, array) {
          return changed(currentValue);
      });

    } else {
      return !(MD5.hex( JSON.stringify(withoutAttached(obj)) ) === obj._orig)
    }
  }

  // generates an AngularJS $resource instance if the obj has a 'url' property
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

    var resourcedObj;
    if (typeof(railsObj.url) == 'undefined') {
      // no URL; nothing to do
      resourcedObj = railsObj
    } else {
      // has a URL; generate a $resource object then attach the hash
      var resourceKlass = $resource(railsObj.url, null, {
        'update': { method: 'PUT' }
      });
      resourcedObj = new resourceKlass(railsObj);
    }

    attachChangeDetection(resourcedObj);

    return resourcedObj;
  }

  // picks up railsBindings and brings them into this Angular service
  function init() {
    angular.forEach(railsBindings, function(value, key) {
      railsData[key] = toResource(value);
    });
  };

  railsData.$init = init;
  railsData.$changed = changed;

  return railsData;
}]);
