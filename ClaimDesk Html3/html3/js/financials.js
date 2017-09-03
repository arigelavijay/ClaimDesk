function LoadFinancials() {
    $('#tblReserves').dataTable({
        "bProcessing": true,
        "bPaginate": false,
        "bLengthChange": true,
        "bFilter": false,
        "bSort": true,
        "bInfo": false,
        "bAutoWidth": true,
        "sPaginationType": "full_numbers",
        "iDisplayLength": 10,
        "aoColumnDefs": [
           {
               "aTargets": [4],
               "mData": null,
               "mRender": function (data, type, full) {
                   var str = '';

                   str += '<a style="cursor:pointer;" data-toggle="modal" data-target=".view-reserve" onclick="viewreserve();"><img src="images/min1.png" alt="" /></a>&nbsp;&nbsp;&nbsp;';
                   str += '<a style="cursor:pointer;"><img src="images/edit.png" alt="" /></a>&nbsp;&nbsp;&nbsp;';
                   str += '<a style="cursor:pointer;"><img src="images/min5.png" alt="" /></a>';

                   return str;
               }
           }]
    });

    $('#tblPayments').dataTable({
        "bProcessing": true,
        "bPaginate": false,
        "bLengthChange": true,
        "bFilter": false,
        "bSort": true,
        "bInfo": false,
        "bAutoWidth": true,
        "sPaginationType": "full_numbers",
        "iDisplayLength": 10,
        "aoColumnDefs": [
           {
               "aTargets": [5],
               "mData": null,
               "mRender": function (data, type, full) {
                   var str = '';

                   str += '<a style="cursor:pointer;" data-toggle="modal" data-target=".view-payments" onclick="viewpayments();"><img src="images/min1.png" alt="" /></a>&nbsp;&nbsp;&nbsp;';
                   str += '<a style="cursor:pointer;"><img src="images/edit.png" alt="" /></a>&nbsp;&nbsp;&nbsp;';
                   str += '<a style="cursor:pointer;"><img src="images/min5.png" alt="" /></a>';

                   return str;
               }
           }]
    });
}


function viewpayments() {

    var obj = {};
    obj.selectedcode = '2212';
    obj.paymentdate = '07/08/2015 02:08 PM';
    obj.checkDate = '07/05/2015 02:08 PM';
    obj.checkNeedDate = '07/05/2015 05:28 PM';

    obj.deliveryMethod = 'homeDelivery';
    obj.deliverTo = 'Simmons';
    obj.attention = 'attention';

    obj.noteoncheck = 'Some description';
    obj.draftNumber = '231324564';
    obj.expendature = '031321';

    obj.providerType = "check";

    obj.add1 = 'newyork';
    obj.add2 = 'US';

    obj.city = 'newyork';
    obj.state = 'newyork';
    obj.zipcode = '134654654';

    obj.payeePhnNumber = '32558525';
    obj.payeeIrsNumber = '2313212';
    obj.payeeIncoiceNumber = '132123245';

    obj.classification = 'Classification';

    obj.serviceStrtDate = '07/10/2015 02:08 PM';
    obj.serviceEndDate = '07/05/2015 02:08 PM';

    obj.icd9Code = '323565554';
    obj.cptCode = 'Amd2356544';
    obj.deptNumber = '3255';

    obj.activity = 'activity';
    obj.hours = '12hours';
    obj.ledgerNumber = '325685';

    obj.actCode = '235658';
    obj.auditingCompany = 'XYZ company';
    obj.paymentDesc = 'Deliveried';

    obj.laborCost = '$10';
    obj.purchaseCost = '$100';
    obj.taxRate = '$50';

    obj.totalCost = '$10';
    obj.expenditureCost = '$20';
    obj.billAmount = '$20';

    obj.difference = 'difference';

    obj.originator = 'originator';

    obj.treasurer = 'treasurer';
    obj.deptHead = 'department head';
    obj.president = 'president';

    $('#viewPaymentsBody').empty();

    $("#jq-tmpl-viewpayments").tmpl(obj).appendTo('#viewPaymentsBody');
}

function viewreserve() {

    var obj = {};

    obj.reservecode = '236455';
    obj.date = '07/10/2015 02:08 PM';
    obj.Acccode = '235656';

    obj.explanation = 'explanation';
    obj.amount = '$100';

    $('#viewReserveBody').empty();
    $('#jq-tmpl-viewreserve').tmpl(obj).appendTo('#viewReserveBody');
}