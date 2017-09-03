function load_from_session_1() {
    
		var inc_store_no = localStorage.getItem("inc_store_no");
		var inc_address1 = localStorage.getItem("inc_address1");
		var inc_state = localStorage.getItem("inc_state");
		var inc_store_phone = localStorage.getItem("inc_store_phone");
		var inc_gen_man_name = localStorage.getItem("inc_gen_man_name");
		var inc_address2 = localStorage.getItem("inc_address2");
		var inc_city = localStorage.getItem("inc_city");
		var inc_fax = localStorage.getItem("inc_fax");
		var inc_report_man_name = localStorage.getItem("inc_report_man_name");
		var inc_county = localStorage.getItem("inc_county");
		var inc_zip = localStorage.getItem("inc_zip");			
		$("#store_no").val('' + inc_store_no + '');
		$("#address1").val(inc_address1);
		$("#state").val(inc_state);
		$("#store_phone").val(inc_store_phone);
		$("#gen_man_name").val(inc_gen_man_name);
		$("#address2").val(inc_address2);
		$("#city").val(inc_city);
		$("#fax").val(inc_fax);
		$("#state").val(inc_state);
		$("#report_man_name").val(inc_report_man_name);
		$("#country").val(inc_county);
		$("#zip").val(inc_zip);
}


function load_from_session_2() {
    var inc_date = localStorage.getItem("inc_date");
	var inc_date_report = localStorage.getItem("inc_date_report");
	var inc_time = localStorage.getItem("inc_time");
	var inc_time_reported = localStorage.getItem("inc_time_reported");
	var inc_desc = localStorage.getItem("inc_desc");
	var inc_incident_loc = localStorage.getItem("inc_incident_loc");
	var inc_police_inv = localStorage.getItem("inc_police_inv");
    var inc_police_agency = '-';
    var inc_unusual_desc = '-';
    if (inc_police_inv == 'Yes')
		inc_police_agency = localStorage.getItem("inc_police_agency");	
	var inc_alcohol = localStorage.getItem("inc_alcohol");
	var inc_policereportId = localStorage.getItem("inc_policereportId");
	
	
    if (inc_police_inv == 'Yes') {
        document.getElementById('agency_name_div').style.display = 'block';
        document.getElementById('report_no_div').style.display = 'block';
	}
	else {
        document.getElementById('agency_name_div').style.display = 'none';
        document.getElementById('report_no_div').style.display = 'none';
	}
	
		
	$("#inc_date").val(inc_date);
	$("#date_reported").val(inc_date_report);
	$("#inc_time").val(inc_time);
	$("#time_reported").val(inc_time_reported);
	$("#inc_descunusual_desc").val(inc_desc);
	$("#incident_loc").val(inc_incident_loc);
	$("#police_inv").val(inc_police_inv);
	$("#police_agency").val(inc_police_agency);
	$("#alcohol").val(inc_alcohol);
	$("#police_case_id").val(inc_policereportId);
}


function load_from_session_3()  // witness page
{	
    
	    var witness = JSON.parse(localStorage.getItem("witness"));
    var str = '';
    var t = 1, b = 0;
    var wtstate = [];
	  
    if (localStorage.getItem("no_of_witness") > 0) {
        for (var key in witness) {
			     var obj = witness[key];	  
				 var ext = 1000 * t;
					  
            if (b > 0)
                str += '<div id="claimForm' + t + '" class="claimForm"> <div class="form1"><img src="images/del.png" onclick="removediv(\'#claimForm' + t + '\')" title="Click here to remove this witness"/></div>';
					else									 
                str += '<div id="claimForm" class="claimForm"> <div class="form1"><img src="images/del.png"  onclick="removediv(\'#claimForm\')" title="Click here to remove this witness"/></div>';
					   
            str += '<div class="form2"><label class="myLable">Witness First Name</label><input name="wit_name' + t + '" type="text" class="planeTextFild wit_name" placeholder="" tabindex="' + ext + 2 + '"  required="" value="' + obj['wit_first_name'] + '"><label class="myLable">Address 2</label><input name="wit_address_two' + t + '" type="text" class="planeTextFild wit_address1" placeholder="" tabindex="' + ext + 5 + '"  value="' + obj['wit_address2'] + '"/><label class="myLable">Zip Code</label><input name="wit_zip' + t + '" type="text" class="planeTextFild wit_zip" placeholder=""  tabindex="' + ext + 8 + '" value="' + obj['wit_zip_code'] + '"><label class="myLable">Work/Other Phone Number</label><input name="wit_work_phone' + t + '" type="text" class="planeTextFild wit_work_phone" placeholder="" onKeyUp="FormatPhone(event,this)" tabindex="' + ext + 11 + '" value="' + obj['wit_work_phone'] + '"></div><div class="form2"><label class="myLable">Witness Last Name</label><input name="wit_lastname' + t + '" tabindex="' + ext + 3 + '" type="text" class="planeTextFild wit_lastname" placeholder=""  value="' + obj['wit_last_name'] + '"><label class="myLable">City</label><input name="wit_city' + t + '" tabindex="' + ext + 6 + '" type="text" class="planeTextFild wit_city" placeholder=""  value="' + obj['wit_city'] + '"><label class="myLable">Country</label><input name="wit_country' + t + '" type="text" class="planeTextFild wit_country" placeholder=""  tabindex="' + ext + 9 + '" value="United States"></div><div class="form2"><label class="myLable">Address1</label><input name="wit_address' + t + '" type="text" class="planeTextFild wit_address" placeholder=""  tabindex="' + ext + 4 + '"  value="' + obj['wit_address1'] + '"/><label class="myLable">State</label><select name="wit_state' + t + '" class="form-control myselectBig wit_state"  tabindex="' + ext + 7 + '">' + strstates + '</select><label class="myLable">Home/Cell Phone Number</label><input name="wit_home_phone' + t + '" type="text" class="planeTextFild wit_home_phone" placeholder="" onKeyUp="FormatPhone(event,this)" tabindex="' + ext + 10 + '" value="' + obj['wit_home_phone'] + '"></div><div class="clear"></div></div>';
            wtstate[t] = obj['wit_state'];
            t++; b++;
				
	         }
			 $("#no_of_witness").val(localStorage.getItem("no_of_witness"));		
		}
    else {
			removediv("#claimForm");
			$("#no_of_witness").val('0');			
		}
			 
			
    if (str && str != '') {
	  $("#container").html('');
	  $("#container").html(str);
	  
	 }
    for (var g = 1; g < wtstate.length; g++) {
        var namec = "wit_state" + g;
				   // alert("input[name='"+namec+"']" + wtstate[g]);
        $("select[name='" + namec + "']").val(wtstate[g]);
				 			 
			 }
	 loadsess();
}

function load_from_session_4() {
	 
	 //var notes= localStorage.getItem("inc_notes");
	 //$("#inc_notes").val(notes);
}

function store_session1()
{
    
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
		localStorage.setItem("inc_store_no", store_no);
		localStorage.setItem("inc_address1", address1);
		localStorage.setItem("inc_state", state);
		localStorage.setItem("inc_store_phone", store_phone);
		localStorage.setItem("inc_gen_man_name", gen_man_name);
		localStorage.setItem("inc_address2", address2);
		localStorage.setItem("inc_city", city);
		localStorage.setItem("inc_fax", fax);
		localStorage.setItem("inc_report_man_name", report_man_name);
		localStorage.setItem("inc_county", county);
		localStorage.setItem("inc_zip", zip);
}
function store_session2()
{
    
		var inc_date = document.getElementById("inc_date").value;
		var date_report = document.getElementById("date_reported").value;
		var inc_time = document.getElementById("inc_time").value;
		var time_reported = document.getElementById("time_reported").value;
		var desc = document.getElementById("inc_descunusual_desc").value;
		var incident_loc = document.getElementById("incident_loc").value;
		var police_inv = document.getElementById("police_inv").value;
		var police_agency = document.getElementById("police_agency").value;
		var alcohol = document.getElementById("alcohol").value;
		//var notes = document.getElementById("inc_notes").value;
		var policeReportId = document.getElementById("police_case_id").value;
		
		localStorage.setItem("inc_date", inc_date);
		localStorage.setItem("inc_date_report", date_report);
		localStorage.setItem("inc_time", inc_time);
		localStorage.setItem("inc_time_reported", time_reported);
		localStorage.setItem("inc_desc", desc);
		localStorage.setItem("inc_incident_loc", incident_loc);
		localStorage.setItem("inc_police_inv", police_inv);
		localStorage.setItem("inc_police_agency", police_agency);
		localStorage.setItem("inc_alcohol", alcohol);
		//localStorage.setItem("inc_notes", notes);
		localStorage.setItem("inc_policereportId", policeReportId);
		
}
function store_session3() {
    
		holder = $("#container");
    divs = holder.find('.new_claimForm');
		divcnt = divs.length;
		var witness = [];
		var filename = [];
		
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
			
			innerwitness["wit_first_name"] = $(wit_first_name).val();
			innerwitness["wit_last_name"] = $(wit_last_name).val();
			innerwitness["wit_address1"] = $(wit_address1).val();
			innerwitness["wit_address2"] = $(wit_address2).val();
			innerwitness["wit_city"] = $(wit_city).val();
			innerwitness["wit_state"] = $(wit_state).val();
			innerwitness["wit_zip_code"] = $(wit_zip_code).val();
			innerwitness["wit_home_phone"] = $(wit_home_phone).val();
			innerwitness["wit_work_phone"] = $(wit_work_phone).val();
			innerwitness["wit_other_phone"] = $(wit_other_phone).val();
			witness.push(innerwitness);
		}
		
    localStorage.setItem("witness", JSON.stringify(witness));
    localStorage.setItem("no_of_witness", $('#no_of_witness').val());
		
		
}
	
function store_session4() {
	//var notes = document.getElementById("inc_notes").value;
	//localStorage.setItem("inc_notes", notes);
}


function removeSessionvar() {
	    localStorage.removeItem("inc_title");
        localStorage.removeItem("inc_store_no");
		localStorage.removeItem("inc_address1");
		localStorage.removeItem("inc_state");
		localStorage.removeItem("inc_store_phone");
        localStorage.removeItem("inc_gen_man_name");
		localStorage.removeItem("inc_address2");
        localStorage.removeItem("inc_city");
		localStorage.removeItem("inc_fax");
        localStorage.removeItem("inc_report_man_name");
		localStorage.removeItem("inc_county");
        localStorage.removeItem("inc_zip");
		
		localStorage.removeItem("inc_date");
		localStorage.removeItem("inc_date_report");
		localStorage.removeItem("inc_time");
		localStorage.removeItem("inc_time_reported");
		localStorage.removeItem("inc_desc");
		localStorage.removeItem("inc_incident_loc");
		localStorage.removeItem("inc_notes");
		
		localStorage.removeItem("inc_police_inv");
		localStorage.removeItem("inc_police_agency");
		localStorage.removeItem("inc_policereportId");
		localStorage.removeItem("inc_alcohol");
		
		localStorage.removeItem("witness");	
		localStorage.removeItem("no_of_witness");
}