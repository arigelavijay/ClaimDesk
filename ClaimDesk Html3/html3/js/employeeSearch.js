function btnBasicSearch_OnClick() {
    var value = $('#txtSearch').val();
    if (!isNullOrEmpty(value)) {
        var obj = {
            text: value
        };

        Search(obj, 'ClaimDeskWeb/services/v1/search/employee');
    }
}

function isNullOrEmpty(str) {
    if (str != null && str != '')
        return false;
    else
        return true;
}

function Search(obj, Url) {
    $('#tbl2').fadeIn();
    $('#divEx1').hide();
    $('.advanced-search-modal').modal('hide');
    var html = '';
    html += '<table class="fullwidth tcellspacing noborder" id="example2">';
    html += '<thead class="myTabHead">';
    html += '<tr>';
    html += '<th class="talign">First Name</th>';
    html += '<th class="talign">Last Name </th>';
    html += '<th class="talign">Employee ID</th>';
    html += '<th class="talign">Title</th>';
    html += '<th class="talign">Location</th>';
    html += '<th class="talign">Email Address</th>';
    html += '<th class="talign">Action&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>';
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
        //"bInfo": false,
        "aoColumns": [
            { "sWidth": "8%" },
            { "sWidth": "8%" },
            { "sWidth": "4%" },
            { "sWidth": "8%" },
            { "sWidth": "5%" },
            { "sWidth": "8%" },
            { "bSortable": false, "sWidth": "6%" }],
        "aaSorting": [[1, "asc"]],
        "fnServerData": function (sSource, aoData, fnCallback, oSettings) {
            var sortColArr = ['FIRSTNAME', 'LASTNAME', 'EMPLOYEEID', 'TITLE', 'STORENUMBER', 'EMAIL_ADDRESS'];
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
                cache: false,
                "headers": {
                    "token": token,
                    "userid": userId,
                    "locationId": locationId
                },
                data: JSON.stringify(obj),
                "url": sSource,
                //"data": JSON.stringify(paramData),
                "success": function (result) {                    
                    var tempdset = {};
                    var dataSet = [];


                    result.emp = result.employees;
                    for (var key in result["emp"]) {



                        var objinner = [];

                        objinner.push(typeof result["emp"][key]['firstName'] != 'undefined' ? result["emp"][key]['firstName'] : '');
                        objinner.push(typeof result["emp"][key]['lastName'] != 'undefined' ? result["emp"][key]['lastName'] : '');
                        objinner.push(typeof result["emp"][key]['empid'] != 'undefined' ? result["emp"][key]['empid'] : '');
                        objinner.push(typeof result["emp"][key]['title'] != 'undefined' ? result["emp"][key]['title'] : '');

                        objinner.push(typeof result["emp"][key]['branchId'] != 'undefined' ? result["emp"][key]['branchId'] : '');
                        objinner.push(typeof result["emp"][key]['emailAddress'] != 'undefined' ? result["emp"][key]['emailAddress'] : '');
                        var strlink = "<ul class='manageIcon1'><li data-toggle='modal' data-target='.bs-example-modal-lg'><img src='images/min1.png' width='16' height='19' alt='img' onclick='setlocId(" + result["emp"][key]['id'] + ",\"show\")'></li><li><a href='#'><img src='images/min2.png' width='16' height='19' alt='img' onclick=\"setlocId('" + result["emp"][key]['id'] + "','edit')\"></a></li><li><a href='#'><img src='images/min5.png' width='16' height='19' alt='img' onclick=\"setlocId('" + result["emp"][key]['id'] + "','delete')\"></a></li></ul>";



                        objinner.push(strlink);
                        dataSet.push(objinner);
                    }

                    tempdset["sEcho"] = sEcho;
                    tempdset["iTotalRecords"] = result['total'];
                    tempdset["iTotalDisplayRecords"] = result['total'];
                    tempdset["aaData"] = dataSet
                    //alert(JSON.stringify(dataSet));	
                    fnCallback(tempdset);
                }
            });
        }
    });
    //oTable.fnSort([[1, 'asc']]);
}

function btnSearch_OnClick() {
    var firstName = $('#txtFirstName').val();
    var lastName = $('#txtLastName').val();
    var ssn = $('#txtSsn').val().replace(/-/g, '');    
    var employeeid = $('#txtEmpId').val();
    var title = $('#txtTitle').val();
    var email = $('#txtEmail').val();
    var dob = $('#txtDob').val();
    var city = $('#txtCity').val();
    var state = $('#ddlState').val();
    var occupation = $('#ddlOccupation').val();
    var department = $('#department').val();
    var phone = $('#txtPhone').val();

    if (isNullOrEmpty(firstName) && isNullOrEmpty(lastName) && isNullOrEmpty(ssn) && isNullOrEmpty(employeeid) &&
        isNullOrEmpty(title) && isNullOrEmpty(email) && isNullOrEmpty(dob) && isNullOrEmpty(city) &&
        isNullOrEmpty(state) && isNullOrEmpty(occupation) && isNullOrEmpty(department) && isNullOrEmpty(phone)) {
        $('#errStatusMsg').fadeIn();
    }
    else {
        $('#errStatusMsg').fadeOut();
        var jObj = {};

        if (!isNullOrEmpty(firstName))
            jObj.firstName = firstName;

        if (!isNullOrEmpty(lastName))
            jObj.lastName = lastName;

        if (!isNullOrEmpty(ssn))
            jObj.ssn = ssn;

        if (!isNullOrEmpty(employeeid))
            jObj.employeeid = employeeid;

        if (!isNullOrEmpty(title))
            jObj.title = title;

        if (!isNullOrEmpty(email))
            jObj.email = email;

        if (!isNullOrEmpty(dob))
            jObj.dob = moment(dob).format('M/D/YYYY');


        debugger;
        if (!isNullOrEmpty(city))
            jObj.city = city;

        if (!isNullOrEmpty(state))
            jObj.state = state;

        if (!isNullOrEmpty(occupation))
            jObj.occupation = occupation;

        if (!isNullOrEmpty(department))
            jObj.department = department;

        if (!isNullOrEmpty(phone))
            jObj.phone = phone;

        
        Search(jObj, 'ClaimDeskWeb/services/v1/search/employee/advancedSearch');
        //alert(JSON.stringify(jObj));
    }
}


$(document).ready(function () {
    $('#txtSearch').keypress(function (e) {
        if (e.which == 13) {
            btnBasicSearch_OnClick();
        }
    });
});
