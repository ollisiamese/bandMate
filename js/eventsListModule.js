(function(){
    
    //	Create a module
	var evListModule = angular.module('eventsListModule', []);
    
    //	Add the main element (events-list) directive to this module
	evListModule.directive('eventsList', function() {
      
      return {
        
        restrict: 'E',
        scope: {},
        templateUrl: 'templates/eventsList.html',
        controller: function($scope) {
           
        }
      };
        
      });
  
    
  })();