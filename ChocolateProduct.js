OnLoad = function (executionContext) {
    debugger;
    var formContext = executionContext.getFormContext();
    var startDate = new Date();
    var year = startDate.getFullYear();
    var month = startDate.getMonth();
    if (month < 10) { month = "0" + month; }
    var day = startDate.getDate();
    if (day < 10) { day = "0" + day; }
    
    if (formContext.ui.getFormType() == 1) {
        formContext.getAttribute("noc_qty").setValue(0);
        formContext.getAttribute("noc_date").setValue(startDate);
    }
}
