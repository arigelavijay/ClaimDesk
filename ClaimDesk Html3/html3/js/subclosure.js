function LoadSubClosure() {
    var dataArr = new Array();

    var obj1 = {};
    obj1.id = 571;
    obj1.settlementType = 'Annuity';
    obj1.exClosureDt = '09/05/2015';
    obj1.payoutBeginDt = '09/01/2015';
    obj1.payoutEndDt = '09/01/2060';
    obj1.action = '';

    dataArr.push(obj1);

    var obj2 = {};
    obj2.id = 572;
    obj2.settlementType = 'Annuity';
    obj2.exClosureDt = '09/05/2015';
    obj2.payoutBeginDt = '09/01/2015';
    obj2.payoutEndDt = '09/01/2060';
    obj2.action = '';
    dataArr.push(obj2);

    var obj3 = {};
    obj3.id = 573;
    obj3.settlementType = 'Annuity';
    obj3.exClosureDt = '09/05/2015';
    obj3.payoutBeginDt = '09/01/2015';
    obj3.payoutEndDt = '09/01/2060';
    obj3.action = '';
    dataArr.push(obj3);

    $('#tblsubClosure').dataTable({
        "bProcessing": true,
        "bPaginate": false,
        "bLengthChange": true,
        "bFilter": false,
        "bSort": true,
        "bInfo": false,
        "bAutoWidth": true,
        "sPaginationType": "full_numbers",
        "iDisplayLength": 10,
        "aaData": dataArr,
        //"aoColumnDefs": [{ bSortable: false, aTargets: [-1, 0] }],
        "aoColumns": [
            { "mDataProp": "id" },
            { "mDataProp": "settlementType" },
            { "mDataProp": "exClosureDt" },
            { "mDataProp": "payoutBeginDt" },
            { "mDataProp": "payoutEndDt" },
            {
                "mDataProp": "action",
                "bSearchable": false,
                "bSortable": false,
                "mRender": function (data, type, full) {
                    var str = '';

                    str += '<a style="cursor:pointer;" data-toggle="modal" data-target=".view-subclosure" onclick="viewSubclosure();"><img src="images/min1.png" alt="" /></a>&nbsp;&nbsp;&nbsp;';
                    str += '<a style="cursor:pointer;" data-toggle="modal" data-target=".add-subClosure"><img src="images/edit.png" alt=""  /></a>&nbsp;&nbsp;&nbsp;';
                    str += '<a style="cursor:pointer;"><img src="images/min5.png" alt="" /></a>';

                    return str;
                }
            }]
    });
}

function btnAddsubClosure() {

}

function viewSubclosure() {

    var obj = {};

    obj.subrogation = 'subrogation';
    obj.subDesc = 'This is description about subrogation';

    obj.settleType = 'Settlement Type';
    obj.stleDesc = 'Settlement Description';

    obj.closureDate = '07/10/2015 02:08 PM';
    obj.ppdAward = 'Award';

    obj.payoutBeginDate = '07/10/2015 02:08 PM';
    obj.payoutEndDate = '07/10/2015 02:08 PM';
    obj.termsWeek = '4';

    $('#viewSubClosure').empty();

    $('#jq-tmpl-viewSubClosure').tmpl(obj).appendTo('#viewSubClosure');

}