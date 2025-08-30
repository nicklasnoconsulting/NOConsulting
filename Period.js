OnSave = function(executionContext) {
  var formContext = executionContext.getFormContext();

  if(formContext.ui.getFormType() == 1) { //Create
    var year = formContext.getAttribute("crm_year").getValue();
    var month = formContext.getAttribute("crm_month").getValue();
    formContext.getAttribute("crm_name").setValue(year + "-" + month);
  }
  else {
    formContext.getControl("crm_name").setDisabled(true);
    formContext.getControl("crm_year").setDisabled(true);
    formContext.getControl("crm_month").setDisabled(true);
  }
 }
OnLoad = function(executionContext) {
  var formContext = executionContext.getFormContext();
  if(formContext.ui.getFormType() != 1) { //Create
    var formContext = executionContext.getFormContext();
    formContext.getControl("crm_name").setDisabled(true);
    formContext.getControl("crm_year").setDisabled(true);
    formContext.getControl("crm_month").setDisabled(true);
  }
 }
