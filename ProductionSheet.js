OnLoad = async function (executionContext) {
    debugger;
    var formContext = executionContext.getFormContext();
    var Id = formContext.data.entity.getId().replace("{", "").replace("}", "");
    var products = await getChocolateProducts(Id, "181700000");
    if (products != null) {
        formContext.getAttribute("noc_actvolume").setValue(products[0].noc_qty);
    }
}
OnChange = function (executionContext) {
    var formContext = executionContext.getFormContext();
}