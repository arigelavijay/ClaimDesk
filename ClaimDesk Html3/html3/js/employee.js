var userId = sessionStorage.getItem("userid");
var token = sessionStorage.getItem("token");
var locationId = sessionStorage.getItem("locationId");

var sellocationid = '';
var selmanagerid = '';
var predeptval = '';
var emptypeval = '';
var classval = '';
var jclassval = '';
var mstatval = '';
var occval = '';

function authentication() {
    if (userId == '' || userId == null) {
        apprise("Please Login Before Proceed.")
        window.location = "index.html";
    }

}

function loadData1() {
    
    sessionStorage.removeItem("Empedit");
    /*
    var dataSet = '';

    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        cache: false,
        url: hostname + "ClaimDeskWeb/services/v1/employee/getall",
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },


        success: function (result) {
            debugger;
            var dataSet = [];
            var getlocarr = {};

            for (var key in result) {
                var objinner = [];

                objinner.push(result[key]['firstName']);
                objinner.push(result[key]['lastName']);
                objinner.push(result[key]['empid']);
                objinner.push(result[key]['title']);
                if (!getlocarr[result[key]['locationid']]) {
                    var add = getBranchID(result[key]['locationid']);
                    getlocarr[result[key]['locationid']] = add;
                }

                if (result[key]['locationid']) objinner.push(getlocarr[result[key]['locationid']]);
                else

                    objinner.push('--');



                objinner.push(result[key]['emailAddress']);

                var str = "<ul class='manageIcon1'><li data-toggle='modal' data-target='.bs-example-modal-lg'><img src='images/min1.png' width='16' height='19' alt='img' onclick='setlocId(" + result[key]['id'] + ",\"show\")'></li><li><a href='#'><img src='images/min2.png' width='16' height='19' alt='img' onclick=\"setlocId('" + result[key]['id'] + "','edit')\"></a></li><li><a href='#'><img src='images/min5.png' width='16' height='19' alt='img' onclick=\"setlocId('" + result[key]['id'] + "','delete')\"></a></li></ul>";

                objinner.push(str);

                dataSet.push(objinner);
            }
            $('#example1').dataTable({
                "bStateSave": true,
                "sPaginationType": "full_numbers",
                "bProcessing": true,
                "bSortClasses": false,
                "bDeferRender": true,
                "aaData": dataSet,
                "aoColumns": [
                    { "sWidth": "8%" },
                    { "sWidth": "8%" },
                    { "sWidth": "4%" },
                    { "sWidth": "8%" },
                    { "sWidth": "5%" },
                    { "sWidth": "8%" },
                    { "bSortable": false, "sWidth": "6%" }]

            });
            var oTable = $('#example1').dataTable();

            // Sort immediately with columns 0 and 1
            oTable.fnSort([[1, 'asc']]);

        }
    });
    */
    
    var obj = {};
    obj.locations = [locationId];

    Search(obj, 'ClaimDeskWeb/services/v1/search/employee/advancedSearch');
    
}


function loadData() {
    
    sessionStorage.removeItem("Empedit");
    var oTable = $('#example1').dataTable({
        "bStateSave": true,
        "sPaginationType": "full_numbers",
        "bServerSide": true,
        "bProcessing": true,
        "bSortClasses": false,
        "bDeferRender": true,
        "sAjaxSource": hostname + "ClaimDeskWeb/services/v1/employee/getEmpList",
        "bFilter": false,
        //"bInfo": false,
        "aoColumns": [null, null, null, null, null, null, { "bSortable": false }],
        "aaSorting": [[1, "asc"]],
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

            //limit=3&offset=0&sort_col=0&sort=asc
            oSettings.jqXHR = $.ajax({
                "type": "GET",
                "contentType": "application/json;charset=utf-8",
                "accept": "application/json",
                "dataType": "json",
                cache: false,
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
                    for (var key in result["emp"]) {



                        var objinner = [];

                        objinner.push(typeof result["emp"][key]['firstName'] != 'undefined' ? result["emp"][key]['firstName'] : '');
                        objinner.push(typeof result["emp"][key]['lastName'] != 'undefined' ? result["emp"][key]['lastName'] : '');
                        objinner.push(typeof result["emp"][key]['empid'] != 'undefined' ? result["emp"][key]['empid'] : '');
                        objinner.push(typeof result["emp"][key]['title'] != 'undefined' ? result["emp"][key]['title'] : '');
                        objinner.push(typeof result["emp"][key]['emailAddress'] != 'undefined' ? result["emp"][key]['emailAddress'] : '');
                        objinner.push(typeof result["emp"][key]['branchId'] != 'undefined' ? result["emp"][key]['branchId'] : '');

                        var strlink = "<ul class='manageIcon1'><li data-toggle='modal' data-target='.bs-example-modal-lg'><img src='images/min1.png' width='16' height='19' alt='img' onclick='setlocId(" + result["emp"][key]['id'] + ",\"show\")'></li><li><a href='#'><img src='images/min2.png' width='16' height='19' alt='img' onclick=\"setlocId('" + result["emp"][key]['id'] + "','edit')\"></a></li><li><a href='#'><img src='images/min5.png' width='16' height='19' alt='img' onclick=\"setlocId('" + result["emp"][key]['id'] + "','delete')\"></a></li></ul>";



                        objinner.push(strlink);
                        dataSet.push(objinner);
                    }

                    tempdset["sEcho"] = sEcho;
                    tempdset["iTotalRecords"] = result['totalRecord'];
                    tempdset["iTotalDisplayRecords"] = result['totalRecord'];
                    tempdset["aaData"] = dataSet
                    //alert(JSON.stringify(dataSet));	
                    fnCallback(tempdset);
                }
            });
        }
    });

    //oTable.fnSort([[1, 'asc']]);
    /*
    var obj = {};
    obj.locations = [locationId];

    Search(obj, 'ClaimDeskWeb/services/v1/search/employee/advancedSearch');
    */
}

function createPageLoad() {

    var currentemp = sessionStorage.getItem("Empedit");
    if (currentemp) {
        $.ajax({
            type: "GET",
            contentType: "application/json;charset=utf-8",
            accept: "application/json",
            dataType: "json",
            global: false,
            async: false,
            cache: false,
            url: hostname + "ClaimDeskWeb/services/v1/employee/" + currentemp,
            headers: {
                "token": token,
                "userid": userId,
                "locationId": locationId
            },
            success: function (result) {               
                
                sessionStorage.setItem("loc_Id", result['locationid'])
                $("#id").val(result['id']);
                $("#empid").val(result['empid']);
                $("#firstName").val(result['firstName']);
                $("#lastName").val(result['lastName']);
                $("#middleName").val(result['middleName']);
                $("#preferredName").val(result['preferredName']);
                $("#gender").val(result['gender']);
                $("#dob").val(result['dob']);
                //$("#maritalStatus").val(result['maritalStatus']);	
                $("#dependents").val(result['dependents']);
                $("#nationalId").val(result['nationalId']);
                $("#emailAddress").val(result['emailAddress']);
                $("#address1").val(result['address']['addressLine1']);
                $("#address2").val(result['address']['addressLine2']);
                $("#city").val(result['address']['city']);
                $("#state").val(result['address']['state']);
                $("#country").val(result['address']['country']);
                $("#county").val(result['address']['county']);
                $("#zip").val(result['address']['postalCode']);
                $("#employmentid").val(result['emailAddress']);
                $("#eid").val(result['eid']);
                $("#locationid").val(result['locationid']);
                $("#title").val(result['title']);
                $("#department").val(result['department']);
                //$("#occupation").val(result['occupation']);	
                $("#hiredate").val(result['hiredate']);
                $("#terminatedate").val(result['terminatedate']);
                $("#wage").val(result['wage']);
                $("#employmentdependents").val(result['employmentdependents']);
                $("#comprate").val(result['comprate']);
                $("#comperiod").val(result['comperiod']);
                //$("#classcode").val(result['classcode']);
                //$("#jobclass").val(result['jobclass']);
                
                //$("#type").val(result['type']);
                $("#managerid").val(result['managerid']);
                $("#contact").val(result['contact']);
                $("#ext").val(result['ext']);
                selmanagerid = result['managerid'];
                sellocationid = result['locationid'];
                predeptval = result['department'];
                emptypeval = result['type'];
                classval = result['classcode'];
                jclassval = result['jobclass'];
                mstatval = result['maritalStatus'];
                occval = result['occupation'];
                /* code:Department Codes ---Employee Contact Types---Employee Disability Types---Employee Status---Occupation Codes---Team Codes---Class Codes---Job Classification---Marital Status*/
                set_codes_list_Emp("E_JOB_CLASSIFICATION", "#jobclass", jclassval, locationId);
                setlist_emptype_emp("#type", emptypeval);
            }
        });
    }
    else {
        sessionStorage.removeItem("loc_Id");
        set_codes_list_Emp("E_JOB_CLASSIFICATION", "#jobclass", '', locationId);
        setlist_emptype_emp("#type", '');
    }

    setlist_locname("#locationid", sessionStorage.getItem("loc_Id"));
    setlist_empname("#managerid", selmanagerid);
    
    set_codes_list("E_DEPT", "#department", predeptval, locationId);
    set_codes_list("E_CLASS_CODE", "#classcode", classval, locationId);
    
    set_codes_list("E_MARITAL_STATUS", "#maritalStatus", mstatval, locationId);
    set_codes_list("E_OCCUPATION", "#occupation", occval, locationId);


    // $("#locationid").prop('enable', true);	

    $(".date-picker").datepicker();

    $(".date-picker").on("change", function () {
        var id = $(this).attr("id");
        var val = $("label[for='" + id + "']").text();
        $("#msg").text(val + " changed");
    });

    sortDropDownListByText();

}


function setlocId(locId, flag) {
    if (flag == 'show') {

        $.ajax({
            type: "GET",
            contentType: "application/json;charset=utf-8",
            accept: "application/json",
            dataType: "json",
            cache: false,
            url: hostname + "ClaimDeskWeb/services/v1/employee/" + locId,
            headers: {
                "token": token,
                "userid": userId,
                "locationId": locationId
            },
            success: function (result) {
                // alert(JSON.stringify(result)) ;

                $("#eid").html(checkblank(result['empid']));
                $("#fname").html(checkblank(result['firstName']));
                $("#mname").html(checkblank(result['middleName']));
                $("#lname").html(checkblank(result['lastName']));
                $("#pname").html(checkblank(result['preferredName']));
                $("#gender").html(checkblank(result['gender']));
                $("#dob").html(checkdate(result['dob']));
                $("#ms").html(checkblank(result['maritalStatus']));
                $("#nodep").html(checkzero(result['dependents']));
                $("#ssn").html(checkblank(result['nationalId']));
                $("#empid").html(checkblank(result['emailAddress']));
                $("#add1").html(checkblank(result['address']['addressLine1']));
                $("#add2").html(checkblank(result['address']['addressLine2']));
                $("#city").html(checkblank(result['address']['city']));
                $("#country").html(checkblank(result['address']['country']));
                $("#pcode").html(checkzero(result['address']['postalCode']));
                $("#location").html(checkzero(result['locationid']));
                $("#dept").html(checkblank(result['department']));
                $("#occupation").html(checkblank(result['occupation']));
                $("#title").html(checkblank(result['title']));
                $("#managerid").html(checkzero(result['managerid']));
                $("#hiredate").html(checkdate(result['hiredate']));
                $("#terminatedate").html(checkdate(result['terminatedate']));
                $("#wage").html(checkblank(result['wage']));
                $("#comprate").html(checkblank(result['comprate']));
                $("#comperiod").html(checkzero(result['comperiod']));
                //$("#classcode").html(checkblank(result['classcode'])); 
                $("#jobclass").html(checkblank(result['jobclass']));
                $("#type").html(checkblank(result['type']));
                $("#contact").html(checkblank(result['contact']));
                setsingle_locname("#location", result['locationid']);
                setsingle_empname("#managerid", result['managerid']);
            }

        });


    }
    else if (flag == 'edit') {
        sessionStorage.setItem("Empedit", locId);
        location.href = "create-employee.html";
    }
    else if (flag == 'delete') {
        var response = confirm("Do you want to delete this employee?");
        if (response) {
            $.ajax({
                type: "DELETE",
                contentType: "application/json;charset=utf-8",
                accept: "application/json",
                //dataType: "json",				
                url: hostname + "ClaimDeskWeb/services/v1/employee/" + locId,
                headers: {
                    "token": token,
                    "userid": userId,
                    "locationId": locationId
                },
                success: function (result) {
                    location.reload();
                }
            });
        }
    }
}

function save_employee() {

    if ($("#frmempl").valid()) {
        document.getElementById("save_but").disabled = true;

        var jsonData = {
            "id": $("#id").val(),
            "empid": $("#empid").val(),
            "firstName": $("#firstName").val(),
            "lastName": $("#lastName").val(),
            "middleName": $("#middleName").val(),
            "preferredName": $("#preferredName").val(),
            "gender": $("#gender").val(),
            "dob": $("#dob").val(),
            "maritalStatus": $("#maritalStatus").val(),
            "dependents": $("#dependents").val(),
            "nationalId": $("#nationalId").val(),
            "emailAddress": $("#emailAddress").val(),
            "address": {
                "addressLine1": $("#address1").val(),
                "addressLine2": $("#address2").val(),
                "city": $("#city").val(),
                "state": $("#state").val(),
                "country": $("#country").val(),
                "county": $("#county").val(),
                "postalCode": $("#zip").val()
            },
            "employmentid": $("#employmentid").val(),
            "eid": $("#eid").val(),
            "locationid": $("#locationid").val(),
            "title": $("#title").val(),
            "department": $("#department").val(),
            "occupation": $("#occupation").val(),
            "hiredate": $("#hiredate").val(),
            "terminatedate": $("#terminatedate").val(),
            "wage": $("#wage").val(),
            "employmentdependents": $("#employmentdependents").val(),
            "comprate": $("#comprate").val(),
            "comperiod": $("#comperiod").val(),
            "classcode": $("#classcode").val(),
            "jobclass": $("#jobclass").val(),
            "type": $("#type").val(),
            "managerid": $("#managerid").val(),
            "contact": $("#contact").val(),
            "ext": $("#ext").val()
        }


        $.ajax({
            type: "POST",
            contentType: "application/json;charset=utf-8",
            accept: "application/json",
            //dataType: "json",				
            url: hostname + "ClaimDeskWeb/services/v1/employee",
            headers: {
                "token": token,
                "userid": userId,
                "locationId": locationId
            },
            data: JSON.stringify(jsonData),
            success: function (result) {
                location.href = "manage-employee.html";
            }
        });

    }


}

function setsingle_locname(fieldname, locationid) {
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        cache: false,
        url: hostname + "ClaimDeskWeb/services/v1/location/" + locationid,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {
            $(fieldname).html(result['storeID']);
        }
    });
}


function setsingle_empname(fieldname, empid) {
    if (empid > 0) {
        $.ajax({
            type: "GET",
            contentType: "application/json;charset=utf-8",
            accept: "application/json",
            dataType: "json",
            cache: false,
            url: hostname + "ClaimDeskWeb/services/v1/employee/" + empid,
            headers: {
                "token": token,
                "userid": userId,
                "locationId": locationId
            },
            success: function (result) {
                $(fieldname).html(result['firstName'] + " " + result['lastName']);
            }
        });
    }
    else {
        $(fieldname).html('NA');
    }
}

function getParent() {
    var currentemp = sessionStorage.getItem("Empedit");
    var empid = document.getElementById("managerid");
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        cache: false,
        url: hostname + "ClaimDeskWeb/services/v1/employee/" + empid,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {
            $(fieldname).html(result['firstName'] + " " + result['lastName']);
        }
    });
}

function chkempid() {

    var userId = sessionStorage.getItem("userid");
    var token = sessionStorage.getItem("token");
    var locationId = sessionStorage.getItem("locationId");
    var firstName = sessionStorage.getItem("firstName");
    var lastName = sessionStorage.getItem("lastName");


    var empid = document.getElementById("empid").value;
    if (empid != '') {
        $.ajax({
            type: "GET",
            contentType: "application/json;charset=utf-8",
            accept: "application/json",
            dataType: "json",
            cache: false,
            url: hostname + "ClaimDeskWeb/services/v1/employee/getbyempid/" + empid,
            headers: {
                "token": token,
                "userid": userId,
                "locationId": locationId
            },
            success: function (result) {
                debugger;
                if (result['id'] == '' || result['id'] == '0') {
                    //alert("No Record");
                    $("#exitornot").html("");
                }
                else {
                    $("#exitornot").html("Emp ID already exist.");
                }
            }
        });
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

function getBranchID(parentId) {
    var bid;

    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        global: false,
        async: false,
        cache: false,
        url: hostname + "ClaimDeskWeb/services/v1/location/" + parentId,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {
            //alert(result);
            bid = result['storeID'];
        }
    });

    return (bid);
}
function sortDropDownListByText() {
    // Loop for each select element on the page.
    $("select").each(function () {

        var selectedValue = $(this).val();

        // Sort all the options by text. I could easily sort these by val.
        $(this).html($("option", $(this)).sort(function (a, b) {

            return a.text.toLowerCase() == b.text.toLowerCase() ? 0 : a.text.toLowerCase() < b.text.toLowerCase() ? -1 : 1
        }));

        // Select one option.
        $(this).val(selectedValue);
    });
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
                //			attr.push(Object.keys(result)[i++]);
                //			key_val.push(result[key]);
                str += '<div  style="float:left; width:30%"><span id="attribute" style="width: 100% !important;">' + Object.keys(result)[i++] + '</span></div><div style="float:right; width:68%"><span id="key_val"  style="width: 100% !important;">:' + result[key] + '</span></div>';

            }
            //	sessionStorage.setItem("attr",JSON.stringify(attr));
            //	sessionStorage.setItem("key_val",JSON.stringify(key_val));
            $("#about_info").html(str);
        }
    });
    return "";

}