sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast) {
        "use strict";

        return Controller.extend("day5exercise1apilan.controller.MainView", {
            onInit: function () {

            },

            onSend: function () {
                var oView = this.getView();
                var sName = oView.byId("NameInput").getValue();
                var sSurname = oView.byId("SurnameInput").getValue();
                var sAge = oView.byId("AgeInput").getValue();
                var sTech = oView.byId("TechInput").getSelectedKey();
                
                MessageToast.show(
                    "Your name is " + sName + 
                    ", your surname is " + sSurname + 
                    ", your age is " + sAge + 
                    ", your tech is " + sTech
                );
            }
        });
    });
