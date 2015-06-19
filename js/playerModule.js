(function(){
    
    //	Create a module
	var playerModule = angular.module('playerModule', []);
    
    //	Add the main element (player-box) directive to this module
	playerModule.directive('playerBox', function() {
      
      return {
        
        restrict: 'E',
        scope: {},
        templateUrl: 'templates/player.html',
        controller: function($scope) {
           $scope.name = 'one';
        }
      };
        
      });
  
    
  })();