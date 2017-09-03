function LoadLostRestrictedDays() {
    lrSummary();
    lrDaysList();
}

function lrSummary() {
    var lrSummaryArr = new Array();

    var obj = {};
    obj.type = 'Lost Days';
    obj.total = 20;
    obj.actual = 20;

    lrSummaryArr.push(obj);

    var obj2 = {};
    obj2.type = 'Restricted Days';
    obj2.total = 160;
    obj2.actual = 190;

    lrSummaryArr.push(obj2);

    $('#tblLRSummary').dataTable({
        "bProcessing": false,
        "bPaginate": false,
        "bLengthChange": false,
        "bFilter": false,
        "bSort": true,
        "bInfo": false,
        "aaData": lrSummaryArr,
        "aoColumns": [
            { "mDataProp": "type" },
            { "mDataProp": "total" },
            { "mDataProp": "actual" },
        ]
    });
}

function lrDaysList() {
    var lrList = new Array();

    var obj = {
        id: 571,
        lostOrRes: 'Lost Day',
        dtWorkerLeft: '01/01/2015',
        dtWorkerReturned: '02/01/2015',
        action: ''
    };

    lrList.push(obj);

    var obj2 = {
        id: 258,
        lostOrRes: 'Restricted Day',
        dtWorkerLeft: '02/01/2015',
        dtWorkerReturned: '10/31/2015',
        action: ''
    };

    lrList.push(obj2);

    $('#tblLRList').dataTable({
        "bProcessing": true,
        "bPaginate": false,
        "bLengthChange": true,
        "bFilter": false,
        "bSort": true,
        "bInfo": false,
        "bAutoWidth": true,
        "sPaginationType": "full_numbers",
        "iDisplayLength": 10,
        "aaData": lrList,
        //"aoColumnDefs": [{ bSortable: false, aTargets: [-1, 0] }],
        "aoColumns": [
            { "mDataProp": "id" },
            { "mDataProp": "lostOrRes" },
            { "mDataProp": "dtWorkerLeft" },
            { "mDataProp": "dtWorkerReturned" },
            {
                "mDataProp": "action",
                "bSearchable": false,
                "bSortable": false,
                "mRender": function (data, type, full) {
                    var str = '';

                    str += '<a style="cursor:pointer;" data-toggle="modal" data-target=".view-restrictedDays" onclick="viewrestrictedDays();"><img src="images/min1.png" alt="" /></a>&nbsp;&nbsp;&nbsp;';
                    str += '<a style="cursor:pointer;" data-toggle="modal" data-target=".add-activity"><img src="images/edit.png" alt=""  /></a>&nbsp;&nbsp;&nbsp;';
                    str += '<a style="cursor:pointer;"><img src="images/min5.png" alt="" /></a>';

                    return str;
                }
            }]
    });

}

function viewrestrictedDays() {

    var obj = {};

    obj.restrictedDays = '10';
    obj.dutyType = 'Part Time';

    obj.workerLeftDate = '07/10/2015 02:08 PM';
    obj.workerLeftTime = '12:00 AM';

    obj.workerLeftReturned = '07/10/2015 02:08 PM';

    $('#viewRestrictedDays').empty();

    $('#jq-tmpl-viewrestrictedDays').tmpl(obj).appendTo('#viewRestrictedDays');
}