(function(){
    
    //	Create a module
	var vidListModule = angular.module('videosListModule', []);
    
    //	Add the main element (videos-list) directive to this module
	vidListModule.directive('videosList', function() {
      
      return {
        
        restrict: 'E',
        scope: {},
        templateUrl: 'templates/videosList.html',
        controller: function($scope) {
           
        }
      };
        
      });
  
    
  })();