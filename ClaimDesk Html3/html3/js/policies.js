// login session variables
var userId = sessionStorage.getItem("userid");
var token = sessionStorage.getItem("token");
var locationId = sessionStorage.getItem("locationId");
var firstName = sessionStorage.getItem("firstName");
var lastName = sessionStorage.getItem("lastName");
var sellocationid = '';
var selmanagerid = '';

function set_header() {

    var firstName = sessionStorage.getItem("firstName");
    var lastName = sessionStorage.getItem("lastName");
    var address = sessionStorage.getItem("address");
    var storeId = sessionStorage.getItem("storeId");
    if (sessionStorage.getItem("logo") && sessionStorage.getItem("logo") != '' && sessionStorage.getItem("logo") != 'null')
        downloadLogo(locationId, sessionStorage.getItem("logo"));
    else var logo = "images/no-logo.png";
    var userName = firstName + " " + lastName;

    $("#logname").html(userName);
    if (storeId == 'ELHQ') {
        $(".poloText").html("<p>El Pollo Loco, # " + storeId + " </p>" + address);
        $(".poloRight").html("<img width='50' height='50' alt='img' src='" + logo + "'/>");
    }
    else {
        $(".poloText").html("<p>" + storeId + " </p>" + address);
        $(".poloRight").html("<img width='50' height='50' alt='img' src='" + logo + "'/>");
    }
}

function about() {
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        cache: false,
        url: hostname + "ClaimDeskWeb/services/v1/about",
        global: false,
        async: false,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {
            var i = 0;
            var str = "";
            var attr = [];
            var key_val = [];
            for (var key in result) {
                str += '<div  style="float:left; width:30%"><span id="attribute" style="width: 100% !important;">' + Object.keys(result)[i++] + '</span></div><div style="float:right; width:68%"><span id="key_val"  style="width: 100% !important;">:' + result[key] + '</span></div>';

            }

            $("#about_info").html(str);
        }
    });
    return "";

}

function changePass() {

    if ($("#change_pass").valid()) {
        var old_pass = document.getElementById("old_pass").value;
        var new_pass = document.getElementById("new_pass").value;
        var con_new_pass = document.getElementById("con_new_pass").value;


        var jsonData = {
            "oldpassword": old_pass,
            "newpassword": new_pass
        }

        $.ajax({
            type: "POST",
            contentType: "application/json;charset=utf-8",
            accept: "application/json",
            dataType: "json",
            url: hostname + "ClaimDeskWeb/services/v1/user/changePassword",
            headers: {
                "token": token,
                "userid": userId,
                "locationId": locationId
            },
            data: JSON.stringify(jsonData),
            success: function (result) {
                document.getElementById("old_pass").value = "";
                document.getElementById("new_pass").value = "";
                document.getElementById("con_new_pass").value = "";
                $("#msg_show").html(result['result']);
            },
            error: function (request, status, error) {

                document.getElementById("old_pass").value = "";
                document.getElementById("new_pass").value = "";
                document.getElementById("con_new_pass").value = "";
                var msg = request.responseJSON['errors']['error'][0]['description'];
                $("#msg_show").html(msg);
            }
        });
    }
}

function authentication() {

    if (userId == '' || userId == null) {
        apprise("Please Login Before Proceed.")
        window.location = "index.html";
    }
    else {
        set_header();
    }
}

function GetPolicyStatus(i) {
    
    var status = 'Active';
    if (i % 3 == 0)
        status = 'Expired';
    else if (i % 2 == 0)
        status = 'Terminated';

    return status;
}

function loadPolicies() {
    var dataArr = new Array();

    var dt = new Date();
    
    for (var i = 1; i < 50; i++) {
        var jObj = {};
        jObj.policyStatus = GetPolicyStatus(i);
        jObj.policyNo = 98794645 + i;
        jObj.effectiveDt = '08/' + (i % 2) + '/2015';
        jObj.expirationDt = '09/09/2015';
        jObj.deductibleAmount = '$ ' + (2000 + (i * 10));
        jObj.action = '';
        dataArr.push(jObj);
    }    
    
    $('#tbl_Policies').dataTable({
        "bProcessing": true,
        "bPaginate": true,
        "bLengthChange": true,
        "bFilter": false,
        "bSort": true,
        "bInfo": true,
        "bAutoWidth": true,
        "sPaginationType": "full_numbers",
        "iDisplayLength": 10,
        "aaData": dataArr,
        "aoColumns": [
            { "mDataProp": "policyStatus" },
            { "mDataProp": "policyNo" },
            { "mDataProp": "effectiveDt" },
            { "mDataProp": "expirationDt" },
            { "mDataProp": "deductibleAmount" },
            {
               "mDataProp": "action",
               "bSearchable": false,
               "bSortable": false,
               "mRender": function (data, type, full) {
                   var str = '';

                   str += '<a style="cursor:pointer;" data-toggle="modal" data-target=".view-policy" onclick="viewPolicy_Click();"><img src="images/min1.png" alt="" /></a>&nbsp;&nbsp;&nbsp;';
                   str += '<a style="cursor:pointer;" href="policy-management.html"><img src="images/edit.png" alt=""  /></a>&nbsp;&nbsp;&nbsp;';
                   str += '<a style="cursor:pointer;"><img src="images/min5.png" alt="" /></a>';

                   return str;
               }
           }]
    });
}

function viewPolicy_Click() {
    var data = {
        insured: 'XYZ',
        insuredLocation: 'California',
        policyNumber: '12345678',
        effectiveDt: '01/01/2015',
        expirationDt: '01/01/2018',
        cancellationDt: '01/02/2015',
        policyStatus: 'active',
        deductibleAmount: '$ 18,964',
        agency: 'Star Health',
        weightedMod: 'ABC',
        coveredClaimTypes: 'Work Comp, General Liability, Property, Near/Miss',
        coveredStated: 'Arizona, California, Nevada, Oregon, Washington'
    };

    $('#viewPolicy').empty();
    $("#jq-tmpl-viewpolicy").tmpl(data).appendTo('#viewPolicy');
}

function CoveredClaimTypes() {
    var dataArr = new Array();
    var obj1 = {};
    obj1.coveredClaimTypes = 'Work Comp';
    obj1.action = '';
    dataArr.push(obj1);

    var obj2 = {};
    obj2.coveredClaimTypes = 'General Liability';
    obj2.action = '';
    dataArr.push(obj2);

    var obj3 = {};
    obj3.coveredClaimTypes = 'Property';
    obj3.action = '';
    dataArr.push(obj3);

    var obj4 = {};
    obj4.coveredClaimTypes = 'Near/Miss';
    obj4.action = '';
    dataArr.push(obj4);
    
    $('#tblCoveredClaimTypes').dataTable({
        "bProcessing": true,
        "bPaginate": false,
        "bLengthChange": false,
        "bFilter": false,
        "bSort": false,
        "bInfo": false,
        "bAutoWidth": true,
        "sPaginationType": "full_numbers",
        "iDisplayLength": 10,
        "aaData": dataArr,
        "aoColumns": [
            { "mDataProp": "coveredClaimTypes" },            
            {
                "mDataProp": "action",                
                "mRender": function (data, type, full) {
                    var str = '';                    
                    str += '<a style="cursor:pointer;"><img src="images/min5.png" alt="" /></a>';
                    return str;
                }
            }]
    });
}

function CoveredStates() {
    var dataArr = new Array();
    var obj1 = {};
    obj1.coveredState = 'Arizona';
    obj1.action = '';
    dataArr.push(obj1);

    var obj2 = {};
    obj2.coveredState = 'California';
    obj2.action = '';
    dataArr.push(obj2);

    var obj3 = {};
    obj3.coveredState = 'Nevada';
    obj3.action = '';
    dataArr.push(obj3);

    var obj4 = {};
    obj4.coveredState = 'Oregon';
    obj4.action = '';
    dataArr.push(obj4);

    var obj5 = {};
    obj5.coveredState = 'Washington';
    obj5.action = '';
    dataArr.push(obj5);

    $('#tblCoveredState').dataTable({
        "bProcessing": true,
        "bPaginate": false,
        "bLengthChange": false,
        "bFilter": false,
        "bSort": false,
        "bInfo": false,
        "bAutoWidth": true,
        "sPaginationType": "full_numbers",
        "iDisplayLength": 10,
        "aaData": dataArr,
        "aoColumns": [
            { "mDataProp": "coveredState" },
            {
                "mDataProp": "action",
                "mRender": function (data, type, full) {
                    var str = '';
                    str += '<a style="cursor:pointer;"><img src="images/min5.png" alt="" /></a>';
                    return str;
                }
            }]
    });
}