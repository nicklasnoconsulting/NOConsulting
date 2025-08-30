OnSave = function (executionContext) {
    var formContext = executionContext.getFormContext();

    if (formContext.ui.getFormType() == 1) { //Create
       
    //    var year = formContext.getAttribute("crm_year").getValue();
    //    var month = formContext.getAttribute("crm_month").getValue();
    //    formContext.getAttribute("crm_name").setValue(year + "-" + month);
    }
    //else {
    //    formContext.getControl("crm_name").setDisabled(true);
    //    formContext.getControl("crm_year").setDisabled(true);
    //    formContext.getControl("crm_month").setDisabled(true);
    //}
}
OnLoad = function (executionContext) {
    var formContext = executionContext.getFormContext();
    if (formContext.ui.getFormType() != 1) { //Create
    //    var formContext = executionContext.getFormContext();
    //    formContext.getControl("crm_name").setDisabled(true);
    //    formContext.getControl("crm_year").setDisabled(true);
    //    formContext.getControl("crm_month").setDisabled(true);
    }

}

OnChange = function (executionContext) {
    debugger;
    var formContext = executionContext.getFormContext();
    var year = formContext.getAttribute("noc_year").getValue();
    var week = formContext.getAttribute("noc_week").getValue();
    if (week < 10 && week != null) {
        week = "0" + week;
    }
    var socialMedia = formContext.getAttribute("noc_socialmedia").getValue();
    var socialMediaName = socialMedia[0].name;
    if (year != null && week != null && socialMediaName != null) {
        formContext.getAttribute("noc_name").setValue(socialMediaName + " " + year + "-" + week);
    }
}



