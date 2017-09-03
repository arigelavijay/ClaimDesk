$(document).ready(function () {    
    //LoadDiaryNoteComponents();
});

function LoadDiaryNoteComponents() {
    sessionStorage.removeItem('SsnDiaryNoteObj'); 
    sessionStorage.removeItem('SsnTblData');
    //$("#txt_FollowUp_Time").mask("Hh:Mm Pp");
    //$('#txt_FollowUp_Date,#txt_FollowUp_Time').keypress(function (e) { e.preventDefault(); });
    $('input[type=radio][name=rdo_Confidential]').change(function () {
        var is_followup = $('input[name=rdo_FollowUp]:checked').val() == 'true' ? true : false;
        if (this.value == 'true') {
            if (is_followup) {
                ReinitialiseEmailCount();
                ReinitialiseToEmailCount();
                GenerateEmails('');
                GenerateToEmails('');
                $('#txt_FollowUp_Email_0').val(sessionStorage.getItem("email")).attr('disabled', 'disabled');
                $('#btnEmailAdd_0').css('display', 'none');

                $('#txt_To_Email_0').val(sessionStorage.getItem("email")).attr('disabled', 'disabled');
                $('#btnToEmailAdd_0').css('display', 'none');
            }
            else {
                ReinitialiseToEmailCount();
                GenerateToEmails('');
                $('#txt_To_Email_0').val(sessionStorage.getItem("email")).attr('disabled', 'disabled');
                $('#btnToEmailAdd_0').css('display', 'none');
            }

            $('.emailClearCss').css('display', 'block');
        }
        else {

            if (is_followup) {
                $('#txt_FollowUp_Email_0').val('').removeAttr('disabled');
                $('#btnEmailAdd_0').css('display', 'block');

                $('#txt_To_Email_0').val('').removeAttr('disabled');
                $('#btnToEmailAdd_0').css('display', 'block');
            }
            else {
                $('#txt_To_Email_0').val('').removeAttr('disabled');
                $('#btnToEmailAdd_0').css('display', 'block');
            }

            $('.emailClearCss').css('display', 'none');
        }
    });

    $('input[type=radio][name=rdo_FollowUp]').change(function () {        
        var is_confidential = $('input[name=rdo_Confidential]:checked').val() == 'true' ? true : false;
        var diary_note = parseInt($('#hdn_Diary_Note').val());
        if (diary_note != -1) {

            if (this.value == 'true') {
                $('.optional').fadeIn();
                ReinitialiseEmailCount();
                GenerateEmails('');
                $('#txt_FollowUp_Date').attr('required', 'required');
                //$('#txt_DiaryNotes').attr('required', 'required');
                $('#txt_FollowUp_Desc').attr('required', 'required');

                if (is_confidential) {
                    $('#txt_FollowUp_Email_0').val(sessionStorage.getItem("email")).attr('disabled', 'disabled');
                    $('#btnEmailAdd_0').css('display', 'none');
                }
            }
            else {
                $('.optional').fadeOut();

                $('#txt_FollowUp_Date').removeAttr('required');
                //$('#txt_DiaryNotes').removeAttr('required');
                $('#txt_FollowUp_Desc').removeAttr('required');

                if (!is_confidential) {
                    $('#Emails').empty();
                }
            }
        }
        else {

            if (this.value == 'true') {
                $('.optional').fadeIn();
                GenerateEmails('');

                $('#txt_FollowUp_Date').attr('required', 'required');
                //$('#txt_DiaryNotes').attr('required', 'required');
                $('#txt_FollowUp_Desc').attr('required', 'required');

                if (is_confidential) {
                    $('#txt_FollowUp_Email_0').val(sessionStorage.getItem("email")).attr('disabled', 'disabled');;
                    $('#btnEmailAdd_0').css('display', 'none');

                    $('#txt_To_Email_0').val(sessionStorage.getItem("email")).attr('disabled', 'disabled');;
                    $('#btnToEmailAdd_0').css('display', 'none');
                }

            }
            else {
                $('.optional').fadeOut();
                ReinitialiseEmailCount();

                $('#txt_FollowUp_Date').removeAttr('required');
                //$('#txt_DiaryNotes').removeAttr('required');
                $('#txt_FollowUp_Desc').removeAttr('required');

                if (!is_confidential) {
                    $('#txt_FollowUp_Email_0').val('');
                    $('#btnEmailAdd_0').css('display', 'block');

                    $('#txt_To_Email_0').val('');
                    $('#btnToEmailAdd_0').css('display', 'block');
                }

            }
        }
    });

    

    jQuery.validator.addClassRules("email_validations", {
        required: true,
        email: true,
        remove_duplicate_emails: true
    });

    jQuery.validator.addClassRules("to_email_validations", {
        email: true,
        remove_duplicate_to_emails: true
    });

    jQuery.validator.addMethod('my_required_val', function (value, element, regexpr) {
        var is_followup = $('input[name=rdo_FollowUp]:checked').val() == 'true' ? true : false;
        if (is_followup) {
            if (value != null && value != '')
                return true;
            else
                return false;
        }
        else
            return true;
    }, 'This is required.');

    var email_Array = new Array();
    var to_email_Array = new Array();
    $.validator.addMethod("remove_duplicate_emails", function (value, element, regexpr) {
        $('.emailCss').each(function (e) {
            var obj = {};
            obj.id = this.id;
            obj.value = this.value;
            email_Array.push(obj);
        });
        var flag = true;
        for (var i = 0; i < email_Array.length; i++) {
            if (email_Array[i].id != element.id && email_Array[i].value == value) {
                flag = false;
                break;
            }
        }
        email_Array = new Array();

        return flag;
    }, 'Duplicates emails are not allowed.');

    $.validator.addMethod("remove_duplicate_to_emails", function (value, element, regexpr) {
        $('.toemailCss').each(function (e) {
            var obj = {};
            obj.id = this.id;
            obj.value = this.value;
            to_email_Array.push(obj);
        });

        var flag = true;
        for (var i = 0; i < to_email_Array.length; i++) {
            if (to_email_Array[i].id != element.id && to_email_Array[i].value == value) {
                flag = false;
                break;
            }
        }
        to_email_Array = new Array();
        return flag;
    }, 'Duplicates emails are not allowed.');

    $('.new-date-picker').datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: '-100:+0',
        minDate: 0,
        addSliderAccess: true
    });


    $('.time-picker').timepicker({
        addSliderAccess: false,
        timeFormat: 'hh:mm tt',
        sliderAccessArgs: { touchonly: false }
    });

    $.mask.definitions['H'] = "[0-1]";
    $.mask.definitions['h'] = "[0-9]";
    $.mask.definitions['M'] = "[0-5]";
    $.mask.definitions['m'] = "[0-9]";
    $.mask.definitions['P'] = "[AaPp]";
    $.mask.definitions['p'] = "[Mm]";

    $(".timepicker").mask("Hh:Mm Pp");

}

/* -- Diary Notes Start -- */
function Get_Diary_Categories() {
    var diary_categories = JSON.parse(sessionStorage.getItem('SsnDiaryCategories'));
    $("#ddl_Category").empty();
    if (diary_categories != null) {
        $("#ddl_Category").append('<option value=""></option>');
        $.each(diary_categories, function (i, item) {
            $("#ddl_Category").append('<option value="' + item.code + '">' + item.description + '</option>');
        });
    }
}

function Get_Assigned_Users() {
    var assigned_users = JSON.parse(sessionStorage.getItem('SsnAssignedUsers'));
    $("#ddl_assignedUser").empty();
    if (assigned_users != null) {
        $("#ddl_assignedUser").append('<option value=""></option>');
        $.each(assigned_users, function (i, item) {
            $("#ddl_assignedUser").append('<option value="' + item.claimDeskUserId + '">' + item.name + '</option>');
        });
    }
}

function btn_AddNote_OnClick(claim_id) {    
    Get_Diary_Categories();
    Get_Assigned_Users();
    ReinitialiseEmailCount();
    ReinitialiseToEmailCount();
    GenerateToEmails('');

    $('.optional').css('display', 'none');
    $('#txt_DiaryNotes').attr('required', 'required');
    $('#txt_FollowUp_Date').removeAttr('required');    
    $('#txt_FollowUp_Desc').removeAttr('required');

    $('#hdn_Claim_Id').val(claim_id);
    $('#hdn_Diary_Note').val('');
    $('#txt_DiaryNotes').val('');
    $('#txt_FollowUp_Date').val('');
    $('#txt_FollowUp_Time').val('');
    $('#txt_FollowUp_Desc').val('');
    $('#claim_id').html(claim_id);
    setCheckedValue(document.forms['frm_diary_notes'].elements['rdo_Confidential'], false);
    setCheckedValue(document.forms['frm_diary_notes'].elements['rdo_FollowUp'], false);
    setCheckedValue(document.forms['frm_diary_notes'].elements['rdo_TaskComplete'], false);
    $('#edit_diary').modal('show');

}

function ReinitialiseEmailCount() {
    email_count = -1;
    $('#Emails').empty();
}

function ReinitialiseToEmailCount() {
    to_email_count = -1;
    $('#To_Emails').empty();
}

var to_email_count = -1;
function btn_To_Email_Add_OnClick(obj) {
    to_email_count = to_email_count + 1;
    var html = '';
    html += '<div class="row" id="To_Email_' + to_email_count + '">';
    if (to_email_count == 0)
        html += '<div class="col-xs-2"><label class="myLable" for="txt_To_Email_' + to_email_count + '">To</label></div>';
    else
        html += '<div class="col-xs-2"><label class="myLable" for="txt_To_Email_' + to_email_count + '">&nbsp;</label></div>';

    html += '<div class="col-xs-5"><input type="text" id="txt_To_Email_' + to_email_count + '" name="txt_To_Email_' + to_email_count + '" class="planeTextFild toemailCss to_email_validations" value=""><span class="errMsgLbl pull-right" style="color: red;"></span></div>'

    if (to_email_count == 0)
        html += '<div class="col-xs-1"><input type="button" id="btnToEmailAdd_' + to_email_count + '" class="add buttonNext newSave" onclick="btn_To_Email_Add_OnClick(this);" name="btnToEmailAdd_' + to_email_count + '" value="" /><button class="buttonNext newSave emailClearCss" type="button" onclick="btn_toemail_Clear(this);" style="display:none">Clear</button></div>';
    else
        html += '<div class="col-xs-1"><input type="button" id="btnToEmailRemove_' + to_email_count + '" class="remove buttonNext newSave" onclick="btn_To_Email_Remove_OnClick(this);" name="btnToEmailRemove_' + to_email_count + '" value="" /></div>';


    html += '</div>';
    $(html).appendTo('#To_Emails');
}

function GenerateToEmails(val) {
    to_email_count = to_email_count + 1;
    var html = '';
    html += '<div class="row" id="To_Email_' + to_email_count + '">';
    if (to_email_count == 0)
        html += '<div class="col-xs-2"><label class="myLable" for="txt_To_Email_' + to_email_count + '">To</label></div>';
    else
        html += '<div class="col-xs-2"><label class="myLable" for="txt_To_Email_' + to_email_count + '">&nbsp;</label></div>';
    html += '<div class="col-xs-5"><input type="text" id="txt_To_Email_' + to_email_count + '" name="txt_To_Email_' + to_email_count + '" class="planeTextFild toemailCss to_email_validations" value="' + val + '"><span class="errMsgLbl pull-right" style="color: red;"></span></div>'
    if (to_email_count == 0)
        html += '<div class="col-xs-1"><input type="button" id="btnToEmailAdd_' + to_email_count + '" class="add buttonNext newSave" onclick="btn_To_Email_Add_OnClick(this);" name="btnToEmailAdd_' + to_email_count + '" value="" /><button class="buttonNext newSave emailClearCss" type="button" onclick="btn_toemail_Clear(this);" style="display:none">Clear</button></div>';
    else
        html += '<div class="col-xs-1"><input type="button" id="btnToEmailRemove_' + to_email_count + '" class="remove buttonNext newSave" onclick="btn_To_Email_Remove_OnClick(this);" name="btnToEmailRemove_' + to_email_count + '" value="" /></div>';


    html += '</div>';
    $(html).appendTo('#To_Emails');
}

var email_count = -1;
function btn_Email_Add_OnClick(obj) {
    email_count = email_count + 1;
    var html = '';
    html += '<div class="row" id="Email_' + email_count + '">';
    if (email_count == 0)
        html += '<div class="col-xs-2"><label class="myLable" for="txt_FollowUp_Email_' + email_count + '">Follow Up Email</label></div>';
    else
        html += '<div class="col-xs-2"><label class="myLable" for="txt_FollowUp_Email_' + email_count + '">&nbsp;</label></div>';
    html += '<div class="col-xs-5"><input type="text" id="txt_FollowUp_Email_' + email_count + '" name="txt_FollowUp_Email_' + email_count + '" class="planeTextFild emailCss email_validations" value=""><span class="errMsgLbl pull-right" style="color: red;"></span></div>'
    if (email_count == 0)
        html += '<div class="col-xs-1"><input type="button" id="btnEmailAdd_' + email_count + '" class="add buttonNext newSave" onclick="btn_Email_Add_OnClick(this);" name="btnEmailAdd_' + email_count + '" value="" /><button class="buttonNext newSave" type="button" onclick="btn_FollowUp_Clear(this);" style="display:none">Clear</button></div>';
    else
        html += '<div class="col-xs-1"><input type="button" id="btnEmailRemove_' + email_count + '" class="remove buttonNext newSave" onclick="btn_Email_Remove_OnClick(this);" name="btnEmailRemove_' + email_count + '" value="" /></div>'


    html += '</div>';
    $(html).appendTo('#Emails');
}

function GenerateEmails(val) {

    email_count = email_count + 1;
    var html = '';

    html += '<div class="row" id="Email_' + email_count + '">';
    if (email_count == 0)
        html += '<div class="col-xs-2"><label class="myLable" for="txt_FollowUp_Email_' + email_count + '">Follow Up Email</label></div>';
    else
        html += '<div class="col-xs-2"><label class="myLable" for="txt_FollowUp_Email_' + email_count + '">&nbsp;</label></div>';

    html += '<div class="col-xs-5"><input type="text" id="txt_FollowUp_Email_' + email_count + '" name="txt_FollowUp_Email_' + email_count + '" class="planeTextFild emailCss email_validations" value="' + val + '"><span class="errMsgLbl pull-right" style="color: red;"></span></div>'

    if (email_count == 0)
        html += '<div class="col-xs-1"><input type="button" id="btnEmailAdd_' + email_count + '" class="add buttonNext newSave" onclick="btn_Email_Add_OnClick(this);" name="btnEmailAdd_' + email_count + '" value="" /><button class="buttonNext newSave" type="button" onclick="btn_FollowUp_Clear(this);" style="display:none">Clear</button></div>';
    else
        html += '<div class="col-xs-1"><input type="button" id="btnEmailRemove_' + email_count + '" class=" remove buttonNext newSave" onclick="btn_Email_Remove_OnClick(this);" name="btnEmailRemove_' + email_count + '" value="" /></div>';


    html += '</div>';
    $(html).appendTo('#Emails');
}

function btn_FollowUp_Clear(e) {
    if (e.innerHTML == 'Clear') {
        e.innerHTML = 'Restore';
        $('#txt_FollowUp_Email_0').val('');
    }
    else {
        e.innerHTML = 'Clear';
        $('#txt_FollowUp_Email_0').val(sessionStorage.getItem('email'));
    }

}

function btn_toemail_Clear(e) {
    if (e.innerHTML == 'Clear') {
        e.innerHTML = 'Restore';
        $('#txt_To_Email_0').val('');
    }
    else {
        e.innerHTML = 'Clear';
        $('#txt_To_Email_0').val(sessionStorage.getItem('email'));
    }
}


function btn_Email_Remove_OnClick(obj) {
    var email = obj.id.split('_')[1];
    $('#Email_' + email).hide().empty();
}

function btn_To_Email_Remove_OnClick(obj) {
    var to_email = obj.id.split('_')[1];
    $('#To_Email_' + to_email).hide().empty();
}

function btn_Update_OnClick() {
    
    if ($("#frm_diary_notes").valid()) {
        var obj = {};
        obj.confidential = $('input[name=rdo_Confidential]:checked').val();
        var diarynote_id = $('#hdn_Diary_Note').val();
        //if (diarynote_id != -1)
        obj.id = diarynote_id;
        obj.notes = $('#txt_DiaryNotes').val();
        obj.complete = $('input[name=rdo_TaskComplete]:checked').val();
        obj.category = $('#ddl_Category').val();

        if (parseInt(diarynote_id) > 0)
            obj.updatedBy = sessionStorage.getItem('firstName') + ' ' + sessionStorage.getItem('lastName');

        var to_emails_array = new Array();
        $('.toemailCss').each(function (e) {
            to_emails_array.push($(this).val());
        });

        obj.emails = to_emails_array;
        obj.followUp = $('input[name=rdo_FollowUp]:checked').val();
        if (obj.followUp == 'true') {
            obj.follupMessage = $('#txt_FollowUp_Desc').val();
            var time = $('#txt_FollowUp_Date').val() + ' ' + ($('#txt_FollowUp_Time').val() != '' ? $('#txt_FollowUp_Time').val() : '12:00 AM');
            if ($('#txt_FollowUp_Date').val() != null && $('#txt_FollowUp_Date').val() != '')
                obj.followUpTime = time.toUpperCase();
            var followup_emails_array = new Array();
            $('.emailCss').each(function (e) {
                followup_emails_array.push($(this).val());
            });
            obj.followUpEmails = followup_emails_array;
            obj.assignedUser = $('#ddl_assignedUser').val();
            obj.followupCancelled = $('input[name=rdo_FollowUpCancelled]:checked').val();
        }



        var claim_id = $('#hdn_Claim_Id').val();

        if (true) {
            var Url = hostname + 'ClaimDeskWeb/services/v1/claim/' + claim_id + '/notes/';

            InMemoryCall(obj);

            var tbl = JSON.parse(sessionStorage.getItem('SsnTblData'));
            if (tbl != null && tbl != '') {

                var is_exist = false;
                for (var i = 0; i < tbl.length; i++) {
                    if (tbl[i].id == parseInt(obj.id)) {
                        tbl[i].confidential = YesOrNo(obj.confidential == 'true' ? true : false);
                        tbl[i].notes = obj.notes;
                        tbl[i].emails = obj.emails;
                        tbl[i].followUp = YesOrNo(obj.followUp == 'true' ? true : false);
                        tbl[i].category = obj.category;
                        tbl[i].complete = YesOrNo(obj.complete == 'true' ? true : false);
                        if (obj.id > 0)
                            tbl[i].updatedBy = obj.updatedBy;

                        if (obj.assignedUser)
                            tbl[i].assignedUser = obj.assignedUser;

                        if (obj.followUpTime)
                            tbl[i].followUpTime = obj.followUpTime;

                        if (obj.followUpEmails)
                            tbl[i].followUpEmails = obj.followUpEmails;

                        if (obj.follupMessage)
                            tbl[i].follupMessage = obj.follupMessage;

                        if (obj.followupCancelled)
                            tbl[i].followupCancelled = YesOrNo(obj.followupCancelled == 'true' ? true : false);

                        is_exist = true;
                        break;
                    }
                }

                if (!is_exist)
                    tbl.push(Generate_tbl_object(obj));

            }
            else {
                tbl = new Array();
                tbl.push(Generate_tbl_object(obj));
            }


            New_Diary_Table(tbl, claim_id);
            sessionStorage.setItem('SsnTblData', JSON.stringify(tbl));
            $('#edit_diary').modal('hide');
        }
        else {
            InMemoryCall(obj);
            sessionStorage.setItem('SsnDiaryNoteObj', JSON.stringify(obj));
            $('#edit_diary').modal('hide');

            var arr = new Array();
            arr.push(Generate_tbl_object(obj));
            New_Diary_Table(arr, -1);
        }
    }
}


function GetUniqueId() {
    var id = parseInt(sessionStorage.getItem('SsnDiaryNoteId'));
    if (id != null && id != '' && !isNaN(id)) {
        id = id - 1;
        sessionStorage.setItem('SsnDiaryNoteId', id);
    }
    else {
        id = -1;
        sessionStorage.setItem('SsnDiaryNoteId', id);
    }
    return id;
}

function InMemoryCall(obj) {
    if (typeof obj.id == 'undefined' || obj.id == '') {
        obj.id = GetUniqueId();
    }
    var temp = sessionStorage.getItem('SsnDiaryNoteObj');
    var arr = new Array();
    if (temp != null && temp != '') {
        var SsnObj = JSON.parse(temp);
        var is_exist = false;
        for (var i = 0; i < SsnObj.length; i++) {
            if (SsnObj[i].id == parseInt(obj.id)) {
                SsnObj[i].confidential = obj.confidential;
                SsnObj[i].notes = obj.notes;
                SsnObj[i].emails = obj.emails;
                SsnObj[i].followUp = obj.followUp;
                SsnObj[i].category = obj.category;
                SsnObj[i].complete = obj.complete;
                if (obj.id > 0)
                    SsnObj[i].updatedBy = obj.updatedBy;

                if (obj.assignedUser)
                    SsnObj[i].assignedUser = obj.assignedUser;

                if (obj.followUpTime)
                    SsnObj[i].followUpTime = obj.followUpTime;

                if (obj.followUpEmails)
                    SsnObj[i].followUpEmails = obj.followUpEmails;

                if (obj.follupMessage)
                    SsnObj[i].follupMessage = obj.follupMessage;

                if (obj.followupCancelled)
                    SsnObj[i].followupCancelled = obj.followupCancelled;

                is_exist = true;
                break;
            }
        }

        if (!is_exist)
            SsnObj.push(obj);

        sessionStorage.setItem('SsnDiaryNoteObj', JSON.stringify(SsnObj));
    }
    else {
        arr.push(obj);
        sessionStorage.setItem('SsnDiaryNoteObj', JSON.stringify(arr));
    }
}

function CompareStringBoolVal(val) {
    var returnStr = '';
    if (typeof val == 'boolean') {
        returnStr = YesOrNo(val);
    }
    else if (typeof val == 'string') {
        returnStr = YesOrNo(val == 'true' ? true : false);
    }
    return returnStr;
}

function Generate_tbl_object(item) {
    debugger;
    var obj = {};
    obj.id = typeof item.id != 'undefined' ? item.id : '';
    obj.category = item.category;
    obj.updatedBy = CheckForUndefined(item.updatedBy);
    if (item.complete) {
        obj.complete = CompareStringBoolVal(item.complete);
    }
    else
        obj.complete = 'No';

    if (item.confidential) {
        obj.confidential = CompareStringBoolVal(item.confidential);
    }
    else
        obj.confidential = 'No';
    
    obj.created = CheckForUndefined(item.created);
    obj.createdBy = CheckForUndefined(item.createdBy);

    if (item.followUp) {
        obj.followUp = CompareStringBoolVal(item.followUp);
    }
    else
        obj.followUp = 'No';
    
    
    obj.followUpEmails = CheckForUndefined(item.followUpEmails);
    obj.followUpTime = CheckForUndefined(item.followUpTime);
    obj.followUpDate = CheckForUndefined(item.followUpDate);
    obj.follupMessage = CheckForUndefined(item.follupMessage);
    obj.notes = CheckForUndefined(item.notes);
    obj.status = CheckForUndefined(item.status);
    obj.updated = CheckForUndefined(item.updated);
    obj.emails = item.emails;
    obj.assignedUser = item.assignedUser;

    if (item.followupCancelled) {
        obj.followupCancelled = CompareStringBoolVal(item.followupCancelled);
    }
    else
        obj.followupCancelled = 'No';
    
    obj.Action = '';
    return obj;    
}

function Generate_tbl_object_wc(item) {
    
    var obj = {};
    obj.id = typeof item.id != 'undefined' ? item.id : '';
    obj.category = item.category;
    obj.updatedBy = CheckForUndefined(item.updatedBy);
    if (item.complete) {
        obj.complete = CompareStringBoolVal(item.complete);
    }
    else
        obj.complete = 'No';

    if (item.confidential) {
        obj.confidential = CompareStringBoolVal(item.confidential);
    }
    else
        obj.confidential = 'No';

    obj.created = UtcToLocal(CheckForUndefined(item.created), 'MM/DD/YYYY hh:mm A');
    obj.createdBy = CheckForUndefined(item.createdBy);

    if (item.followUp) {
        obj.followUp = CompareStringBoolVal(item.followUp);
    }
    else
        obj.followUp = 'No';


    obj.followUpEmails = CheckForUndefined(item.followUpEmails);
    obj.followUpTime = UtcToLocal(CheckForUndefined(item.followUpTime), 'MM/DD/YYYY hh:mm A');
    obj.followUpDate = CheckForUndefined(item.followUpDate);
    obj.follupMessage = CheckForUndefined(item.follupMessage);
    obj.notes = CheckForUndefined(item.notes);
    obj.status = CheckForUndefined(item.status);
    obj.updated = UtcToLocal(CheckForUndefined(item.updated), 'MM/DD/YYYY hh:mm A');
    obj.emails = item.emails;
    obj.assignedUser = item.assignedUser;

    if (item.followupCancelled) {
        obj.followupCancelled = CompareStringBoolVal(item.followupCancelled);
    }
    else
        obj.followupCancelled = 'No';

    obj.Action = '';
    return obj;
}




function New_Diary_Table(data, claim_id) {    
    
        $('#div_tbl').html('');
        var strTable = '';
        strTable += '<table class="fullwidth tcellspacing noborder" id="tbl_Diaries">';
        strTable += '<thead class="myTabHead">';
        strTable += '<tr>';
        strTable += '<th class="talign">Diary No.</th>';
        strTable += '<th class="talign">Description</th>';
        strTable += '<th class="talign">Confidential</th>';
        strTable += '<th class="talign">Created By</th>';
        strTable += '<th class="talign">Created Date</th>';
        strTable += '<th class="talign">Follow Up Date</th>';
        strTable += '<th class="talign">Follow Up</th>';
        strTable += '<th class="talign">#Action</th>';
        strTable += '</tr>';
        strTable += '</thead>';
        strTable += '<tbody>';
        strTable += '</tbody>';
        strTable += '</table>';

        $('#div_tbl').html(strTable);

        $('#tbl_Diaries').dataTable({
            "bProcessing": true,
            "bPaginate": false,
            "bLengthChange": true,
            "bFilter": false,
            "bSort": true,
            "bInfo": false,
            "bAutoWidth": true,
            "sPaginationType": "full_numbers",
            "iDisplayLength": 10,
            //"aaSorting": [[0, "desc"]],
            //"aoColumnDefs": [{ bSortable: false, aTargets: [-1, 0] }],
            "aaData": data,
            "aoColumns": [
                {
                    "mDataProp": "id",
                    "mRender": function (data, type, full) {
                        if (data > 0)
                            return data;
                        else
                            return '';
                    }
                },
                {
                    "mDataProp": "notes",
                    "bSearchable": true,
                    "bSortable": false,
                    "mRender": function (data, type, full) {
                        var str = '';
                        if (data.length > 30)
                            str = chop_diaryNotes(data);
                        else
                            str = data;
                        return str;
                    }
                },
                { "mDataProp": "confidential" },
                { "mDataProp": "createdBy" },
                { "mDataProp": "created" },
                { "mDataProp": "followUpTime" },
                { "mDataProp": "followUp" },
                {
                    "mDataProp": "Action",
                    "bSearchable": false,
                    "bSortable": false,
                    "mRender": function (data, type, full) {                        
                        var str = '';
                        if (claim_id != -1)
                            str += '<a href="#" style="cursor:pointer;" onclick="btn_View_OnClick(' + claim_id + ', ' + full.id + ');"><img src="images/min1.png" alt="" /></a>&nbsp;&nbsp;&nbsp;';
                        str += '<a data-toggle="modal" data-target="#edit_diary" style="cursor:pointer;" href="#" onclick="btn_tbl_Edit_OnClick(' + claim_id + ', ' + full.id + ');"><img src="images/edit.png" alt="" /></a>&nbsp;&nbsp;&nbsp;';
                        str += '<a href="#" onclick="btn_tbl_Delete_OnClick(' + claim_id + ', ' + full.id + ');"><img src="images/min5.png" alt="" /></a>';

                        return str;
                    }
                }]
        });
    
    
}

function btn_tbl_Edit_OnClick(claim_id, note_id) {

    Get_Diary_Categories();
    Get_Assigned_Users();
    $('#hdn_Diary_Note').val('');
    var tbl = JSON.parse(sessionStorage.getItem('SsnTblData'));
    for (var i = 0; i < tbl.length; i++) {
        if (tbl[i].id == note_id) {
            var result = tbl[i];
            ReinitialiseEmailCount();
            ReinitialiseToEmailCount();
            $('#claim_id').html(claim_id);
            $('#txt_DiaryNotes').val(result.notes);
            $('#hdn_Diary_Note').val(result.id);
            $('#hdn_Claim_Id').val(claim_id);
            $('#ddl_Category').val(result.category);
            $('#ddl_assignedUser').val(result.assignedUser);

            setCheckedValue(document.forms['frm_diary_notes'].elements['rdo_Confidential'], TrueOrFalse(result.confidential));
            setCheckedValue(document.forms['frm_diary_notes'].elements['rdo_FollowUp'], TrueOrFalse(result.followUp));
            setCheckedValue(document.forms['frm_diary_notes'].elements['rdo_TaskComplete'], TrueOrFalse(result.complete));
            setCheckedValue(document.forms['frm_diary_notes'].elements['rdo_FollowUpCancelled'], TrueOrFalse(result.followupCancelled));

            $('.optional').css('display', TrueOrFalse(result.followUp) ? 'block' : 'none');




            if (typeof result.emails != 'undefined' && result.emails.length > 0) {
                for (var j = 0; j < result.emails.length; j++) {
                    GenerateToEmails(result.emails[j]);
                }
            }
            else
                GenerateToEmails('');



            if (typeof result.followUp != 'undefined' && TrueOrFalse(result.followUp)) {                
                $('#txt_FollowUp_Date').val(getDate(result.followUpTime, 'MM/DD/YYYY'));
                $('#txt_FollowUp_Time').val(getTime(result.followUpTime, 'hh:mm A'));

                if (typeof result.followUpEmails != 'undefined' && result.followUpEmails.length > 0) {
                    for (var m = 0; m < result.followUpEmails.length; m++) {
                        GenerateEmails(result.followUpEmails[m]);
                    }
                }

                $('#txt_FollowUp_Desc').val(result.follupMessage);
            }

            if (TrueOrFalse(result.confidential)) {
                $('#txt_FollowUp_Email_0').attr('disabled', 'disabled');
                $('#btnEmailAdd_0').css('display', 'none');

                $('#txt_To_Email_0').attr('disabled', 'disabled');
                $('#btnToEmailAdd_0').css('display', 'none');
            }

            $('.emailClearCss').css('display', TrueOrFalse(result.confidential) ? 'block' : 'none').html($('#txt_To_Email_0').val() != '' ? 'Clear' : 'Restore');

            if (!TrueOrFalse(result.followUp)) {
                $('#txt_FollowUp_Date').removeAttr('required');
                $('#txt_DiaryNotes').removeAttr('required');
                $('#txt_FollowUp_Desc').removeAttr('required');
                $('#ddl_assignedUser').removeAttr('required');
            }
        }
    }
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





var apprise_flag = true;
function btn_tbl_Delete_OnClick(claim_id, note_id) {
    if (apprise_flag) {
        apprise_flag = false;
        var string = 'Do you want to delete this Diary Note?';
        var args = { 'input': false };
        apprise(string, args, function (r) {
            if (r) {
                
                var tbl = JSON.parse(sessionStorage.getItem('SsnTblData'));
                var DJobj = JSON.parse(sessionStorage.getItem('SsnDiaryNoteObj'));
                for (var i = 0; i < tbl.length; i++) {
                    if (tbl[i].id == note_id) {
                        tbl.splice(i, 1);                        
                        break;
                    }
                }

                if (DJobj != null) {
                    for (var i = 0; i < DJobj.length; i++) {
                        if (DJobj[i].id == note_id) {
                            DJobj.splice(i, 1);
                            break;
                        }
                    }
                    sessionStorage.setItem('SsnDiaryNoteObj', JSON.stringify(DJobj));
                }
                
                sessionStorage.setItem('SsnTblData', JSON.stringify(tbl));
                
                var Jobj = JSON.parse(sessionStorage.getItem('SsnDeleteDiaryNoteObj'));
                if (Jobj != null && Jobj != '') {
                    Jobj.push(note_id);
                    sessionStorage.setItem('SsnDeleteDiaryNoteObj', JSON.stringify(Jobj));
                }
                else {
                    var arr = new Array();
                    arr.push(note_id);
                    sessionStorage.setItem('SsnDeleteDiaryNoteObj', JSON.stringify(arr));
                }

                New_Diary_Table(tbl, claim_id);
                apprise_flag = true;
            }
            else
                apprise_flag = true;
        });
    }
}

function btn_View_OnClick(claim_id, diary_note_id) {
    
    $('#view_diary_id').html(diary_note_id);
    var tbl = JSON.parse(sessionStorage.getItem('SsnTblData'));
    for (var i = 0; i < tbl.length; i++) {
        if (tbl[i].id == diary_note_id) {
            var item = tbl[i];            
            var html = '';
            html += '<div style="background-color: #ebebeb; margin-bottom: 5px; padding: 0 3px 10px 6px;">';

            html += '<div class="row">';
            html += '<div class="col-md-4"><b>ID</b>: ' + check_blank(item.id) + '</div>'
            html += '<div class="col-md-4"><b>Created By</b>: ' + check_blank(item.createdBy) + '</div>'
            html += '<div class="col-md-4"><b>Created On</b>: ' + check_blank(item.created) + '</div>'
            html += '</div>';

            var to_emails = (typeof item.emails != 'undefined' && item.emails.length > 0) ? GetFollowUPEmails(item.emails) : '-';

            html += '<div class="row">';
            html += '<div class="col-md-4"><b>Confidential</b>: ' + item.confidential + '</div>'
            html += '<div class="col-md-4"><b>To</b>: ' + (to_emails != '' ? to_emails : '-') + '</div>';
            html += '<div class="col-md-4"><b>Follow Up</b>: ' + item.followUp + '</div>'
            html += '</div>';

            html += '<div class="row">';
            html += '<div class="col-md-4"><b>Category</b>: ' + Get_Category_Text(check_blank(item.category)) + '</div>'
            html += '<div class="col-md-4"><b>Updated By</b>: ' + check_blank(item.updatedBy) + '</div>'
            html += '<div class="col-md-4"><b>Updated Time</b>: ' + check_blank(item.updated) + '</div>'
            html += '</div>';

            if (TrueOrFalse(item.followUp)) {
                html += '<div class="row">';
                html += '<div class="col-md-4"><b>Follow Up Date</b>: ' + check_blank(item.followUpTime) + '</div>'
                html += '<div class="col-md-4"><b>Follow Up Email</b>: ' + check_blank(GetFollowUPEmails(item.followUpEmails)) + '</div>'
                html += '<div class="col-md-4"></div>'
                html += '</div>';

                html += '<div class="row">';
                html += '<div class="col-md-12"><b>Follow Up Message</b>: ' + check_blank(item.follupMessage) + '</div>'
                html += '</div>';
            }

            html += '<div class="row">';
            html += '<div class="col-md-12"><b>Notes</b>: ' + check_blank(item.notes) + '</div>'
            html += '</div>';

            if (typeof item.history != 'undefined' && item.history.length > 0) {
                html += '<div class="row">';
                html += '<div class="col-md-12" ><b>Email History:</b></div></div>';
                html += '<div class="row" style="margin-right:0px; margin-left:0px; ">';
                html += '<div class="col-md-4" style="border-bottom:1px solid #000; border-top:1px solid #000"><b>Email Address</b></div>';
                html += '<div class="col-md-4" style="border-bottom:1px solid #000; border-top:1px solid #000"><b>Sent Time</b></div>';
                html += '<div class="col-md-4" style="border-bottom:1px solid #000; border-top:1px solid #000"><b>Remainder</b></div></div>';

                for (var j = 0; j < item.history.length; j++) {
                    html += '<div class="row" style="margin-right:0px; margin-left:0px;">';
                    html += '<div class="col-md-4">' + item.history[j].email + '</div>';
                    html += '<div class="col-md-4">' + item.history[j].date + '</div>';
                    html += '<div class="col-md-4">' + item.history[j].type + '</div> </div>';
                }
                html += '</div>';
            }

            html += '</div>';

            $('#view_diary_note').html(html);
        }
    }

    $('#view_diary_note_modal').modal('show');
}

function SaveDiaryNotes(claim_id) {
    var Jobj = JSON.parse(sessionStorage.getItem('SsnTblData'));
    var Url = hostname + 'ClaimDeskWeb/services/v1/claim/' + claim_id + '/notes/';

    if (Jobj != null) {
        for (var i = 0; i < Jobj.length; i++) {
            var new_obj = GetPayLoadFormat(Jobj[i]);
            delete new_obj.id;
            Add_DiaryNote_AjaxCall(new_obj, Url);
        }
        sessionStorage.removeItem('SsnTblData');
    }
}

function Add_DiaryNote_AjaxCall(obj, Url) {
    debugger;
    if (typeof obj.followUpTime != 'undefined') {
        obj.followUpTime = localToUtc(obj.followUpTime, 'MM/DD/YYYY hh:mm A');
    }      
    
    if (typeof obj.followUp != 'undefined') {
        obj.followUp = (obj.followUp == 'true' ? true : false);
    }
    else {
    	obj.followUp = false;
    }
    
    
    if (typeof obj.confidential != 'undefined') {
        obj.confidential = (obj.confidential == 'true' ? true : false);
    }
    else {
    	obj.confidential = false;
    }
    
    if (typeof obj.followupCancelled != 'undefined') {
        obj.followupCancelled = (obj.followupCancelled == 'true' ? true : false);
    }
    else {
    	obj.followupCancelled = false;
    }

    obj.complete = false;
    
    $.ajax({
        type: 'POST',
        contentType: 'application/json;charset=utf-8',
        accept: 'application/json',
        dataType: 'json',
        cache: false,
        url: Url,
        data: JSON.stringify(obj),
        headers: {
            'token': token,
            'userid': userId,
            'locationId': locationId
        },
        success: function (result) {            
            
        },
        error: function (err) {
            //alert(err);
        }
    });
}

function GetPayLoadFormat(_obj) {

    var obj = {};
    obj.id = _obj.id;
    obj.category = _obj.category;
    obj.complete = TrueOrFalse(_obj.complete).toString();
    obj.confidential = TrueOrFalse(_obj.confidential).toString();
    obj.notes = _obj.notes;
    obj.emails = _obj.emails;
    //obj.created = _obj.created;
    //obj.createdBy = _obj.createdBy;
    //obj.status = _obj.status;
    obj.followUp = TrueOrFalse(_obj.followUp).toString();
    if (obj.followUp == 'true') {
        obj.follupMessage = _obj.follupMessage;
        //var time = $('#txt_FollowUp_Time').val() != '' ? $('#txt_FollowUp_Time').val() : '00:00 AM';
        //time = ConvertTo24HoursFormat(time);
        if (_obj.followUpTime != null && _obj.followUpTime != '')
            obj.followUpTime = _obj.followUpTime;
        obj.followUpEmails = _obj.followUpEmails;
        //obj.followUpDate = _obj.followUpDate;
        obj.assignedUser = _obj.assignedUser;
        obj.followupCancelled = TrueOrFalse(_obj.followupCancelled).toString();
    }

    return obj;
}

function chop_diaryNotes(str) {
    var strSub = str.substring(0, 30);
    return strSub + '...';
}

function TrueOrFalse(val) {
    return (val == 'Yes' ? true : false);
}

function CheckForUndefined(val) {
    if (typeof val != 'undefined' && val != null)
        return val;
    else
        return '';
}

function YesOrNo(Val) {
    return Val ? 'Yes' : 'No';
}

function GetFollowUPEmails(emails_Arr) {
    var strEmails = '';
    if (typeof emails_Arr != 'undefined' || emails_Arr != null)
        for (var i = 0; i < emails_Arr.length; i++) {
            strEmails += emails_Arr[i] + (i < (emails_Arr.length - 1) ? ',' : '');
        }
    return strEmails;
}

function Get_Category_Text(Val) {
    if (Val == null || Val == '')
        return '';

    var category_text = '';
    var diary_categories = JSON.parse(sessionStorage.getItem('SsnDiaryCategories'));
    if (diary_categories != null) {
        for (var i = 0; i < diary_categories.length; i++) {
            if (diary_categories[i].code == Val) {
                category_text = diary_categories[i].description;
                break;
            }
        }
    }

    return category_text;
}



/* -- Diary Notes End -- */