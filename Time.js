var message = "";
var uniqueId = "";
OnLoad = async function (executionContext) {
  debugger;
  var formContext = executionContext.getFormContext();
  if (formContext.getAttribute("noc_absence").getValue() == true) {
    formContext.ui.tabs.get("TimeTab").sections.get("AbsenceSection").setVisible(true);
  }
  else {
    formContext.ui.tabs.get("TimeTab").sections.get("AbsenceSection").setVisible(false);
  }
  var timeId = null;
  var Month = null;
  var period = null;
  var formAssignment = formContext.getAttribute("noc_assignment").getValue();
  var date = getDate(formContext);


  if (formContext.ui.getFormType() == 1) {
  // Set initial values - Employee, Assignment, Date, Hours, Invoice Line, Month, Name
    // Assignment
      if (formAssignment != null) {
          var assignment = await getAssignment(formAssignment[0].id);
          // Invoice
          var invoice = await getOpenInvoice(formAssignment[0].id);
          // Invoice Line
          if (invoice != null) {
              var invoiceLine = await getOpenInvoiceLine(invoice[0].noc_fakturaid);
              var invoiceLineId = new Array();
              invoiceLineId[0] = new Object();
              invoiceLineId[0].id = invoiceLine[0].noc_invoicelineid;
              invoiceLineId[0].name = invoiceLine[0].noc_name;
              invoiceLineId[0].entityType = "noc_invoiceline";
              formContext.getAttribute("noc_invoiceline").setValue(invoiceLineId);
          }
          // Employee
          var employeeAssignment = await getEmployeeAssignment(assignment[0].noc_assignmentid);
          if (employeeAssignment == null) {
              message = "No employee on the Assignment!";
              formContext.ui.setFormNotification(message, "ERROR", uniqueId);
              return;
          }
          var employee = await getEmployee(employeeAssignment[0].noc_employeeid);
          var employeeId = new Array();
          employeeId[0] = new Object();
          employeeId[0].id = employeeAssignment[0].noc_employeeid;
          employeeId[0].name = employee[0].noc_name;
          employeeId[0].entityType = "noc_employee";
          formContext.getAttribute("noc_employee").setValue(employeeId);
          // Hours
          var scope = assignment[0].noc_scope;
          var hrs = 0;
          switch (scope) {
              case 181700000:
                  hrs = 2;
                  break;
              case 181700001:
                  hrs = 4;
                  break;
              case 181700002:
                  hrs = 6;
                  break;
              case 181700003:
                  hrs = 8;
                  break;
              default:
                  hrs = 1;
          }
          formContext.getAttribute("noc_hours").setValue(hrs);

          //Business Unit
          var customer = await getAssignment(assignment[0].noc_assignmentid);
          if (customer != null) {
              var businessunit = await getAccount(customer[0]._noc_assignmentcustomer_value);
          }
      }
      // Date
      var todayDate = new Date();
      formContext.getAttribute("noc_date").setValue(todayDate); // Set Date
      // Name
      var date = extractDate(todayDate);
      var enteredDate = date[0] + "-" + date[1] + "-" + date[2];
      var project = formContext.getAttribute("noc_project").getValue();
      //var formAssignment = formContext.getAttribute("noc_assignment").getValue();
      if (formAssignment != null) {
          formContext.getAttribute("noc_name").setValue(employeeId[0].name + "@" + formAssignment[0].name + "#" + enteredDate);
      }
      else if (project != null) {
          formContext.getAttribute("noc_name").setValue(employeeId[0].name + "@" + project[0].name + "#" + enteredDate);
      }

      // Month
      var timeId = null;
      var Month = null;
      //var newMonth = null;
      var period = null;
      var date = extractDate(todayDate);
      if (date != null) {
        period = await getPeriod(date[0], date[1]);
      }
      if (period != null) {
        Month = null;
        if (assignment != null) {
          Month = await getMonth(employeeAssignment[0].noc_employeeid, period[0].crm_periodid, formAssignment[0].id);
        }
        //else if (project != null) {
        ////  Month = await getMonth(employeeAssignment[0].noc_employeeid, period[0].crm_periodid, project[0].id);
        //}
        //if (Month == null && assignment != null) {
 
        //    // newMonth = await createMonth(employeeAssignment[0].noc_employeeid, period[0].crm_periodid, date, period[0].crm_name, employeeAssignment[0].noc_employeeid, customer, businessunit);
        //    var newMonth = await createMonth(assignment, period[0].crm_periodid, date, enteredDate, employee, customer, businessunit);

        //    if (newMonth != null) {
        //        //Month = await getNewMonth(employee[0].noc_name + " " + enteredDate);
        //        Month = await getNewMonth(newMonth[0].noc_monthid);
        //    }
           
        //}
        if (Month != null) {
          var lookupValue = new Array();
          lookupValue[0] = new Object();
          lookupValue[0].id = Month[0].noc_monthid;
          lookupValue[0].name = Month[0].noc_name;
          lookupValue[0].entityType = "noc_month";
          formContext.getAttribute("noc_month").setValue(lookupValue);
        }
      }
      if (assignment != null) {
          // Time Activity
          var defaultTimeActivityId = assignment[0]._noc_defaulttimeactivity_value;
          var defaultTimeActivity = await getTimeActivity(defaultTimeActivityId);
          if (defaultTimeActivity != null) {
              var defaultTimeActivityValue = new Array();
              defaultTimeActivityValue[0] = new Object();
              defaultTimeActivityValue[0].id = defaultTimeActivity[0].noc_timeactivityid;
              defaultTimeActivityValue[0].name = defaultTimeActivity[0].noc_name;
              defaultTimeActivityValue[0].entityType = "noc_timeactivity";
              formContext.getAttribute("noc_timeactivity").setValue(defaultTimeActivityValue);
          }
          // Time Activity Text
          if (defaultTimeActivityValue != null) {
              formContext.getAttribute("noc_timeactivitytext").setValue(defaultTimeActivityValue[0].name);
          }
          // Time Fee
          formContext.getAttribute("noc_timefee").setValue(defaultTimeActivity[0].noc_hourlyfee);
          // Unit
          var defaultUnitId = defaultTimeActivity[0].noc_unit;     
          formContext.getAttribute("noc_unit").setValue(defaultUnitId); 
          // Unit Text
          if (defaultUnitId != null) {
              formContext.getAttribute("noc_unittext").setValue(formContext.getAttribute("noc_unit").getText());
          }
          // Tax
          formContext.getAttribute("noc_tax").setValue(defaultTimeActivity[0].noc_tax);
      }
      // Monthly Salary
//      var MonthlySalary = null;
//      var newMonthlySalary = null;
//      if (period != null) {
//        MonthlySalary = await getSalary(employee[0].id, period[0].crm_periodid);
//        if (MonthlySalary == null) {
//          newMonthlySalary = await createMonthlySalary(result, period[0].crm_periodid, timeId, period[0].crm_name, employee);
//          if (newMonthlySalary == null) {
//            newMonthlySalary = await getNewMonthlySalary(assignment);
//          }
//        }
//        else {
//          newMonthlySalary = MonthlySalary;
//        }
//        if (newMonthlySalary != null) {
//          var lookupValue = new Array();
//          lookupValue[0] = new Object();
//          lookupValue[0].id = MonthlySalary[0].noc_salaryid;
//          lookupValue[0].name = MonthlySalary[0].noc_name;
//          lookupValue[0].entityType = "noc_salary";
//          formContext.getAttribute("noc_salary").setValue(lookupValue);
//        }
//      }

    }
  // Set fields disabled
      if(formContext.getAttribute("statuscode").getValue() == 181700000) { // Sent
        formContext.getControl("noc_absence").setDisabled(true);
        formContext.getControl("noc_absencehours").setDisabled(true);
        formContext.getControl("noc_absencereason").setDisabled(true);
        formContext.getControl("noc_employee").setDisabled(true);
        formContext.getControl("noc_assignment").setDisabled(true);
        formContext.getControl("noc_date").setDisabled(true);
        formContext.getControl("noc_hours").setDisabled(true);
        formContext.getControl("noc_note").setDisabled(true);
        }

        var formName = formContext.ui.formSelector.getCurrentItem().getLabel();
        if (formName == "Chocolate & Friends") {
        }
}

OnChangeTimeActivity = function (executionContext) {
    var formContext = executionContext.getFormContext();
    defaultTimeActivityValue = formContext.getAttribute("noc_timeactivity").getValue();
    if (defaultTimeActivityValue != null) {
        formContext.getAttribute("noc_timeactivitytext").setValue(defaultTimeActivityValue[0].name);
    }
}
OnChangeDate = function (executionContext) {
    debugger;
    var formContext = executionContext.getFormContext();
    var todayDate = formContext.getAttribute("noc_date").getValue();
    var date = extractDate(todayDate);
    var enteredDate = date[0] + "-" + date[1] + "-" + date[2];
    var project = formContext.getAttribute("noc_project").getValue();
    var assignment = formContext.getAttribute("noc_assignment").getValue();
    var employee = formContext.getAttribute("noc_employee").getValue();
    if (assignment != null) {
        formContext.getAttribute("noc_name").setValue(employee[0].name + "@" + assignment[0].name + "#" + enteredDate);
        //formContext.getAttribute("noc_name").setValue(enteredDate + "#" + assignment[0].name + "#" + employee[0].name);
        //var message = "";
        //var uniqueId = "";
    }
}
OnChangeAssignment = async function (executionContext) {
    debugger;
    var formContext = executionContext.getFormContext();
    var Month = null;
    var period = null;
    var todayDate = new Date();
    var date = extractDate(todayDate);
    if (date != null) {
        period = await getPeriod(date[0], date[1]);
    }
    var formAssignment = formContext.getAttribute("noc_assignment").getValue();
    if (formAssignment != null) {
        var assignment = await getAssignment(formAssignment[0].id);
        if (assignment != null) {
            var employeeAssignment = await getEmployeeAssignment(assignment[0].noc_assignmentid);
        }
        if (employeeAssignment != null) {
            Month = await getMonth(employeeAssignment[0].noc_employeeid, period[0].crm_periodid, formAssignment[0].id);
        }
    }
    
    if (Month != null) {
        var lookupValue = new Array();
        lookupValue[0] = new Object();
        lookupValue[0].id = Month[0].noc_monthid;
        lookupValue[0].name = Month[0].noc_name;
        lookupValue[0].entityType = "noc_month";
        formContext.getAttribute("noc_month").setValue(lookupValue);
    }
    else {
        formContext.getAttribute("noc_month").setValue(null);
    }
}
OnChangeAbsence = function(executionContext) {
  var formContext = executionContext.getFormContext();
  var tab = formContext.ui.tabs.get("TimeTab");
  var section = tab.sections.get("AbsenceSection");
    if(formContext.getAttribute("noc_absence").getValue() == true){
      section.setVisible(true);
    }
    else if(formContext.getAttribute("noc_absence").getValue() == false) {
      section.setVisible(false);
      formContext.getAttribute("noc_absencereason").setValue(null);
      formContext.getAttribute("noc_absencehours").setValue(null);
    }
  }
OnSave = async function (executionContext) {
    debugger;
    var formContext = executionContext.getFormContext();
}
