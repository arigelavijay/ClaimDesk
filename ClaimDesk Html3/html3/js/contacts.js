var userId = sessionStorage.getItem("userid");
var token = sessionStorage.getItem("token");
var locationId = sessionStorage.getItem("locationId");
var firstName = sessionStorage.getItem("firstName");
var lastName = sessionStorage.getItem("lastName");
var sellocationid = '';
var selmanagerid = '';

function set_header() {

    var firstName = sessionStorage.getItem("firstName");
    var lastName = sessionStorage.getItem("lastName");
    var address = sessionStorage.getItem("address");
    var storeId = sessionStorage.getItem("storeId");
    if (sessionStorage.getItem("logo") && sessionStorage.getItem("logo") != '' && sessionStorage.getItem("logo") != 'null')
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
                str += '<div  style="float:left; width:30%"><span id="attribute" style="width: 100% !important;">' + Object.keys(result)[i++] + '</span></div><div style="float:right; width:68%"><span id="key_val"  style="width: 100% !important;">:' + result[key] + '</span></div>';

            }

            $("#about_info").html(str);
        }
    });
    return "";

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
                document.getElementById("old_pass").value = "";
                document.getElementById("new_pass").value = "";
                document.getElementById("con_new_pass").value = "";
                $("#msg_show").html(result['result']);
            },
            error: function (request, status, error) {

                document.getElementById("old_pass").value = "";
                document.getElementById("new_pass").value = "";
                document.getElementById("con_new_pass").value = "";
                var msg = request.responseJSON['errors']['error'][0]['description'];
                $("#msg_show").html(msg);
            }
        });
    }
}

function authentication() {

    if (userId == '' || userId == null) {
        apprise("Please Login Before Proceed.")
        window.location = "index.html";
    }
    else {
        set_header();
    }
}

function loadContacts(isWcClaim) {
    var dataArr = new Array();

    var obj1 = {
        name: 'Jon Smith',
        contactType: 'Witness',
        address: '3948 Testing Street',
        phone: '555-555-5555',
        email: 'jssmith@testing.com',
        action: ''
    };

    dataArr.push(obj1);

    var obj2 = {
        name: 'Aaron Jones',
        contactType: 'First Aid',
        address: '233 Street',
        phone: '444-444-4444',
        email: 'ajones@example.com',
        action: ''
    };

    dataArr.push(obj2);

    var obj3 = {
        name: 'Sarath Ferguson',
        contactType: 'Defendant\'s Lawyer',
        address: '233 Street',
        phone: '123-123-1234',
        email: 'xyz@example.com',
        action: ''
    };

    dataArr.push(obj3);

    $('#tblContacts').dataTable({
        "bProcessing": true,
        "bPaginate": true,
        "bLengthChange": true,
        "bFilter": false,
        "bSort": true,
        "bInfo": true,
        "bAutoWidth": true,
        "sPaginationType": "full_numbers",
        "iDisplayLength": 10,
        "aaData": dataArr,
        "aoColumns": [
            { "mDataProp": "name" },
            { "mDataProp": "contactType" },
            { "mDataProp": "address" },
            { "mDataProp": "phone" },
            { "mDataProp": "email" },
            {
                "mDataProp": "action",
                "bSearchable": false,
                "bSortable": false,
                "mRender": function (data, type, full) {
                    var str = '';

                    str += '<a style="cursor:pointer;" data-toggle="modal" data-target=".view-contact" onclick="viewContact_Click();"><img src="images/min1.png" alt="" /></a>&nbsp;&nbsp;&nbsp;';
                    if (!isWcClaim)
                        str += '<a style="cursor:pointer;" href="create-contact.html"><img src="images/edit.png" alt=""  /></a>&nbsp;&nbsp;&nbsp;';
                    else
                        str += '<a style="cursor:pointer;" data-toggle="modal" data-target=".add-contact"><img src="images/edit.png" alt=""  /></a>&nbsp;&nbsp;&nbsp;';
                    str += '<a style="cursor:pointer;"><img src="images/min5.png" alt="" /></a>';

                    return str;
                }
            }]
    });
}

function viewContact_Click() {
    $('#viewContact').empty();

    var data = {
        contactType: 'First Aid',
        firstName: 'Jon',
        lastName: 'Smith',
        title: 'XYZ',
        businessEmail: 'business@gmail.com',
        personalEmail: 'personal@gmail.com',
        otherEmail: 'other@gmail.com',
        businessPhone: '111-111-1111',
        homePhone: '222-222-2222',
        cellPhone: '333-333-3333',
        faxNumber: '123-456-789',
        webSite: 'www.claimdesk.com',
        address1: 'address 1',
        address2: 'address 2',
        city: 'California',
        state: 'some state',
        zipCode: '12345',
        whreToContact: 'abc contact',
        whenToContact: 'def contact',
        specialty: 'some specialty',
        adjusterType: 'abc adjuster',
        company: 'new company',
        comAddress1: 'comp address 1',
        comAddress2: 'comp address 2',
        comcity: 'comp city',
        comstate: 'comp state',
        comzipCode: 'comp zipcode',
        phoneNumber: '999-999-9999',
        FEIN: '1234',
        notes: 'There is already the fa-users or the fa-group(alias) that represents something similar but this one would be used for groups instead of contacts which is quite different. A lot of social networks are going to use this if that makes sense. Thanks a lot for the good work'

    };

    $('#jq-tmpl-viewcontact').tmpl(data).appendTo('#viewContact');
}