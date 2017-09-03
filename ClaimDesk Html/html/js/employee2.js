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

function setCheckedValue(radioObj, newValue) {
    if (!radioObj)
        return;
    var radioLength = radioObj.length;
    if (radioLength == undefined) {
        radioObj.checked = (radioObj.value == newValue.toString());
        return;
    }
    for (var i = 0; i < radioLength; i++) {
        radioObj[i].checked = false;
        if (radioObj[i].value == newValue.toString()) {
            radioObj[i].checked = true;
        }
    }
}

function rdo_OnChange(id, groupName, value) {
    var selectedValue = value == 'true' ? true : false;

    var rdoEleObjs = $('.' + groupName + (selectedValue ? 'YesCss' : 'NoCss'));
    $.each(rdoEleObjs, function (i, item) {
        setCheckedValue(document.forms["frm"].elements[item.name], selectedValue);
    });

    $('.' + groupName + 'Count').html(selectedValue ? 0 : 5);
}

$(function () {
    
    $('.rdoCss').change(function () {
        var Nocount = 0;
        var Yescount = 0;
        var rdoEleObjs = $('.' + this.classList[0] + 'NoCss');

        $.each(rdoEleObjs, function (i, item) {            
            var val = $('input[name=' + item.name + ']:checked').val() == 'true' ? true : false;

            if (!val) 
                Nocount++;            
            else 
                Yescount++;
            
        });
        $('.' + this.classList[0] + 'Count').html(Nocount);

        if (Nocount == 5)
            setCheckedValue(document.forms["frm"].elements[this.classList[0]], false);        
        else if(Yescount == 5)
            setCheckedValue(document.forms["frm"].elements[this.classList[0]], true);
        else if (Nocount != 5 && Yescount != 5) {            
            setCheckedValue(document.forms["frm"].elements[this.classList[0] + '_Yes'], '');
            setCheckedValue(document.forms["frm"].elements[this.classList[0] + '_No'], '');

        }
    });
});