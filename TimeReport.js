OnLoad = async function (executionContext) {
    debugger;
    var formContext = executionContext.getFormContext();

    if (formContext.ui.getFormType() == 1) {
        // Date
        var todayDate = new Date();
        formContext.getAttribute("crm_date").setValue(todayDate);
        // Start Time
        var todayDate = new Date();
        var hours = todayDate.getHours();
        formContext.getAttribute("crm_starttimehour").setValue(todayDate.getHours());
        var minutes = todayDate.getMinutes();
        fifteenMinutes = (((minutes + 7.5) / 15 | 0) * 15) % 60;
        if (fifteenMinutes == 0) {
            hours + 1;
        }
        formContext.getAttribute("crm_starttimeminute").setValue(fifteenMinutes);     
           
    }
    if (formContext.getAttribute("statuscode").getValue() == 171060001) {
        formContext.getControl("crm_date").setDisabled(true);
        formContext.getControl("crm_starttimehour").setDisabled(true);
        formContext.getControl("crm_starttimeminute").setDisabled(true);
    }

    if (formContext.getAttribute("statuscode").getValue() == 171060000) { // Finished
        formContext.getControl("crm_type").setDisabled(true);
        formContext.getControl("crm_sick").setDisabled(true);
        formContext.getControl("crm_name").setDisabled(true);
        formContext.getControl("crm_date").setDisabled(true);
        //formContext.getControl("crm_expense").setDisabled(true);
        formContext.getControl("crm_expenses").setDisabled(true);
        //formContext.getControl("crm_expensecost").setDisabled(true);
        formContext.getControl("crm_workinghours").setDisabled(true);
        //formContext.getControl("crm_absencehours").setDisabled(true);
        formContext.getControl("statuscode").setDisabled(true);
        formContext.getControl("crm_starttimehour").setDisabled(true);
        formContext.getControl("crm_endtimehour").setDisabled(true);
        formContext.getControl("crm_starttimeminute").setDisabled(true);
        formContext.getControl("crm_endtimeminute").setDisabled(true);
        formContext.getControl("crm_employee").setDisabled(true);
        formContext.getControl("noc_note").setDisabled(true);

    }
  
}
OnSave = function (executionContext) {
    var formContext = executionContext.getFormContext();
    debugger;
    if (formContext.ui.getFormType() == 1) {
        formContext.getAttribute("statuscode").setValue(171060001);
        var todayDate = new Date();
        var date = extractDate(todayDate);
        var enteredDate = date[0] + "-" + date[1] + "-" + date[2];
        formContext.getAttribute("crm_name").setValue(enteredDate + "-" + formContext.getAttribute("crm_employee").getValue()[0].name);
    }
    else {
        if (formContext.getAttribute("statuscode").getValue() == 171060001 && formContext.getAttribute("crm_endtimehour").getValue() != null) {
            formContext.getAttribute("statuscode").setValue(171060000);
            var startHour = formContext.getAttribute("crm_starttimehour").getValue();
            var startMinute = formContext.getAttribute("crm_starttimeminute").getValue();
            var endHour = formContext.getAttribute("crm_endtimehour").getValue();
            var endMinute = formContext.getAttribute("crm_endtimeminute").getValue();
            var workingHours = calculateWorkingHours(startHour, startMinute, endHour, endMinute);
            if (workingHours < 0 && (formContext.getAttribute("statuscode").getValue() == 171060001 || formContext.getAttribute("statuscode").getValue() == 1)) {
                formContext.ui.setFormNotification("Working Hours < 0", "INFO", "WorkingHours");
            }
            else {
                formContext.getAttribute("crm_workinghours").setValue(workingHours);
            }
            if (startHour != null && startMinute != null) {
                formContext.getAttribute("statuscode").setValue(171060001); // Started
            }
            if (endHour != null && endMinute != null && workingHours > 0) {
                formContext.getAttribute("statuscode").setValue(171060000); // Finished
            }
            //saveRecord(formContext);
            //var timereportId = formContext.data.entity.getId().replace("{", "").replace("}", "");
            formContext.getControl("crm_name").setDisabled(true);
            formContext.getControl("crm_workinghours").setDisabled(true);
        }
    }
}


// L E G A C Y 
//OnLoad = async function (executionContext) {
//    var formContext = executionContext.getFormContext();
//    //formContext.getControl("crm_employee").addPreSearch(filterEmployeeContacts);
//    debugger;
//    var employee = formContext.getAttribute("crm_employee").getValue();
//    var date = await getDate(executionContext);
//    var period = null;
//    if (date != null) { period = await getPeriod(date[0], date[1]); }
//    var MonthlySalary = null;
//    if (period != null) { MonthlySalary = await getSalary(employee[0].id, period[0].crm_periodid); }
//    if (MonthlySalary != null) {
//        var lookupValue = new Array();
//        lookupValue[0] = new Object();
//        lookupValue[0].id = MonthlySalary[0].noc_salaryid;
//        lookupValue[0].name = MonthlySalary[0].noc_name;
//        lookupValue[0].entityType = "noc_salary";
//        formContext.getAttribute("noc_salary").setValue(lookupValue);
//    }


//OnChangeType = function (executionContext) {
//    var formContext = executionContext.getFormContext();
//    if (formContext.getAttribute("crm_type").getValue() == 171060002) { //Absence
//        formContext.getControl("crm_sick").setVisible(true);
//        formContext.getControl("crm_workinghours").setVisible(false);
//        formContext.getControl("crm_absencehours").setVisible(true);
//        formContext.getAttribute("crm_workinghours").setValue();
//        formContext.getAttribute("crm_absencehours").setValue(8);

//    }
//    if (formContext.getAttribute("crm_type").getValue() == 171060001) { //Vacation
//        formContext.getControl("crm_sick").setVisible(false);
//        formContext.getControl("crm_workinghours").setVisible(false);
//        formContext.getAttribute("crm_workinghours").setValue();
//        formContext.getAttribute("crm_sick").setValue(false);
//        formContext.getControl("crm_absencehours").setVisible(false);
//    }
//    if (formContext.getAttribute("crm_type").getValue() == 171060000) { //Work
//        formContext.getControl("crm_sick").setVisible(false);
//        formContext.getControl("crm_workinghours").setVisible(true);
//        formContext.getAttribute("crm_sick").setValue(false);
//        formContext.getControl("crm_absencehours").setVisible(false);
//    }
//}
//OnChangeExpense = function (executionContext) {
//    var formContext = executionContext.getFormContext();
//    var tab = formContext.ui.tabs.get("TimeReport");
//    var section = tab.sections.get("Expenses");
//    if (formContext.getAttribute("crm_expenses").getValue() == true) {
//        section.setVisible(true);
//    }
//    else if (formContext.getAttribute("crm_expenses").getValue() == false) {
//        section.setVisible(false);
//        formContext.getAttribute("crm_expenses").setValue();
//        formContext.getAttribute("crm_expensecost").setValue();
//    }
//}
//OnSave = async function (executionContext) {

//    var formContext = executionContext.getFormContext();
//    if (formContext.getAttribute("crm_type").getValue() == 171060001 || formContext.getAttribute("crm_type").getValue() == 171060000) {
//        formContext.getAttribute("crm_sick").setValue(false);
//    }
//    var startHour = formContext.getAttribute("crm_starttimehour").getValue();
//    var startMinute = formContext.getAttribute("crm_starttimeminute").getValue();
//    var endHour = formContext.getAttribute("crm_endtimehour").getValue();
//    var endMinute = formContext.getAttribute("crm_endtimeminute").getValue();

//    if (formContext.ui.getFormType() == 1) { //Create

//        var date = getDate(executionContext);
//        var enteredDate = date[0] + "-" + date[1] + "-" + date[2];
//        //var globalContext = Xrm.Utility.getGlobalContext();
//        //var	userName = globalContext.userSettings.userName;
//        var employee = formContext.getAttribute("crm_employee").getValue();
//        formContext.getAttribute("crm_name").setValue(employee[0].name + " " + enteredDate);
//        //saveRecord(formContext);
//        var timereportId = formContext.data.entity.getId().replace("{", "").replace("}", "");
//        var period = await getPeriod(date[0], date[1]);
//        var Id = employee[0].id.replace("{", "").replace("}", "");
//        var result = await getEmployee(Id);
//        var MonthlyTimeReport = await getMonthlyTimeReport(employee[0].id, period[0].crm_periodid);
//        if (MonthlyTimeReport == null) {
//            MonthlyTimeReport = await createMonthlyTimeReport(result, period[0].crm_periodid, timereportId, period[0].crm_name, employee);
//        }
//        if (MonthlyTimeReport != null) {
//            var lookupValue = new Array();
//            lookupValue[0] = new Object();
//            lookupValue[0].id = MonthlyTimeReport[0].crm_monthlytimereportid;
//            lookupValue[0].name = MonthlyTimeReport[0].crm_name;
//            lookupValue[0].entityType = "crm_monthlytimereport";
//            formContext.getAttribute("crm_monthlytimereport").setValue(lookupValue);
//        }

//        var MonthlySalary = await getSalary(employee[0].id, period[0].crm_periodid);
//        if (MonthlySalary == null) {
//            MonthlySalary = await createMonthlySalary(result, period[0].crm_periodid, timereportId, period[0].crm_name, employee);
//        }
//        if (MonthlySalary != null) {
//            var lookupValue = new Array();
//            lookupValue[0] = new Object();
//            lookupValue[0].id = MonthlySalary[0].noc_salaryid;
//            lookupValue[0].name = MonthlySalary[0].noc_name;
//            lookupValue[0].entityType = "noc_salary";
//            formContext.getAttribute("noc_salary").setValue(lookupValue);
//        }

//        if (startHour != null && startMinute != null) {
//            formContext.getAttribute("statuscode").setValue(171060001); // Started
//        }
//    }
//    else {
//        var workingHours = calculateWorkingHours(startHour, startMinute, endHour, endMinute);
//        if (workingHours < 0 && (formContext.getAttribute("statuscode").getValue() == 171060001 || formContext.getAttribute("statuscode").getValue() == 1)) {
//            formContext.ui.setFormNotification("Working Hours < 0", "INFO", "WorkingHours");
//        }
//        else {
//            formContext.getAttribute("crm_workinghours").setValue(workingHours);
//        }
//        if (startHour != null && startMinute != null) {
//            formContext.getAttribute("statuscode").setValue(171060001); // Started
//        }
//        if (endHour != null && endMinute != null && workingHours > 0) {
//            formContext.getAttribute("statuscode").setValue(171060000); // Finished
//        }
//        //saveRecord(formContext);
//        //var timereportId = formContext.data.entity.getId().replace("{", "").replace("}", "");
//        formContext.getControl("crm_name").setDisabled(true);
//        formContext.getControl("crm_workinghours").setDisabled(true);
//    }
//}
//saveRecord = function (formContext) {
//    formContext.data.save();
//}


calculateWorkingHours = function (startHour, startMinute, endHour, endMinute) {
    var minutes = startMinute - endMinute;
    var hours = endHour - startHour;
    var workingHours = 0;
    switch (minutes) {
        case -15:
            workingHours = hours + 0.25;
            break;
        case -30:
            workingHours = hours + 0.5;
            break;
        case -45:
            workingHours = hours + 0.75;
            break;
        case 15:
            workingHours = hours - 0.25;
            break;
        case 30:
            workingHours = hours - 0.5;
            break;
        case 45:
            workingHours = hours - 0.75;
            break;
        case 0:
            workingHours = hours;
        default:
    }
    return workingHours;
}