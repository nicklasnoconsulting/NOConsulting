OnSave = function (executionContext) {
    var formContext = executionContext.getFormContext();
    debugger;
  
}

OnLoad = function (executionContext) {
    var formContext = executionContext.getFormContext();

    var salesStepControl = Xrm.Page.getControl("crms_saljsteg");
    salesStepControl.removeOption(4);
    salesStepControl.removeOption(5);
    salesStepControl.removeOption(6);
    salesStepControl.removeOption(7);

    var probability = formContext.getAttribute("crms_sannolikhet");
    var inkomst = formContext.getAttribute("crms_inkomst");
    if (inkomst != null & probability != null) {
        switch (salesStepControl) {
            case 1: // 
                probability = 20;
                break;
            case 2:
                probability = 40;
                break;
        }
    }
}
