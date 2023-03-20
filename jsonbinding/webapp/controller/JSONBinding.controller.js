sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, formatter) {
        "use strict";

        return Controller.extend("sapips.training.jsonbinding.controller.JSONBinding", {
            formatter: formatter,

            onInit: function () {
                this.getI18nModel();
                this.getAddressModel();
            }, 

            onSelectProduct: function (oEvent) {
                // Get the Control (List)
                var oList = oEvent.getSource();

                // Get the selected item
                var oSelItem = oList.getSelectedItem();

                // Get the context binding path
                var sSelItemPath = oSelItem.getBindingContextPath();

                // Bind the selected item to the control (SimpleForm in Panel4)
                // Get the control to be used
                var oForm = this.getView().byId("idProductDetails");
                    oForm.bindElement({
                        path: sSelItemPath,
                        model: "ProductsModel"
                    });
            },

            getI18nModel: function () {
                var oView = this.getView();
                
                var oI18n = this.getOwnerComponent().getModel("i18n");

                return oView.setModel(oI18n, "i18n");
            },

            getAddressModel: function () {
                var oView = this.getView();

                // instantiate JSONModel
                var oAddressModel = new JSONModel();

                // Define Data
                var oAddress = {
                    "EID": "edrian.apilan",
                    "Enabled": true,
                    "Address": {
                        "Street": "Fake Street",
                        "City": "City",
                        "Zip": 1234,
                        "Country": "Philippines"
                    },
                    "SalesAmount": 100,
                    "CurrencyCode": "USD"
                };

                // Set the Data to Model
                oAddressModel.setData(oAddress);

                // Bind the Model to view
                oView.setModel(oAddressModel);
            }
        });
    });
