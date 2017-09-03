function LoadLitigationComponents() {
    var dataArr = new Array();

    var obj1 = {};
    obj1.id = 1;
    obj1.firstRep = '01/02/2015 01:02 PM';
    obj1.dateFiled = '01/03/2015 01:02 PM';
    obj1.venuType = 'General Civil Court';
    obj1.caseSettled = 'No';
    obj1.action = '';
    dataArr.push(obj1);

    var obj2 = {};
    obj2.id = 2;
    obj2.firstRep = '01/04/2015 01:02 PM';
    obj2.dateFiled = '01/05/2015 01:02 PM';
    obj2.venuType = 'WC Board';
    obj2.caseSettled = 'No';
    obj2.action = '';
    dataArr.push(obj2);

    var obj3 = {};
    obj3.id = 3;
    obj3.firstRep = '05/04/2015 01:02 PM';
    obj3.dateFiled = '06/05/2015 01:02 PM';
    obj3.venuType = 'General Civil Court';
    obj3.caseSettled = 'No';
    obj3.action = '';
    dataArr.push(obj3);

    var obj4 = {};
    obj4.id = 4;
    obj4.firstRep = '07/04/2015 01:02 PM';
    obj4.dateFiled = '08/05/2015 01:02 PM';
    obj4.venuType = 'General Civil Court';
    obj4.caseSettled = 'No';
    obj4.action = '';
    dataArr.push(obj4);

    $('#tblLitigation').dataTable({
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
            { "mDataProp": "id" },
            { "mDataProp": "firstRep" },
            { "mDataProp": "dateFiled" },
            { "mDataProp": "venuType" },
            { "mDataProp": "caseSettled" },
            {
                "mDataProp": "action",
                "bSearchable": false,
                "bSortable": false,
                "mRender": function (data, type, full) {
                    var str = '';

                    str += '<a style="cursor:pointer;" data-toggle="modal" data-target=".view-litigation" onclick="viewLitigation();"><img src="images/min1.png" alt="" /></a>&nbsp;&nbsp;&nbsp;';
                    str += '<a style="cursor:pointer;" data-toggle="modal" data-target=".add-litigation"><img src="images/edit.png" alt=""  /></a>&nbsp;&nbsp;&nbsp;';
                    str += '<a style="cursor:pointer;"><img src="images/min5.png" alt="" /></a>';

                    return str;
                }
            }]
    });
}

function viewLitigation() {
    var data = {
        litigationCase: 'XYZ',
        dateFiled: '01/01/2015',
        caseSettled: 'ABC',
        dateSettled: '02/02/2015',
        firstNotice: '02/01/2015',
        contactFirstName: 'jon',
        contactLastName: 'smith',
        admittedLiability: 'some liability',
        suitFiled: 'Yes',
        venueDesc: 'venue desc...',
        venueCity: 'venue city',
        venueCounty: 'venue county',
        venueState: 'venue State',
        analysisVenue: 'analysis venue',
        venueType: 'General Civil Court',
        claimDenied: 'Yes',
        iniExReserve: 'some data',
        setAmount: '$ 5000',
        setDesc: 'description.....',
        juryAward: 'some jury award',
        juryVerdict: 'some jury verdict',
        apportionment: 'some data',
        subrogation: 'some subrogation',
        fraudIssues: 'fraud issues',
        factCategory: 'some fact category',
        factDesc: 'fact desc.......',
        issueCategory: 'xyz issue category',
        issueDesc: 'xyz desc.....',
        event: 'some event',
        eventDt: '01/01/2015',
        eventReason: 'abc xyz',
        assignedTo: 'raaz singh',
        dueDt: '06/06/2015',
        compLegRep: '',
        attorneyInvolvement: '',
        startDt: '01/01/2015',
        endDt: '02/02/2015',
        claimantLegRep: '',
        claimantattorneyInvolvement: '',
        claimantstartDt: '',
        claimantendDt: ''
    };

    $('#viewLitigation').empty();
    $('#jq-tmpl-view-litigation').tmpl(data).appendTo('#viewLitigation');
}

function btnAddLitigation() {

}