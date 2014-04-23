var ngMeteorTemplate = angular.module('ngMeteor.template', []);

ngMeteorTemplate.run(['$templateCache',
	function($templateCache) {
		angular.forEach(Template, function(render, name){
			if(name.charAt(0) != "_" && name !== 'Layout'){
               	$templateCache.put(name, ngMeteor.renderTemplateInContext(name, this));
			}
		});
	}
]);

ngMeteorTemplate.directive('ngTemplate', ['$templateCache', '$compile',
	function($templateCache, $compile) {
		return {
			restrict: 'AE',
			scope: true,
			link: function(scope, element, attributes) {
				var	name = attributes.ngTemplate || attributes.name,
					template = $templateCache.get(name);
				if(angular.isDefined(template)){
					element.html(ngMeteor.renderTemplateInContext(name, scope));
					element.replaceWith($compile(element.html())(scope));
				} else{
					console.error("ngMeteor: There is no template with the name '" + attributes.ngTemplate + "'");
				}
	        }
		};
	}
]);

// Re-compiles template when rendering with Iron-Router
angular.element(document).ready(function() {

    ngMeteor.addFlexistrap('document', 'ngMeteor', '*', false);

    if(Package['iron-router']){
        var oldRun = Router.run;
        Router.run = function() {
            var runResult = oldRun.apply(this, arguments);
            var templateKey = this._currentController.route.options.template ? this._currentController.route.options.template : this._currentController.route.name;
            var oldRendered = Template[templateKey].rendered;
            Template[templateKey].rendered = function(){
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
            }
            return runResult;
        };
    }
});
