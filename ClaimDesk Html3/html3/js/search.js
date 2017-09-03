function btnSearch_OnClick() {
    var lastName = $('#txtLastName').val();
    var firstName = $('#txtFirstName').val();
    var incDt = $('#txtIncDt').val();
    var city = $('#txtCity').val();
    var state = $('#ddlState').val();
    var occupation = $('#txtOccupation').val();
    var employeeId = $('#txtEmployeeId').val();
    var claimType = $('#ddlClaimType').val();
    var fromDate = $('#frmDate').val();
    var toDate = $('#toDate').val();
    var strNumber = $('#srch_store option:selected').text();
    var bodyPart = $('#bodyPart').val();
    var injury = $('#injury').val();
    var claimCause = $('#claimCause').val();
    var injuryType = $('#injuryType').val();
    var denied = $('#denied').val();
    var litigated = $('#litigated').val();
    var settled = $('#settled').val();
    var claimNumber = $('#txtClaimNumber').val();

    var ssn = $('#txtSsn').val().replace(/-/g, '');    
    var phone = $('#txtPhone').val();
    var judistricationState = $('#ddlJudState').val();

    if (isNullOrEmpty(lastName) && isNullOrEmpty(firstName) && isNullOrEmpty(incDt) && isNullOrEmpty(city) &&
        isNullOrEmpty(state) && isNullOrEmpty(occupation) && isNullOrEmpty(employeeId) && isNullOrEmpty(claimType) && isNullOrEmpty(fromDate) && isNullOrEmpty(toDate) &&
        isNullOrEmpty(strNumber) && isNullOrEmpty(bodyPart) && isNullOrEmpty(injury) && isNullOrEmpty(claimCause) && isNullOrEmpty(injuryType) && isNullOrEmpty(denied) &&
        isNullOrEmpty(litigated) && isNullOrEmpty(settled) && isNullOrEmpty(claimNumber) && isNullOrEmpty(ssn) && isNullOrEmpty(phone) && isNullOrEmpty(judistricationState)) {
        $('#errStatusMsg').fadeIn();

    }
    else {
        $('#errStatusMsg').fadeOut();
        var jObj = {};

        if (!isNullOrEmpty(claimType))
            jObj.claimType = claimType;

        if (!isNullOrEmpty(firstName))
            jObj.firstName = firstName;

        if (!isNullOrEmpty(lastName))
            jObj.lastName = lastName;

        if (!isNullOrEmpty(state))
            jObj.state = state;

        if (!isNullOrEmpty(city))
            jObj.city = city;

        /* --- */
        if (!isNullOrEmpty(ssn))
            jObj.ssn = ssn;

        if (!isNullOrEmpty(phone))
            jObj.phone = phone;

        if (!isNullOrEmpty(judistricationState))
            jObj.judistricationState = judistricationState;
        /* --- */

        if (!isNullOrEmpty(incDt))
            jObj.incDt = incDt;

        if (!isNullOrEmpty(occupation))
            jObj.occupation = occupation;

        if (!isNullOrEmpty(employeeId))
            jObj.employeeId = employeeId;

        if (!isNullOrEmpty(fromDate))
            jObj.incidentDateFrom = localToUtc(fromDate, 'MM/DD/YYYY');

        if (!isNullOrEmpty(toDate))
            jObj.incidentDateTill = localToUtc(toDate, 'MM/DD/YYYY');;

        if (!isNullOrEmpty(strNumber) && strNumber.trim() != 'None')
            jObj.storeNumber = strNumber;

        if (!isNullOrEmpty(bodyPart))
            jObj.bodyPart = bodyPart;

        if (!isNullOrEmpty(injury))
            jObj.natureOfInjury = injury;

        if (!isNullOrEmpty(claimCause))
            jObj.claimCause = claimCause;

        if (!isNullOrEmpty(injuryType))
            jObj.injuryType = injuryType;


        if (!isNullOrEmpty(denied)) {
            jObj.denied = (denied == 'Yes' ? true : false);
        }

        if (!isNullOrEmpty(litigated)) {
            jObj.litigaed = (litigated == 'Yes' ? true : false);;
        }

        if (!isNullOrEmpty(settled)) {
            jObj.settled = (settled == 'Yes' ? true : false);
        }

        if (!isNullOrEmpty(claimNumber))
            jObj.claimNumber = claimNumber;

        Search(jObj, 'ClaimDeskWeb/services/v1/search/advancedSearch');
    }
}

function isNullOrEmpty(str) {
    if (str != null && str != '' && str.trim() != 'None')
        return false;
    else
        return true;
}

function loadSelectControlsData() {
    var ssnConfig = JSON.parse(sessionStorage.getItem('ssnConfig'));

    if (ssnConfig == null)
        return;

    var array = new Array("bodyPart", "injury", "claimCause", "injuryType");
    if (typeof ssnConfig.AS_INJURY_TYPE != 'undefined' && ssnConfig.AS_INJURY_TYPE == 'false') {
        array.splice(array.indexOf('injuryType'), 1);
        $('#injuryType').hide().parent().hide();
    }

    if (typeof ssnConfig.AS_BODY_PART != 'undefined' && ssnConfig.AS_BODY_PART == 'false') {
        array.splice(array.indexOf('bodyPart'), 1);
        $('#bodyPart').hide().parent().hide();
    }

    if (typeof ssnConfig.AS_CLAIM_CAUSE != 'undefined' && ssnConfig.AS_CLAIM_CAUSE == 'false') {
        array.splice(array.indexOf('claimCause'), 1);
        $('#claimCause').hide().parent().hide();
    }

    if (typeof ssnConfig.AS_SETTLED != 'undefined' && ssnConfig.AS_SETTLED == 'false') {
        $('#settled').hide().parent().hide();
    }

    for (i = 0; i < array.length; i++) {
        var cntrlId = array[i];
        var url = $("#" + array[i]).attr('data-url');
        getData(url, cntrlId);
    }
}

$(document).ready(function () {
    loadSelectControlsData();
});

function getData(url, cntrlId) {
    $.ajax({
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        url: hostname + url,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {

            $('#' + cntrlId).empty().html('<option></option>');
            var flag = true;
            $.each(result, function (res, val) {
                if (flag) {
                    $('#' + cntrlId).append('<option value="' + val.code + '">' + val.description + '</option>');
                }
                flag = !flag;

            });
        }
    });
}

function btnBasicSearch_OnClick() {
    var value = $('#txtSearch').val();
    if (!isNullOrEmpty(value)) {
        var obj = {
            text: value
        };

        Search(obj, 'ClaimDeskWeb/services/v1/search/');
    }
}

function fetchData(payload, Url) {
    $.ajax({
        type: 'POST',
        contentType: 'application/json;charset=utf-8',
        accept: 'application/json',
        dataType: 'json',
        cache: false,
        url: hostname + Url,
        headers: {
            'token': token,
            'userid': userId,
            'locationId': locationId
        },
        data: JSON.stringify(payload),
        success: function (result) {
            debugger;
        },
        error: function (err) {
            debugger;
        }
    });
}

function SortByIncDt(a, b) {
    var dt = new Date(a.incidentDate);
    var dt2 = new Date(b.incidentDate);
    if (dt < dt2) return 1;
    if (dt > dt2) return -1;
    return 0;
}

var isDefaultCol = true;
var isDefaultDir = true;
function Search(obj, Url) {

    $('#tbl2').fadeIn();
    $('#divEx1').hide();
    $('.advanced-search-modal').modal('hide');
    var html = '';
    html += '<table class="fullwidth tcellspacing noborder" id="example2">';
    html += '<thead class="myTabHead">';
    html += '<tr>';
    html += '<th class="talign">Claim ID</th>';
    html += '<th class="talign">Incident Date</th>';
    html += '<th class="talign">Guest Name</th>';
    html += '<th class="talign">Claim Create Date</th>';
    html += '<th class="talign">Incident</th>';

    html += '<th class="talign">Claim Type</th>';
    html += '<th class="talign">Store/Location</th>';
    html += '<th class="talign">Action </th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';
    html += '</tbody>';
    html += '</table>';
    $('#tbl2').html(html);
    var oTable = $('#example2').dataTable({
        "bStateSave": true,
        "sPaginationType": "full_numbers",
        "bServerSide": true,
        //"aLengthMenu": [30, 60, 100],        
        "bProcessing": true,
        "bSortClasses": false,
        "bDeferRender": true,
        "sAjaxSource": hostname + Url,
        "aoColumns": [
            { "sWidth": "9%" },
            { "sWidth": "13%" },
            { "sWidth": "12%" },
            { "sWidth": "13%" },
            { "sWidth": "12%" },
            { "sWidth": "9%" },
            { "sWidth": "20%" },
            { "bSortable": false, "sWidth": "10%" },
        ],
        "bFilter": false,
        "aaSorting": [[1, "desc"]],
        "fnServerData": function (sSource, aoData, fnCallback, oSettings) {            
            var sortColArr = ['ID', 'INCIDENT_DATE', 'FIRSTNAME', 'CREATED_DATE', 'TITLE', 'CLAIMTYPE', 'STORENUMBER'];
            var paramData = {};
            var sExt = "?";
            var sAnd = "";
            var r = 0;

            for (var key in aoData) {
                paramData[aoData[key]['name']] = aoData[key]['value'];

                if (r > 0) sAnd = "&";
                if (aoData[key]['name'].trim() == "iDisplayLength") {
                    sExt += sAnd + "limit=" + aoData[key]['value']; r++
                    obj.limit = aoData[key]['value'];
                }
                if (aoData[key]['name'].trim() == "iDisplayStart") {
                    sExt += sAnd + "offset=" + aoData[key]['value']; r++
                    obj.offset = aoData[key]['value'];
                }
                if (aoData[key]['name'].trim() == "iSortCol_0") {
                    sExt += sAnd + "sort_col=" + aoData[key]['value']; r++
                    obj.sortColumn = sortColArr[aoData[key]['value']];
                }
                if (aoData[key]['name'].trim() == "sSortDir_0") {
                    sExt += sAnd + "sort=" + aoData[key]['value']; r++
                    obj.sortType = aoData[key]['value'].toUpperCase();
                }
                if (aoData[key]['name'].trim() == "sEcho") var sEcho = aoData[key]['value'];
            }
            
            oSettings.jqXHR = $.ajax({
                "type": "POST",
                "contentType": "application/json;charset=utf-8",
                "accept": "application/json",
                "dataType": "json",
                "headers": {
                    "token": token,
                    "userid": userId,
                    "locationId": locationId
                },
                "url": sSource + sExt,
                "data": JSON.stringify(obj),
                "success": function (result) {

                    var claims = new Array();
                    //result.claims = result.items;

                    for (var i = 0; i < result.items.length; i++) {
                        if (result.items[i] != null) {
                            claims.push(result.items[i]);
                        }
                        else {
                            result.total = result.total - 1;
                        }
                    }

                    //result.claims = claims.sort(SortByIncDt);
                    result.claims = claims;

                    var gettitlearr = {};
                    var getlocarr = {};
                    var count = 0;
                    var tempdset = {};
                    var dataSet = [];
                    for (var key in result["claims"]) {
                        if (result['claims'][key]['status'] == 'DELETED')
                            continue;

                        var objinner = [];
                        objinner.push(result['claims'][key]['claimId']);
                        objinner.push(UtcToLocal(result['claims'][key]['incidentDate'], 'MM/DD/YYYY hh:mm A'));
                        objinner.push(result['claims'][key]['guestName']);

                        objinner.push(UtcToLocal(result['claims'][key]['created'], 'MM/DD/YYYY hh:mm A'));
                        objinner.push(result['claims'][key]['title']);

                        objinner.push(result['claims'][key]['claimType']);
                        objinner.push("<b>" + result['claims'][key]['branchId'] + "</b>, " + result['claims'][key]['address'] + ", " + result['claims'][key]['address2'] + ", " + result['claims'][key]['city'] + ", " + result['claims'][key]['state'] + ", " + result['claims'][key]['zip']);
                        var str = '';
                        if (result['claims'][key]['status'] == 'ACTIVE') {//

                            str = "<ul class='manageIcon1'>" +
                                   "<li class='veiwInc' data-toggle='modal' data-target='" + (result.claims[key].type == "WC" ? ".view_claim_modal_wc" : ".bs-example-modal-lg") + "' style='cursor:pointer;'>" +
                                    "<a href='#'><img id='img_" + result['claims'][key]['claimId'] + "' data-incident-locid='" + result['claims'][key]['locationId'] + "' src='images/min1.png' width='16' height='19'alt='img' onclick=\"setlocId(" + result['claims'][key]['claimId'] + ",'" + (result.claims[key].type == "WC" ? "show_WC" : "show") + "')\"></a>" +
                                   "</li>" +
                                   "<li>" +
                                    "<a href='#'><img data-claim-type='" + result.claims[key].type + "' id='img1_" + result['claims'][key]['claimId'] + "' data-hasdiary-note='" + (result['claims'][key]['diaryNotes'] ? true : false) + "' data-incident-locid='" + result['claims'][key]['locationId'] + "' src='images/min2.png' width='16' height='19'alt='img' onclick=\"setlocId(" + result['claims'][key]['claimId'] + ",'" + (result.claims[key].type == "WC" ? "edit_wc" : "edit") + "')\"></a>" +
                                   "</li>" +
                                   "<li>" +
                                    "<a href='#'><img src='images/min5.png' width='16' height='19' alt='img' onclick=\"setlocId(" + result['claims'][key]['claimId'] + ",'delete')\"></a>" +
                                   "</li>" + DiaryNoteImage(result['claims'][key]['diaryNotes'], result['claims'][key]['claimId']) + getTypeOfClaim(result.claims[key].claimId, result.claims[key].type) +
                            "</ul>";
                        }
                        else {
                            
                            str = "<ul class='manageIcon1'>" +
                                       "<li class='veiwInc' data-toggle='modal' data-target='" + ((result.claims[key].type == "WC" ? ".view_claim_modal_wc" : ".bs-example-modal-lg")) + "' style='cursor:pointer;'>" +
                                        "<a href='#'><img id='img_" + result['claims'][key]['claimId'] + "' data-incident-locid='" + result['claims'][key]['locationId'] + "' src='images/min1.png' width='16' height='19'alt='img' onclick=\"setlocId(" + result['claims'][key]['claimId'] + ",'" + (result.claims[key].type == "WC" ? "show_WC" : "show") + "')\"></a>" +
                                       "</li>" +
                                       "<li>" +
                                        "<a href='#'><img data-claim-type='" + result.claims[key].type + "' id='img1_" + result['claims'][key]['claimId'] + "' data-incident-locid='" + result['claims'][key]['locationId'] + "' src='images/min2.png' width='16' height='19'alt='img' onclick=\"msg(" + result['claims'][key]['status'] + ");\"></a>" +
                                       "</li>" +
                                       "<li>" +
                                       "<a href='#'><img src='images/min5.png' width='16' height='19' alt='img' onclick=\"setlocId(" + result['claims'][key]['claimId'] + ",'delete')\"></a>"
                            "</li>" + DiaryNoteImage(result['claims'][key]['diaryNotes'], result['claims'][key]['claimId']) + getTypeOfClaim(result.claims[key].claimId, result.claims[key].type) +
                            "</ul>";
                        }

                        objinner.push(str);
                        dataSet.push(objinner);
                    }

                    tempdset["sEcho"] = sEcho;
                    tempdset["iTotalRecords"] = result["total"];
                    tempdset["iTotalDisplayRecords"] = result["total"];
                    tempdset["aaData"] = dataSet
                    //	alert(JSON.stringify(dataSet));	
                    fnCallback(tempdset);

                }
            });

        }
    });

    //oTable.fnSort([[1, 'desc']]);
}

$(document).ready(function () {
    $('#txtSearch').keypress(function (e) {
        if (e.which == 13) {
            btnBasicSearch_OnClick();
        }
    });
});