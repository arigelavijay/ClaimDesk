function btnSearch_OnClick() {
    var lastName = $('#txtLastName').val();
    var firstName = $('#txtFirstName').val();
    var incDt = $('#txtIncDt').val();    
    var city = $('#txtCity').val();
    var state = $('#ddlState').val();
    var occupation = $('#txtOccupation').val();
    var employeeId = $('#txtEmployeeId').val();
    var claimType = $('#ddlClaimType').val();
    var fromDate = $('#frmDate').val();
    var toDate = $('#toDate').val();
    var strNumber = $('#srch_store').val();
    var bodyPart = $('#bodyPart').val();
    var injury = $('#injury').val();
    var claimCause = $('#claimCause').val();
    var injuryType = $('#injuryType').val();
    var denied = $('#denied').val();
    var litigated = $('#litigated').val();
    var settled = $('#settled').val();
    var claimNumber = $('#txtClaimNumber').val();

    if (isNullOrEmpty(lastName) && isNullOrEmpty(firstName) && isNullOrEmpty(incDt) && isNullOrEmpty(city) &&
        isNullOrEmpty(state) && isNullOrEmpty(occupation) && isNullOrEmpty(employeeId) && isNullOrEmpty(claimType) && isNullOrEmpty(fromDate) && isNullOrEmpty(toDate) &&
        isNullOrEmpty(strNumber) && isNullOrEmpty(bodyPart) && isNullOrEmpty(injury) && isNullOrEmpty(claimCause) && isNullOrEmpty(injuryType) && isNullOrEmpty(denied) &&
        isNullOrEmpty(litigated) && isNullOrEmpty(settled) && isNullOrEmpty(claimNumber)) {
        $('#errStatusMsg').fadeIn();

    }
    else {
        $('#errStatusMsg').fadeOut();
        var jObj = {};
        if (!isNullOrEmpty(lastName))
            jObj.lastName = lastName;

        if (!isNullOrEmpty(firstName))
            jObj.firstName = firstName;

        if (!isNullOrEmpty(incDt))
            jObj.incDt = incDt;        

        if (!isNullOrEmpty(city))
            jObj.city = city;

        if (!isNullOrEmpty(state))
            jObj.state = state;

        if (!isNullOrEmpty(occupation))
            jObj.occupation = occupation;

        if (!isNullOrEmpty(employeeId))
            jObj.employeeId = employeeId;

        if (!isNullOrEmpty(claimType))
            jObj.claimType = claimType;

        if (!isNullOrEmpty(fromDate))
            jObj.fromDate = fromDate;

        if (!isNullOrEmpty(toDate))
            jObj.toDate = toDate;

        if (!isNullOrEmpty(strNumber))
            jObj.strNumber = strNumber;

        if (!isNullOrEmpty(bodyPart))
            jObj.bodyPart = bodyPart;

        if (!isNullOrEmpty(injury))
            jObj.injury = injury;

        if (!isNullOrEmpty(claimCause))
            jObj.claimCause = claimCause;

        if (!isNullOrEmpty(injuryType))
            jObj.injuryType = injuryType;

        if (!isNullOrEmpty(denied))
            jObj.denied = denied;

        if (!isNullOrEmpty(litigated))
            jObj.litigated = litigated;

        if (!isNullOrEmpty(settled))
            jObj.settled = settled;

        if (!isNullOrEmpty(claimNumber))
            jObj.claimNumber = claimNumber;

        alert(JSON.stringify(jObj));
        console.log(JSON.stringify(jObj));

    }
}

function isNullOrEmpty(str) {
    if (str != null && str != '')
        return false;
    else
        return true;
}
//
function getLocationId(LocationId) {

    var array = new Array("bodyPart", "injury", "claimCause", "injuryType", "denied", "litigated", "settled");
    for (i = 0; i < array.length; i++) {
        var cntrlId = array[i];
        //var url = $("#" + array[i])[0].getAttribute('data-url');
        var url = $("#" + array[i]).attr('data-url');
        getData(url, cntrlId, LocationId);
    }
}

function getData(url, cntrlId, LocationId) {
    $.ajax({
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        url: hostname + url + LocationId,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (result) {
            $('#' + cntrlId).empty().html('<option></option>');
            $.each(result, function (res, val) {
                $('#' + cntrlId).append('<option val="' + val.code + '">' + val.description + '</option>');
            });
        }
    });
}