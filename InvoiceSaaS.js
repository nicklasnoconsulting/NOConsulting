OnSave = function (executionContext) {
    var formContext = executionContext.getFormContext();
    debugger;
    var invoiceno = formContext.getAttribute("invoicenumber").getValue();
    if (invoiceno != null) {
        var newInvoiceno = invoiceno.substring(0, 9)
        var amount = formContext.getAttribute("noc_invoiceno").setValue(newInvoiceno);
    }
}

OnLoad = function (executionContext) {
    var formContext = executionContext.getFormContext();

    var invoiceDate = new Date();
    var year = invoiceDate.getFullYear();
    var month = (invoiceDate.getMonth() + 1);
    if (month < 10) { month = "0" + month; }
    var day = invoiceDate.getDate();
    if (day < 10) { day = "0" + day; }
    var dueDate = new Date(year, month, day);
    formContext.getAttribute("noc_invoicedate").setValue(invoiceDate);
    formContext.getAttribute("noc_duedate").setValue(dueDate);
}

onCustomerChange = async function (executionContext) {
    var formContext = executionContext.getFormContext();
    var customer = formContext.getAttribute("customerid").getValue();
    var invoiceRemarks = formContext.getAttribute("noc_remarks").getValue();
    var Id = null;
    if (customer != null) {
        Id = customer[0].id;
    }
    var accountInvoiceRemarks = await getAccount(Id);
    if (accountInvoiceRemarks != null && invoiceRemarks == null) {
        formContext.getAttribute("noc_remarks").setValue(accountInvoiceRemarks[0].noc_invoiceremarks);
    }
}