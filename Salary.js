OnLoad = async function(executionContext) {
  var formContext = executionContext.getFormContext();
  //formContext.getControl("noc_emp").addPreSearch(filterEmployeeContacts);
  SetManualAdjustment(executionContext);
  //setValues(formContext);
  if(formContext.getAttribute("noc_name").getValue() == null){
    formContext.getAttribute("noc_expenses").setValue();
    formContext.getAttribute("noc_tax").setValue();
    formContext.getAttribute("noc_netdeductions").setValue();
  }
  else {
    formContext.getControl("noc_name").setDisabled(true);
    formContext.getControl("noc_emp").setDisabled(true);
    formContext.getControl("noc_email").setDisabled(true);
    formContext.getControl("noc_businessunit").setDisabled(true);
  }
  var Id = formContext.data.entity.getId().replace("{", "").replace("}", "");
  var workingHours = 0;
  var absence = 0;
  var TimeReports = await getTimeReport(Id);
  if (TimeReports != null) {

      for (var i = 0; i < TimeReports.length; i++) {
        if (TimeReports[i].crm_workinghours != null) {workingHours = workingHours + TimeReports[i].crm_workinghours;}
        if (TimeReports[i].crm_type == 171060002 && TimeReports[i].crm_absencehours != null) {absence = absence + TimeReports[i].crm_absencehours;}
      }
      if (formContext.getAttribute("noc_manualadjustment").getValue() == false) {
        formContext.getAttribute("noc_workinghours").setValue(workingHours);
        formContext.getAttribute("noc_flex").setValue(absence);
      }
  }
  var Times = await getTime(Id);
  if (Times != null) {
      for (var i = 0; i < Times.length; i++) {
        if (Times[i].noc_hours != null) {workingHours = workingHours + Times[i].noc_hours;}
        if (Times[i].noc_absencehours != 0 && Times[i].noc_absencehours != null) {absence = absence + Times[i].noc_absencehours;}
      }
      if (formContext.getAttribute("noc_manualadjustment").getValue() == false) {
        formContext.getAttribute("noc_workinghours").setValue(workingHours);
        formContext.getAttribute("noc_flex").setValue(absence);
      }
  }

  var statusCode = formContext.getAttribute("statuscode").getValue();
  if(statusCode == 171060000) { //Sent
    formContext.getControl("noc_salary").setDisabled(true);
    formContext.getControl("noc_salarycalculation").setDisabled(true);
    formContext.getControl("noc_efp").setDisabled(true);
    formContext.getControl("noc_addvacationfee").setDisabled(true);
    formContext.getControl("noc_period").setDisabled(true);
    formContext.getControl("noc_dat").setDisabled(true);
    formContext.getControl("noc_expenses").setDisabled(true);
    formContext.getControl("noc_tax").setDisabled(true);
    formContext.getControl("noc_netdeductions").setDisabled(true);
    formContext.getControl("TimeReports").setDisabled(true);
  }

    if (manual = true) {
        formContext.getAttribute("noc_lonn").setValue(formContext.getAttribute("noc_lonb").getValue() - formContext.getAttribute("noc_skatt").getValue() - formContext.getAttribute("noc_avd").getValue() + formContext.getAttribute("noc_utl").getValue());
    }
    //else {
    //    formContext.getAttribute("noc_lonn").setValue(formContext.getAttribute("noc_grosssalary").getValue() - formContext.getAttribute("noc_tax").getValue() - formContext.getAttribute("noc_netdeductions").getValue() + formContext.getAttribute("noc_expenses").getValue());
    //}
 }
OnSave = async function(executionContext) {
   var formContext = executionContext.getFormContext();
    debugger;
     var manual = formContext.getAttribute("noc_manualadjustment").getValue();
     var dateValue = formContext.getAttribute("noc_period").getValue();
     var periodName = "";
     if (dateValue != undefined) {
       periodName = dateValue[0].name;
       periodId = dateValue[0].id;
     }
     //var globalContext = Xrm.Utility.getGlobalContext();
     //var	userName = globalContext.userSettings.userName;
    if (formContext.ui.getFormType() == 1) { //Create
        var employee = formContext.getAttribute("noc_emp").getValue();
        if (employee != null && employee != undefined) {
            var userName = employee[0].name;
            var Id = employee[0].id.replace("{", "").replace("}", "");
            var result = await getEmployee(Id);
            if (result != null) {
                formContext.getAttribute("noc_salary").setValue(result[0].noc_salary);
                formContext.getAttribute("noc_salarycalculation").setValue(result[0].noc_salarycalculation);
                formContext.getAttribute("noc_efp").setValue(result[0].noc_employerfeepercentage);
                if (result[0].noc_salarycalculation == 171060000) {
                    formContext.getAttribute("noc_employerfee").setValue((result[0].noc_employerfeepercentage * result[0].noc_salary) / 10000);
                    var tab = result[0].noc_tab;
                }
                else {
                    formContext.getAttribute("noc_employerfee").setValue(((result[0].noc_salary * formContext.getAttribute("noc_workinghours").getValue()) * result[0].noc_employerfeepercentage) / 10000);
                }

                formContext.getAttribute("noc_addvacationfee").setValue(result[0].noc_addvacationfee);
                formContext.getAttribute("noc_email").setValue(result[0].emailaddress);
                var userId = result[0].contactid;
            }
        }
        formContext.getAttribute("noc_name").setValue(userName + " " + periodName);
    }


     // Salary calculation
    if (manual == false) {
        var salary = formContext.getAttribute("noc_salary").getValue();
        if (salary == null) { salary = 0; }
        var expenses = formContext.getAttribute("noc_expenses").getValue();
        if (expenses == null) { expenses = 0; }
        var grosssalary = Math.floor(calculateGrossSalary(formContext));
        var DateNow = new Date();
        var year = DateNow.getFullYear();
        var skatt = await getSkattetabell(grosssalary, year, tab);
        if (skatt != null) {
            formContext.getAttribute("noc_skatt").setValue(skatt[0].noc_kol1);
            formContext.getAttribute("noc_tax").setValue(skatt[0].noc_kol1);
        }
        var tax = formContext.getAttribute("noc_tax").getValue();
        if (tax == null) { tax = 0; }
        var deductions = formContext.getAttribute("noc_netdeductions").getValue();
        if (deductions == null) { deductions = 0; }

        formContext.getAttribute("noc_grosssalary").setValue(grosssalary);
        formContext.getAttribute("noc_netsalary").setValue(grosssalary - tax - deductions + expenses);
        setValues(formContext);
        formContext.getControl("noc_name").setDisabled(true);
    }
    else {
        var salaryId = formContext.data.entity.getId().replace("{", "").replace("}", "");
        var salaryLines = await getSalaryLines(salaryId);
        if (salaryLines != null) {
            formContext.getAttribute("noc_lonb").setValue(salaryLines[0].noc_sum);
        }
        formContext.getAttribute("noc_lonn").setValue(formContext.getAttribute("noc_lonb") - formContext.getAttribute("noc_skatt"));
        formContext.getAttribute("noc_utbet").setValue(formContext.getAttribute("noc_lonn") + formContext.getAttribute("noc_utl"))
    }
  }
setValues = function(formContext){

  //if(formContext.getAttribute("noc_manualadjustment").getValue() == false){


    if (formContext.getAttribute("noc_lonb").getValue() == null) {
      formContext.getAttribute("noc_lonb").setValue(formContext.getAttribute("noc_grosssalary").getValue());
    }
    if (formContext.getAttribute("noc_skatt").getValue() == null) {
      formContext.getAttribute("noc_skatt").setValue(formContext.getAttribute("noc_tax").getValue());
    }
    if (formContext.getAttribute("noc_avd").getValue() == null) {
      formContext.getAttribute("noc_avd").setValue(formContext.getAttribute("noc_netdeductions").getValue());
    }
    if (formContext.getAttribute("noc_utl").getValue() == null) {
      formContext.getAttribute("noc_utl").setValue(formContext.getAttribute("noc_expenses").getValue());
    }
    if (formContext.getAttribute("noc_utbet").getValue() == null) {
      formContext.getAttribute("noc_utbet").setValue(formContext.getAttribute("noc_netsalary").getValue());
    }
    if (formContext.getAttribute("noc_netdeductions").getValue() != null){
      formContext.getAttribute("noc_sa").setValue(formContext.getAttribute("noc_netdeductions").getValue());
    }
    if (formContext.getAttribute("noc_avg").getValue() == null) {
      formContext.getAttribute("noc_avg").setValue(formContext.getAttribute("noc_employerfee").getValue());
    }
    //if (formContext.getAttribute("noc_dat").getValue() == null) {
    //  formContext.getAttribute("noc_dat").setValue(formContext.getAttribute("noc_paymentdate").getValue());
    //}
  //}
 }
SetManualAdjustment = function(executionContext) {
  var formContext = executionContext.getFormContext();
  if(formContext.getAttribute("noc_manualadjustment").getValue() == false){
    formContext.ui.tabs.get("EmployeeTab").sections.get("ManualAdjustmentsSection").setVisible(false);
    formContext.getControl("noc_workinghours").setDisabled(true);
    formContext.getControl("noc_flex").setDisabled(true);
    formContext.getControl("noc_salary").setDisabled(true);
    formContext.getControl("noc_salarycalculation").setDisabled(true);
    formContext.getControl("noc_efp").setDisabled(true);
    formContext.getControl("noc_addvacationfee").setDisabled(true);
    formContext.getControl("noc_expenses").setDisabled(true);
  }
  else if(formContext.getAttribute("noc_manualadjustment").getValue() == true) {
    formContext.ui.tabs.get("EmployeeTab").sections.get("ManualAdjustmentsSection").setVisible(true);
    formContext.getControl("noc_workinghours").setDisabled(false);
    formContext.getControl("noc_flex").setDisabled(false);
    formContext.getControl("noc_salary").setDisabled(false);
    formContext.getControl("noc_salarycalculation").setDisabled(false);
    formContext.getControl("noc_efp").setDisabled(false);
    formContext.getControl("noc_addvacationfee").setDisabled(false);
    formContext.getControl("noc_expenses").setDisabled(false);
  }
 }
calculateGrossSalary = function(formContext){
  var grosssalary = 0;
  var salary = formContext.getAttribute("noc_salary").getValue();
  var workingHours = formContext.getAttribute("noc_workinghours").getValue();
  if (formContext.getAttribute("noc_salarycalculation").getValue() == 171060001) { // Hourly
    if(formContext.getAttribute("noc_addvacationfee").getValue() == 171060000){ // Add
      grosssalary = (salary * workingHours) * 1.12;
    }
    else {
      grosssalary = (salary * workingHours);
    }
  }
  else if (formContext.getAttribute("noc_salarycalculation").getValue() == 171060000) {  // Monthly
    if(formContext.getAttribute("noc_addvacationfee").getValue() == 171060000){ // Add
      grosssalary = salary * 1.12;
    }
    else {
      grosssalary = salary;
    }
  }
  return grosssalary;
 }
SendMonthlySalary = async function(executionContext) {
  var formContext = executionContext;//.getFormContext();

  if(formContext.getAttribute("noc_paymentdate").getValue() == null || formContext.getAttribute("noc_paymentdate").getValue() == undefined) {
    alert("Payment Date is missing");
    return;
  }
  var Id = formContext.data.entity.getId().replace("{", "").replace("}", "");
  var result = await getTimeReport(Id);
  if (result != null) {
    var dataUpdate = {
      "statuscode": 181700000
    }
    for (var i = 0; i < result.length; i++) {
      updateRecord("crm_timereport", result[i].crm_timereportid, dataUpdate);
    }
  }
  formContext.getControl("noc_salary").setDisabled(true);
  formContext.getControl("noc_salarycalculation").setDisabled(true);
  formContext.getControl("noc_efp").setDisabled(true);
  formContext.getControl("noc_addvacationfee").setDisabled(true);
  formContext.getControl("noc_expenses").setDisabled(true);
  formContext.getAttribute("statuscode").setValue(181700000);
  alert("Salary Sent");
 }
OnEmployeeChange = async function(executionContext) {
  debugger;
  var formContext = executionContext.getFormContext();
  var employee = formContext.getAttribute("noc_emp").getValue();
  if (employee != null) {
      var Id = employee[0].id.replace("{", "").replace("}", "");
      var result = await getEmployee(Id);
      if (result != null) {
          var skatt = 0;
          if (result[0].noc_salarycalculation == 171060000) {
              formContext.getAttribute("noc_salary").setValue(result[0].noc_salary);
              formContext.getAttribute("noc_grosssalary").setValue(result[0].noc_salary);
              var tab = result[0].noc_tab;
              var DateNow = new Date();
              var year = DateNow.getFullYear();
              var tabellskatt = await getSkattetabell(result[0].noc_salary, year, tab);
              if (tabellskatt != null) {
                  skatt = tabellskatt[0].noc_kol1;
              }
          }
        formContext.getAttribute("noc_tax").setValue(skatt);
        formContext.getAttribute("noc_netsalary").setValue(result[0].noc_salary - skatt);
        formContext.getAttribute("noc_salarycalculation").setValue(result[0].noc_salarycalculation);
        formContext.getAttribute("noc_efp").setValue(result[0].noc_employerfeepercentage);
        formContext.getAttribute("noc_addvacationfee").setValue(result[0].noc_addvacationfee);
        formContext.getAttribute("noc_email").setValue(result[0].emailaddress);
        formContext.getAttribute("noc_ba").setValue(result[0].noc_bankaccount);
        formContext.getAttribute("noc_employerfee").setValue((result[0].noc_employerfeepercentage * result[0].noc_salary) / 10000);
        var businessunit = await getBusinessUnit(result[0]._noc_businessunit_value);
        if (businessunit != null) {
            var lookupValue = new Array();
            lookupValue[0] = new Object();
            lookupValue[0].id = businessunit[0].businessunitid;
            lookupValue[0].name = businessunit[0].name;
            lookupValue[0].entityType = "businessunit";
            formContext.getAttribute("noc_businessunit").setValue(lookupValue);
        }
        var todayDate = new Date();
        var date = extractDate(todayDate);
        if (date != null) {
            period = await getPeriod(date[0], date[1]);
            var lookupValue = new Array();
            lookupValue[0] = new Object();
            lookupValue[0].id = period[0].crm_periodid;
            lookupValue[0].name = period[0].crm_name;
            lookupValue[0].entityType = "crm_period";
            formContext.getAttribute("noc_period").setValue(lookupValue);
        }
         
        var year = todayDate.getFullYear();
        var month = todayDate.getMonth();
        var day = "25";
        var paymentDateNextMonth = new Date(year, month + 1, day);
        var paymentDateThisMonth = new Date(year, month, day);
        //if (businessunit[0].name == "Chocolaterian") {
         //   formContext.getAttribute("noc_dat").setValue(paymentDateNextMonth);
        //}
        //else {
            formContext.getAttribute("noc_dat").setValue(paymentDateThisMonth);
        //}
    setValues(formContext);
      }
  }
 }
