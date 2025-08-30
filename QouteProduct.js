OnSave = function (executionContext) {
    var formContext = executionContext.getFormContext();
    debugger;
  //  if (formContext.ui.getFormType() == 1) { //Create
    var amount = formContext.getAttribute("baseamount").getValue();
    var taxrate = formContext.getAttribute("noc_taxrate").getValue();
    var manualdiscount = formContext.getAttribute("manualdiscountamount").getValue();
    if (manualdiscount == null) {
        manualdiscount = 0;
    }
    if (taxrate != null) {       
        var discountedamount = amount - manualdiscount;     
        var tax = discountedamount * taxrate / 100;
        var amount = formContext.getAttribute("tax").setValue(tax);
    }
 //   }
}

