var userId = sessionStorage.getItem("userid");
var token = sessionStorage.getItem("token");
var locationId = sessionStorage.getItem("locationId");
var firstName = sessionStorage.getItem("firstName");
var lastName = sessionStorage.getItem("lastName");
var sellocationid = '';
var selmanagerid = '';

function authentication() {
    if (userId == '' || userId == null) {
        apprise("Please Login Before Proceed.")
        window.location = "index.html";
    }


}
function loadData() {

    sessionStorage.removeItem("Locedit");
    var oTable = $('#example1').dataTable({
        "bStateSave": true,
        "sPaginationType": "full_numbers",
        "bServerSide": true,
        "bProcessing": true,
        "bSortClasses": false,
        "bDeferRender": true,
        "sAjaxSource": hostname + "ClaimDeskWeb/services/v1/location/locationList",
        "aoColumns": [{ "sWidth": "15%" }, { "sWidth": "12%" }, { "sWidth": "18%" }, null, { "bSortable": false, "sWidth": "15%" }],
        "bFilter": false,

        "fnServerData": function (sSource, aoData, fnCallback, oSettings) {

            var paramData = {};
            var sExt = "?";
            var sAnd = "";
            var r = 0;

            for (var key in aoData) {
                paramData[aoData[key]['name']] = aoData[key]['value'];

                if (r > 0) sAnd = "&";
                if (aoData[key]['name'].trim() == "iDisplayLength") {
                    sExt += sAnd + "limit=" + aoData[key]['value']; r++
                }
                if (aoData[key]['name'].trim() == "iDisplayStart") {
                    sExt += sAnd + "offset=" + aoData[key]['value']; r++
                }
                if (aoData[key]['name'].trim() == "iSortCol_0") {
                    sExt += sAnd + "sort_col=" + aoData[key]['value']; r++
                }
                if (aoData[key]['name'].trim() == "sSortDir_0") {
                    sExt += sAnd + "sort=" + aoData[key]['value']; r++
                }

                if (aoData[key]['name'].trim() == "sEcho") var sEcho = aoData[key]['value'];
            }


            oSettings.jqXHR = $.ajax({
                "type": "GET",
                "contentType": "application/json;charset=utf-8",
                "accept": "application/json",
                "dataType": "json",
                "headers": {
                    "token": token,
                    "userid": userId,
                    "locationId": locationId
                },
                "url": sSource + sExt,
                //"data": JSON.stringify(paramData),
                "success": function (result) {



                    var tempdset = {};
                    var dataSet = [];
                    for (var key in result["loc"]) {
                        var objinner = [];

                        objinner.push(checknull(result["loc"][key]['manager']));
                        objinner.push(checknull(result["loc"][key]['storeID']));
                        objinner.push(checknull(result["loc"][key]['managerstoreID']));

                        var addressstr = checknull(result["loc"][key]['address']['addressLine1']);
                        addressstr += " " + checknull(result["loc"][key]['address']['addressLine2']);
                        addressstr += " " + checknull(result["loc"][key]['address']['city']);
                        addressstr += " " + checknull(result["loc"][key]['address']['state']);
                        addressstr += " " + checknull(result["loc"][key]['address']['postalCode']);

                        objinner.push(addressstr);


                        var strlink = "<ul class='manageIcon'><li data-toggle='modal' data-target='.bs-example-modal-lg'><img src='images/min1.png' width='16' height='19' alt='img' onclick='setlocId(" + result["loc"][key]['id'] + ",\"show\")'></li><li><img src='images/min2.png' width='16' height='19' alt='img' onclick='setlocId(" + result["loc"][key]['id'] + ",\"edit\")'></li><li><img src='images/min5.png' width='16' height='19' alt='img' onclick='setlocId(" + result["loc"][key]['id'] + ",\"delete\")'></li></ul>";

                        objinner.push(strlink);
                        dataSet.push(objinner);

                    }
                    tempdset["sEcho"] = sEcho;
                    tempdset["iTotalRecords"] = result["totalRecord"];
                    tempdset["iTotalDisplayRecords"] = result["totalRecord"];
                    tempdset["aaData"] = dataSet
                    //	alert(JSON.stringify(dataSet));	
                    fnCallback(tempdset);
                }
            });
        }
    });
    //$('#example1').dataTable().fnDraw();
    //	  oTable.fnSetColumnVis( 4, false );
    //	  oTable.fnSetColumnVis( 6, false );
    //	  oTable.fnSetColumnVis( 7, false );
    //	  oTable.fnSetColumnVis( 5, false );	
    oTable.fnSort([[1, 'asc']]);
}


function createPageLoad() {

    var currentloc = sessionStorage.getItem("Locedit");
    if (!currentloc) currentloc = '';
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        url: hostname + "ClaimDeskWeb/services/v1/location/" + currentloc,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {
            if (result['id'] == currentloc) {
                $("#id").val(result['id']);
                $("#manager").val(result['manager']);
                $("#branchid").val(result['storeID']);
                $("#hidden_branchid").val(result['storeID']);
                $("#parentid").val(result['parentId']);
                $("#p_id").val(result['parentId']);
                $("#address1").val(result['address']['addressLine1']);
                $("#address2").val(result['address']['addressLine2']);
                $("#city").val(result['address']['city']);
                $("#state").val(result['address']['state']);
                $("#country").val(result['address']['country']);
                $("#county").val(result['address']['county']);
                $("#postalcode").val(result['address']['postalCode']);


                $('#locType').val(result.type);
                if (result['logo']) {
                    if (result['logo'] == '' || result['logo'].indexOf("undefined") > 0) {
                        $("#hidden_img").val('');
                        var logo = "images/no-logo.png";

                    }
                    else {
                        $("#hidden_img").val(result['logo']);
                        Logodownload(result['id'], result['logo']);

                        //	  var logo = "upimg/logo/"+result['logo'];
                    }
                }

                $('#logimg').attr('src', logo);
                sellocationid = result['parentId'];
                getLocation(result['id'], "LOC", 'edit');
            }
            if (currentloc == locationId) {
                document.getElementById("parentid").style.display = "none";
                document.getElementById("pidnew").style.display;
                $("#pidnew").val(checkblank(getBranchID(result['parentId'])));
            }
            else {
                document.getElementById("pidnew").style.display = "none";
                setlist_locname("#parentid", sellocationid);
            }


        }
    });

}

function setlocId(locId, flag) {

    if (flag == 'edit') {
        sessionStorage.setItem("Locedit", locId);
        location.href = "create-location.html";
    }
    else if (flag == 'show') {

        $.ajax({
            type: "GET",
            contentType: "application/json;charset=utf-8",
            accept: "application/json",
            dataType: "json",
            global: false,
            async: false,
            url: hostname + "ClaimDeskWeb/services/v1/location/" + locId,
            headers: {
                "token": token,
                "userid": userId,
                "locationId": locationId
            },
            success: function (result) {
                $("#id").html(result['id']);
                $("#manager").html(checkblank(result['manager']));
                $("#branchid").html(checkblank(result['storeID']));
                $("#parentid").html(checkblank(getBranchID(result['parentId'])));
                $("#address1").html(checkblank(result['address']['addressLine1']));
                $("#address2").html(checkblank(result['address']['addressLine2']));
                $("#city").html(checkblank(result['address']['city']));
                $("#state").html(checkblank(result['address']['state']));
                $("#country").html(checkblank(result['address']['country']));
                $("#county").html(checkblank(result['address']['county']));
                $("#postalcode").html(checkblank(result['address']['postalCode']));
                getLocation(result['id'], "LOC", 'show');
            }

        });
    }
    else if (flag == 'delete') {
        var response = confirm("Do you want to delete this Location?");
        if (response) {
            $.ajax({
                type: "DELETE",
                contentType: "application/json;charset=utf-8",
                accept: "application/json",
                //dataType: "json",				
                url: hostname + "ClaimDeskWeb/services/v1/location/" + locId,
                headers: {
                    "token": token,
                    "userid": userId,
                    "locationId": locationId
                },
                success: function (result) {
                    location.href = "manage-location.html";
                }
            });
        }
    }
}

function save_location() {
    if ($("#locForm").valid()) {

        document.getElementById("save_but").disabled = true;

        var logostrx = '';

        if (document.getElementById("logo").files[0] && document.getElementById("logo").files[0].name != '') {
            logostrx = document.getElementById("logo").files[0].name;
        }
        else if (document.getElementById("dellogoid").checked != true) {
            logostrx = $("#hidden_img").val();
        }

        var a;
        if ($("#id").val() == locationId) {
            a = $("#p_id").val();
        }
        else {
            a = $("#parentid").val();
        }

        var jsonData = {
            "id": $("#id").val(),
            "manager": $("#manager").val(),
            "storeID": $("#branchid").val(),
            "parentId": a,
            //"phone":$("#phone").val(),
            //"fax":$("#fax").val()	,									
            "logo": logostrx,
            "address": {
                "addressLine1": $("#address1").val(),
                "addressLine2": $("#address2").val(),
                "city": $("#city").val(),
                "state": $("#state").val(),
                "county": $("#county").val(),
                "country": $("#country").val(),
                "postalCode": $("#postalcode").val()
            },
            'type': $('#locType').val()
        }
        debugger;
        
        $.ajax({
            type: "POST",
            contentType: "application/json;charset=utf-8",
            accept: "application/json",
            //dataType: "json",				
            url: hostname + "ClaimDeskWeb/services/v1/location",
            headers: {
                "token": token,
                "userid": userId,
                "locationId": locationId
            },
            data: JSON.stringify(jsonData),
            success: function (result) {

                var a1 = [];
                var inn = {};
                var inn1 = {};
                inn["contact_source"] = "LOC";
                inn["contact_resourse_id"] = result;
                inn["contact_type_id"] = "WORK_PHONE";
                inn["value"] = $("#phone").val();
                a1.push(inn)
                inn1["contact_source"] = "LOC";
                inn1["contact_resourse_id"] = result;
                inn1["contact_type_id"] = "FAX";
                inn1["value"] = $("#fax").val();
                a1.push(inn1)

                SetContact(a1);
                upload_file(result);

            }
        });
        
    }
}

function getByBranchID() {
    var isedit = false;
    if ($("#id").val() != "") isedit = true;
    var oldbranchid = $("#hidden_branchid").val();
    var newbranchid = document.getElementById("branchid").value;

    //alert(oldbranchid +"\\\\"+newbranchid);

    if (!isedit || (isedit && oldbranchid != newbranchid)) {
        $.ajax({
            type: "GET",
            contentType: "application/json;charset=utf-8",
            accept: "application/json",
            dataType: "json",
            url: hostname + "ClaimDeskWeb/services/v1/location/branch/" + document.getElementById("branchid").value,
            headers: {
                "token": token,
                "userid": userId,
                "locationId": locationId
            },

            success: function (result) {
                if (result["storeID"] == 'Not Found') {
                    $("#existornot").html("");
                }
                else {
                    var id = $('#branchid').val();
                    ///alert(id);
                    $("#existornot").html("Location [" + $('#branchid').val() + "] already exist.");
                    $("#branchid").val(oldbranchid);
                }
            }
        });
    }
}




function upload_file(locid) {

    //show img
    var fname = $('#hidden_img').val();
    var formData = new FormData($('#locForm')[0]);
    // var a = $("#logo").val();
    if (document.getElementById("logo").files[0])
        var a = document.getElementById("logo").files[0].name;

    if (a) {

        document.getElementById("pr_img").style.display = "block";
        var xhr = new XMLHttpRequest;

        xhr.open("POST", hostname + "ClaimDeskWeb/services/v1/location/uploadFile/" + locid);


        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("pr_img").style.display = "none";
                location.href = "manage-location.html";
            }
        }


        xhr.setRequestHeader("token", token);
        xhr.setRequestHeader("userid", userId);
        xhr.setRequestHeader("locationId", locationId);
        xhr.overrideMimeType("application/octet-stream; charset=x-user-defined;");
        xhr.send(formData);

    }
    else {
        location.href = "manage-location.html";
    }

}




function getBranchID(parentId) {
    var bid;
    if (parentId && parentId != '') {
        $.ajax({
            type: "GET",
            contentType: "application/json;charset=utf-8",
            accept: "application/json",
            dataType: "json",
            global: false,
            async: false,
            url: hostname + "ClaimDeskWeb/services/v1/location/" + parentId,
            headers: {
                "token": token,
                "userid": userId,
                "locationId": locationId
            },
            success: function (result) {
                if (result && result['storeID']) bid = result['storeID'];
            }
        });
    }

    return (bid);
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#logimg')
                .attr('src', e.target.result)
                .width(100)
                .height(100);
        };

        reader.readAsDataURL(input.files[0]);
    }
}
function set_header() {
    var firstName = sessionStorage.getItem("firstName");
    var lastName = sessionStorage.getItem("lastName");
    var address = sessionStorage.getItem("address");
    var storeId = sessionStorage.getItem("storeId");
    if (sessionStorage.getItem("logo") && sessionStorage.getItem("logo") != '' && sessionStorage.getItem("logo") != 'null')
        // var logo =  "images/logo/"+locationId+"/"+sessionStorage.getItem("logo");
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
    //$(".poloRight").html("<img width='50' height='50' alt='img' src='"+logo+"'/>");	
    //	 aboutInfo();
}
function SetContact(list) {


    $.ajax({
        type: "POST",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        global: false,
        async: false,
        data: JSON.stringify(list),
        url: hostname + "ClaimDeskWeb/services/v1/code/contact",
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {


        }
    });


}

function getLocation(id, type, flag) {


    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        global: false,
        async: false,

        url: hostname + "ClaimDeskWeb/services/v1/code/contact/" + id + "/" + type,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {
            //	for (i = 0; i < result.length; i++) {

            if (result[0] && result[0]['contact_resourse_id'] == "WORK_PHONE") {
                if (flag == 'edit') $("#phone").val(result[0]['value']);
                else $("#phone").html(result[0]['value']);
            }
            if (result[1] && result[1]['contact_resourse_id'] == "FAX") {
                if (flag == 'edit') $("#fax").val(result[1]['value']);
                else $("#fax").html(result[1]['value']);
            }

            //	}
        }
    });


}




function toBinaryString(data) {
    var ret = [];
    var len = data.length;
    var byte;
    for (var i = 0; i < len; i++) {
        byte = (data.charCodeAt(i) & 0xFF) >>> 0;
        ret.push(String.fromCharCode(byte));
    }

    return ret.join('');
}

function Logodownload(str1, str2) {
    if ("undefined" == str2) {
        return;
    }
    document.getElementById("pr_img").style.display = "block";
    var xhr = new XMLHttpRequest;

    xhr.open("GET", hostname + "ClaimDeskWeb/services/v1/location/downloadFile/" + str1 + "/" + str2.trim());
    xhr.addEventListener("load", function () {
        document.getElementById("pr_img").style.display = "none";
        var data = toBinaryString(this.responseText);
        data = "data:application/octet-stream;base64,  " + btoa(data);
        var image = new Image();
        $('#logimg').attr('src', data);
        document.getElementById('delimgmsg').style.display = "block";

    }, false);

    xhr.setRequestHeader("token", token);
    xhr.setRequestHeader("userid", userId);
    xhr.setRequestHeader("locationId", locationId);
    xhr.overrideMimeType("application/octet-stream; charset=x-user-defined;");
    xhr.send(null);

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
                //alert(JSON.stringify(result));
                document.getElementById("old_pass").value = "";
                document.getElementById("new_pass").value = "";
                document.getElementById("con_new_pass").value = "";
                $("#msg_show").html(result['result']);
            },
            error: function (request, status, error) {
                // alert("error");
                document.getElementById("old_pass").value = "";
                document.getElementById("new_pass").value = "";
                document.getElementById("con_new_pass").value = "";
                var msg = request.responseJSON['errors']['error'][0]['description'];
                $("#msg_show").html(msg);
            }
        });
    }
}

function aboutInfo() {
    var attr = JSON.parse(checkblank(sessionStorage.getItem("attr")));
    var key_val = JSON.parse(checkblank(sessionStorage.getItem("key_val")));
    var str = "";
    for (var key in attr) {
        str += '<div  style="float:left; width:50%"><span id="attribute" style="width: 100% !important;">' + attr[key] + '</span></div><div style="float:right; width:48%"><span id="key_val"  style="width: 100% !important;">:' + key_val[key] + '</span></div>';
    }

    $("#about_info").html(str);
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
                //	attr.push(Object.keys(result)[i++]);
                //	key_val.push(result[key]);
                str += '<div  style="float:left; width:30%"><span id="attribute" style="width: 100% !important;">' + Object.keys(result)[i++] + '</span></div><div style="float:right; width:68%"><span id="key_val"  style="width: 100% !important;">:' + result[key] + '</span></div>';

            }
            //	sessionStorage.setItem("attr",JSON.stringify(attr));
            //	sessionStorage.setItem("key_val",JSON.stringify(key_val));
            $("#about_info").html(str);
        }
    });
    return "";

}