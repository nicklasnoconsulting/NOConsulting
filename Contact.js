OnChangeType = function(executionContext) {
  var formContext = executionContext.getFormContext();
 }
OnLoad = async function (executionContext) {
    debugger;
    var formContext = executionContext.getFormContext();
    var formName = formContext.ui.formSelector.getCurrentItem().getLabel();
    if (formName == "Chocolate & Friends") {
        if (formContext.ui.getFormType() == 1) { //Create
            var businessUnit = await getBusinessUnit("Chocolate&amp;Friends");
            if (businessUnit != null) {
                var lookupValue = new Array();
                lookupValue[0] = new Object();
                lookupValue[0].id = businessUnit[0].businessunitid;
                lookupValue[0].name = businessUnit[0].name;
                lookupValue[0].entityType = "businessunit";
                formContext.getAttribute("noc_businessunit").setValue(lookupValue);
            }
            formContext.getAttribute("noc_contacttype").setValue(181700009);          
        }
        var todayDate = new Date();
        var contactId = formContext.data.entity.getId().replace("{", "").replace("}", "");
        var Membership = await getMembership(contactId);
        if (Membership != null) {
            var endDate = new Date(Membership[0].noc_enddate);
            if (Membership[0].noc_membershiptype == 181700000 && endDate > todayDate) {
                formContext.getAttribute("noc_friends").setValue(true);
            }
            else {
                formContext.getAttribute("noc_friends").setValue(false);
            }
        }
    }
  }
OnSave = function(executionContext) {
    var formContext = executionContext.getFormContext();
   }
