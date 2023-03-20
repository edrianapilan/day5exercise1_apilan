sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/ValueState",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, ValueState, MessageBox) {
        "use strict";

        return Controller.extend("day5exercisenavigationapilan.controller.Overview", {
            onInit: function () {
                
            },

            onInputChange: function (oEvent) {
                var oInput = oEvent.getSource(),
                    sText = oInput.getValue();

                if (sText.length === 0) {
                    oInput.setValueState(ValueState.Error);
                } else {
                    oInput.setValueState(ValueState.None);
                }
            },

            onPress: function () {
                var oView = this.getView(),
                    oResourceBundle = oView.getModel("i18n").getResourceBundle(),
                    oInput1 = oView.byId("idInput1"),
                    oInput2 = oView.byId("idInput2");

                this.fnCheckFields(oInput1, oInput2);

                if (oInput1.getValueState() === ValueState.Error || oInput2.getValueState() === ValueState.Error) {
                    MessageBox.error(oResourceBundle.getText("Error Message"));
                } else {
                    this.fnNavigateToDetailPage(oInput1.getValue(), oInput2.getValue());
                }
            },

            fnCheckFields: function(oInput1, oInput2) {
                var sData1 = oInput1.getValue(),
                sData2 = oInput2.getValue();

                if (!sData1 && sData2) {
                    oInput1.setValueState(ValueState.Error);
                    oInput2.setValueState(ValueState.None);
                } else if (sData1 && !sData2) {
                    oInput1.setValueState(ValueState.None);
                    oInput2.setValueState(ValueState.Error);
                } else if (!sData1 && !sData2) {
                    oInput1.setValueState(ValueState.Error);
                    oInput2.setValueState(ValueState.Error);
                }
            }, 

            fnNavigateToDetailPage: function (sData1, sData2) {
                var oRouter = this.getRouter();
                    oRouter.navTo("Detail", {
                        Param1: sData1,
                        Param2: sData2
                    });
            },

            getRouter: function () {
                return UIComponent.getRouterFor(this);
            }
        });
    });
