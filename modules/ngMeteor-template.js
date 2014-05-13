var ngMeteorTemplate = angular.module('ngMeteor.template', []);

ngMeteorTemplate.directive('ngTemplate', ['$compile',
	function($compile) {
		return {
			restrict: 'AE',
			scope: true,
			link: function(scope, element, attributes) {
				var	name = attributes.ngTemplate || attributes.name
				if(name && Template[name]){
					element.html(ngMeteor.renderTemplateInContext(name, scope));
					element.replaceWith($compile(element.html())(scope));
				} else{
					console.error("ngMeteor: There is no template with the name '" + attributes.ngTemplate + "'");
				}
	        }
		};
	}
]);

// Configure Angular to automatically re-compile the template when rendering with Iron-Router
angular.element(document).ready(function() {

    // Apply the default flexistrap configuration (to match the old behaviour of the module pre-flexistrap
    ngMeteor.addFlexistrap(document, 'ngMeteor', '*', false);

    if(Package['iron-router']){
        var oldRun = Router.run;
        Router.run = function() {
            var runResult = oldRun.apply(this, arguments);
            var templateKey = this._currentController.route.options.template ? this._currentController.route.options.template : this._currentController.route.name;
            var oldRendered = Template[templateKey].rendered;
            Template[templateKey].rendered = function(){

                // Apply flexistrap if one has been configured.
                var map = ngMeteor.getFlexistrap(templateKey);
                $.each( map, function( key, value ) {
                    var eleArray = $(key);
                    _.each(eleArray, function(element){
                        var moduleList = _.clone(value);
                        if (!element.bootstrapped && !angular.element(element).injector()){
                            angular.bootstrap(element, moduleList);
                            element.bootstrapped = true;
                        }else {
                            angular.element(element).injector().invoke(['$compile', '$document', '$rootScope', function ($compile, $document, $rootScope) {
                                element.replaceWith($compile(element)($rootScope));
                                $rootScope.$digest();
                            }]);
                        }
                    });
                });
                oldRendered.apply(this, arguments);
                Template[templateKey].rendered = oldRendered;
            };
            return runResult;
        };
    }
});
