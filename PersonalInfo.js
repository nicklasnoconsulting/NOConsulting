OnLoad = function (executionContext) {
    var formContext = executionContext.getFormContext();
    var type = formContext.getAttribute("noc_personalinfotype").getValue();
    switch (type) {
        case 181700000: // Email
            formContext.ui.tabs.get("General").sections.get("CreditCard").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("Subscription").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("Website").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("Email").setVisible(true);
            formContext.ui.tabs.get("General").sections.get("CustomerLogin").setVisible(false);
            break;
        case 181700001: // Subscription
            formContext.ui.tabs.get("General").sections.get("CreditCard").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("Subscription").setVisible(true);
            formContext.ui.tabs.get("General").sections.get("Website").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("Email").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("CustomerLogin").setVisible(false);
            break;
        case 181700002: // Login
            formContext.ui.tabs.get("General").sections.get("CreditCard").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("Subscription").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("Website").setVisible(true);
            formContext.ui.tabs.get("General").sections.get("Email").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("CustomerLogin").setVisible(false);

            break;
        case 181700003: // Credit Card
            formContext.ui.tabs.get("General").sections.get("CreditCard").setVisible(true);
            formContext.ui.tabs.get("General").sections.get("Subscription").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("Website").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("Email").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("CustomerLogin").setVisible(false);
            break;
        case 181700004: // Customer Login
            formContext.ui.tabs.get("General").sections.get("CreditCard").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("Subscription").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("Website").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("Email").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("CustomerLogin").setVisible(true);
            break;
    }
}
OnChange = function (executionContext) {
    debugger;
    var formContext = executionContext.getFormContext();
    var type = formContext.getAttribute("noc_personalinfotype").getValue();
    switch (type) {
        case 181700000: // Email
            formContext.ui.tabs.get("General").sections.get("CreditCard").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("Subscription").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("Website").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("Email").setVisible(true);
            formContext.ui.tabs.get("General").sections.get("CustomerLogin").setVisible(false);
            break;
        case 181700001: // Subscription
            formContext.ui.tabs.get("General").sections.get("CreditCard").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("Subscription").setVisible(true);
            formContext.ui.tabs.get("General").sections.get("Website").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("Email").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("CustomerLogin").setVisible(false);
            break;
        case 181700002: // Login
            formContext.ui.tabs.get("General").sections.get("CreditCard").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("Subscription").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("Website").setVisible(true);
            formContext.ui.tabs.get("General").sections.get("Email").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("CustomerLogin").setVisible(false);

            break;
        case 181700003: // Credit Card
            formContext.ui.tabs.get("General").sections.get("CreditCard").setVisible(true);
            formContext.ui.tabs.get("General").sections.get("Subscription").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("Website").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("Email").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("CustomerLogin").setVisible(false);
            break;
        case 181700004: // Customer Login
            formContext.ui.tabs.get("General").sections.get("CreditCard").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("Subscription").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("Website").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("Email").setVisible(false);
            formContext.ui.tabs.get("General").sections.get("CustomerLogin").setVisible(true);
            break;
    }
    var bankID = formContext.getAttribute("noc_bankid").getValue();
    if (bankID == 1) {
        formContext.getControl("noc_password").setDisabled(true);
    }
}
OnSave = function (executionContext) {
    debugger;
    var formContext = executionContext.getFormContext();

}
