function btnBasicSearch_OnClick() {
    var value = $('#txtSearch').val();
    if (!isNullOrEmpty(value)) {
        var obj = {
            text: value
        };

        Search(obj, 'ClaimDeskWeb/services/v1/search/incident');
    }
}

function isNullOrEmpty(str) {
    if (str != null && str != '' && str.trim() != 'None')
        return false;
    else
        return true;
}

function SortByIncDt(a, b) {
    var dt = new Date(a.date);
    var dt2 = new Date(b.date);
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
    html += '<th class="talign">Incident&nbsp;ID</th>';
    html += '<th class="talign">Incident Date </th>';                                    
    html += '<th class="talign">Store No. &amp; Location</th>';                                    
    html += '<th class="talign">Created by</th>';
    html += '<th class="talign">Brief Description</th>';
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
        "bProcessing": true,
        "bSortClasses": false,
        "bDeferRender": true,
        "sAjaxSource": hostname + Url,
        "bFilter": false,
        "aoColumns": [
            { "sWidth": "5%" },
            { "sWidth": "15%" },
            { "sWidth": "25%" },
            { "sWidth": "15%" },
            { "sWidth": "20%" },
            { "bSortable": false, "sWidth": "10%" }],
        "aaSorting": [[1, "desc"]],
        "fnServerData": function (sSource, aoData, fnCallback, oSettings) {            
            
            var sortColArr = ['ID', 'INCIDENT_DATE', 'STORENUMBER', 'CREATEDBY', 'TITLE'];
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
                    
                    //result.incidents = result.incidents.sort(SortByIncDt);
                    result.incidents = result.incidents;
                    
                    var tempdset = {};
                    var dataSet = [];
                    for (var key in result["incidents"]) {                                                
                        
                        var objinner = [];

                        objinner.push(result["incidents"][key]['incidentId']);
                        var t =
                        objinner.push(UtcToLocal(getValue(result["incidents"][key]['date']) + " " + getValue(result["incidents"][key]['time']), 'MM/DD/YYYY hh:mm A'));
                        var add = "<b>" + result["incidents"][key]['branchId'] + "</b>, " + result["incidents"][key]['address'] + ", " + result["incidents"][key]['city'];

                        objinner.push(add);
                        objinner.push(getValue(result["incidents"][key]['createdBy']));
                        objinner.push(result["incidents"][key]['title']);

                        if (result["incidents"][key]['status'] == "ACTIVE") {
                            var strlink = "<ul class='manageIcon1'><li data-toggle='modal' id='li_" + result["incidents"][key]['incidentId'] + "' data-inc-loc='" + result["incidents"][key]['locationId'] + "' data-target='.bs-example-modal-lg'><img src='images/min1.png' width='16' height='19' alt='img' onclick='setlocId(" + result["incidents"][key]['incidentId'] + ",\"show\")'></li><li><a href='#'><img src='images/min2.png' width='16' height='19' alt='img' onclick=\"setlocId('" + result["incidents"][key]['incidentId'] + "','edit')\"></a></li><li><a href='#'><img src='images/min5.png' width='16' height='19' alt='img' onclick=\"setlocId('" + result["incidents"][key]['incidentId'] + "','delete')\"></a></li></ul>";
                        }
                        else {
                            var strlink = "<ul class='manageIcon1'><li><img src='images/min1.png' width='16' height='19' alt='img' onclick='msg3();'></li><li><a href='#'><img src='images/min2.png' width='16' height='19' alt='img' onclick='msg3();' ></a></li><li><a href='#'><img src='images/min5.png' width='16' height='19' alt='img' onclick='msg3();'></a></li></ul>";
                        }
                        objinner.push(strlink);
                        dataSet.push(objinner);
                    }

                    tempdset["sEcho"] = sEcho;
                    tempdset["iTotalRecords"] = result['total'];
                    tempdset["iTotalDisplayRecords"] = result['total'];
                    tempdset["aaData"] = dataSet
                    
                    fnCallback(tempdset);
                }
            });
        }
    });    	
    
    //oTable.fnSort([[1, 'desc']]);
}

function btnSearch_OnClick() {
    //var location = $('#ddlLocation').val();
    var incidentDateFrom = $('#txtIncDtFrm').val();
    var incidentDateTill = $('#txtIncDtTill').val();
    var state = $('#ddlState').val();//$('#ddlState option:selected').text();
    var storeNumber = $('#ddlStoreNo option:selected').text()
    var city = $('#txtCity').val();
    var reportingManager = $('#txtReptMgr').val();
    var generalManager = $('#txtGentMgr').val();
    

    if (isNullOrEmpty(incidentDateFrom) && isNullOrEmpty(incidentDateTill) && isNullOrEmpty(state) &&
        isNullOrEmpty(storeNumber) && isNullOrEmpty(city) && isNullOrEmpty(reportingManager) && isNullOrEmpty(generalManager)) {
        $('#errStatusMsg').fadeIn();

    }
    else {
        $('#errStatusMsg').fadeOut();
        var jObj = {};
        
        //if (!isNullOrEmpty(location))
        //    jObj.location = location;

        if (!isNullOrEmpty(incidentDateFrom))
            jObj.incidentDateFrom = localToUtc(incidentDateFrom, 'MM/DD/YYYY');

        if (!isNullOrEmpty(incidentDateTill))
            jObj.incidentDateTill = localToUtc(incidentDateTill, 'MM/DD/YYYY');

        if (!isNullOrEmpty(state))
            jObj.state = state;

        if (!isNullOrEmpty(storeNumber) && storeNumber.trim() != 'None')
            jObj.storeNumber = storeNumber;

        if (!isNullOrEmpty(city))
            jObj.city = city;

        if (!isNullOrEmpty(reportingManager))
            jObj.reportingManager = reportingManager;

        if (!isNullOrEmpty(generalManager))
            jObj.generalManager = generalManager;      


        
        //alert(JSON.stringify(jObj));
        Search(jObj, 'ClaimDeskWeb/services/v1/search/incident/advancedSearch');
        
    }
}

$(document).ready(function () {
    $('#txtSearch').keypress(function (e) {
        if (e.which == 13) {            
            btnBasicSearch_OnClick();
        }
    });
});

/*
var isModalOpen = false;
$(document).ready(function () {
    $(document).keypress(function (e) {
        if (e.which == 13) {
            if (isModalOpen) {
                btnSearch_OnClick();
            }
            else {
                btnBasicSearch_OnClick();
            }
        }
    });
    
    $('.advanced-search-modal').on('show.bs.modal', function (e) {
        isModalOpen = true;
    });

    $('.advanced-search-modal').on('hidden.bs.modal', function (e) {
        isModalOpen = false;
    });    
});
*/