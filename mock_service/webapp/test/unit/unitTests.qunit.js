/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sapipstraining/mock_service/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
