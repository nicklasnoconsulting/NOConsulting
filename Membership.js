OnChangeType = function(executionContext) {
  var formContext = executionContext.getFormContext();
 }
OnLoad = function(executionContext) {
    var formContext = executionContext.getFormContext();
    debugger;
    if (formContext.ui.getFormType() == 1) { //Create
        var todayDate = new Date();
        var year = (todayDate.getFullYear() + 1);
        var month = todayDate.getMonth();
        if (month < 10) { month = "0" + month; }
        var day = todayDate.getDate();
        if (day < 10) { day = "0" + day; }
        var endDate = new Date(year, month, day);
       
        if (formContext.getAttribute("noc_membershiptype").getValue() == 181700000) {  // C&F Contact
            formContext.getAttribute("noc_startdate").setValue(todayDate);
            formContext.getAttribute("noc_enddate").setValue(endDate);
            formContext.getAttribute("noc_name").setValue(formContext.getAttribute("noc_membershiptype").getText());
            formContext.getAttribute("noc_amount").setValue(100);
        }
    }
  }
OnSave = function(executionContext) {
    var formContext = executionContext.getFormContext();
   }
