sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History, JSONModel) {
        "use strict";

        return Controller.extend("sapips.training.employeeapp.controller.EmployeeProfile", {
            onInit: function () {
                this.getRouter().getRoute('EmployeeProfile').attachPatternMatched(this._onObjectMatched, this);
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
            }
        });
    });
