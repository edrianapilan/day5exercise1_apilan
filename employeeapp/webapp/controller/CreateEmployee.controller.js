sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/ValueState",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History, ValueState, MessageToast, MessageBox) {
        "use strict";

        return Controller.extend("sapips.training.employeeapp.controller.CreateEmployee", {
            onInit: function () {
                // var oView = this.getView();
                // var oEmployeeID = oView.byId("EmployeeIDInput");
                // var oEmployeeIDTmp = oView.byId("EmployeeIDInputTmp");

                // var dateToday = new Date();
                // var sEmployeeID = "EmployeeID" + new Date().getFullYear() + "" + this.getRandomSequence();

                // oEmployeeID.setValue(sEmployeeID);
                // oEmployeeIDTmp.setValue(sEmployeeID);

                var oView = this.getView();
                this.fnCheckValidation(oView);
            },

            onSaveBtn: function () {
                var oView = this.getView();

                var oModel = this.getOwnerComponent().getModel("EmployeeApp");

                var oEmployeeID = oView.byId("EmployeeIDInput"),
                    oFirstName = oView.byId("FirstNameInput"),
                    oLastName = oView.byId("LastNameInput"),
                    oAge = oView.byId("AgeInput"),
                    oDateHire = oView.byId("HireDateInput"),
                    oCareerLevel = oView.byId("CareerLevelSelect"),
                    oCurrentProject = oView.byId("CurrentProjectSelect");

                var sEmployeeID = this.getEmployeeID(oFirstName.getValue(), oLastName.getValue()).trim();

                var oData = {
                    "EmployeeID": sEmployeeID,
                    "FirstName": oFirstName.getValue(),
                    "LastName": oLastName.getValue(),
                    "Age": oAge.getValue(),
                    "DateHire": new Date(oDateHire.getValue()),
                    "CareerLevel": oCareerLevel.getSelectedKey(),
                    "CurrentProject": oCurrentProject.getSelectedKey(),
                };
                
                oModel.create("/Employee", oData, {
                    success: function () {
                        MessageToast.show("Employee has been created.");
                    },

                    error: function () {
                        MessageToast.show("Failed to create employee.");
                    }
                });
            },

            onNavBack: function () {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash && sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    this.getRouter().navTo("RouteEmployeeList");
                }
            },

            onInputChange: function (oEvent) {
                var oModel = this.getOwnerComponent().getModel("EmployeeApp");

                var oInput = oEvent.getSource(),
                    sText = oInput.getValue();

                if (sText.length === 0) {
                    oInput.setValueState(ValueState.Error);
                } else {
                    oInput.setValueState(ValueState.None);
                }

                if (oInput.getId().includes('AgeInput')) {
                    var age = parseInt(oInput.getValue());
                    if (age < 0 || age > 90) {
                        oInput.setValue("");
                        oInput.setValueState(ValueState.Error);
                        MessageBox.warning("Age cannot be less than 0 and greater than 90.");
                    }
                }

                if (oInput.getId().includes('HireDateInput')) {
                    var dateToday = new Date();
                    if (new Date(oInput.getValue()) > dateToday) {
                        oInput.setValue("");
                        oInput.setValueState(ValueState.Error);
                        MessageBox.warning("You cannot input future dates.");
                    }
                }

                if (oInput.getId().includes('CareerLevelSelect')) {
                    oModel.read("/CareerList(CareerID='"+ oInput.getSelectedKey() +"')", {
                        success: function (oCareer) {}, 
    
                        error: function () {
                            oInput.setValue("");
                            oInput.setValueState(ValueState.Error);
                            MessageBox.warning("Valid entries from the list only.");
                        }
                    });
                }

                if (oInput.getId().includes('CurrentProjectSelect')) {
                    oModel.read("/ProjectList(ProjectID='"+ oInput.getSelectedKey() +"')", {
                        success: function (oCareer) {}, 
    
                        error: function () {
                            oInput.setValue("");
                            oInput.setValueState(ValueState.Error);
                            MessageBox.warning("Valid entries from the list only.");
                        }
                    });
                }
            },

            fnCheckValidation: function (oView) {
                var oFirstName = oView.byId("FirstNameInput");
                    oFirstName.attachBrowserEvent("keypress", function(event) {
                        var inputValue = event.which;
                        if(!(inputValue >= 65 && inputValue <= 120) && (inputValue != 32 && inputValue != 0)) { 
                            event.preventDefault(); 
                        }
                    });

                var oLastName = oView.byId("LastNameInput");
                    oLastName.attachBrowserEvent("keypress", function(event) {
                        var inputValue = event.which;
                        if(!(inputValue >= 65 && inputValue <= 120) && (inputValue != 32 && inputValue != 0)) { 
                            event.preventDefault(); 
                        }
                    });

                var oAge = oView.byId("AgeInput");
                    oAge.attachBrowserEvent("keypress", function(event) {
                        var keyCodes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 0, 8];
                        if (!($.inArray(event.which, keyCodes) >= 0)) {
                            event.preventDefault();
                        }
                    });
            },

            getEmployeeID: function (firstName, lastName) {
                var dateToday = new Date();
                return "EMPID" + firstName.toUpperCase() + lastName.toUpperCase() + dateToday.getDate() + dateToday.getMonth() + 1;
            },

            getRandomSequence: function () {
                return Math.floor(100000 + Math.random() * 900000);
            },

            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            }
        });
    });
