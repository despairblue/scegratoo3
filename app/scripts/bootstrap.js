'use strict';

var bootstrap = function() {
	angular.element(document).ready(function() {
	  angular.bootstrap(document, ['scegratooApp']);
	})
}

if (window.__karma__) {
	bootstrap()
} else {
	traceur.options.experimental = true
	new traceur.WebPageTranscoder(document.location.href).run(function() {
		bootstrap()
	});
}
