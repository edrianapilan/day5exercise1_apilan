sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, History, JSONModel) {
        "use strict";

        return Controller.extend("sapips.training.employeeapp.controller.EmployeeProfile", {
            onInit: function () {
                this.getRouter().getRoute('EmployeeProfile').attachPatternMatched(this._onObjectMatched, this);
            },

            onNavBack: function () {
                this.getRouter().navTo("RouteEmployeeList");
                // var oHistory = History.getInstance();
                // var sPreviousHash = oHistory.getPreviousHash();

                // if (sPreviousHash && sPreviousHash !== undefined) {
                //     window.history.go(-1);
                // } else {
                //     this.getRouter().navTo("RouteEmployeeList");
                // }
            },

            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },

            _onObjectMatched: function (oEvent) {
                var oView = this.getView();

                var oModel = this.getOwnerComponent().getModel("EmployeeApp");

                var sEmployeeID = oEvent.getParameter("arguments").EmployeeID;

                oModel.read("/Employee(EmployeeID='"+ sEmployeeID +"')", {
                    success: function (oEmployee) {
                        var oEmployeeProfile = new JSONModel();
                        var oEmployeeData = jQuery.extend(
                            {
                                "FullName": oEmployee.FirstName + " " + oEmployee.LastName
                            }, 
                            oEmployee
                        );
                        oEmployeeProfile.setData(oEmployeeData);
                        oView.setModel(oEmployeeProfile, "EmployeeProfile");

                        oModel.read("/CareerList(CareerID='"+ oEmployee.CareerLevel +"')", {
                            success: function (oCareer) {
                                var oEmployeeCareer = new JSONModel();
                                    oEmployeeCareer.setData(oCareer);
                                oView.setModel(oEmployeeCareer, "EmployeeCareer");
                            }, 
        
                            error: function () {}
                        });

                        oModel.read("/ProjectList(ProjectID='"+ oEmployee.CurrentProject +"')", {
                            success: function (oProject) {
                                var oEmployeeProject = new JSONModel();
                                    oEmployeeProject.setData(oProject);
                                oView.setModel(oEmployeeProject, "EmployeeProject");
                            }, 
        
                            error: function () {}
                        });
                        
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

            onEditBtn: function () {
                var sEmployeeID = this.getView().byId('idTextEmployeeID').getText();
                this.getRouter().navTo("EditEmployee", {
                    EmployeeID: sEmployeeID
                });
            }
        });
    });
