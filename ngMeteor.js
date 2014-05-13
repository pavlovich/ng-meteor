/**
 * Define the ngMeteor angular module and its dependencies
  */
ngMeteor = angular.module('ngMeteor', [
	'ngMeteor.collections', 
	'ngMeteor.template',
	'hashKeyCopier',
	'ngRoute', 
	'ngTouch',
	'ngAnimate',
	'ngCookies',
	'ngResource',
	'ngSanitize'
]);

/**
 * Define the 'holder' for flexistrap (flexible bootstrap) configurations.
 * The intent is to have this keyed by the 'path' (in case you have multiple routes) with values being another hash object
 * with keys being jQuery-like selectors and values being arrays of module names to be bootstrapped into elements matching
 * those selectors.
 */
ngMeteor.flexistrapRegister = {};

/**
 * Remove a flexistrap configuration.
 * @param selector: JQuery-style selector to select the DOM element(s) to which the flexistrap operation will apply. If not supplied, it defaults to removing all configurations for the specified path(s).
 * @param angularModuleNameOrArray: The name (or array of names) of the module(s) to be added to the flexistrop configuration for the selected element(s). If not provided, it will
 * @param pathOrArray: The path string (or array of path strings) for which, when rendered, we wish to have a flexible bootstrap configuration (flexistrap) applied.
 *                      If not provided, it applies to all paths specifications including '*'.
 *                      If you only want it to affect the '*' flexistrap configuration, ensure you provide '*' as the value for this parameter.
 * @returns: ngMeteor to allow easy method chaining.
 */
ngMeteor.removeFlexistrap = function(selector, angularModuleNameOrArray, pathOrArray){
    return ngMeteor.addFlexistrap(selector, null, pathOrArray, true);
};

/**
 * Add or update a flexistrap configuration.
 * If replaceFlag is true, replace any existing flexistrap configuration for the provided <selector>.
 * If false, only insert if the configuration doesn't already exist, otherwise ignore.
 * If null, add to existing or create new.
 * @param selector: JQuery-style selector to select the DOM element(s) to which the flexistrap operation will apply. If null, it defaults to an empty array.
 * @param angularModuleNameOrArray: The name (or array of names) of the module(s) to be added to the flexistrop configuration for the selected element(s).
 *                                      If null, it defaults to an empty array.
 * @param pathOrArray: (optional) The url (or fragment) which, when rendered, we wish to have this flexible bootstrap configuration applied.
 *                      Note that a value of '*' will add the provided configuration to all path configurations (as a merge function at run time).
 *                      If null, it will default to '*'.
 * @param replaceFlag: (optional) If true, replace existing flexistrap configuration. If false, only add it if one has
 *                          not yet been registered for this selector and path. If null or not supplied, add the provided module name or names
 *                          to the existing flexistrap configuration or create a new one to bootstrap with the provided module name(s).
 * @returns: ngMeteor to allow easy method chaining.
 */
ngMeteor.addFlexistrap = function(selector, angularModuleNameOrArray, pathOrArray, replaceFlag){
    var moduleNames = angularModuleNameOrArray ? (_.isArray(angularModuleNameOrArray) ? angularModuleNameOrArray : [angularModuleNameOrArray]) : [];
    var paths = pathOrArray ? (_.isArray(pathOrArray) ? pathOrArray : [pathOrArray]) : ['*'];

    _.each(paths, function(ele){
        var pathEntry = this[ele] ? this[ele] : null;
        if(typeof replaceFlag === 'undefined' || replaceFlag === null){
            if(typeof pathEntry === 'undefined' || pathEntry === null){
                pathEntry = {};
            }
        }else{
            pathEntry = {};
            if(!replaceFlag){
                return;
            }
        }
        var moduleArray = selector ? (pathEntry[selector] ? pathEntry[selector] : []) : [];
        moduleArray = _.union(moduleArray, moduleNames);
        pathEntry[selector] = moduleArray;
        this[ele] = pathEntry;
        return ngMeteor;
    }, ngMeteor.flexistrapRegister);
};

/**
 * Retrieve the flexible bootstrap configuration map for the provided path.
 * @param path: The routing path being rendered.
 * @returns A map object with keys being jQuery-like selector strings and values being arrays of module names which
 *              will be bootstrapped by angular into the elements obtained from the provided selector.
 */
ngMeteor.getFlexistrap = function(path){
    var flexistrap = path ? ngMeteor.flexistrapRegister[path] : null;
    flexistrap = flexistrap ? flexistrap : {};
    var all = ngMeteor.flexistrapRegister['*'] ? ngMeteor.flexistrapRegister['*'] : {};
    return _.extend(flexistrap, all);
};

/** Utility method for use with the Blaze rendering engine.
  * Render the named template as HTML using the 'context' param as the source for variable substitution.
 */
ngMeteor.renderTemplateInContext = function(templateOrName, context) {
    var template = (typeof templateOrName === 'string') ? Template[templateOrName] : templateOrName;
    var div = document.createElement('div');
    var component = UI.renderWithData(template, context);
    UI.insert(component, div);
    return div.innerHTML;
};

// Change the data-bindings from {{foo}} to [[foo]]
ngMeteor.config(['$interpolateProvider',
    function ($interpolateProvider) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
    }
]);
