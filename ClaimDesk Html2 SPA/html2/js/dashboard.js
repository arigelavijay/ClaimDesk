var userId = sessionStorage.getItem("userid");
var token = sessionStorage.getItem("token");
var locationId = sessionStorage.getItem("locationId");
var getuserarr = {};
var getlocarr = {};
var getincarr = {};
var dataTableArr = {}
var dataSetArr = {}


function dashboardload() {
    
    if (userId == '' || userId == null) {
        apprise("Please Login Before Proceed.")
        window.location = "login.html";
    }
    else {
        //getLoginDetails(userId);
        //getLocationDetails(locationId);        
    }

    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        cache: false,
        url: hostname + "ClaimDeskWeb/services/v1/incident/count",
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {

            $("#last_30_days_record").html(result['incident']);
            $("#claims_last_30_days_record").html(result['claim']);
            $("#claim_Created_last_30_days").html(result['claimCount']);

        }
    });
    loadDashboardTable(0);
    loadDashboardTable(2);
}

function loadDashboardTable(option) {
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        cache: false,
        url: hostname + "ClaimDeskWeb/services/v1/claim/getClaimList/" + option,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {            
            populateDate(result, option);
        }
    });
}

function populateDate(result, option) {    
    var dataSet = dataSetArr[option];    
    if (!dataSet) {
        dataSet = [];
        dataSetArr[option] = dataSet;
    }
    else {
        var len = dataSet.length;
        while (len--) {
            dataSet.pop();
        }
    }
    for (var key in result) {        
        //getNotesByClaimId(result[key]['id'], 'claim_notes', true);
        
        var objinner = [];
        objinner.push(result[key]['claimId']);
        objinner.push(result[key]['incidentDate']);
        objinner.push(result[key]['guestName'])
        objinner.push(result[key]['claimType']);
        if (userId != result[key]['userId']) {
            objinner.push(getValue(result[key]['username']));
        }
        objinner.push(result[key]['locationId'] + ", " + result[key]['address']);
        var image;
        var title;
        if (result[key]['status'] == "ACTIVE") {
            image = "mark.png";
            title = "ACTIVE";
        }
        else if (result[key]['status'] == "APPROVED") {
            image = "approved.png";
            title = "APPROVED";
        }
        else if (result[key]['status'] == "DECLINED") {
            image = "declined.png";
            title = "DECLINED";
        }
        objinner.push(result[key]['created']);
        var str;
        if (result[key]['status'] == "ACTIVE") {
            str = "<ul class='manageIcon1'><li><img  width='16' height='16'  title='" + title + "' src='images/" + image + "' alt='img'></li><li data-toggle='modal' data-target='" + (result[key].type == "WC" ? ".wc-claim-modal" : ".gl-claim-modal")
                + "' style='cursor:pointer;'><img id='img_" + result[key]['claimId'] + "' data-claim-type='" + result[key].type + "' data-hasdiary-note='" + (result[key]['diaryNotes'] ? true : false) + "' data-incident-locid='" + result[key]['locationId'] + "' src='images/min1.png' width='16' height='19' alt='img' onclick='setDashBoardlocId("
                + result[key]['claimId'] + ",\"" + (result[key].type == "WC" ? "show_WC" : "show") + "\")'></li><li style='cursor:pointer;'><img src='images/min2.png' width='16' height='19' alt='img' onclick=\"setDashBoardlocId('"
                + result[key]['claimId'] + "','" + (result[key].type == "WC" ? "edit_wc" : "edit") + "')\"></li>"
                + DiaryNoteImage(result[key]['diaryNotes'], result[key]['claimId']) + getTypeOfClaim(result[key].claimId, result[key].type) + "</ul>";
        }
        else {
            str = "<ul class='manageIcon1'><li><img  width='16' height='16' title='" + title + "' src='images/" + image
                + "' alt='img'></li><li data-toggle='modal' data-target='" + (result[key].type == "WC" ? ".wc-claim-modal" : ".gl-claim-modal")
                + "' style='cursor:pointer;'><img id='img_" + result[key]['claimId'] + "' data-claim-type='" + result[key].type + "' data-hasdiary-note='" + (result[key]['diaryNotes'] ? true : false) + "' data-incident-locid='" + result[key]['locationId']
                + "' src='images/min1.png' width='16' height='19' alt='img' onclick='setDashBoardlocId(" + result[key]['claimId'] + ",\"" + (result[key].type == "WC" ? "show_WC" : "show") + "\")'></li><li style='cursor:pointer;'><img src='images/min2.png' width='16' height='19' alt='img' onclick=\"setDashBoardlocId('"
                + result[key]['claimId'] + "','" + (result[key].type == "WC" ? "edit_wc" : "edit") + "')\"></li>" + DiaryNoteImage(result[key]['diaryNotes'], result[key]['claimId'])
                + getTypeOfClaim(result[key].claimId, result[key].type) + "</ul>";
        }
        objinner.push(str);
        var datecreated = result[key]['created'];
        var dateupdated = result[key]['updated'];

        dataSet.push(objinner);
    }    
    
    //var t = dataTableArr[option];
    
    if (!dataTableArr[option]) {        
        var dt = $('#claimTable' + option).dataTable({
            "bStateSave": true,
            "bPaginate": false,
            "bFilter": false,
            "bProcessing": true,
            "bSortClasses": false,
            "bDeferRender": true,
            "bInfo": false,
            "aaSorting": [[0, "desc"]],
            "aaData": dataSet

        });
        dataTableArr[option] = dt;
    }
    else {
        dataTableArr[option].fnDraw();
    }


}
function getLoginDetails(userId) {
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        cache: false,
        url: hostname + "ClaimDeskWeb/services/v1/user/" + userId,
        headers: {
            "token": sessionStorage.getItem("token"),
            "userid": sessionStorage.getItem("userid"),
            "locationId": sessionStorage.getItem("locationId")
        },
        success: function (result) {
            var fname = result['firstName'];
            var lname = result['lastName'];
            var email = result['email'];

            sessionStorage.setItem("firstName", fname);
            sessionStorage.setItem("lastName", lname);
            sessionStorage.setItem("email", email);
            $("#logname").html(fname + " " + lname);
        }
    });
}

function getLocationDetails(locationId) {
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        cache: false,
        url: hostname + "ClaimDeskWeb/services/v1/location/" + locationId,
        headers: {
            "token": sessionStorage.getItem("token"),
            "userid": sessionStorage.getItem("userid"),
            "locationId": sessionStorage.getItem("locationId")
        },
        success: function (result) {            
            var storeId = result['storeID'];
            var logo = result['logo'];

            var address = result['address']['addressLine1'];


            if (result['address']['addressLine2']) address += ", " + result['address']['addressLine2'];
            if (result['address']['city']) address += ", " + result['address']['city'];
            if (result['address']['state']) address += ", " + result['address']['state'];
            if (result['address']['zip']) address += ", " + result['address']['zip'];

            sessionStorage.setItem("address", address);
            sessionStorage.setItem("storeId", storeId);
            if(logo){
            	sessionStorage.setItem("logo", logo);
            }

            if (logo != '' && logo) {
                downloadLogo(locationId, logo);
                //	var logo = "upimg/logo/"+sessionStorage.getItem("logo");
            }
            else var logo = "images/no-logo.png";

            if (storeId == 'ELHQ') {
                $(".poloText").html("<p>El Pollo Loco, # " + storeId + " </p>" + address);
                $(".poloRight").html("<img width='50' height='50' alt='img' src='" + logo + "'/>");
            }
            else {
                $(".poloText").html("<p>" + storeId + " </p>" + address);
                $(".poloRight").html("<img width='50' height='50' alt='img' src='" + logo + "'/>");
            }
            

        }
    });
}
function getlocdetails(locid) {
    
    var storeid = "--";
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        global: false,
        async: false,
        cache: false,
        url: hostname + "ClaimDeskWeb/services/v1/location/" + locid,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {
            if (result && result['storeID']) storeid = result['storeID'];

        }
    });
    return (storeid);
}

function getInc_createdBy(uid) {
    var uname = "--";
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        global: false,
        async: false,
        cache: false,
        url: hostname + "ClaimDeskWeb/services/v1/user/" + uid,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {
            if (result && result['firstName']) uname = result['firstName'] + " " + result['lastName'];
        }
    });
    return (uname);
}

function btn_Create_OnClick(claim_id) {    
    if (claim_id != -1) {        
        if ($('#btn_Create_wc').exists()) {
            var incLocId = $('#img_' + claim_id)[0].getAttribute('data-incident-locid');
            $('#view').jqExLoad('views/wc.html', function () {
                dashboardloadOnInit('', incLocId);
                $('#hdn_Claim_Id').val(claim_id);
                $('#hdn_incLocId').val(incLocId);
                $('#hdn_CreatediaryNotes').val(true);
                $('#hdn_hasDiaryNote').val('');
            }).hide().fadeIn();
        }
        else {
            var claimType = $('#img_' + claim_id)[0].getAttribute('data-claim-type');
            if (claimType == 'WC') {
                var incLocId =  $('#img_' + claim_id)[0].getAttribute('data-incident-locid');                                

                $('#view').jqExLoad('views/wc.html', function () {
                    dashboardloadOnInit('', incLocId);
                    $('#hdn_Claim_Id').val(claim_id);
                    $('#hdn_incLocId').val(incLocId);
                    $('#hdn_CreatediaryNotes').val(true);
                    $('#hdn_hasDiaryNote').val('');
                }).hide().fadeIn();
            }
            else {
                $('#view').jqExLoad('views/edit-claim.html', function () {
                    $('#hdn_Claim_Id').val(claim_id);
                    $('#hdn_CreatediaryNotes').val(true);
                    createEditClaimPageLoad(claim_id);
                }).hide().fadeIn();
            }
        }        
    }
    else {
        btn_AddNote_OnClick(claim_id);
    }
}

function YesOrNo(Val) {
    return Val ? 'Yes' : 'No';
}
// functio for edit delete view 
function setDashBoardlocId(locId, flag) {    
    if (flag == 'show') {
        $.ajax({
            type: "GET",
            contentType: "application/json;charset=utf-8",
            accept: "application/json",
            dataType: "json",
            cache: false,
            url: hostname + "ClaimDeskWeb/services/v1/claim/" + locId,
            headers: {
                "token": token,
                "userid": userId,
                "locationId": locationId
            },
            success: function (result) {
                getNotesByClaimId(locId, 'claim_notes', true);
                document.getElementById("thirdParty").style.display = 'none';
                document.getElementById("insurer").style.display = 'none';
                $("#claim_id").html(locId);
                $("#incident_id").html(result["incidentId"]);
                $("#claim_desc").html(result["description"]);
                //$("#claim_notes").html(result["note"]);
                showincdetails1(result["incidentId"]);
                if (result['guest'].length > 0) {
                    var str = '<li class="popInn"><h2 class="popSubHead">Guest Details</h2>';
                    for (var b = 0; b < result['guest'].length; b++) {
                        var obj = result['guest'][b];
                        var age = checkblank(result['guest'][b]['age']);
                        if (age == -1) {
                            age = "UNKNOWN";
                        }
                        str += '<div style="background-color:#ebebeb; margin-bottom:5px; padding:0 3px 10px 6px;"><div class="formInci1"><p><span class="headspan">ID:</span><span id="gid">' + checkblank(result['guest'][b]['identifier']) + '</span></p><p><span class="headspan">First Name:</span><span id="gfname">' + checkblank(result['guest'][b]['firstName']) + '</span></p><p><span class="headspan">Last Name:</span><span id="glname">' + checkblank(result['guest'][b]['lastName']) + '</span></p><p><span class="headspan">Parent Name: </span><span id="gparent">' + checkblank(result['guest'][b]['parent']) + '</span></p></div><div class="formInci"><p><span class="headspan">Country:</span><span id="gcountry">United States</span></p><p><span class="headspan">State:</span><span id="gstate">' + checkblank(result['guest'][b]['state']) + '</span></p><p><span class="headspan">Age:</span><span id="gage">' + age + '</span></p><p><span class="headspan">Email ID: </span><span id="gemail">' + checkblank(result['guest'][b]['email']) + '</span></p></div><div class="formInci"><p><span class="headspan">Home Phone: </span><span id="ghomeph">' + checkblank(result['guest'][b]['homePhone']) + '</span></p><p><span class="headspan">Work Phone:</span><span id="gworkph">' + checkblank(result['guest'][b]['workPhone']) + '</span></p></div><div class="clear"></div></div>';

                    }
                    str += '</li>';
                }

                $("#guest_container").html(str);

                //=========================================================		
                //	< span id> . table field name
                if (result['claim_type'] == 'Illness') {

                    document.getElementById("injury_div").style.display = 'none';
                    document.getElementById("other_div").style.display = 'none';
                    if (result['illness']) {
                        document.getElementById("illness_div").style.display = 'block';
                        $("#Date_Product_Purchased").html(ymdTomdy(checkblank(result['illness']['date_prod_purchase'])));
                        $("#Purchased_Time").html(checkblank(result['illness']['time_prod_purchase']));

                        $("#What_guest_order").html(checkblank(result['illness']['guest_order_list']));
                        $("#What_guest_eat").html(checkblank(result['illness']['eaten_by_guest']));
                        $("#Where_guest_eat").html(checkblank(result['illness']['recipt_name']));
                        $("#Receipt").html(checkblank(result['illness']['recipt_Y_N']));
                        $("#Receipt_Number").html(checkblank(result['illness']['recipt_no']));
                        $("#Receipt_Date").html(ymdTomdy(checkblank(result['illness']['recipt_date'])));
                        $("#Receipt_Time").html(checkblank(result['illness']['illness_time']));

                        $("#Illness_Symptoms").html(checkblank(result['illness']['illness_symptoms']));
                        $("#Illness_Date").html(ymdTomdy(checkblank(result['illness']['illness_date'])));
                        $("#Illness_Time").html(checkblank(result['illness']['illness_time']));

                        $("#Location_Illness").html(checkblank(result['illness']['illness_location']));
                        $("#Medical_Facility_ill").html(checkblank(result['illness']['medicalFacilityProvider']));

                        if (result['illness']['thirdPartyInvolved'] == 'Yes') {
                            var thirdParty = result['illness']['thirdParty'];
                            for (var key in thirdParty) {
                                $("#tp" + key).html(checkblank(thirdParty[key]));
                            }
                            var insurer = result['illness']['insurer'];
                            for (var key in insurer) {
                                $("#in" + key).html(checkblank(insurer[key]));
                            }
                            document.getElementById("thirdParty").style.display = 'block';
                            document.getElementById("insurer").style.display = 'block';

                        }
                    }
                    else {
                        document.getElementById("illness_div").style.display = 'none';
                    }

                }
                    //}else if(result['injury'] && result['injury']['injury_symptoms'] && result['injury']['injury_symptoms']!='' &&  result['injury']['injury_symptoms']!='NA')  {
                else if (result['claim_type'] == 'Injury') {
                    document.getElementById("illness_div").style.display = 'none';
                    document.getElementById("other_div").style.display = 'none';
                    if (result['injury']) {
                        document.getElementById("injury_div").style.display = 'block';
                        $("#Injury_Date").html(ymdTomdy(checkblank(result['injury']['date'])));
                        $("#Injury_Symptoms").html(checkblank(result['injury']['symptoms']));
                        $("#Location_Injury").html(checkblank(result['injury']['location']));
                        $("#Medical_Facility_Inj").html(checkblank(result['injury']['medicalFacility']));
                        $("#Describe_accident").html(checkblank(result['injury']['description']));
                        $("#injury_observe").html(checkblank(result['injury']['observation']));
                        $("#Floor_Condition").html(checkblank(result['injury']['floorCondition']));
                        $("#Mats").html(checkblank(result['injury']['mats']));
                        $("#Mats_Yes_whr").html(checkblank(result['injury']['matLocation']));
                        $("#Source_of_Water").html(checkblank(result['injury']['source']));
                        $("#Weather").html(checkblank(result['injury']['weather']));
                        $("#shoe_type").html(checkblank(result['injury']['shoeType']));
                        $("#Cones").html(checkblank(result['injury']['cones']));
                        $("#Cones_location").html(checkblank(result['injury']['coneLocation']));
                        $("#Video").html(checkblank(result['injury']['video']));
                        $("#Incident_video").html(checkblank(result['injury']['incidentVideo']));
                        $("#guest_leave_store").html(checkblank(result['injury']['guestTransportation']));
                        $("#Ambulance").html(checkblank(result['injury']['ambulance']));
                    }
                    else {
                        document.getElementById("injury_div").style.display = 'none';
                    }


                }
                else if (result['claim_type'] == 'Other') {
                    document.getElementById("illness_div").style.display = 'none';
                    document.getElementById("injury_div").style.display = 'none';
                    if (result['other']) {
                        document.getElementById("other_div").style.display = 'block';
                        $("#Car_damage").html(checkblank(result['other']['damage']));
                        $("#car_damage_occur").html(checkblank(result['other']['description']));
                        $("#Damage_location").html(checkblank(result['other']['location']));
                        $("#Landlord_fault_party").html(checkblank(result['other']['landlordFault']));
                        $("#Estimated_cost").html(checkblank(result['other']['estimatedCost']));
                        $("#Damage_new_old").html(checkblank(result['other']['newDamage']));
                        $("#manager_comments").html(checkblank(result['other']['manager']));
                        $("#manager_signature").html(checkblank(result['other']['signature']));
                        $("#other_date").html(ymdTomdy(checkblank(result['other']['date'])));
                    }
                    else {
                        document.getElementById("other_div").style.display = 'none';
                    }
                }
                //=====  FILE UPLOADED IN VIEW =======								
                var str1 = '<li class="popInn"><h2 class="popSubHead">Attachments<input  id="btn_add_claim_attatchment" class="popBtt buttonNex" type="button" onclick="btn_add_claim_attatchment(' + locId + ',\'GL\')" name="" value="Add Attatchment" /></h2>';

                if (result['filename'] && result['filename'].length > 0) {
                    for (var b = 0, t = 1; b < result['filename'].length; b++, t++) {
                        var obj = result['filename'][b];
                        var clickFunction = "downloadFile("+locId+",0,\'claim\',\'" + result['filename'][b]['fileName'] +" \')";
                        str1 += '<div class="customformInci1"><p><span class="headspan" style="width:14%;">File ' + t + ': </span><span id="filename">' + result['filename'][b]['fileName'] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	<img src="images/down1.png" onClick=\"'+clickFunction+'\"></img></span> </p> </div> <div class="clear"></div> ';
                    }
                    str1 += '<img id="pr_img" src="images/loading9.gif" style="margin-left:35%;display:none; top:30%; position:absolute;z-index:3000;"/></li>';
                }
                $("#file_container").html(str1);
            }

        });

    }
    else if (flag == 'show_WC') {        
    	var incidentLocId = $('#img_' + locId)[0].getAttribute('data-incident-locid');
        var promise = getWcDataByClaimId(locId);
        var jspPromise = getJspPageContent(incidentLocId);        
        
        $.when(promise, jspPromise).done(function (result, result2) {
        	var incidentPromise = getIncidentDetails(result.report.metadata.incidentId);
            $.when(incidentPromise).done(function (result3) {
            	getNotesByClaimId(locId, 'tab_diaryNotes', true);
            	$('#tab_diaryNotes').prev().prev('.popSubHead').html('Diary Notes   <input class="rightAlign buttonNext" id="btn_Create_wc" data-claim-type="wc" type="button" onclick="btn_Create_OnClick(' + locId + ')" value="Add Note">');
                $("#wc_incident_id").html(result.report.metadata.incidentId);
                $("#wc_store_no").html(result3['branchId']);
                $("#wc_address1").html(result3['address']);
                $("#wc_city").html(result3['city']);
                $("#wc_state").html(result3['state']);
                $("#wc_country").html(result3['country']);
                $("#wc_zip").html(result3['zipcode']);
                $("#wc_store_phone").html(result3['state']);
                $("#wc_fax").html(result3['fax']);
                $("#wc_inc_date").html(result3['incidentDate'] + " " + getValue(result3['incidentTime']));
                $("#wc_date_report").html(result3['reportedDate'] + " " + getValue(result3['reportedTime']));
                $("#wc_desc").html(result3['description']);
                $("#wc_notes").html(result3['note']);
                $("#wc_incident_loc").html(result3['incidentLocation']);
                $("#wc_police_inv").html(result3['policeInvolved']);

                $("#wc_alcohol").html(result3['alcohol']);
                if (result['police_invl'] == 'Yes') {
                    $("#wc_police_agency").html(result3['policeAgency']);
                    $("#wc_police_case_id").html(result3['policeReportId']);
                }
                else {
                    $("#wc_police_agency").html("-");
                    $("#wc_police_case_id").html("-");
                }


                var str2 = '<li class="popInn"><h2 class="popSubHead">Incident Attachments<input  id="btn_add_inc_attatchment" class="popBtt buttonNex" type="button" name="" value="Add Attatchment" onclick="btn_add_inc_attatchment(' + result.report.metadata.incidentId + ',\'WC\')" /></h2>';//

                if (result3['filename'] && result3['filename'].length > 0) {
                    
                    for (var b = 0, t = 1; b < result3['filename'].length; b++, t++) {
                        var obj = result3['filename'][b];

                        //str2 += '<div class="customformInci1"><p><span class="headspan" style="width:14%;">File ' + t + ': </span><span id="filename">' + result['filename'][b]['fileName'] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	<img src="images/down1.png" onClick="downloadFile('+inc_id+',0,"incident",\'' + result['filename'][b]['fileName'] + '\')"></img></span> </p> </div> <div class="clear"></div> ';
                        //alert(str2);
                        str2 += '<div class="customformInci1"><p><span class="headspan" style="width:14%;">File ' + t + ': </span><span id="filename">' + result3['filename'][b]['fileName'] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	<img src="images/down1.png" onClick="download_c_IncidentFile(' + result.report.metadata.incidentId + ',\'' + result3['filename'][b]['fileName'] + '\')"></img></span> </p> </div> <div class="clear"></div> ';
                    }
                    str2 += '<img id="pr_img" src="images/loading9.gif" style="margin-left:35%;display:none; top:30%; position:absolute;z-index:3000;"/></li>';
                }
                $("#wc_incidentfile_container").html(str2);
            });



            $("#WC_claim_id").html(checkblank(locId));            
            //$('#viewWcInfo ul .newLi').remove();

            var obj2 = result.report;

            var html = '';
            var attFlag = false;
            var jsonKeys = Object.keys(obj2);
            for (var i = 0; i < jsonKeys.length; i++) {
                if (jsonKeys[i] == 'metadata')
                    continue;

                var subKeys = Object.keys(obj2[jsonKeys[i]]);
                var strClaimHtml = '';
                strClaimHtml = '<li><h2 class="popSubHead">Claim Attachments<input  id="btn_add_claim_attatchment" class="popBtt buttonNex" type="button" name="" value="Add Attatchment" onclick="btn_add_claim_attatchment(' + locId + ',\'WC\')" /></h2>';//
                if (jsonKeys[i] == 'filename') {
                    var fileObj = obj2['filename'];
                    for (var fi = 0; fi < fileObj.length; fi++) {
                        strClaimHtml += '<div class="customformInci1"><p><span class="headspan" style="width:14%;">File ' + (fi + 1) + ': </span><span id="filename">' + fileObj[fi].fileName + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	<img src="images/down1.png" onClick="download_wc_ClaimFile(' + locId + ',\'' + fileObj[fi].fileName + '\')"></img></span> </p> </div> <div class="clear"></div> ';
                    }
                    strClaimHtml += '<img id="pr_img" src="images/loading9.gif" style="margin-left:35%;display:none; top:30%; position:absolute;z-index:3000;"/></li>';
                    $('#tab_attatchments').html(strClaimHtml);
                    attFlag = true;
                }
                else {
                    for (var j = 0; j < subKeys.length; j++) {
                        if (obj2[jsonKeys[i]][subKeys[j]] != null && obj2[jsonKeys[i]][subKeys[j]] != '') {
                            $('#span_' + subKeys[j]).html(obj2[jsonKeys[i]][subKeys[j]]);
                            $('#div_' + subKeys[j]).css('display', 'block');
                        }
                    }
                }
                if (!attFlag)
                    $('#tab_attatchments').html(strClaimHtml);
            }

            $('#tab_attatchments').prev().prev('.popSubHead').hide();
            $('#tab_attatchments').prev().remove();
        });
    }
    else if (flag == 'edit') {
        $('#view').jqExLoad('views/edit-claim.html', function () {
            $('#hdn_Claim_Id').val(locId);
            createEditClaimPageLoad(locId);
        }).hide().fadeIn();
    }
    else if (flag == 'edit_wc') {   
    	var incidentLocId = $('#img_' + locId)[0].getAttribute('data-incident-locid');    	

        $('#view').jqExLoad('views/wc.html', function () {
            dashboardloadOnInit('', incidentLocId);
            $('#hdn_Claim_Id').val(locId);
            $('#hdn_incLocId').val(incidentLocId);

            $('#hdn_hasDiaryNote').val('');
        }).hide().fadeIn();
    }
    else if (flag == 'delete') {
        var response = confirm("Do you want to delete this employee?");
        if (response) {
            $.ajax({
                type: "DELETE",
                contentType: "application/json;charset=utf-8",
                accept: "application/json",
                //dataType: "json",				
                url: hostname + "ClaimDeskWeb/services/v1/incident/" + locId,
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
    else if (flag == 'view_diary') {        
        $('#view_diary_claim_id').html(locId);
        getAllDiaryNotes(locId, 'view_diaries_list');
    }
}

function getAllDiaryNotes(claim_id, appendTo_id) {
    var Url = hostname + 'ClaimDeskWeb/services/v1/claim/' + claim_id + '/notes';

    var html = '';
    html += '<li class="popInn" style="list-style-type: none;"><h2 class="popSubHead">Diary Notes<input  class="popBtt buttBlue" id="btn_Create" type="button" onClick="btn_Create_OnClick(' + claim_id + ')" value="ADD NOTE"></h2><br>';


    $.ajax({
        type: 'GET',
        contentType: 'application/json;charset=utf-8',
        accept: 'application/json',
        dataType: 'json',
        cache: false,
        url: Url,
        headers: {
            'token': token,
            'userid': userId,
            'locationId': locationId
        },
        success: function (result) {
            var tableData = new Array();

            if (typeof result == 'undefined')
                html += '';
            else if (result.length > 0 || isHeadingAndEdit) {
                $(result).each(function (i, item) {
                    if (true) {

                        html += '<div style="background-color: #ebebeb; margin-bottom: 5px; padding: 0 3px 10px 6px;">';

                        html += '<div class="row">';
                        html += '<div class="col-md-4"><b>ID</b>: ' + check_blank(item.id) + '</div>'
                        html += '<div class="col-md-4"><b>Created By</b>: ' + check_blank(item.createdBy) + '</div>'
                        html += '<div class="col-md-4"><b>Created On</b>: ' + check_blank(item.created) + '</div>'
                        html += '</div>';

                        var to_emails = (typeof item.emails != 'undefined' && item.emails.length > 0) ? GetFollowUPEmails(item.emails) : '-';

                        var str_confidential = (typeof item.confidential == 'undefined' || !item.confidential) ? 'No' : 'Yes';
                        html += '<div class="row">';
                        html += '<div class="col-md-4"><b>Confidential</b>: ' + str_confidential + '</div>'
                        html += '<div class="col-md-4"><b>To</b>: ' + (to_emails != '' ? to_emails : '-') + '</div>';
                        html += '<div class="col-md-4"><b>Follow Up</b>: ' + YesOrNo(item.followUp) + '</div>'
                        html += '</div>';

                        html += '<div class="row">';
                        html += '<div class="col-md-4"><b>Category</b>: ' + Get_Category_Text(check_blank(item.category)) + '</div>'
                        html += '<div class="col-md-4"><b>Updated By</b>: ' + check_blank(item.updatedBy) + '</div>'
                        html += '<div class="col-md-4"><b>Updated Time</b>: ' + check_blank(item.updated) + '</div>'
                        html += '</div>';
                        
                        if (item.followUp) {
                            html += '<div class="row">';
                            html += '<div class="col-md-4"><b>Follow Up Date</b>: ' + check_blank(item.followUpTime) + '</div>'
                            html += '<div class="col-md-4"><b>Follow Up Email</b>: ' + check_blank(GetFollowUPEmails(item.followUpEmails)) + '</div>'
                            html += '<div class="col-md-4"></div>'
                            html += '</div>';

                            html += '<div class="row">';
                            html += '<div class="col-md-12"><b>Follow Up Message</b>: ' + check_blank(item.follupMessage) + '</div>'
                            html += '</div>';
                        }

                        html += '<div class="row">';
                        html += '<div class="col-md-12"><b>Notes</b>: ' + check_blank(item.notes) + '</div>'
                        html += '</div>';
                        
                        if (typeof item.history != 'undefined' && item.history.length > 0) {
                            html += '<div class="row">';
                            html += '<div class="col-md-12" ><b>Email History:</b></div></div>';
                            html += '<div class="row" style="margin-right:0px; margin-left:0px; ">';
                            html += '<div class="col-md-4" style="border-bottom:1px solid #000; border-top:1px solid #000"><b>Email Address</b></div>';
                            html += '<div class="col-md-4" style="border-bottom:1px solid #000; border-top:1px solid #000"><b>Sent Time</b></div>';
                            html += '<div class="col-md-4" style="border-bottom:1px solid #000; border-top:1px solid #000"><b>Remainder</b></div></div>';

                            for (var j = 0; j < item.history.length; j++) {
                                html += '<div class="row" style="margin-right:0px; margin-left:0px;">';
                                html += '<div class="col-md-4">' + item.history[j].email + '</div>';
                                html += '<div class="col-md-4">' + item.history[j].date + '</div>';
                                html += '<div class="col-md-4">' + item.history[j].type + '</div> </div>';
                            }
                            html += '</div>';
                        }

                        html += '</div>';
                    }
                });
                

            }
            else
                html += '';


            $('#' + appendTo_id).html(html);
        }
    });
}
function TrueOrFalse(val) {
    return (val == 'Yes' ? true : false);
}


function showincdetails(inc_id) {
    //	alert(inc_id);
    if (inc_id && inc_id != '') {
        document.getElementById("inc_div").style.display = 'block';
        $.ajax({
            type: "GET",
            contentType: "application/json;charset=utf-8",
            accept: "application/json",
            dataType: "json",
            cache: false,
            url: hostname + "ClaimDeskWeb/services/v1/incident/" + inc_id,
            global: false,
            async: false,
            headers: {
                "token": token,
                "userid": userId,
                "locationId": locationId
            },
            success: function (result) {
                $("#title").html(result['title']);
                $("#store_id").html(result['branchId']);
                $("#inc_date").html(result['incidentDate']);
                $("#date_report").html(result['reportedDate']);
                $("#inc_time").html(result['incidentTime']);
                $("#time_reported").html(result['reportedTime']);
                $("#desc").html(result['description']);
                $("#incident_loc").html(result['incidentLocation']);
                $("#police_inv").html(result['policeInvolved']);
                if (result['policeInvolved'] == 'Yes') {
                    $("#police_agency").html(result['policeAgency']);
                    $("#police_case_id").html(result['policeReportId']);
                }
                $("#alcohol").html(result['alcohol']);
                $("#notes").html(result['notes']);

            }
        });
    }
}

function getMonthFromString(mon) {
    return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1
}





function getIncTitle(inc_id) {
    var title;
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        cache: false,
        url: hostname + "ClaimDeskWeb/services/v1/incident/" + inc_id,
        global: false,
        async: false,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {
            title = result['title'];
        }
    });
    return title;
}

function getValue(value) {
    if (value) { return value; }
    return " ";
}

function showincdetails1(inc_id) {
    if (inc_id && inc_id != '') {
        document.getElementById("inc_div").style.display = 'block';

        $.ajax({
            type: "GET",
            contentType: "application/json;charset=utf-8",
            accept: "application/json",
            dataType: "json",
            cache: false,
            url: hostname + "ClaimDeskWeb/services/v1/incident/" + inc_id,
            global: false,
            async: false,
            headers: {
                "token": token,
                "userid": userId,
                "locationId": locationId
            },
            success: function (result) {
                $("#title").html(getValue(result['title']));

                $("#store_no").html(getValue(result['branchId']));
                $("#address1").html(getValue(result['address']));
                $("#city").html(getValue(result['city']));
                $("#state").html(getValue(result['state']));
                $("#country").html(getValue(result['country']));
                $("#zip").html(getValue(result['zipcode']));
                $("#store_phone").html(getValue(result['state']));
                $("#fax").html(getValue(result['fax']));

                $("#inc_date").html(getValue(result['incidentDate']) + " " + getValue(result['incidentTime']));
                $("#date_report").html(getValue(result['reportedDate']) + " " + getValue(result['reportedTime']));
                $("#desc").html(getValue(result['description']));
                $("#incident_loc").html(getValue(result['incidentLocation']));
                $("#police_inv").html(getValue(result['policeInvolved']));

                $("#alcohol").html(getValue(result['alcohol']));
                $("#notes").html(getValue(result['note']));

                if (result['police_invl'] == 'Yes') {
                    $("#police_agency").html(getValue(result['policeAgency']));
                    $("#police_case_id").html(getValue(result['policeReportId']));
                }
                else {
                    $("#police_agency").html("-");
                    $("#police_case_id").html("-");
                }

                var str2 = '<li class="popInn"><h2 class="popSubHead">Incident Attachments<input  id="btn_add_inc_attatchment" class="popBtt buttonNex" type="button" onclick="btn_add_inc_attatchment(' + inc_id + ',\'GL\')" name="" value="Add Attatchment" /></h2>';

                if (result['filename'] && result['filename'].length > 0) {
                    for (var b = 0, t = 1; b < result['filename'].length; b++, t++) {
                        var obj = result['filename'][b];
                        
                        var clickFunction = "downloadFile("+inc_id+",0,\'incident\',\'" + result['filename'][b]['fileName'] +" \')";
                        str2 += '<div class="customformInci1"><p><span class="headspan" style="width:14%;">File ' + t + ': </span><span id="filename">' + result['filename'][b]['fileName'] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	<img src="images/down1.png" onClick="'+clickFunction+'"></img></span> </p> </div> <div class="clear"></div> ';
                    }
                    str2 += '<img id="pr_img" src="images/loading9.gif" style="margin-left:35%;display:none; top:30%; position:absolute;z-index:3000;"/></li>';
                }
                $("#incidentfile_container").html(str2);
            }
        });
    }
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

function fdate(dt) {
    return dt.replace(/\-/g, '/');
}

function msg(m) {
    if (m == 50) apprise("Claim is DECLINED. Can't edit Claim.");
    if (m == 10) apprise("Claim is APPROVED. Can't edit Claim.");
    //alert("Claim is APPROVED. Can't edit Claim.");

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
                //attr.push(Object.keys(result)[i++]);
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

function aboutInfo() {
    var attr = JSON.parse(checkblank(sessionStorage.getItem("attr")));
    var key_val = JSON.parse(checkblank(sessionStorage.getItem("key_val")));
    var str = "";
    for (var key in attr) {
        str += '<div  style="float:left; width:50%"><span id="attribute" style="width: 100% !important;">' + attr[key] + '</span></div><div style="float:right; width:48%"><span id="key_val"  style="width: 100% !important;">:' + key_val[key] + '</span></div>';
    }

    $("#about_info").html(str);
}

function getNotesByClaimId(claim_id, appendTo_id, isHeadingAndEdit) {
    var Url = hostname + 'ClaimDeskWeb/services/v1/claim/' + claim_id + '/notes';
    $('#hdn_Claim_Id').val(claim_id);
    $('#hdn_Diary_Note').val(-1);

    var shtml = '';
    if (isHeadingAndEdit)
        shtml += '<li class="popInn"><h2 class="popSubHead">Diary Notes<input  class="popBtt buttonNex" id="btn_Create" type="button" onClick="btn_Create_OnClick(' + claim_id + ')" value="Create Note"></h2><br>';
    else {
        shtml += '<input  class="popBtt buttonNex" id="btn_Create" type="button" onClick="btn_AddNote_OnClick(' + claim_id + ')" value="ADD NOTE"><br><br>';
    }
    $('#claim_button').html(shtml);

    $.ajax({
        type: 'GET',
        contentType: 'application/json;charset=utf-8',
        accept: 'application/json',
        dataType: 'json',
        cache: false,
        url: Url,
        headers: {
            'token': token,
            'userid': userId,
            'locationId': locationId
        },
        success: function (result) {
            var tableData = new Array();
            var html = '';
            if (typeof result == 'undefined')
                html += '';
            else if (result.length > 0 || isHeadingAndEdit) {
                $(result).each(function (i, item) {
                    
                    if (isHeadingAndEdit) {
                        html += '<div style="background-color: #ebebeb; margin-bottom: 5px; padding: 0 3px 10px 6px;">';

                        html += '<div class="row">';
                        html += '<div class="col-md-4"><b>ID</b>: ' + check_blank(item.id) + '</div>'
                        html += '<div class="col-md-4"><b>Created By</b>: ' + check_blank(item.createdBy) + '</div>'
                        html += '<div class="col-md-4"><b>Created On</b>: ' + check_blank(item.created) + '</div>'
                        html += '</div>';

                        var to_emails = (typeof item.emails != 'undefined' && item.emails.length > 0) ? GetFollowUPEmails(item.emails) : '-';

                        var str_confidential = (typeof item.confidential == 'undefined' || !item.confidential) ? 'No' : 'Yes';
                        html += '<div class="row">';
                        html += '<div class="col-md-4"><b>Confidential</b>: ' + str_confidential + '</div>'
                        html += '<div class="col-md-4"><b>To</b>: ' + (to_emails != '' ? to_emails : '-') + '</div>';
                        html += '<div class="col-md-4"><b>Follow Up</b>: ' + YesOrNo(item.followUp) + '</div>'
                        html += '</div>';

                        html += '<div class="row">';
                        html += '<div class="col-md-4"><b>Category</b>: ' + Get_Category_Text(check_blank(item.category)) + '</div>'
                        html += '<div class="col-md-4"><b>Updated By</b>: ' + check_blank(item.updatedBy) + '</div>'
                        html += '<div class="col-md-4"><b>Updated Time</b>: ' + check_blank(item.updated) + '</div>'
                        html += '</div>';

                        if (item.followUp) {
                            html += '<div class="row">';
                            html += '<div class="col-md-4"><b>Follow Up Date</b>: ' + check_blank(item.followUpTime) + '</div>'
                            html += '<div class="col-md-4"><b>Follow Up Email</b>: ' + check_blank(GetFollowUPEmails(item.followUpEmails)) + '</div>'
                            html += '<div class="col-md-4"></div>'
                            html += '</div>';

                            html += '<div class="row">';
                            html += '<div class="col-md-12"><b>Follow Up Message</b>: ' + check_blank(item.follupMessage) + '</div>'
                            html += '</div>';
                        }

                        html += '<div class="row">';
                        html += '<div class="col-md-12"><b>Notes</b>: ' + check_blank(item.notes) + '</div>'
                        html += '</div>';

                        if (typeof item.history != 'undefined' && item.history.length > 0) {
                            html += '<div class="row">';
                            html += '<div class="col-md-12" ><b>Email History:</b></div></div>';
                            html += '<div class="row" style="margin-right:0px; margin-left:0px; ">';
                            html += '<div class="col-md-4" style="border-bottom:1px solid #000; border-top:1px solid #000"><b>Email Address</b></div>';
                            html += '<div class="col-md-4" style="border-bottom:1px solid #000; border-top:1px solid #000"><b>Sent Time</b></div>';
                            html += '<div class="col-md-4" style="border-bottom:1px solid #000; border-top:1px solid #000"><b>Remainder</b></div></div>';

                            for (var j = 0; j < item.history.length; j++) {
                                html += '<div class="row" style="margin-right:0px; margin-left:0px;">';
                                html += '<div class="col-md-4">' + item.history[j].email + '</div>';
                                html += '<div class="col-md-4">' + item.history[j].date + '</div>';
                                html += '<div class="col-md-4">' + item.history[j].type + '</div> </div>';
                            }
                            html += '</div>';
                        }

                        html += '</div>';
                    }
                    else {
                        var obj = {};
                        obj.id = item.id;
                        obj.confidential = YesOrNo(CheckForUndefined(item.confidential));
                        obj.created = CheckForUndefined(item.created);
                        obj.createdBy = CheckForUndefined(item.createdBy);
                        obj.followUp = YesOrNo(CheckForUndefined(item.followUp));
                        obj.followUpEmails = CheckForUndefined(item.followUpEmails);
                        obj.followUpTime = CheckForUndefined(item.followUpTime);
                        obj.follupMessage = CheckForUndefined(item.follupMessage);
                        obj.notes = CheckForUndefined(item.notes);
                        obj.status = CheckForUndefined(item.status);
                        obj.updated = CheckForUndefined(item.updated);
                        obj.Action = '';

                        tableData.push(obj);

                    }
                });
                //Diary_Table(tableData, claim_id);

            }
            else
                html += '';

            if (isHeadingAndEdit)
                $('#' + appendTo_id).html(html);
        }
    });
}

function Get_Category_Text(Val) {
    if (Val == null || Val == '')
        return '';

    var category_text = '';
    var diary_categories = JSON.parse(sessionStorage.getItem('SsnDiaryCategories'));
    if (diary_categories != null) {
        for (var i = 0; i < diary_categories.length; i++) {
            if (diary_categories[i].code == Val) {
                category_text = diary_categories[i].description;
                break;
            }
        }
    }

    return category_text;
}

function GetFollowUPEmails(emails_Arr) {
    var strEmails = '';
    if (typeof emails_Arr != 'undefined' || emails_Arr != null)
        for (var i = 0; i < emails_Arr.length; i++) {
            strEmails += emails_Arr[i] + (i < (emails_Arr.length - 1) ? ',' : '');
        }
    return strEmails;
}