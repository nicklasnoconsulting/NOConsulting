CreateSalary = async function (executionContext) {
    debugger;
    //var flowURL = "https://prod-21.westeurope.logic.azure.com:443/workflows/81da39ce8e444b209c9246fae60af3c9/triggers/manual/paths/invoke?api-version=2016-06-01";
    var flowURL = "https://prod-21.westeurope.logic.azure.com:443/workflows/81da39ce8e444b209c9246fae60af3c9/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=oKj7UblY20YrKVOEbakG5SC9_tLfoVlFl4iAT-YyUjo";
    var formContext = executionContext;
    var message = "Salary created for " + formContext.getAttribute("noc_name").getValue();
    var Id = formContext.data.entity.getId().replace("{", "").replace("}", "");
    var flowURL = "https://prod-21.westeurope.logic.azure.com:443/workflows/81da39ce8e444b209c9246fae60af3c9/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=oKj7UblY20YrKVOEbakG5SC9_tLfoVlFl4iAT-YyUjo";
    callFlow(executionContext, Id, message, flowURL);
}

