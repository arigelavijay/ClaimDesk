$(document).ready(function () {
    $('input[type=radio][name=rdo_Activity]').change(function () {
        var isLogCall = $('input[name=rdo_Activity]:checked').val() == 'true' ? true : false;
        debugger;
        if (isLogCall) {
            $('#logCall').fadeIn();
            $('#addNote').hide();

            $('#logCall').empty();
            $('#logCall').html($("#jq-tmpl-logcall").tmpl());
        }
        else {
            $('#logCall').hide();
            $('#addNote').fadeIn();

            $('#addNote').empty();
            $('#addNote').html($("#jq-tmpl-addNote").tmpl());
        }
    });

    $('body').on('focus', '.dtPCss', function () {
        $(this).datepicker({
            changeMonth: true,
            changeYear: true,
            yearRange: '-100:+0',
            addSliderAccess: true,
            maxDate: new Date()
        });
    });

    $('body').on('focus', '.timepickerCss', function () {
        $(this).mask("Hh:Mm Pp");

        $(this).timepicker({
            addSliderAccess: false,
            timeFormat: "hh:mm tt",
            sliderAccessArgs: { touchonly: false }
        });
    });
});

function LoadReturnToWork() {
    var dataArr = new Array();

    var obj = {};
    obj.activityType = 'log a call';
    obj.category = 'Job Offer Extended';
    obj.date = '06/16/15';
    obj.createdBy = '';
    obj.description = '';
    obj.action = '';

    dataArr.push(obj);

    $('#tblreturnWork').dataTable({
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
            { "mDataProp": "activityType" },
            { "mDataProp": "category" },
            { "mDataProp": "date" },
            { "mDataProp": "createdBy" },
            { "mDataProp": "description" },
            {
                "mDataProp": "action",
                "bSearchable": false,
                "bSortable": false,
                "mRender": function (data, type, full) {
                    var str = '';

                    str += '<a style="cursor:pointer;" data-toggle="modal" data-target=".view-Activity" onclick="viewActivity();"><img src="images/min1.png" alt="" /></a>&nbsp;&nbsp;&nbsp;';
                    str += '<a style="cursor:pointer;" data-toggle="modal" data-target=".add-activity"><img src="images/edit.png" alt=""  /></a>&nbsp;&nbsp;&nbsp;';
                    str += '<a style="cursor:pointer;"><img src="images/min5.png" alt="" /></a>';

                    return str;
                }
            }]
    });
}

function btnAddActivity() {

    $('#logCall').empty();
    $("#jq-tmpl-logcall").tmpl().appendTo('#logCall');
}

function viewActivity() {

    var dataArr = new Array();

    var obj = {};
    obj.viewActivity = 'Log a Call';

    obj.actCategory = 'Category';

    obj.startDate = '07/11/2015 12:00 PM';
    obj.endDate = '07/10/2015 03:10 PM';

    obj.weeklyTime = '12:00 AM';
    obj.availHours = '10';

    obj.intDate = '07/11/2015 12:00 PM';
    obj.jobOfferDate = '07/11/2015 12:00 PM';

    obj.dateOfCall = '07/05/2015 12:00 PM';
    obj.timeOfCall = '07/12/2015 12:00 PM';
    obj.timeOfCallLasted = '07/11/2015 12:00 PM';

    obj.fallowUp = 'Yes';

    obj.fallowUpDate = '07/11/2015 12:00 AM';
    obj.responsible = 'Responsible';
    obj.reminder = '10:00 AM';

    obj.fallowUpComleted = 'Yes';

    dataArr.push(obj);

    var obj1 = {};
    obj1.viewActivity = 'Log a Call';

    obj1.actCategory = 'Category';

    obj1.startDate = '07/11/2015 12:00 PM';
    obj1.endDate = '07/10/2015 03:10 PM';

    obj1.weeklyTime = '12:00 AM';
    obj1.availHours = '10';

    obj1.intDate = '07/11/2015 12:00 PM';
    obj1.jobOfferDate = '07/11/2015 12:00 PM';

    obj1.dateOfCall = '07/05/2015 12:00 PM';
    obj1.timeOfCall = '07/12/2015 12:00 PM';
    obj1.timeOfCallLasted = '07/11/2015 12:00 PM';

    obj1.fallowUp = 'Yes';

    obj1.fallowUpDate = '07/11/2015 12:00 AM';
    obj1.responsible = 'Responsible';
    obj1.reminder = '10:00 AM';

    obj1.fallowUpComleted = 'Yes';

    dataArr.push(obj1);

    var data = {};
    data.returnWork = dataArr;

    $('#viewActivityBody').empty({
        hasHistory: function (i) {
            return (typeof this.data.returnWork[i]['viewActivity'] != 'undefined' && this.data.returnWork[i]['viewActivity'].length) == 'Add a Note' ? true : false;
        }
    });

    $("#jq-tmpl-viewActivity").tmpl(obj).appendTo('#viewActivityBody');
}