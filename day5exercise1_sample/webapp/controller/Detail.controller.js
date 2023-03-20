sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast) {
        "use strict";

        return Controller.extend("zbtp.day5exercise1eds.controller.Detail", {
            onInit: function () {
                this.getRouter().getRoute('Detail').attachPatternMatched(this.onObjectMatched, this);
            },

            onObjectMatched: function (oEvent) {
                var sName = oEvent.getParameter("arguments").sNamePt;
                this.getView().byId("idNameText").setText(sName);
            },

            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            }
        });
    });
