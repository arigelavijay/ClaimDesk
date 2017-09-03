/*
$(document).ready(function () {
    
});
*/
function LoadTasksComponents() {
	var dataArr = new Array();

    var obj1 = {};
    obj1.taskId = 941;
    obj1.description = 'follow up information of the';
    obj1.assignedTo = 'Admin, El Polo Loco';
    obj1.dueDate = '08/05/2015 10:57 PM';
    obj1.taskCompleted = 'Yes';
    obj1.action = '';

    dataArr.push(obj1);

    var obj2 = {};
    obj2.taskId = 942;
    obj2.description = 'disability';
    obj2.assignedTo = 'Admin, El Polo Loco';
    obj2.dueDate = '08/05/2015 11:21 PM';
    obj2.taskCompleted = 'Yes';
    obj2.action = '';

    dataArr.push(obj2);    

    $('#tblTasks').dataTable({
        "bProcessing": true,
        "bPaginate": false,
        "bLengthChange": true,
        "bFilter": false,
        "bSort": true,
        "bInfo": false,
        "bAutoWidth": true,
        "sPaginationType": "full_numbers",
        "iDisplayLength": 10,
        "aaData": dataArr,
        //"aoColumnDefs": [{ bSortable: false, aTargets: [-1, 0] }],
        "aoColumns": [
            { "mDataProp": "taskId" },
            { "mDataProp": "description" },
            { "mDataProp": "assignedTo" },
            { "mDataProp": "dueDate" },
            { "mDataProp": "taskCompleted" },
            {
                "mDataProp": "action",                
                "bSearchable": false,
                "bSortable": false,
                "mRender": function (data, type, full) {
                    var str = '';

                    str += '<a style="cursor:pointer;" data-toggle="modal" data-target=".view-task" onclick="viewTask();"><img src="images/min1.png" alt="" /></a>&nbsp;&nbsp;&nbsp;';
                    str += '<a style="cursor:pointer;" data-toggle="modal" data-target=".add-task"><img src="images/edit.png" alt=""  /></a>&nbsp;&nbsp;&nbsp;';
                    str += '<a style="cursor:pointer;"><img src="images/min5.png" alt="" /></a>';

                    return str;
                }
            }]
    });
}

function GenerateTaskToEmails(val) {
    taks_to_email_count = taks_to_email_count + 1;
    var html = '';
    html += '<div class="row" id="Task_To_Email_' + taks_to_email_count + '">';
    if (taks_to_email_count == 0)
        html += '<div class="col-xs-1"><label class="myLable" for="txt_Task_To_Email_' + taks_to_email_count + '">To</label></div>';
    else
        html += '<div class="col-xs-1"><label class="myLable" for="txt_Task_To_Email_' + taks_to_email_count + '">&nbsp;</label></div>';
    html += '<div class="col-xs-9"><input type="text" id="txt_Task_To_Email_' + taks_to_email_count + '" name="txt_Task_To_Email_' + taks_to_email_count + '" class="planeTextFild toemailCss to_email_validations" value="' + val + '"><span class="errMsgLbl pull-right" style="color: red;"></span></div>'
    if (taks_to_email_count == 0)
        html += '<div class="col-xs-2"><input type="button" id="btnTaskToEmailAdd_' + taks_to_email_count + '" class="add buttonNext newSave" onclick="btn_Task_To_Email_Add_OnClick(this);" name="btnTaskToEmailAdd_' + taks_to_email_count + '" value="" /><button class="buttonNext newSave emailClearCss" type="button" onclick="btn_tasktoemail_Clear(this);" style="display:none">Clear</button></div>';
    else
        html += '<div class="col-xs-2"><input type="button" id="btnTaskToEmailRemove_' + taks_to_email_count + '" class="remove buttonNext newSave" onclick="btn_Task_To_Email_Remove_OnClick(this);" name="btnTaskToEmailRemove_' + taks_to_email_count + '" value="" /></div>';


    html += '</div>';
    $(html).appendTo('#taskToEmail');
}

var taks_to_email_count = -1;
function ReinitialiseTaskToEmailCount() {
    taks_to_email_count = -1;
    $('#taskToEmail').empty();
}

function btn_Task_To_Email_Add_OnClick(obj) {
    taks_to_email_count = taks_to_email_count + 1;
    var html = '';
    html += '<div class="row" id="Task_To_Email_' + taks_to_email_count + '">';
    if (taks_to_email_count == 0)
        html += '<div class="col-xs-1"><label class="myLable" for="txt_Task_To_Email_' + taks_to_email_count + '">To</label></div>';
    else
        html += '<div class="col-xs-1"><label class="myLable" for="txt_Task_To_Email_' + taks_to_email_count + '">&nbsp;</label></div>';

    html += '<div class="col-xs-9"><input type="text" id="txt_Task_To_Email_' + taks_to_email_count + '" name="txt_Task_To_Email_' + taks_to_email_count + '" class="planeTextFild toemailCss to_email_validations" value=""><span class="errMsgLbl pull-right" style="color: red;"></span></div>'

    if (taks_to_email_count == 0)
        html += '<div class="col-xs-2"><input type="button" id="btnTaskToEmailAdd_' + taks_to_email_count + '" class="add buttonNext newSave" onclick="btn_Task_To_Email_Add_OnClick(this);" name="btnTaskToEmailAdd_' + taks_to_email_count + '" value="" /><button class="buttonNext newSave emailClearCss" type="button" onclick="btn_tasktoemail_Clear(this);" style="display:none">Clear</button></div>';
    else
        html += '<div class="col-xs-2"><input type="button" id="btnTaskToEmailRemove_' + taks_to_email_count + '" class="remove buttonNext newSave" onclick="btn_Task_To_Email_Remove_OnClick(this);" name="btnTaskToEmailRemove_' + taks_to_email_count + '" value="" /></div>';


    html += '</div>';
    $(html).appendTo('#taskToEmail');
}

function btn_Task_To_Email_Remove_OnClick(obj) {
    var task_to_email = obj.id.split('_')[1];
    $('#Task_To_Email_' + task_to_email).hide().empty();
}

function btnAddTask() {
    ReinitialiseTaskToEmailCount();
    GenerateTaskToEmails('');
}

function viewTask() {
    var dataArr = new Array();

    var obj = {};
    obj.id = 1;
    obj.createdBy = 'Simmons,Erica';
    obj.createdOn = '07/08/2015 02:08 PM';
    obj.dueDate = '07/28/2015 02:20 PM';
    obj.assignedTo = 'Simmons,Erica';
    obj.completed = 'Yes';
    obj.updatedBy = 'Simmons,Erica';
    obj.updatedTime = '07/08/2015 02:08 PM';
    obj.description = 'jQuery, at its core, is a DOM (Document Object Model) manipulation library. The DOM is a tree-structure representation of all the elements of a web-page and jQuery simplifies the syntax for finding, selecting, and manipulating these DOM elements. For example, jQuery can be used for finding an element in the document with a certain property (e.g. all elements with an h1 tag), changing one or more of its attributes (e.g. color, visibility), or making it respond to an event (e.g. a mouse click).';
    obj.history = [
        {
            email: 'xyz@ymail.com',
            sentTime: '07/08/2015 02:08 PM'
        },
        {
            email: 'abc@ymail.com',
            sentTime: '15/08/2015 02:44 PM'
        }
    ];

    dataArr.push(obj);

    var obj2 = {};
    obj2.id = 2;
    obj2.createdBy = 'Simmons,Erica';
    obj2.createdOn = '07/08/2015 02:08 PM';
    obj2.dueDate = '07/28/2015 02:20 PM';
    obj2.assignedTo = 'Simmons,Erica';
    obj2.completed = 'Yes';
    obj2.updatedBy = 'Simmons,Erica';
    obj2.updatedTime = '07/08/2015 02:08 PM';
    obj2.description = 'Ajax enabled service is a service hat can be called from ajax client side script. You dont need to go to the codebehind to call it. Until and unless you have a requirement to call the service from client script you neednt go for a ajax enabled service.';

    dataArr.push(obj2);

    var data = {};
    data.tasks = dataArr;
    
    $('#viewTaskBody').empty();

    $("#jq-tmpl-viewtask").tmpl(data, {
        hasHistory: function (i) {
            return (typeof this.data.tasks[i]['history'] != 'undefined' && this.data.tasks[i]['history'].length) > 0 ? true : false;
        }
    }).appendTo('#viewTaskBody');
}
