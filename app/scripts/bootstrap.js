'use strict';

traceur.options.experimental = true

new traceur.WebPageTranscoder(document.location.href).run(function() {
	angular.element(document).ready(function() {
	  angular.bootstrap(document, ['scegratooApp']);
	})

	console.debug('bootstrap')
});

