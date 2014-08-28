Package.describe({
	summary: "The simplest no-conflict way to use AngularJS with Meteor, Meteorite and Atmosphere Smart Packages."
});

Package.on_use(function (api) {
    api.use('underscore', 'client');
	// Files to load in Client only.
	api.add_files([
		// Lib Files
		'lib/angular.js',
		'lib/angular-csp.css',
		'lib/angular-animate.js',
		'lib/angular-cookies.js',
		//'lib/angular-mocks.js',
		'lib/angular-resource.js',
		'lib/angular-route.js',
		//'lib/angular-scenario.js',
		'lib/angular-sanitize.js',
		'lib/angular-touch.js',
		'lib/angular-hash-key-copier.js',

        //i18next main file
        'lib/i18next.js',

		// Module Files
		'modules/ngMeteor-collections.js',
		'modules/ngMeteor-template.js',

        // ng-i18n module files
        //'lib/ng-i18next/ng-i18next.js',

        //'modules/ngMeteor-i18next.js',

		// Finally load ngMeteor File
		'ng-meteor.js'
	], 'client');

    // Exports the ngMeteor package scope
    api.export('ngMeteor', 'client');
    api.export('_', 'client');

});
