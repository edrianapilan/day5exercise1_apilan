sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/ValueState",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History, ValueState, MessageToast, MessageBox, JSONModel) {
        "use strict";

        return Controller.extend("sapips.training.employeeapp.controller.EditEmployee", {
            onInit: function () {
                this.getRouter().getRoute('EditEmployee').attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function (oEvent) {
                var oView = this.getView();

                var oModel = this.getOwnerComponent().getModel("EmployeeApp");

                var sEmployeeID = oEvent.getParameter("arguments").EmployeeID;

                oModel.read("/Employee(EmployeeID='"+ sEmployeeID +"')", {
                    urlParameters: {
                        $expand: "CareerList,ProjectList,Skill"
                    },
                    success: function (oEmployee) {
                        var oEmployeeProfile = new JSONModel(oEmployee);
                        oView.setModel(oEmployeeProfile, "EmployeeProfile");
                        oView.getModel("EmployeeProfile").refresh();
                    },
                    error: function () {}
                });

                oModel.read("/Employee(EmployeeID='"+ sEmployeeID +"')/Skill", {
                    urlParameters: {
                        $expand: "SkillList,ProficiencyList"
                    },
                    success: function (oSkill) {
                        var oEmployeeSkill = new JSONModel(oSkill);
                        oView.setModel(oEmployeeSkill, "EmployeeSkill");
                        oView.getModel("EmployeeSkill").refresh();
                    },
                    error: function () {}
                });
            },

            onUpdateBtn: function () {
                var oView = this.getView();

                var oModel = this.getOwnerComponent().getModel("EmployeeApp");

                var oEmployeeID = oView.byId("EmployeeIDInput"),
                    oFirstName = oView.byId("FirstNameInput"),
                    oLastName = oView.byId("LastNameInput"),
                    oAge = oView.byId("AgeInput"),
                    oDateHire = oView.byId("HireDateInput"),
                    oCareerLevel = oView.byId("CareerLevelSelect"),
                    oCurrentProject = oView.byId("CurrentProjectSelect");

                var oData = {
                    "EmployeeID": oEmployeeID.getValue(),
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
                    oModel.update("/Employee(EmployeeID='"+ oData.EmployeeID +"')", oData, {
                        success: function () {
                            MessageToast.show("Employee has been updated.");
                        },
    
                        error: function () {
                            MessageToast.show("Failed to update employee.");
                        }
                    });
                }
            },

            onSaveSkillBtn: function () {
                var oView = this.getView();

                var oModel = this.getOwnerComponent().getModel("EmployeeApp");

                var oEmployeeID = oView.byId("EmployeeIDInput"),
                    oSkillListSelect = oView.byId("SkillListSelect"),
                    oProjectListSelect = oView.byId("ProficiencyListSelect");

                var oData = {
                    "EmployeeID": oEmployeeID.getValue(),
                    "SkillID": oSkillListSelect.getSelectedKey(),
                    "Proficiency": oProjectListSelect.getSelectedKey()
                };

                if (
                    oData.oSkillListSelect=="" || 
                    oData.oProjectListSelect==""
                ) {
                    MessageBox.warning("You must fill skill & proficiency.");
                } else {
                    oModel.create("/Skill", oData, {
                        success: function () {
                            MessageBox.confirm("Skill has been added.", {
                                actions: [MessageBox.Action.OK],
                                emphasizedAction: MessageBox.Action.OK,
                                onClose: function (sAction) {
                                    if (sAction === sap.m.MessageBox.Action.OK) {
                                        oSkillListSelect.setValue("");
                                        oProjectListSelect.setValue("");

                                        window.history.go(-1);
                                    }
                                }
                            });
                        },
    
                        error: function () {
                            MessageToast.show("Failed to add skill.");
                        }
                    });
                }
            },

            onDeleteSkillBtn: function () {
                var oView = this.getView();
                var oModel = this.getOwnerComponent().getModel("EmployeeApp");

                var oList = this.byId("idEmployeeSkillTable");
                var items = oList.getSelectedItems();

                if (items.length > 0) {
                    MessageBox.confirm("Are you sure you want to delete the selected skill/s?", {
                        actions: [MessageBox.Action.YES, MessageBox.Action.CLOSE],
                        emphasizedAction: MessageBox.Action.YES,
                        onClose: function (sAction) {
                            if (sAction === sap.m.MessageBox.Action.YES) {
                                var arrFailed = [];

                                for (var i = 0; i < items.length; i++) {
                                    var item = items[i];

                                    var sEmployeeSkillID = item.getCells()[0].getText();

                                    oModel.remove("/Skill(EmployeeSkillID='"+ sEmployeeSkillID +"')", {
                                        success: function () {
                                            
                                        },
                    
                                        error: function () {
                                            arrFailed.push(sEmployeeSkillID);
                                        }
                                    });
                                }

                                if (arrFailed.length > 0) {
                                    MessageToast.show("Failed to delete some skill/s.");
                                } else {
                                    MessageToast.show("Skill/s has been deleted.");
                                }
                            }
                        }
                    });
                } else {
                    MessageBox.warning("Please select skill/s.");
                }
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

            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            }
        });
    });
