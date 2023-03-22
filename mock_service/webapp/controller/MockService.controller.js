sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("sapips.training.mockservice.controller.MockService", {
            onInit: function () {

            },

            onPress: function () {
                var oModel = this.getOwnerComponent().getModel("Northwind");
                
                var oData = {
                    "ProductID": 1234567890,
                    "ProductName": "myProduct",
                    "CategoryID": 53080890,
                    "QuantityPerUnit": "QuantityPerUnit1234567890",
                    "UnitPrice": 37751460354.7751,
                    "UnitsInStock": 6507,
                    "UnitsOnOrder": 19737,
                    "ReorderLevel": 9492,
                    "Discontinued": true,
                    "SupplierID": 903631048
                };

                oModel.create("/Products", oData, {
                    
                });
            }
        });
    });
