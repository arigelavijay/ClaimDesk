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


function loadClaim1() {
    authentication();
    load_data();
    setDefaultClaimType();
    load_from_session_claim1();
    getDropdownData('ClaimDeskWeb/services/v1/code/C_SHOETYPE/', 'shoe_type', sessionStorage.getItem("incLocId"));
    getDropdownData('ClaimDeskWeb/services/v1/code/C_WEATHER/', 'weather', sessionStorage.getItem("incLocId"));
}

function loadClaim() {
    authentication();
    load_data();
    var incidentId = sessionStorage.getItem('incEdit');    
    getAllIncident(incidentId);
    //getIncidentFiles();
    load_from_session_claim();
    fillage()
}

// function to load datepicker to all claims		
function load_data() // frm claim.html (starting page of create - claim )
{
    set_header();
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

function SortByIncDt(a, b) {
    var dt = new Date(a.incidentDate);
    var dt2 = new Date(b.incidentDate);
    if (dt < dt2) return 1;
    if (dt > dt2) return -1;
    return 0;
}

var isDefaultCol = true;
var isDefaultDir = true;
function load_list_data() {
    
    sessionStorage.removeItem("claimEdit");
    /*
    var oTable = $('#example1').dataTable({
        "bStateSave": true,
        "sPaginationType": "full_numbers",
        "bServerSide": true,
        "bProcessing": true,
        "bSortClasses": false,
        "bDeferRender": true,
        "sAjaxSource": hostname + "ClaimDeskWeb/services/v1/claim/claimList",
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
                cache: false,
                //"data": JSON.stringify(paramData),
                "success": function (result) {                    
                    result.claims = result.claims.sort(SortByIncDt);
                    var gettitlearr = {};
                    var getlocarr = {};
                    var count = 0;
                    var tempdset = {};
                    var dataSet = [];
                    for (var key in result["claims"]) {
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
                    tempdset["iTotalRecords"] = result["totalRecord"];
                    tempdset["iTotalDisplayRecords"] = result["totalRecord"];
                    tempdset["aaData"] = dataSet
                    //	alert(JSON.stringify(dataSet));	
                    fnCallback(tempdset);



                }
            });

        }
    });
    	    //oTable.fnSort( [ [1,'desc'] ] );

    */

    
    var obj = {};
    obj.locations = [locationId];
    
    Search(obj, 'ClaimDeskWeb/services/v1/search/advancedSearch');
    
}

function DiaryNoteImage(hasDiaryNote, claim_id) {

    var html = '';
    if (hasDiaryNote)
        html += "<li class='veiwInc' data-toggle='modal' data-target='.view_diaries_modal_css' style='cursor:pointer;'><img src='" + GetImage(hasDiaryNote) + "' width='16' height='19' alt='img' onclick=\"setlocId(" + claim_id + ",'view_diary')\" /></li>"
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





function claim_step_one() // step1 : claim.html (no of guests ..)
{
    if ($("#claim_one_frm").valid()) {

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


        location.href = 'claim1.html';
    }
}

// function to load claim step two page with claim info etc.			
function claim_step_two() // step 2 : claim1.html 
{
    if ($("#data").valid()) {
        var claim_desc = document.getElementById("claim_desc").value;
        sessionStorage.setItem("claim_desc", claim_desc);
        var illness = {};
        sessionStorage.setItem("claimType", getClaimType());

        if ($("#check_illness").is(":checked")) {

            // checkbox for illness ........................           

            var time = document.getElementById("time").value; // value.. AM/PM
            var guest_order = document.getElementById("guest_order").value;
            var guest_eat = document.getElementById("guest_eat").value;
            var place_eat = document.getElementById("place_eat").value;
            var receipt = document.getElementById("receipt").value;
            //  upload file url values pending  .....
            var receipt_no = document.getElementById("receipt_no").value;
            var ill_symptoms = document.getElementById("ill_symptoms").value;

            
            /* ------------ */
            var date_picker_product = document.getElementById("date_picker_product").value;
            var time_value = document.getElementById("purchased_time").value; // value..2/3/4

            var date_picker_receipt = document.getElementById("date_picker_receipt").value;
            var receipt_time = document.getElementById("receipt_time").value;

            var date_picker_illness = document.getElementById("date_picker_illness").value;
            var ill_time_value = "";
            if (date_picker_illness != null && date_picker_illness != '')
                ill_time_value = document.getElementById("ill_time_value").value;
            /* ------------ */


            // var time_value_ill = document.getElementById("time_value").value; //i.e 2,3
            var time_ill = document.getElementById("time").value; //i.e AM/PM

            var ill_time = document.getElementById("ill_time").value;
            var ill_location = document.getElementById("ill_location").value;
            var ill_medical = document.getElementById("ill_medical").value;


            sessionStorage.setItem("claim_date_picker_product", date_picker_product);
            sessionStorage.setItem("claim_time_value", time_value);
            sessionStorage.setItem("claim_time", time);
            sessionStorage.setItem("claim_guest_order", guest_order);
            sessionStorage.setItem("claim_guest_eat", guest_eat);
            sessionStorage.setItem("claim_place_eat", place_eat);
            sessionStorage.setItem("claim_receipt", receipt);
            sessionStorage.setItem("claim_receipt_no", receipt_no);
            sessionStorage.setItem("claim_receipt_time", receipt_time);
            sessionStorage.setItem("claim_ill_symptoms", ill_symptoms);
            
            sessionStorage.setItem("claim_date_picker_receipt", date_picker_receipt);
            sessionStorage.setItem("claim_date_picker_illness", date_picker_illness);

            // sessionStorage.setItem("claim_time_value_ill", time_value_ill);
            sessionStorage.setItem("claim_time_ill", time_ill);
            sessionStorage.setItem("claim_ill_time_value", ill_time_value);
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


            sessionStorage.setItem("claim_date_picker_injury", date_picker_injury);
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

            sessionStorage.setItem("other_car_damage", car_damage);
            sessionStorage.setItem("other_damage_occur", damage_occur);
            sessionStorage.setItem("other_est_cost", est_cost);
            sessionStorage.setItem("other_d_location", d_location);
            sessionStorage.setItem("other_damage", damage);
            sessionStorage.setItem("other_fault_pro", fault_pro);
            sessionStorage.setItem("other_land_pro", land_pro);
            sessionStorage.setItem("other_mang_sign", mang_sign);
            sessionStorage.setItem("other_date_picker_inj", date_picker_inj);
        }


        var table = document.getElementById('imglist');
        var rowCount = table.rows.length;
        var filename1 = [];
        for (var g = 1; g < rowCount; g++) {
            var innerfilename = {};
            innerfilename["fileName"] = table.rows[g].childNodes[1].innerHTML;
            filename1.push(innerfilename);
        }
        sessionStorage.setItem("receiptlist", JSON.stringify(filename1));
        location.href = 'claim4.html';
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


    var table = document.getElementById('imglist');
    var rowCount = table.rows.length;
    var filename = [];

    for (var g = 1; g < rowCount; g++) {
        var innerfilename = {};
        innerfilename["fileName"] = table.rows[g].childNodes[0].innerHTML;
        filename.push(innerfilename);
    }

    return filename;
}


function claim_step_three() {
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
    
    var ttt = GetValueOrEmpty(sessionStorage.getItem("claim_date_picker_receipt"));
    var ttttt = GetValueOrEmpty(sessionStorage.getItem("claim_receipt_time"));
    var rec_Date_time = localToUtc(GetValueOrEmpty(sessionStorage.getItem("claim_date_picker_receipt")) + ' ' + GetValueOrEmpty(sessionStorage.getItem("claim_receipt_time")), 'MM/DD/YYYY hh:mm A');

    illness["recipt_date"] = mdyToymd(getDate(check_blank(rec_Date_time), 'MM/DD/YYYY'));
    illness["recipt_time"] = checktime(getTime(rec_Date_time, 'hh:mm A'));
    // illness values ....    
    illness["guest_order_list"] = checkblank(sessionStorage.getItem("claim_guest_order"));
    illness["eaten_by_guest"] = checkblank(sessionStorage.getItem("claim_guest_eat"));
    illness["recipt_name"] = checkblank(sessionStorage.getItem("claim_place_eat"));
    //place eat.= receipt name
    illness["recipt_Y_N"] = checkblank(sessionStorage.getItem("claim_receipt"));
    illness["recipt_no"] = checkzero(sessionStorage.getItem("claim_receipt_no"));

   
    //var recieptDtTime = localToUtc(sessionStorage.getItem("claim_date_picker_receipt") + ' ' + sessionStorage.getItem("claim_receipt_time"), 'MM/DD/YYYY hh:mm A');
    var recieptDtTime = localToUtc(sessionStorage.getItem("claim_date_picker_product") + ' ' + sessionStorage.getItem("claim_time_value"), 'MM/DD/YYYY hh:mm A');
    illness["date_prod_purchase"] = checkblank(mdyToymd(getDate(recieptDtTime, 'MM/DD/YYYY')));
    illness["time_prod_purchase"] = checktime(getTime(recieptDtTime, 'hh:mm A'));

    var illnessUtcDtTime = localToUtc(sessionStorage.getItem("claim_date_picker_illness") + ' ' + sessionStorage.getItem("claim_ill_time_value"), 'MM/DD/YYYY hh:mm A');
    illness["illness_date"] = mdyToymd(getDate(illnessUtcDtTime, 'MM/DD/YYYY'));
    illness["illness_time"] = checktime(getTime(illnessUtcDtTime, 'hh:mm A'));

    
    illness["illness_symptoms"] = checkblank(sessionStorage.getItem("claim_ill_symptoms"));
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
    window.location.href = 'claim6.html';

}

function claim_step_six() {
    Save_New_Claim();
}

function Save_New_Claim() {
    
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
            sessionStorage.setItem("claim_id", result);
            remove_session_variable();
            remove_session_variable_onsave();
            location.href = "claim5.html";
        }
    });

    sessionStorage.removeItem('SsnNewClaimData');
}




// add images lauout
function addRow_imagelist(filename, incident) {

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
        element1.addEventListener("click", function () { download_IncidentFile(incident, filename); });
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

function load_data_last() {

    $("#fname").html("Claim ID : " + sessionStorage.getItem("claim_id"));
    $('<div id="img1_' + sessionStorage.getItem("claim_id") + '" data-claim-type="GL"></div>').appendTo('#fname');
    get_files(sessionStorage.getItem("claim_id"))
}

function get_files(claim_id) {

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




function callfunc(flag) {

    setlocId(sessionStorage.getItem('claim_id'), flag);

    $('.bs-example-modal-lg').modal('show');
}

function view_claim() {
    var claim_id = sessionStorage.getItem('claim_id');
    //setlocId(claim_id, 'show')
}


// functio for edit delete view 
function setlocId(locId, flag) {
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
                    sessionStorage.setItem("img_claimId", result["claim_id"]);
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

                //=========================================================		
                //	< span id> . table field name
                //if(result['illness'] && result['illness']['guest_order_list'] && result['illness']['guest_order_list']!='' &&  result['illness']['guest_order_list']!='NA') { 	

                document.getElementById("injury_div").style.display = 'none';
                document.getElementById("other_div").style.display = 'none';
                document.getElementById("thirdParty").style.display = 'none';
                document.getElementById("insurer").style.display = 'none';
                if (result['claim_type'] == 'Illness') {
                    if (result['illness']) {
                        document.getElementById("illness_div").style.display = 'block';
                        var productPurchasedDtTime = UtcToLocal(ymdTomdy(checkblank(result['illness']['date_prod_purchase'])) + ' ' + checkblank(result['illness']['time_prod_purchase']), 'MM/DD/YYYY hh:mm A');

                        $("#Date_Product_Purchased").html(checkblank(getDate(productPurchasedDtTime, 'MM/DD/YYYY')));
                        $("#Purchased_Time").html(checkblank(getTime(productPurchasedDtTime, 'hh:mm A')));

                        $("#What_guest_order").html(checkblank(result['illness']['guest_order_list']));
                        $("#What_guest_eat").html(checkblank(result['illness']['eaten_by_guest']));

                        $("#Where_guest_eat").html(checkblank(result['illness']['recipt_name']));
                        $("#Receipt").html(checkblank(result['illness']['recipt_Y_N']));
                        $("#Receipt_Number").html(checkblank(result['illness']['recipt_no']));
                        
                        if (checkblank(result['illness']['recipt_Y_N']) == 'Yes') {
                            var receiptDtTime = UtcToLocal(ymdTomdy(checkblank(result['illness']['recipt_date'])) + ' ' + checkblank(result['illness']['recipt_time']), 'MM/DD/YYYY hh:mm A');

                            $("#Receipt_Date").html(checkblank(getDate(receiptDtTime, 'MM/DD/YYYY')));
                            $("#Receipt_Time").html(checkblank(getTime(receiptDtTime, 'hh:mm A')));
                        }
                        else {
                            $("#Receipt_Date").html('NA');
                            $("#Receipt_Time").html('NA');
                        }

                        $("#Illness_Symptoms").html(checkblank(result['illness']['illness_symptoms']));

                        var illnessDtTime = UtcToLocal(ymdTomdy(typeof result['illness']['illness_date'] != 'undefined' ? result['illness']['illness_date'] : '') + ' ' + (typeof result['illness']['illness_time'] != 'undefined' ? result['illness']['illness_time'] : ''), 'MM/DD/YYYY hh:mm A');
                        $("#Illness_Date").html(checkblank(getDate(illnessDtTime, 'MM/DD/YYYY')));
                        $("#Illness_Time").html(checkblank(getTime(illnessDtTime, 'hh:mm A')));

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
                var str1 = '<li class="popInn"><h2 class="popSubHead">Attachments<input  id="btn_add_claim_attachment" class="popBtt buttonNex" type="button" onclick="btn_add_claim_attatchment(' + locId + ',\'GL\')" name="" value="Add Attachment" /></h2>';

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
        sessionStorage.setItem("claimEdit", locId);
        location.href = "edit-claim.html";
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
                        location.reload();
                    },
                    error: function (request, status, error) {
                        location.reload();
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
    sessionStorage.setItem('incLocId', incidentLocId);
    sessionStorage.setItem('claimEditWC', locId);
    sessionStorage.setItem('hasDiaryNote', hasDiaryNote);
    window.location.href = 'wc.html';
}

function ShowWc(locId, incidentLocId) {
    var promise = getWcDataByClaimId(locId);
    var jspPromise = getJspPageContent(incidentLocId);

    $.when(promise, jspPromise).done(function (result, result2) {        
        result.report.claimant.age = (result.report.claimant.age == '-1' ? 'UNKNOWN' : result.report.claimant.age)
        var incidentPromise = getIncidentDetails(result.report.metadata.incidentId);
        $.when(incidentPromise).done(function (result3) {            
            $('#tab_diaryNotes').prev().prev('.popSubHead').html('Diary Notes   <input class="rightAlign buttonNext" id="btn_Create_wc" data-claim-type="wc" type="button" onclick="btn_Create_OnClick(' + locId + ')" value="Add Note">');
            getNotesByClaimId(locId, 'tab_diaryNotes', true);
            $("#wc_incident_id").html(result.report.metadata.incidentId);
            $("#wc_store_no").html(result3['branchId']);
            $("#wc_address1").html(result3['address']);
            $("#wc_city").html(result3['city']);
            $("#wc_state").html(result3['state']);
            $("#wc_country").html(result3['country']);
            $("#wc_zip").html(result3['zipcode']);
            $("#wc_store_phone").html(result3['phone']);
            $("#wc_fax").html(result3['fax']);
            $("#wc_inc_date").html(UtcToLocal(result3['incidentDate'] + " " + getValue(result3['incidentTime']), 'MM/DD/YYYY hh:mm:ss A'));
            $("#wc_date_report").html(UtcToLocal(result3['reportedDate'] + " " + getValue(result3['reportedTime']), 'MM/DD/YYYY hh:mm:ss A'));
            $("#wc_desc").html(result3['description']);
            $("#wc_notes").html(result3['note']);
            $("#wc_incident_loc").html(result3['incidentLocation']);
            $("#wc_police_inv").html(result3['policeInvolved']);

            $("#wc_alcohol").html(result3['alcohol']);
            if (result3['policeInvolved'] == 'Yes') {
                $("#wc_police_agency").html(result3['policeAgency']);
                $("#wc_police_case_id").html(result3['policeReportId']);
            }
            else {
                $("#wc_police_agency").html("-");
                $("#wc_police_case_id").html("-");
            }


            var str2 = '<li class="popInn"><h2 class="popSubHead">Incident Attachments<input id="btn_add_inc_attatchment" class="popBtt buttonNex" type="button" name="" value="Add Attachment" onclick="btn_add_inc_attatchment(' + result.report.metadata.incidentId + ',\'WC\')" /></h2>';//

            if (result3['filename'] && result3['filename'].length > 0) {
                for (var b = 0, t = 1; b < result3['filename'].length; b++, t++) {
                    var obj = result3['filename'][b];

                    //str2 += '<div class="customformInci1"><p><span class="headspan" style="width:14%;">File ' + t + ': </span><span id="filename">' + result['filename'][b]['fileName'] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	<img src="images/down1.png" onClick="downloadFile('+inc_id+',0,"incident",\'' + result['filename'][b]['fileName'] + '\')"></img></span> </p> </div> <div class="clear"></div> ';
                    //alert(str2);
                    str2 += '<div class="customformInci1"><p><span class="headspan" style="width:14%;">File ' + t + ': </span><span id="filename">' + result3['filename'][b]['fileName'] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	<img src="images/down1.png" onClick="download_IncidentFile(' + result.report.metadata.incidentId + ',\'' + result3['filename'][b]['fileName'] + '\')"></img></span> </p> </div> <div class="clear"></div> ';
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
            $('#tab_attatchments').prev().remove().prev().remove().parent().removeClass('popInn');
            strClaimHtml = '<li><h2 class="popSubHead">Claim Attachments<input  id="btn_add_claim_attatchment" class="popBtt buttonNex" type="button" name="" value="Add Attachment" onclick="btn_add_claim_attatchment(' + locId + ',\'WC\')" /></h2>';//
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
    });
}

function removeAddGreenClass(id, current) {
    $('#li-' + id).removeClass('newActive');
    $('#a-' + id).removeClass('activeMy');

    $('#li-' + current).addClass('newActive');
    $('#a-' + current).addClass('activeMy');
}

function createPageLoad() {
    
    NullifySsn();
    var currentemp = sessionStorage.getItem("claimEdit");
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
                    var isCreateDiary = sessionStorage.getItem('SsnisCreateDiary') == 'true' ? true : false;
                    if (isCreateDiary) {
                        removeAddGreenClass('1', '4');
                        $('.divider a[href="#4"]').tab('show');
                        sessionStorage.setItem('SsnisCreateDiary', null);
                        btn_AddNote_OnClick(currentemp);
                    }

                    var is_add_claim_attatchment = sessionStorage.getItem('Ssn_is_Add_claim_Attatchment') == 'true' ? true : false;
                    if (is_add_claim_attatchment) {
                        removeAddGreenClass('1', '3');
                        $('.divider a[href="#3"]').tab('show');
                        sessionStorage.removeItem('Ssn_is_Add_claim_Attatchment');
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

                            var utcDate = UtcToLocal(ymdTomdy(result['illness']['date_prod_purchase'] + ' ' + result['illness']['time_prod_purchase']), 'MM/DD/YYYY hh:mm A');

                            $("#date_picker_product").val(getDate(utcDate, 'MM/DD/YYYY'));
                            $("#purchased_time").val(getTime(utcDate, 'hh:mm A'));
                            $("#guest_order").val(result['illness']['guest_order_list']);
                            $("#guest_eat").val(result['illness']['eaten_by_guest']);
                            $("#place_eat").val(result['illness']['recipt_name']);
                            $("#receipt").val(result['illness']['recipt_Y_N']);

                            if (result['illness']['recipt_Y_N'] == "Yes") {
                                $('#file_upload_div').css('display', 'block');
                                $('#receipt_no').addClass('checkblankA');
                                $('#date_picker_receipt').addClass('checkblankA');


                                var dateRecieptTime = UtcToLocal(ymdTomdy(result['illness']['recipt_date'] + ' ' + result['illness']['recipt_time']), 'MM/DD/YYYY hh:mm A');
                                $("#date_picker_receipt").val(getDate(dateRecieptTime, 'MM/DD/YYYY'));
                                $("#receipt_time").val(getTime(dateRecieptTime, 'hh:mm A'));
                            }
                            else {
                                $('#file_upload_div').css('display', 'none');
                                $('#receipt_no').removeClass('checkblankA');
                                $('#date_picker_receipt').removeClass('checkblankA');
                            }

                            $("#receipt_no").val(result['illness']['recipt_no']);
                            $("#ill_symptoms").val(result['illness']['illness_symptoms']);
                            
                            var illnessDtTime = UtcToLocal(ymdTomdy(typeof result['illness']['illness_date'] != 'undefined' ? result['illness']['illness_date'] : '') + ' ' + (typeof result['illness']['illness_time'] != 'undefined' ? result['illness']['illness_time'] : ''), 'MM/DD/YYYY hh:mm A');
                            $("#date_picker_illness").val(getDate(illnessDtTime, 'MM/DD/YYYY'));
                            $("#ill_time_value").val(getTime(illnessDtTime, 'hh:mm A'));
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
                            $("#date_picker_injury").val(ymdTomdy(result['injury']['date']));
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
                                $("#car_damage").val("No");
                                toggle_visibility("No", 'car_damage_div');
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
                            $("#date_picker_inj").val(ymdTomdy(result['other']['date']));
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
//	} //Test



function getIncidentFiles(inc_id) {
    var str;
    if (!inc_id) {
        inc_id = sessionStorage.getItem("incident_id");
    }
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
                    addRow_imagelist(result["filename"][i]["fileName"], inc_id);
                }
            }
            $("#hidden_location_id").val(result['locationId']);
        }
    });

}

function getAllIncident(inc_id) {
    //TODO - Optimize this query by only returning the value that api needs to consume
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
                var incDtTime = UtcToLocal(result[key]['incidentDate'] + ' ' + result[key]['incidentTime'], 'M/D/YY hh:mm:ss A');
                str += "<option value=" + result[key]['id'] + " " + sel + " >" + result[key]['title'] + " ," + getDate(incDtTime, 'M/D/YY') + "</option>";
            }
            $('#incident_id').html(str);
            var test = sessionStorage.getItem("incident_id");
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
    // aboutInfo();
}

function download_ClaimFile(filename) {
    var currentClaim = sessionStorage.getItem("claimEdit");
    if (!currentClaim) {
        currentClaim = sessionStorage.getItem('img_claimId');
    }
    downloadFile(currentClaim, 0, "claim", filename);
}

function download_IncidentFile(incident_id, filename) {
    downloadFile(incident_id, 0, "incident", filename);
}

function upload_file(tablename) {
    $('#file_error').html('');

    var fn = upload(tablename);
    if (fn) {
        document.getElementById("pr_img").style.display = "block";
        var currentClaim = sessionStorage.getItem("claimEdit");
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
function upload(tablename) {
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


function gotolist() {
    location.href = "claims-list.html";
}

function remove_session_variable_onsave() {
    for (var key in localStorage) {
        localStorage.removeItem(key)
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
        
        var time = document.getElementById("time").value;
        var guest_order = document.getElementById("guest_order").value;
        var guest_eat = document.getElementById("guest_eat").value;
        var place_eat = document.getElementById("place_eat").value;
        var receipt = document.getElementById("receipt").value;
        
        var receipt_no = document.getElementById("receipt_no").value;
        var receipt_time = document.getElementById("receipt_time").value;
        var ill_symptoms = document.getElementById("ill_symptoms").value;
        var date_picker_receipt = document.getElementById("date_picker_receipt").value;
        var date_picker_illness = document.getElementById("date_picker_illness").value;

        var time_ill = document.getElementById("time").value;
        
        
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
        debugger;
        if (type == "Illness") {
            /* ----------- */
            if ($('#date_picker_illness').val() != '') {
                var illnessUtcDtTime = localToUtc($('#date_picker_illness').val() + ' ' + $('#ill_time_value').val(), 'MM/DD/YYYY hh:mm A');
                illness["illness_date"] = mdyToymd(getDate(illnessUtcDtTime, 'MM/DD/YYYY'));
                illness["illness_time"] = checktime(getTime(illnessUtcDtTime, 'hh:mm A'));
            }

            var productDtTime = localToUtc($('#date_picker_product').val() + ' ' + $('#purchased_time').val(), 'MM/DD/YYYY hh:mm A');
            illness["date_prod_purchase"] = checkblank(mdyToymd(getDate(productDtTime, 'MM/DD/YYYY')));
            illness["time_prod_purchase"] = checktime(getTime(productDtTime, 'hh:mm A'));

            if (receipt == 'Yes') {
                var receiptDtTime = localToUtc($('#date_picker_receipt').val() + ' ' + $('#receipt_time').val(), 'MM/DD/YYYY hh:mm A');
                illness["recipt_date"] = mdyToymd(getDate(check_blank(receiptDtTime), 'MM/DD/YYYY'));
                illness["recipt_time"] = checktime(getTime(receiptDtTime, 'hh:mm A'));
            }
            else {

            }
            /* ----------- */
            //illness["date_prod_purchase"] = mdyToymd(checkdate(date_picker_product));
            //illness["time_prod_purchase"] = checktime(time_value);
            illness["guest_order_list"] = checkblank(guest_order);
            illness["eaten_by_guest"] = checkblank(guest_eat);
            illness["recipt_name"] = checkblank(place_eat);
            illness["recipt_Y_N"] = checkblank(receipt);
            illness["recipt_no"] = checkzero(receipt_no);
            //illness["recipt_time"] = checktime(receipt_time);
            illness["illness_symptoms"] = checkblank(ill_symptoms);
            //illness["recipt_date"] = mdyToymd(checkdate(date_picker_receipt));
            //illness["illness_date"] = mdyToymd(checkdate(date_picker_illness));
            //illness["illness_time"] = checktime(ill_time_value);
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
            other["date"] = mdyToymd(checkdate(date_picker_inj));
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
        debugger;
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
                sessionStorage.setItem("TempClaimId", claim_id_edit);
                //Update_Diary_Note_Info(claim_id_edit);
                remove_session_variable();
                remove_session_variable_onsave();
                location.href = "claims-list.html";
                //if (callback) {
                //    callback(null, "OK");
                //}
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
                $("#store_phone").html(result['phone']);
                $("#fax").html(result['fax']);
                $("#inc_date").html(UtcToLocal(result['incidentDate'] + " " + getValue(result['incidentTime']), 'MM/DD/YYYY hh:mm A'));
                $("#date_report").html(UtcToLocal(result['reportedDate'] + " " + getValue(result['reportedTime']), 'MM/DD/YYYY hh:mm A'));
                $("#desc").html(result['description']);
                $("#notes").html(result['note']);
                $("#incident_loc").html(result['incidentLocation']);
                $("#police_inv").html(result['policeInvolved']);

                $("#alcohol").html(result['alcohol']);
                if (result['policeInvolved'] == 'Yes') {
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
                        str2 += '<div class="customformInci1"><p><span class="headspan" style="width:14%;">File ' + t + ': </span><span id="filename">' + result['filename'][b]['fileName'] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	<img src="images/down1.png" onClick="download_IncidentFile(' + inc_id + ',\'' + result['filename'][b]['fileName'] + '\')"></img></span> </p> </div> <div class="clear"></div> ';
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

function aboutInfo() {
    var attr = JSON.parse(checkblank(sessionStorage.getItem("attr")));
    var key_val = JSON.parse(checkblank(sessionStorage.getItem("key_val")));
    var str = "";
    for (var key in attr) {
        str += '<div  style="float:left; width:50%"><span id="attribute" style="width: 100% !important;">' + attr[key] + '</span></div><div style="float:right; width:48%"><span id="key_val"  style="width: 100% !important;">:' + key_val[key] + '</span></div>';
    }

    $("#about_info").html(str);
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
                html += '<div class="col-md-4"><b>ID</b>: ' + check_blank(item.id) + '</div>';
                html += '<div class="col-md-4"><b>Created By</b>: ' + check_blank(item.createdBy) + '</div>';
                html += '<div class="col-md-4"><b>Created On</b>: ' + UtcToLocal(check_blank(item.created), 'MM/DD/YYYY hh:mm A') + '</div>';
                html += '</div>';

                var to_emails = (typeof item.emails != 'undefined' && item.emails.length > 0) ? GetFollowUPEmails(item.emails) : '-';

                html += '<div class="row">';
                html += '<div class="col-md-4"><b>Confidential</b>: ' + YesOrNo(check_blank(item.confidential)) + '</div>';
                html += '<div class="col-md-4"><b>To</b>: ' + (to_emails != '' ? to_emails : '-') + '</div>';
                html += '<div class="col-md-4"><b>Follow Up</b>: ' + YesOrNo(check_blank(item.followUp)) + '</div>';
                html += '</div>';

                html += '<div class="row">';
                html += '<div class="col-md-4"><b>Category</b>: ' + Get_Category_Text(check_blank(item.category)) + '</div>';
                html += '<div class="col-md-4"><b>Updated By</b>: ' + check_blank(item.updatedBy) + '</div>';
                html += '<div class="col-md-4"><b>Updated Time</b>: ' + UtcToLocal(check_blank(item.updated), 'MM/DD/YYYY hh:mm A') + '</div>';
                html += '</div>';

                if (item.followUp) {
                    html += '<div class="row">';
                    html += '<div class="col-md-4"><b>Follow Up Date</b>: ' + UtcToLocal(check_blank(item.followUpTime), 'MM/DD/YYYY hh:mm A') + '</div>';
                    html += '<div class="col-md-4"><b>Follow Up Email</b>: ' + check_blank(GetFollowUPEmails(item.followUpEmails)) + '</div>';
                    html += '<div class="col-md-4"></div>';
                    html += '</div>';

                    html += '<div class="row">';
                    html += '<div class="col-md-12"><b>Follow Up Message</b>: ' + check_blank(item.follupMessage) + '</div>';
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
                        html += '<div class="col-md-4">' + UtcToLocal(item.history[j].date, 'MM/DD/YYYY hh:mm A') + '</div>';
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
                    obj.created = UtcToLocal(CheckForUndefined(item.created), 'MM/DD/YYYY hh:mm A');
                    obj.createdBy = CheckForUndefined(item.createdBy);
                    obj.followUp = YesOrNo(CheckForUndefined(item.followUp));
                    obj.followUpEmails = CheckForUndefined(item.followUpEmails);                    
                    obj.followUpTime = UtcToLocal(CheckForUndefined(item.followUpTime), 'MM/DD/YYYY hh:mm A');
                    obj.follupMessage = CheckForUndefined(item.follupMessage);
                    obj.notes = CheckForUndefined(item.notes);
                    obj.status = CheckForUndefined(item.status);
                    obj.updated = UtcToLocal(CheckForUndefined(item.updated), 'MM/DD/YYYY hh:mm A');
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
                        html += '<div class="col-md-4"><b>Created On</b>: ' + UtcToLocal(check_blank(item.created), 'MM/DD/YYYY hh:mm A') + '</div>'
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
                        html += '<div class="col-md-4"><b>Updated Time</b>: ' + UtcToLocal(check_blank(item.updated), 'MM/DD/YYYY hh:mm A') + '</div>'
                        html += '</div>';

                        if (item.followUp) {
                            html += '<div class="row">';
                            html += '<div class="col-md-4"><b>Follow Up Date</b>: ' + UtcToLocal(check_blank(item.followUpTime), 'MM/DD/YYYY hh:mm A') + '</div>'
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
                                html += '<div class="col-md-4">' + UtcToLocal(item.history[j].date, 'MM/DD/YYYY hh:mm A') + '</div>';
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






//Test


function btn_Create_OnClick(claim_id) {

    if (claim_id != -1) {
        var btnObj = $('#btn_Create_wc');
        if (btnObj.length > 0) {
            sessionStorage.setItem('incLocId', $('#img1_' + claim_id)[0].getAttribute('data-incident-locid'));
            sessionStorage.setItem('claimEditWC', claim_id);
            window.location.href = 'wc.html';
        }
        else {
            var claimType = $('#img1_' + claim_id)[0].getAttribute('data-claim-type');
            if (claimType == 'WC') {
                sessionStorage.setItem('incLocId', $('#img1_' + claim_id)[0].getAttribute('data-incident-locid'));
                sessionStorage.setItem('claimEditWC', claim_id);
                window.location.href = 'wc.html';
            }
            else {
                sessionStorage.setItem('claimEdit', claim_id);
                window.location.href = 'edit-claim.html';
            }
        }
        sessionStorage.setItem('SsnisCreateDiary', true);
    }
    else {
        btn_AddNote_OnClick(claim_id);
    }
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
    var claim_id = sessionStorage.getItem("TempClaimId");    
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
    sessionStorage.removeItem('TempClaimId');
    //location.href = 'claims-list.html';   
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
                    html += '<div class="col-md-4"><b>Created On</b>: ' + UtcToLocal(check_blank(item.created), 'MM/DD/YYYY hh:mm A') + '</div>'
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
                    html += '<div class="col-md-4"><b>Updated Time</b>: ' + UtcToLocal(check_blank(item.updated), 'MM/DD/YYYY hh:mm A') + '</div>'
                    html += '</div>';

                    if (item.followUp) {
                        html += '<div class="row">';
                        html += '<div class="col-md-4"><b>Follow Up Date</b>: ' + UtcToLocal(check_blank(item.followUpTime), 'MM/DD/YYYY hh:mm A') + '</div>'
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
                            html += '<div class="col-md-4">' + UtcToLocal(item.history[j].date, 'MM/DD/YYYY hh:mm A') + '</div>';
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
