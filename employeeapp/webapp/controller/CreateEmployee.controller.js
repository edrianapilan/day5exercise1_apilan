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
                var oView = this.getView();
                this.fnCheckValidation(oView);
            },

            onSaveBtn: function () {
                var oView = this.getView();

                var oRouter = this.getRouter();

                var oModel = this.getOwnerComponent().getModel("EmployeeApp");

                var oFirstName = oView.byId("FirstNameInput"),
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

                if (
                    oData.FirstName=="" || 
                    oData.LastName=="" || 
                    oData.Age=="" || 
                    oData.DateHire=="" || 
                    oData.CareerLevel=="" || 
                    oData.CurrentProject==""
                ) {
                    MessageBox.warning("All (*) fields are required.");
                } else {
                    oModel.create("/Employee", oData, {
                        success: function () {
                            MessageBox.confirm("Employee has been created.", {
                                actions: [MessageBox.Action.OK],
                                emphasizedAction: MessageBox.Action.OK,
                                onClose: function (sAction) {
                                    if (sAction === sap.m.MessageBox.Action.OK) {
                                        oFirstName.setValue("");
                                        oLastName.setValue("");
                                        oAge.setValue("");
                                        oDateHire.setValue("");
                                        oCareerLevel.setValue("");
                                        oCurrentProject.setValue("");
                                        oRouter.navTo("EmployeeProfile", {
                                            EmployeeID: sEmployeeID
                                        });
                                    }
                                }
                            });
                        },
    
                        error: function () {
                            MessageToast.show("Failed to create employee.");
                        }
                    });
                }
            },

            onNavBack: function () {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();

                var oView = this.getView();

                var oFirstName = oView.byId("FirstNameInput"),
                    oLastName = oView.byId("LastNameInput"),
                    oAge = oView.byId("AgeInput"),
                    oDateHire = oView.byId("HireDateInput"),
                    oCareerLevel = oView.byId("CareerLevelSelect"),
                    oCurrentProject = oView.byId("CurrentProjectSelect");

                oFirstName.setValue("");
                oLastName.setValue("");
                oAge.setValue("");
                oDateHire.setValue("");
                oCareerLevel.setValue("");
                oCurrentProject.setValue("");

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

                if (oInput.getId().includes('SkillListSelect')) {
                    oModel.read("/SkillList(SkillID='"+ oInput.getSelectedKey() +"')", {
                        success: function (oCareer) {}, 
    
                        error: function () {
                            oInput.setValue("");
                            oInput.setValueState(ValueState.Error);
                            MessageBox.warning("Valid entries from the list only.");
                        }
                    });
                }

                if (oInput.getId().includes('ProficiencyListSelect')) {
                    oModel.read("/ProficiencyList(ProficiencyID='"+ oInput.getSelectedKey() +"')", {
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
                        var charCode = event.keyCode;
                        if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8) {
                            return true;
                        } else {
                            return false;
                        }
                    });

                var oLastName = oView.byId("LastNameInput");
                    oLastName.attachBrowserEvent("keypress", function(event) {
                        var charCode = event.keyCode;
                        if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8) {
                            return true;
                        } else {
                            return false;
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
                return "EMPID" + firstName.toUpperCase() + lastName.toUpperCase() + dateToday.getDate() + (dateToday.getMonth()+1);
            },

            getRandomSequence: function () {
                return Math.floor(100000 + Math.random() * 900000);
            },

            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            }
        });
    });
