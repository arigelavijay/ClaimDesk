
// login session variables
var userId = sessionStorage.getItem("userid");
var token = sessionStorage.getItem("token");
var locationId = sessionStorage.getItem("locationId");
var firstName = sessionStorage.getItem("firstName");
var lastName = sessionStorage.getItem("lastName");
var sellocationid = '';
var selmanagerid = '';

function dashboardloadOnInit(incidentId, incLocId) {
    //alert("What is incident Location id "+sessionStorage.getItem('incLocId') );
    var url = "../jsp/report.jsp?location=" + incLocId + "&Type=WC";
    $('#hdn_IncidentId').val(incidentId);
    $('#hdn_incLocId').val(incLocId);

    /*
    $.get(url, function (html) {
        console.log(html);
    });
    */
    $('#page_content').load(url, function (request, response, xhr) {
        initialiseComponents();
        if (status == "error") {
            showError("There is an error in loading the page:", xhr.status, xhr.statusText);
        }
        else {
            return false;
        }
    });
}

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

var tabsCount = -1;
var tabs;
function initialiseComponents() {
    tabs = $('.tab-content .tab-pane');
    tabsCount = tabs.length;

    $('a[data-target="#' + tabs[0].id + '"]').tab('show');
    $('#a-' + tabs[0].id).addClass('activeMy').parent().removeClass('disabledCss').addClass('newActive');
    $('.datepicker').addClass('Wcdatepicker').removeClass('datepicker');
    $('.Wcdatepicker').datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: '-100:+0',
        addSliderAccess: true
    });
    $('.dtFCss').datepicker({

    });
    $('.dtPCss').datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: '-100:+0',
        addSliderAccess: true,
        maxDate: new Date()
    });
    //$('.modal-open').css('padding-right', '0px');
    $('.Wcdatepicker,.dtFCss,.dtPCss').bind('cut copy paste', function (e) {
        e.preventDefault();
    });
    //$('.datepicker').on('blur', function (e) { $(this).datepicker('hide'); });
    $('.spaceCss').parent().removeClass('col-sm-4');
    $('.trtMedCliCss,.iniTrtCss').parent().hide();

    $('.timepickerCss').mask("Hh:Mm Pp");
    $('.ssnCss').mask("999-99-9999", { placeholder: '_' });
    $('.PhoneCss').mask('(999)-999-9999', { placeholder: '_' });
    $(".zipCss").mask("99999?-9999", { placeholder: "_" });
    $(".faxCss").mask("(999)-999-9999", { placeholder: "_" });

    $('.timepickerCss').timepicker({
        addSliderAccess: false,
        timeFormat: "hh:mm tt",
        sliderAccessArgs: { touchonly: false }
    });

    $('.IntCss').on('keypress', function (evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;

        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    });

    $('.radioCss').parent().removeClass('col-sm-4').addClass('col-sm-12');
    $('#incOnly').prop('checked', true);
    if ($('#emptype').length > 0) {
        setlist_emptype('#emptype', '');
    }

    //$('#unitType').attr('disabled', 'disabled');
    if ($('#unitType').length > 0) {
        setlist_locname('#unitType', $('#hdn_incLocId').val());
        getOrgDetails($('#hdn_incLocId').val());
    }

    $("#effectiveDate").datepicker({
        numberOfMonths: 1,
        onSelect: function (selected) {
            var dt = new Date(selected);
            dt.setDate(dt.getDate() + 1);
            $("#expirationDate").datepicker("option", "minDate", dt);
        }
    });
    $("#expirationDate").datepicker({
        numberOfMonths: 1,
        onSelect: function (selected) {
            var dt = new Date(selected);
            dt.setDate(dt.getDate() - 1);
            $("#effectiveDate").datepicker("option", "maxDate", dt);
        }
    });



    //$.when(promiseAttachments, promiseDiaryNotes).done(function (data1, data2) {
    LoadDiaryNoteComponents();
    /* -- for getting session data to controls & nav bottom buttom bar start -- */
    $(tabs).each(function (i, item) {
        getNavBtnBar(item.id, i);
        //getTabDataFromSession(item.id, i);
    });
    /* -- for getting session data to controls start -- */
    var claimEditWC = $('#hdn_Claim_Id').val();
    /* -- filling select tag data start -- */
    var selectArr = $('.selectCss');
    $(selectArr).each(function (i, item) {
        var dataUrl = $('#' + item.id)[0].getAttribute('data-url');        
        var paramRequired = $('#' + item.id)[0].getAttribute('data-param') == 'true' ? true : false;
        if (paramRequired) {
            dataUrl = dataUrl + $('#hdn_incLocId').val(); //sessionStorage.getItem($('#' + item.id)[0].getAttribute('data-paramtype'));            
            BindSelectTagData2('#' + item.id, dataUrl);
        }
        else {
            BindSelectTagData('#' + item.id, dataUrl);
        }
    });
    /* -- filling select tag data end -- */
    /* -- populating controls with edit claim data start -- */
    if (claimEditWC != null && claimEditWC != '') {
        var promise = getWcDataByClaimId(claimEditWC);
        var diaryPromise = getWcClaimDiaryNote(claimEditWC);
        $.when(promise, diaryPromise).done(function (result, diaryNotes) {
            $('#claim_button').html('<input  class="rightAlign buttonNext" id="btn_Create" type="button" onClick="btn_AddNote_OnClick(' + claimEditWC + ')" value="Add Note"><br><br>');
            $('#hdn_Claim_Id').val(claimEditWC);
            $('#hdn_Diary_Note').val(-1);
            if (diaryNotes != null && diaryNotes.length > 0) {
                var tArray = new Array();
                for (var m = 0; m < diaryNotes.length; m++) {
                    tArray.push(Generate_tbl_object(diaryNotes[m]));
                }
                New_Diary_Table(tArray, claimEditWC);
                sessionStorage.setItem('SsnTblData', JSON.stringify(tArray));
            }
            //$('.tabRight').hide();
            $('#createWc').css('display', 'none');
            $('#page_content ul li').removeClass('disabledCss');
            var dataKeys = Object.keys(result.report);
            var metadata = result.report.metadata;
            var metakeys = Object.keys(metadata);

            for (var i = 0; i < metakeys.length; i++) {
                var s = document.getElementById(metakeys[i]);
                if (s) {
                    s.value = metadata[metakeys[i]];
                }
                else {
                    alert("Invalid element " + metakeys[i]);
                }
            }

            for (var i = 0; i < dataKeys.length; i++) {
                for (var j = 0; j < tabs.length; j++) {
                    if (dataKeys[i] == tabs[j].id) {
                        BindDataToControls(dataKeys[i], i, result.report[dataKeys[i]]);
                        break;
                    }
                }

                if (i == (dataKeys.length - 1)) {
                    setTimeout(function () {
                        if (jobClassCodeVal != '') {
                            $('#jobclass').val(jobClassCodeVal);
                        }
                    }, 500);
                }
            }

            $('#top_inc_id').html('&nbsp;&nbsp;' + metadata.incidentId);
            $('#top_claim_id').html('&nbsp;&nbsp;' + claimEditWC);

            var isCreateDiary = $('#hdn_CreatediaryNotes').val() == 'true' ? true : false;
            if (isCreateDiary) {
                $('.divider a[data-target="#diaryNotes"]').tab('show');
                $('#hdn_CreatediaryNotes').val(false);
                removeAddGreenClass(tabs[0].id, 'diaryNotes');
                btn_AddNote_OnClick(claimEditWC);
            }

            var isAttatchments = $('#hdn_is_Add_claim_Attatchment').val() == 'true' ? true : false;
            if (isAttatchments) {
                $('.divider a[data-target="#attatchments"]').tab('show');
                $('#hdn_is_Add_claim_Attatchment').val(false);
                removeAddGreenClass(tabs[0].id, 'attatchments');
            }

            if (result.report.filename != null && result.report.filename != 'undefined' && result.report.filename.length > 0) {
                for (var file = 0; file < result.report.filename.length; file++) {
                    addRow_wc_receiptlist(result.report.filename[file].fileName, claimEditWC);
                }
            }

        });
    }
    else {
        $('#top_inc_id').html('&nbsp;&nbsp;' + $('#hdn_IncidentId').val());
        $('#top_claim_id').html('&nbsp;&nbsp;' + '').hide().prev().hide();
        setTimeout(function () {
            $(tabs).each(function (i, item) {
                getNavBtnBar(item.id, i);
                getTabDataFromSession(item.id, i);
            });
        }, 500);
    }
    /* -- populating controls with edit claim data start -- */
    //});

    $('.empCss').on('change', function () {
        if (this.value != null && this.value != '') {
            var promise = GetEmployeeDetailsByID(this.value);
            $.when(promise).done(function (data) {
                BindData(Object.keys(data), data);
                BindData(Object.keys(data.address), data.address);
            });
        }
    });

    $('#unitType').on('change', function () {
        if (this.value != null && this.value != '') {
            getOrgDetails(this.value);
        }
    });

    $('#trtMedCli').on('change', function () {
        if (this.value == 'Yes') {
            $('.trtMedCliCss').parent().fadeIn();
        }
        else {
            $('.trtMedCliCss').parent().fadeOut();
        }
    });

    $('#initialTreatment').on('change', function () {
        if (this.value == 'FirstAid') {
            $('.iniTrtCss').parent().fadeIn();
        }
        else {
            $('.iniTrtCss').parent().fadeOut();
        }
    });
}

function getJobClassCode(state) {
	
    var Url = 'ClaimDeskWeb/services/v1/code/C_JOBCLASS_' + state + '/' + locationId;

    BindSelectTagData2('#jobclass', Url);

    //debugger;

    //$.ajax({

    //    type: "GET",
    //    contentType: "application/json;charset=utf-8",
    //    accept: "application/json",
    //    dataType: "json",
    //    url: hostname + Url,
    //    headers: {

    //        "token": token,
    //        "userid": userId,
    //        "locationId": locationId

    //    },
    //    success: function (result) {

    //        debugger;

    //    }

    //});

}

function getOrgDetails(locid) {
    debugger;
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
            var addressKeys = Object.keys(result.address);
            for (var i = 0; i < addressKeys.length; i++) {
                $('#u' + addressKeys[i]).val(result.address[addressKeys[i]]);
            }

            if (result.contacts) {
                for (var i = 0; i < result.contacts.length; i++) {
                    var contact = result.contacts[i];
                    if (contact.type && "WORK_PHONE" == contact.type.name) {
                        $("#ustore_phone").val(contact.value);
                    }
                    if (contact.type && "FAX" == contact.type.name) {
                        $("#ustore_fax").val(contact.value);
                    }
                }
            }
            $('#umanager').val(result.manager);
            $('#companyName').val(result.storeID);
            $('#unitType').attr('disabled', 'disabled');
        }
    });
}


function BindSelectTagData(cntrlId, Url) {

    $.ajax({
        type: 'GET',
        contentType: 'application/json;charset=utf-8',
        accept: 'application/json',
        dataType: 'json',
        cache: false,
        url: hostname + Url,
        headers: {
            'token': token,
            'userid': userId,
            'locationId': locationId
        },
        success: function (employees) {            
            $(cntrlId).empty();
            if (employees != null) {
                $(cntrlId).append('<option value=""></option>');
                $.each(employees, function (i, emp) {
                    $(cntrlId).append('<option value="' + emp.id + '">' + emp.firstName + ' ' + emp.lastName + '</option>');
                });
            }
        }
    });
}

function BindSelectTagData2(cntrlId, Url) {

    $.ajax({
        type: 'GET',
        contentType: 'application/json;charset=utf-8',
        accept: 'application/json',
        dataType: 'json',
        cache: false,
        url: hostname + Url,
        headers: {
            'token': token,
            'userid': userId,
            'locationId': locationId
        },
        success: function (result) {

            $(cntrlId).empty();
            if (result != null) {
                $(cntrlId).append('<option value=""></option>');
                $.each(result, function (i, item) {
                    $(cntrlId).append('<option value="' + item.code + '">' + item.description + '</option>');
                });
            }
        }
    });
}

function BindData(dataKeys, data) {
    for (var i = 0; i < dataKeys.length; i++) {
        var item = $('#' + dataKeys[i]);
        if (item.length > 0) {
            if (item[0].type == 'text' || item[0].type == 'select-one') {
                $('#' + item[0].id).val(data[dataKeys[i]]).focus();
            }
        }
        else {
            var item2 = $('input[name=' + dataKeys[i] + ']');
            if (item2.length > 0) {
                if (item2[0].type == 'radio') {
                    $('input[name=' + item2[0].name + '][value="' + data[dataKeys[i]] + '"]').prop("checked", true);
                }
            }
        }
    }
    $('#empid').focus();
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


function GetEmployeeDetailsByID(empId) {
    var def = $.Deferred();
    $.ajax({
        type: 'GET',
        contentType: 'application/json;charset=utf-8',
        accept: 'application/json',
        dataType: 'json',
        cache: false,
        url: hostname + 'ClaimDeskWeb/services/v1/employee/' + empId,
        headers: {
            'token': token,
            'userid': userId,
            'locationId': locationId
        },
        success: function (empDetails) {
            def.resolve(empDetails);
        }
    });
    return def.promise();
}



function getTabTemplate(tabId, Url) {
    var def = $.Deferred();
    if ($(tabId).length > 0) {
        $.get(Url, function (content) {
            $(tabId).html(content);
            def.resolve('Success');
        });
    }
    else {
        def.resolve('Failed');
    }
    return def.promise();
}

function RemoveSpaces(str) {
    if (str != null && str != '')
        return str.replace(/\s+/g, '');

    return str;
}
var jobClassCodeVal = '';
function BindDataToControls(tabId, i, data) {
    var elementArr = $('#' + tabId + ' .CntrlCss');
    $(elementArr).each(function () {
        var type = this.type;
        if (type == 'checkbox' || type == 'radio') {
            try {
                if (type == 'radio') {
                    $('input[name=' + this.name + '][data-value=' + RemoveSpaces(data[this.name]) + ']').prop('checked', 'checked');
                }
                else {
                    if ($(this).is(':checked'))
                        $(this).val(data[this.id]);
                }
            }
            catch (err) {

            }
        }
        else if (type == 'select-one') {
            $('#' + this.id + ' option[value=' + data[this.id] + ']').prop('selected', 'selected');
            if (this.id == 'state') {
                getJobClassCode(data[this.id]);
            }
            else if (this.id == 'jobclass') {
                jobClassCodeVal = data[this.id];
            }
            else if (this.id == 'trtMedCli') {
                if (data[this.id] == 'Yes') {
                    $('.trtMedCliCss').parent().fadeIn();
                }
                else {
                    $('.trtMedCliCss').parent().fadeOut();
                }
            }
            else if (this.id == 'initialTreatment') {
                if (data[this.id] == 'FirstAid') {
                    $('.iniTrtCss').parent().fadeIn();
                }
                else {
                    $('.iniTrtCss').parent().fadeOut();
                }
            }
        }
        else if (type != 'button' && type != 'submit') {
            $(this).val(data[this.id]);
        }
    });
}

function setSelectedIndex(s, valsearch) {
    // Loop through all the items in drop down list
    for (i = 0; i < s.options.length; i++) {
        if (s.options[i].value == valsearch) {
            // Item is found. Set its property and exit
            s.options[i].selected = true;
            break;
        }
    }
    return;
}

function getTabDataFromSession(tabId, i) {
    var elementArr = $('#' + tabId + ' .CntrlCss');
    $(elementArr).each(function () {
        var type = this.type;
        if (type == 'checkbox' || type == 'radio') {
            if (type == 'radio') {
                $('input[name=' + this.name + '][data-value=' + RemoveSpaces(sessionStorage.getItem('WFWC_' + this.name)) + ']').prop('checked', 'checked');
            }
            else {
                if ($(this).is(':checked'))
                    $(this).val(sessionStorage.getItem('WFWC_' + this.name));
            }
        }
        else if (type == 'select-one') {
            if (sessionStorage.getItem('WFWC_' + this.name) != null && sessionStorage.getItem('WFWC_' + this.name) != '' && typeof sessionStorage.getItem('WFWC_' + this.name) != 'undefined') {
                $('#' + this.id + ' option[value=' + sessionStorage.getItem('WFWC_' + this.name) + ']').prop('selected', 'selected');
            }
        }
        else if (type != 'button' && type != 'submit') {
            $(this).val(sessionStorage.getItem('WFWC_' + this.name));
        }
    });
}

function getNavBtnBar(tabId, i) {
    var html = '';
    if (i == 0) {
        html += '<div class="col-sm-4">';
        html += '<button type="button" onclick="btnCancel(' + i + ', \'' + tabId + '\');" class="buttonNext pull-left">Cancel</button>';
        html += '</div>';

        html += '<div class="col-sm-4">&nbsp;</div>';

        html += '<div class="col-sm-4">';
        html += '<button type="button" onclick="btnSave(' + i + ', \'' + tabId + '\');" class="buttonNext pull-right">Save</button>';
        html += '</div>';

        $('#nav_' + tabId).html(html);
    }
    else {
        html += '<div class="col-sm-4">';
        html += '<button type="button" onclick="btnBack(' + i + ', \'' + tabId + '\');" class="buttonNext pull-left">Back</button>';
        html += '</div>';

        html += '<div class="col-sm-4">&nbsp;</div>';

        html += '<div class="col-sm-4">';
        html += '<button type="button" onclick="btnSave(' + i + ', \'' + tabId + '\');" class="buttonNext pull-right">Save</button>';
        html += '<button type="button" onclick="btnCancel(' + i + ', \'' + tabId + '\');" class="buttonNext pull-right" style="margin-right:10px;">Cancel</button>';
        html += '</div>';

        $('#nav_' + tabId).html(html);
    }
}

function btnCancel(i, tab) {
    SaveTabDataToSession(tab);
    $('#view').jqExLoad('views/claims-list.html').hide().fadeIn();
    $('.navbar-collapse li a').removeClass('select');
    $('#claimId').addClass('select');
}

function btnSave(i, tab) {
    if (i != (tabsCount - 1)) {
        if ($('#frm_' + tab).valid()) {
            SaveTabDataToSession(tab);
            $('a[data-target="#' + $('#' + tab).next('.tab-pane').prop('id') + '"]').tab('show');
            var nextTab = $('#' + tab).next('.tab-pane').prop('id');
            $('#li-' + nextTab).removeClass('disabledCss');
            removeAddGreenClass(tab, nextTab);
            $('html,body').animate({ scrollTop: 100 }, 800);
        }
        else {
            var errObj = $('#frm_' + tab).validate();
            var cntrlPositions = $('#' + errObj.errorList[0].element.id).offset();
            $('html,body').animate({ scrollTop: (cntrlPositions.top - 30) }, 800);
        }
    }
    else {
        if ($('#frm_' + tab).valid()) {
            FinalCheckOfAllTabs();
        }
        else {
            var errObj = $('#frm_' + tab).validate();
            var cntrlPositions = $('#' + errObj.errorList[0].element.id).offset();
            $('html,body').animate({ scrollTop: (cntrlPositions.top - 30) }, 800);
        }
    }
}

function FinalCheckOfAllTabs() {
    var isError = false;
    for (var i = 0; i < tabs.length; i++) {
        if ($('#frm_' + tabs[i].id).validate().errorList.length <= 0) {

        }
        else {
            isError = true;
            var errObj = $('#frm_' + tabs[i].id).validate();
            var tab_id = $('#' + errObj.errorList[0].element.id).closest('.tab-pane').prop('id');

            $('a[data-target="#' + tab_id + '"]').tab('show');
            break;
        }
    }

    if (!isError) {
        save();
    }
}

function btnBack(i, tab) {
    var tabId = $('#page_content ul li.active')[0].id.split('-')[1];
    var frmId = '#frm_' + tabId;
    if ($(frmId).valid()) {
        $('a[data-target="#' + $('#' + tab).prev('.tab-pane').prop('id') + '"]').tab('show');
        removeAddGreenClass(tab, $('#' + tab).prev('.tab-pane').prop('id'));
        $('html,body').animate({ scrollTop: 100 }, 800);
    }
    else {
        var errObj = $(frmId).validate();
        var cntrlPositions = $('#' + errObj.errorList[0].element.id).offset();
        $('html,body').animate({ scrollTop: (cntrlPositions.top - 30) }, 800);
        event.preventDefault();
    }

}

function SaveTabDataToSession(tabId) {
    var claimEditWc = $('#hdn_Claim_Id').val();
    if (claimEditWc != null && claimEditWc != '')
        return;
    var elementArr = $('#' + tabId + ' .CntrlCss');
    $(elementArr).each(function () {
        var type = this.type;
        if (type == 'checkbox' || type == 'radio') {
            if (type == 'radio') {
                if ($(this).is(':checked'))
                    sessionStorage.setItem('WFWC_' + this.name, $(this).val());
            }
            else {
                if ($(this).is(':checked'))
                    sessionStorage.setItem('WFWC_' + this.name, $(this).val());
            }
        }
        else if (type != 'button' && type != 'submit') {
            sessionStorage.setItem('WFWC_' + this.name, $(this).val());
        }
    });

}

var gClaimId = -1;
function save(callback) {
    var metdatadiv = document.getElementById("metadata");
    var userId = sessionStorage.getItem("userid");
    var token = sessionStorage.getItem("token");
    var locationId = sessionStorage.getItem("locationId");
    var folder = sessionStorage.getItem("claimfolder");

    if (metdatadiv) {
        var reportID = document.getElementById("reportid");
        var datadiv = document.getElementById("datadiv");
        var divs = datadiv.value.split(",");
        var data = {};
        var types = {};

        divs.forEach(function (divName) {
            var div = document.getElementById(divName);
            var stack = [];
            if (div) {
                var obj = {};

                stack.push(div);
                while (stack.length > 0) {
                    var item = stack.pop();
                    if (item.childElementCount > 0) {
                        var children = item.children;
                        for (var i = 0; i < children.length; i++) {
                            stack.push(children[i]);
                        }
                    }

                    if (item.id) {
                        if (item.type == "select-one" || item.type == "text" || item.type == "textarea" || item.type == "radio" || item.type == "hidden" || item.type == 'number') {
                            if (item.type == 'radio') {
                                if (item.checked) {
                                    obj[item.name] = item.value;
                                }
                            }
                            else {
                                if (item.value != null && item.value != '')
                                    obj[item.id] = item.value;
                            }
                        }
                        types[item.type] = 1;
                    }

                }
                data[divName] = obj;
            }

        });
        var payload = {};
        payload["report"] = data;

        if ($('#hdn_Claim_Id').val() == null || $('#hdn_Claim_Id').val() == '' || $('#hdn_Claim_Id').val() == '-1') {
            data.metadata.incidentId = $('#hdn_IncidentId').val();
            data.metadata.locationId = $('#hdn_incLocId').val();
        }
        if (folder) {
            data.folder = folder;
        }

        var fileObj = $('#frm_attatchments');
        if (fileObj.length > 0) {
            data.filename = getWcFileObj();
        }
        $('#pr_new').css('display', 'block');
        console.log(JSON.stringify(data));

        $.ajax({
            type: "POST",
            contentType: "application/json;charset=utf-8",
            accept: "application/json",
            url: hostname + "ClaimDeskWeb/services/v1/report",
            headers: {
                "token": token,
                "userid": userId,
                "locationId": locationId
            },
            data: JSON.stringify(payload),
            success: function (result) {

                if (callback) {
                    callback(null, "OK");
                }

                ClearWCSessionValues();

                if ($('#hdn_Claim_Id').val() == null || $('#hdn_Claim_Id').val() == '' || $('#hdn_Claim_Id').val() == '-1') {
                    SaveDiaryNotes(result);
                    gClaimId = result;
                    CompletedTab(result, data.metadata.locationId);
                    $('.tabRight').hide();
                }
                else {
                    Update_Diary_Note_Info();
                    sessionStorage.removeItem('claimId');
                    $('#view').jqExLoad('views/claims-list.html').hide().fadeIn();
                    $('.navbar-collapse li a').removeClass('select');
                    $('#claimId').addClass('select');
                }
                $('#pr_new').css('display', 'none');
                //sessionStorage.removeItem('incLocId');
            },
            error: function (result) {
                $('#pr_new').css('display', 'none');
                if (callback) {
                    callback("Server Failed");
                }
            }
        });


    }
}

function CompletedTab(claimId, incLocId) {
    $('.breadcrumbMy').append('<li class="disabledCss" id="li-completed"><a role="tab" class="cursorCss" onclick="tabClick(this);" data-target="#completed" id="a-completed"> Completed</a></li>');

    $.get('templates/completed.html', function (content) {
        $('.tab-content').append(content);
        $('#completedClaimId').html(claimId);
        var currentActive = $('.breadcrumbMy .active')[0].id.split('-')[1];
        removeAddGreenClass(currentActive, 'completed');
        $('a[data-target="#completed"]').tab('show');

        $('.breadcrumbMy li a').removeAttr('data-target');
        $('.breadcrumbMy li').addClass('newActive');
        $('.breadcrumbMy li a').addClass('activeMy');
        $('<input type="hidden" value="" id="img_' + claimId + '" name="img_' + claimId + '" data-incident-locid="' + incLocId + '" />').insertAfter('.tab-content');
        $('<input type="hidden" value="" id="img1_' + claimId + '" name="img1_' + claimId + '" data-incident-locid="' + incLocId + '" />').insertAfter('.tab-content');
    });

}

function CompletedView() {
    ShowWc(gClaimId, $('#hdn_incLocId').val());
    $('.wc-claim-modal').modal('show');
}

function CompletedEdit() {
    EditWc(gClaimId, $('#hdn_incLocId').val(), false);
}

function ClearWCSessionValues() {
    var sessionKeys = Object.keys(sessionStorage);
    $(sessionKeys).each(function (i, key) {
        if (key.indexOf('WFWC_') >= 0) {
            sessionStorage.setItem(key, null);
            sessionStorage.removeItem(key);
        }
    });
}

function btn_Upload_OnClick() {
    var file = $('#upfile')[0].files[0];
    $('#tbl').css('display', 'block');
    $('<tr><td>' + file.name + '</td><td><img src="images/down1.png" alt="" /></td></tr>').appendTo('#tbl');
}

function tabClick(obj) {
    var tabId = $('#page_content ul li.active')[0].id.split('-')[1];
    var isDisabledTab = $(obj).parent().hasClass('disabledCss');
    var frmId = '#frm_' + tabId;
    if ($(frmId).valid()) {
        SaveTabDataToSession(tabId);
        var currentSelId = $(obj).parent().prop('id').split('-')[1];
        if (!isDisabledTab) {
            $('a[data-target="' + obj.getAttribute('data-target') + '"]').tab('show');
            removeAddGreenClass(tabId, currentSelId);
        }
        else {
            var nextId = $('#page_content ul li.disabledCss')[0].id.split('-')[1];
            if (currentSelId == nextId) {
                $('a[data-target="#' + nextId + '"]').tab('show');
                $(obj).parent().removeClass('disabledCss');
                removeAddGreenClass(tabId, currentSelId);
            }
        }

    }
    else {
        var errObj = $(frmId).validate();
        var cntrlPositions = $('#' + errObj.errorList[0].element.id).offset();
        $('html,body').animate({ scrollTop: (cntrlPositions.top - 30) }, 800);
        event.preventDefault();
    }
}

function removeAddGreenClass(id, current) {
    $('#li-' + id).removeClass('newActive');
    $('#a-' + id).removeClass('activeMy');

    $('#li-' + current).addClass('newActive');
    $('#a-' + current).addClass('activeMy');
}

/* -- attatchements start -- */
function getWcFileObj() {

    var table = document.getElementById('receiptlist');
    var rowCount = table.rows.length;
    var filename = [];

    for (var g = 1; g < rowCount; g++) {
        var innerfilename = {};
        innerfilename["fileName"] = $(table.rows[g].childNodes[0].innerHTML)[0].name;
        filename.push(innerfilename);
    }

    return filename;
}

function upload_wc_file(tablename) {

    $('#file_error').html('');
    var fn = upload_Claimfile(tablename);
    if (fn) {
        document.getElementById("pr_img").style.display = "block";
        var currentClaim = $('#hdn_Claim_Id').val();
        var folder = sessionStorage.getItem("claimfolder");
        var formData = new FormData($('#frm_attatchments')[0]);
        uploadFile("claim", currentClaim, folder, fn, formData, function (error, data) {
            if (error) {
                //Display Error
                $('#file_error').html('Error uploading files...');
            }
            else {

                sessionStorage.setItem("claimfolder", data["folder"]);
                document.getElementById("pr_img").style.display = "none";
                if (tablename = "receipt_create") {
                    $('#upfile1').val('');
                    addRow_wc_receiptlist(fn, currentClaim);
                }
                else {
                    $('#upfile').val('');
                    addRow_imagelist(fn);
                }


            }
        });
    }
    else {
        $('#file_error').html('Please select a file to upload');
    }

}

function addRow_wc_receiptlist(filename, claimId) {

    var table = document.getElementById('receiptlist');
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
        recdelimage(element0);
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
    element2.addEventListener("click", function () { download_wc_ClaimFile(claimId, filename); });
    cell2.appendChild(element2);


    if (table.rows.length > 1) table.rows[0].style.display = 'none';

}

function getWcClaimDiaryNote(claim_id) {
    var def = $.Deferred();
    $.ajax({
        type: 'GET',
        contentType: 'application/json;charset=utf-8',
        accept: 'application/json',
        dataType: 'json',
        cache: false,
        url: hostname + 'ClaimDeskWeb/services/v1/claim/' + claim_id + '/notes',
        headers: {
            'token': token,
            'userid': userId,
            'locationId': locationId
        },
        success: function (result) {
            def.resolve(result);
        }
    });
    return def.promise();
}




/* -- attatchements end -- */