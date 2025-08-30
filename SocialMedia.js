OnLoad = function (executionContext) {
    var formContext = executionContext.getFormContext();
    if (formContext.ui.getFormType() != 1) { //Create
        var followers = getLatestFollower();
    }
   
}


