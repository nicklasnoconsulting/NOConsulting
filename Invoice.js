OnLoad = async function(executionContext) {
debugger;
  var formContext = executionContext.getFormContext();
  var statuscode = formContext.getAttribute("statuscode").getValue();
  var formType = formContext.ui.getFormType();
  var dueDate = formContext.getAttribute("noc_duedate").getValue();
  var now = new Date();

  if (formType == 1) {
    formContext.getAttribute("noc_subtotal").setValue(0);
    formContext.getAttribute("noc_tax").setValue(0);
      formContext.getAttribute("noc_total").setValue(0);
      var userSettings = Xrm.Utility.getGlobalContext().userSettings;
      var userName = userSettings.userName;
      var setting = await getSetting();
      if (setting != null) {
          if (setting[0].noc_ourreference == 1) {
              formContext.getAttribute("noc_ourreference").setValue(setting[0].noc_ourreferencevalue);
          }
          else if (setting[0].noc_ourreference == 0) {
              formContext.getAttribute("noc_ourreference").setValue(userName);
          }
          if (setting[0].noc_yourreference == 1) {
              formContext.getAttribute("noc_yourreference").setValue(setting[0].noc_yourreferencevalue);
          }
      }
  }
    if (formType != 1) {
        formContext.getControl("noc_invoiceno").setDisabled(true);
    }
  if (statuscode != 1 && formType != 1) {
    formContext.getControl("noc_invoiceno").setDisabled(true);
    formContext.getControl("noc_manualinvoice").setDisabled(true);
    formContext.getControl("noc_customer").setDisabled(true);
    formContext.getControl("noc_businessunit").setDisabled(true);
    formContext.getControl("noc_ourreference").setDisabled(true);
    formContext.getControl("noc_yourreference").setDisabled(true);
    //formContext.getControl("noc_due").setDisabled(true);
    formContext.getControl("noc_duedate").setDisabled(true);
    formContext.getControl("noc_invoiceno").setDisabled(true);
    //formContext.getControl("noc_email").setDisabled(true);
    //formContext.getControl("noc_emailcc").setDisabled(true);
    formContext.getControl("noc_invoicedate").setDisabled(true);
    formContext.getControl("noc_paymentterms").setDisabled(true);
    formContext.getControl("noc_remarks").setDisabled(true);
    formContext.getControl("noc_subtotal").setDisabled(true);
    formContext.getControl("noc_tax").setDisabled(true);
    formContext.getControl("noc_total").setDisabled(true);
    formContext.getControl("transactioncurrencyid").setDisabled(true);
    formContext.getControl("ownerid").setDisabled(true);
    formContext.getControl("noc_assignment").setDisabled(true);
  }
  if (formContext.getAttribute("statuscode") == 181700001) {
    formContext.getControl("noc_paid").setDisabled(true);
  }
  if(formContext.getAttribute("noc_invoiceno").getValue() != null && formContext.getAttribute("noc_invoicedate").getValue() == null) {
    var paymentTerms = formContext.getAttribute("noc_paymentterms").getValue();
    var invoiceDate = new Date();

    var year = invoiceDate.getFullYear();
    var month = (invoiceDate.getMonth() + 1);
    if (month < 10) {month = "0" + month;}
    var day = invoiceDate.getDate();
    if (day < 10) {day = "0" + day;}

    var dueDate = new Date(year,month,day);

    //if (paymentTerms == 30) {dueDate = new Date(invoiceDate) + parseInt(1);}
    formContext.getAttribute("noc_invoicedate").setValue(invoiceDate);
    formContext.getAttribute("noc_duedate").setValue(dueDate);
  }
  var Id = formContext.data.entity.getId().replace("{", "").replace("}", "");
  SetManualInvoice(executionContext);
//  if(formContext.getAttribute("noc_manualinvoice").getValue() == false) {
//    var invoiceLines = await getInvoiceLineInvoice(Id);
//    if(invoiceLines != null){
//      var taxrt = 0;//formContext.getAttribute("noc_taxrate").getValue() / 100;
//      var sub = 0;
//      var tax = 0;
//      var tot = 0;

//      if (invoiceLines[0].noc_linetotal != null) {sub = invoiceLines[0].noc_linetotal;}
//      if(invoiceLines[0].noc_tax != null) {tax = invoiceLines[0].noc_tax;}
//      tot = sub + tax;
//      formContext.getAttribute("noc_subtotal").setValue(sub);
//      formContext.getAttribute("noc_tax").setValue(tax);
//      formContext.getAttribute("noc_total").setValue(tot);
//    }
//    else {
//      formContext.getAttribute("noc_subtotal").setValue(0);
//      formContext.getAttribute("noc_tax").setValue(0);
//      formContext.getAttribute("noc_total").setValue(0);
//    }
//  }
 }
OnSave = async function(executionContext) {
 var formContext = executionContext.getFormContext();
 debugger;
 if(formContext.ui.getFormType() == 1) { //Create
   var businessunit = formContext.getAttribute("noc_businessunit").getValue();
   var currency = formContext.getAttribute("transactioncurrencyid").getValue();
   var invoiceNumber = await getInvoiceNumber(businessunit[0].id);
   var newInvoiceNumber = await createInvoiceNumber(invoiceNumber);
   if (newInvoiceNumber != null) {
     formContext.getAttribute("noc_invoiceno").setValue(newInvoiceNumber);
     formContext.getAttribute("noc_name").setValue(newInvoiceNumber);
     var newInvoiceNumbering = parseInt(invoiceNumber[0].noc_number) + 1;
       await updateInvoiceNumber(invoiceNumber[0].noc_settingid, newInvoiceNumbering.toString(), newInvoiceNumber.toString());
   }
 }
// Update totals
var Id = formContext.data.entity.getId().replace("{", "").replace("}", "");
var InvoiceLines = await getInvoiceLineInvoice(Id);
    if (InvoiceLines != null) {
        formContext.getAttribute("noc_subtotal").setValue(InvoiceLines[0].noc_linetotal);
        formContext.getAttribute("noc_tax").setValue(InvoiceLines[0].noc_tax);
        formContext.getAttribute("noc_total").setValue(InvoiceLines[0].noc_linetotal + InvoiceLines[0].noc_tax);
    }
    else {
        formContext.getAttribute("noc_subtotal").setValue(0);
        formContext.getAttribute("noc_tax").setValue(0);
        formContext.getAttribute("noc_total").setValue(0);
    }
 //var Id = formContext.data.entity.getId().replace("{", "").replace("}", "");
 //getInvoiceLineInvoice(Id)
 }
setDateFunction = function(dateValue, days) {
   if (dateValue == null) { return null; }
   var year = dateValue.getFullYear();
   var month = (dateValue.getMonth() + 1);
   if (month < 10) {month = "0" + month;}
   var day = dateValue.getDate();
   if (day < 10) {day = "0" + day;}
   new Date(year,month,day) + days;
   return year + "-" + month + "-" + day;
  }
SetManualInvoice = function(executionContext) {
  var formContext = executionContext.getFormContext();
  if(formContext.getAttribute("noc_manualinvoice").getValue() == false){
    formContext.getControl("noc_subtotal").setDisabled(true);
    formContext.getControl("noc_tax").setDisabled(true);
    formContext.getControl("noc_total").setDisabled(true);
  }
  else if(formContext.getAttribute("noc_manualinvoice").getValue() == true && formContext.getAttribute("statuscode") == 1) {
    formContext.getControl("noc_subtotal").setDisabled(false);
    formContext.getControl("noc_tax").setDisabled(false);
    formContext.getControl("noc_total").setDisabled(false);
  }
 }
onCustomerChange = async function (executionContext) {
    var formContext = executionContext.getFormContext();
    var customer = formContext.getAttribute("noc_customer").getValue();
    var invoiceRemarks = formContext.getAttribute("noc_remarks").getValue();
    var Id = null;
    if (customer != null) {
        Id = customer[0].id;
    }
    else {
        formContext.getAttribute("noc_remarks").setValue("");
        formContext.getAttribute("noc_yourreference").setValue("");
    }

    var accountInvoiceRemarks = await getAccountPrimaryContact(Id);
    if (accountInvoiceRemarks != null) {
        var setting = await getSetting();
        if (setting != null) {
            if (setting[0].noc_yourreference == 0) {
                //formContext.getAttribute("noc_yourreference").setValue(accountInvoiceRemarks[0]._primarycontactid_value@OData.Community.Display.V1.FormattedValue);
                var contactid = accountInvoiceRemarks[0]._primarycontactid_value;
                var contact = await getContact(contactid);
                if (contact != null) {
                    formContext.getAttribute("noc_yourreference").setValue(contact[0].fullname);
                }
            }
        }
    }
    if (accountInvoiceRemarks != null && invoiceRemarks == null) {
        formContext.getAttribute("noc_remarks").setValue(accountInvoiceRemarks[0].noc_invoiceremarks);
    }
    
 }
 onStatuscodeChange = async function(executionContext) {
   var formContext = executionContext.getFormContext();
   if (formContext.getAttribute("statuscode").getValue() == 181700001) { // Paid
       formContext.getAttribute("noc_paid").setValue(new Date());
       var totalSEK = formContext.getAttribute("noc_totalsek").getValue();
       formContext.getAttribute("noc_paidamount").setValue(totalSEK);
   }
  }
cloneInvoice = async function(executionContext) {
 var formContext = executionContext;
 var newRecord = await createInvoice(formContext);
 var entityFormOptions = {};
 entityFormOptions["entityName"] = "noc_faktura";
 //entityFormOptions["entityId"] = newRecord[0].noc_invoice;
 var paymentterms = formContext.getAttribute("noc_paymentterms").getValue();
 var d = new Date();
 var year = d.getFullYear();
 var month = d.getMonth();
 var day = d.getDate();
 var dd = new Date();
 dd.setDate(d.getDate() + paymentterms);
 var formParameters = {};
 formParameters["noc_invoiceno"] = null;
 formParameters["noc_customer"] = formContext.getAttribute("noc_customer").getValue();
 formParameters["noc_businessunit"] = formContext.getAttribute("noc_businessunit").getValue();
 formParameters["noc_ourreference"] = formContext.getAttribute("noc_ourreference").getValue();
 formParameters["noc_yourreference"] = formContext.getAttribute("noc_yourreference").getValue();
 formParameters["noc_paymentterms"] = paymentterms;
 formParameters["noc_invoicedate"] = d;
 formParameters["noc_duedate"] = dd;
 //formParameters["noc_email"] = formContext.getAttribute("noc_email").getValue();
 //formParameters["noc_emailcc"] = formContext.getAttribute("noc_emailcc").getValue();
 formParameters["noc_remarks"] = formContext.getAttribute("noc_remarks").getValue();
 formParameters["transactioncurrencyid"] = formContext.getAttribute("transactioncurrencyid").getValue();
 formParameters["statuscode"] = 1;
 var successCallback;
 var errorCallback;
 Xrm.Navigation.openForm(entityFormOptions, formParameters).then(successCallback,errorCallback);
 }
createInvoice = async function(formContext) {
  var dataCreate = {
  //"noc_customer": formContext.getAttribute("noc_customer").getValue(),
  //"noc_businessunit": formContext.getAttribute("noc_businessunit").getValue(),
  "noc_ourreference": formContext.getAttribute("noc_ourreference").getValue(),
  "noc_yourreference": formContext.getAttribute("noc_yourreference").getValue(),
  //"noc_invoicedate": formContext.getAttribute("noc_invoicedate").getValue(),
  //"noc_duedate": formContext.getAttribute("noc_duedate").getValue(),
  //"noc_paymentterms": formContext.getAttribute("noc_paymentterms").getValue(),
  //"noc_email": formContext.getAttribute("noc_email").getValue(),
  //"noc_emailcc": formContext.getAttribute("noc_emailcc").getValue(),
  "noc_remarks": formContext.getAttribute("noc_remarks").getValue()
  //"noc_currency": formContext.getAttribute("noc_currency").getValue()
  }
  var newRecord = await createRecord("noc_invoice", dataCreate);
  return newRecord;
 }
