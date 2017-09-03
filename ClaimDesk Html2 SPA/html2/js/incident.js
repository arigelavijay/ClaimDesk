// login session variables
var userId = sessionStorage.getItem("userid");
var token = sessionStorage.getItem("token");
var locationId = sessionStorage.getItem("locationId");
var firstName = sessionStorage.getItem("firstName");
var lastName = sessionStorage.getItem("lastName");
var filename = sessionStorage.getItem("fname");
var incident_id = sessionStorage.getItem("incident_id");
var sellocationid = '';
var selmanagerid = '';

var strstates = '<option value></option><option value="AL">Alabama</option> <option value="AK">Alaska</option> <option value="AZ">Arizona</option> <option value="AR">Arkansas</option> <option value="CA">California</option> <option value="CO">Colorado</option> <option value="CT">Connecticut</option> <option value="DE">Delaware</option> <option value="DC">District of Columbia</option> <option value="FL">Florida</option> <option value="GA">Georgia</option> <option value="HI">Hawaii</option> <option value="ID">Idaho</option> <option value="IL">Illinois</option> <option value="IN">Indiana</option> <option value="IA">Iowa</option> <option value="KS">Kansas</option> <option value="KY">Kentucky</option> <option value="LA">Louisiana</option> <option value="ME">Maine</option> <option value="MD">Maryland</option> <option value="MA">Massachusetts</option> <option value="MI">Michigan</option> <option value="MN">Minnesota</option> <option value="MS">Mississippi</option> <option value="MO">Missouri</option> <option value="MT">Montana</option> <option value="NE">Nebraska</option> <option value="NV">Nevada</option> <option value="NH">New Hampshire</option> <option value="NJ">New Jersey</option> <option value="NM">New Mexico</option> <option value="NY">New York</option> <option value="NC">North Carolina</option> <option value="ND">North Dakota</option> <option value="OH">Ohio</option> <option value="OK">Oklahoma</option> <option value="OR">Oregon</option> <option value="PA">Pennsylvania</option> <option value="RI">Rhode Island</option> <option value="SC">South Carolina</option> <option value="SD">South Dakota</option> <option value="TN">Tennessee</option> <option value="TX">Texas</option> <option value="UT">Utah</option> <option value="VT">Vermont</option> <option value="VA">Virginia</option> <option value="WA">Washington</option> <option value="WV">West Virginia</option> <option value="WI">Wisconsin</option> <option value="WY">Wyoming</option>';


var gcnt = '';
function authentication() {
    if (userId == '' || userId == null) {
        apprise("Please Login Before Proceed.")
        window.location = "index.html";
    }
}
$('#fname').html(filename);

// function to load datepicker to all incident
function load_incident_data() {
    $(".date-picker").datepicker({ format: 'mm/dd/yyyy', endDate: '+0d' });
    $(".date-picker").on("change", function () {
        var id = $(this).attr("id");
        var val = $("label[for='" + id + "']").text();
        $("#msg").text(val + " changed");
    });

    var inc_store_no = localStorage.getItem("inc_store_no");
    setlist_locname('#store_no', inc_store_no);

    var isFromStepTwo = sessionStorage.getItem('SsnisFromStepTwo') == 'true' ? true : false;
    if (!isFromStepTwo) {
        getlocadd();
        sessionStorage.removeItem('SsnisFromStepTwo')
    }
}





function load_data_two() {
    $(".date-picker").datepicker({ format: 'mm/dd/yyyy', endDate: '+0d' });
    $(".date-picker").on("change", function () {
        var id = $(this).attr("id");
        var val = $("label[for='" + id + "']").text();
        $("#msg").text(val + " changed");
    });
    $("#police_inv").val("No");
    $("#alcohol").val("No");
}

function getIncidentLocation(inc_location, selectedVal, isSelectTag) {
    $.ajax({
        type: 'GET',
        contentType: 'application/json;charset=utf-8',
        accept: 'application/json',
        dataType: 'json',
        cache: false,
        url: hostname + 'ClaimDeskWeb/services/v1/code/CLAIM_LOCATION/' + inc_location,
        headers: {
            'token': token,
            'userid': userId,
            'locationId': locationId
        },
        success: function (result) {
            if (isSelectTag) {
                $("#incident_loc").empty();
                if (result != null) {
                    $("#incident_loc").append('<option value=""></option>');
                    $.each(result, function (i, item) {
                        $("#incident_loc").append('<option value="' + item.code + '" ' + (item.code == selectedVal ? 'selected="selected"' : '') + '>' + item.description + '</option>');
                    });
                }
            }
            else {
                var exactLocation = '';
                for (var i = 0; i < result.length; i++) {
                    if (result[i].code == selectedVal) {
                        exactLocation = result[i].description;
                        break;
                    }
                }
                $("#incident_loc").html(checkblank(exactLocation));
            }
        }
    });
}

function getlocadd() {
    getLocAdd(locationId);
}

// add layout for mulitple witness
function clone_witness_div(noofwit) {
    var holder, li, clone, counter, existed;
    holder = $("#container");
    li = $('.new_claimForm:first');


    existed = holder.find('.new_claimForm').length;


    if (existed) {
        if (existed > noofwit) {
            apprise("You already have "
                    + existed
                    + " witness,If you want to remove existed witness click on 'X' button with witness");
            //  alert("You already have " + existed  + " witness,If you want to remove existed witness click on 'X' button with witness");
            $("#no_of_witness").val(existed);
        }
        else {
            existed = existed + 1;
            // counter;
            for (counter = existed; counter <= noofwit; ++counter) {
                gcnt++;
                clone = li.clone();
                var newid = "claimForm" + counter;
                clone.attr("id", newid);
                clone.attr("style", "display:block");
                clone.appendTo(holder);
                var nr = "#" + newid + " .form1";
                var extesion = "<img src='images/del.png'  onclick='removediv(\"#"
                        + newid
                        + "\")' title='Click here to remove this witness'/>";
                $(nr).html(extesion);
                var nr1 = "#" + newid + " input[type=text]";
                var allobj = $(nr1);
                for (var t = 0; t < allobj.length; t++) {
                    var str = $(allobj[t]).prop("name") + gcnt;
                    var str1 = $(allobj[t]).prop("tabindex") + 1000 * gcnt + gcnt;
                    $(allobj[t]).prop('name', str);
                    $(allobj[t]).prop('tabindex', str1);
                    if ($(allobj[t]).prop("class") != 'planeTextFild wit_country') $(allobj[t]).val('');
                }
                var nr1 = "#" + newid + " select";
                var allobj = $(nr1);
                for (var t = 0; t < allobj.length; t++) {
                    var str = $(allobj[t]).prop("name") + gcnt;
                    var str1 = $(allobj[t]).prop("tabindex") + 1000 * gcnt + gcnt;
                    $(allobj[t]).prop('name', str);
                    $(allobj[t]).prop('tabindex', str1);
                    $(allobj[t]).val('');
                }
            }
        }
    }
    else {
        t = 1;
        var ext = t;
        var str = '';

        str += '<div id="claimForm" class="new_claimForm"> <div class="form1"><img src="images/del.png"  onclick="removediv(\'#claimForm\')" title="Click here to remove this witness"/></div>';

        str += '<div class="form2"><label class="myLable">Witness First Name</label><input name="wit_name' + t + '" type="text" class="planeTextFild wit_name" placeholder="" tabindex="' + ext + 2 + '" required="" value=""><label class="myLable">Address 2</label><input name="wit_address_two' + t + '" type="text" class="planeTextFild wit_address1" placeholder="" tabindex="' + ext + 5 + '"  value=""/><label class="myLable">Zip Code</label><input name="wit_zip' + t + '" type="text" class="planeTextFild wit_zip" placeholder=""  tabindex="' + ext + 8 + '" value=""><label class="myLable">Work/Other Phone Number</label><input name="wit_work_phone' + t + '" type="text" class="planeTextFild wit_work_phone" placeholder="" onKeyUp="FormatPhone(event,this)" tabindex="' + ext + 11 + '" value=""></div><div class="form2"><label class="myLable">Witness Last Name</label><input name="wit_lastname' + t + '" tabindex="' + ext + 3 + '" type="text" class="planeTextFild wit_lastname" placeholder=""  value=""><label class="myLable">City</label><input name="wit_city' + t + '" tabindex="' + ext + 6 + '" type="text" class="planeTextFild wit_city" placeholder=""  value=""><label class="myLable">Country</label><input name="wit_country' + t + '" type="text" class="planeTextFild wit_country" placeholder=""  tabindex="' + ext + 9 + '" value="United States"></div><div class="form2"><label class="myLable">Address1</label><input name="wit_address' + t + '" type="text" class="planeTextFild wit_address" placeholder=""  tabindex="' + ext + 4 + '"  value=""/><label class="myLable">State</label><select name="wit_state' + t + '" class="form-control myselectBig wit_state"  tabindex="' + ext + 7 + '">' + strstates + '</select><label class="myLable">Home/Cell Phone Number</label><input name="wit_home_phone' + t + '" type="text" class="planeTextFild wit_home_phone" placeholder="" onKeyUp="FormatPhone(event,this)" tabindex="' + ext + 10 + '" value=""></div><div class="clear"></div></div>';
        $("#container").html(str);

        clone_witness_div(noofwit)
    }

    $(".wit_zip").mask("99999?-9999", { placeholder: "_" });
    $(".wit_work_phone").mask("(999)-999-9999", { placeholder: "_" });
    $(".wit_home_phone").mask("(999)-999-9999", { placeholder: "_" });
}

// remove div
function removediv(id) {

    var holder, li, clone, counter, existed;
    holder = $("#container");
    li = $('#claimForm');
    existed = holder.find('.new_claimForm').length;
    $(id).remove();
    existed = holder.find('.new_claimForm').length;
    $("#no_of_witness").val(existed);
    store_session3();
}

function getValue(value) {
    if (value) { return value; }
    return " ";
}

var isDefault = true;
function load_list_data() {
    var oTable = $('#incidentsTbl').dataTable({
        "bStateSave": true,
        "sPaginationType": "full_numbers",
        "bServerSide": true,
        "bProcessing": true,
        "bSortClasses": false,
        "bDeferRender": true,
        "sAjaxSource": hostname + "ClaimDeskWeb/services/v1/incident/incidentList",
        "bFilter": false,
        "aoColumns": [{ "sWidth": "5%" }, { "sWidth": "15%" }, { "sWidth": "25%" }, { "sWidth": "15%" }, { "sWidth": "20%" }, { "bSortable": false }],
        "fnSort": [[0, 'desc']],
        "fnServerData": function (sSource, aoData, fnCallback, oSettings) {
            if (isDefault) {
                // Called twice. Avoid first call - This is just a work around
                isDefault = false;
                return;
            }

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
                    sExt += sAnd + "sort_col=" + aoData[key]['value'];
                    r++;

                }
                if (aoData[key]['name'].trim() == "sSortDir_0") {
                    sExt += sAnd + "sort=" + aoData[key]['value'];
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
                    var tempdset = {};
                    var dataSet = [];
                    for (var key in result["incidents"]) {


                        //alert ("pass102");	
                        var objinner = [];

                        objinner.push(result["incidents"][key]['incidentId']);
                        objinner.push(getValue(result["incidents"][key]['date']) + " " + getValue(result["incidents"][key]['time']));

                        //objinner.push(getValue(result["incidents"][key]['l_incident_time']));
                        var add = "<b>" + result["incidents"][key]['branchId'] + "</b>, " + result["incidents"][key]['address'] + ", " + result["incidents"][key]['city'];

                        objinner.push(add);
                        objinner.push(getValue(result["incidents"][key]['createdBy']));
                        objinner.push(result["incidents"][key]['title']);

                        if (result["incidents"][key]['status'] == "ACTIVE") {
                            var strlink = "<ul class='manageIcon1'><li data-toggle='modal' data-target='.incident-modal'><img id='img_" + result["incidents"][key]['incidentId'] + "' data-incident-locid='" + result["incidents"][key]['locationId'] + "' src='images/min1.png' width='16' height='19' alt='img' onclick='setIncidentlocId(" + result["incidents"][key]['incidentId'] + ",\"show\")'></li><li><a href='#'><img src='images/min2.png' width='16' height='19' alt='img' onclick=\"setIncidentlocId('" + result["incidents"][key]['incidentId'] + "','edit')\"></a></li><li><a href='#'><img src='images/min5.png' width='16' height='19' alt='img' onclick=\"setIncidentlocId('" + result["incidents"][key]['incidentId'] + "','delete')\"></a></li></ul>";
                        }
                        else {
                            var strlink = "<ul class='manageIcon1'><li data-toggle='modal' data-target='.incident-modal'><img src='images/min1.png' width='16' height='19' alt='img' onclick='setIncidentlocId(" + result["incidents"][key]['incidentId'] + ",\"show\")'></li><li><a href='#'><img src='images/min2.png' width='16' height='19' alt='img' onclick='msg();' ></a></li><li><a href='#'><img src='images/min5.png' width='16' height='19' alt='img' onclick=\"setIncidentlocId('" + result["incidents"][key]['incidentId'] + "','delete')\"></a></li></ul>";
                        }
                        objinner.push(strlink);
                        dataSet.push(objinner);
                    }

                    tempdset["sEcho"] = sEcho;
                    tempdset["iTotalRecords"] = result['totalRecord'];
                    tempdset["iTotalDisplayRecords"] = result['totalRecord'];
                    tempdset["aaData"] = dataSet
                    //	alert(JSON.stringify(dataSet));	
                    fnCallback(tempdset);
                }
            });
        }
    });
    //$('#example1').dataTable().fnDraw();
    //	  oTable.fnSetColumnVis( 2, false );
    //	  oTable.fnSetColumnVis( 4, false );
    //	  oTable.fnSetColumnVis( 5, false );
    //	  oTable.fnSetColumnVis( 6, false );
    //	  oTable.fnSetColumnVis( 7, false );
    //	  oTable.fnSetColumnVis( 8, false );
    //	 // oTable.fnSetColumnVis( 9, false );		
    oTable.fnSort([[0, 'desc']]);
}




// function to load incident step one page with store info etc.
function incident_step_one(flag) {

    if ($("#frm_1").valid()) {
        var store_no = document.getElementById("store_no").value;
        var address1 = document.getElementById("address1").value;
        var state = document.getElementById("state").value;
        var store_phone = document.getElementById("store_phone").value;
        var gen_man_name = document.getElementById("gen_man_name").value;
        var address2 = document.getElementById("address2").value;
        var city = document.getElementById("city").value;
        var fax = document.getElementById("fax").value;
        var report_man_name = document.getElementById("report_man_name").value;
        var county = document.getElementById("county").value;
        var zip = document.getElementById("zip").value;


        var firstName = sessionStorage.getItem("firstName");
        var lastName = sessionStorage.getItem("lastName");
        var userName = firstName + " " + lastName;
        var created_by = userName;
        var branch_id = $("#store_no option:selected").text();
        var locationid = document.getElementById("store_no").value;

        sessionStorage.setItem("inc_store_no", store_no);
        sessionStorage.setItem("inc_address1", address1);
        sessionStorage.setItem("inc_state", state);
        sessionStorage.setItem("inc_store_phone", store_phone);
        sessionStorage.setItem("inc_gen_man_name", gen_man_name);
        sessionStorage.setItem("inc_address2", address2);
        sessionStorage.setItem("inc_city", city);
        sessionStorage.setItem("inc_fax", fax);
        sessionStorage.setItem("inc_report_man_name", report_man_name);
        sessionStorage.setItem("inc_county", county);
        sessionStorage.setItem("inc_zip", zip);
        sessionStorage.setItem("created_by", created_by);
        sessionStorage.setItem("branch_id", branch_id);
        sessionStorage.setItem("location_id", locationid);
        if (flag) {
            removeAddGreenClass('1', '2');
            $('.divider a[data-target="#2"]').tab('show');
            store_session1();
        }
    }
}
// function to load incident step two page with incident info etc.
function incident_step_two(flag) {

    if ($("#frm_2").valid()) {
        var inc_date = document.getElementById("inc_date").value;
        var date_report = document.getElementById("date_reported").value;
        var inc_time = document.getElementById("inc_time").value;
        var time_reported = document.getElementById("time_reported").value;
        var desc = document.getElementById("inc_descunusual_desc").value;
        var incident_loc = document.getElementById("incident_loc").value;
        var police_inv = document.getElementById("police_inv").value;
        var police_agency = document.getElementById("police_agency").value;
        var alcohol = document.getElementById("alcohol").value;
        var policeReportId = document.getElementById("police_case_id").value;

        sessionStorage.setItem("inc_date", inc_date);
        sessionStorage.setItem("inc_date_report", date_report);
        sessionStorage.setItem("inc_time", inc_time);
        sessionStorage.setItem("inc_time_reported", time_reported);
        sessionStorage.setItem("inc_desc", desc);
        sessionStorage.setItem("inc_incident_loc", incident_loc);
        sessionStorage.setItem("inc_police_inv", police_inv);
        sessionStorage.setItem("inc_police_agency", police_agency);
        sessionStorage.setItem("inc_alcohol", alcohol);
        sessionStorage.setItem("inc_policereportId", policeReportId);
        if (flag) {
            removeAddGreenClass('2', '3');
            $('.divider a[data-target="#3"]').tab('show');
            store_session2();
        }
    }


}
// function to load incident step three page with witness info etc.
function incident_step_three(flag) {

    if ($("#frm_3").valid()) {
        var holder, li, clone, counter, divcnt;

        holder = $("#container");
        divs = holder.find('.new_claimForm');
        divcnt = divs.length;
        var witness = [];
        var filename = [];
        var c = [];
        for (var y = 0; y < divcnt; y++) {
            var divid = $(divs[y]).prop("id");
            var wit_first_name = "#" + divid + " .wit_name";
            var wit_last_name = "#" + divid + " .wit_lastname";
            var wit_address1 = "#" + divid + " .wit_address";
            var wit_address2 = "#" + divid + " .wit_address1";
            var wit_city = "#" + divid + " .wit_city";
            var wit_state = "#" + divid + " .wit_state";
            var wit_zip_code = "#" + divid + " .wit_zip";
            var wit_home_phone = "#" + divid + " .wit_home_phone";
            var wit_work_phone = "#" + divid + " .wit_work_phone";
            var wit_other_phone = "#" + divid + " .wit_other_phone";
            var innerwitness = {};
            innerwitness["firstName"] = $(wit_first_name).val();
            innerwitness["lastName"] = $(wit_last_name).val();
            innerwitness["address"] = $(wit_address1).val();
            innerwitness["address1"] = $(wit_address2).val();
            innerwitness["city"] = $(wit_city).val();
            innerwitness["states"] = $(wit_state).val();
            innerwitness["zipcode"] = $(wit_zip_code).val();
            innerwitness["homePhone"] = $(wit_home_phone).val();
            innerwitness["workPhone"] = $(wit_work_phone).val();
            innerwitness["otherPhone"] = $(wit_other_phone).val();
            witness.push(innerwitness);
        }
        //sessionStorage.setItem("witness",witness);	
        sessionStorage.setItem("witness", JSON.stringify(witness));
        if (flag) {
            removeAddGreenClass('3', '4');
            $('.divider a[data-target="#4"]').tab('show');
            store_session3();
        }
    }
}


// function to load incident step four page with File upload functioanality.
function incident_step_four(flag) {

    document.getElementById("next").disabled = true;

    var table = document.getElementById('imglist');
    var rowCount = table.rows.length;
    var filename = [];

    for (var g = 1; g < rowCount; g++) {
        var innerfilename = {};
        innerfilename["fileName"] = table.rows[g].childNodes[1].innerHTML;
        filename.push(innerfilename);
    }
    var inc_store_no = checkblank(sessionStorage.getItem("inc_store_no"));
    var inc_address1 = checkblank(sessionStorage.getItem("inc_address1"));
    var inc_state = checkblank(sessionStorage.getItem("inc_state"));
    var inc_store_phone = checkblank(sessionStorage.getItem("inc_store_phone"));
    var inc_gen_man_name = checkblank(sessionStorage.getItem("inc_gen_man_name"));
    var inc_address2 = checkblank(sessionStorage.getItem("inc_address2"));
    var inc_city = checkblank(sessionStorage.getItem("inc_city"));
    var inc_fax = checkblank(sessionStorage.getItem("inc_fax"));
    var inc_report_man_name = checkblank(sessionStorage.getItem("inc_report_man_name"));
    var inc_county = checkblank(sessionStorage.getItem("inc_county"));
    var inc_zip = checkblank(sessionStorage.getItem("inc_zip"));


    var created_by = checkblank(sessionStorage.getItem("created_by"));
    var branch_id = checkblank(sessionStorage.getItem("branch_id"));
    var location_id = checkblank(sessionStorage.getItem("location_id"));

    var inc_date = checkblank(sessionStorage.getItem("inc_date"));
    var inc_date_report = checkblank(sessionStorage.getItem("inc_date_report"));
    var inc_time = checkblank(sessionStorage.getItem("inc_time"));
    var inc_time_reported = checkblank(sessionStorage.getItem("inc_time_reported"));
    var inc_desc = checkblank(sessionStorage.getItem("inc_desc"));
    var inc_incident_loc = checkblank(sessionStorage.getItem("inc_incident_loc"));
    var inc_police_inv = checkblank(sessionStorage.getItem("inc_police_inv"));
    var inc_police_agency = '-';
    var inc_policereportId = '';
    var inc_unusual_desc = '-';
    if (inc_police_inv == 'Yes')
        inc_police_agency = checkblank(sessionStorage.getItem("inc_police_agency"));
    inc_policereportId = checkblank(sessionStorage.getItem("inc_policereportId"));
    var inc_alcohol = checkblank(sessionStorage.getItem("inc_alcohol"));
    var witness = JSON.parse(checkblank(sessionStorage.getItem("witness")));
    var notes = '';//document.getElementById("inc_notes").value

    var folder = sessionStorage.getItem("folder");
    //alert(witness +""+witness.length);
    var witness_new = [];
    for (var key in witness) {
        var innerwitness = {};
        //			  for ( var keyx in witness[key])
        //			  {
        //witness_inner.push(result[key]['incident_id']);
        innerwitness["firstName"] = checkblank(witness[key]['firstName']);
        innerwitness["lastName"] = checkblank(witness[key]['lastName']);
        innerwitness["address"] = checkblank(witness[key]['address']);
        innerwitness["address1"] = checkblank(witness[key]['address1']);
        innerwitness["city"] = checkblank(witness[key]['city']);
        innerwitness["state"] = checkblank(witness[key]['states']);
        innerwitness["zipcode"] = checkblank(witness[key]['zipcode']);
        innerwitness["homePhone"] = checkblank(witness[key]['homePhone']);
        innerwitness["workPhone"] = checkblank(witness[key]['workPhone']);
        innerwitness["otherPhone"] = checkblank(witness[key]['otherPhone']);
        witness_new.push(innerwitness);
        //		  }
        //			  }
        //			  witness_new.push(innerwitness);
    }
    var UtcincDtTime = localToUtc(inc_date + " " + (inc_time != 'NA' ? inc_time : ''));
    var UtcreportedDtTime = localToUtc(inc_date_report + " " + (inc_time_reported != 'NA' ? inc_time_reported : ''));
    
    var jsonData = {
        "manager": inc_gen_man_name,
        "reportingManager": inc_report_man_name,
        "address": inc_address1,
        "address1": inc_address2,
        "city": inc_city,
        "state": inc_state,
        "zipcode": inc_zip,
        "phone": inc_store_phone,
        "description": inc_desc,
        "country": inc_county,
        "incidentDate": getDate(UtcincDtTime),
        "incidentTime": getTime(UtcincDtTime),
        "reportedDate": getDate(UtcreportedDtTime),
        "reportedTime": getTime(UtcreportedDtTime),
        "fax": inc_fax,
        "policeInvolved": inc_police_inv,
        "policeAgency": inc_police_agency,
        "incidentLocation": inc_incident_loc,
        "alcohol": inc_alcohol,
        "witness": witness_new,
        "filename": filename,
        "locationId": location_id,
        "createdBy": created_by,
        "branchId": branch_id,
        "status": "ACTIVE",
        "userId": userId,
        "policeReportId": inc_policereportId,
        "note": notes,
        "folder": folder
    }    
    
    if (flag) {
        $.ajax({
            type: "POST",
            contentType: "application/json;charset=utf-8",
            accept: "application/json",
            //	dataType: "json",
            url: hostname + "ClaimDeskWeb/services/v1/incident",
            headers: {
                "token": token,
                "userid": userId,
                "locationId": locationId
            },
            data: JSON.stringify(jsonData),
            success: function (result) {
                
                $('#hdnIncidentId').val(result);
                $('#hdn_incidentId').val(result);
                removeSessionvar_onsave();
                removeSessionvar();
                load_data_last(result);
                $('#1, #2, #3, #4').empty();
                $('#li-5').css('display', 'block');
                $('.divider a[data-target="#5"]').tab('show');
                $('.breadcrumbMy li').addClass('newActive');
                $('.breadcrumbMy li a').addClass('activeMy').removeAttr('data-target data-toggle onclick');
            }
        });
    }

}
// file uploads
function upload() {

    if ($('#upfile').val() == '' || $('#upfile').val().indexOf("undefined") > 0) {
        $("#file_error").html("Please Select File to Upload .");
        return false;
    }
    else {
        var innerfname = "inc_" + Math.floor(Date.now() / 1000) + "_" + document.getElementById("upfile").files[0].name;
        return (innerfname);
    }
}

// add images lauout
function addRow_imagelist(filename) {

    var table = document.getElementById('imglist');
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
    row.classname = "greenBox";


    var cell0 = row.insertCell(0);
    cell0.align = "center";
    cell0.className = "whitebg";
    var element0 = document.createElement("img");
    element0.name = filename;
    element0.src = "images/del.png";
    element0.addEventListener("click", function () { delimage(element0); });
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
    element2.addEventListener("click", function () { download_IncidentFile(filename); });
    cell2.appendChild(element2);
    if (table.rows.length > 1) table.rows[0].style.display = 'none';

}

// function to load incident step four page with File upload functioanality.
function delimage(obj) {
    var table = document.getElementById('imglist');
    var ans = confirm("This will delete image " + obj.name + " permamnantly, Are you sure?");
    if (ans) {
        //	  deleteFile(obj.name);
        var i = obj.parentNode.parentNode.rowIndex;
        document.getElementById('imglist').deleteRow(i);
    }
    if (table.rows.length == 1) { table.rows[0].style.display = 'table-row' };

}



//Check reported date must be greater than incident date
function chkdate() {

    var t = dateDiff(document.getElementById("inc_date").value, document.getElementById("date_reported").value);


    if (document.getElementById("inc_date").value == '' || document.getElementById("inc_date").value == null) {
        $("#inc_date_error").html("First Select Incident Date.");
    }
    else {
        $("#inc_date_error").html("");
        if ((new Date(document.getElementById("inc_date").value).getTime()) <= (new Date(document.getElementById("date_reported").value).getTime())) {
            $("#report_date_error").html("");
        }
        else {
            document.getElementById("date_reported").value = "";
            $("#report_date_error").html("Invalid Date.");
        }
    }
}

function validateTime() {
    var a = document.getElementById("inc_time").value;

    if (/^(([0-1][0-9])|(2[0-3])):[0-5][0-9]$/i.test(a)) {
        $("#inc_time_error").html("");
    } else {
        $("#inc_time_error").html("Enter correct time in HH:MM");


    }
}

function validateTime1() {
    var a = document.getElementById("time_reported").value;
    if (/^(([0-1][0-9])|(2[0-3])):[0-5][0-9]$/i.test(a)) {
        $("#time_reported_error").html("");
    } else {
        $("#time_reported_error").html("Enter correct time in HH:MM");
    }
}



// call functio from incidents steps page to edit and view incident
function callfunc(flag) {
    setIncidentlocId($('#hdnIncidentId').val(), flag);
}

function setclaimlocId(id) {
    sessionStorage.setItem("claimEdit", id);
    location.href = "edit-claim.html";
}

// functio for edit delete view 
function setIncidentlocId(locId, flag) {
    if ($('#img_' + locId).exists()) {
        $('#hdn_incLocId').val($('#img_' + locId)[0].getAttribute('data-incident-locid'));
    }

    $('#hdn_incidentId').val(locId);
    if (flag == 'show') {

        $.ajax({
            type: "GET",
            contentType: "application/json;charset=utf-8",
            accept: "application/json",
            dataType: "json",
            cache: false,
            url: hostname + "ClaimDeskWeb/services/v1/incident/" + locId,
            headers: {
                "token": token,
                "userid": userId,
                "locationId": locationId
            },
            success: function (result) {

                getIncidentLocation(result.locationId, result.incidentLocation, false);
                $("#inc_id").html(checkblank(locId));
                $("#store_no").html(checkblank(result['branchId']));
                $("#address1").html(checkblank(result['address']));
                $("#state").html(checkblank(result['state']));
                $("#store_phone").html(checkblank(result['phone']));
                $("#gen_man_name").html(checkblank(result['manager']));
                $("#address2").html(checkblank(result['address1']));
                $("#city").html(checkblank(result['city']));
                $("#fax").html(checkblank(result['fax']));
                $("#state").html(checkblank(result['state']));
                $("#report_man_name").html(checkblank(result['reportingManager']));
                $("#country").html(checkblank(result['country']));
                $("#desc").html(checkblank(result['description']));
                $("#zip").html(checkblank(result['zipcode']));
                $("#inc_date").html(UtcToLocal(checkdate(result['incidentDate']) + " " + getValue(result['incidentTime'])));
                $("#date_report").html(UtcToLocal(checkblank(result['reportedDate']) + " " + getValue(result['reportedTime'])));
                $("#desc").html(checkblank(result['description']));

                $("#police_inv").html(checkblank(result['policeInvolved']));

                $("#alcohol").html(checkblank(result['alcohol']));
                $("#notes").html(result['note']);



                if (result['policeInvolved'] == 'Yes') {
                    $("#police_agency").html(checkblank(result['policeAgency']));
                    $("#police_case_id").html(result['policeReportId']);
                }
                else {
                    $("#police_agency").html("-");
                    $("#police_case_id").html("-");
                }
                var str = '<li class="popInn"><h2 class="popSubHead">Witness(es) Details</h2>';

                if (result['witness'] && result['witness'].length > 0) {
                    for (var b = 0; b < result['witness'].length; b++) {
                        var obj = result['witness'][b];

                        str += '<div style="background-color:#ebebeb; margin-bottom:5px; padding:0 3px 10px 6px;"><div class="formInci1"><p><span class="headspan">ID:</span><span id="eid">' + checkblank(result['witness'][b]['id']) + '</span></p><p><span class="headspan">First Name:</span><span id="wfname">' + checkblank(result['witness'][b]['firstName']) + '</span></p><p><span class="headspan">Last Name:</span><span id="wlname">' + checkblank(result['witness'][b]['lastName']) + '</span></p><p><span class="headspan">Address 1: </span><span id="wadd">' + checkblank(result['witness'][b]['address']) + '</span></p><p><span class="headspan">Address 2: </span><span id="wadd2">' + checkblank(result['witness'][b]['address1']) + '</span></p></div><div class="formInci"><p><span class="headspan">Country:</span> <span id="wcountry">United States</span></p><p><span class="headspan">State:</span><span id="wstate">' + checkblank(result['witness'][b]['state']) + '</span></p><p><span class="headspan">City:</span> <span id="wcity">' + checkblank(result['witness'][b]['city']) + '</span></p><p><span class="headspan">Zip Code: </span><span id="wzip">' + checkblank(result['witness'][b]['zipcode']) + '</span></p></div><div class="formInci"><p><span class="headspan">Home Phone: </span><span id="whomeph">' + checkblank(result['witness'][b]['homePhone']) + '</span></p><p><span class="headspan">Work Phone: </span><span id="wworkph">' + checkblank(result['witness'][b]['workPhone']) + '</span></p></div><div class="clear"></div></div>';
                    }
                    str += '</li>';
                }
                $("#wit_container").html(str);

                var str1 = '<li class="popInn"><h2 class="popSubHead">Attachments<input  id="btn_add_inc_attatchment" class="popBtt buttonNex" type="button" onclick="btn_add_inc_attatchment(' + locId + ')" name="" value="Add Attatchment" /></h2>';
                //alert(result['filename'].length);
                if (typeof result['filename'] != 'undefined' && result['filename'] && result['filename'].length > 0) {
                    for (var b = 0, t = 1; b < result['filename'].length; b++, t++) {

                        var obj = result['filename'][b];
                        if (obj) {
                            //downloadImg(result['filename'][b]['fileName']);
                            str1 += '<div class="customformInci1"><p><span class="headspan" style="width:14%;">File ' + t + ': </span><span id="filename">' + result['filename'][b]['fileName'] + '	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	<img src="images/down1.png" onClick="download_IncidentFile(' + '\'' + result['filename'][b]['fileName'] + '\')"></img></span></p> </div> <div class="clear"></div> ';

                        }
                        else {
                            str1 += 'No file ulpoded.'
                        }
                    }
                    str1 += '<img id="pr_img" src="images/loading9.gif" style="margin-left:35%;display:none; top:30%; position:absolute;z-index:3000;"/></li><div class="clear"></div>';

                }
                $("#file_container").html(str1);

                $.ajax({
                    type: "GET",
                    contentType: "application/json;charset=utf-8",
                    accept: "application/json",
                    dataType: "json",
                    cache: false,
                    url: hostname + "ClaimDeskWeb/services/v1/claim/getRelatedClaimList/" + locId,
                    headers: {
                        "token": token,
                        "userid": userId,
                        "locationId": locationId
                    },
                    success: function (result1) {
                        var sttr;
                        if (result['status'] == "APPROVED" || result['status'] == "DECLINED") {
                            sttr = '<li class="popInn"><h2 class="popSubHead">Related Claim List<input  id="close_but" class="popBtt buttonNex" type="button" aria-label="Close" onClick="msg1(' + '\'' + result['status'] + '\'' + ')" name="" value="Create Claim"></h2><br><ul class="subSection"><li style="width:10%;background-color:#ebebeb;"><strong>Sr. No.</strong></li><li style="width:20%;background-color:#ebebeb;"><strong>Claim ID</strong></li><li style="width:20%;background-color:#ebebeb;"><strong>Claim Date</strong></li><li style="width:45%;background-color:#ebebeb;"><strong>Description</strong></li></ul>';
                        }
                        else {
                            sttr = '<li class="popInn"><h2 class="popSubHead">Related Claim List<input  id="close_but" class="popBtt buttonNex" type="button" aria-label="Close" onClick="openModal();" name="" value="Create Claim"></h2><br><ul class="subSection"><li style="width:10%;background-color:#ebebeb;"><strong>Sr. No.</strong></li><li style="width:20%;background-color:#ebebeb;"><strong>Claim ID</strong></li><li style="width:20%;background-color:#ebebeb;"><strong>Claim Date</strong></li><li style="width:45%;background-color:#ebebeb;"><strong>Description</strong></li></ul>';
                        }
                        var i = 1;
                        for (var key in result1) {
                            if (result['status'] == "APPROVED" || result['status'] == "DECLINED") {
                                sttr += '<ul class="subSection"><li style="width:10%;">[' + (i++) + ']</li><li style="width:20%; cursor:pointer;"><span onclick="msg2(' + result1[key]['status'] + ')"><b>' + result1[key]['claimId'] + '</b></span></li><li style="width:20%;">' + result1[key]['created'] +
                                '</li><li style="width:45%;">' + result1[key]['description'] + '</li></ul>';
                            }
                            else {
                                sttr += '<ul class="subSection"><li style="width:10%;">[' + (i++) + ']</li><li style="width:20%; cursor:pointer;"><span onclick="setclaimlocId(' + result1[key]['claimId'] + ')"><b>' + result1[key]['claimId'] + '</b></span></li><li style="width:20%;">' + result1[key]['created'] + '</li><li style="width:45%;">' + result1[key]['description'] + '</li></ul>';
                            }
                        }
                        sttr += '<br><br></li>';
                        if (result1.length > 0)
                            $("#RelatedClaims").html(sttr);
                        else
                            $('#RelatedClaims').html('<li class="popInn"><h2 class="popSubHead">Related Claim List<input  id="close_but" class="popBtt buttonNex" type="button" aria-label="Close" onClick="openModal();" name="" value="Create Claim"></h2></li>');
                    }
                });
            }
        });

    }
    else if (flag == 'edit') {
        var incLocId = $('#hdn_incLocId').val();
        $('#view').jqExLoad('views/edit-incident.html', function () {
            $('#hdn_incidentId').val(locId);
            $('#hdn_incLocId').val(incLocId);
            createIncPageLoad(locId);
            if (incLocId == '181') {
                $('#incident_loc').hide().prev().hide();
            }
        }).hide().fadeIn();
    }
    else if (flag == 'delete') {
        //	  var response = confirm("Do you want to delete this Incident?");
        //  $("#custom_msg").html("Do you want to delete this Incident?");
        //		  sessionStorage.setItem("incEdit", locId); 
        //	document.getElementById("close").style.display='none';

        var string = 'Do you want to delete this Incident?';
        var args = { 'input': false };
        apprise(string, args, function (r) {
            if (r) {

                $.ajax({
                    type: "GET",
                    contentType: "application/json;charset=utf-8",
                    accept: "application/json",
                    dataType: "json",
                    cache: false,
                    url: hostname + "ClaimDeskWeb/services/v1/incident/delete/" + locId,
                    headers: {
                        "token": token,
                        "userid": userId,
                        "locationId": locationId
                    },
                    success: function (result) {

                        //	$('.redtext').text(result['result']);
                        apprise(result['result']);
                        location.reload();
                    },
                    error: function (request, status, error) {
                        // alert("error");

                        var msg = request.responseJSON['errors']['error'][0]['description'];
                        // $('.redtext').text(msg);
                        apprise(msg);
                        //	  alert(msg);
                    }

                });

            }

        });


    }
    else if (flag == 'gotoclaim') {
        var lid = document.getElementById("inc_id").value;
        sessionStorage.setItem("incident_id", lid);
        location.href = "claim.html";
    }
    else if (flag == 'gotowc') {
        var lid = document.getElementById("inc_id").value;
        sessionStorage.setItem("incident_id", lid);
        sessionStorage.setItem("claimtype", "WC");
        sessionStorage.removeItem('claimEditWC');
        location.href = "wc.html";
    }



}


// update incident page loading 	     
function createIncPageLoad(currentemp) {
    if (currentemp) {
        $.ajax({
            type: "GET",
            contentType: "application/json;charset=utf-8",
            accept: "application/json",
            dataType: "json",
            cache: false,
            url: hostname + "ClaimDeskWeb/services/v1/incident/" + currentemp,
            headers: {
                "token": token,
                "userid": userId,
                "locationId": locationId
            },
            success: function (result) {

                getIncidentLocation(result.locationId, result.incidentLocation != 'NA' ? result.incidentLocation : '', true);
                var is_add_inc_attatchment = $('#hdn_is_Add_inc_Attatchment').val() == 'true' ? true : false;
                if (is_add_inc_attatchment) {
                    $('a[href="#4"]').tab('show');
                    removeAddGreenClass('1', '4');
                    $('#hdn_is_Add_inc_Attatchment').val(false);
                }

                var incDtTime = UtcToLocal(result['incidentDate'] + ' ' + result['incidentTime']);
                var repDtTime = UtcToLocal(result['reportedDate'] + ' ' + result['reportedTime']);
                
                $("#inc_id").val(result['id']);
                $("#top_inc_id").html(result['incidentId']);
                $("#address1").val(result['address']);
                $("#state").val(result['state']);
                $("#store_phone").val(result['phone']);
                $("#gen_man_name").val(result['manager']);
                $("#address2").val(result['address1']);
                $("#city").val(result['city']);
                $("#fax").val(result['fax']);
                $("#state").val(result['state']);
                $("#report_man_name").val(result['reportingManager']);
                $("#country").val(result['country']);
                $("#desc").val(result['description']);
                $("#zip").val(result['zipcode']);
                $("#inc_date").val(getDate(incDtTime));
                $("#date_reported").val(getDate(repDtTime));
                $("#inc_time").val(getTime(incDtTime));
                $("#time_reported").val(getTime(repDtTime));
                $("#inc_descunusual_desc").val(result['description']);
                $("#incident_loc").val(result['incidentLocation']);
                $("#police_inv").val(result['policeInvolved']);
                $("#police_agency").val(result['policeAgency']);
                $("#alcohol").val(result['alcohol']);
                //$("#inc_notes").val(result['note']);
                $("#police_case_id").val(result['policeReportId']);
                var str = '';
                if (result['policeInvolved'] == 'Yes') {
                    document.getElementById('agency_name_div').style.display = 'block';
                    document.getElementById('report_no_div').style.display = 'block';
                }
                else {
                    document.getElementById('agency_name_div').style.display = 'none';
                    document.getElementById('report_no_div').style.display = 'none';
                }


                var wtstate = [];
                if (result['witness'] && result['witness'].length > 0) {
                    var witlength = result['witness'].length;
                    for (var t = 1, b = 0; b < result['witness'].length; t++, b++) {
                        var obj = result['witness'][b];
                        var ext = 1000 * t;

                        if (b > 0)
                            str += '<div id="claimForm' + t + '" class="new_claimForm"> <div class="form1"><img src="images/del.png" onclick="removediv(\'#claimForm' + t + '\')" title="Click here to remove this witness"/></div>';
                        else
                            str += '<div id="claimForm" class="new_claimForm"> <div class="form1"><img src="images/del.png"  onclick="removediv(\'#claimForm\')" title="Click here to remove this witness"/></div>';

                        str += '<div class="form2"><label class="myLable">Witness First Name</label><input name="wit_name' + t + '" type="text" class="planeTextFild wit_name" placeholder="" tabindex="' + ext + 2 + '" required="" value="' + obj['firstName'] + '"><label class="myLable">Address 2</label><input name="wit_address_two' + t + '" type="text" class="planeTextFild wit_address1" placeholder="" tabindex="' + ext + 5 + '"  value="' + obj['address1'] + '"/><label class="myLable">Zip Code</label><input name="wit_zip' + t + '" type="text" class="planeTextFild wit_zip" placeholder=""  tabindex="' + ext + 8 + '" value="' + obj['zipcode'] + '"><label class="myLable">Work/Other Phone Number</label><input name="wit_work_phone' + t + '" type="text" class="planeTextFild wit_work_phone" placeholder="" onKeyUp="FormatPhone(event,this)" tabindex="' + ext + 11 + '" value="' + obj['workPhone'] + '"></div><div class="form2"><label class="myLable">Witness Last Name</label><input name="wit_lastname' + t + '" tabindex="' + ext + 3 + '" type="text" class="planeTextFild wit_lastname" placeholder=""  value="' + obj['lastName'] + '"><label class="myLable">City</label><input name="wit_city' + t + '" tabindex="' + ext + 6 + '" type="text" class="planeTextFild wit_city" placeholder=""  value="' + obj['city'] + '"><label class="myLable">Country</label><input name="wit_country' + t + '" type="text" class="planeTextFild wit_country" placeholder=""  tabindex="' + ext + 9 + '" value="United States"></div><div class="form2"><label class="myLable">Address1</label><input name="wit_address' + t + '" type="text" class="planeTextFild wit_address" placeholder=""  tabindex="' + ext + 4 + '"  value="' + obj['address1'] + '"/><label class="myLable">State</label><select name="wit_state' + t + '" class="form-control myselectBig wit_state"  tabindex="' + ext + 7 + '">' + strstates + '</select><label class="myLable">Home/Cell Phone Number</label><input name="wit_home_phone' + t + '" type="text" class="planeTextFild wit_home_phone" placeholder="" onKeyUp="FormatPhone(event,this)" tabindex="' + ext + 10 + '" value="' + obj['homePhone'] + '"></div><div class="clear"></div></div>';
                        wtstate[t] = obj['state'];
                    }
                }

                $("#no_of_witness").val(witlength);
                $("#container").html(str);
                setlist_locname("#store_no", result['locationId']);

                for (var g = 1; g < wtstate.length; g++) {
                    var namec = "wit_state" + g;
                    $("select[name='" + namec + "']").val(wtstate[g]);
                }

                if (result["filename"]) {
                    for (var i = 0; i < result["filename"].length; i++) {
                        addRow_imagelist(result["filename"][i]["fileName"]);
                    }
                }
            }
        });

        $("#no_of_witness").change(function () {
            var numOfClones = $(this).val();
            clone_witness_div(numOfClones);
        });
    }
    else {
        alert("Please select Claim To Edit");
        location.href = "incident-list.html";
    }

}
// function to update incident step three page with witness info etc.

function incident_up() {

    $("#validation_msg").html("");
    var table = document.getElementById('imglist');
    var rowCount = table.rows.length;

    var filename = [];

    for (var g = 1; g < rowCount; g++) {
        var innerfilename = {};
        innerfilename["fileName"] = table.rows[g].childNodes[1].innerHTML;
        filename.push(innerfilename);
    }


    if ($("#data").valid()) {
        var inc_id = checkblank(document.getElementById("inc_id").value);
        var inc_store_no = checkblank(document.getElementById("store_no").value);
        var address1 = document.getElementById("address1").value;
        var state = document.getElementById("state").value;
        var store_phone = document.getElementById("store_phone").value;
        var gen_man_name = document.getElementById("gen_man_name").value;
        var address2 = document.getElementById("address2").value;
        var city = document.getElementById("city").value;
        var fax = document.getElementById("fax").value;
        var report_man_name = document.getElementById("report_man_name").value;
        var county = document.getElementById("county").value;
        var zip = document.getElementById("zip").value;


        var firstName = sessionStorage.getItem("firstName");
        var lastName = sessionStorage.getItem("lastName");
        var userName = firstName + " " + lastName;
        var created_by = userName;
        var branch_id = $("#store_no option:selected").text();

        var e = document.getElementById("store_no");
        var locId = e.options[e.selectedIndex].value;


        var inc_date = checkblank(document.getElementById("inc_date").value);
        var inc_date_report = checkblank(document.getElementById("date_reported").value);
        var inc_time = checkblank(document.getElementById("inc_time").value);
        var inc_time_reported = checkblank(document.getElementById("time_reported").value);
        var inc_desc = checkblank(document.getElementById("desc").value);
        var inc_incident_loc = checkblank(document.getElementById("incident_loc").value);
        var inc_police_inv = checkblank(document.getElementById("police_inv").value);
        var inc_police_agency = '-';
        if (inc_police_inv == 'Yes') {
            var inc_police_agency = checkblank(document.getElementById("police_agency").value);
            var inc_policereportid = checkblank(document.getElementById("police_case_id").value);
        }
        var inc_alcohol = checkblank(document.getElementById("alcohol").value);

        var inc_notes = '';//document.getElementById("inc_notes").value;

        holder = $("#container");
        divs = holder.find('.new_claimForm');
        divcnt = divs.length;
        var witness = [];

        var c = [];
        for (var y = 0; y < divcnt; y++) {
            var divid = $(divs[y]).prop("id");
            var wit_first_name = "#" + divid + " .wit_name";
            var wit_last_name = "#" + divid + " .wit_lastname";
            var wit_address1 = "#" + divid + " .wit_address";
            var wit_address2 = "#" + divid + " .wit_address1";
            var wit_city = "#" + divid + " .wit_city";
            var wit_state = "#" + divid + " .wit_state";
            var wit_zip_code = "#" + divid + " .wit_zip";
            var wit_home_phone = "#" + divid + " .wit_home_phone";
            var wit_work_phone = "#" + divid + " .wit_work_phone";
            var wit_other_phone = "#" + divid + " .wit_other_phone";
            var innerwitness = {};
            innerwitness["firstName"] = checkblank($(wit_first_name).val());
            innerwitness["lastName"] = checkblank($(wit_last_name).val());
            innerwitness["address"] = checkblank($(wit_address1).val());
            innerwitness["address1"] = checkblank($(wit_address2).val());
            innerwitness["city"] = checkblank($(wit_city).val());
            innerwitness["state"] = checkblank($(wit_state).val());
            innerwitness["zipcode"] = checkblank($(wit_zip_code).val());
            innerwitness["homePhone"] = checkblank($(wit_home_phone).val());
            innerwitness["workPhone"] = checkblank($(wit_work_phone).val());
            innerwitness["otherPhone"] = checkblank($(wit_other_phone).val());
            witness.push(innerwitness);
        }
        var jsonData = {
            "incidentId": inc_id,
            "address": address1,
            "address1": address2,
            "state": state,
            "phone": store_phone,
            "manager": gen_man_name,
            "city": city,
            "fax": fax,
            "reportingManager": report_man_name,
            "country": county,
            "zipcode": zip,
            "createdBy": created_by,
            "branchId": branch_id,
            "description": inc_desc,
            "incidentDate": inc_date,
            "incidentTime": inc_time,
            "reportedDate": inc_date_report,
            "reportedTime": inc_time_reported,
            "policeInvolved": inc_police_inv,
            "policeAgency": inc_police_agency,
            "incidentLocation": inc_incident_loc,
            "alcohol": inc_alcohol,
            "witness": witness,
            "filename": filename,
            "locationId": locId,
            "status": "ACTIVE",
            "userId": userId,
            "policeReportId": inc_policereportid,
            "note": inc_notes
        }
        $.ajax({
            type: "POST",
            contentType: "application/json;charset=utf-8",
            accept: "application/json",
            url: hostname + "ClaimDeskWeb/services/v1/incident",
            headers: {
                "token": token,
                "userid": userId,
                "locationId": locationId
            },
            data: JSON.stringify(jsonData),
            success: function (result) {
                //$('#view').jqExLoad('views/incidents-list.html').hide().fadeIn();
                gotolist();
            }
        });
    }
    else {
        $("#validation_msg").html("Invalid data, Please check all tabs.");
    }
}

// display files added on last step 

function load_data_last(incident_id) {
    $("#fname").html("Incident ID : " + incident_id);
    $('<span style="display:none;" id="img_' + incident_id + '" data-incident-locid="' + $('#hdn_incLocId').val() + '"></span>').insertAfter('#fname');
    get_files(incident_id);
}

function get_files(incident_id) {

    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        cache: false,
        url: hostname + "ClaimDeskWeb/services/v1/incident/" + incident_id,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {

            var str = '<ol style="list-style-image: url(images/min4.png) ;">';
            if (result['filename']) {
                for (var i = 0; i < result["filename"].length; i++) {
                    str += "<li >" + result["filename"][i]["fileName"] + "</li>";
                }
            }
            str += '</ol>';
            var fname = $("#fname").html();
            $("#fname").html(fname + "<br>" + str);
        }
    });
}


function download_IncidentFile(filename) {
    
    var currentIncident = $('#hdn_incidentId').val();
    if (!currentIncident) {
        currentIncident = sessionStorage.getItem('incident_id');
    }
    var tempFolder = sessionStorage.getItem("folder");
    if (!tempFolder) {
        tempFolder = 0;
    }
    downloadFile(currentIncident, tempFolder, "incident", filename);
}



function upload_inc_file(tablename) {

    $('#file_error').html('');
    var fn = upload();
    var currentIncident = $('#hdn_incidentId').val();
    var folder = sessionStorage.getItem("folder");
    if (fn) {
        document.getElementById("pr_img").style.display = "block";
        var formData = new FormData($('#data')[0]);
        uploadFile("incident", currentIncident, folder, fn, formData, function (error, data) {
            if (error) {
                //Display Error
                $('#file_error').html('Error uploading files...');
            }
            else {

                sessionStorage.setItem("folder", data["folder"]);
                addRow_imagelist(fn);
                document.getElementById("pr_img").style.display = "none";
                $('#upfile').val('');
            }
        });
    }
    else {
        $('#file_error').html('Please select a file to upload');
    }

}

function getUserName(id) {
    var name = "--";
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        global: false,
        async: false,
        cache: false,
        url: hostname + "ClaimDeskWeb/services/v1/user/" + id,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result1) {
            if (result1 && result1['firstName']) {
                name = result1['firstName'] + " " + result1['lastName'];
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
    //$(".poloRight").html("<img width='50' height='50' alt='img' src='"+logo+"'/>");	
    //	 aboutInfo();
}

function getlocdetails(locid) {
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        cache: false,
        url: hostname + "ClaimDeskWeb/services/v1/location/" + locid,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {
            $("#address1").html(result['address']['addressLine1']);
            $("#city").html(result['address']['city']);
            $("#state").html(result['address']['state']);
            getLocPhone(locid, "LOC");
            $("#county").html(result['address']['country']);
            $("#zip").html(result['address']['postalCode']);
            $("#gen_man_name").html(result['manager']);
            $("#report_man_name").html(result['manager']);
        }
    });
}

function removeSessionvar_onsave() {
    sessionStorage.removeItem("inc_store_no");
    sessionStorage.removeItem("inc_address1");
    sessionStorage.removeItem("inc_state");
    sessionStorage.removeItem("inc_store_phone");
    sessionStorage.removeItem("inc_gen_man_name");
    sessionStorage.removeItem("inc_address2");
    sessionStorage.removeItem("inc_city");
    sessionStorage.removeItem("inc_fax");
    sessionStorage.removeItem("inc_report_man_name");
    sessionStorage.removeItem("inc_county");
    sessionStorage.removeItem("inc_zip");

    sessionStorage.removeItem("inc_date");
    sessionStorage.removeItem("inc_date_report");
    sessionStorage.removeItem("inc_time");
    sessionStorage.removeItem("inc_time_reported");
    sessionStorage.removeItem("inc_desc");
    sessionStorage.removeItem("inc_incident_loc");

    sessionStorage.removeItem("inc_police_inv");
    sessionStorage.removeItem("inc_police_agency");
    sessionStorage.removeItem("inc_alcohol");

    sessionStorage.removeItem("witness");
    sessionStorage.removeItem("no_of_witness");
    sessionStorage.removeItem("folder");

}


function getStoreAdd(locid) {
    var name = "--";
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
        success: function (result1) {
            if (result1 && result1['storeID']) {
                name = "<B>" + result1['storeID'] + "</B>, " + result1['address']['addressLine1'] + ", " + result1['address']['city'];
            }
            //s	alert(name);
        }
    });
    return (name);
}

function gotolist() {
    $('#view').jqExLoad("views/incidents-list.html");
    $('#homeId,#claimId,#dropdown').removeClass('select');
    $('#incidentId').addClass('select');
}

function getLocPhone(id, type) {

    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        global: false,
        async: false,
        cache: false,
        url: hostname + "ClaimDeskWeb/services/v1/code/contact/" + id + "/" + type,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {
            //	for (i = 0; i < result.length; i++) {

            if (result[0] && result[0]['contact_resourse_id'] && result[0]['contact_resourse_id'] == "WORK_PHONE") {
                $("#store_phone").html(result[0]['value']);
            }
            if (result[1] && result[1]['contact_resourse_id'] && result[1]['contact_resourse_id'] == "FAX") {
                $("#fax").html(result[1]['value']);
            }

            //	}
        }
    });


}

function loadsess() {
    //$("input[type='text']").change(function () {
    //    store_session3();
    //});
    //$("select").change(function () {
    //    store_session3();
    //});
    //$("textarea").change(function () {
    //    store_session3();
    //});

    $(".wit_zip").mask("99999?-9999", { placeholder: "_" });
    $(".wit_work_phone").mask("(999)-999-9999", { placeholder: "_" });
    $(".wit_home_phone").mask("(999)-999-9999", { placeholder: "_" });
}

function loads() {
    $(".wit_zip").mask("99999?-9999", { placeholder: "_" });
    $(".wit_work_phone").mask("(999)-999-9999", { placeholder: "_" });
    $(".wit_home_phone").mask("(999)-999-9999", { placeholder: "_" });
}


function chktabcolor() {

    var Adv = $(".editTab").toArray()



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

function fdate(dt) {
    if (dt) {
        return dt.replace(/\-/g, '/');
    }
    return null;
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

function create_claim(status, inc_id) {
    if (status == "APPROVED") {
        apprise("Incident is APPROVED. Can't create Claim.");

    }
    else if (status == "DECLINED") {
        apprise("Incident Is DECLINED. Can't create Claim.");


    }
    else {
        sessionStorage.setItem("incident_id", inc_id);
        location.href = "claim.html";
    }
}

function msg() {
    apprise("Incident is APPROVED. Can't edit Incident.");
    //alert("Incident is APPROVED. Can't edit Incident.");

}

function msg1(m) {
    if (m == "10") apprise("Incident is APPROVED. Can't create new Claim.");
    if (m == "50") apprise("Incident is DECLINED. Can't create new Claim.");
    //alert("Incident is APPROVED. Can't edit Incident.");

}
function msg2(m) {
    if (m == "10") apprise("Incident is APPROVED. Can't edit Claim.");
    if (m == "50") apprise("Incident is DECLINED. Can't edit new Claim.");
    //alert("Incident is APPROVED. Can't edit Incident.");

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

function CreateIncident() {
    if (!window.jQuery) {
        location.href = '../index.html';
    }
    else {
        $(document).ready(function () {

            $(".date-picker").datepicker({
                changeMonth: true,
                changeYear: true,
                yearRange: "-100:+0",
                maxDate: new Date()
            });

            $(".date-picker").keyup(function (e) {
                var keycode = e.keyCode ? e.keyCode : e.which;
                if (keycode != 8 && keycode != 46) {
                    var currentValue = $(e.target).val();
                    var newValue = autocompleteMMDDYYYYDateFormat(currentValue);
                    if (newValue != currentValue) {
                        $(e.target).val(newValue);
                    }
                }
            });

            load_from_session_1();
            load_incident_data();
            load_from_session_2();
            load_from_session_3();
            getLocAdd(this.value);

            $('#police_inv').val('No');
            $('#alcohol').val('No');

            $("#zip").mask("99999?-9999", { placeholder: "_" });
            $("#fax").mask("(999)-999-9999", { placeholder: "_" });
            $("#store_phone").mask("(999)-999-9999", { placeholder: "_" });

            $('#select-claimtype-modal').load('modals/select-claimtype-modal.html', function () {
                $('#btnRedirect').click(function () {
                    var incidentId = $('#hdnIncidentId').val();
                    var incLocId = $('#hdn_incLocId').val();

                    var value = $('input[name=create]:checked').val();
                    if (value == "GL") {
                        $('#view').jqExLoad('views/create-claim.html', function () {
                            loadClaim(incidentId);
                            loadClaim1(incLocId);
                        }).hide().fadeIn();
                    }
                    else {
                        $('#view').jqExLoad('views/wc.html', function () {
                            dashboardloadOnInit(incidentId, incLocId);
                        }).hide().fadeIn();
                    }
                });
            });

            $("#no_of_witness").change(function () {
                var numOfClones = $(this).val();
                clone_witness_div(numOfClones);
            });

            $.mask.definitions['H'] = "[0-1]";
            $.mask.definitions['h'] = "[0-9]";
            $.mask.definitions['M'] = "[0-5]";
            $.mask.definitions['m'] = "[0-9]";
            $.mask.definitions['P'] = "[AaPp]";
            $.mask.definitions['p'] = "[Mm]";

            $(".timepicker").mask("Hh:Mm Pp");

            $(".time-picker").timepicker({
                addSliderAccess: false,
                timeFormat: "hh:mm tt",
                sliderAccessArgs: { touchonly: false }
            });

            $("#date_reported").mask("99/99/9999", { placeholder: "_" });
            $("#inc_date").mask("99/99/9999", { placeholder: "_" });
            $("#inc_time").mask("Hh:Mm Pp");
            $("#time_reported").mask("Hh:Mm Pp");

            $('#incident-modal').load('modals/incident-modal.html');
        });


        $.validator.addMethod("chkdate", function (value, element) {
            var startDate = $('#inc_date').val();
            return Date.parse(startDate) <= Date.parse(value) || value == "";
        }, "Invalid Reported date.");

        getIncidentLocation(locationId, $('#hdn_incLocId').val(), true);

    }

}
function openModal() {
    $('.select-claimtype-modal').modal('show');
}

function btn_inc_Back() {
    var tabId = $('#tabDiv ul li.active')[0].id.split('-')[1];
    var prevTab = tabId - 1;
    $('#a-' + prevTab).tab('show');
    removeAddGreenClass(tabId, tabId - 1);
}

function tab_Inc_Click(obj) {
    var tabId = $('.breadcrumbMy li.active')[0].id.split('-')[1];
    var isDisabledTab = $(obj).parent().hasClass('disabledCss');
    var currentSelId = $(obj).parent().prop('id').split('-')[1];
    var frmId = '';
    if (tabId == '4') {
        frmId = '#data';
    }
    else {
        frmId = '#frm_' + tabId;
    }

    if ($(frmId).valid()) {
        if (frmId == '#frm_1') {
            incident_step_one(false);
            store_session1();
        }
        else if (frmId == '#frm_2') {
            incident_step_two(false);
            store_session2();
        }
        else if (frmId == '#frm_3') {
            incident_step_three(false);
            store_session3();
        }
        else {
            incident_step_four(false);
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

