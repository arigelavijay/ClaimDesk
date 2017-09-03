    function login(){
		$("#msg").html('');
				  
		if ($("#claimdeskLogin").valid()) {       
                
        var jsonData = {
        "claimDeskUser":$("#username").val(),
		"password":$("#password").val()      
        }         
        
        $.ajax({type: "POST",                
				contentType: "application/json;charset=utf-8",
                accept:"application/json",				
		        dataType: "json",				
                url: hostname+"ClaimDeskWeb/services/v1/user/login",
                data: JSON.stringify(jsonData),
                success:function(result){
                //	alert(JSON.stringify(result));
                  if(result['claimDeskUser']!='' && result['locationId']!='')
                  {
                    sessionStorage.setItem("userid", result['userid']);
                    sessionStorage.setItem("token", result['token']);
                    sessionStorage.setItem("locationId", result['locationId']); 	
				//	getLoginDetails(result['userid']);					           
                    location.href = "main-dashboard.html";				                           
                   }                                                  
               },
                error: function (request, status, error) {
				  // alert("error");
				    var msg = request.responseJSON['errors']['error'][0]['description'];   
			        $("#msg").html(msg);
			   }
         });
		}
      }
	  
	 $("#login_but").on("keyenter",function(eve){
     var key = eve.keyCode || e.which ;
     if (key == 13) {
          $(this).click();
      }
      return false;        
});

$(document).keyup(function(event){
    if(event.keyCode == 13){
        $("#login_but").click();
    }
});

function getLoginDetails(userId)
{
	$.ajax({type: "GET",
				contentType: "application/json;charset=utf-8",
                accept:"application/json",
		        dataType: "json",
				cache: false,
                url: hostname+"ClaimDeskWeb/services/v1/user/"+userId,
				headers: { "token": sessionStorage.getItem("token"),
								           "userid": sessionStorage.getItem("userid"),
								           "locationId": sessionStorage.getItem("locationId")},
                success:function(result){ 
				var fname=result['firstName'];
				var lname=result['lastName'];
				var email=result['email'];
                    sessionStorage.setItem("firstName", fname);
					sessionStorage.setItem("lastName", lname);
					sessionStorage.setItem("email", email);                               
                }				
			  });  
		
}