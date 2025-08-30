OnChange = function (executionContext) {
    var formContext = executionContext.getFormContext();
    var incomeType = formContext.getAttribute("noc_incometype").getValue();
    if (incomeType != null) {
        var labelName = "";
        switch (incomeType) {
            case 181700000:
                labelName = "Försäljning";
                break;
            case 181700001:
                labelName = "Konsulttjänster";
                break;
            case 181700002:
                labelName = "Licenser";
                break;
            case 181700003:
                labelName = "Koncernbidrag";
                break;
            case 181700004:
                labelName = "Lån";
                break;
            default:
                labelName = "";
        }
        formContext.getAttribute("noc_name").setValue(labelName);
    }  
}
