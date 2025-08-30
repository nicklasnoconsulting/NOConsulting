OnChange = function (executionContext) {
    var formContext = executionContext.getFormContext();
    var expenseType = formContext.getAttribute("noc_expensetype").getValue();
    if (expenseType != null) {
        var labelName = "";
        switch (expenseType) {
            case 181700000:
                labelName = "L�n";
                break;
            case 181700001:
                labelName = "Hyra";
                break;
            case 181700002:
                labelName = "�vrigt";
                break;
            case 181700003:
                labelName = "Koncernbidrag";
                break;
            case 181700004:
                labelName = "El";
                break;
            case 181700005:
                labelName = "L�n";
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
                labelName = "Utl�gg";
                break;
            case 181700012:
                labelName = "F�rbr.inv.";
                break;
            default:
                labelName = "";
        }
        formContext.getAttribute("noc_name").setValue(labelName);
    }
}

