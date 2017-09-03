var xmlhttp;
function GetxmlHttpObject()
{
	var objXMLHttp=null
	if(window.XMLHttpRequest)
	{
		objXMLHttp = new XMLHttpRequest()
	}
	else if(window.ActiveXObject)
	{		
	    objXMLHttp= new ActiveXObject("Microsoft.XMLHTTP")	
	}
	return objXMLHttp
}

function login_func(flag,resval,note_id)
{
	xmlhttp = GetxmlHttpObject();
	if(xmlhttp==null){
	 alert("Browser Does not support HTTP Request");
	 return false;
	}
	
	var username= document.getElementById('username').value;
	var password= document.getElementById('password').value;
	
	var params = "?username="+encodeURIComponent(username)+"&password="+encodeURIComponent(password);
    var url = "ajax/Aj_add_response.php"+params;
	
	
	xmlhttp.onreadystatechange = function()
	  {		  
		 
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		  {
			  var ar;
			  var table;
		      ar = xmlhttp.responseText.split("||"); 
			  var nid = trim(ar[2]);	         
			 
			   
			  if(trim(ar[1])=='rfi')  table  = document.getElementById('rfi_response_'+nid);
			  else table = document.getElementById('co_response_'+nid);
			  
			 
			  
			  var rowCount = table.rows.length;			
			  var row = table.insertRow(rowCount-1);	
			  
			  var cell0 = row.insertCell(0);
			  cell0.style.fontWeight='bold'; 			
			  cell0.innerHTML='Response';
			  		
			  var cell1 = row.insertCell(1);
			  cell1.style.height='auto';			
			  cell1.colSpan = 3;		
			  cell1.innerHTML = ar[0];		
			  
			  
			  if(trim(ar[1])=='rfi') document.getElementById('response_'+nid).value='';			 
			  else document.getElementById('responseco_'+nid).value='';			  
		  }
	  } 
	  
	xmlhttp.open("GET",url,true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-urlencoded");
	xmlhttp.setRequestHeader("Content-length", params.length);
	xmlhttp.send(); 	
}