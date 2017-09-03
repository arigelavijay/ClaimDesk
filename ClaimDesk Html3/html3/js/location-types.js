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

function locationTypes() {
    var dataArr = new Array();

    var jobj = {};
    jobj.level = 0;
    jobj.Name = "Root/HQ";
    jobj.action = "";    

    var jobj1 = {};
    jobj1.level = 1;
    jobj1.Name = "Division";
    jobj1.action = "";    

    var jobj2 = {};
    jobj2.level = 2;
    jobj2.Name = "Area";
    jobj2.action = "";

    dataArr.push(jobj2);
    dataArr.push(jobj1);
    dataArr.push(jobj);
    
    $('#tblLocationTypes').dataTable({
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
            { "mDataProp": "level" },
            { "mDataProp": "Name" },            
            {
                "mDataProp": "action",
                "bSearchable": false,
                "bSortable": false,
                "mRender": function (data, type, full) {
                    var str = '';

                    str += '<a style="cursor:pointer;"><img src="images/min1.png" alt="" /></a>&nbsp;&nbsp;&nbsp;';
                    str += '<a style="cursor:pointer;" data-toggle="modal" data-target=".editLocTypeCss"><img src="images/edit.png" alt=""  /></a>&nbsp;&nbsp;&nbsp;';
                    str += '<a ' + (full.level == 2 ? 'style="cursor:pointer;"' : 'disabled="disabled" readonly="readonly"') + ' ' + (full.level == 2 ? 'onclick="deleteLevel(' + full.level + ');"' : '') + '><img src="images/min5.png" alt="" /></a>';

                    return str;
                }
            }]
    });
}

function deleteLevel(level) {

    var string = 'Do you want to delete this level ?';
    var args = { 'input': false };
    apprise(string, args, function (r) {
        if (r) {

        }
    });
}