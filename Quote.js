
OnSave = function (executionContext) {
    var formContext = executionContext.getFormContext();
    debugger;
    //  if (formContext.ui.getFormType() == 1) { //Create
    var amount = formContext.getAttribute("totallineitemamount").getValue();
    var taxrate = formContext.getAttribute("noc_taxrate").getValue();
    var manualdiscount = formContext.getAttribute("discountamount").getValue();
    if (manualdiscount == null) {
        manualdiscount = 0;
    }
    var discountpercent = formContext.getAttribute("discountpercentage").getValue();
    if (discountpercent != null) {
        percentdiscount = (amount * discountpercent) / 100;
    }
    else {
        percentdiscount = 0;
    }
    if (taxrate != null) {
        var discountedamount = amount - percentdiscount - manualdiscount;
        var tax = discountedamount * taxrate / 100;
        var amount = formContext.getAttribute("tax").setValue(tax);
    }
    //   }
}

