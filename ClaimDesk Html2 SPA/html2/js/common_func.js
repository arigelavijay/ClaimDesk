function GetXmlHttpObject() {
    var objXMLHttp = null
    if (window.XMLHttpRequest) {
        objXMLHttp = new XMLHttpRequest()
    } else if (window.ActiveXObject) {
        objXMLHttp = new ActiveXObject("Microsoft.XMLHTTP")
    }
    return objXMLHttp
}

//var hostname = "../";
//var hostname = "http://localhost:8080/";
//var hostname = window.location.protocol + "//" + window.location.host + "/";
var hostname = 'http://dev.claimdesk.com/'
//var hostname = 'http://192.168.0.202:8080/';
function FormatPhone(e, input) {
    //alert(input);
    evt = e || window.event; /* firefox uses reserved object e for event */
    var pressedkey = evt.which || evt.keyCode;
    var BlockedKeyCodes = new Array(8, 27, 13, 9, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105); //8 is backspace key 
    var len = BlockedKeyCodes.length;
    var block = false;
    var str = '';
    for (i = 0; i < len; i++) {
        str = BlockedKeyCodes[i].toString();
        if (str.indexOf(pressedkey) >= 0) block = true;
    }
    if (block) return true;

    s = input.value;
    if (s.charAt(0) == '+') return false;
    filteredValues = '"`!@#$%^&*()_+|~-=\QWERT YUIOP{}ASDFGHJKL:ZXCVBNM<>?qwertyuiop[]asdfghjkl;zxcvbnm,./\\\'';
    var i;
    var returnString = '';
    /* Search through string and append to unfiltered values  
       to returnString. */
    for (i = 0; i < s.length; i++) {
        var c = s.charAt(i);
        if ((filteredValues.indexOf(c) == -1) & (returnString.length < 14)) {
            if (returnString.length == 0) returnString += '(';
            if (returnString.length == 4) returnString += ')';
            if (returnString.length == 5) returnString += '-';
            if (returnString.length == 9) returnString += '-';
            returnString += c;
        }
    }
    input.value = returnString;

    return false
}


function isNumberKey(evt) {
    //alert(evt);
    var charCode = (evt.which) ? evt.which : event.keyCode
    //alert(charCode);
    if (charCode > 31 && (charCode < 48 || (charCode > 57 && charCode < 96))) {

        return false;
    }
    return true;
}



function isNumberKeyX(obj) {
    var val = "" + obj.value + "";
    var val1 = val.substring(0, val.length - 1);

    if (IsNumeric(val))
        obj.value = val;
    else
        obj.value = val1;
}

function isNumberKeyXd(obj) {
    var val = "" + obj.value + "";
    var val1 = val.substring(0, val.length - 1);

    if (IsNumericd(val))
        obj.value = val;
    else
        obj.value = val1;
}



function isTime(obj) {
    var val = "" + obj.value + "";
    var val1 = val.substring(0, val.length - 1);

    if (IsNtime(val))
        obj.value = val;
    else
        obj.value = val1;
}




function calqtyamt() {
    var totalval = '';
    var totamt = 0;

    var inputs = document.getElementsByTagName('input');
    var qty_Array = [];
    var rate_Array = [];
    var totamt_Array = [];
    var cnt_Array = 0;

    for (var i = 0; i < inputs.length; i++) {
        if (inputs.item(i).getAttribute('name') == 'qty[]') {
            qty_Array.push(inputs.item(i));
            cnt_Array++;
        }

        if (inputs.item(i).getAttribute('name') == 'cost_per_unit[]') {
            rate_Array.push(inputs.item(i));
        }

        if (inputs.item(i).getAttribute('name') == 'total_cost[]') {
            totamt_Array.push(inputs.item(i));
        }
    }


    for (var h = 0; h < cnt_Array; h++) {
        var priceval = parseFloat(qty_Array[h].value);
        var rateval = parseFloat(rate_Array[h].value);

        if (priceval && rateval) {
            if (priceval < 0 || qty_Array[h].value == '') {
                totamt_Array[h].value = 0;
            } else {
                totalval = priceval * rateval;
                totalval = Math.round(100 * totalval) / 100;
                totamt = totamt + totalval;
                totamt_Array[h].value = totalval;
            }
        } else {
            totamt_Array[h].value = 0;
        }
    }

    //  document.getElementById('total_amount').value = Math.round(100*totamt)/100;
}

function str_pad(input, pad_length, pad_string, pad_type) {

    // *     example 1: str_pad('Kevin van Zonneveld', 30, '-=', 'STR_PAD_LEFT');
    // *     returns 1: '-=-=-=-=-=-Kevin van Zonneveld'
    // *     example 2: str_pad('Kevin van Zonneveld', 30, '-', 'STR_PAD_BOTH');
    // *     returns 2: '------Kevin van Zonneveld-----'
    //str_pad(i,2,'0','STR_PAD_LEFT'), str_pad(i,2,'0','STR_PAD_LEFT')
    var half = '',
        pad_to_go;

    var str_pad_repeater = function (s, len) {
        var collect = '',
            i;

        while (collect.length < len) {
            collect += s;
        }
        collect = collect.substr(0, len);

        return collect;
    };

    input += '';
    pad_string = pad_string !== undefined ? pad_string : ' ';

    if (pad_type !== 'STR_PAD_LEFT' && pad_type !== 'STR_PAD_RIGHT' && pad_type !== 'STR_PAD_BOTH') {
        pad_type = 'STR_PAD_RIGHT';
    }
    if ((pad_to_go = pad_length - input.length) > 0) {
        if (pad_type === 'STR_PAD_LEFT') {
            input = str_pad_repeater(pad_string, pad_to_go) + input;
        } else if (pad_type === 'STR_PAD_RIGHT') {
            input = input + str_pad_repeater(pad_string, pad_to_go);
        } else if (pad_type === 'STR_PAD_BOTH') {
            half = str_pad_repeater(pad_string, Math.ceil(pad_to_go / 2));
            input = half + input + half;
            input = input.substr(0, pad_length);
        }
    }

    return input;
}

function format_number(obj) {
    var num = obj.value;
    var numstr = "" + obj.value + "";
    var lastChar = numstr[num.length - 1];
    var secondlastChar = numstr[num.length - 2];
    if (lastChar != '.') {
        if (!IsNumeric(num)) {
            obj.value = '0.0';
        } else {
            obj.value = Math.round(num * Math.pow(10, 2)) / Math.pow(10, 2);
        }
    } else if (secondlastChar == ".") {
        obj.value = obj.value.substring(0, obj.value.length - 1);
    }
}

function format_integer(obj) {
    var num = obj.value;
    if (!IsNumeric(num)) {
        obj.value = '0';
    } else {
        obj.value = parseInt(obj.value);
    }
}

function dateFormat(el) {
    value = el.value;
    el.value = value.replace(/^([\d]{4})([\d]{2})([\d]{2})$/, "$1-$2-$3");
}

function row_clone(tableID, obj) {
    var table = document.getElementById(tableID);
    var rows = table.rows;
    var index = obj.parentNode.parentNode.rowIndex;
    var tableRow = rows[index];
    var tableRowClone = tableRow.cloneNode(true);
    tableRow.parentNode.insertBefore(tableRowClone, tableRow.nextSibling);
}


function dateDiff(dtFrom, dtTo) {
    var mdy = dtFrom.split('/');
    var dt1 = new Date(mdy[1], mdy[0] - 1, mdy[2]);

    var mdy = dtTo.split('/');
    var dt2 = new Date(mdy[1], mdy[0] - 1, mdy[2]);

    var days = (dt1 - dt2) / (1000 * 60 * 60 * 24);
    return days;
}

Date.prototype.Ymd = function () {

    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based         
    var dd = this.getDate().toString();

    return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]);
};

function isDate(obj) {

    var currVal = obj.value;
    var returnval = true;

    if (currVal == '')
        returnval = false;

    var rxDatePattern = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/; //Declare Regex
    var dtArray = currVal.match(rxDatePattern); // is format OK?

    if (dtArray == null)
        returnval = false;

    //Checks for mm/dd/yyyy format.
    dtMonth = dtArray[3];
    dtDay = dtArray[5];
    dtYear = dtArray[1];

    if (dtMonth < 1 || dtMonth > 12)
        returnval = false;
    else if (dtDay < 1 || dtDay > 31)
        returnval = false;
    else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
        returnval = false;
    else if (dtMonth == 2) {
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay > 29 || (dtDay == 29 && !isleap))
            returnval = false;
    }

    if (!returnval) {
        obj.value = '';
        obj.focus();
    }
}

// to calculate total hours in operation table
function caltothours(hours, no) {
    var hrs = hours;
    var hrsqty = document.getElementById("qty_of_operation" + no).value;
    var tothrs = eval(hrs) * eval(hrsqty);
    document.getElementById("total_hours_required" + no).value = tothrs.toFixed(2);
}

function caltothours2(qty, no) {
    var hrs = document.getElementById("hours_per_operation" + no).value;
    var hrsqty = qty;
    var tothrs = eval(hrs) * eval(hrsqty);
    document.getElementById("total_hours_required" + no).value = tothrs.toFixed(2);
}

function caltothoursUnits(qty, no) {
    var hrs = document.getElementById("vendor_product_price" + no).value;
    var hrsqty = qty;
    var tothrs = eval(hrs) * eval(hrsqty);
    document.getElementById("vendor_product_unitallprice" + no).value = tothrs.toFixed(2);
}

function LTrim(value) {
    var re = /\s*((\S+\s*)*)/;
    return value.replace(re, "$1");
}

function RTrim(value) {
    var re = /((\s*\S+)*)\s*/;
    return value.replace(re, "$1");
}

function trim(value) {
    return LTrim(RTrim(value));
}


function IsNumeric(sText) {
    var ValidChars = "0123456789.";
    var IsNumber = true;
    var Char;

    for (i = 0; i < sText.length && IsNumber == true; i++) {
        Char = sText.charAt(i);
        if (ValidChars.indexOf(Char) == -1) {
            IsNumber = false;
        }
    }
    return IsNumber;
}

function IsNumericd(sText) {
    var ValidChars = "0123456789";
    var IsNumber = true;
    var Char;

    for (i = 0; i < sText.length && IsNumber == true; i++) {
        Char = sText.charAt(i);
        if (ValidChars.indexOf(Char) == -1) {
            IsNumber = false;
        }
    }
    return IsNumber;
}

function IsNtime(sText) {
    var ValidChars = "0123456789:";
    var IsNumber = true;
    var Char;

    for (i = 0; i < sText.length && IsNumber == true; i++) {
        Char = sText.charAt(i);
        if (ValidChars.indexOf(Char) == -1) {
            IsNumber = false;
        }
    }
    return IsNumber;
}


function inArray(needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (haystack[i] == needle) return true;
    }
    return false;
}

function formatssn(obj) {
    var val = obj.value.replace(/\D/g, '');
    var newVal = '';
    if (val.length > 4) {
        this.value = val;
    }
    if ((val.length > 3) && (val.length < 6)) {
        newVal += val.substr(0, 3) + '-';
        val = val.substr(3);
    }
    if (val.length > 5) {
        newVal += val.substr(0, 3) + '-';
        newVal += val.substr(3, 2) + '-';
        val = val.substr(5);
    }
    newVal += val;
    obj.value = newVal.substr(0, 11);
}

function setlist_locname(fieldname, locationid) {
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        url: hostname + "ClaimDeskWeb/services/v1/location/stores",
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {
            var loclist = "<option value=''> None </option>";
            var l = parseInt(locationid);
            for (i = 0; i < result.length; i++) {
                if (parseInt(result[i]['id']) == l)
                    loclist += "<option value='" + result[i]['id'] + "' selected='selected'>" + result[i]['storeID'] + "</option>";
                else
                    loclist += "<option value='" + result[i]['id'] + "'>" + result[i]['storeID'] + "</option>";
            }

            $(fieldname).html(loclist);
        }
    });
}

function setlist_empname(fieldname, empid) {
    var currentemp = sessionStorage.getItem("Empedit");
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        url: hostname + "ClaimDeskWeb/services/v1/employee/getall",
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {            
            var empllist = "<option value=''> None </option>";
            for (i = 0; i < result.length; i++) {
                if (result[i]['id'] == currentemp) { } else {
                    if (result[i]['id'] == empid)
                        empllist += "<option value=" + result[i]['id'] + " selected>" + result[i]['firstName'] + " " + result[i]['lastName'] + "</option>";
                    else
                        empllist += "<option value=" + result[i]['id'] + " >" + result[i]['firstName'] + " " + result[i]['lastName'] + "</option>";
                }
            }
            $(fieldname).html(empllist);
        }
    });
}



function setlist_emptype(fieldname, preval) {
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        url: hostname + "ClaimDeskWeb/services/v1/employee/getemptype",
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {
            var typelist = '';
            for (var key in result) {

                if (result[key] == preval)
                    typelist += "<option value='" + key + "' selected='selected'>" + result[key] + "</option>";
                else
                    typelist += "<option value='" + key + "'>" + result[key] + "</option>";

            }


            $(fieldname).html(typelist);
        }
    });
}






function setsingle_locname(fieldname, locationid) {
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        url: hostname + "ClaimDeskWeb/services/v1/location/" + locationid,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {
            $(fieldname).html(result['storeID']);
        }
    });
}


function setsingle_empname(fieldname, empid) {
    if (empid > 0) {
        $.ajax({
            type: "GET",
            contentType: "application/json;charset=utf-8",
            accept: "application/json",
            dataType: "json",
            cache: false,
            url: hostname + "ClaimDeskWeb/services/v1/employee/" + empid,
            headers: {
                "token": token,
                "userid": userId,
                "locationId": locationId
            },
            success: function (result) {
                $(fieldname).html(result['firstName'] + " " + result['lastName']);
            }
        });
    }
    else {
        $(fieldname).html('NA');
    }
}

function toggle_visibility(val, objid) {
    if (val == true || val == 'Yes') document.getElementById(objid).style.display = 'block';
    if (val == false || val == 'No') document.getElementById(objid).style.display = 'none';

    if (objid == 'file_upload_div') {
        if (val == true || val == 'Yes') {
            $('#receipt_no').addClass('checkblankA');
            $('#date_picker_receipt').addClass('checkblankA');
        }
        else {
            $('#receipt_no').removeClass('checkblankA');
            $('#date_picker_receipt').removeClass('checkblankA');
        }
    }
    else if (objid == 'mat_yes_div') {
        if (val == true || val == 'Yes') {
            $('#y_where').addClass('checkblankB');
            $('#mat_yes_div').css('display', 'block');
        }
        else {
            $('#y_where').removeClass('checkblankB');
            $('#mat_yes_div').css('display', 'none');
        }
    }
    else if (objid == 'car_damage_div') {
        if (val == true || val == 'Yes') {
            $('#d_location,#fault_pro,#est_cost,#damage').addClass('checkblankC');
        }
        else {
            $('#d_location,#fault_pro,#est_cost,#damage').removeClass('checkblankC');
        }
    }
}

//function to show /hide on checkbox click
function toggle_visibility_checkbox() {
    var obj_ill = document.getElementById('check_illness');
    var obj_inj = document.getElementById('check_injury');
    var obj_oth = document.getElementById('check_other');

    var div_ill = document.getElementById('illness_div');
    var div_inj = document.getElementById('injury_div');
    var div_oth = document.getElementById('other_div');

    if (obj_ill.checked == true) {

        div_ill.style.display = 'block';
        div_inj.style.display = 'none';
        div_oth.style.display = 'none';

        $('#date_picker_product,#guest_order,#guest_eat,#place_eat').addClass('checkblankA');
        $('#date_picker_injury').removeClass('checkblankB');
        $('#d_location,#fault_pro,#est_cost,#damage').removeClass('checkblankC');
    }
    else if (obj_inj.checked == true) {

        div_ill.style.display = 'none';
        div_inj.style.display = 'block';
        div_oth.style.display = 'none';

        $('#date_picker_product,#guest_order,#guest_eat,#place_eat').removeClass('checkblankA');
        $('#date_picker_injury').addClass('checkblankB');
        $('#d_location,#fault_pro,#est_cost,#damage').removeClass('checkblankC');
    }
    else if (obj_oth.checked == true) {

        div_ill.style.display = 'none';
        div_inj.style.display = 'none';
        div_oth.style.display = 'block';

        $('#date_picker_product,#guest_order,#guest_eat,#place_eat').removeClass('checkblankA');
        $('#date_picker_injury').removeClass('checkblankB');

        var carDamage = $('#car_damage').val();
        if (carDamage == 'Yes') {
            $('#d_location,#fault_pro,#est_cost,#damage').addClass('checkblankC');
        }
        else {
            $('#d_location,#fault_pro,#est_cost,#damage').removeClass('checkblankC');
        }
    }
}


//Change date format mm/dd/yyyy to yyyy-mm-dd
function mdyToymd(d1) {

    if (d1) {
        var a = d1.split("/");
        var b = a[2];
        b = b + "-";
        b = b + a[0];
        b = b + "-";
        b = b + a[1];
        return b;
    }
}

//Change date format yyyy-mm-dd to mm/dd/yyyy  
function ymdTomdy(d1) {

    if (d1) {
        if ("NA" == d1) {
            return d1;
        }
        var a = d1.split("-");
        var b = a[1];
        b = b + "/";
        b = b + a[2];
        b = b + "/";
        b = b + a[0];
        return b;
    }
}

//Get Location Address and Manager Name Using LocationID 
function getLocAdd(locid) {

    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        url: hostname + "ClaimDeskWeb/services/v1/location/" + locid,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {            
            if ($('#hdn_incLocId').exists()) {
                $('#hdn_incLocId').val(result['id']);

                if (result['id'] == '181') {
                    $('#incident_loc').hide().prev().hide();
                }
            }
            if (typeof result.id != 'undefined') {
                $("#address1").val(result['address']['addressLine1']);
                $("#address2").val(result['address']['addressLine2']);
                $("#city").val(result['address']['city']);
                $("#state").val(result['address']['state']);
                $("#zip").val(result['address']['postalCode']);
                $("#country").val(result['address']['country']);
                //	$("#store_phone").val(result['phone']);
                //	$("#fax").val(result['fax']);
                //getLocPh(locid,"LOC");
                
                $("#gen_man_name").val(result['manager']);
                $("#report_man_name").val(result['manager']);

                if (result.contacts) {
                    for (var i = 0; i < result.contacts.length; i++) {
                        var contact = result.contacts[i];
                        if (contact.type && "WORK_PHONE" == contact.type.name) {
                            $("#store_phone").val(contact.value);
                        }
                        if (contact.type && "FAX" == contact.type.name) {
                            $("#store_phone").val(contact.value);
                        }
                    }
                }
            }
        }
    });
}

function getLocPh(id, type) {


    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        global: false,
        async: false,

        url: hostname + "ClaimDeskWeb/services/v1/code/contact/" + id + "/" + type,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {
            //	for (i = 0; i < result.length; i++) {

            if (result[0] && result[0]['contact_resourse_id'] == "WORK_PHONE") {
                $("#store_phone").val(result[0]['value']);
            }
            if (result[1] && result[1]['contact_resourse_id'] == "FAX") {
                $("#fax").val(result[1]['value']);
            }

            //	}
        }
    });


}

var autocompleteMMDDYYYYDateFormat = function (str) {
    str = str.trim();
    var matches, year,
            looksLike_MM_slash_DD = /^(\d\d\/)?\d\d$/,
            looksLike_MM_slash_D_slash = /^(\d\d\/)?(\d\/)$/,
            looksLike_MM_slash_DD_slash_DD = /^(\d\d\/\d\d\/)(\d\d)$/;

    if (looksLike_MM_slash_DD.test(str)) {
        str += "/";
    } else if (looksLike_MM_slash_D_slash.test(str)) {
        str = str.replace(looksLike_MM_slash_D_slash, "$10$2");
    } else if (looksLike_MM_slash_DD_slash_DD.test(str)) {
        matches = str.match(looksLike_MM_slash_DD_slash_DD);
        year = Number(matches[2]) < 20 ? "20" : "19";
        str = String(matches[1]) + year + String(matches[2]);
    }
    return str;
};

function set_codes_list(code, fieldname, preval, locId) {
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        accept: "application/json",
        dataType: "json",
        url: hostname + "ClaimDeskWeb/services/v1/code/" + code + "/" + locId,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {
            var deptlist = "<option value=''> None </option>";

            for (var key in result) {
                {
                    if (result[key]['description'] == preval)
                        deptlist += "<option value='" + result[key]['description'] + "' selected='selected'>" + result[key]['description'] + "</option>";
                    else
                        deptlist += "<option value='" + result[key]['description'] + "'>" + result[key]['description'] + "</option>";
                }
            }
            $(fieldname).html(deptlist);
        }
    });
}

function checkblank(val) {
    if (val && !IsNumericd(val) && val.trim() != '') return val;
    else if (val && (IsNumericd(val) || IsNumeric(val))) return checkzero(val)
    else return 'NA';
}

function check_blank(val) {
    if (val && !IsNumericd(val) && val.trim() != '') return val;
    else if (val && (IsNumericd(val) || IsNumeric(val))) return checkzero(val)
    else return '';
}

function checkzero(val) {
    if (val && val != '') return val;
    else return '0';
}

function checkdate(val) {
    if (val && val != '') return val;
    else return '00/00/0000';
}

function checktime(val) {
    if (val && val != '') return val;
    else return '00:00';
}

function downloadImg(img) {
    var filename = encodeURI(img);
    $.ajax({
        url: hostname + "ClaimDeskWeb/services/v1/incident/downloadFile/" + filename,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        type: 'GET',
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (returndata) {

        }
    });
}

function deleteFile(img) {
    var filename = encodeURI(img);
    $.ajax({
        url: hostname + "ClaimDeskWeb/services/v1/incident/deleteFile/" + filename,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        type: 'DELETE',
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (returndata) {

        }
    });
}

function downloadFile(id, folderid, service, filename) {
    //show img
       var url = hostname + "ClaimDeskWeb/services/v1/" + service;
    if (id && id > 0) {
        url += "/downloadFile/" + id + "/";
    }
    else {
        url += "/downloadTempFile/" + folderid + "/";
    }
    var a1 = document.createElement('a');
    document.getElementById("pr_img").style.display = "block";
    var xhr = new XMLHttpRequest;
    var encodedfilename = encodeURIComponent(filename.trim());

    xhr.open("GET", url + encodedfilename);
    xhr.addEventListener("load", function (e) {
        if (typeof a1.download != "undefined") {
            document.getElementById("pr_img").style.display = "none";
            var data = toBinaryString(this.responseText);
            var url = e.currentTarget.responseURL;
            var pos = url.length;
            var maxLength = url.length;
            var imageName = url.substring(pos, maxLength);
            a = document.createElement('a');

            a.setAttribute("href", "data:application/octet-stream;base64, " + btoa(data));
            a.setAttribute("download", filename.trim());

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
        else {

            document.getElementById("pr_img").style.display = "none";
            var data = toBinaryString(this.responseText);
            var con_type = xhr.getResponseHeader("Content-Type");
            var data1 = "data:" + con_type + ";base64," + btoa(data);
            var str_filename = filename.trim();
            download(data1, str_filename, con_type);
        }
    }, false);

    xhr.setRequestHeader("token", token);
    xhr.setRequestHeader("userid", userId);
    xhr.setRequestHeader("locationId", locationId);
    xhr.overrideMimeType("application/octet-stream; charset=x-user-defined;");
    xhr.send(null);

}

function downloadFiles(str1, str2) {
    //show img
    var a1 = document.createElement('a');
    document.getElementById("pr_img").style.display = "block";
    var xhr = new XMLHttpRequest;
    var filename = encodeURI(str2.trim());
    xhr.open("GET", hostname + "ClaimDeskWeb/services/v1/" + str1 + "/downloadFile/" + filename);
    xhr.addEventListener("load", function (e) {
        if (typeof a1.download != "undefined") {
            document.getElementById("pr_img").style.display = "none";
            var data = toBinaryString(this.responseText);
            var url = e.currentTarget.responseURL;
            var pos = (hostname + "ClaimDeskWeb/services/v1/" + str1 + "/downloadFile/").length;
            var maxLength = url.length;
            var imageName = url.substring(pos, maxLength);
            a = document.createElement('a');

            a.setAttribute("href", "data:application/octet-stream;base64, " + btoa(data));
            a.setAttribute("download", str2.trim());

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
        else {

            document.getElementById("pr_img").style.display = "none";
            var data = toBinaryString(this.responseText);
            var con_type = xhr.getResponseHeader("Content-Type");
            var data1 = "data:" + con_type + ";base64," + btoa(data);
            download(data1, str2, con_type);
        }
    }, false);

    xhr.setRequestHeader("token", token);
    xhr.setRequestHeader("userid", userId);
    xhr.setRequestHeader("locationId", locationId);
    xhr.overrideMimeType("application/octet-stream; charset=x-user-defined;");
    xhr.send(null);

}

function toBinaryString(data) {
    var ret = [];
    var len = data.length;
    var byte;
    for (var i = 0; i < len; i++) {
        byte = (data.charCodeAt(i) & 0xFF) >>> 0;
        ret.push(String.fromCharCode(byte));
    }

    return ret.join('');
}

function downloadLogo(str1, str2) {
    if ("undefined" == str2) {
        return;
    }
    var xhr = new XMLHttpRequest;
    var filename = encodeURI(str2.trim());
    xhr.open("GET", hostname + "ClaimDeskWeb/services/v1/location/downloadFile/" + str1 + "/" + filename);
    xhr.addEventListener("load", function () {
        var data = toBinaryString(this.responseText);
        data = "data:application/octet-stream;base64,  " + btoa(data);
        var image = new Image();
        image.src = data;
        var linkstr = "<img width='50' height='50' alt='img' src='" + data + "'/>";
        $(".poloRight").html(linkstr);

    }, false);

    xhr.setRequestHeader("token", token);
    xhr.setRequestHeader("userid", userId);
    xhr.setRequestHeader("locationId", locationId);
    xhr.overrideMimeType("application/octet-stream; charset=x-user-defined;");
    xhr.send(null);

}



function uploadFile(service, id, folderid, file, formData, callback) {

    var filename = encodeURIComponent(file);
    var xhr = new XMLHttpRequest;
    var path = "/uploadFile/";
    if (id && id > 0) {
        var path = "/uploadFile/" + id + "/";
    }
    else {
        if (!folderid || folderid == "undefined") {
            folderid = 0;
        }
        var path = "/uploadTempFile/" + folderid + "/";
    }


    xhr.open("POST", hostname + "ClaimDeskWeb/services/v1/" + service + path + filename);
    xhr.addEventListener("load", function (e) {

        if (this.status == 200) {
            callback(null, JSON.parse(this.response));
        }
        else {
            callback("error");
        }

    }, false);

    xhr.setRequestHeader("token", token);
    xhr.setRequestHeader("userid", userId);
    xhr.setRequestHeader("locationId", locationId);
    xhr.overrideMimeType("application/octet-stream; charset=x-user-defined;");
    xhr.setRequestHeader("accept", "application/json")
    xhr.send(formData);
}

function checknull(val) {
    if (val && !IsNumericd(val) && val.trim() != '') return val;
    else if (val && (IsNumericd(val) || IsNumeric(val))) return checkzero(val)
    else return '';
}

function showloading() {
    document.getElementById("pr_img").style.display = "inline-block";
}

function btn_add_inc_attatchment(incident_id, type) {
    var incLocId = '';
    if ($('#claim_id').exists() && type == 'GL') {
        var claim_id = $('#claim_id').html();
        incLocId = $('#img_' + claim_id)[0].getAttribute('data-incident-locid');
    }
    else if ($('#WC_claim_id').exists() && type == 'WC') {
        var claim_id = $('#WC_claim_id').html();
        incLocId = $('#img_' + claim_id)[0].getAttribute('data-incident-locid');
    }
    else if (typeof type == 'undefined') {
        incLocId = $('#img_' + incident_id)[0].getAttribute('data-incident-locid');
    }

    $('#view').jqExLoad('views/edit-incident.html', function () {
        $('#hdn_incidentId').val(incident_id);
        $('#hdn_is_Add_inc_Attatchment').val(true);
        $('#hdn_incLocId').val(incLocId);
        createIncPageLoad(incident_id);
    }).hide().fadeIn();
}

function btn_add_claim_attatchment(claim_id, type) {

    if (type == 'WC') {
        var incLocId = $('#img_' + claim_id)[0].getAttribute('data-incident-locid');

        $('#view').jqExLoad('views/wc.html', function () {
            dashboardloadOnInit('', incLocId);
            $('#hdn_Claim_Id').val(claim_id);
            $('#hdn_is_Add_claim_Attatchment').val(true);
            $('#hdn_incLocId').val(incLocId);
        }).hide().fadeIn();
    }
    else if (type == 'GL') {
        $('#view').jqExLoad('views/edit-claim.html', function () {
            $('#hdn_Claim_Id').val(claim_id);
            $('#hdn_is_Add_claim_Attatchment').val(true);
            createEditClaimPageLoad(claim_id);
        }).hide().fadeIn();
    }
}



function getWcDataByClaimId(claimId) {
    var def = $.Deferred();
    $.ajax({
        type: 'GET',
        contentType: 'application/json;charset=utf-8',
        accept: 'application/json',
        dataType: 'json',
        url: hostname + 'ClaimDeskWeb/services/v1/report/' + claimId,
        headers: {
            'token': token,
            'userid': userId,
            'locationId': locationId
        },
        success: function (result) {

            def.resolve(result);
        },
        error: function (err) {
            def.reject('error');
        },
        failure: function (err) {
            def.reject('failed');
        }
    });
    return def.promise();
}

function getTypeOfClaim(claim_id, type) {
    var html = '';
    if (type == 'WC')
        html += "<li><img src='images/typeWC.gif' width='16' height='19' alt='img' /></li>"
    else
        html += "<li><img src='images/typeGL.gif' width='16' height='19' alt='img' /></li>"

    return html;
}

function getJspPageContent(incidentLocId) {
    var def = $.Deferred();
    var url = '../jsp/report.jsp?location=' + incidentLocId + '&Type=WC_VIEW';

    $('#viewWcInfo').load(url, function (request, response, xhr) {
        def.resolve();
        if (status == "error") {
            showError("There is an error in loading the page:", xhr.status, xhr.statusText);
        }
        else {
            return false;
        }
    });
    //$('#viewWcInfo').append('<li id="diaryNoteView"></li>');
    $('<li id="diaryNoteView"></li>').appendTo('#viewWcInfo');
    return def.promise();
}

function getIncidentDetails(incidentId) {
    var def = $.Deferred();
    $.ajax({
        type: 'GET',
        contentType: 'application/json;charset=utf-8',
        accept: 'application/json',
        dataType: 'json',
        cache: false,
        url: hostname + 'ClaimDeskWeb/services/v1/incident/' + incidentId,
        headers: {
            'token': token,
            'userid': userId,
            'locationId': locationId
        },
        success: function (result) {
            def.resolve(result);
        },
        error: function (error) {
            def.reject(error);
        }
    });
    return def.promise();
}

/*-- WC specific */
function download_wc_ClaimFile(currentClaim, filename) {

    //var currentClaim = sessionStorage.getItem("claimEdit");
    //if (!currentClaim) {
    //    currentClaim = sessionStorage.getItem('claim_id');
    //}
    downloadFile_wc(currentClaim, 0, "claim", filename);
}

function downloadFile_wc(id, folderid, service, filename) {
    var url = hostname + "ClaimDeskWeb/services/v1/" + service;
    if (id && id > 0) {
        url += "/downloadFile/" + id + "/";
    }
    else {
        url += "/downloadTempFile/" + folderid + "/";
    }
    var a1 = document.createElement('a');
    document.getElementById("pr_img").style.display = "block";
    var xhr = new XMLHttpRequest;
    var encodedfilename = encodeURIComponent(filename.trim());

    xhr.open("GET", url + encodedfilename);
    xhr.addEventListener("load", function (e) {

        if (typeof a1.download != "undefined") {
            document.getElementById("pr_img").style.display = "none";
            var data = toBinaryString(this.responseText);
            var url = e.currentTarget.responseURL;
            var pos = url.length;
            var maxLength = url.length;
            var imageName = url.substring(pos, maxLength);
            a = document.createElement('a');

            a.setAttribute("href", "data:application/octet-stream;base64, " + btoa(data));
            a.setAttribute("download", filename.trim());

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
        else {

            document.getElementById("pr_img").style.display = "none";
            var data = toBinaryString(this.responseText);
            var con_type = xhr.getResponseHeader("Content-Type");
            var data1 = "data:" + con_type + ";base64," + btoa(data);
            download(data1, filename, con_type);
        }
    }, false);

    xhr.setRequestHeader("token", token);
    xhr.setRequestHeader("userid", userId);
    xhr.setRequestHeader("locationId", locationId);
    xhr.overrideMimeType("application/octet-stream; charset=x-user-defined;");
    xhr.send(null);
}

function CheckjQuery(root) {
    if (!window.jQuery) {
        location.href = root + 'index.html';
    }
}

function localToUtc(str) {
    var dt = new Date(str);    
    return moment.utc(dt).format('MM/DD/YYYY hh:mm A');
}

function UtcToLocal(str) {    
    var localTime = moment.utc(str).toDate();
    localTime = moment(localTime).format('MM/DD/YYYY hh:mm A');
    return localTime;     
}

function getDate(str) {
   return moment(str).format('MM/DD/YYYY');
}

function getTime(str) {
    return moment(str).format('hh:mm A');
}

function appendTimeNConvLoc(str) {    
    var localTime = moment.utc(str + ' ' + '06:30 PM').toDate();
    localTime = moment(localTime).format('MM/DD/YYYY hh:mm A');
    return moment(localTime).format('MM/DD/YYYY');    
}
/*-- WC specific */