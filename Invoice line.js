OnLoad = async function(executionContext) {
debugger;
  var formContext = executionContext.getFormContext();
  if(formContext.ui.getFormType() == 1) { //Create
    OnInvoiceChanged(executionContext);
  }
  var Id = formContext.data.entity.getId().replace("{", "").replace("}", "");
  //var invoiceLineHrs = await getInvoiceLineTimes(Id);
  //formContext.getAttribute("noc_invoicelinehrs").setValue(invoiceLineHrs[0].noc_hours);
    var hrs = formContext.getAttribute("noc_invoicelinehrs").getValue();
    if (hrs == null || hrs == "") {
        formContext.getAttribute("noc_invoicelinehrs").setValue(0);
    }
    var mil = formContext.getAttribute("noc_manualinvoiceline").getValue();
    var qty = formContext.getAttribute("noc_qty").getValue();
    if ((qty == null || qty == "") && mil == false) {
        formContext.getAttribute("noc_qty").setValue(0);
    }
    var tax = formContext.getAttribute("noc_tax").getValue();
    if (tax == null || tax == "") {
        formContext.getAttribute("noc_tax").setValue(0);
    }
    var linetotal = formContext.getAttribute("noc_linetotal").getValue();
    if (linetotal == null || linetotal == "") {
        formContext.getAttribute("noc_linetotal").setValue(0);
    }
 }
OnSave = async function(executionContext) {
  var formContext = executionContext.getFormContext();
  var mil = formContext.getAttribute("noc_manualinvoiceline").getValue();
  var qty = formContext.getAttribute("noc_qty").getValue();
  var up = formContext.getAttribute("noc_unitprice").getValue();
  var tax = formContext.getAttribute("noc_tax").getValue();
  var disc = formContext.getAttribute("noc_discount").getValue();
  var taxrt = formContext.getAttribute("noc_taxrate").getValue();
  var lt = null;
  var tax = null;

  if (qty != null && up != null && mil == false){
    tax = (((qty * up) - disc) * taxrt) / 100;
    lt = (qty * up) - disc;
    formContext.getAttribute("noc_linetotal").setValue(lt);
    formContext.getAttribute("noc_tax").setValue(tax);
  }
  var iid = formContext.getAttribute("noc_invoice").getValue();
  if(formContext.ui.getFormType() == 1) { //Create
    formContext.getAttribute("noc_name").setValue(iid[0].name + "-" + formContext.getAttribute("noc_ln").getValue());
  }
 }
OnInvoiceChanged = async function(executionContext) {
  var formContext = executionContext.getFormContext();
  if (formContext.getAttribute("noc_invoice").getValue() != null) {
    var Id = formContext.getAttribute("noc_invoice").getValue();
    var il = formContext.getAttribute("noc_ln").getValue();
    var result = await getInvoiceLineNumber(Id[0].id);
    if (result != null && il == null) {
      if (result[0].noc_ln == 0) {
        formContext.getAttribute("noc_ln").setValue(1);
      }
      else {
        formContext.getAttribute("noc_ln").setValue(result[0].noc_ln + 1);
      }
    }
    else if(il == null) {
      formContext.getAttribute("noc_ln").setValue(1);
    }
  }
 }
