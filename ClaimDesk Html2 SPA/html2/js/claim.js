// login session variables
var userId = sessionStorage.getItem("userid");
var token = sessionStorage.getItem("token");
var locationId = sessionStorage.getItem("locationId");
var incLocId = sessionStorage.getItem("incLocId");
var firstName = sessionStorage.getItem("firstName");
var lastName = sessionStorage.getItem("lastName");
var sellocationid = '';
var selmanagerid = '';
var gcnt = '';



function authentication() {
    if (userId == '' || userId == null) {
        apprise("Please Login Before Proceed.")
        window.location = "index.html";
    }

}

function setDefaultClaimType() {
    document.getElementById('check_illness').checked = false;
    document.getElementById('check_injury').checked = false;
    document.getElementById('check_other').checked = true;
    document.getElementById("other_div").style.display = 'block';
    toggle_visibility_checkbox();
}


function loadClaim1(incLocId) {
    load_data();
    setDefaultClaimType();
    load_from_session_claim1();
    $('#hdn_incLocId').val(incLocId);
    getDropdownData('ClaimDeskWeb/services/v1/code/C_SHOETYPE/', 'shoe_type', incLocId);
    getDropdownData('ClaimDeskWeb/services/v1/code/C_WEATHER/', 'weather', incLocId);
}

function loadClaim(incidentId) {

    load_data();
    getAllIncident(incidentId);
    getIncidentFiles(incidentId);
    load_from_session_claim();
    fillage()
}

// function to load datepicker to all claims		
function load_data() // frm claim.html (starting page of create - claim )
{
    $(".date-picker").datepicker();
    $(".date-picker").on("change", function () {
        var id = $(this).attr("id");
        var val = $("label[for='" + id + "']").text();
        $("#msg").text(val + " changed");
    });

    $("#no_of_guests").change(function () {
        var numOfClones = $(this).val();
        clone_guests_div(numOfClones);
    });

}

function clone_guests_div(noofguest) {
    var holder, li, clone, counter, existed;
    holder = $("#container");
    li = $('.claimForm:first');
    existed = holder.find('.claimForm').length;
    if (existed > noofguest) apprise("You already have " + existed + " guests,If you want to remove existed guests click on 'X' button with guests");
    else {
        existed = existed + 1;
        //counter;
        for (counter = existed; counter <= noofguest; ++counter) {
            gcnt++;
            clone = li.clone();
            var newid = "claimForm" + counter;
            clone.attr("id", newid);
            clone.attr("style", "display:block");
            clone.appendTo(holder);
            var nr = "#" + newid + " .form1";
            var extesion = "<img src='images/delet.png' style='border:1px solid gray;' onclick='removediv(\"#" + newid + "\")' title='Click here to remove this Guests'/>";
            $(nr).html(extesion);

            var nr1 = "#" + newid + " input[type=text]";
            var allobj = $(nr1);
            for (var t = 0; t < allobj.length; t++) {
                var str = $(allobj[t]).prop("name") + gcnt;
                var str1 = $(allobj[t]).prop("tabindex") + 1000 * gcnt + gcnt;

                $(allobj[t]).prop('name', str);
                $(allobj[t]).prop('tabindex', str1);
                $(allobj[t]).val('');
            }

            var nr1 = "#" + newid + " select";
            var allobj = $(nr1);
            for (var t = 0; t < allobj.length; t++) {
                var str = $(allobj[t]).prop("name") + 1000 * gcnt + gcnt;
                var str1 = $(allobj[t]).prop("tabindex") + gcnt;
                $(allobj[t]).prop('name', str);
                $(allobj[t]).prop('tabindex', str1);
                $(allobj[t]).val('');
            }
        }
    }
}

//remove div
function removediv(id) {
    var holder, li, clone, counter, existed;
    holder = $("#container");
    li = $('#claimForm');
    existed = holder.find('.claimForm').length;
    if (existed > 1) $(id).remove();
    existed = holder.find('.claimForm').length;
    $("#no_of_guests").val(existed);
}



var isDefaultCol = true;
var isDefaultDir = true;
function load_Claim_data() {
    sessionStorage.removeItem("claimEdit");
    var oTable = $('#claimsTbl').dataTable({
        "bStateSave": true,
        "sPaginationType": "full_numbers",
        "bServerSide": true,
        "bProcessing": true,
        "bSortClasses": false,
        "bDeferRender": true,
        "sAjaxSource": hostname + "ClaimDeskWeb/services/v1/claim/claimList",
        "aoColumns": [
            { "sWidth": "5%" },
            { "sWidth": "12%" },
            { "sWidth": "10%" },
            null,
            { "sWidth": "10%" },
            { "sWidth": "10%" },
            null,
            { "bSortable": false, "sWidth": "10%" },
        ],
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
                    if (isDefaultCol) {
                        sExt += sAnd + "sort_col=" + "2";
                        aoData[key]['value'] = 3;
                        isDefaultCol = false;
                    }
                    else {
                        sExt += sAnd + "sort_col=" + aoData[key]['value'];
                    }
                    r++;
                }
                if (aoData[key]['name'].trim() == "sSortDir_0") {
                    if (isDefaultDir) {
                        sExt += sAnd + "sort=" + "desc";
                        aoData[key]['value'] = "desc";
                        isDefaultDir = false;
                    }
                    else {
                        sExt += sAnd + "sort=" + aoData[key]['value'];
                    }
                    r++;
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
                    var gettitlearr = {};
                    var getlocarr = {};
                    var count = 0;
                    var tempdset = {};
                    var dataSet = [];
                    for (var key in result["claims"]) {
                        var objinner = [];
                        objinner.push(result['claims'][key]['claimId']);
                        objinner.push(result['claims'][key]['guestName']);
                        objinner.push((result['claims'][key]['created']));
                        objinner.push(result['claims'][key]['title']);
                        objinner.push(result['claims'][key]['incidentDate']);
                        objinner.push(result['claims'][key]['claimType']);
                        objinner.push("<b>" + result['claims'][key]['branchId'] + "</b>, " + result['claims'][key]['address'] + ", " + result['claims'][key]['address2'] + ", " + result['claims'][key]['city'] + ", " + result['claims'][key]['state'] + ", " + result['claims'][key]['zip']);
                        var str = '';
                        if (result['claims'][key]['status'] == 'ACTIVE') {//

                            str = "<ul class='manageIcon1'>" +
                                   "<li class='veiwInc' data-toggle='modal' data-target='" + (result.claims[key].type == "WC" ? ".wc-claim-modal" : ".gl-claim-modal") + "' style='cursor:pointer;'>" +
                                    "<a href='#'><img data-claim-type='" + result.claims[key].type + "' id='img_" + result['claims'][key]['claimId'] + "' data-incident-locid='" + result['claims'][key]['locationId'] + "' src='images/min1.png' width='16' height='19'alt='img' onclick=\"setClaimlocId(" + result['claims'][key]['claimId'] + ",'" + (result.claims[key].type == "WC" ? "show_WC" : "show") + "')\"></a>" +
                                   "</li>" +
                                   "<li>" +
                                    "<a href='#'><img data-claim-type='" + result.claims[key].type + "' id='img1_" + result['claims'][key]['claimId'] + "' data-hasdiary-note='" + (result['claims'][key]['diaryNotes'] ? true : false) + "' data-incident-locid='" + result['claims'][key]['locationId'] + "' src='images/min2.png' width='16' height='19'alt='img' onclick=\"setClaimlocId(" + result['claims'][key]['claimId'] + ",'" + (result.claims[key].type == "WC" ? "edit_wc" : "edit") + "')\"></a>" +
                                   "</li>" +
                                   "<li>" +
                                    "<a href='#'><img src='images/min5.png' width='16' height='19' alt='img' onclick=\"setClaimlocId(" + result['claims'][key]['claimId'] + ",'delete')\"></a>" +
                                   "</li>" + DiaryNoteImage(result['claims'][key]['diaryNotes'], result['claims'][key]['claimId']) + getTypeOfClaim(result.claims[key].claimId, result.claims[key].type) +
                            "</ul>";
                        }
                        else {

                            str = "<ul class='manageIcon1'>" +
                                       "<li class='veiwInc' data-toggle='modal' data-target='" + ((result.claims[key].type == "WC" ? ".wc-claim-modal" : ".gl-claim-modal")) + "' style='cursor:pointer;'>" +
                                        "<a href='#'><img data-claim-type='" + result.claims[key].type + "' id='img_" + result['claims'][key]['claimId'] + "' data-incident-locid='" + result['claims'][key]['locationId'] + "' src='images/min1.png' width='16' height='19'alt='img' onclick=\"setClaimlocId(" + result['claims'][key]['claimId'] + ",'" + (result.claims[key].type == "WC" ? "show_WC" : "show") + "')\"></a>" +
                                       "</li>" +
                                       "<li>" +
                                        "<a href='#'><img data-claim-type='" + result.claims[key].type + "' id='img1_" + result['claims'][key]['claimId'] + "' data-incident-locid='" + result['claims'][key]['locationId'] + "' src='images/min2.png' width='16' height='19'alt='img' onclick=\"msg(" + result['claims'][key]['status'] + ");\"></a>" +
                                       "</li>" +
                                       "<li>" +
                                       "<a href='#'><img src='images/min5.png' width='16' height='19' alt='img' onclick=\"setClaimlocId(" + result['claims'][key]['claimId'] + ",'delete')\"></a>"
                            "</li>" + DiaryNoteImage(result['claims'][key]['diaryNotes'], result['claims'][key]['claimId']) + getTypeOfClaim(result.claims[key].claimId, result.claims[key].type) +
                            "</ul>";
                        }

                        objinner.push(str);
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
    //	    oTable.fnSort( [ [0,'desc'] ] );
}

function DiaryNoteImage(hasDiaryNote, claim_id) {

    var html = '';
    if (hasDiaryNote)
        html += "<li class='veiwInc' data-toggle='modal' data-target='.diary-notes-modal' style='cursor:pointer;'><img src='" + GetImage(hasDiaryNote) + "' width='16' height='19' alt='img' onclick=\"setClaimlocId(" + claim_id + ",'view_diary')\" /></li>"
    else
        html += "<li><img src='" + GetImage(hasDiaryNote) + "' width='16' height='19' alt='img' /></li>"

    return html;
}



function GetImage(hasDiaryNote) {
    if (typeof hasDiaryNote == 'undefined')
        return 'images/trans.GIF';
    else if (hasDiaryNote)
        return 'images/pushpin-gy.png';
    else
        return 'images/trans.GIF';
}





function claim_step_one(flag) // step1 : claim.html (no of guests ..)
{

    if ($("#frm_1").valid()) {

        var guest_fname = document.getElementById("guest_fname").value;
        var guest_home_phone = document.getElementById("guest_home_phone").value;
        var guest_id_no = document.getElementById("guest_id_no").value;
        var guest_lname = document.getElementById("guest_lname").value;
        var guest_work_phone = document.getElementById("guest_work_phone").value;
        var guest_state = document.getElementById("guest_state").value;
        var guest_age = document.getElementById("guest_age").value;
        var guest_email = document.getElementById("guest_email").value;
        var parent_name = document.getElementById("parent_name").value;
        var incident_id = document.getElementById("incident_id").value;
        var claim_location_id = document.getElementById("hidden_location_id").value;

        sessionStorage.setItem("claim_guest_fname", guest_fname);
        sessionStorage.setItem("claim_guest_home_phone", guest_home_phone);
        sessionStorage.setItem("claim_guest_id_no", guest_id_no);
        sessionStorage.setItem("claim_guest_lname", guest_lname);
        sessionStorage.setItem("claim_guest_work_phone", guest_work_phone);
        sessionStorage.setItem("claim_guest_state", guest_state);
        sessionStorage.setItem("claim_guest_age", guest_age);
        sessionStorage.setItem("claim_guest_email", guest_email);
        sessionStorage.setItem("claim_parent_name", parent_name);

        sessionStorage.setItem("claim_incident_id", incident_id);
        sessionStorage.setItem("claim_location_id", claim_location_id);

        if (flag) {
            removeAddGreenClass('1', '2');
            $('.divider a[data-target="#2"]').tab('show');
            save_to_session_claim();
        }

    }
}

// function to load claim step two page with claim info etc.			
function claim_step_two(flag) // step 2 : claim1.html 
{
    if ($("#frm_2").valid()) {
        var claim_desc = document.getElementById("claim_desc").value;
        sessionStorage.setItem("claim_desc", claim_desc);
        var illness = {};
        sessionStorage.setItem("claimType", getClaimType());

        if ($("#check_illness").is(":checked")) {

            // checkbox for illness ........................
            var date_picker_product = document.getElementById("date_picker_product").value;
            var time_value = document.getElementById("purchased_time").value; // value..2/3/4
            var time = document.getElementById("time").value; // value.. AM/PM
            var guest_order = document.getElementById("guest_order").value;
            var guest_eat = document.getElementById("guest_eat").value;
            var place_eat = document.getElementById("place_eat").value;
            var receipt = document.getElementById("receipt").value;
            //  upload file url values pending  .....
            var receipt_no = document.getElementById("receipt_no").value;
            var receipt_time = document.getElementById("receipt_time").value;
            var ill_symptoms = document.getElementById("ill_symptoms").value;
            var date_picker_receipt = document.getElementById("date_picker_receipt").value;
            var date_picker_illness = document.getElementById("date_picker_illness").value;
            // var time_value_ill = document.getElementById("time_value").value; //i.e 2,3
            var time_ill = document.getElementById("time").value; //i.e AM/PM
            var ill_time_value = document.getElementById("ill_time_value").value;
            var ill_time = document.getElementById("ill_time").value;
            var ill_location = document.getElementById("ill_location").value;
            var ill_medical = document.getElementById("ill_medical").value;

            //utc Time and Date
            var illnessUtcDate = localToUtc(date_picker_product + ' ' + time_value);
            var illnessUtcTime = getTime(illnessUtcDate);
            var recieptDate = localToUtc(date_picker_illness + ' ' + ill_time_value);
            var receiptTime = getTime(recieptDate);

            sessionStorage.setItem("claim_date_picker_product", illnessUtcDate);
            sessionStorage.setItem("claim_time_value", illnessUtcTime);
            sessionStorage.setItem("claim_time", time);
            sessionStorage.setItem("claim_guest_order", guest_order);
            sessionStorage.setItem("claim_guest_eat", guest_eat);
            sessionStorage.setItem("claim_place_eat", place_eat);
            sessionStorage.setItem("claim_receipt", receipt);
            sessionStorage.setItem("claim_receipt_no", receipt_no);
            sessionStorage.setItem("claim_receipt_time", receipt_time);
            sessionStorage.setItem("claim_ill_symptoms", ill_symptoms);
            sessionStorage.setItem("claim_date_picker_receipt", date_picker_receipt);
            sessionStorage.setItem("claim_date_picker_illness", recieptDate);

            // sessionStorage.setItem("claim_time_value_ill", time_value_ill);
            sessionStorage.setItem("claim_time_ill", time_ill);
            sessionStorage.setItem("claim_ill_time_value", receiptTime);
            sessionStorage.setItem("claim_ill_time", ill_time);
            sessionStorage.setItem("claim_ill_location", ill_location);
            sessionStorage.setItem("claim_ill_medical", ill_medical);

            //Store third party Involvements
            var tpInvolvement = {}
            var divs = ["tpdiv1", "tpdiv2", "tpdiv3"];

            for (var j = 0; j < divs.length; j++) {
                var s = divs[j];
                var elementArr = document.getElementById(s).getElementsByTagName('*');

                for (var i = 0; i < elementArr.length; i++) {

                    if ("text" == elementArr[i].type || "select-one" == elementArr[i].type) {
                        tpInvolvement[elementArr[i].name] = elementArr[i].value;
                    }

                }
            }
            var insurer = {}
            divs = ["indiv1", "indiv2", "indiv3"];
            for (var j = 0; j < divs.length; j++) {
                var s = divs[j];
                var elementArr = document.getElementById(s).getElementsByTagName('*');

                for (var i = 0; i < elementArr.length; i++) {

                    if ("text" == elementArr[i].type || "select-one" == elementArr[i].type) {
                        insurer[elementArr[i].name] = elementArr[i].value;
                    }

                }
            }
            sessionStorage.setItem("tpinvolved", JSON.stringify(tpInvolvement));
            sessionStorage.setItem("insurer", JSON.stringify(insurer));
            var thirdPartyInvolved = document.getElementById("thirdPartyInvolved").value;
            sessionStorage.setItem("thirdPartyInvolved", thirdPartyInvolved);





        }
        var injury = {};
        if ($("#check_injury").is(":checked")) {

            // var injury={};	
            // checkbox for Injury ........................

            var injDate = getDate(localToUtc(document.getElementById("date_picker_injury").value));

            var inj_symptoms = document.getElementById("inj_symptoms").value;
            var location_inj = document.getElementById("location_inj").value;
            var medical_guest = document.getElementById("medical_guest").value;
            var des_accident = document.getElementById("des_accident").value;
            var inj_observe = document.getElementById("inj_observe").value;
            var fl_condition = document.getElementById("fl_condition").value;
            var mats = document.getElementById("mats").value;
            var y_where = document.getElementById("y_where").value;
            var source = document.getElementById("source").value;
            var weather = document.getElementById("weather").value;
            var shoe_type = document.getElementById("shoe_type").value;
            var cones = document.getElementById("cones").value;
            var video = document.getElementById("video").value;
            var gst_leave = document.getElementById("gst_leave").value;
            var loc_cones = document.getElementById("loc_cones").value;
            var i_video = document.getElementById("i_video").value;
            var ambulance = document.getElementById("ambulance").value;


            sessionStorage.setItem("claim_date_picker_injury", injDate);
            sessionStorage.setItem("claim_inj_symptoms", inj_symptoms);
            sessionStorage.setItem("claim_location_inj", location_inj);
            sessionStorage.setItem("claim_medical_guest", medical_guest);
            sessionStorage.setItem("claim_des_accident", des_accident);
            sessionStorage.setItem("claim_inj_observe", inj_observe);
            sessionStorage.setItem("claim_fl_condition", fl_condition);
            sessionStorage.setItem("claim_mats", mats);
            sessionStorage.setItem("claim_y_where", y_where);
            sessionStorage.setItem("claim_source", source);
            sessionStorage.setItem("claim_weather", weather);
            sessionStorage.setItem("claim_shoe_type", shoe_type);
            sessionStorage.setItem("claim_cones", cones);
            sessionStorage.setItem("claim_video", video);
            sessionStorage.setItem("claim_gst_leave", gst_leave);
            sessionStorage.setItem("claim_loc_cones", loc_cones);
            sessionStorage.setItem("claim_i_video", i_video);
            sessionStorage.setItem("claim_ambulance", ambulance);
        }

        var other = {};

        if ($("#check_other").is(":checked")) {
            //var other={}; 
            var car_damage = document.getElementById("car_damage").value;
            var damage_occur = document.getElementById("damage_occur").value;
            var est_cost = document.getElementById("est_cost").value;
            var d_location = document.getElementById("d_location").value;
            var damage = document.getElementById("damage").value;
            var fault_pro = document.getElementById("fault_pro").value;
            var land_pro = document.getElementById("land_pro").value;
            var mang_sign = document.getElementById("mang_sign").value;
            var date_picker_inj = document.getElementById("date_picker_inj").value;


            var other_inj_Date = getDate(localToUtc(date_picker_inj));

            sessionStorage.setItem("other_car_damage", car_damage);
            sessionStorage.setItem("other_damage_occur", damage_occur);
            sessionStorage.setItem("other_est_cost", est_cost);
            sessionStorage.setItem("other_d_location", d_location);
            sessionStorage.setItem("other_damage", damage);
            sessionStorage.setItem("other_fault_pro", fault_pro);
            sessionStorage.setItem("other_land_pro", land_pro);
            sessionStorage.setItem("other_mang_sign", mang_sign);
            sessionStorage.setItem("other_date_picker_inj", other_inj_Date);
        }


        var table = document.getElementById('imglistIncident');
        var rowCount = table.rows.length;
        var filename1 = [];
        for (var g = 1; g < rowCount; g++) {
            var innerfilename = {};
            innerfilename["fileName"] = table.rows[g].childNodes[1].innerHTML;
            filename1.push(innerfilename);
        }
        sessionStorage.setItem("receiptlist", JSON.stringify(filename1));
        if (flag) {
            removeAddGreenClass('2', '3');
            $('.divider a[data-target="#3"]').tab('show');
            save_to_session_claim1();
        }
    }
    else {
        var errObj = $('#data').validate();
    }
}

function fileObj() {
    document.getElementById("next").disabled = true;

    var receipt = JSON.parse(sessionStorage.getItem("receiptlist"));
    var receipt_new = [];

    for (var f = 0; f < receipt.length; f++) {
        var innerreceipt = {};
        innerreceipt["fileName"] = receipt[f]["fileName"];
        receipt_new.push(innerreceipt);
    }


    var table = document.getElementById('imglistIncident');
    var rowCount = table.rows.length;
    var filename = [];

    for (var g = 1; g < rowCount; g++) {
        var innerfilename = {};
        innerfilename["fileName"] = table.rows[g].childNodes[0].innerHTML;
        filename.push(innerfilename);
    }

    return filename;
}


function claim_step_three(flag) {
    document.getElementById("next").disabled = true;

    var receipt = JSON.parse(sessionStorage.getItem("receiptlist"));
    var receipt_new = [];

    for (var f = 0; f < receipt.length; f++) {
        var innerreceipt = {};
        innerreceipt["fileName"] = receipt[f]["fileName"];
        receipt_new.push(innerreceipt);
    }


    var table = document.getElementById('receiptlist');
    var rowCount = table.rows.length;
    var filename = [];

    for (var g = 1; g < rowCount; g++) {
        var innerfilename = {};
        innerfilename["fileName"] = table.rows[g].childNodes[1].innerHTML;
        filename.push(innerfilename);
    }

    var illness = {};

    // illness values ....
    illness["date_prod_purchase"] = mdyToymd(checkdate(sessionStorage.getItem("claim_date_picker_product")));
    // **** date to store in data base.. mdyToymd format
    illness["time_prod_purchase"] = checktime(sessionStorage.getItem("claim_time_value"));
    illness["guest_order_list"] = checkblank(sessionStorage.getItem("claim_guest_order"));
    illness["eaten_by_guest"] = checkblank(sessionStorage.getItem("claim_guest_eat"));
    illness["recipt_name"] = checkblank(sessionStorage.getItem("claim_place_eat"));
    //place eat.= receipt name
    illness["recipt_Y_N"] = checkblank(sessionStorage.getItem("claim_receipt"));
    illness["recipt_no"] = checkzero(sessionStorage.getItem("claim_receipt_no"));
    illness["recipt_time"] = checktime(sessionStorage.getItem("claim_receipt_time"));

    illness["illness_symptoms"] = checkblank(sessionStorage.getItem("claim_ill_symptoms"));
    illness["recipt_date"] = mdyToymd(checkdate(sessionStorage.getItem("claim_date_picker_receipt")));
    illness["illness_date"] = mdyToymd(checkdate(sessionStorage.getItem("claim_date_picker_illness")));
    illness["illness_time"] = checktime(sessionStorage.getItem("claim_time_value_ill"));
    illness["illness_location"] = checkblank(sessionStorage.getItem("claim_ill_location"));
    illness["medicalFacilityProvider"] = checkblank(sessionStorage.getItem("claim_ill_medical"));
    illness["thirdPartyInvolved"] = checkblank(sessionStorage.getItem("thirdPartyInvolved"));
    illness["receipt"] = receipt_new;
    if (illness["thirdPartyInvolved"] == "Yes") {
        var thirdParty = {};
        var dataStr = sessionStorage.getItem("tpinvolved");
        if (dataStr) {
            var data = JSON.parse(dataStr);
            for (var key in data) {
                thirdParty[key.substring(2)] = data[key];

            }
            illness["thirdParty"] = thirdParty;
        }

        var dataStr = sessionStorage.getItem("insurer");
        if (dataStr) {
            var insurer = {};
            var data = JSON.parse(dataStr);
            for (var key in data) {
                insurer[key.substring(2)] = data[key];

            }
            illness["insurer"] = insurer;
        }

    }

    // injury values
    var injury = {};

    injury["date"] = mdyToymd(checkdate(sessionStorage.getItem("claim_date_picker_injury")));
    injury["symptoms"] = checkblank(sessionStorage.getItem("claim_inj_symptoms"));
    injury["location"] = checkblank(sessionStorage.getItem("claim_location_inj"));
    injury["medicalFacility"] = checkblank(sessionStorage.getItem("claim_medical_guest"));
    injury["description"] = checkblank(sessionStorage.getItem("claim_des_accident"));
    injury["observation"] = checkblank(sessionStorage.getItem("claim_inj_observe"));
    injury["floorCondition"] = checkblank(sessionStorage.getItem("claim_fl_condition"));
    injury["mats"] = checkblank(sessionStorage.getItem("claim_mats"));
    injury["matLocation"] = checkblank(sessionStorage.getItem("claim_y_where"));
    injury["source"] = checkblank(sessionStorage.getItem("claim_source"));
    injury["weather"] = checkblank(sessionStorage.getItem("claim_weather"));
    injury["shoeType"] = checkblank(sessionStorage.getItem("claim_shoe_type"));
    injury["cones"] = checkblank(sessionStorage.getItem("claim_cones"));
    injury["video"] = checkblank(sessionStorage.getItem("claim_video"));
    injury["guestTransportation"] = checkblank(sessionStorage.getItem("claim_gst_leave"));
    injury["coneLocation"] = checkblank(sessionStorage.getItem("claim_loc_cones"));
    injury["incidentVideo"] = checkblank(sessionStorage.getItem("claim_i_video"));
    injury["ambulance"] = checkblank(sessionStorage.getItem("claim_ambulance"));

    // other values
    var other = {};

    other["damage"] = checkblank(sessionStorage.getItem("other_car_damage"));
    other["description"] = checkblank(sessionStorage.getItem("other_damage_occur"));
    other["estimatedCost"] = checkzero(sessionStorage.getItem("other_est_cost"));
    other["location"] = checkblank(sessionStorage.getItem("other_d_location"));
    other["newDamage"] = checkblank(sessionStorage.getItem("other_damage"));
    other["landlordFault"] = checkblank(sessionStorage.getItem("other_fault_pro"));
    other["manager"] = checkblank(sessionStorage.getItem("other_land_pro"));
    other["signature"] = checkblank(sessionStorage.getItem("other_mang_sign"));
    other["date"] = mdyToymd(checkdate(sessionStorage.getItem("other_date_picker_inj")));


    var guest = [];

    var claim_incident_id = checkzero(sessionStorage.getItem("claim_incident_id"));
    var claim_location_id = checkzero(sessionStorage.getItem("claim_location_id"));


    for (var y = 0; y < 1; y++) {
        var innerguest = {};
        innerguest["firstName"] = checkblank(sessionStorage.getItem("claim_guest_fname"));
        innerguest["homePhone"] = checkblank(sessionStorage.getItem("claim_guest_home_phone"));
        innerguest["identifier"] = checkblank(sessionStorage.getItem("claim_guest_id_no"));
        innerguest["lastName"] = checkblank(sessionStorage.getItem("claim_guest_lname"));
        innerguest["workPhone"] = checkblank(sessionStorage.getItem("claim_guest_work_phone"));
        innerguest["state"] = checkblank(sessionStorage.getItem("claim_guest_state"));
        innerguest["age"] = checkzero(sessionStorage.getItem("claim_guest_age"));
        innerguest["email"] = checkblank(sessionStorage.getItem("claim_guest_email"));
        innerguest["parent"] = checkblank(sessionStorage.getItem("claim_parent_name"));
        guest.push(innerguest);
    }

    var claim_desc = checkblank(sessionStorage.getItem("claim_desc"));
    var claim_notes = '';//document.getElementById("claim_notes").value;
    var type = sessionStorage.getItem("claimType");
    var folder = sessionStorage.getItem("claimfolder");
    var jsonData = {
        "incidentId": claim_incident_id,
        "userId": userId,
        "locationId": locationId,
        "description": claim_desc,
        "guest": guest,
        "status": "ACTIVE",
        "illness": illness,
        "injury": injury,
        "other": other,
        "filename": filename,
        "note": claim_notes,
        "claim_type": type,
        "folder": folder,
        "type": "GL"
    }

    sessionStorage.setItem('SsnNewClaimData', JSON.stringify(jsonData));
    if (flag) {
        removeAddGreenClass('3', '4');
        $('.divider a[data-target="#4"]').tab('show');
    }

}

function claim_step_six(flag) {
    Save_New_Claim(flag);
}

function Save_New_Claim(flag) {
    if (flag) {        
        $('#pr_new').show();
        var jsonData = JSON.parse(sessionStorage.getItem('SsnNewClaimData'));

        $.ajax({
            type: "POST",
            contentType: "application/json;charset=utf-8",
            accept: "application/json",
            url: hostname + "ClaimDeskWeb/services/v1/claim",
            headers: {
                "token": token,
                "userid": userId,
                "locationId": locationId
            },
            data: JSON.stringify(jsonData),
            success: function (result) {
                $('#hdn_Claim_Id').val(result);
                remove_session_variable();
                remove_session_variable_onsave();
                $('#1, #2, #3, #4').empty();
                $('#pr_new').hide();
                CompletedGlTab(result);
                $('#li-5').css('display', 'block');
                $('.divider a[data-target="#5"]').tab('show');
                $('.breadcrumbMy li').addClass('newActive');
                $('.breadcrumbMy li a').addClass('activeMy').removeAttr('data-target data-toggle onclick');
            }
        });

        sessionStorage.removeItem('SsnNewClaimData');
    }
}




// add images lauout
function addRow_inc_imagelist(filename, incident) {
    if (incident) {
        var table = document.getElementById('imglistIncident');
    }
    else {
        var table = document.getElementById('imglist');
    }
    var rowCount = 0;
    if (table && table.rows) {
        rowCount = table.rows.length;
    }
    var row = table.insertRow(rowCount);
    row.classname = "greenBox";


    var cell0 = row.insertCell(0);
    cell0.align = "center";
    cell0.className = "whitebg";


    var cell0 = row.insertCell(0);
    cell0.align = "left";
    cell0.className = "whitebg";
    cell0.innerHTML = filename;
    cell0.width = "95%"

    var cell1 = row.insertCell(1);
    cell1.width = "20px"
    cell1.align = "left";
    cell1.className = "whitebg";
    var element1 = document.createElement("img");

    element1.src = "images/down1.png";
    if (incident) {
        element1.addEventListener("click", function () { download_c_IncidentFile(incident, filename); });
    }
    else {
        element1.addEventListener("click", function () { download_ClaimFile(filename); });
    }



    cell1.appendChild(element1);

    var cell2 = row.insertCell(2);
    cell2.width = "20px";

    var element2 = document.createElement("img");
    element2.name = filename;
    if (!incident) {
        element2.src = "images/del.png";
        element2.addEventListener("click", function () {
            delimage(element2);
        });
    }
    cell2.appendChild(element2);


    if (table.rows.length > 1) table.rows[0].style.display = 'none';

}

function addRow_receiptlist(filename, id) {

    if (id) {
        var table = document.getElementById('imglist');
    } else {
        var table = document.getElementById('receiptlist');
    }
    var rowCount = table == null ? 0 : table.rows.length;
    var row = table.insertRow(rowCount);
    row.classname = "greenBox";


    var cell0 = row.insertCell(0);
    cell0.align = "center";
    cell0.className = "whitebg";
    var element0 = document.createElement("img");
    element0.name = filename;
    element0.src = "images/del.png";
    element0.addEventListener("click", function () {
        if (id) {

            delimage(element0);
        }
        else {
            recdelimage(element0);
        }
    });
    cell0.appendChild(element0);


    var cell1 = row.insertCell(1);
    cell1.align = "left";
    cell1.className = "whitebg";
    cell1.innerHTML = filename;

    var cell2 = row.insertCell(2);
    cell2.align = "left";
    cell2.className = "whitebg";
    var element2 = document.createElement("img");

    element2.src = "images/down1.png";
    element2.addEventListener("click", function () { download_ClaimFile(filename); });
    cell2.appendChild(element2);


    if (table.rows.length > 1) table.rows[0].style.display = 'none';

}



function delimage(obj) {
    var table = document.getElementById('imglist');
    var ans = confirm("This will delete image " + obj.name + " permamnantly, Are you sure?");
    if (ans) {
        //   deleteFile(obj.name);
        var i = obj.parentNode.parentNode.rowIndex;
        document.getElementById('imglist').deleteRow(i);
    }
    if (table.rows.length == 1) {
        table.rows[0].style.display = 'table-row'
    };
}

function recdelimage(obj) {
    var table = document.getElementById('receiptlist');
    var ans = confirm("This will delete image " + obj.name + " permamnantly, Are you sure?");
    if (ans) {
        //   deleteFile(obj.name);
        var i = obj.parentNode.parentNode.rowIndex;
        document.getElementById('receiptlist').deleteRow(i);
    }
    if (table.rows.length == 1) {
        table.rows[0].style.display = 'table-row'
    };
}

function displayAge(age) {
    if (age == -1) {
        return "UNKNOWN";
    }
    return age;
}

function fillage() {
    var str = "<option value=\"-1\">UNKNOWN</option>";
    for (var f = 1; f <= 100; f++) {
        str += "<option value='" + f + "' >" + f + "</option>";
    }
    document.getElementById("guest_age").innerHTML = str;
}

function show_parent(val) {
    if (parseInt(val) < 18 && parseInt(val) >= 0) document.getElementById("parent_span").style.display = 'block';
    else document.getElementById("parent_span").style.display = 'none';
}


//=================================================================================================================================		  
// Shows uploaded file list on last page

function CompletedGlTab(cliam_id) {

    $("#fname").html("Claim ID : " + cliam_id);
    $('<div id="img1_' + cliam_id + '" data-claim-type="GL"></div><div id="img_' + cliam_id + '" data-claim-type="GL"></div>').appendTo('#fname');
    get_claim_files(cliam_id);
}

function get_claim_files(claim_id) {

    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        cache: false,
        url: hostname + "ClaimDeskWeb/services/v1/claim/" + claim_id,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {

            var str = '<ol style="list-style-image: url(images/min4.png) ;">';

            if (result["filename"]) {
                for (var i = 0; i < result["filename"].length; i++) {
                    str += "<li >" + result["filename"][i]["fileName"] + "</li>";
                }
                str += '</ol>';
                var fname = $("#fname").html();
                $("#fname").html(fname + "<br>" + str);
            }

            SaveDiaryNotes(claim_id);
        }
    });
}



function TrueOrFalse(val) {
    return (val == 'Yes' ? true : false);
}




function call_claim_func(flag) {
    setClaimlocId($('#hdn_Claim_Id').val(), flag);
    $('.gl-claim-modal').modal('show');
}

function edit_claim(flag) {
    setClaimlocId($('#hdn_Claim_Id').val(), flag)
}


// functio for edit delete view 
function setClaimlocId(locId, flag) {
    $('#hdn_Claim_Id').val(locId);
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

                showincdetails(result["incidentId"]);


                if (result['guest'].length > 0) {
                    var str = '<li class="popInn"><h2 class="popSubHead">Guest Details</h2>';
                    for (var b = 0; b < result['guest'].length; b++) {
                        var obj = result['guest'][b];

                        str += '<div style="background-color:#ebebeb; margin-bottom:5px; padding:0 3px 10px 6px;"><div class="formInci1"><p><span class="headspan">ID:</span><span id="gid">' +
                                checkblank(result['guest'][b]['identifier']) + '</span></p><p><span class="headspan">First Name:</span><span id="gfname">' +
                                checkblank(result['guest'][b]['firstName']) + '</span></p><p><span class="headspan">Last Name:</span><span id="glname">' +
                                checkblank(result['guest'][b]['lastName']) + '</span></p><p><span class="headspan">Parent Name: </span><span id="gparent">' +
                                checkblank(result['guest'][b]['parent']) + '</span></p></div><div class="formInci"><p><span class="headspan">Country:</span><span id="gcountry">United States</span></p><p><span class="headspan">State:</span><span id="gstate">' +
                                checkblank(result['guest'][b]['state']) + '</span></p><p><span class="headspan">Age:</span><span id="gage">' +
                                displayAge(checkblank(result['guest'][b]['age'])) + '</span></p><p><span class="headspan">Email ID: </span><span id="gemail">' +
                                checkblank(result['guest'][b]['email']) + '</span></p></div><div class="formInci"><p><span class="headspan">Home Phone: </span><span id="ghomeph">' +
                                checkblank(result['guest'][b]['homePhone']) + '</span></p><p><span class="headspan">Work Phone:</span><span id="gworkph">' +
                                checkblank(result['guest'][b]['workPhone']) + '</span></p></div><div class="clear"></div></div>';

                    }
                    str += '</li>';
                }

                $("#guest_container").html(str);


                document.getElementById("injury_div").style.display = 'none';
                document.getElementById("other_div").style.display = 'none';
                document.getElementById("thirdParty").style.display = 'none';
                document.getElementById("insurer").style.display = 'none';
                if (result['claim_type'] == 'Illness') {
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
                        $("#Receipt_Time").html(checkblank(result['illness']['recipt_time']));

                        $("#Illness_Symptoms").html(checkblank(result['illness']['illness_symptoms']));
                        $("#Illness_Date").html(ymdTomdy(checkblank(result['illness']['illness_date'])));
                        $("#Illness_Time").html(checkblank(result['illness']['illness_time']));

                        $("#Location_Illness").html(checkblank(result['illness']['illness_location']));
                        $("#Medical_Facility_ill").html(checkblank(result['illness']['medicalFacilityProvider']));
                        var thirdParty = result['illness']['thirdParty'];
                        if (thirdParty) {
                            for (var key in thirdParty) {
                                $("#tp" + key).html(checkblank(thirdParty[key]));
                            }
                            document.getElementById("thirdParty").style.display = 'block';
                        }
                        var insurer = result['illness']['insurer'];
                        if (insurer) {
                            for (var key in insurer) {
                                $("#in" + key).html(checkblank(insurer[key]));
                            }
                            document.getElementById("insurer").style.display = 'block';
                        }
                    }
                    else {
                        document.getElementById("illness_div").style.display = 'none';
                    }



                }

                    //else if(result['injury'] && result['injury']['injury_symptoms'] && result['injury']['injury_symptoms']!='' &&  result['injury']['injury_symptoms']!='NA')  {
                else if (result["claim_type"] == 'Injury') {
                    document.getElementById("illness_div").style.display = 'none';
                    document.getElementById("other_div").style.display = 'none';
                    document.getElementById("thirdParty").style.display = 'none';
                    document.getElementById("insurer").style.display = 'none';
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



                    //}else if(result['other'] && result['other']['other_reporting_manager_name'] && result['other']['other_reporting_manager_name']!='' && result['other']['other_reporting_manager_name']!='NA') {
                }
                else if (result["claim_type"] == 'Other') {
                    document.getElementById("illness_div").style.display = 'none';
                    document.getElementById("injury_div").style.display = 'none';
                    document.getElementById("thirdParty").style.display = 'none';
                    document.getElementById("insurer").style.display = 'none';
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
                        str1 += '<div class="customformInci1"><p><span class="headspan" style="width:14%;">File ' + t + ': </span><span id="filename">' + result['filename'][b]['fileName'] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	<img src="images/down1.png" onClick="download_ClaimFile(' + '\'' + result['filename'][b]['fileName'] + '\')"></img></span> </p> </div> <div class="clear"></div> ';
                    }
                    str1 += '<img id="pr_img" src="images/loading9.gif" style="margin-left:35%;display:none; top:30%; position:absolute;z-index:3000;"/></li>';
                }

                $("#file_container").html(str1);
            }

        });

    }
    else if (flag == 'show_WC') {
        var incidentLocId = $('#img_' + locId)[0].getAttribute('data-incident-locid');
        ShowWc(locId, incidentLocId);
    }
    else if (flag == 'edit') {
        $('#view').jqExLoad('views/edit-claim.html', function () {
            $('#hdn_Claim_Id').val(locId);
            createEditClaimPageLoad(locId);
        }).hide().fadeIn();
    }
    else if (flag == 'edit_wc') {
        EditWc(locId, $('#img1_' + locId)[0].getAttribute('data-incident-locid'), $('#img1_' + locId)[0].getAttribute('data-hasdiary-note') == 'true' ? true : false);
    }
    else if (flag == 'delete') {
        var string = 'Do you want to delete this Claim?';
        var args = { 'input': false };
        apprise(string, args, function (r) {
            if (r) {
                $.ajax({
                    type: "DELETE",
                    contentType: "application/json;charset=utf-8",
                    accept: "application/json",
                    dataType: "json",
                    cache: false,
                    url: hostname + "ClaimDeskWeb/services/v1/claim/delete/" + locId,
                    headers: {
                        "token": token,
                        "userid": userId,
                        "locationId": locationId
                    },
                    success: function (result) {
                        apprise(result['result']);
                        $('#view').jqExLoad('views/claims-list.html').hide().fadeIn();
                        $('#homeId,#incidentId,#dropdown').removeClass('select');
                        $('#claimId').addClass('select');
                    },
                    error: function (request, status, error) {
                        $('#view').jqExLoad('views/claims-list.html').hide().fadeIn();
                        $('#homeId,#incidentId,#dropdown').removeClass('select');
                        $('#claimId').addClass('select');
                    }

                });

            }

        });

        /*var response = confirm("Do you want to delete this Claim?");
        if(response)
        {	  					 
          $.ajax({type: "GET",                
          contentType: "application/json;charset=utf-8",
          accept:"application/json",				
          dataType: "json",
          cache: false,
          url: hostname+"ClaimDeskWeb/services/v1/claim/delete/"+locId,     
          headers: { "token": token,
                     "userid": userId,
                     "locationId": locationId},        
          success:function(result){
              alert(result['result']);
                  location.reload();									  
        },
     error: function (request, status, error) {  
        // alert("error");
       var msg = request.responseJSON['errors']['error'][0]['description'];   
    alert(msg);
     }
                              
    });
    }*/
    }
    else if (flag == 'view_diary') {
        $('#view_diary_claim_id').html(locId);
        getAllDiaryNotes(locId, 'view_diaries_list');
    }
}

function EditWc(locId, incidentLocId, hasDiaryNote) {
    var incidentId = $('#hdn_IncidentId').val();
    $('#view').jqExLoad('views/wc.html', function () {
        dashboardloadOnInit('', incidentLocId);
        $('#hdn_Claim_Id').val(locId);
        $('#hdn_incLocId').val(incidentLocId);
        $('#hdn_hasDiaryNote').val(hasDiaryNote);
        $('#hdn_IncidentId').val(incidentId);
    }).hide().fadeIn();
}

function ShowWc(locId, incidentLocId) {
    var promise = getWcDataByClaimId(locId);
    var jspPromise = getJspPageContent(incidentLocId);

    $.when(promise, jspPromise).done(function (result, result2) {
        var incidentPromise = getIncidentDetails(result.report.metadata.incidentId);
        $.when(incidentPromise).done(function (result3) {
            $('#hdn_IncidentId').val(result.report.metadata.incidentId);
            $('#tab_diaryNotes').prev().prev('.popSubHead').html('Diary Notes   <input class="rightAlign buttonNext" id="btn_Create_wc" data-claim-type="wc" type="button" onclick="btn_Create_OnClick(' + locId + ')" value="Add Note">');
            getNotesByClaimId(locId, 'tab_diaryNotes', true);
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


            var str2 = '<li class="popInn"><h2 class="popSubHead">Incident Attachments<input id="btn_add_inc_attatchment" class="popBtt buttonNex" type="button" name="" value="Add Attatchment" onclick="btn_add_inc_attatchment(' + result.report.metadata.incidentId + ',\'WC\')" /></h2>';//

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

function removeAddGreenClass(id, current) {
    $('#li-' + id).removeClass('newActive');
    $('#a-' + id).removeClass('activeMy');

    $('#li-' + current).addClass('newActive');
    $('#a-' + current).addClass('activeMy');
}

function createEditClaimPageLoad(currentemp) {

    NullifySsn();
    //var currentemp = sessionStorage.getItem("claimId");
    if (currentemp) {
        $.ajax({
            type: "GET",
            contentType: "application/json;charset=utf-8",
            accept: "application/json",
            global: false,
            async: false,
            cache: false,
            dataType: "json",
            url: hostname + "ClaimDeskWeb/services/v1/claim/" + currentemp,
            headers: {
                "token": token,
                "userid": userId,
                "locationId": locationId
            },
            success: function (result) {

                var promiseShoeType = getDropdownData('ClaimDeskWeb/services/v1/code/C_SHOETYPE/', 'shoe_type', result.locationId);
                var promiseWheather = getDropdownData('ClaimDeskWeb/services/v1/code/C_WEATHER/', 'weather', result.locationId);
                $.when(promiseShoeType, promiseWheather).done(function (d1, d2) {

                    getNotesByClaimId2(result.diaryNotes, currentemp, 'tbl_Diaries', false);
                    var isCreateDiary = $('#hdn_CreatediaryNotes').val() == 'true' ? true : false;
                    if (isCreateDiary) {
                        removeAddGreenClass('1', '4');
                        $('.divider a[href="#4"]').tab('show');
                        $('#hdn_CreatediaryNotes').val(false);
                        btn_AddNote_OnClick(currentemp);
                    }

                    var is_add_claim_attatchment = $('#hdn_is_Add_claim_Attatchment').val() == 'true' ? true : false;
                    if (is_add_claim_attatchment) {
                        removeAddGreenClass('1', '3');
                        $('.divider a[href="#3"]').tab('show');
                        $('#hdn_is_Add_claim_Attatchment').val(false);
                    }

                    $("#claim_desc").val(result['description']);
                    //$("#claim_notes").val(result['note']);
                    $("#claim_id_edit").val(result['claim_id']);
                    $("#top_claim_id").html(result['claim_id']);

                    getIncidentFiles(result['incidentId']);
                    getAllIncident(result['incidentId'])

                    if (result['guest'] && result['guest'][0]['firstName'] && result['guest'][0]['lastName'] != '') {
                        $("#guest_fname").val(result['guest'][0]['firstName']);
                        $("#guest_home_phone").val(result['guest'][0]['homePhone']);
                        $("#guest_id_no").val(result['guest'][0]['identifier']);
                        $("#guest_lname").val(result['guest'][0]['lastName']);
                        $("#guest_work_phone").val(result['guest'][0]['workPhone']);
                        $("#guest_state").val(result['guest'][0]['state']);
                        $("#guest_age").val(result['guest'][0]['age']);
                        if (parseInt(result['guest'][0]['age']) < 18 && parseInt(result['guest'][0]['age']) >= 1) {
                            document.getElementById("parent_span").style.display = 'block';
                            $("#parent_name").val(result['guest'][0]['parent']);
                        }
                        else document.getElementById("parent_span").style.display = 'none';
                        if (result['guest'][0]['email'] && result['guest'][0]['email'] == "NA") {
                            $("#guest_email").val();
                        }
                        else {
                            $("#guest_email").val(result['guest'][0]['email']);
                        }
                    }

                    if (result['claim_type'] == "Illness") {
                        document.getElementById("check_injury").checked = false;
                        document.getElementById("check_other").checked = false;
                        document.getElementById("check_injury").disabled = 'disabled';
                        document.getElementById("check_other").disabled = 'disabled';
                        document.getElementById("injury_div").style.display = 'none';
                        document.getElementById("other_div").style.display = 'none';
                        document.getElementById("illness_div").style.display = 'block';
                        document.getElementById("check_illness").checked = true;
                        if (result['illness']) {

                            var utcDate = UtcToLocal(ymdTomdy(result['illness']['date_prod_purchase']) + ' ' + result['illness']['time_prod_purchase']);

                            $("#date_picker_product").val(getDate(utcDate));
                            $("#purchased_time").val(getTime(utcDate));
                            $("#guest_order").val(result['illness']['guest_order_list']);
                            $("#guest_eat").val(result['illness']['eaten_by_guest']);
                            $("#place_eat").val(result['illness']['recipt_name']);
                            $("#receipt").val(result['illness']['recipt_Y_N']);

                            if (result['illness']['recipt_Y_N'] == "Yes") {
                                $('#file_upload_div').css('display', 'block');
                                $('#receipt_no').addClass('checkblankA');
                                $('#date_picker_receipt').addClass('checkblankA');
                            }
                            else {
                                $('#file_upload_div').css('display', 'none');
                                $('#receipt_no').removeClass('checkblankA');
                                $('#date_picker_receipt').removeClass('checkblankA');
                            }

                            $("#receipt_no").val(result['illness']['recipt_no']);
                            $("#date_picker_receipt").val(ymdTomdy(result['illness']['recipt_date']));
                            $("#receipt_time").val(result['illness']['recipt_time']);
                            $("#ill_symptoms").val(result['illness']['illness_symptoms']);

                            var reciptDate = UtcToLocal(ymdTomdy(result['illness']['illness_date']) + ' ' + result['illness']['illness_time']);

                            $("#date_picker_illness").val(getDate(reciptDate));
                            // $("#ill_time_value").val(result['illness']['illness_time']);
                            $("#ill_time_value").val(getTime(reciptDate));
                            $("#ill_location").val(result['illness']['illness_location']);
                            $("#ill_medical").val(result['illness']['medicalFacilityProvider']);
                            if (result['illness']['thirdPartyInvolved']) {
                                $("#thirdPartyInvolved").val(result['illness']['thirdPartyInvolved']);
                            }
                            else {
                                $("#thirdPartyInvolved").val("No");
                            }
                            hideThirdPartyEntrollment(result['illness']['thirdPartyInvolved']);
                            if ("Yes" == result['illness']['thirdPartyInvolved']) {
                                var thirdParty = result['illness']["thirdParty"];
                                if (thirdParty) {
                                    for (var key in thirdParty) {
                                        $("#tp" + key).val(thirdParty[key]);
                                    }
                                }
                                var insurer = result['illness']["insurer"];
                                if (insurer) {
                                    for (var key in insurer) {
                                        $("#in" + key).val(insurer[key]);
                                    }
                                }

                            }



                            if (result['illness']["receipt"]) {
                                for (var i = 0; i < result['illness']["receipt"].length; i++) {
                                    addRow_receiptlist(result['illness']["receipt"][i]["fileName"], currentemp);
                                }
                            }
                            document.getElementById("illness_div").style.display = 'block';
                            document.getElementById("check_illness").checked = true;

                        }


                    }//illness			
                        //else if(result['injury'] && result['injury']['injury_symptoms'] && result['injury']['injury_symptoms']!='' &&  result['injury']['injury_symptoms']!='NA') 
                    else if (result['claim_type'] == "Injury") {
                        document.getElementById("check_illness").checked = false;
                        document.getElementById("check_other").checked = false;
                        document.getElementById("check_illness").disabled = 'disabled';
                        document.getElementById("check_other").disabled = 'disabled';
                        document.getElementById("illness_div").style.display = 'none';
                        document.getElementById("other_div").style.display = 'none';
                        document.getElementById("injury_div").style.display = 'block';
                        document.getElementById("check_injury").checked = true;
                        if (result['injury']) {

                            $("#date_picker_injury").val(getDate(appendTimeNConvLoc(ymdTomdy(result['injury']['date']))));
                            $("#inj_symptoms").val(result['injury']['symptoms']);
                            $("#location_inj").val(result['injury']['location']);
                            $("#medical_guest").val(result['injury']['medicalFacility']);
                            $("#des_accident").val(result['injury']['description']);
                            $("#inj_observe").val(result['injury']['observation']);
                            $("#fl_condition").val(result['injury']['floorCondition']);
                            $("#mats").val(result['injury']['mats']);

                            if (result['injury']['mats'] == 'Yes') {
                                $('#mat_yes_div').css('display', 'block');
                                $('#y_where').addClass('checkblankB');
                            }
                            else {
                                $('#mat_yes_div').css('display', 'none');
                                $('#y_where').removeClass('checkblankB');

                            }

                            $("#y_where").val(result['injury']['matLocation']);
                            $("#source").val(result['injury']['source']);
                            $("#weather").val(result['injury']['weather']);
                            $("#shoe_type").val(result['injury']['shoeType']);
                            $("#cones").val(result['injury']['cones']);

                            if (result['injury']['cones'] == 'Yes') document.getElementById("cones_yes_div").style.display = 'block';
                            else document.getElementById("cones_yes_div").style.display = 'none';

                            $("#loc_cones").val(result['injury']['coneLocation']);
                            $("#video").val(result['injury']['video']);
                            $("#i_video").val(result['injury']['incidentVideo']);
                            $("#gst_leave").val(result['injury']['guestTransportation']);
                            $("#ambulance").val(result['injury']['ambulance']);
                        }





                    }//injury

                        //other
                        //else if(result['other'] && result['other']['other_car_damage_Y_N'] && result['other']['other_car_damage_Y_N']!='' && result['other']['other_car_damage_Y_N']!='NA') {
                    else if (result['claim_type'] == "Other") {
                        document.getElementById("other_div").style.display = 'block';
                        document.getElementById("check_other").checked = true;
                        document.getElementById("check_illness").checked = false;
                        document.getElementById("check_injury").checked = false;
                        document.getElementById("check_illness").disabled = 'disabled';
                        document.getElementById("check_injury").disabled = 'disabled';
                        document.getElementById("illness_div").style.display = 'none';
                        document.getElementById("injury_div").style.display = 'none';

                        if (result['other']) {
                            $("#car_damage").val(result['other']['damage']);

                            if (result['other']['damage'] == 'Yes')
                                document.getElementById("car_damage_div").style.display = 'block';
                            else {
                                $("#est_cost").val(0);
                                $("#car_damage").val("No");
                                toggle_visibility("No", 'car_damage_div');
                                document.getElementById("car_damage_div").style.display = 'none';
                            }


                            $("#damage_occur").val(result['other']['description']);
                            $("#d_location").val(result['other']['location']);
                            $("#fault_pro").val(result['other']['landlordFault']);
                            if (result['other']['estimatedCost']) {
                                $("#est_cost").val(result['other']['estimatedCost']);
                            }
                            else {
                                $("#est_cost").val(0);
                            }

                            $("#damage").val(result['other']['newDamage']);
                            $("#land_pro").val(result['other']['manager']);
                            $("#mang_sign").val(result['other']['signature']);

                            var inj_otherDate = appendTimeNConvLoc(ymdTomdy(result['other']['date']));
                            $("#date_picker_inj").val(getDate(inj_otherDate));
                        }
                        else {
                            $("#est_cost").val(0);
                            $("#car_damage").val("No");
                            toggle_visibility("No", 'car_damage_div');
                        }




                    }//other

                    if (result["filename"]) {
                        for (var i = 0; i < result["filename"].length; i++) {
                            //addRow_imagelist(result["filename"][i]["fileName"]);
                            addRow_receiptlist(result["filename"][i]["fileName"], currentemp);
                        }
                    }
                });



            } //success       
        });//ajax				 

    }
    else {

        apprise("Please select Claim To Edit");
        location.href = "claims-list.html";
    }
}


//   function getIncidentFiles(inc_id) {
//	 //  TODO - This needs to be fixed
//	   var str;
//	   
//	    $.ajax({
//				type : "GET",
//				contentType : "application/json;charset=utf-8",
//				accept : "application/json",
//				dataType : "json",
//				url : hostname+"ClaimDeskWeb/services/v1/incident/"+inc_id,
//				headers : {
//					"token" : token,
//					"userid" : userId,
//					"locationId" : locationId
//				},
//				success : function(result) {
//					if(result["filename"]){	
//	            		for(var i=0; i<result["filename"].length;i++) {
//	            			 addRow_imagelist(result["filename"][i]["fileName"],"imgListIncident");							
//	            		}
//					  }
//				}
//			   });
//	}



function getIncidentFiles(inc_id) {
    var str;
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        url: hostname + "ClaimDeskWeb/services/v1/incident/" + inc_id + "/files",
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {
            if (result && result["filename"]) {
                for (var i = 0; i < result["filename"].length; i++) {
                    addRow_inc_imagelist(result["filename"][i]["fileName"], inc_id);
                }
            }
            $("#hidden_location_id").val(result['locationId']);
        }
    });

}

function getAllIncident(inc_id) {
    var str;
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        url: hostname + "ClaimDeskWeb/services/v1/incident/getTitles",
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {
            str += "<option value=''>Select Incident</option>";
            for (var key in result) {
                if (result[key]['id'] == inc_id) {
                    var sel = " selected='selected'";
                }
                else {
                    var sel = '';
                }
                str += "<option value=" + result[key]['id'] + " " + sel + " >" + result[key]['title'] + " ," + result[key]['incidentDate'] + "</option>";
            }
            $('#incident_id').html(str);
            var test = inc_id;
            if (test && test != '') $("#incident_id").val(test);

        }
    });
}


//	function getIncidentTitle(id)
//    {
//	alert("Call to get Incident Title...");
//	var name='--';
//	$.ajax({type: "GET",
//				contentType: "application/json;charset=utf-8",
//                accept:"application/json",
//		        dataType: "json",
//				global: false,
//    			async:false,
//				cache: false,
//                url: hostname+"ClaimDeskWeb/services/v1/incident/"+id,
//				headers: { 
//				    "token" : token,
//					"userid" : userId,
//					"locationId" : locationId
//					},
//                success:function(result1){ 
//				
//				   if(result1 && result1['title'])	{					   
//					   name = result1['title'];
//				   }
//				   if(result1 && result1['store_address']){					  
//					   name += '||'+result1['store_address']+", "+result1['store_city']+", "+result1['store_state']+", "+result1['store_zip_code'];
//					  
//				}
//			
//				}
//			});
//	return(name);
//}

function getLocationName(id) {
    var name = '--';
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        global: false,
        async: false,
        cache: false,
        url: hostname + "ClaimDeskWeb/services/v1/location/" + id,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {
            if (result && result['address']['addressLine1']) {
                name = result['address']['addressLine1'] + ", " + result['address']['city'] + ", " + result['address']['state'] + ", " + result['address']['country'] + ", " + result['address']['postalCode'];
            }
        }
    });
    return (name);
}

function download_ClaimFile(filename) {
    var currentClaim = $('#hdn_Claim_Id').val();
    downloadFile(currentClaim, 0, "claim", filename);
}

function download_c_IncidentFile(incident_id, filename) {
    downloadFile(incident_id, 0, "incident", filename);
}

function upload_file(tablename) {
    $('#file_error').html('');

    var fn = upload_Claimfile(tablename);
    if (fn) {
        document.getElementById("pr_img").style.display = "block";
        var currentClaim = $('#hdn_Claim_Id').val();
        var folder = sessionStorage.getItem("claimfolder");
        var formData = new FormData($('#data')[0]);
        uploadFile("claim", currentClaim, folder, fn, formData, function (error, data) {
            if (error) {
                //Display Error
                $('#file_error').html('Error uploading files...');
            }
            else {
                sessionStorage.setItem("claimfolder", data["folder"]);
                document.getElementById("pr_img").style.display = "none";
                if (tablename == "receipt_create") {
                    $('#upfile1').val('');
                    addRow_receiptlist(fn);
                }
                else {
                    $('#upfile').val('');
                    //addRow_imagelist(fn);
                    addRow_receiptlist(fn, currentClaim);
                }


            }
        });
    }
    else {
        $('#file_error').html('Please select a file to upload');
    }

}

// file uploads
function upload_Claimfile(tablename) {
    if ((tablename == 'file' ||
    	tablename == 'receipt_create') &&
        ($('#upfile').val() == '' ||
         $('#upfile').val().indexOf("undefined") > 0)) {
        $("#file_error").html("Please Select File to Upload .");
        return false;
    }
    else if ((tablename == 'receipt') &&
    	    ($('#upfile1').val() == '' ||
    	    $('#upfile1').val().indexOf("undefined") > 0)) {
        $("#file_error1").html("Please Select File to Upload .");
        return false;
    }
    else {
        if (tablename == 'receipt_create') {
            var innerfname = "receipt_" + Math.floor(Date.now() / 1000) + "_" + document.getElementById("upfile").files[0].name;

        }
        else if (tablename == 'receipt') {
            var innerfname = "receipt_" + Math.floor(Date.now() / 1000) + "_" + document.getElementById("upfile1").files[0].name;
        }
        else {
            var innerfname = "claim_" + Math.floor(Date.now() / 1000) + "_" + document.getElementById("upfile").files[0].name;
        }

        return (innerfname);
    }
}

function getLocByincid(incId) {
    //alert("Call Location ByID");
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        cache: false,
        url: hostname + "ClaimDeskWeb/services/v1/incident/" + incId,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {
            $("#hidden_location_id").val(result['location_id']);
        }
    });
}


function goto_claimslist() {
    $('#view').jqExLoad("views/claims-list.html");
    $('#homeId,#dropdown,#incidentId').removeClass('select');
    $('#claimId').addClass('select');
}

function remove_session_variable_onsave() {
    for (var key in localStorage) {
        sessionStorage.removeItem(key)
    }

}

function getClaimType() {
    var obj_ill = document.getElementById('check_illness').checked;
    var obj_inj = document.getElementById('check_injury').checked;
    var obj_oth = document.getElementById('check_other').checked;

    if (obj_ill == true) {
        return "Illness";
    }
    else if (obj_inj == true) {
        return "Injury";
    }
    else if (obj_oth == true) {
        return "Other";
    }
    return "Other";
}


function store_claim() {

    claim_up(function (error, data) {
        if (error) {
            //Show error
        }
        else {
            Update_Diary_Note_Info();
        }
    });



}

// function to update claim .
function claim_up(callback) {

    $("#validation_msg").html("");

    var table = document.getElementById('imglist');
    var rowCount = table.rows.length;

    var filename = [];

    for (var g = 1; g < rowCount; g++) {
        var innerfilename = {};
        innerfilename["fileName"] = $(table.rows[g].childNodes[0].innerHTML)[0].name;
        filename.push(innerfilename);
    }


    var table = document.getElementById('receiptlist');
    var rowCount = table.rows.length;

    var receiptfilename = [];

    for (var g = 1; g < rowCount; g++) {
        var innerfilename = {};
        innerfilename["fileName"] = table.rows[g].childNodes[1].innerHTML;
        receiptfilename.push(innerfilename);
    }

    if ($("#data").valid()) {
        $('#pr_new').show();
        var type = getClaimType();
        var claim_id_edit = document.getElementById("claim_id_edit").value;
        var guest_fname = document.getElementById("guest_fname").value;
        var guest_home_phone = document.getElementById("guest_home_phone").value;
        var guest_id_no = document.getElementById("guest_id_no").value;
        var guest_lname = document.getElementById("guest_lname").value;
        var guest_work_phone = document.getElementById("guest_work_phone").value;
        var guest_state = document.getElementById("guest_state").value;
        var guest_age = document.getElementById("guest_age").value;
        var guest_email = document.getElementById("guest_email").value;
        var parent_name = document.getElementById("parent_name").value;
        var claim_incident_id = checkblank(document.getElementById("incident_id").value);
        var claim_location_id = checkblank(document.getElementById("hidden_location_id").value);

        if (document.getElementById("check_illness").checked == true) {
            var check_illness = document.getElementById("check_illness").value;
        }
        if (document.getElementById("check_injury").checked == true) {
            var check_injury = document.getElementById("check_injury").value;
        }
        if (document.getElementById("check_other").checked == true) {
            var check_other = document.getElementById("check_other").value;
        }

        var claim_desc = document.getElementById("claim_desc").value;
        var claim_notes = '';//document.getElementById("claim_notes").value;

        var utcIllnessDate = localToUtc(document.getElementById("date_picker_product").value + ' ' + document.getElementById("purchased_time").value);

        var date_picker_product = getDate(utcIllnessDate);
        var time_value = getTime(utcIllnessDate);
        var time = document.getElementById("time").value;
        var guest_order = document.getElementById("guest_order").value;
        var guest_eat = document.getElementById("guest_eat").value;
        var place_eat = document.getElementById("place_eat").value;
        var receipt = document.getElementById("receipt").value;
        var receipt_no = document.getElementById("receipt_no").value;
        var receipt_time = document.getElementById("receipt_time").value;
        var ill_symptoms = document.getElementById("ill_symptoms").value;
        var date_picker_receipt = document.getElementById("date_picker_receipt").value;


        var time_ill = document.getElementById("time").value;

        var repDate = localToUtc(document.getElementById("date_picker_illness").value + ' ' + document.getElementById("ill_time_value").value);

        var date_picker_illness = getDate(repDate);
        var ill_time_value = getTime(repDate);
        var ill_time = document.getElementById("ill_time").value;
        var ill_location = document.getElementById("ill_location").value;
        var ill_medical = document.getElementById("ill_medical").value;


        var date_picker_injury = document.getElementById("date_picker_injury").value;
        var inj_symptoms = document.getElementById("inj_symptoms").value;
        var location_inj = document.getElementById("location_inj").value;
        var medical_guest = document.getElementById("medical_guest").value;
        var des_accident = document.getElementById("des_accident").value;
        var inj_observe = document.getElementById("inj_observe").value;
        var fl_condition = document.getElementById("fl_condition").value;
        var mats = document.getElementById("mats").value;
        var y_where = document.getElementById("y_where").value;
        var source = document.getElementById("source").value;
        var weather = document.getElementById("weather").value;
        var shoe_type = document.getElementById("shoe_type").value;
        var cones = document.getElementById("cones").value;
        var video = document.getElementById("video").value;
        var gst_leave = document.getElementById("gst_leave").value;
        var loc_cones = document.getElementById("loc_cones").value;
        var i_video = document.getElementById("i_video").value;
        var ambulance = document.getElementById("ambulance").value;

        var car_damage = document.getElementById("car_damage").value;
        var damage_occur = document.getElementById("damage_occur").value;
        var est_cost = document.getElementById("est_cost").value;
        var d_location = document.getElementById("d_location").value;
        var damage = document.getElementById("damage").value;
        var fault_pro = document.getElementById("fault_pro").value;
        var land_pro = document.getElementById("land_pro").value;
        var mang_sign = document.getElementById("mang_sign").value;
        var date_picker_inj = document.getElementById("date_picker_inj").value;
        var thirdPartyInvolved = document.getElementById("thirdPartyInvolved").value;

        var illness = {};

        if (type == "Illness") {
            illness["date_prod_purchase"] = mdyToymd(checkdate(date_picker_product));
            illness["time_prod_purchase"] = checktime(time_value);
            illness["guest_order_list"] = checkblank(guest_order);
            illness["eaten_by_guest"] = checkblank(guest_eat);
            illness["recipt_name"] = checkblank(place_eat);
            illness["recipt_Y_N"] = checkblank(receipt);
            illness["recipt_no"] = checkzero(receipt_no);
            illness["recipt_time"] = checktime(receipt_time);
            illness["illness_symptoms"] = checkblank(ill_symptoms);
            illness["recipt_date"] = mdyToymd(checkdate(date_picker_receipt));
            illness["illness_date"] = mdyToymd(checkdate(date_picker_illness));
            illness["illness_time"] = checktime(ill_time_value);
            illness["illness_location"] = checkblank(ill_location);
            illness["medicalFacilityProvider"] = checkblank(ill_medical);
            illness["thirdPartyInvolved"] = checkblank(thirdPartyInvolved);
            if ("Yes" == thirdPartyInvolved) {
                var thirdParty = {}
                var divs = ["tpdiv1", "tpdiv2", "tpdiv3"];

                for (var j = 0; j < divs.length; j++) {
                    var s = divs[j];
                    var elementArr = document.getElementById(s).getElementsByTagName('*');

                    for (var i = 0; i < elementArr.length; i++) {

                        if ("text" == elementArr[i].type || "select-one" == elementArr[i].type) {
                            thirdParty[elementArr[i].name.substring(2)] = elementArr[i].value;
                        }

                    }
                }
                var insurer = {}
                divs = ["indiv1", "indiv2", "indiv3"];
                for (var j = 0; j < divs.length; j++) {
                    var s = divs[j];
                    var elementArr = document.getElementById(s).getElementsByTagName('*');

                    for (var i = 0; i < elementArr.length; i++) {

                        if ("text" == elementArr[i].type || "select-one" == elementArr[i].type) {
                            insurer[elementArr[i].name.substring(2)] = elementArr[i].value;
                        }

                    }
                }
                illness["thirdParty"] = thirdParty;
                illness["insurer"] = insurer;

            }
            illness["receipt"] = receiptfilename;
        }

        var injury = {};
        if (type == "Injury") {
            injury["date"] = mdyToymd(checkdate(date_picker_injury));
            injury["symptoms"] = checkblank(inj_symptoms);
            injury["location"] = checkblank(location_inj);
            injury["medicalFacility"] = checkblank(medical_guest);
            injury["description"] = checkblank(des_accident);
            injury["observation"] = checkblank(inj_observe);
            injury["floorCondition"] = checkblank(fl_condition);
            injury["mats"] = checkblank(mats);
            injury["matLocation"] = checkblank(y_where);
            injury["source"] = checkblank(source);
            injury["weather"] = checkblank(weather);
            injury["shoeType"] = checkblank(shoe_type);
            injury["cones"] = checkblank(cones);
            injury["video"] = checkblank(video);
            injury["guestTransportation"] = checkblank(gst_leave);
            injury["coneLocation"] = checkblank(loc_cones);
            injury["incidentVideo"] = checkblank(i_video);
            injury["ambulance"] = checkblank(ambulance);
        }


        var other = {};
        if (type == "Other") {
            other["damage"] = checkblank(car_damage);
            other["description"] = checkblank(damage_occur);
            other["estimatedCost"] = checkzero(est_cost);
            other["location"] = checkblank(d_location);
            other["newDamage"] = checkblank(damage);
            other["landlordFault"] = checkblank(fault_pro);
            other["manager"] = checkblank(land_pro);
            other["signature"] = checkblank(mang_sign);

            var other_date = mdyToymd(getDate(localToUtc(checkdate(date_picker_inj))));
            other["date"] = other_date;
        }

        var guest = [];


        var innerguest = {};
        innerguest["firstName"] = checkblank(guest_fname);
        innerguest["homePhone"] = checkblank(guest_home_phone);
        innerguest["identifier"] = checkblank(guest_id_no);
        innerguest["lastName"] = checkblank(guest_lname);
        innerguest["workPhone"] = checkblank(guest_work_phone);
        innerguest["state"] = checkblank(guest_state);
        innerguest["age"] = checkzero(guest_age);
        innerguest["email"] = checkblank(guest_email);
        innerguest["parent"] = checkblank(parent_name);

        guest.push(innerguest);

        var div_ill = document.getElementById('illness_div');
        var div_inj = document.getElementById('injury_div');
        var div_oth = document.getElementById('other_div');

        var claim_desc = checkblank(claim_desc);

        var jsonData = {
            "claim_id": claim_id_edit,
            "incidentId": claim_incident_id,
            "userId": userId,
            "locationId": claim_location_id,
            "description": claim_desc,
            "guest": guest,
            "status": "ACTIVE",
            "illness": illness,
            "injury": injury,
            "other": other,
            "filename": filename,
            "note": claim_notes,
            "claim_type": type,
            "type": "GL"
        }

        $.ajax({
            type: "POST",
            contentType: "application/json;charset=utf-8",
            accept: "application/json",
            url: hostname + "ClaimDeskWeb/services/v1/claim",
            headers: {
                "token": token,
                "userid": userId,
                "locationId": locationId
            },
            data: JSON.stringify(jsonData),
            success: function (result) {


                remove_session_variable();
                remove_session_variable_onsave();
                //goto_claimslist();
                if (callback) {
                    callback(null, "OK");
                }
            },
            error: function (result) {
                if (callback) {
                    callback("Server Failed");
                }
            }

        });

    }
    else {

        var errObj = $("#data").validate();

        var tab_id = $('#' + errObj.errorList[0].element.id).closest('.tab-pane').prop('id');
        if (tab_id != null && tab_id != '')
            $('a[href="#' + tab_id + '"]').tab('show');

        $('.activeMy').removeClass('activeMy').parent().removeClass('newActive');
        $('#a-' + tab_id).addClass('activeMy').parent().addClass('newActive');
        //$("#validation_msg").html("Invalid data, Please check all tabs.");
        if (callback) {
            callback("Failed");
        }

    }
}

function getValue(value) {
    if (value) { return value; }
    return " ";
}

function showincdetails(inc_id) {
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
                $("#store_no").html(result['branchId']);
                $("#address1").html(result['address']);
                $("#city").html(result['city']);
                $("#state").html(result['state']);
                $("#country").html(result['country']);
                $("#zip").html(result['zipcode']);
                $("#store_phone").html(result['state']);
                $("#fax").html(result['fax']);
                $("#inc_date").html(result['incidentDate'] + " " + getValue(result['incidentTime']));
                $("#date_report").html(result['reportedDate'] + " " + getValue(result['reportedTime']));
                $("#desc").html(result['description']);
                $("#notes").html(result['note']);
                $("#incident_loc").html(result['incidentLocation']);
                $("#police_inv").html(result['policeInvolved']);

                $("#alcohol").html(result['alcohol']);
                if (result['police_invl'] == 'Yes') {
                    $("#police_agency").html(result['policeAgency']);
                    $("#police_case_id").html(result['policeReportId']);
                }
                else {
                    $("#police_agency").html("-");
                    $("#police_case_id").html("-");
                }
                var str2 = '<li class="popInn"><h2 class="popSubHead">Incident Attachments<input  id="btn_add_inc_attatchment" class="popBtt buttonNex" type="button" onclick="btn_add_inc_attatchment(' + inc_id + ',\'GL\')" name="" value="Add Attatchment" /></h2>';

                if (result['filename'] && result['filename'].length > 0) {
                    for (var b = 0, t = 1; b < result['filename'].length; b++, t++) {
                        var obj = result['filename'][b];

                        //str2 += '<div class="customformInci1"><p><span class="headspan" style="width:14%;">File ' + t + ': </span><span id="filename">' + result['filename'][b]['fileName'] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	<img src="images/down1.png" onClick="downloadFile('+inc_id+',0,"incident",\'' + result['filename'][b]['fileName'] + '\')"></img></span> </p> </div> <div class="clear"></div> ';
                        //alert(str2);
                        str2 += '<div class="customformInci1"><p><span class="headspan" style="width:14%;">File ' + t + ': </span><span id="filename">' + result['filename'][b]['fileName'] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	<img src="images/down1.png" onClick="download_c_IncidentFile(' + inc_id + ',\'' + result['filename'][b]['fileName'] + '\')"></img></span> </p> </div> <div class="clear"></div> ';
                    }
                    str2 += '<img id="pr_img" src="images/loading9.gif" style="margin-left:35%;display:none; top:30%; position:absolute;z-index:3000;"/></li>';
                }
                $("#incidentfile_container").html(str2);
            }
        });
    }
}

function checkblank(val) {
    if (val && val != '') {
        return val;
    }
    else {
        return 'NA';
    }
}

function formattedDate(date) {

    var darray = date.split(" ");
    var time = darray[3];
    var day = darray[2];
    var month = getMonthFromString(darray[1]);
    var year = darray[5];
    return (year + "/" + month + "/" + day + " " + time);

}

function getMonthFromString(mon) {
    return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1
}

function chktabcolor() {
    var Adv = $(".editTab").toArray();

    var classList = $('#1').attr('class').split(/\s+/);
    $.each(classList, function (index, item) {
        if (item === 'active') {
            Adv[1].className = "editTab active";
            Adv[0].className = "editTab";
        }
    });

    var classList = $('#2').attr('class').split(/\s+/);
    $.each(classList, function (index, item) {
        if (item === 'active') {
            Adv[2].className = "editTab active";
            Adv[1].className = "editTab";
        }
    });

    var classList = $('#3').attr('class').split(/\s+/);
    $.each(classList, function (index, item) {
        if (item === 'active') {
            Adv[3].className = "editTab active";
            Adv[2].className = "editTab";
        }
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

function fdate(dt) {
    return dt.replace(/\-/g, '/');
}

function msg(m) {
    if (m == 50) apprise("Claim is DECLINED. Can't edit Claim.");
    if (m == 10) apprise("Claim is APPROVED. Can't edit Claim.");
    //alert("Claim is APPROVED. Can't edit Claim.");

}




function hideThirdPartyEntrollment(value) {

    if (value == "Yes") {
        document.getElementById('tpdiv3').style.display = 'block';
        document.getElementById('tpdiv2').style.display = 'block';
        document.getElementById('tpdiv1').style.display = 'block';
        document.getElementById('tpdivs1').style.display = 'block';
        document.getElementById('tpdivs2').style.display = 'block';
        document.getElementById('tpInsurer').style.display = 'block';

        document.getElementById('indiv3').style.display = 'block';
        document.getElementById('indiv2').style.display = 'block';
        document.getElementById('indiv1').style.display = 'block';
        document.getElementById('indivs1').style.display = 'block';
        document.getElementById('indivs2').style.display = 'block';




    }
    else {
        document.getElementById('tpdiv3').style.display = 'none';
        document.getElementById('tpdiv2').style.display = 'none';
        document.getElementById('tpdiv1').style.display = 'none';
        document.getElementById('tpdivs1').style.display = 'none';
        document.getElementById('tpdivs2').style.display = 'none';
        document.getElementById('tpInsurer').style.display = 'none';
        document.getElementById('indiv3').style.display = 'none';
        document.getElementById('indiv2').style.display = 'none';
        document.getElementById('indiv1').style.display = 'none';
        document.getElementById('indivs1').style.display = 'none';
        document.getElementById('indivs2').style.display = 'none';
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

function getNotesByClaimId2(result, claim_id, appendTo_id, isHeadingAndEdit) {

    $('#hdn_Claim_Id').val(claim_id);
    $('#hdn_Diary_Note').val(-1);

    var shtml = '';
    if (isHeadingAndEdit)
        shtml += '<li class="popInn"><h2 class="popSubHead">Diary Notes<input  class="rightAlign buttonNext" id="btn_Create" type="button" onClick="btn_Create_OnClick(' + claim_id + ')" value="Add Note"></h2><br>';
    else {
        shtml += '<input  class="rightAlign buttonNext" id="btn_Create" type="button" onClick="btn_AddNote_OnClick(' + claim_id + ')" value="Add Note"><br><br>';
    }
    $('#claim_button').html(shtml);

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

                html += '<div class="row">';
                html += '<div class="col-md-4"><b>Confidential</b>: ' + YesOrNo(check_blank(item.confidential)) + '</div>'
                html += '<div class="col-md-4"><b>To</b>: ' + (to_emails != '' ? to_emails : '-') + '</div>';
                html += '<div class="col-md-4"><b>Follow Up</b>: ' + YesOrNo(check_blank(item.followUp)) + '</div>'
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


                if (item.status != 'DELETED') {
                    var obj = {};
                    obj.id = item.id;
                    obj.category = item.category;
                    obj.complete = YesOrNo(CheckForUndefined(item.complete));
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
                    obj.updatedBy = CheckForUndefined(item.updatedBy);
                    obj.emails = CheckForUndefined(item.emails);
                    obj.assignedUser = item.assignedUser;
                    obj.followupCancelled = YesOrNo(CheckForUndefined(item.followupCancelled));
                    obj.Action = '';

                    tableData.push(obj);
                }

            }
        });
        sessionStorage.setItem('SsnTblData', JSON.stringify(tableData));
        New_Diary_Table(tableData, claim_id);

    }
    else
        html += '';

    if (isHeadingAndEdit)
        $('#' + appendTo_id).html(html);

}





function getNotesByClaimId(claim_id, appendTo_id, isHeadingAndEdit) {


    var Url = hostname + 'ClaimDeskWeb/services/v1/claim/' + claim_id + '/notes';
    $('#hdn_Claim_Id').val(claim_id);
    $('#hdn_Diary_Note').val(-1);

    var shtml = '';
    if (isHeadingAndEdit)
        shtml += '<li class="popInn"><h2 class="popSubHead">Diary Notes<input  class="rightAlign buttonNext" id="btn_Create" type="button" onClick="btn_Create_OnClick(' + claim_id + ')" value="Add Note"></h2><br>';
    else {
        shtml += '<input  class="rightAlign buttonNext" id="btn_Create" type="button" onClick="btn_AddNote_OnClick(' + claim_id + ')" value="Add Note"><br><br>';
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

            //sessionStorage.setItem('WC_SsnTblData', JSON.stringify(result));
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

                        /*
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
                        */
                        tableData.push(Generate_tbl_object(item));

                    }
                });
                //New_Diary_Table(tableData, claim_id);
                Diary_Table(tableData, claim_id);

            }
            else
                html += '';

            if (isHeadingAndEdit)
                $('#' + appendTo_id).html(html);
        }
    });
}

function Get_Diary_View(result) {

}

function btn_Edit_OnClick(claim_id, note_id) {
    
    var Url = hostname + 'ClaimDeskWeb/services/v1/claim/' + claim_id + '/notes/' + note_id;
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
            Get_Diary_Categories();
            Get_Assigned_Users();
            ReinitialiseEmailCount();
            ReinitialiseToEmailCount();
            $('#ddl_Category').val(result.category);
            $('#claim_id').html(claim_id);
            $('#txt_DiaryNotes').val(result.notes);
            $('#hdn_Diary_Note').val(result.id);
            $('#hdn_Claim_Id').val(claim_id);
            //$("input[name=rdo_Confidential]:checked").val(false);
            if (typeof result.confidential == 'undefined') result.confidential = false;
            if (typeof result.followUp == 'undefined') result.followUp = false;
            //$('input[name=rdo_Confidential]').removeAttr('checked');            
            //$('input[name=rdo_Confidential][value="' + result.confidential + '"]').attr('checked', 'checked');
            setCheckedValue(document.forms['frm_diary_notes'].elements['rdo_Confidential'], result.confidential);
            setCheckedValue(document.forms['frm_diary_notes'].elements['rdo_FollowUp'], result.followUp);

            $('.optional').css('display', check_blank(result.followUp) ? 'block' : 'none');

            if (typeof result.emails != 'undefined') {
                for (var i = 0; i < result.emails.length; i++) {
                    GenerateToEmails(result.emails[i]);
                }
            }
            else
                GenerateToEmails('');



            if (typeof result.followUp != 'undefined' && result.followUp) {
                $('#txt_FollowUp_Date').val(result.followUpTime.substring(0, 10));
                $('#txt_FollowUp_Time').val(result.followUpTime.substring(12, 19));

                if (typeof result.followUpEmails != 'undefined' && result.followUpEmails.length > 0) {
                    for (var i = 0; i < result.followUpEmails.length; i++) {
                        GenerateEmails(result.followUpEmails[i]);
                    }
                }

                $('#txt_FollowUp_Desc').val(result.notes);
            }

            if (result.confidential) {
                $('#txt_FollowUp_Email_0').attr('disabled', 'disabled');
                $('#btnEmailAdd_0').css('display', 'none');

                $('#txt_To_Email_0').attr('disabled', 'disabled');
                $('#btnToEmailAdd_0').css('display', 'none');
            }
        }
    });
}

function ConvertTo24HoursFormat(str) {
    var time = str.toUpperCase();
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM == "PM" && hours < 12) hours = hours + 12;
    if (AMPM == "AM" && hours == 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;

    return sHours + ':' + sMinutes;

}

function Add_Update_DiaryNote_AjaxCall(obj, Url) {

    var t = JSON.stringify(obj);
    $.ajax({
        type: 'POST',
        contentType: 'application/json;charset=utf-8',
        accept: 'application/json',
        dataType: 'json',
        cache: false,
        url: Url,
        data: JSON.stringify(obj),
        headers: {
            'token': token,
            'userid': userId,
            'locationId': locationId
        },
        success: function (result) {
            $('#txt_DiaryNotes').val('');
            $('#hdn_Diary_Note').val(-1);
            getNotesByClaimId($('#hdn_Claim_Id').val(), 'tbl_Diaries', false);
            $('#Emails').html('');
            $('#edit_diary').modal('hide');
            email_count = -1;
        }
    });
}

function Diary_Table(data, claim_id) {
    try {
        $('#div_tbl').html('');
        var strTable = '';
        strTable += '<table class="fullwidth tcellspacing noborder" id="tbl_Diaries">';
        strTable += '<thead class="myTabHead">';
        strTable += '<tr>';
        strTable += '<th class="talign">Diary No.</th>';
        strTable += '<th class="talign">Description</th>';
        strTable += '<th class="talign">Confidential</th>';
        strTable += '<th class="talign">Created By</th>';
        strTable += '<th class="talign">Created Date</th>';
        strTable += '<th class="talign">Follow Up Date</th>';
        strTable += '<th class="talign">Follow Up</th>';
        strTable += '<th class="talign">#Action</th>';
        strTable += '</tr>';
        strTable += '</thead>';
        strTable += '<tbody>';
        strTable += '</tbody>';
        strTable += '</table>';

        $('#div_tbl').html(strTable);

        $('#tbl_Diaries').dataTable({
            "bProcessing": true,
            "bPaginate": false,
            "bLengthChange": true,
            "bFilter": false,
            "bSort": true,
            "bInfo": false,
            "bAutoWidth": true,
            "sPaginationType": "full_numbers",
            "iDisplayLength": 10,
            //"aaSorting": [[0, "desc"]],
            //"aoColumnDefs": [{ bSortable: false, aTargets: [-1, 0] }],
            "aaData": data,
            "aoColumns": [
                { "mDataProp": "id" },
                { "mDataProp": "notes" },
                { "mDataProp": "confidential" },
                { "mDataProp": "createdBy" },
                { "mDataProp": "created" },
                { "mDataProp": "followUpTime" },
                { "mDataProp": "followUp" },
                {
                    "mDataProp": "Action",
                    "bSearchable": false,
                    "bSortable": false,
                    "mRender": function (data, type, full) {
                        var str = '<a data-toggle="modal" data-target="#edit_diary" style="cursor:pointer;" href="#" onclick="btn_Edit_OnClick(' + claim_id + ', ' + full.id + ');"><img src="images/edit.png" alt="" /></a>&nbsp;&nbsp;&nbsp;<a href="#" onclick="btn_Delete_OnClick(' + claim_id + ', ' + full.id + ');"><img src="images/min5.png" alt="" /></a>';
                        str += '&nbsp;&nbsp;&nbsp;<a href="#" onclick="btn_View_OnClick(' + claim_id + ', ' + full.id + ');"><img src="images/min1.png" alt="" /></a>';
                        return str;
                    }
                }]
        });
    }
    catch (ex) {

    }
}


function btn_Delete_OnClick(claim_id, note_id) {
    if (apprise_flag) {
        apprise_flag = false;
        var string = 'Do you want to delete this Diary Note?';
        var args = { 'input': false };
        apprise(string, args, function (r) {
            if (r) {
                var Url = hostname + '/ClaimDeskWeb/services/v1/claim/' + claim_id + '/notes/' + note_id;
                $.ajax({
                    type: 'DELETE',
                    url: Url,
                    headers: {
                        'token': token,
                        'userid': userId,
                        'locationId': locationId
                    },
                    success: function (result) {
                        apprise_flag = true;
                        getNotesByClaimId(claim_id, 'tbl_Diaries', false);
                    }
                });
            }
            else
                apprise_flag = true;
        });
    }
}



function Delete_Diary_Note_AjaxCall(note_id, claim_id) {
    var Url = hostname + 'ClaimDeskWeb/services/v1/claim/' + claim_id + '/notes/' + note_id;
    $.ajax({
        type: 'DELETE',
        url: Url,
        headers: {
            'token': token,
            'userid': userId,
            'locationId': locationId
        },
        success: function (result) {
            //apprise_flag = true;
            //getNotesByClaimId(claim_id, 'tbl_Diaries', false);
        }
    });
}

function Update_Diary_Note_Info() {
    var claim_id = $('#hdn_Claim_Id').val();//sessionStorage.getItem("claim_id");
    var Jobj = JSON.parse(sessionStorage.getItem('SsnDiaryNoteObj'));
    var Delete_Jobj = JSON.parse(sessionStorage.getItem('SsnDeleteDiaryNoteObj'));

    var Url = hostname + 'ClaimDeskWeb/services/v1/claim/' + claim_id + '/notes/';
    if (Jobj != null) {
        for (var i = 0; i < Jobj.length; i++) {
            if (Jobj[i].id < 0)
                delete Jobj[i].id;
            Add_DiaryNote_AjaxCall(Jobj[i], Url);
        }
        sessionStorage.removeItem('SsnDiaryNoteObj');
    }

    if (Delete_Jobj != null) {
        for (var i = 0; i < Delete_Jobj.length; i++) {
            Delete_Diary_Note_AjaxCall(Delete_Jobj[i], claim_id);
        }
        sessionStorage.removeItem('SsnDeleteDiaryNoteObj');
    }
    sessionStorage.removeItem('SsnDiaryNoteId');

    $('#view').jqExLoad('views/claims-list.html').hide().fadeIn();
    $('#pr_new').hide();
}

function NullifySsn() {
    sessionStorage.setItem('SsnDiaryNoteObj', null);
    sessionStorage.setItem('SsnDeleteDiaryNoteObj', null);
    sessionStorage.setItem('SsnDiaryNoteId', null);
    sessionStorage.setItem('SsnTblData', null);


    sessionStorage.removeItem('SsnDiaryNoteObj');
    sessionStorage.removeItem('SsnDeleteDiaryNoteObj');
    sessionStorage.removeItem('SsnDiaryNoteId');
    sessionStorage.removeItem('SsnTblData');
}

function getAllDiaryNotes(claim_id, appendTo_id) {
    var Url = hostname + 'ClaimDeskWeb/services/v1/claim/' + claim_id + '/notes';

    var html = '';
    html += '<li class="popInn" style="list-style-type: none;"><h2 class="popSubHead">Diary Notes<input  class="popBtt buttBlue" id="btn_Create" type="button" onClick="btn_Create_OnClick(' + claim_id + ')" value="Add Note"></h2><br>';


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
                });


            }
            else
                html += '';


            $('#' + appendTo_id).html(html);
        }
    });
}

function getDropdownData(url, cntrlId, locationId1) {
    var def = $.Deferred();
    $.ajax({
        type: 'GET',
        contentType: 'application/json;charset=utf-8',
        accept: 'application/json',
        dataType: 'json',
        cache: false,
        url: hostname + url + locationId1,
        headers: {
            'token': token,
            'userid': userId,
            'locationId': locationId
        },
        success: function (result) {
            $('#' + cntrlId).empty();
            if (result != null) {
                $('#' + cntrlId).append('<option value=""></option>');
                $.each(result, function (i, val) {
                    $('#' + cntrlId).append('<option value="' + val.code + '">' + val.description + '</option>');
                });
            }
            def.resolve();
        }
    });
    return def.promise();
}

function btn_claim_Back() {
    var tabId = $('#tabDiv ul li.active')[0].id.split('-')[1];
    var prevTab = tabId - 1;
    $('#a-' + prevTab).tab('show');
    removeAddGreenClass(tabId, tabId - 1);
}

function tab_Claim_Click(obj) {

    var tabId = $('.breadcrumbMy li.active')[0].id.split('-')[1];
    var isDisabledTab = $(obj).parent().hasClass('disabledCss');
    var currentSelId = $(obj).parent().prop('id').split('-')[1];
    var frmId = '';
    if (tabId == '3') {
        frmId = '#data';
    }
    else {
        frmId = '#frm_' + tabId;
    }
    if ($(frmId).valid()) {
        if (frmId == '#frm_1') {
            claim_step_one(false);
            save_to_session_claim();
        }
        else if (frmId == '#frm_2') {
            claim_step_two(false);
            save_to_session_claim1();
        }
        else if (frmId == '#frm_3') {
            claim_step_three(false);
        }
        else if (frmId == '#frm_4') {
            claim_step_six(false);
        }

        if (!isDisabledTab) {
            $('a[data-target="' + obj.getAttribute('data-target') + '"]').tab('show');
            removeAddGreenClass(tabId, currentSelId);
        }
        else {
            var nextId = $('.breadcrumbMy li.disabledCss')[0].id.split('-')[1];

            if (currentSelId == nextId) {
                $('a[data-target="#' + nextId + '"]').tab('show');
                $(obj).parent().removeClass('disabledCss');

                removeAddGreenClass(tabId, currentSelId);
            }

        }

    }
    else {
        var errObj = $(frmId).validate();
    }
}