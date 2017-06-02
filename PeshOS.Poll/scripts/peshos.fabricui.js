"use strict";

var PeshOS = PeshOS || {};
PeshOS.FabricUI = PeshOS.FabricUI || {};

PeshOS.FabricUI = (function () {
    function setEvents() {
        $('.ms-Callout-close').click(function (event) {
            event.preventDefault();
            $(this).closest('.ms-Callout').hide();
        });
    };

    return {
        setEvents: setEvents
    }
}());