OnChange = function (executionContext) {
    var formContext = executionContext.getFormContext();
    var expenseType = formContext.getAttribute("noc_expensetype").getValue();
    if (expenseType != null) {
        var labelName = "";
        switch (expenseType) {
            case 181700000:
                labelName = "Lön";
                break;
            case 181700001:
                labelName = "Hyra";
                break;
            case 181700002:
                labelName = "Övrigt";
                break;
            case 181700003:
                labelName = "Koncernbidrag";
                break;
            case 181700004:
                labelName = "El";
                break;
            case 181700005:
                labelName = "Lån";
                break;
            case 181700006:
                labelName = "Inventarier";
                break;
            case 181700007:
                labelName = "Choklad";
                break;
            case 181700008:
                labelName = "Parkering";
                break;
            case 181700009:
                labelName = "Revisor";
                break;
            case 181700010:
                labelName = "Skatt";
                break;
            case 181700011:
                labelName = "Utlägg";
                break;
            case 181700012:
                labelName = "Förbr.inv.";
                break;
            default:
                labelName = "";
        }
        formContext.getAttribute("noc_name").setValue(labelName);
    }
}

