OnLoad = async function(executionContext) {
    debugger;
    var formContext = executionContext.getFormContext();
    var id = formContext.getAttribute("noc_salaryid").getValue();
    if (formContext.ui.getFormType() == 1) { //Create
        var lineNo = await getNextSalaryLineNo(id[0].id);
        if (lineNo != null) {
            formContext.getAttribute("noc_no").setValue(lineNo[0].noc_no + 1);
        }
        else if (lineNo == null) {
            formContext.getAttribute("noc_no").setValue(1);
        }
    }
 }
OnSave = async function(executionContext) {

     var formContext = executionContext.getFormContext();
     var loneart = formContext.getAttribute("noc_la").getValue();
     var benamning = formContext.getAttribute("noc_ben").getValue();
     if (loneart != null && benamning != null) {
       formContext.getAttribute("noc_name").setValue(loneart+"-"+benamning);
     }
 
 }
OnSalaryTypeChange = async function (executionContext) {
    debugger;
  var formContext = executionContext.getFormContext();
    var loneart = formContext.getAttribute("noc_salarytype").getValue();
    if (loneart != null) {
        var salaryLineType = await getSalaryLineType(loneart[0].id);
        if (salaryLineType != null) {
            formContext.getAttribute("noc_enh").setValue(salaryLineType[0].noc_enhet);
            formContext.getAttribute("noc_ben").setValue(salaryLineType[0].noc_benamning);
            formContext.getAttribute("noc_la").setValue(salaryLineType[0].noc_loneart);
        }
        else {
            formContext.getAttribute("noc_enh").setValue(null);
            formContext.getAttribute("noc_ben").setValue(null);
            formContext.getAttribute("noc_la").setValue(null);
        }
    }
}
OnAmountChange = async function (executionContext) {
    debugger;
    var formContext = executionContext.getFormContext();
    var quantity = formContext.getAttribute("noc_kv").getValue();
    var apris = formContext.getAttribute("noc_ap").getValue();
    var summa = quantity * apris;
    if (quantity != null && apris != null) {
     formContext.getAttribute("noc_sum").setValue(summa);
    }
}
