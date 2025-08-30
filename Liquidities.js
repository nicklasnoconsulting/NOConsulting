OnLoad = function (executionContext) {
    var formContext = executionContext.getFormContext();
    var formType = formContext.ui.getFormType();
    if (formType != 1) {
        formContext.getControl("noc_name").setDisabled(true);
        formContext.getControl("noc_result").setDisabled(true);
        formContext.getControl("noc_ingoingbalance").setDisabled(true);
        formContext.getControl("noc_outgoingbalance").setDisabled(true);
        formContext.getControl("noc_year").setDisabled(true);
        formContext.getControl("noc_month").setDisabled(true);
        formContext.getControl("noc_date").setDisabled(true);
        formContext.getControl("noc_businessunit").setDisabled(true);
    }
}
OnChange = function (executionContext) {
    var formContext = executionContext.getFormContext();
    var formType = formContext.ui.getFormType();
    var month = formContext.getAttribute("noc_month").getValue();
    var year = formContext.getAttribute("noc_year").getValue();
    var month_ = month;
    if (formType == 1 && month != null && year != null) {         
        if (month < 10) {
            month_ = "0" + month;
        }
        formContext.getAttribute("noc_name").setValue(year + "-" + month_);
    }
    
}
OnSave = function (executionContext) {
    debugger;
    var formContext = executionContext.getFormContext();
    var income = formContext.getAttribute("noc_income").getValue();
    var expense = formContext.getAttribute("noc_expense").getValue();
    formContext.getAttribute("noc_result").setValue(income - expense);
    //var year_;
    //var month_;
    //var year = formContext.getAttribute("noc_year").getValue();
    //var month = formContext.getAttribute("noc_month").getValue();
    //var income = formContext.getAttribute("noc_income").getValue();
    //var expense = formContext.getAttribute("noc_expense").getValue();
    //if (month == 1) {
    //    year_ = (year - 1);
    //    month_ = 12;
    //}
    //else {
    //    year_ = year;
    //    month_ = month - 1;
    //}
    //var liquidity = await getLatestLiquidity(year_, month_);
    //if (liquidity != null) {
    //    formContext.getAttribute("noc_balance").setValue((income - expense) + liquidity[0].noc_balance);
    //    formContext.getAttribute("noc_result").setValue(income - expense);
    //}
}
UpdateAll = async function (executionContext) {
    debugger;
    var flowURL = "https://prod-104.westeurope.logic.azure.com:443/workflows/162c6bee878f4207b76b045287dce978/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=X0A26aeOs9bHLkNZh4ZUoIOe64AF3uRqqKjEBrmmuHw";
    var formContext = executionContext;
    var SuccessMessage = "All Liquidities updated";
    var businessUnit = formContext.getAttribute("noc_businessunit").getValue();
    var BusinessUnit = businessUnit[0].id;
    //BusinessUnit.replace("{", "").replace("}", "");
    var flowURL = "https://prod-104.westeurope.logic.azure.com:443/workflows/162c6bee878f4207b76b045287dce978/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=X0A26aeOs9bHLkNZh4ZUoIOe64AF3uRqqKjEBrmmuHw";
    callFlow(executionContext, BusinessUnit, SuccessMessage, flowURL);
}
Recalculate = async function (executionContext) {
    debugger;
    var flowURL = "https://prod-190.westeurope.logic.azure.com:443/workflows/5dada9a08a4540169466bc9b468c4593/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=CC-ZdBA4qLRKsmVmVU4R3D0KQaD5UxkSC_33PCO2PD8";
    var formContext = executionContext;
    var SuccessMessage = "Liquidity updated";
    var businessUnit = formContext.getAttribute("noc_businessunit").getValue();
    var BusinessUnit = businessUnit[0].id;
    //BusinessUnit.replace("{", "").replace("}", "");
    var flowURL = "https://prod-190.westeurope.logic.azure.com:443/workflows/5dada9a08a4540169466bc9b468c4593/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=CC-ZdBA4qLRKsmVmVU4R3D0KQaD5UxkSC_33PCO2PD8";
    callFlow(executionContext, BusinessUnit, SuccessMessage, flowURL);
}