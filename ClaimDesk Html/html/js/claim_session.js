// *************************************************************

function load_from_session_claim() 
{	
    var guest_fname = localStorage.getItem("guest_fname");
	var guest_home_phone = localStorage.getItem("guest_home_phone");
	var guest_id_no = localStorage.getItem("guest_id_no");
	var guest_lname = localStorage.getItem("guest_lname");
	var guest_work_phone = localStorage.getItem("guest_work_phone");
    var guest_home_phone = localStorage.getItem("guest_home_phone");
	var guest_state = localStorage.getItem("guest_state");
	var guest_age = localStorage.getItem("guest_age");
	var guest_email = localStorage.getItem("guest_email");
	var parent_name = localStorage.getItem("parent_name");
	var claim_incident_id = localStorage.getItem("claim_incident_id");
	var claim_location_id = localStorage.getItem("claim_location_id");
    
    $("#guest_fname").val(guest_fname);
	$("#guest_home_phone").val(guest_home_phone);
	$("#guest_id_no").val(guest_id_no);
	$("#guest_lname").val(guest_lname);
	$("#guest_work_phone").val(guest_work_phone);
	$("#guest_home_phone").val(guest_home_phone);
	$("#guest_state").val(guest_state);
	$("#guest_age").val(guest_age);
	$("#guest_email").val(guest_email);
	$("#parent_name").val(parent_name);	
	$("#incident_id").val(claim_incident_id);
	$("#hidden_location_id").val(claim_location_id);	
}



function save_to_session_claim()
{   	
	  var guest_fname = document.getElementById("guest_fname").value;
	  var guest_home_phone = document.getElementById("guest_home_phone").value;
	  var guest_id_no = document.getElementById("guest_id_no").value;
	  var guest_lname = document.getElementById("guest_lname").value;
	  var guest_work_phone = document.getElementById("guest_work_phone").value;
	  var guest_home_phone = document.getElementById("guest_home_phone").value;
	  var guest_state = document.getElementById("guest_state").value;
	  var guest_age = document.getElementById("guest_age").value;
	  var guest_email = document.getElementById("guest_email").value;
	  var parent_name = document.getElementById("parent_name").value;	 
	  var claim_incident_id = document.getElementById("incident_id").value;
	  var claim_location_id = document.getElementById("hidden_location_id").value;
	
	  localStorage.setItem("guest_fname", guest_fname);
	  localStorage.setItem("guest_home_phone", guest_home_phone);
	  localStorage.setItem("guest_id_no", guest_id_no);
	  localStorage.setItem("guest_lname", guest_lname);
	  localStorage.setItem("guest_work_phone", guest_work_phone);
	  localStorage.setItem("guest_home_phone", guest_home_phone);
	  localStorage.setItem("guest_state", guest_state);
	  localStorage.setItem("guest_age", guest_age);
	  localStorage.setItem("guest_email", guest_email);
	  localStorage.setItem("parent_name", parent_name);
	  localStorage.setItem("claim_incident_id", claim_incident_id);
	  localStorage.setItem("claim_location_id", claim_location_id);  
	  
}

function load_from_session_claim1()   // load unsaved session values in page ( claim1.html )
{
    
    var illness = {};
       illness["date_picker_product"] = localStorage.getItem("claim_date_picker_product");
	   illness["time_prod_purchase"] = localStorage.getItem("claim_time_value");
	   illness["am_pm"] = localStorage.getItem("claim_time");
	   illness["guest_order_list"] = localStorage.getItem("claim_guest_order");
	   illness["eaten_by_guest"] = localStorage.getItem("claim_guest_eat");
	   illness["recipt_name"] = localStorage.getItem("claim_place_eat");
		  //place eat.= receipt name
	   var data = localStorage.getItem("claim_receipt");
	   if(data == "Yes"){
		   illness["recipt_Y_N"] = data;
	   }
	   else {
		   illness["recipt_Y_N"] = "No";
	   }
	   illness["illness_symptoms"] = localStorage.getItem("claim_ill_symptoms");
	   illness["recipt_no"] = localStorage.getItem("claim_receipt_no");
       illness["illness_symptoms"] = localStorage.getItem("claim_ill_symptoms");
	   illness["recipt_date"] = localStorage.getItem("claim_date_picker_receipt");
       illness["illness_date"] = localStorage.getItem("claim_date_picker_illness");
	   illness["illness_time"] = localStorage.getItem("claim_time_value_ill");
	  // illness["illness_time"] = localStorage.getItem("claim_time_ill");
	   illness["illness_time_am_pm"] = localStorage.getItem("claim_ill_time_value");
	  // illness["illness_time_am_pm"] = localStorage.getItem("claim_ill_time");
	   illness["illness_location"] = localStorage.getItem("claim_ill_location");
	   illness["medicalFacilityProvider"] = localStorage.getItem("claim_ill_medical");
	   var tpi =  localStorage.getItem("thirdPartyInvolved");
	   if(tpi == "Yes"){
		   illness["thirdPartyInvolved"]= tpi;
	   }
	   else {
		   illness["thirdPartyInvolved"]= "No";
	   }
	   
 	  
	
	  var injury={};  // injury values
					  
      injury["date"] =localStorage.getItem("claim_date_picker_injury");
	  injury["symptoms"] = localStorage.getItem("claim_inj_symptoms");
	  injury["location"] = localStorage.getItem("claim_location_inj");
	  injury["medicalFacility"] = localStorage.getItem("claim_medical_guest");
	  injury["description"] = localStorage.getItem("claim_des_accident");
	  injury["observation"] = localStorage.getItem("claim_inj_observe");
      injury["floorCondition"] = localStorage.getItem("claim_fl_condition");
	  injury["mats"] = localStorage.getItem("claim_mats");
	  injury["matLocation"] = localStorage.getItem("claim_y_where");
	  injury["source"] = localStorage.getItem("claim_source");
	  injury["weather"] = localStorage.getItem("claim_weather");
	  injury["shoeType"] = localStorage.getItem("claim_shoe_type");
	  injury["cones"] = localStorage.getItem("claim_cones");
	  injury["video"] = localStorage.getItem("claim_video");
	  injury["guestTransportation"] = localStorage.getItem("claim_gst_leave");
	  injury["coneLocation"] = localStorage.getItem("claim_loc_cones");
	  injury["incidentVideo"] = localStorage.getItem("claim_i_video");
	  injury["ambulance"] = localStorage.getItem("claim_ambulance");
	  
	       
	 // other values
      var other={};
      
	  other["damage"] = localStorage.getItem("other_car_damage");
      other["description"] = localStorage.getItem("other_damage_occur");
	  other["estimatedCost"] = localStorage.getItem("other_est_cost");
	  other["location"] = localStorage.getItem("other_d_location");
	  other["newDamage"] = localStorage.getItem("other_damage");
	  other["landlordFault"] = localStorage.getItem("other_fault_pro");
	  other["manager"] = localStorage.getItem("other_land_pro");
	  other["signature"] = localStorage.getItem("other_mang_sign");
	  other["date"] = localStorage.getItem("other_date_picker_inj");
	  
	  if( localStorage.getItem("claim_test1")=="1"){
		  document.getElementById("illness_div").style.display='block';
		  document.getElementById("check_illness").checked=true;	
		  document.getElementById("check_injury").checked=false;	
		  document.getElementById("injury_div").style.display='none';	
		  document.getElementById("check_other").checked=false;
		  document.getElementById("other_div").style.display = 'none';		  
	  }
	  else if ( localStorage.getItem("claim_test2")=="1"){
		  document.getElementById("illness_div").style.display='none';
		  document.getElementById("check_illness").checked=false;	
		  document.getElementById("check_injury").checked=true;	
		  document.getElementById("injury_div").style.display='block';	
		  document.getElementById("check_other").checked=false;
		  document.getElementById("other_div").style.display='none';
	  }
	  
	  else if ( localStorage.getItem("claim_test3")=="1"){
		  document.getElementById("illness_div").style.display='none';
		  document.getElementById("check_illness").checked=false;	
		  document.getElementById("check_injury").checked=false;	
		  document.getElementById("injury_div").style.display='none';	
		  document.getElementById("check_other").checked=true;
		  document.getElementById("other_div").style.display='block';
	  }
 
	
	$("#claim_desc").val(localStorage.getItem("claim_desc"));
      // display values in text fields.. 
    $("#date_picker_product").val(illness["date_picker_product"]);	
	$("#purchased_time").val(illness["time_prod_purchase"]);
	//$("#time").val(illness["am_pm"]);
	$("#guest_order").val(illness["guest_order_list"]);
	$("#guest_eat").val(illness["eaten_by_guest"]);
	$("#place_eat").val(illness["recipt_name"]);
	$("#receipt").val(illness["recipt_Y_N"]);
	if(illness["recipt_Y_N"]=="Yes") document.getElementById("file_upload_div").style.display='block';	
	else document.getElementById("file_upload_div").style.display='none';	
	$("#receipt_no").val(illness["recipt_no"]);
	$("#date_picker_receipt").val(illness["recipt_date"]);
	$("#receipt_time").val(illness["illness_time"]);
	$("#ill_time_value").val(illness["illness_time_am_pm"]);
	$("#ill_symptoms").val(illness["illness_symptoms"]);
    $("#date_picker_illness").val(illness["illness_date"]);
	//$("#ill_time_value").val(illness["illness_time"]);
	//$("#ill_time").val(illness["illness_time_am_pm"]);
	$("#ill_location").val(illness["illness_location"]);
	$("#ill_medical").val(illness["medicalFacilityProvider"]);

	$("#date_picker_injury").val(injury["date"]);
	$("#inj_symptoms").val(injury["symptoms"]);
	$("#location_inj").val(injury["location"]);
	$("#medical_guest").val(injury["medicalFacility"]);
	$("#des_accident").val(injury["description"]);
	$("#inj_observe").val(injury["observation"]); 
	$("#fl_condition").val(injury["floorCondition"]);
	$("#mats").val(injury["mats"]);
	
	
	/*
    if (injury["mats"] == 'Yes') document.getElementById("mat_yes_div").style.display = 'block';
    else document.getElementById("mat_yes_div").style.display = 'none';
    */
    toggle_visibility(injury["mats"], 'mat_yes_div');
	 
	$("#y_where").val(injury["matLocation"]);
	$("#source").val(injury["source"]);
	$("#weather").val(injury["weather"]);
	$("#shoe_type").val(injury["shoeType"]);
	$("#cones").val(injury["cones"]);
	
	if(injury["cones"]=='Yes') document.getElementById("cones_yes_div").style.display='block';	
	else document.getElementById("cones_yes_div").style.display='none';
	
	$("#loc_cones").val(injury["coneLocation"]);
	$("#video").val(injury["video"]);
	$("#i_video").val(injury["incidentVideo"]);
	$("#gst_leave").val(injury["guestTransportation"]);
	$("#ambulance").val(injury["ambulance"]);
	
	$("#car_damage").val(other["damage"]);
	
	
	if (other["damage"] == 'Yes') {
	    document.getElementById("car_damage_div").style.display = 'block';	    
	}
	else {
	    document.getElementById("car_damage_div").style.display = 'none';	    
	}
	
	$("#damage_occur").val(other["description"]);
	$("#d_location").val(other["location"]);
	$("#fault_pro").val(other["landlordFault"]);
	$("#est_cost").val(other["estimatedCost"]);
	$("#damage").val(other["newDamage"]);
	$("#land_pro").val(other["manager"]);
	$("#mang_sign").val(other["signature"]);
	$("#date_picker_inj").val(other["date"]);
	
	
	var tpInvolved = localStorage.getItem("tpinvolved");
	var isurer = localStorage.getItem("insurer");
	if(tpInvolved){
		var data = JSON.parse(tpInvolved);
		for (var key in data) {
			document.getElementById(key).value=data[key];
		}
	}
	if(isurer){
		var data = JSON.parse(isurer);
		for (var key in data) {
			document.getElementById(key).value=data[key];
		}
	}
	

     document.getElementById("thirdPartyInvolved").value= illness["thirdPartyInvolved"];
     hideThirdPartyEntrollment(illness["thirdPartyInvolved"]);     
     
     
     //setTimeout(function () {         
                  
     //}, 3000); 
    //$('label[class^="error"]:not(.valid)').remove();
}
	
function save_to_session_claim1() // store session values (page: claim1.html )
{
    
      var check_illness='';
      var check_injury='';
      var check_other='';

	  if(document.getElementById("check_illness").checked==true)
	    check_illness = document.getElementById("check_illness").value;
	  if(document.getElementById("check_injury").checked==true)
	    check_injury = document.getElementById("check_injury").value;
	  if(document.getElementById("check_other").checked==true)
	    check_other = document.getElementById("check_other").value;
		
	  
	  var claim_desc = document.getElementById("claim_desc").value;
      var date_picker_product = document.getElementById("date_picker_product").value;
      var time_value = document.getElementById("purchased_time").value; // value..2/3/4
	//  var time = document.getElementById("time").value; // value.. AM/PM
 	  var guest_order = document.getElementById("guest_order").value;
	  var guest_eat = document.getElementById("guest_eat").value;
	  var place_eat = document.getElementById("place_eat").value;
	  var receipt = document.getElementById("receipt").value;
	 //  upload file url values pending  .....
	  var receipt_no = document.getElementById("receipt_no").value;
	  var ill_symptoms = document.getElementById("ill_symptoms").value;
	  var date_picker_receipt = document.getElementById("date_picker_receipt").value;
	  var date_picker_illness = document.getElementById("date_picker_illness").value;
	  var time_value_ill = document.getElementById("receipt_time").value; //i.e 2,3
	  //var time_ill = document.getElementById("time").value; //i.e AM/PM
      var ill_time_value = document.getElementById("ill_time_value").value;
	 // var ill_time = document.getElementById("ill_time").value;
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
	  localStorage.setItem("thirdPartyInvolved",thirdPartyInvolved);
	  localStorage.setItem("claim_desc", claim_desc);
	  localStorage.setItem("claim_test1", check_illness);
	  localStorage.setItem("claim_test2", check_injury);
	  localStorage.setItem("claim_test3", check_other);

	  localStorage.setItem("claim_date_picker_product", date_picker_product);
	  localStorage.setItem("claim_time_value", time_value);
	//  localStorage.setItem("claim_time", time);
	  localStorage.setItem("claim_guest_order", guest_order);
	  localStorage.setItem("claim_guest_eat", guest_eat);
	  localStorage.setItem("claim_place_eat", place_eat);
	  localStorage.setItem("claim_receipt", receipt);
	  localStorage.setItem("claim_receipt_no", receipt_no);
	  localStorage.setItem("claim_ill_symptoms", ill_symptoms);
	  localStorage.setItem("claim_date_picker_receipt", date_picker_receipt);
	  localStorage.setItem("claim_date_picker_illness", date_picker_illness);
	  localStorage.setItem("claim_time_value_ill", time_value_ill);
	  //localStorage.setItem("claim_time_ill", time_ill);
	  localStorage.setItem("claim_ill_time_value", ill_time_value);
//	  localStorage.setItem("claim_ill_time", ill_time);
	  localStorage.setItem("claim_ill_location", ill_location);
	  localStorage.setItem("claim_ill_medical", ill_medical);

      localStorage.setItem("claim_date_picker_injury", date_picker_injury);
	  localStorage.setItem("claim_inj_symptoms", inj_symptoms);
	  localStorage.setItem("claim_location_inj", location_inj);
	  localStorage.setItem("claim_medical_guest", medical_guest);
	  localStorage.setItem("claim_des_accident", des_accident);
	  localStorage.setItem("claim_inj_observe", inj_observe);
	  localStorage.setItem("claim_fl_condition", fl_condition);
	  localStorage.setItem("claim_mats", mats);
	  localStorage.setItem("claim_y_where", y_where);
	  localStorage.setItem("claim_source", source);
	  localStorage.setItem("claim_weather", weather);
	  localStorage.setItem("claim_shoe_type", shoe_type);
	  localStorage.setItem("claim_cones", cones);
	  localStorage.setItem("claim_video", video);
	  localStorage.setItem("claim_gst_leave", gst_leave);
	  localStorage.setItem("claim_loc_cones", loc_cones);
	  localStorage.setItem("claim_i_video", i_video);
	  localStorage.setItem("claim_ambulance", ambulance);	  
      localStorage.setItem("other_car_damage", car_damage);
	  localStorage.setItem("other_damage_occur", damage_occur);
	  localStorage.setItem("other_est_cost", est_cost);
	  localStorage.setItem("other_d_location", d_location);
	  localStorage.setItem("other_damage", damage);
	  localStorage.setItem("other_fault_pro", fault_pro);
	  localStorage.setItem("other_land_pro", land_pro);
	  localStorage.setItem("other_mang_sign", mang_sign);
	  localStorage.setItem("other_date_picker_inj", date_picker_inj);
	  
	  
	  var tpInvolvement = {}
      var divs = ["tpdiv1", "tpdiv2", "tpdiv3"];
      
      for(var j=0;j<divs.length;j++ ){
    	  var s= divs[j];
          var elementArr = document.getElementById(s).getElementsByTagName('*');
    	 
    	  for(var i=0;i<elementArr.length;i++){
    		  
    		  if("text"==elementArr[i].type ||"select-one"==elementArr[i].type){
    			  tpInvolvement[elementArr[i].name] = elementArr[i].value;
    		  }
    		  
    	  }
       }
      var insurer = {}
      divs=["indiv1", "indiv2", "indiv3"];
      for(var j=0;j<divs.length;j++ ){
    	  var s= divs[j];
          var elementArr = document.getElementById(s).getElementsByTagName('*');
    	 
    	  for(var i=0;i<elementArr.length;i++){
    		  
    		  if("text"==elementArr[i].type ||"select-one"==elementArr[i].type){
    			  insurer[elementArr[i].name] = elementArr[i].value;
    		  }
    		  
    	  }
       }
      localStorage.setItem("tpinvolved", JSON.stringify(tpInvolvement));
      localStorage.setItem("insurer",JSON.stringify( insurer));
}

function remove_session_variable() {
      for (var key in localStorage){
    	  localStorage.removeItem(key);
	  }
}

function load_from_session_claim3()
{	
	 //var notes= localStorage.getItem("claim_notes");
	 //$("#claim_notes").val(notes);
	 getIncidentFiles(localStorage.getItem("claim_incident_id"));
}
function save_to_session_claim3(){
	 //var notes = document.getElementById("claim_notes").value;
	 //localStorage.setItem("claim_notes",notes);
}