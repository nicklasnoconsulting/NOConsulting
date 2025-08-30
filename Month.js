OnLoad = async function(executionContext) {
  var formContext = executionContext.getFormContext();
  //formContext.getControl("noc_consultant").addPreSearch(filterEmployeeContacts);
  var Id = formContext.data.entity.getId().replace("{", "").replace("}", "");
  //var timeReportHours = await getTimeReportHoursByMonth(Id);
  //if (timeReportHours != null) {
  //  formContext.getAttribute("noc_workedhours").setValue(timeReportHours[0].noc_hours)
  //}
  //var invoicedTimeReports = await getInvoicedTimeReportsByMonth(Id);
  //if (invoicedTimeReports != null) {
  //  formContext.getAttribute("noc_invoicedhours").setValue(invoicedTimeReports[0].noc_hours)
  //}
  if (formContext.getAttribute("noc_invoice").getValue() == true) {
    formContext.ui.tabs.get("MonthTab").sections.get("InvoiceSection").setVisible(true);
  }
  else {
    formContext.ui.tabs.get("MonthTab").sections.get("InvoiceSection").setVisible(false);
  }
 }
SetManualAdjustment = function(executionContext) {
  var formContext = executionContext.getFormContext();
  if(formContext.getAttribute("noc_manualadjustment").getValue() == false){
    formContext.ui.tabs.get("EmployeeTab").sections.get("ManualAdjustmentsSection").setVisible(false);
    formContext.getControl("noc_workinghours").setDisabled(true);
    formContext.getControl("noc_absence").setDisabled(true);
    formContext.getControl("noc_salary").setDisabled(true);
    formContext.getControl("noc_salarycalculation").setDisabled(true);
    formContext.getControl("noc_employerfeepercentage").setDisabled(true);
    formContext.getControl("noc_addvacationfee").setDisabled(true);
    formContext.getControl("noc_expenses").setDisabled(true);
  }
  else if(formContext.getAttribute("noc_manualadjustment").getValue() == true) {
    formContext.ui.tabs.get("EmployeeTab").sections.get("ManualAdjustmentsSection").setVisible(true);
    formContext.getControl("noc_workinghours").setDisabled(false);
    formContext.getControl("noc_absence").setDisabled(false);
    formContext.getControl("noc_salary").setDisabled(false);
    formContext.getControl("noc_salarycalculation").setDisabled(false);
    formContext.getControl("noc_employerfeepercentage").setDisabled(false);
    formContext.getControl("noc_addvacationfee").setDisabled(false);
    formContext.getControl("noc_expenses").setDisabled(false);
  }
 }
OnSave = async function(executionContext) {
  var formContext = executionContext.getFormContext();
  if (formContext.getAttribute("noc_manualinvoice").getValue() == false) {
    if (formContext.getAttribute("noc_i1a").getValue() != null && formContext.getAttribute("noc_i1e").getValue() != null) {
      formContext.getAttribute("noc_i1s").setValue(formContext.getAttribute("noc_i1a").getValue() * formContext.getAttribute("noc_i1e").getValue());
    }
    if (formContext.getAttribute("noc_i2a").getValue() != null && formContext.getAttribute("noc_i2e").getValue() != null) {
      formContext.getAttribute("noc_i2s").setValue(formContext.getAttribute("noc_i2a").getValue() * formContext.getAttribute("noc_i2e").getValue());
    }
    if (formContext.getAttribute("noc_i3a").getValue() != null && formContext.getAttribute("noc_i3e").getValue() != null) {
      formContext.getAttribute("noc_i3s").setValue(formContext.getAttribute("noc_i3a").getValue() * formContext.getAttribute("noc_i3e").getValue());
    }
    if (formContext.getAttribute("noc_i1u").getValue() == null && formContext.getAttribute("noc_i1e").getValue() != null) {
      formContext.getAttribute("noc_i1u").setValue("tim");
    }
    if (formContext.getAttribute("noc_i2u").getValue() == null  && formContext.getAttribute("noc_i2e").getValue() != null) {
      formContext.getAttribute("noc_i2u").setValue("tim");
    }
    if (formContext.getAttribute("noc_i3u").getValue() == null  && formContext.getAttribute("noc_i3e").getValue() != null) {
      formContext.getAttribute("noc_i3u").setValue("tim");
    }
    formContext.getAttribute("noc_netamount").setValue(formContext.getAttribute("noc_i1s").getValue() + formContext.getAttribute("noc_i2s").getValue() + formContext.getAttribute("noc_i3s").getValue());
    formContext.getAttribute("noc_tax").setValue(formContext.getAttribute("noc_netamount").getValue() * 0.25);
    formContext.getAttribute("noc_totalamount").setValue(formContext.getAttribute("noc_netamount").getValue() + formContext.getAttribute("noc_tax").getValue());
  }
  var employee = formContext.getAttribute("noc_employee").getValue();
  var assignment = formContext.getAttribute("noc_assignment").getValue();
  var project = formContext.getAttribute("noc_project").getValue();
  var date = formContext.getAttribute("noc_period").getValue();
  if (assignment != null) {
    formContext.getAttribute("noc_name").setValue(employee[0].name + "@" + assignment[0].name + "@" + date[0].name);
  }
  else if (project != null) {
    formContext.getAttribute("noc_name").setValue(employee[0].name + "@" + project[0].name + "@" + date[0].name);
  }
  if(formContext.ui.getFormType() == 1) { //Create
    var businessunit = formContext.getAttribute("noc_businessunit").getValue();
    var currency = formContext.getAttribute("noc_currency").getValue();
    var invoiceNumber = await getInvoiceNumber(businessunit[0].id, currency[0].id);
    if (invoiceNumber != null) {
      var calcNumber = parseInt(invoiceNumber[0].noc_number) + 1;
      var stringNumber = calcNumber.toString();
      var estLength = invoiceNumber[0].noc_length;
      var currentLength = stringNumber.length;
      var diff = estLength - currentLength;
      var newNumber = "0";
      if (newNumber.length < diff) newNumber += '0'.repeat(diff - newNumber.length);
      newNumber = newNumber + stringNumber;
      formContext.getAttribute("noc_invoiceno").setValue(invoiceNumber[0].noc_prefix + "-" + newNumber + "-" + invoiceNumber[0].noc_suffix);
      updateInvoiceNumber(invoiceNumber[0].noc_invoicenumberingid, newNumber);
    }
  }
 }
ChangeInvoice = async function(executionContext) {
  var formContext = executionContext.getFormContext();
  if (formContext.getAttribute("noc_invoice").getValue() == true) {
    formContext.ui.tabs.get("MonthTab").sections.get("InvoiceSection").setVisible(true);
  }
  else {
    formContext.ui.tabs.get("MonthTab").sections.get("InvoiceSection").setVisible(false);
  }
 }
