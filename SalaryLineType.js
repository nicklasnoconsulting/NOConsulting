OnLoad = async function(executionContext) {
  var formContext = executionContext.getFormContext();
  
  var statusCode = formContext.getAttribute("statuscode").getValue();
  if(statusCode == 171060000) { //Sent
    formContext.getControl("noc_salary").setDisabled(true);
    formContext.getControl("noc_salarycalculation").setDisabled(true);
    formContext.getControl("noc_efp").setDisabled(true);
    formContext.getControl("noc_addvacationfee").setDisabled(true);
    formContext.getControl("noc_period").setDisabled(true);
    formContext.getControl("noc_paymentdate").setDisabled(true);
    formContext.getControl("noc_expenses").setDisabled(true);
    formContext.getControl("noc_tax").setDisabled(true);
    formContext.getControl("noc_netdeductions").setDisabled(true);
    formContext.getControl("TimeReports").setDisabled(true);
  }

  formContext.getAttribute("noc_lonn").setValue(formContext.getAttribute("noc_grosssalary").getValue() - formContext.getAttribute("noc_tax").getValue() - formContext.getAttribute("noc_netdeductions").getValue() + formContext.getAttribute("noc_expenses").getValue());
 }
OnSave = async function(executionContext) {
 }

