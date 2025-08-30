// Common - Filter
filterEmployeeContacts = function (executionContext) {
  var customerContactFilter = "<filter type='or'><condition attribute='crm_contacttype' operator='eq' value='171060000' /><condition attribute='crm_contacttype' operator='eq' value='181700000' /></filter>";
  var formContext = executionContext.getFormContext();
  formContext.getControl("noc_consultant").addCustomFilter(customerContactFilter, "contact");
 }

// Common - Date
getDate = function(formContext) {
   var dateValue = formContext.getAttribute("noc_date").getValue();
   if (dateValue == null) { return null; }
   var dateFieldValue = new Date(dateValue);
   var year = dateFieldValue.getFullYear();
   var month = (dateFieldValue.getMonth() + 1);
   if (month < 10) {month = "0" + month;}
   var day = dateFieldValue.getDate();
   if (day < 10) {day = "0" + day;}
   return [year, month, day];
  }
extractDate = function(dateValue) {
     if (dateValue == null) { return null; }
     var dateFieldValue = new Date(dateValue);
     var year = dateFieldValue.getFullYear();
     var month = (dateFieldValue.getMonth() + 1);
     if (month < 10) {month = "0" + month;}
     var day = dateFieldValue.getDate();
     if (day < 10) {day = "0" + day;}
     return [year, month, day];
    }

//Monthly Time Report
getMonthlyTimeReport = function(employee, period) {
  var fetchXML =
  "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
  "<entity name = 'noc_monthlytimereport' >" +
    "<attribute name='noc_monthlytimereportid' />" +
    "<filter type='and'>" +
    "<condition attribute='noc_employee' operator='eq' value=" + "'" + employee + "'" + "/>" +
    "<condition attribute='noc_period' operator='eq' value=" + "'" + period + "'" + "/>" +
    "</filter>" +
  "</entity>" +
  "</fetch>"
  FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
  result = retrieveMultipleRecords("noc_monthlytimereport", FetchXML)
  return result;
 }

// Assignment
getAssignment = function(Id){
  var fetchXML =
   "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
   "<entity name = 'noc_assignment' >" +
   "<all-attributes />" +
   "<filter>" +
   "<condition attribute='noc_assignmentid' operator='eq' value=" + "'" + Id + "'" + "/>" +
   "</filter>" +
   "</entity>" +
   "</fetch>"
   FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
   result = retrieveMultipleRecords("noc_assignment", FetchXML)
   return result;
  }
getAssignmentConsultants = function(Id){
  var fetchXML =
   "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
   "<entity name = 'noc_employee'>" +
   "<all-attributes />" +
   "<filter />" +
   "<link-entity name='noc_noc_assignment_noc_employee' from='noc_employeeid' to='noc_employeeid' intersect='true'>" +
   "<attribute name='noc_noc_assignment_noc_employeeid' />" +
   "<filter>" +
   "<condition attribute='noc_assignmentid' operator='eq' value=" + "'" + Id + "'" + "/>" +
   "</filter>" +
   "</link-entity>" +
   "</entity>" +
   "</fetch>"
   FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
   result = retrieveMultipleRecords("noc_employee", FetchXML)
   return result;
  }



// Invoice Numbering
updateInvoiceNumber = function (id, nextnumber, latestnumber) {
 var dataUpdate = {
     "noc_number": nextnumber,
     "noc_latestinvoicenumber" : latestnumber
 }
   updateRecord("noc_setting", id, dataUpdate);
}

getInvoiceNumber = function(businessunit) {
 var fetchXML =
 "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
     "<entity name = 'noc_setting' >" +
   "<attribute name='noc_settingid' />" +
   "<attribute name='noc_number' />" +
   "<attribute name='noc_latestinvoicenumber' />" +
   "<attribute name='noc_prefix' />" +
   "<attribute name='noc_invoicenumberinglength' />" +
   "<attribute name='noc_suffix' />" +
   "<filter type='and'>" +
   "<condition attribute='noc_businessunit' operator='eq' value=" + "'" + businessunit + "'" + "/>" +
   "</filter>" +
 "</entity>" +
 "</fetch>"
 FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
    result = retrieveMultipleRecords("noc_setting", FetchXML)
 return result;
}

 createInvoiceNumber = function(invoiceNumber) {
   if (invoiceNumber != null) {
       var calcNumber = parseInt(invoiceNumber[0].noc_number) + 1;
     var stringNumber = calcNumber.toString();
       var estLength = invoiceNumber[0].noc_invoicenumberinglength;
     var currentLength = stringNumber.length;
     var diff = estLength - currentLength;
     var newNumber = "0";
    if (newNumber.length < diff) {
        newNumber += '0'.repeat(diff - newNumber.length);
    }
    newNumber = newNumber + stringNumber;
    var newInvoiceNumber = "";
       if (invoiceNumber[0].noc_prefix != null && invoiceNumber[0].noc_suffix != null) {
           newInvoiceNumber = invoiceNumber[0].noc_prefix + "-" + newNumber + "-" + invoiceNumber[0].noc_suffix;
       }
       else if (invoiceNumber[0].noc_prefix != null) {
           newInvoiceNumber = invoiceNumber[0].noc_prefix + "-" + newNumber;
       }
       else if (invoiceNumber[0].noc_suffix != null) {
           newInvoiceNumber = newNumber + "-" + invoiceNumber[0].noc_suffix;
       }
       else {
           newInvoiceNumber = newNumber;
       }

   }
   return newInvoiceNumber;
 }

 // Invoice Line
getInvoiceLineInvoice = function(Id) {
  var fetchXML =
  "<fetch version='1.0' output-format='xml-platform' mapping='logical' aggregate='true'>" +
  "<entity name = 'noc_invoiceline' >" +
    "<attribute name='noc_invoice' alias='noc_invoice' groupby='true' />" +
    "<attribute name='noc_linetotal' alias='noc_linetotal' aggregate='sum' />" +
    "<attribute name='noc_tax' alias='noc_tax' aggregate='sum' />" +
    "<filter>" +
    "<condition attribute='noc_invoice' operator='eq' value=" + "'" + Id + "'" + "/>" +
    "</filter>" +
  "</entity>" +
  "</fetch>"
  FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
  result = retrieveMultipleRecords("noc_invoiceline", FetchXML)
  return result;
 }
getInvoiceLine = function(Id) {
   var fetchXML =
   "<fetch version='1.0' output-format='xml-platform' mapping='logical' >" +
   "<entity name = 'noc_invoiceline' >" +
     "<all-attributes />" +
     "<filter>" +
     "<condition attribute='noc_invoicelineid' operator='eq' value=" + "'" + Id + "'" + "/>" +
     "</filter>" +
   "</entity>" +
   "</fetch>"
   FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
   result = retrieveMultipleRecords("noc_invoiceline", FetchXML)
   return result;
  }
getInvoiceLineNumber = function(Id) {
  var fetchXML =
  "<fetch version='1.0' output-format='xml-platform' mapping='logical' aggregate='true' >" +
  "<entity name = 'noc_invoiceline' >" +
    "<attribute name='noc_ln' alias='noc_ln' aggregate='max' />" +
    "<filter>" +
    "<condition attribute='noc_invoice' operator='eq' value=" + "'" + Id + "'" + "/>" +
    "</filter>" +
  "</entity>" +
  "</fetch>"
  FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
  result = retrieveMultipleRecords("noc_invoiceline", FetchXML)
  return result;
 }

// Invoice
getNewInvoice = function(Id) {
  var fetchXML =
  "<fetch version='1.0' output-format='xml-platform' mapping='logical' >" +
  "<entity name = 'noc_faktura' >" +
  "<attribute name='noc_fakturaid' />" +
  "<filter>" +
  "<condition attribute='noc_ourreference' operator='eq' value=" + "'" + Id + "'" + "/>" +
  "</filter>" +
  "<order attribute='createdon' descending='true' />" +
  "</entity>" +
  "</fetch>"
  FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
  result = retrieveMultipleRecords("noc_faktura", FetchXML)
  return result;
 }

 getOpenInvoice = function(Id) {
   var fetchXML =
   "<fetch version='1.0' output-format='xml-platform' mapping='logical' >" +
   "<entity name = 'noc_faktura' >" +
   "<attribute name='noc_fakturaid' />" +
   "<filter type='and'>" +
   "<condition attribute='noc_assignment' operator='eq' value=" + "'" + Id + "'" + "/>" +
   "<condition attribute='statuscode' operator='eq' value='1' />" +
   "</filter>" +
   "</entity>" +
   "</fetch>"
   FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
   result = retrieveMultipleRecords("noc_faktura", FetchXML)
   return result;
  }
  getOpenInvoiceLine = function(Id) {
    var fetchXML =
    "<fetch version='1.0' output-format='xml-platform' mapping='logical' >" +
    "<entity name = 'noc_invoiceline' >" +
    "<all-attributes />" +
    "<filter>" +
    "<condition attribute='noc_invoice' operator='eq' value=" + "'" + Id + "'" + "/>" +
    "</filter>" +
    "</entity>" +
    "</fetch>"
    FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
    result = retrieveMultipleRecords("noc_invoiceline", FetchXML)
    return result;
   }

// Month
getMonth = function(consultant, period, assignment){
 var fetchXML =
  "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
  "<entity name = 'noc_month' >" +
  "<attribute name='noc_name' />" +
  "<attribute name='noc_monthid' />" +
  "<filter type='and'>" +
  "<condition attribute='noc_employee' operator='eq' value=" + "'" + consultant + "'" + "/>" +
  "<condition attribute='noc_period' operator='eq' value=" + "'" + period + "'" + "/>" +
  "<condition attribute='noc_assignment' operator='eq' value=" + "'" + assignment + "'" + "/>" +
  "</filter>" +
  "</entity>" +
  "</fetch>"
  FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
  result = retrieveMultipleRecords("noc_month", FetchXML)
  return result;
 }
 getNewMonth = function(id) {
   var fetchXML =
   "<fetch version='1.0' output-format='xml-platform' mapping='logical' >" +
   "<entity name = 'noc_month' >" +
   "<all-attributes />" +
   "<filter>" +
   "<condition attribute='noc_timeid' operator='eq' value=" + "'" + id + "'" + "/>" +
   "</filter>" +
   "<order attribute='createdon' descending='true' />" +
   "</entity>" +
   "</fetch>"
   FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
   result = retrieveMultipleRecords("noc_month", FetchXML)
   return result;
  }

// Time
getTime = function(Id) {
    var fetchXML =
    "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
    "<entity name = 'noc_time' >" +
      "<attribute name='noc_date' />" +
      "<attribute name='noc_hours' />" +
      "<attribute name='noc_absencehours' />" +
      "<filter>" +
      "<condition attribute='noc_salary' operator='eq' value=" + "'" + Id + "'" + "/>" +
      "</filter>" +
    "</entity>" +
    "</fetch>"
    FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
    result = retrieveMultipleRecords("noc_time", FetchXML)
    return result;
   }
getInvoiceLineTimes= function(Id) {
    var fetchXML =
    "<fetch version='1.0' output-format='xml-platform' mapping='logical' aggregate='true'>" +
    "<entity name = 'noc_time' >" +
      "<attribute name='noc_hours' alias='noc_hours' aggregate='sum' />" +
      "<filter>" +
      "<condition attribute='noc_invoiceline' operator='eq' value=" + "'" + Id + "'" + "/>" +
      "</filter>" +
    "</entity>" +
    "</fetch>"
    FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
    result = retrieveMultipleRecords("noc_time", FetchXML)
    return result;
   }

// Time Report
getTimeReport = function(Id) {
  var fetchXML =
  "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
  "<entity name = 'crm_timereport' >" +
    "<attribute name='crm_date' />" +
    "<attribute name='crm_type' />" +
    "<attribute name='crm_sick' />" +
    "<attribute name='crm_workinghours' />" +
    "<attribute name='crm_absencehours' />" +
    "<filter>" +
    "<condition attribute='noc_salary' operator='eq' value=" + "'" + Id + "'" + "/>" +
    "</filter>" +
  "</entity>" +
  "</fetch>"
  FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
  result = retrieveMultipleRecords("crm_timereport", FetchXML)
  return result;
 }
getTimeReportHours = function(Id) {
  var fetchXML =
  "<fetch version='1.0' output-format='xml-platform' mapping='logical' aggregate='true'>" +
  "<entity name = 'noc_time' >" +
    "<attribute name='noc_assignment' alias='noc_assignment' groupby='true' />" +
    "<attribute name='noc_hours' alias='noc_hours' aggregate='sum' />" +
    "<filter type='and'>" +
    "<condition attribute='noc_assignment' operator='eq' value=" + "'" + Id + "'" + "/>" +
    "<condition attribute='statuscode' operator='eq' value='1' />" +
    "</filter>" +
  "</entity>" +
  "</fetch>"
  FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
  result = retrieveMultipleRecords("noc_time", FetchXML)
  return result;
  }
getTimeReportHoursByMonth = function(Id) {
    var fetchXML =
    "<fetch version='1.0' output-format='xml-platform' mapping='logical' aggregate='true'>" +
    "<entity name = 'noc_time' >" +
      "<attribute name='noc_month' alias='noc_month' groupby='true' />" +
      "<attribute name='noc_hours' alias='noc_hours' aggregate='sum' />" +
      "<filter>" +
      "<condition attribute='noc_month' operator='eq' value=" + "'" + Id + "'" + "/>" +
      "</filter>" +
    "</entity>" +
    "</fetch>"
    FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
    result = retrieveMultipleRecords("noc_time", FetchXML)
    return result;
    }
getInvoicedTimeReports = function(Id) {
   var fetchXML =
   "<fetch version='1.0' output-format='xml-platform' mapping='logical' aggregate='true'>" +
   "<entity name = 'noc_time' >" +
     "<attribute name='noc_assignment' alias='noc_assignment' groupby='true' />" +
     "<attribute name='noc_hours' alias='noc_hours' aggregate='sum' />" +
     "<filter type='and'>" +
     "<condition attribute='noc_assignment' operator='eq' value=" + "'" + Id + "'" + "/>" +
     "<condition attribute='statuscode' operator='eq' value='181700000' />" +
     "</filter>" +
   "</entity>" +
   "</fetch>"
   FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
   result = retrieveMultipleRecords("noc_time", FetchXML)
   return result;
   }
getInvoicedTimeReportsByMonth = function(Id) {
      var fetchXML =
      "<fetch version='1.0' output-format='xml-platform' mapping='logical' aggregate='true'>" +
      "<entity name = 'noc_time' >" +
        "<attribute name='noc_month' alias='noc_month' groupby='true' />" +
        "<attribute name='noc_hours' alias='noc_hours' aggregate='sum' />" +
        "<filter type='and'>" +
        "<condition attribute='noc_month' operator='eq' value=" + "'" + Id + "'" + "/>" +
        "<condition attribute='statuscode' operator='eq' value='181700000' />" +
        "</filter>" +
      "</entity>" +
      "</fetch>"
      FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
      result = retrieveMultipleRecords("noc_time", FetchXML)
      return result;
}
getInvoicedTimeReportsByAssignment = function (Id) {
    var fetchXML =
        "<fetch version='1.0' output-format='xml-platform' mapping='logical' aggregate='true'>" +
        "<entity name = 'noc_time' >" +
        "<attribute name='noc_hours' alias='noc_hours' aggregate='sum' />" +
        "<filter type='and'>" +
        "<condition attribute='noc_assignment' operator='eq' value=" + "'" + Id + "'" + "/>" +
        "<condition attribute='noc_invoiced' operator='eq' value='1'/>" +
        "</filter>" +
        "<filter type='or'>" +
        "<condition attribute='statuscode' operator='eq' value='181700000' />" +
        "<condition attribute='statuscode' operator='eq' value='181700001' />" +
        "</filter>" +
        "</entity>" +
        "</fetch>"
    FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
    result = retrieveMultipleRecords("noc_time", FetchXML)
    return result;
}

// Period
getPeriod = function(year, month){
  var fetchXML =
   "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
   "<entity name = 'crm_period' >" +
   "<attribute name='crm_name' />" +
   "<attribute name='crm_periodid' />" +
   "<filter type='and'>" +
   "<condition attribute='crm_year' operator='eq' value=" + "'" + year + "'" + "/>" +
   "<condition attribute='crm_month' operator='eq' value=" + "'" + month + "'" + "/>" +
   "</filter>" +
   "</entity>" +
   "</fetch>"
   FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
   result = retrieveMultipleRecords("crm_period", FetchXML)
   return result;
}


// Employee
getEmployee = function(Id){
 var fetchXML =
  "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
  "<entity name = 'noc_employee' >" +
  "<all-attributes />" +
  "<filter>" +
  "<condition attribute='noc_employeeid' operator='eq' value=" + "'" + Id + "'" + "/>" +
  "</filter>" +
  "</entity>" +
  "</fetch>"
  FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
  result = retrieveMultipleRecords("noc_employee", FetchXML)
  return result;
 }

 // Employee-Assignment
 getEmployeeAssignment = function(Id){
  var fetchXML =
   "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
   "<entity name = 'noc_noc_assignment_noc_employee' >" +
   "<all-attributes />" +
   "<filter>" +
   "<condition attribute='noc_assignmentid' operator='eq' value=" + "'" + Id + "'" + "/>" +
   "</filter>" +
   "</entity>" +
   "</fetch>"
   FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
   result = retrieveMultipleRecords("noc_noc_assignment_noc_employee", FetchXML)
   return result;
  }


// Skattetabell
getSkattetabell = function(lon, ar, tab) {
    var fetchXML =
    "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
    "<entity name = 'noc_skattetabell' >" +
      "<attribute name='noc_kol1' />" +
      "<attribute name='noc_kol2' />" +
      "<attribute name='noc_kol3' />" +
      "<attribute name='noc_kol4' />" +
      "<attribute name='noc_kol5' />" +
      "<attribute name='noc_kol6' />" +
      "<attribute name='noc_kol1perc' />" +
      "<attribute name='noc_kol2perc' />" +
      "<attribute name='noc_kol3perc' />" +
      "<attribute name='noc_kol4perc' />" +
      "<attribute name='noc_kol5perc' />" +
      "<attribute name='noc_kol6perc' />" +
      "<filter type='and'>" +
      "<condition attribute='noc_lonfran' operator='le' value=" + "'" + lon + "'" + "/>" +
      "<condition attribute='noc_lontill' operator='ge' value=" + "'" + lon + "'" + "/>" +
      "<condition attribute='noc_ar' operator='eq' value=" + "'" + ar + "'" + "/>" +
      "<condition attribute='noc_tabell' operator='eq' value=" + "'" + tab + "'" + "/>" +
      "</filter>" +
    "</entity>" +
    "</fetch>"
    FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
    result = retrieveMultipleRecords("noc_skattetabell", FetchXML)
    return result;
   }

// Business Unit
getBusinessUnit = function(Id){
   var fetchXML =
    "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
    "<entity name = 'businessunit' >" +
    "<attribute name='businessunitid' />" +
    "<attribute name='name' />" +
    "<filter>" +
    "<condition attribute='businessunitid' operator='eq' value=" + "'" + Id + "'" + "/>" +
    "</filter>" +
    "</entity>" +
    "</fetch>"
    FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
    result = retrieveMultipleRecords("businessunit", FetchXML)
    return result;
   }

// Salary
getSalary = function(employee, period){
  var fetchXML =
   "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
   "<entity name = 'noc_salary' >" +
   "<attribute name='noc_name' />" +
   "<attribute name='noc_salaryid' />" +
   "<filter type='and'>" +
   "<condition attribute='noc_employee' operator='eq' value=" + "'" + employee + "'" + "/>" +
   "<condition attribute='noc_period' operator='eq' value=" + "'" + period + "'" + "/>" +
   "</filter>" +
   "</entity>" +
   "</fetch>"
   FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
   result = retrieveMultipleRecords("noc_salary", FetchXML)
   return result;
  }

// Salary Line
getNextSalaryLineNo = function(Id) {
   var fetchXML =
   "<fetch version='1.0' output-format='xml-platform' mapping='logical' aggregate='true'>" +
   "<entity name = 'noc_salaryline' >" +
     "<attribute name='noc_no' aggregate='max' alias='noc_no'/>" +
     "<filter>" +
     "<condition attribute='noc_salaryid' operator='eq' value=" + "'" + Id + "'" + "/>" +
     "</filter>" +
   "</entity>" +
   "</fetch>"
   FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
   result = retrieveMultipleRecords("noc_salaryline", FetchXML)
   return result;
}

getSalaryLines = function (Id) {
    var fetchXML =
        "<fetch version='1.0' output-format='xml-platform' mapping='logical' aggregate='true'>" +
        "<entity name = 'noc_salaryline' >" +
        "<attribute name='noc_sum' alias='noc_sum' aggregate='sum' />" +
        "<filter >" +
        "<condition attribute='noc_salaryid' operator='eq' value=" + "'" + Id + "'" + "/>" +
        "</filter>" +
        "</entity>" +
        "</fetch>"
    FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
    result = retrieveMultipleRecords("noc_salaryline", FetchXML)
    return result;
}

// Salary Line Type
getSalaryLineType = function(Id) {
  var fetchXML =
  "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
  "<entity name = 'noc_salarylinetype' >" +
    "<attribute name='noc_enhet' />" +
      "<attribute name='noc_benamning' />" +
      "<attribute name='noc_loneart' />" +
    "<filter>" +
    "<condition attribute='noc_salarylinetypeid' operator='eq' value=" + "'" + Id
     + "'" + "/>" +
    "</filter>" +
  "</entity>" +
  "</fetch>"
  FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
  result = retrieveMultipleRecords("noc_salarylinetype", FetchXML)
  return result;
 }

// Account
getAccount = function(Id) {
  var fetchXML =
  "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
  "<entity name = 'account' >" +
    "<all-attributes />" +
    "<filter>" +
    "<condition attribute='accountid' operator='eq' value=" + "'" + Id + "'" + "/>" +
      "</filter>" +
  "</entity>" +
  "</fetch>"
  FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
  result = retrieveMultipleRecords("account", FetchXML)
  return result;
}

getAccountPrimaryContact = function (Id) {
    var fetchXML =
        "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
        "<entity name = 'account' >" +
        "<all-attributes />" +
        "<filter>" +
        "<condition attribute='accountid' operator='eq' value=" + "'" + Id + "'" + "/>" +
        "</filter>" +
        "<link-entity name = 'contact' from = 'contactid' to = 'primarycontactid' link-type='outer' alias = 'primarycontact' >" +
          "<attribute name='fullname' />" +
        "</link-entity >" +
        "</entity>" +
        "</fetch>"
    FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
    result = retrieveMultipleRecords("account", FetchXML)
    return result;
}

// Contact
getContact = function (Id) {
    var fetchXML =
        "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
        "<entity name = 'contact' >" +
        "<all-attributes />" +
        "<filter>" +
        "<condition attribute='contactid' operator='eq' value=" + "'" + Id + "'" + "/>" +
        "</filter>" +
        "</entity>" +
        "</fetch>"
    FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
    result = retrieveMultipleRecords("contact", FetchXML)
    return result;
}

// Liquidity
getLatestLiquidity = function (year, month) {
    var fetchXML =
        "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
        "<entity name = 'noc_liquidity' >" +
        "<all-attributes />" +
        "<filter>" +
        "<condition attribute='noc_month' operator='eq' value=" + "'" + month + "'" + "/>" +
        "<condition attribute='noc_year' operator='eq' value=" + "'" + year + "'" + "/>" +
        "</filter>" +
        "</entity>" +
        "</fetch>"
    FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
    result = retrieveMultipleRecords("noc_liquidity", FetchXML)
    return result;
}

// Setting
getSetting = function () {
    var fetchXML =
        "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
        "<entity name = 'noc_setting' >" +
        "<all-attributes />" +
        "</entity>" +
        "</fetch>"
    FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
    result = retrieveMultipleRecords("noc_setting", FetchXML)
    return result;
}

// Common - Retrieve, Update, Create
retrieveMultipleRecords = async function (entityName, options) {
    var entityCollection = null;
    try {
        await Xrm.WebApi.retrieveMultipleRecords(entityName, options).then(
            function success(result) {
                if (result.entities.length > 0) {
                    entityCollection = result.entities;
                }
            },
            function (error) { }
        );
    }
    catch (e) { alert(e); }
    return entityCollection;
 }

updateRecord = async function (entityName, id, options) {
   var entityCollection = null;
   try {
       await Xrm.WebApi.updateRecord(entityName, id, options).then(
           function success(result) {
           },
           function (error) { }
       );
   }
   catch (e) { alert(e); }
   return entityCollection;
 }

createRecord = async function (entityName, options) {
      var entityCollection = null;
      try {
          await Xrm.WebApi.createRecord(entityName, options).then(
              function success(result) {
                  return result;
              },
              function (error) { }
          );
      }
      catch (e) { alert(e); }
      return result;
 }
 // Flows
callFlow = function (executionContext, Id, SuccesMessage, flowURL) {
    debugger;
    var formContext = executionContext;
    //var flowURL = "https://prod-01.westeurope.logic.azure.com:443/workflows/b435a6cb5f704a0e856510adab9d860c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=r4DBUytbdfW5KeaaM0qUhTFavBBmoFGBWZc9ne5U2Pc";
    var input = JSON.stringify({
        "guid": formContext.data.entity.getId().replace("{", "").replace("}", ""),
        "id": Id
    });


    var req = new XMLHttpRequest();
    req.open("POST", flowURL, true);
    req.setRequestHeader('Content-Type', 'application/json');

    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                var result = this.response;
                formContext.data.refresh(true).then(
                    function (success) {
                        console.log("success");
                    }, function (error) {
                        debugger;
                    });
                alert(SuccesMessage);
            }
            else if (this.status === 400) {
                alert(this.statusText);
                var result = this.response;
                alert("Error " + result);
            }
        }
    };
    req.send(input);
}

// Follower
getLatestFollower = function () {
    var fetchXML =
        "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
        "<entity name = 'noc_follower' >" +
        "<all-attributes />" +
        "<order attribute='noc_year' descending='true' />" +
        "<order attribute='noc_week' descending='true' />" +
        "</entity>" +
        "</fetch>"
    FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
    result = retrieveMultipleRecords("noc_follower", FetchXML)
    return result;
}

// Purchase Product
getPurchaseProductPrice = function (product) {
  var fetchXML =
    "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
    "<entity name = 'noc_cfproduct' >" +
    "<all-attributes />" +
    "<filter>" +
    "<condition attribute='noc_cfproductid' operator='eq' value=" + "'" + product + "'" + "/>" +
    "</filter>" +
    "</entity>" +
    "</fetch>"
FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
result = retrieveMultipleRecords("noc_cfproduct", FetchXML)
return result;
}

// Business Unit
getBusinessUnit = function (businessUnitName) {
    var fetchXML =
        "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
        "<entity name = 'businessunit' >" +
        "<all-attributes />" +
        "<filter>" +
        "<condition attribute='name' operator='eq' value=" + "'" + businessUnitName + "'" + "/>" +
        "</filter>" +
        "</entity>" +
        "</fetch>"
    FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
    result = retrieveMultipleRecords("businessunit", FetchXML)
    return result;
}

// Membership
getMembership = function (customerId) {
    var fetchXML =
        "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
        "<entity name = 'noc_membership' >" +
        "<all-attributes />" +
        "<filter>" +
        "<condition attribute='noc_customer' operator='eq' value=" + "'" + customerId + "'" + "/>" +
        "</filter>" +
        "</entity>" +
        "</fetch>"
    FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
    result = retrieveMultipleRecords("noc_membership", FetchXML)
    return result;
}

// Chocolate Products
getChocolateProducts = function (productionSheet, location) {
    var fetchXML =
        "<fetch version='1.0' output-format='xml-platform' mapping='logical'  aggregate='true'>" +
        "<entity name = 'noc_chocolateproduction' >" +
        "<attribute name='noc_qty' alias='noc_qty' aggregate='sum' />" +
        "<filter>" +
        "<condition attribute='noc_productionsheet' operator='eq' value=" + "'" + productionSheet + "'" + "/>" +
        "<condition attribute='noc_productlocation' operator='eq' value=" + "'" + location + "'" + "/>"+
        "</filter>" +
        "</entity>" +
        "</fetch>"
    FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
    result = retrieveMultipleRecords("noc_chocolateproduction", FetchXML)
    return result;
}

// Time Activity
getTimeActivity = function (Id) {
    var fetchXML =
        "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
        "<entity name = 'noc_timeactivity' >" +
        "<all-attributes />" +
        "<filter>" +
        "<condition attribute='noc_timeactivityid' operator='eq' value=" + "'" + Id + "'" + "/>" +
        "</filter>" +
        "</entity>" +
        "</fetch>"
    FetchXML = "?fetchXml=" + encodeURIComponent(fetchXML);
    result = retrieveMultipleRecords("noc_timeactivity", FetchXML)
    return result;
}