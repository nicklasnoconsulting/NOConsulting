OnLoad = async function(executionContext) {
debugger;
  var formContext = executionContext.getFormContext();
  var Id = formContext.data.entity.getId().replace("{", "").replace("}", "");
  if(formContext.ui.getFormType() == 1) { //Create
    formContext.getAttribute("noc_workedhours").setValue(0);
    formContext.getAttribute("noc_openhours").setValue(0);
    formContext.getAttribute("noc_esthrs").setValue(0);
    formContext.getAttribute("noc_estallowances").setValue(0);
    formContext.getAttribute("noc_actallowances").setValue(0);
    formContext.getAttribute("noc_invoicedhours").setValue(0);
    formContext.getAttribute("noc_estcost").setValue(0);
    formContext.getAttribute("noc_actcost").setValue(0);
    formContext.getAttribute("noc_remhrs").setValue(0);
    formContext.getAttribute("noc_estrevenue").setValue(0);
    formContext.getAttribute("noc_actrevenue").setValue(0);
    formContext.getAttribute("noc_estprofit").setValue(0);
    formContext.getAttribute("noc_actprofit").setValue(0);
    formContext.getAttribute("noc_remhrs").setValue(0);
    formContext.getAttribute("noc_actrevenue").setValue(0);
    formContext.getAttribute("noc_actprofit").setValue(0);
    formContext.getAttribute("noc_scope").setValue(181700003);
    formContext.getAttribute("noc_monthlyhrs").setValue(168);
      var applyDate = new Date();
      formContext.getAttribute("noc_adate").setValue(applyDate);
      var startYear = applyDate.getFullYear();
      var startMonth = applyDate.getMonth();
      var startDay = (applyDate.getDate() + 14);
      var newStartMonth = startMonth;
      var newStartYear = startYear;
      var newStartDay = startDay;
      if (startDay > 31) {
          newStartDay = startDay - 31;
          newStartMonth = startMonth + 1;
          if (newStartMonth > 12) {
              newStartYear = startYear + 1;
              newStartMonth = newStartMonth - 12;
          }
      }
      //if (newStartMonth < 10) { newStartMonth = "0" + newStartMonth; }
      //if (newStartDay < 10) { newStartDay = "0" + newStartDay; }
      var startDate = new Date(newStartYear, newStartMonth, newStartDay);
      formContext.getAttribute("noc_startdate").setValue(startDate);
        //extractDate();
      var endDate = new Date();
      var endYear = newStartYear;
      var endMonth = newStartMonth + 6;
      var newEndMonth = endMonth;
      var newEndYear = endYear;
      if (endMonth > 12) {
        newEndMonth = endMonth - 12;
        newEndYear = endYear + 1;
      }
      //if (newEndMonth < 10) { newEndMonth = "0" + newEndMonth; }
      var endDay = newStartDay;
      //if (endDay < 10) { endDay = "0" + endDay; }

      var endDate = new Date(newEndYear, newEndMonth, endDay);
      formContext.getAttribute("noc_enddate").setValue(endDate);
  }
 if(formContext.getAttribute("statuscode").getValue() == 181700000) {
   formContext.getControl("noc_workedhours").setVisible(false);
   formContext.getControl("noc_openhours").setVisible(false);
  formContext.getControl("noc_invoicedhours").setVisible(false);
 }

}
OnRemoteChange = function(executionContext) {
  var formContext = executionContext.getFormContext();
  if (formContext.getAttribute("noc_rem").getValue() == true){
    formContext.getControl("noc_city").setVisible(false);
  }
  else {
    formContext.getControl("noc_city").setVisible(true);
  }
 }
OnSave = async function (executionContext) {
    debugger;
  var formContext = executionContext.getFormContext();
    var workedhours = formContext.getAttribute("noc_workedhours").getValue();
    if (workedhours == null) { formContext.getAttribute("noc_workedhours").setValue(0); }
    var openhours = formContext.getAttribute("noc_openhours").getValue();
    if (openhours == null) { formContext.getAttribute("noc_openhours").setValue(0); }
    var esthrs = formContext.getAttribute("noc_esthrs").getValue();
    if (esthrs == null) { formContext.getAttribute("noc_esthrs").setValue(0); }
    var estallowances = formContext.getAttribute("noc_estallowances").getValue();
    if (estallowances == null) { formContext.getAttribute("noc_estallowances").setValue(0); }
    var actallowances = formContext.getAttribute("noc_actallowances").getValue();
    if (actallowances == null) { formContext.getAttribute("noc_actallowances").setValue(0); }
    var estcost = formContext.getAttribute("noc_estcost").getValue();
    if (estcost == null) { formContext.getAttribute("noc_estcost").setValue(0); }
    var actcost = formContext.getAttribute("noc_actcost").getValue();
    if (actcost == null) {formContext.getAttribute("noc_actcost").setValue(0); }
    var estrevenue = formContext.getAttribute("noc_estrevenue").getValue();
    if (estrevenue == null) { formContext.getAttribute("noc_estrevenue").setValue(0); }
    var hourlyfee = formContext.getAttribute("noc_hourlyfee").getValue();
    if (hourlyfee == null) { formContext.getAttribute("noc_hourlyfee").setValue(0); }
    var actprofit = formContext.getAttribute("noc_actprofit").getValue();
    if (actprofit == null) { formContext.getAttribute("noc_actprofit").setValue(0); }
    var estprofit = formContext.getAttribute("noc_estprofit").getValue();
    if (estprofit == null) { formContext.getAttribute("noc_estprofit").setValue(0); }

    var invoicedhours = 0;
    var Id = formContext.data.entity.getId().replace("{", "").replace("}", "");
    var InvoicedTimes = await getInvoicedTimeReportsByAssignment(Id);
    if (InvoicedTimes.noc_hours != undefined) {
        formContext.getAttribute("noc_invoicedhours").setValue(InvoicedTimes[0].noc_hours);
        invoicedhours = InvoicedTimes[0].noc_hours;
    }
    else {
        formContext.getAttribute("noc_invoicedhours").setValue(0);
    }

    var remhrs = esthrs - (invoicedhours + workedhours);
    formContext.getAttribute("noc_remhrs").setValue(remhrs);
    var actrevenue = invoicedhours * hourlyfee;
    formContext.getAttribute("noc_actrevenue").setValue(actrevenue);
    var actprofit = actrevenue - actcost;
    formContext.getAttribute("noc_actprofit").setValue(actprofit);
 }
CreateInvoiceFromAssignment = async function (executionContext) {
    debugger;
    var flowURL = "https://prod-01.westeurope.logic.azure.com:443/workflows/b435a6cb5f704a0e856510adab9d860c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=r4DBUytbdfW5KeaaM0qUhTFavBBmoFGBWZc9ne5U2Pc=";
    var formContext = executionContext;
    var message = "Invoice created for " + formContext.getAttribute("noc_name").getValue();
    var businessUnitLookup = formContext.getAttribute("noc_businessunit").getValue();
    var Id = businessUnitLookup[0].id;
    var flowURL = "https://prod-01.westeurope.logic.azure.com:443/workflows/b435a6cb5f704a0e856510adab9d860c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=r4DBUytbdfW5KeaaM0qUhTFavBBmoFGBWZc9ne5U2Pc";
    callFlow(executionContext, Id, message, flowURL);
}
newInvoice = async function(formContext) {
var ourRef = "Nicklas Olsson";
  var dataCreate = {
    "noc_customer": formContext.getAttribute("noc_assignmentcustomer").getValue(),
    //"noc_businessunit": formContext.getAttribute("noc_businessunit").getValue(),
    "noc_ourreference": ourRef,
    "noc_yourreference": formContext.getAttribute("noc_consultantbrokercontact").getValue().noc_name,
    "noc_invoicedate": new Date(),
    "noc_duedate": new Date() + 30
    /*"noc_paymentterms": formContext.getAttribute("noc_paymentterms").getValue(),*/
    //"noc_email": formContext.getAttribute("noc_email").getValue(),
    //"noc_emailcc": formContext.getAttribute("noc_emailcc").getValue(),
    //"noc_remarks": formContext.getAttribute("noc_remarks").getValue(),
    //"noc_currency": formContext.getAttribute("noc_currency").getValue()
  }
  var newRecord = createRecord("noc_faktura", dataCreate);
  return newRecord;
 }

OnChange = function(executionContext) {
    debugger;
    var formContext = executionContext.getFormContext();

    var startDate = formContext.getAttribute("noc_startdate").getValue();
    var endDate = formContext.getAttribute("noc_enddate").getValue();
    var hourlyFee = formContext.getAttribute("noc_hourlyfee").getValue();
    if (startDate != null && endDate != null && hourlyFee != null) {
        var DayValue = 1000 * 60 * 60 * 24;
        var days = Math.ceil((endDate.getTime() - startDate.getTime()) / DayValue);
        var estRevenue = (days * hourlyFee) * 8;
        formContext.getAttribute("noc_estrevenue").setValue(estRevenue);
    }
    var scope = formContext.getAttribute("noc_scope").getValue();
    var monthlyHrs = 0;
    switch (scope) {
        case 181700000:
            monthlyHrs = 42;
            break;
        case 181700001:
            monthlyHrs = 84;
            break;
        case 181700002:
            monthlyHrs = 126;
            break;
        case 181700003:
            monthlyHrs = 168;
            break;
        default:
            monthlyHrs = 18;
    }
    formContext.getAttribute("noc_monthlyhrs").setValue(monthlyHrs);
}
