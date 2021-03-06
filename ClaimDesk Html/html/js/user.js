            var userId = sessionStorage.getItem("userid");  
            var token = sessionStorage.getItem("token");     
            var locationId = sessionStorage.getItem("locationId");
			var firstName = sessionStorage.getItem("firstName");
			var lastName = sessionStorage.getItem("lastName");
		    var slocid ='';
		
		
		function authentication()
{
	
		if(userId==''|| userId==null){
					   apprise("Please Login Before Proceed.")
					   window.location= "index.html";
					 } 
					else
					{					 
					   set_header();
					}	
}
		
		    function userload()
			   {
				   sessionStorage.removeItem("Useredit");
				  $('#example1').dataTable( {
					"bStateSave": true,
					"sPaginationType": "full_numbers",
					"bServerSide": true,								
					"bProcessing": true,                    
					"bSortClasses": false,
					"bDeferRender": true,
					"sAjaxSource": hostname+"ClaimDeskWeb/services/v1/user/getUserList",
					"bFilter": false,
					//"bInfo": false,
					"aoColumns": [ null,null,null,null,null, { "bSortable": false}], 
					  	
					"fnServerData": function ( sSource, aoData, fnCallback, oSettings ) {
						
						var paramData = {};		
						var sExt = "?";
						var sAnd = "";						
						var r = 0;
						for(var key in aoData) 
						{						
							paramData[aoData[key]['name']] = aoData[key]['value'];
							
							if(r>0) sAnd = "&";
							if(aoData[key]['name'].trim() == "iDisplayLength"){
							sExt += sAnd+"limit="+ aoData[key]['value']; r++}
							if(aoData[key]['name'].trim() == "iDisplayStart"){
							sExt += sAnd+ "offset="+ aoData[key]['value'];r++}
							if(aoData[key]['name'].trim() == "iSortCol_0"){
							sExt += sAnd+"sort_col="+ aoData[key]['value'];r++}
							if(aoData[key]['name'].trim() == "sSortDir_0"){
							sExt += sAnd+"sort="+ aoData[key]['value'];	r++}
							
							if(aoData[key]['name'].trim() == "sEcho") var sEcho = aoData[key]['value'];	
						}				
					
						//limit=3&offset=0&sort_col=0&sort=asc
					  oSettings.jqXHR = $.ajax( {
						"type": "GET",
						"contentType":"application/json;charset=utf-8",
	                    "accept":"application/json",	
	                    "dataType": "json",                   
	                    "headers": { "token": token,
	                                   "userid": userId,
	                                   "locationId": locationId}, 								
						"url": sSource+sExt,
						//"data": JSON.stringify(paramData),
						"success":function(result){               
	                            var tempdset = {};	
	                            var dataSet = [];							
								for(var key in result["user"]) {
									
									 var objinner = [];								 		
									     	
										 objinner.push(result["user"][key]['firstName']);
										 objinner.push(result["user"][key]['lastName']);
										 objinner.push(result["user"][key]['email']);								 									    
										 objinner.push(result["user"][key]['claimDeskUserId']);
										 objinner.push(result["user"][key]['branchId']);
										 var name=result["user"][key]['firstName']+" "+result["user"][key]['lastName'];
																			 
										  var strlink = "<ul class='manageIcon'><li data-toggle='modal' data-target='#myModal'><img src='images/permission.png' width='16' height='19' alt='img' onclick='setlocId("+result["user"][key]['id']+",\"param\",\""+name+"\","+result["user"][key]['locationId']+")' title='Permissions'></li><li data-toggle='modal' data-target='.bs-example-modal-lg'><img src='images/min1.png' width='16' height='19' alt='img' onclick='setlocId("+result["user"][key]['id']+",\"show\",\"\",\"\")'></li><li><img src='images/min2.png' width='16' height='19' alt='img' onclick='setlocId("+result["user"][key]['id']+",\"edit\",\"\",\"\")'></li><li><img src='images/min5.png' width='16' height='19' alt='img' onclick='setlocId("+result["user"][key]['id']+",\"delete\",\"\",\"\")'></li></ul>";						 
										 objinner.push(strlink); 					 
									     dataSet.push(objinner);
								  }		
								  
								   tempdset["sEcho"] =  sEcho;
								   tempdset["iTotalRecords"] =  result['totalRecord'];
								   tempdset["iTotalDisplayRecords"] =result['totalRecord'];
								   tempdset["aaData"] = dataSet
								  	//alert(JSON.stringify(dataSet));	
								fnCallback(tempdset);						  						  
						     } 
					  } );
					}
				 } );
				 
			   }
			   
			   
			   
			
			
			
			
			function createPageLoad()
			{	
			   var currentemp = sessionStorage.getItem("Useredit");			  
			   if(currentemp){				  
			   $.ajax({type: "GET",                
						contentType: "application/json;charset=utf-8",
						accept:"application/json",				
						dataType: "json",
						global: false,
    			        async:false,
						cache: false,
						url: hostname+"ClaimDeskWeb/services/v1/user/"+currentemp,    
						headers: { "token": token,
						 "userid": userId,
						 "locationId": locationId},        
						success:function(result){ 
						      $("#id").val(result['id']);							
							  $("#claimDeskUserId").val(result['claimDeskUserId']);
							  $("#firstName").val(result['firstName']);
							  $("#lastName").val(result['lastName']);
							  $("#middleName").val(result['middleName']);
							  $("#email").val(result['email']);							 
							  $("#password").val(result['password']);
							  $("#state").val(result['state']);
							  $("#locationId").val(result['locationId']);	
							  slocid = 	result['locationId'];				
							}					                
					        
				 });
				  $("#claimDeskUserId").prop("readonly",true);
				  $("#password").prop("readonly",true);		 	
			  }				  
			  	setlist_locname('#locationId',slocid);	
			}
			
			function setlocId(locId,flag,name,locationIdx)
			{		
			     	 	
				if(flag=='edit') {							 
							  sessionStorage.setItem("Useredit", locId); 
							  location.href = "edit-user.html";   
						 }	
				if(flag=='param') {							 
							  //sessionStorage.setItem("Useredit", locId);					  
							 
							  $.ajax({type: "GET",                
							  contentType: "application/json;charset=utf-8",
							  accept:"application/json",				
							  dataType: "json",	
							  cache: false,
							  url: hostname+"ClaimDeskWeb/services/v1/user/getAllRole/"+locId,     
							  headers: { "token": token,
										 "userid": userId,
										 "locationId": locationId},        
							  success:function(result){  
							  $("#user_idx").val(locId); 
							  $("#unamex").html("["+name+"]"); 
							  getbranchbyLoc(locationIdx); 
							  
							  var str = "";
							  var o=0;   
							  var l = result.length;
							 
							  var selected = result[l-1]['selectedrole'].split(',');
							 
							 
							  	for(var key in result) {
									o++;
									
									if(o<l)	{	
									
									 var a = selected.indexOf(result[key]['roleid'].toString()); 
									 
									 if(a>=0)	var strc = " checked='checked'";	
									 else strc ='';											
									str += "<li class='checkLi'>  <input type='checkbox' name='roles' id='test"+o+"' value='"+result[key]['roleid']+"' "+strc+"/><label for='test"+o+"'>"+result[key]['roledesc']+"</label></li>";
								}
								
								}
   
								$("#userparam").html(str); 
							}							
						});						     
					}
			    else if(flag=='delete') {	
			                var response = confirm("Do you want to delete this User?");
			              	if(response)
							{	  					 
							  $.ajax({type: "DELETE",                
							  contentType: "application/json;charset=utf-8",
							  accept:"application/json",				
							  //dataType: "json",				
							  url: hostname+"ClaimDeskWeb/services/v1/user/delete/"+locId,     
							  headers: { "token": token,
										 "userid": userId,
										 "locationId": locationId},        
							  success:function(result){  
									  location.href="manage-user.html";									  
							}							
						});
					 }
			      }
				  else if(flag=='show') {
			            	  					 
							  $.ajax({type: "GET",                
							  contentType: "application/json;charset=utf-8",
							  accept:"application/json",				
							  dataType: "json",
							  cache: false,
							  url: hostname+"ClaimDeskWeb/services/v1/user/"+locId,     
							  headers: { "token": token,
										 "userid": userId,
										 "locationId": locationId},        
							  success:function(result){  
							  $("#eid").html(checkblank(result['claimDeskUserId']));   
							  $("#fname").html(checkblank(result['firstName']));   
							  $("#mname").html(checkblank(result['middleName']));   
							  $("#lname").html(checkblank(result['lastName'])); 
							  $("#email").html(checkblank(result['email']));						  
							}							
						});
						
					
			      }
			 }	
			
			
			
			function save_user()
			{
				  
			  if ($("#userForm").valid()) { 
			  
			  document.getElementById("submit_but").disabled =true;			  	
			  		
			                  var jsonData = {  
			                    "id":$("#id").val(), 
								"claimDeskUserId":$("#claimDeskUserId").val(),
								"firstName":$("#firstName").val(),		
								"lastName":$("#lastName").val(),		
								"middleName":$("#middleName").val(),
								"email":$("#email").val(),								
								"password":$("#password").val(),
								"state":$("#state").val(),
								"locationId":$("#locationId").val(),
							 } 			 
			 
				$.ajax({type: "POST",                
						contentType:"application/json;charset=utf-8",
						accept:"application/json",	
						//dataType: "json",				
						url: hostname+"ClaimDeskWeb/services/v1/user/create", 
					    headers: { "token":token,
								   "userid":userId,
								   "locationId":locationId},
					
						data: JSON.stringify(jsonData),
						success:function(result){  
								location.href="manage-user.html";		            
							 }   			  
				 });
				 
				  
				 
				}
			  		     	  
			}
			
			
			function edit_user()
			{
				 var uid= $("#id").val(); 
			     if ($("#userForm").valid() && uid && uid!='' ) { 			  	
			  		
			                  var jsonData = { 	
							    "id":uid, 
								"claimDeskUserId":$("#claimDeskUserId").val(),
								"firstName":$("#firstName").val(),		
								"lastName":$("#lastName").val(),		
								"middleName":$("#middleName").val(),
								"email":$("#email").val(),						
								"state":$("#state").val(),
								"locationId":$("#locationId").val(),
							 } 			 
			 
				$.ajax({type: "POST",                
						contentType:"application/json;charset=utf-8",
						accept:"application/json",	
						//dataType: "json",				
						url: hostname+"ClaimDeskWeb/services/v1/user/update/"+uid, 
					    headers: { "token":token,
								   "userid":userId,
								   "locationId":locationId},
					
						data: JSON.stringify(jsonData),
						success:function(result){  
								location.href="manage-user.html";		            
						},
						error: function (err) {
						    if (err.responseText) {
						        var obj = JSON.parse(err.responseText);
						        if (obj.errors) {
						            $('#errMsg').fadeIn().html(obj.errors.error[0].description);
						            setTimeout(function () {
						                $('#errMsg').fadeOut().empty();
						            }, 10000);
						        }
						    }
						}
				 });
				}
			  		     	  
			}
		
		function set_header()	
	    {
			 var firstName = sessionStorage.getItem("firstName");
			 var lastName = sessionStorage.getItem("lastName");				 
			 var address = sessionStorage.getItem("address");
			 var storeId = sessionStorage.getItem("storeId");
			 if(sessionStorage.getItem("logo") && sessionStorage.getItem("logo")!='' && sessionStorage.getItem("logo")!='null')	 
				// var logo =  "images/logo/"+locationId+"/"+sessionStorage.getItem("logo");
				downloadLogo(locationId,sessionStorage.getItem("logo"));
			 else var logo =  "images/no-logo.png";
			 var userName = firstName+" "+lastName;	
			 				
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
			 //aboutInfo();
		}
		
		
			function save_param()
			{
				 var frm =  document.getElementById('permission');				
				 var role = [];			   
				   
				  $.each($("input[name='roles']"), function(){  
				  var innerrole = {}; 
					   
						   if ($(this).prop('checked')==true){						
							   innerrole['roleid']  = $(this).val();
							   innerrole['isenable'] = 1;		
						   }
						   else
						   {
							   innerrole['roleid']  = $(this).val();
							   innerrole['isenable'] = 0;		 
						   }
	                    role.push(innerrole);
				  });
			
				  var jsonData = {  
				  "userid":$("#user_idx").val(), 
				  "role":role 
				  } 			 
		 
				$.ajax({type: "POST",                
						contentType:"application/json;charset=utf-8",
						accept:"application/json",								
						url: hostname+"ClaimDeskWeb/services/v1/user/setpermission", 
					    headers: { "token":token,
								   "userid":userId,
								   "locationId":locationId},
					
						data: JSON.stringify(jsonData),
						success:function(result){  
								location.href="manage-user.html";		            
							}   			  
				 });   	  
			}
			function getbranchbyLoc(locid)	
		  {
			  
		   $.ajax({
				  type: "GET",
				  contentType: "application/json;charset=utf-8",
				  accept: "application/json",
				  global: false,
    			  async:false,	
				  cache: false,
				  url: hostname + "ClaimDeskWeb/services/v1/location/getBranchID/"+locid,
				  headers: {
					  "token": token,
					  "userid": userId,
					  "locationId": locationId
				  },
				  success: function(result) {						 
						  $("#bid").html("[Branch ID:"+result+"]");
				  }
			 });
		  }
		  
function changePass()
{
	if ($("#change_pass").valid()) {  
	var old_pass=document.getElementById("old_pass").value;
	var new_pass=document.getElementById("new_pass").value;
	var con_new_pass=document.getElementById("con_new_pass").value;
	
	
	var jsonData = {
		                 
					    "oldpassword":old_pass,
	                     "newpassword":new_pass
		              }

		              $.ajax({
		                  type: "POST",
		                  contentType: "application/json;charset=utf-8",
		                  accept: "application/json",
						  dataType: "json",	
		                  url : hostname+"ClaimDeskWeb/services/v1/user/changePassword", 
		                  headers: {
		                      "token": token,
		                      "userid": userId,
		                      "locationId": locationId
		                  },
		                  data: JSON.stringify(jsonData),
		                  success: function(result) {
		                     //alert(JSON.stringify(result));
							 document.getElementById("old_pass").value="";
							 document.getElementById("new_pass").value="";
							 document.getElementById("con_new_pass").value="";
							 $("#msg_show").html(result['result']);
						  },
						  error: function (request, status, error) {  
							  // alert("error");
							  document.getElementById("old_pass").value="";
							 document.getElementById("new_pass").value="";
							 document.getElementById("con_new_pass").value="";
							 var msg = request.responseJSON['errors']['error'][0]['description'];   
						   $("#msg_show").html(msg);
			 			  }
		              });
	}
}

function aboutInfo()
{
	var attr=JSON.parse(checkblank(sessionStorage.getItem("attr")));
						var key_val=JSON.parse(checkblank(sessionStorage.getItem("key_val")));
						var str="";
						for(var key in attr) 
						  {
							  str+='<div  style="float:left; width:50%"><span id="attribute" style="width: 100% !important;">'+attr[key]+'</span></div><div style="float:right; width:48%"><span id="key_val"  style="width: 100% !important;">:'+key_val[key]+'</span></div>';
						  }
						
						$("#about_info").html(str);
}

function about()
{
	$.ajax({type: "GET",                
						contentType: "application/json;charset=utf-8",
						accept:"application/json",				
						dataType: "json",
						cache: false,
						url: hostname+"ClaimDeskWeb/services/v1/about", 
						global: false,
    			        async:false,	    
						headers: { "token": token,
						 "userid": userId,
						 "locationId": locationId},        
						success:function(result){ 
						var i=0;
						var str="";
						var attr=[];
						var key_val=[];
								for(var key in result)
								{
								//	attr.push(Object.keys(result)[i++]);
								//	key_val.push(result[key]);
									str+='<div  style="float:left; width:30%"><span id="attribute" style="width: 100% !important;">'+Object.keys(result)[i++]+'</span></div><div style="float:right; width:68%"><span id="key_val"  style="width: 100% !important;">:'+result[key]+'</span></div>';
									
								}
							//	sessionStorage.setItem("attr",JSON.stringify(attr));
							//	sessionStorage.setItem("key_val",JSON.stringify(key_val));
								$("#about_info").html(str);
						}
							  });
					   return "";
	
}