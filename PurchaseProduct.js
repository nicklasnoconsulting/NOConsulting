OnChange = async function (executionContext) {
    var formContext = executionContext.getFormContext();
    debugger;
    var product = formContext.getAttribute("noc_product").getValue();
    var productName = formContext.getAttribute("noc_product").getValue()[0].name;
    var purchaseName = formContext.getAttribute("noc_purchase").getValue()[0].name;
    var quantity = formContext.getAttribute("noc_quantity").getValue();
    if (quantity != null && product != null) {
        var amount = await getPurchaseProductPrice(product[0].id.replace("{", "").replace("}", ""));
        if (amount != null) {
            if (amount[0].noc_price == null) {
                amount[0].noc_price = 0;
            }
            formContext.getAttribute("noc_amount").setValue(amount[0].noc_price * quantity);
        }
        formContext.getAttribute("noc_name").setValue(purchaseName + " " + productName);
    }
}
