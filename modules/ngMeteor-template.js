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
    ngMeteor.addFlexistrap('body', 'ngMeteor', '*', false);

    if(Package['iron-router']){
        Router.scopes = {};
        var oldRun = Router.run;
        Router.run = function() {
            var routePath = arguments[0].path;
            var runResult = oldRun.apply(this, arguments);
            var templateKey = this._currentController.route.options.template ? this._currentController.route.options.template : this._currentController.route.name;
            var oldRendered = Template[templateKey].rendered;
            Template[templateKey].rendered = function(){
                Deps.nonreactive(function(){
                    // Apply flexistrap if one has been configured.
                    var map = ngMeteor.getFlexistrap(templateKey);
                    if(!Router.scopes[routePath]){
                        Router.scopes[routePath] = [];
                    };
                    //                console.log("Router scopes");
                    //                console.log(Router.scopes);
                    //                console.log("--------------");
                    if(routePath != '/signup'){
                        var myScopes = Router.scopes['/signup'];
                        Router.scopes['/signup'] = [];
                        _.each(myScopes, function(theScope){
                            var killScope = function(aScope){
                                var currentChild = aScope.$$childHead;
                                if(currentChild){
                                    while(currentChild) {
                                        var nextChild = currentChild.$$nextSibling;
                                        killScope(currentChild);
                                        currentChild = nextChild;
                                      //  nextChild = null;
                                    }
                                    currentChild = null;
                                }

                                if(aScope.$$watchers) {
                                    aScope.$$watchers.length = 0;
                                }



//                                aScope.$$watchers = null;
                                aScope.model = null;
                                aScope.field = null;
                                aScope.modelId = null;
                                aScope.xid = null;
                                aScope.flexiModelname = null;
                                delete aScope.properties;
                                delete aScope.fieldPersonEmailsForm;
                                delete aScope.unwrapped;
                                delete aScope.model;
                                delete aScope.field;
                                delete aScope.modelId;
                                delete aScope.xid;
                                delete aScope.flexiModelname;
                                if(aScope.options){
                                    aScope.options.length = 0;
                                    delete aScope.options;
                                }
                                if(aScope.collection){
                                    aScope.collection.length = 0;
                                    delete aScope.collection;
                                }

                                delete aScope.personForm;
                                delete aScope.fieldPersonHomeAddressesForm;
                                aScope.$destroy();
                                aScope.$$listeners = {};
                                aScope.$$listenerCount = {};

                                aScope.__proto__ = {};

                                console.log('destroying: ' + aScope.$id)
                            };
                            killScope(theScope);
                        });
                        if(myScopes){
                            // Router.scopes['/signup'].length = 0;
                            myScopes.length = 0;
                            myScopes = null;
                        }

                    }
                    $.each( map, function( key, value ) {
                        var eleArray = $(key);
                        _.each(eleArray, function(element){
                            var moduleList = _.clone(value);
                            if (!element.bootstrapped && !angular.element(element).injector()){
                                console.log('bootstrapping')
                                var inj = angular.bootstrap(element, moduleList);
                                inj.invoke(['$rootScope', function($rootScope){Router.scopes[routePath].push($rootScope)}]);
                                element.bootstrapped = true;
                            }else {
                                console.log("did not bootstrap");
                                //   console.log(element);
                                //   console.log("-----------");
                                angular.element(element).injector().invoke(
                                    ['$compile', '$rootScope', function ($compile, $rootScope) {
                                        if($rootScope.$$childHead){
                                            $rootScope.$$childHead.$destroy();
                                        }
                                        $compile(element)($rootScope);
                                        $rootScope.$digest();
                                    }]
                                )

                            }
                        });
                    });
                    if(oldRendered && typeof oldRendered == 'function') {
                        oldRendered.apply(this, arguments);
                    };
                    Template[templateKey].rendered = oldRendered;
                });
            };
            return runResult;
        };
    }
});
