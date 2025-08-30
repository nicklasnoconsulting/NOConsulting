OnLoad = function (executionContext) {
    debugger;
    var formContext = executionContext.getFormContext();
    var startDate = new Date();
    var year = startDate.getFullYear();
    var month = startDate.getMonth();
    if (month < 10) { month = "0" + month; }
    var day = (startDate.getDate() + 1);
    if (day < 10) { day = "0" + day; }
    var readyDate = new Date(year, month, day);
    if (formContext.ui.getFormType() == 1) {
        
        formContext.getAttribute("noc_qty").setValue(42);
        formContext.getAttribute("noc_startdate").setValue(startDate);
        formContext.getAttribute("noc_readydate").setValue(readyDate);
        formContext.getAttribute("noc_type").setValue(181700000);
        formContext.getAttribute("noc_weight").setValue(12);
    }
}
OnChange = function (executionContext) {
    var formContext = executionContext.getFormContext();
    formContext.getAttribute("noc_name").setValue(formContext.getAttribute("noc_product").getValue()[0].name);
}