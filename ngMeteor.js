


// Define ngMeteor and its dependencies
ngMeteor = angular.module('ngMeteor', [
	'ngMeteor.collections', 
	'ngMeteor.template',
    //'jm.i18next',
	'hashKeyCopier',
	'ngRoute', 
	'ngTouch',
	'ngAnimate',
	'ngCookies',
	'ngResource',
	'ngSanitize'
]);

ngMeteor.flexistrapRegister = {};

/**
 * If replaceFlag is true, replace the flexistrap configuration.
 * If false, only insert if the configuration doesn't already exist, otherwise ignore.
 * If null, add to existing or create new.
 * @param selector
 * @param angularModuleNameOrArray
 * @param pathOrArray
 * @param replaceFlag
 */
ngMeteor.addFlexistrap = function(selector, angularModuleNameOrArray, pathOrArray, replaceFlag){
    var moduleNames = _.isArray(angularModuleNameOrArray) ? angularModuleNameOrArray : [angularModuleNameOrArray];
    var paths = pathOrArray ? (_.isArray(pathOrArray) ? pathOrArray : [pathOrArray]) : ['*'];

    _.each(paths, function(ele, index, list){
        var pathEntry = this[ele] ? this[ele] : null;
        if(typeof replaceFlag === 'undefined' || replaceFlag === null){
            if(typeof pathEntry === 'undefined' || pathEntry === null){
                pathEntry = {};
            }
        }else{
            if(replaceFlag){
                pathEntry = {};
            }else{
                return;
            }
        }
        var moduleArray = pathEntry[selector] ? pathEntry[selector] : [];
        moduleArray = _.union(moduleArray, moduleNames);
        pathEntry[selector] = moduleArray;
        this[ele] = pathEntry;
    }, ngMeteor.flexistrapRegister);

};

ngMeteor.getFlexistrap = function(path){
    var flexistrap = path ? ngMeteor.flexistrapRegister[path] : null;
    flexistrap = flexistrap ? flexistrap : {};
    var all = ngMeteor.flexistrapRegister['*'] ? ngMeteor.flexistrapRegister['*'] : {};
    return _.extend(flexistrap, all);
};

// Change the data-bindings from {{foo}} to [[foo]]
ngMeteor.config(['$interpolateProvider',
	function ($interpolateProvider) {
		$interpolateProvider.startSymbol('[[');
		$interpolateProvider.endSymbol(']]');
	}
]);

// Manual initialisation of ngMeteor
//angular.element(document).ready(function() {
//    if(angular.ngMeteorAutoInitialize) {
//        if (!angular.element(document).injector()) {
//            angular.bootstrap(document, ['ngMeteor']);
//        }
//    }
//});

// Render the named template as HTML using the 'context' param as the source for variable substitution.
ngMeteor.renderTemplateInContext = function(templateOrName, context) {
    var template = (typeof templateOrName === 'string') ? Template[templateOrName] : templateOrName;
    var div = document.createElement('div');
    var component = UI.renderWithData(template, context);
    UI.insert(component, div);
    return div.innerHTML;
};
