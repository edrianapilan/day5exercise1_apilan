sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, JSONModel, MessageBox, MessageToast) {
        "use strict";

        return Controller.extend("sapips.training.employeeapp.controller.EmployeeList", {
            onInit: function () {
                
            },

            onSearch: function (oEvent) {
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter({
                        filters: [
                            new Filter("EmployeeID", FilterOperator.Contains, sQuery),
                            new Filter("FirstName", FilterOperator.Contains, sQuery),
                            new Filter("LastName", FilterOperator.Contains, sQuery),
                        ],
                        and: false,
                    });
                    aFilters.push(filter);
                }
    
                var oList = this.byId("idEmployeesTable");
                var oBinding = oList.getBinding("items");
                    oBinding.filter(aFilters);
            },

            onPressListItem: function (oEvent) {
                var sEmployeeID = oEvent.getSource().getCells()[0].getText();
                this.getRouter().navTo("EmployeeProfile", {
                    EmployeeID: sEmployeeID
                });
            },

            onCreateEmployeeBtn: function () {
                this.getRouter().navTo("CreateEmployee");
            },

            onDeleteBtn: function () {
                var oModel = this.getOwnerComponent().getModel("EmployeeApp");

                var oList = this.byId("idEmployeesTable");
                var items = oList.getSelectedItems();

                if (items.length > 0) {
                    MessageBox.confirm("Are you sure you want to delete the selected employee/s?", {
                        actions: [MessageBox.Action.YES, MessageBox.Action.CLOSE],
                        emphasizedAction: MessageBox.Action.YES,
                        onClose: function (sAction) {
                            if (sAction === sap.m.MessageBox.Action.YES) {
                                var arrFailed = [];

                                for (var i = 0; i < items.length; i++) {
                                    var item = items[i];

                                    var sEmployeeID = item.getCells()[0].getText();

                                    oModel.remove("/Employee(EmployeeID='"+ sEmployeeID +"')", {
                                        success: function () {
                                            
                                        },
                    
                                        error: function () {
                                            arrFailed.push(sEmployeeID);
                                        }
                                    });
                                }

                                if (arrFailed.length > 0) {
                                    MessageToast.show("Failed to delete some employee/s.");
                                } else {
                                    MessageToast.show("Employee/s has been deleted.");
                                }
                            }
                        }
                    });
                } else {
                    MessageBox.warning("Please select employee/s.");
                }
            },

            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            }
        });
    });
