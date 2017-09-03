// login session variables
var userId = sessionStorage.getItem("userid");
var token = sessionStorage.getItem("token");
var locationId = sessionStorage.getItem("locationId");
var incLocId = sessionStorage.getItem("incLocId");
var firstName = sessionStorage.getItem("firstName");
var lastName = sessionStorage.getItem("lastName");
var sellocationid = '';
var selmanagerid = '';
var gcnt = '';

var showTables = false;

function authentication() {
    if (userId == '' || userId == null) {
        apprise("Please Login Before Proceed.")
        window.location = "index.html";
    }

}
//test
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

function division() {
    var promise = apiGetCall('ClaimDeskWeb/services/v1/location/division/' + locationId);
    $('#ddlDivision').append('<option></option>');
    $.when(promise).done(function (data) {
        
        data.sort(SortByStoreId);
        $.each(data, function (i, item) {                        
                $('#ddlDivision').append('<option value="' + item.locationId + '">' + item.storeId + '</option>');
        });
    });
}

function divisionSummary() {
    var promise = apiGetCall('ClaimDeskWeb/services/v1/location/division/' + locationId);
    
    $.when(promise).done(function (data) {

        data.sort(SortByStoreId);
        $.each(data, function (i, item) {            
            $('#ddlDivision').append('<option value="' + item.locationId + '">' + item.storeId + '</option>');
        });

        setTimeout(function () {
            $('#ddlDivision').multiselect({
                includeSelectAllOption: true
                /*,
                onChange: function (element, checked) {
                    var brands = $('#ddlDivision option:selected');
                    debugger;
                    var selected = [];
                    $(brands).each(function (index, brand) {
                        selected.push([$(this).val()]);
                        debugger;
                    });

                    console.log(selected);
                }*/
            });
        }, 500);
    });
}

function SortByStoreId(a, b) {
    if (a.storeId > b.storeId) return 1;
    if (a.storeId < b.storeId) return -1;    
    return 0;
}

/* Employee Injuries */
function YTDInjuryByArea(divisionId) {
    var YearArray = [2014, 2015];
    var promise = apiPostCall('ClaimDeskWeb/services/v1/reportSearch/YTDInjuryByArea/' + divisionId, YearArray);
    $.when(promise).done(function (data) {
        var categoriesArr = new Array();
        var newArray = new Array();

        if (typeof data[0].location != 'undefined' && data[0].location != null) {
            for (var i = 0; i < data[0].location.length; i++) {

                var obj = {};
                var dataArr = new Array();

                obj.name = data[0].location[i].location.storeId;

                categoriesArr.push(data[0].location[i].location.storeId);
                for (var k = 0; k < data.length; k++) {
                    dataArr.push(data[k].location[i].count);
                }

                obj.data = dataArr;
                newArray.push(obj);
            }
        }

        var yearArr1 = new Array();
        var yearArr2 = new Array();
        for (var i = 0; i < newArray.length; i++) {
            yearArr1.push(newArray[i].data[0]);
            yearArr2.push(newArray[i].data[1]);
        }

        var SeriesData = new Array();

        var dataLabels = {
            enabled: true,
            rotation: 0,
            color: '#FFFFFF',
            align: 'center', // one decimal
            y: 16, // 10 pixels down from the top
            style: {
                fontSize: '8px',
                fontFamily: 'Verdana, sans-serif'
            }
        }


        var temp = {};
        temp.name = YearArray[0];
        temp.data = yearArr1;
        temp.dataLabels = dataLabels;

        SeriesData.push(temp);

        var temp2 = {};
        temp2.name = YearArray[1];
        temp2.data = yearArr2;
        temp2.dataLabels = dataLabels;

        SeriesData.push(temp2);


        $('#tblDiv').addClass('myChart');
        $('#tblDiv').highcharts({
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            legend: {
                enabled: true
            },
            chart: {
                type: 'column'
            },
            title: {
                text: 'Injury By Divisions'
            },
            xAxis: {
                type: 'category',
                labels: {
                    style: {
                        fontSize: '9px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                },
                categories: categoriesArr,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'No Of Claims'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: SeriesData
        });
        
        if (showTables) {
            var html = '';
            html += '<table class="table table-bordered table-hover">';
            html += '<caption><b>Injury By Divisions</b></caption>';
            html += '<thead>';
            html += '<tr>';
            html += '<th >Location ID</th>';
            html += '<th style="text-align:center">' + SeriesData[0].name + '</th>';
            html += '<th style="text-align:center">' + SeriesData[1].name + '</th>';
            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';
            for (var i = 0; i < SeriesData[0].data.length; i++) {
                html += '<tr>';
                html += '<td>' + categoriesArr[i] + '</td>';
                html += '<td style="text-align:center">' + SeriesData[0].data[i] + '</td>';
                html += '<td style="text-align:center">' + SeriesData[1].data[i] + '</td>';
                html += '</tr>';
            }
            html += '</tbody>';

            $('#tblDiv_1').html(html);
        }
        
    });
}

function YTDInjuryTypeReport(divisionId) {
    var promise = apiGetCall('ClaimDeskWeb/services/v1/reportSearch/InjuryTypeReport/' + divisionId);
    $.when(promise).done(function (data) {

        if (data.length > 0) {
            var array = new Array();
            var newArray = new Array();
            for (var i = 0; i < data.length; i++) {


                var arr = new Array();
                arr.push(data[i].code.description);
                arr.push(data[i].count);

                newArray.push(arr);
                array.push(data[i].code.description.substring(0, 45));
            }

            $('#tblDiv2').addClass('myChart').parent().show();
            $('#tblDiv2').highcharts({
                navigation: {
                    buttonOptions: {
                        enabled: false
                    }
                },
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Injury Types'
                },
                xAxis: {
                    type: 'category',
                    labels: {
                        rotation: -90,
                        style: {
                            fontSize: '9px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    },
                    categories: array
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'No Of Claims'
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: 'No Claims <b>{point.y}</b>'
                },
                series: [{
                    name: '',
                    data: newArray,
                    dataLabels: {
                        enabled: true,
                        rotation: 0,
                        color: '#FFFFFF',
                        align: 'center',
                        y: 16, 
                        style: {
                            fontSize: '8px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                }]
            });
        }
        else {
            $('#tblDiv2').empty().removeClass('myChart').parent().hide();
        }
    });

}

function InjuryByDivisionReport(divisionId) {    
    var promise = apiGetCall('ClaimDeskWeb/services/v1/reportSearch/InjuryByDivisionReport/' + divisionId);
    $.when(promise).done(function (data) {
        if (data.length > 0) {
            var array = new Array();
            var newArray = new Array();
            for (var i = 0; i < data.length; i++) {

                array.push('P' + data[i].period + ' - ' + data[i].year);
                newArray.push(data[i].count);
            }
            
            $('#tblDiv3').addClass('myChart');
            $('#tblDiv3').highcharts({
                navigation: {
                    buttonOptions: {
                        enabled: false
                    }
                },
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'Reports By Division'
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    step: 0,
                    type: 'category',
                    labels: {
                        rotation: -45,
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    },
                    categories: array
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'No Of Claims'
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: 'No Claims <b>{point.y}</b>'
                },
                series: [{
                    name: array,
                    data: newArray,
                    dataLabels: {
                        enabled: true,
                        rotation: 0,
                        color: 'black',
                        align: 'right',
                        format: '{point.y}',
                        y: 10, 
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                }]
            });

            if (showTables) {
                var html = '';
                html += '<table class="table table-bordered table-hover">';
                html += '<caption><b>Reports By Division</b></caption>';
                html += '<thead>';
                html += '<tr>';
                html += '<th>Period</th>';
                html += '<th>No Of Claims</th>';
                html += '</tr>';
                html += '</thead>';
                html += '<tbody>';
                for (var i = 0; i < array.length; i++) {
                    html += '<tr>';
                    html += '<td>' + array[i] + '</td>';
                    html += '<td>' + newArray[i] + '</td>';
                    html += '</tr>';
                }
                html += '</tbody>';

                $('#tblDiv3_1').html(html).parent().show();
            }
        }
        else {
            $('#tblDiv3').empty().removeClass('myChart').parent().hide();
        }
    });
}

function HighRiskStores(divisionId) {
    var promise = apiGetCall('ClaimDeskWeb/services/v1/reportSearch/HighRiskStores/' + divisionId);
    $.when(promise).done(function (data) {        
        var html = "";
        html += '<table id="tbl_1" class="table table-bordered table-hover">';
        html += '<caption><b>High Risk Stores 3+</b></caption>';
        html += '<thead>';
        html += '<th>Store #</th>';
        html += '<th>Rolling 12</th>';
        html += '</thead><tbody>';
        var hasRiskStore = false;
        for (var i = 0; i < data.length; i++) {
            if (data[i].count > 3) {
                html += '<tr>';
                html += '<td>' + data[i].location.storeId + '</td>';
                html += '<td>' + data[i].count + '</td>';
                html += '</tr>';

                hasRiskStore = true;
            }
        }
        

        if (!hasRiskStore) {
            html += '<tr>';
            html += '<td colspan="2">No High Risk Stores</td>';
            html += '</tr>';
        }
        html += '</tbody></table>';
        $('#tblDiv6').html(html).parent().show();
        

    });
}

function ChargeBackReport(divisionId) {
    var html = '';
    html += '<table id="tbl_3" class="table table-bordered table-hover">';
    html += '<caption><b>Charge Back Report</b></caption>';
    html += '<thead>';
    html += '<tr>';
    html += '<th >Area</th>';
    html += '<th>Store</th>';
    html += '<th>Employee Name</th>';
    html += '<th>Date Of Injury</th>';
    html += '<th>Injury Type</th>';
    html += '<th>Period</th>';
    html += '<th>Charge Back</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';

    var promise = apiGetCall('ClaimDeskWeb/services/v1/reportSearch/chargeBackReport/' + divisionId + '/2015');
    $.when(promise).done(function (data) {
        if (data.length > 0) {
            var totalChargeBack = 0;
            for (var i = 0; i < data.length; i++) {                
                html += '<tr>';
                html += '<td>' + (typeof data[i].areaBranchId != 'undefined' ? data[i].areaBranchId : '') + '</td>';
                html += '<td>' + data[i].branchid + '</td>';
                html += '<td>' + data[i].employeeName + '</td>';
                html += '<td>' + UtcToLocal(data[i].incidentDate, 'MM/DD/YYYY') + '</td>';
                html += '<td>' + (typeof data[i].injuryType != 'undefined' ? data[i].injuryType : '') + '</td>';
                html += '<td>' + data[i].period + '</td>';
                html += '<td>' + '$ ' + data[i].chargeBack + '</td>';
                html += '</tr>';

                totalChargeBack = totalChargeBack + (typeof data[i].chargeBack != 'undefined' ? data[i].chargeBack : 0);
            }

            html += '<tr>';
            html += '<td><b>Grand Total YTD</b></td>';
            html += '<td></td>';
            html += '<td></td>';
            html += '<td></td>';
            html += '<td></td>';
            html += '<td></td>';
            html += '<td>$ ' + totalChargeBack + '</td>';
            html += '</tr>';
            html += '</tbody>';
            $('#tblDiv4').html(html).parent().show();
        }
        else {
            $('#tblDiv4').empty().parent().hide();
        }
    });
}

/* Employee Injuries */


/* Executive Summary */
function btnGen_OnClick() {
    var divisions = $('#ddlDivision').val();
    var divisionsText = getSelectedText();
    var period = $('#ddlPeriod').val();

    if (divisions == null || divisions == '') {
        alert('please select atleast one division..');
        return;
    }

    if (period == null || period == '') {
        alert('please select period');
        return;
    }

    if (divisions != null && divisions.length <= 3) {
        employeeInjuryByCompare(divisions, divisionsText, period);//tblDiv5
        InjuryByDivisionReportMultiple(divisions, divisionsText);//tblDiv6
        CompareInjuryType(divisions, divisionsText);//tblDiv8
        CompanyInjuryfrequency(divisions, divisionsText);//tblDiv11
        $('#btnExport').removeAttr('disabled').removeClass('btn-default disabled');
    }
    else {
        alert('Sorry... You cannot select more than 3 Divisions');
    }
}

function employeeInjuryByCompare(divisions, textArr, period) {

    var YearArray = [2013, 2014, 2015];
    var promises = [];
    divisions.forEach(function (division) {
        promises.push(function () {
            return apiPostCall('ClaimDeskWeb/services/v1/reportSearch/EmployeeInjuryByPeriod/' + division + '/' + period, YearArray);
        });
    });

    $.when(all(promises)).then(function (data) {
        var categories = ['P' + period + '-2013', 'P' + period + '-2014', 'P' + period + '-2015'];
        var seriesArr = new Array();
        for (var m = 0; m < data.length; m++) {
            var obj = {};
            obj.name = textArr[m];
            var dataArr = new Array();
            for (var k = 0; k < YearArray.length; k++) {
                dataArr.push((typeof data[m][YearArray[k]] != 'undefined' ? data[m][YearArray[k]] : 0));
            }
            obj.data = dataArr;
            seriesArr.push(obj);
        }       
        
        $('#tblDiv5').addClass('myChart');
        $('#tblDiv5').highcharts({
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            chart: {
                type: 'column'
            },
            title: {
                text: 'Employee Injuries By Period'
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Total Claims Count'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                x: -30,
                verticalAlign: 'top',
                y: 25,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.x + '</b><br/>' +
                        this.series.name + ': ' + this.y + '<br/>' +
                        'Total: ' + this.point.stackTotal;
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        style: {
                            textShadow: '0 0 3px black'
                        }
                    }
                }
            },
            series: seriesArr
        });
        
        if (showTables) {
            var html = '';
            html += '<table class="table table-bordered table-hover">';
            html += '<caption><b>Employee Injuries By Period</b></caption>';
            html += '<thead>';
            html += '<tr>';
            html += '<th></th>';
            for (var i = 0; i < categories.length; i++) {
                html += '<th style="text-align:center">' + categories[i] + '</th>';
            }
            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';
            for (var i = 0; i < seriesArr.length; i++) {
                html += '<tr>';
                html += '<td>' + seriesArr[i].name + '</td>';
                for (var j = 0; j < seriesArr[i].data.length; j++) {
                    html += '<td style="text-align:center">' + seriesArr[i].data[j] + '</td>';
                }
                html += '</tr>';
            }
            html += '</tbody>';

            $('#tblDiv5_1').html(html);
        }


    });    
}

var gArr = new Array();
function InjuryByDivisionReportMultiple(divisions, textArr) {

    var promises = [];
    divisions.forEach(function (division) {
        promises.push(function () {
            return apiGetCall('ClaimDeskWeb/services/v1/reportSearch/InjuryByDivisionReport/' + division);
        });
    });

    $.when(all(promises)).then(function (results) {
        var seriesArr = new Array();
        var categories = new Array();
        for (var i = 0; i < results.length; i++) {
            for (var j = 0; j < results[i].length; j++) {

                var gObj = {};
                gObj.period = results[i][j].period;
                gObj.year = results[i][j].year;

                checkAndAdd(gObj);                
            }

        }

        gArr.sort(SortPeriodArr);

        var catFlag = true;
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var jObj = {};
            jObj.name = textArr[i];

            var dataArr = new Array();
            for (var j = 0; j < gArr.length; j++) {
                var isExists = false;
                for (var k = 0; k < result.length; k++) {
                    if (gArr[j].period == result[k].period && gArr[j].year == result[k].year) {
                        isExists = true;
                        dataArr.push(result[k].count);
                        //break;
                    }
                }
                if (!isExists) {
                    dataArr.push(0);
                    isExists = !isExists;
                }
                if (catFlag)
                    categories.push('P' + gArr[j].period + '-' + gArr[j].year);
            }
            jObj.data = dataArr;            
            //jObj.pointStart = 1;
            catFlag = false;
            seriesArr.push(jObj);
        }
        
        $('#tblDiv6').addClass('myChart');

        $('#tblDiv6').highcharts({
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            chart: {
                type: 'line'
            },
            title: {
                text: 'Employee Injury Trend'
            },
            xAxis: {
                type: 'category',
                labels: {
                    rotation: -45,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                },
                categories: categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'No. of Claims'
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: true
                }
            },
            series: seriesArr,
            legend: {
                enabled: true
            },
            tooltip: {
                pointFormat: 'No Claims <b>{point.y}</b>'
            },
        });

        if (showTables) {
            var html = '';
            html += '<table class="table table-bordered table-hover">';
            html += '<caption><b>Employee Injuries By Period</b></caption>';
            html += '<thead>';
            html += '<tr>';
            html += '<th></th>';
            for (var i = 0; i < seriesArr.length; i++) {
                html += '<th style="text-align:center">' + seriesArr[i].name + '</th>';
            }

            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';
            for (var i = 0; i < categories.length; i++) {
                html += '<tr>';
                html += '<td>' + categories[i] + '</td>';
                for (var j = 0; j < seriesArr.length; j++) {

                    html += '<td style="text-align:center">' + seriesArr[j].data[i] + '</td>';
                }
                html += '</tr>';
            }


            $('#tblDiv6_1').html(html);
        }
    });

}

function AddInjuryType(type) {
    var isExits = false;
    for (var i = 0; i < injuryTypeArr.length; i++) {
        if (injuryTypeArr[i].code == type.code) {
            isExits = true;
            break;
        }
    }

    if (!isExits)
        injuryTypeArr.push(type);
}
var injuryTypeArr = new Array();
function CompareInjuryType(divisions, textArr) {
    var YearArray = [2014, 2015];
    var promises = [];
    divisions.forEach(function (division) {
        promises.push(function () {
            return apiGetCall('ClaimDeskWeb/services/v1/reportSearch/InjuryTypeReport/' + division, YearArray);
        });
    });


    $.when(all(promises)).then(function (results) {
        var seriesArr = new Array();
        var categories = new Array();
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            for (var j = 0; j < result.length; j++) {
                var temp = {};
                temp.code = result[j].code.code;
                temp.description = result[j].code.description;
                AddInjuryType(temp);
                categories.push(result[j].code.description.substring(0, 45));
            }
        }

        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var jObj = {};
            jObj.name = textArr[i];


            var dataArr = new Array();
            for (var j = 0; j < injuryTypeArr.length; j++) {

                var isExists = false;

                for (var k = 0; k < result.length; k++) {
                    if (injuryTypeArr[j].code == result[k].code.code) {
                        isExists = true;
                        var t = new Array();
                        t.push(result[k].code.description);
                        t.push(result[k].count);
                        dataArr.push(t);
                        break;
                    }
                }

                if (!isExists) {
                    var t = new Array();
                    t.push(injuryTypeArr[j].description);
                    t.push(0);

                    dataArr.push(t);
                    isExists = !isExists;
                }
            }

            jObj.data = dataArr;
            jObj.dataLabels = {
                enabled: true
            }
            seriesArr.push(jObj);
        }
        $('#tblDiv8').addClass('myChart');
        $('#tblDiv8').highcharts({
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            chart: {
                type: 'column'
            },
            title: {
                text: 'Injury Count By Year'
            },
            xAxis: {
                type: 'category',
                labels: {
                    rotation: -90,
                    style: {
                        fontSize: '9px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                },
                categories: categories,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'No of injuries'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                },
                bar: {
                    dataLabels: {
                        enabled: true,
                        style: {
                            fontSize: "8px"
                        }
                    }
                }
            },
            series: seriesArr,
        });
    });    
}

function injuryCountArrSort(a, b) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}

function CompanyInjuryfrequency(divisions, textArr) {
    $('.myCss').remove();
    var promises = [];
    divisions.forEach(function (division) {
        promises.push(function () {
            return apiGetCall('ClaimDeskWeb/services/v1/reportSearch/ComanyInjuryFrequency/' + division);
        });
    });

    var injuryCountArr = new Array();
    $.when(all(promises)).then(function (results) {
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var keys = Object.keys(result);
            for (var k = 0; k < keys.length; k++) {
                var keyVal = parseInt(keys[k]);
                if (injuryCountArr.indexOf(keyVal) < 0) {
                    injuryCountArr.push(keyVal);
                }
            }
        }

        injuryCountArr.sort(injuryCountArrSort);
        var seriesArr = new Array();
        var loopCount = (injuryCountArr.length > 10 ? 10 : injuryCountArr.length);
        for (var j = 0; j < results.length; j++) {
            var obj = {};
            obj.name = textArr[j];
            var dataArr = new Array();
            for (var i = 0; i < loopCount; i++) {

                dataArr.push(typeof results[j][injuryCountArr[i]] != 'undefined' ? results[j][injuryCountArr[i]] : 0);

            }
            obj.data = dataArr;
            seriesArr.push(obj);
        }
        
        $('#tblDiv11').addClass('myChart');
        $('#tblDiv11').highcharts({
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Company Injury frequency'
            },
            xAxis: {
                type: 'category',
                categories: injuryCountArr,
                labels: {
                    rotation: -0,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                },
                title: {
                    text: 'Number Of Injuries'
                },
                tickInterval: 1
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Number Of Locations'
                }
            },
            legend: {
                enabled: true
            },
            tooltip: {
                pointFormat: ' Injuries Of <b>{point.y}</b> locations'
            },
            plotOptions: {
                series: {
                    pointWidth: 5//width of the column bars irrespective of the chart size
                },
                bar: {
                    dataLabels: {
                        enabled: true,
                        style: {
                            fontSize: "8px"
                        }
                    }
                }
            },
            series: seriesArr
        });

        if (showTables) {
            var html = '';
            html += '<table class="table table-bordered table-hover">';
            html += '<caption><b>Company Injury frequency</b></caption>';
            html += '<thead>';
            html += '<tr>';
            html += '<th></th>';
            for (var i = 0; i < seriesArr.length; i++) {
                html += '<th style="text-align:center">' + seriesArr[i].name + '</th>';
            }
            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';
            for (var i = 0; i < injuryCountArr.length; i++) {
                html += '<tr>';
                html += '<td>' + injuryCountArr[i] + '</td>';
                for (var j = 0; j < seriesArr.length; j++) {

                    html += '<td style="text-align:center">' + seriesArr[j].data[i] + '</td>';
                }
                html += '</tr>';
            }
            $('#tblDiv11_1').html(html);
        }
    });
}
/* Executive Summary */







function EmployeeInjuryByPeriod(divisionId) {
    $('#tblDiv').html(getTableTemplate('5'));
    var promise = apiPostCall('ClaimDeskWeb/services/v1/reportSearch/EmployeeInjuryByPeriod/' + divisionId + '/5');
    $.when(promise).done(function (data) {

        var html = '';
        //for (var i = 0; i < data.length; i++) {
        //    html += '<tr>';
        //    html += '<td>' + data[i].month + ' - ' + data[i].year + '</td>';
        //    html += '<td>' + data[i].count + '</td>';
        //    html += '</tr>';
        //}
        $('#tablechart').html(html);
        //$('.highchart').highchartTable();
    });
}

var categoriesArrCompare = new Array();
function getFormatedArray(data, selectedDiv) {    
    
    var newArray = new Array();
    if (typeof data[0].location != 'undefined' && data[0].location != null) {
        for (var i = 0; i < data[0].location.length; i++) {
            var obj = {};
            var dataArr = new Array();

            obj.name = data[0].location[i].location.storeId;

            categoriesArrCompare.push(data[0].location[i].location.storeId);
            for (var k = 0; k < data.length; k++) {
                dataArr.push(data[k].location[i].count);
            }

            obj.data = dataArr;
            newArray.push(obj);
        }
    }

    var resultArr = new Array();
    if (newArray != null && newArray.length > 0) {
        for (var i = 0; i < newArray[0].data.length; i++) {
            var val = 0;
            for (j = 0; j < newArray.length; j++) {
                val = val + newArray[j].data[i];
            }
            resultArr.push(val);
        }
    }
    else {
        resultArr = [0,0,0];
    }
    var temp = {};
    temp.name = selectedDiv;
    temp.data = resultArr;

    
    return temp;
    
}




function checkAndAdd(obj) {
    var isExits = false;
    for (var i = 0; i < gArr.length; i++) {
        if (gArr[i].period == obj.period && gArr[i].year == obj.year) {
            isExits = true;
            break;
        }
    }

    if (!isExits)
        gArr.push(obj);
}

function SortPeriodArr(a, b) {
    //if (a[1] > b[1]) return -1;
    //if (a[1] < b[1]) return 1;
    //return 0;    

    if (a.year < b.year)
        return -1;

    if (a.year == b.year) {
        if (a.period < b.period)
            return -1;

        if (a.period > b.period)
            return 1;
    }

    if (a.year > a.year)
        return 1;

    return 0;
}











function getCount(obj) {
    
    var count = 0;
    if (typeof obj != 'undefined' && obj != null) {
        for (var i = 0; i < obj.length; i++) {
            count += parseInt(obj[i].count);
        }
    }
    return count;
}

function apiPostCall(url, obj) {   

    var def = $.Deferred();
    $('#pr_new').css('display', 'block');
    $.ajax({
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        url: hostname + url,
        data: JSON.stringify(obj),
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (report) {

            $('#pr_new').css('display', 'none');
            $('.highchart').css('display', 'block');
            def.resolve(report);
        },
        error: function (err) {
            def.reject('Error');
        }
    });
    return def.promise();
}

function apiGetCall(url) {

    var def = $.Deferred();
    $('#pr_new').css('display', 'block');
    $.ajax({
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        url: hostname + url,
        headers: {
            "token": token,
            "userid": userId,
            "locationId": locationId
        },
        success: function (report) {
            $('#pr_new').css('display', 'none');
            $('.highchart').css('display', 'block');
            def.resolve(report);
        },
        error: function (err) {
            def.reject('error');
            $('#pr_new').css('display', 'none');
        }
    });
    return def.promise();
}

var gDisplay = 'display:none';
function getTableTemplate(type, storeId1, storeId2) {

    var html = '';

    //html += '<caption>Graph example</caption>';
    if (type == '1') {
        html += '<table id="tbl_' + type + '" class="highchart_' + type + ' table table-bordered" style="' + gDisplay + '" data-graph-container-before="1" data-graph-type="column" data-graph-datalabels-enabled="1">';
        html += '<caption>Injury By Location</caption>';
        html += '<thead>';
        html += '<tr>';
        html += '<th >Location ID</th>';
        html += '<th>Injuries in year 2013</th>';
        html += '<th>Injuries in year 2014</th>';
        html += '<th>Injuries in year 2015</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody id="tablechart_' + type + '">';
        html += '</tbody>';

    }
    else if (type == '2') {
        html += '<table id="tbl_2" class="highchart_2 table table-bordered" style="' + gDisplay + '" data-graph-container-before="1" data-graph-type="column" data-graph-xaxis-rotation="-25" data-graph-datalabels-enabled="1">';//
        html += '<caption>Injury Types</caption>';
        html += '<thead>';
        html += '<tr>';
        html += '<th >Injury Type</th>';
        html += '<th>Number Of Injuries</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody id="tablechart_' + type + '">';
        html += '</tbody>';
    }
    else if (type == '3') {
        html += '<table id="tbl_3" class="highchart_3 table table-bordered" style="' + gDisplay + '" data-graph-container-before="1" data-graph-type="line" data-graph-datalabels-enabled="1">';//data-graph-xaxis-rotation="-35"
        html += '<caption>Reports By Division</caption>';
        html += '<thead>';
        html += '<tr>';
        html += '<th >Month</th>';
        html += '<th>Number Of Injuries</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody id="tablechart_' + type + '">';
        html += '</tbody>';
    }
    else if (type == '4') {
        html += '<table id="tbl_' + type + '" class="highchart_' + type + ' table table-bordered">';
        html += '<caption><b>Charge Back Report</b></caption>';
        html += '<thead>';
        html += '<tr>';
        html += '<th >Area</th>';
        html += '<th>Store</th>';
        html += '<th>Employee Name</th>';
        html += '<th>Date Of Injury</th>';
        html += '<th>Injury Type</th>';
        html += '<th>Period</th>';
        html += '<th>Charge Back</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody id="tablechart_' + type + '">';
        html += '</tbody>';
    }
    else if (type == '5') {
        html += '<table class="highchart table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th >Area</th>';
        html += '<th>Store</th>';
        html += '<th>Employee Name</th>';
        html += '<th>Date Of Injury</th>';
        html += '<th>Injury Type</th>';
        html += '<th>Period</th>';
        html += '<th>Charge Back</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody id="tablechart">';
        html += '</tbody>';
    }
    else if (type == '6') {
        html += '<table class="highchart_6 table table-bordered" style="' + gDisplay + '" data-graph-container-before="1" data-graph-type="column" data-graph-datalabels-enabled="1" data-graph-datalabels-color="white">';//
        html += '<caption>Employee Injuries By Period</caption>';
        html += '<thead>';
        html += '<tr>';

        html += '<th></th>';
        html += '<th data-graph-stack-group="1">' + storeId1 + '</th>';
        html += '<th data-graph-stack-group="1" data-graph-datalabels-color="blue">' + storeId2 + '</th>';

        html += '</tr>';
        html += '</thead>';
        html += '<tbody id="tablechart_' + type + '">';
        html += '</tbody>';
    }

    else if (type == '7') {
        html += '<table class="highchart_7 table table-bordered" style="' + gDisplay + '" data-graph-container-before="1" data-graph-type="line" data-graph-datalabels-enabled="1" data-graph-datalabels-color="white">';//
        html += '<caption>Employee Injury Trend</caption>';
        html += '<thead>';
        html += '<tr>';

        html += '<th >Location ID</th>';
        html += '<th data-graph-stack-group="1">Month</th>';
        html += '<th data-graph-stack-group="1">Number Of Injuries</th>';

        html += '</tr>';
        html += '</thead>';
        html += '<tbody id="tablechart_' + type + '">';
        html += '</tbody>';
    }
    else if (type == '8') {
        html += '<table class="highchart_8 table table-bordered" data-graph-type="column" style="' + gDisplay + '" data-graph-container-before="1" data-graph-datalabels-enabled="1" data-graph-xaxis-rotation="-25">';//
        html += '<caption>Injury Count By Year</caption>';
        html += '<thead>';
        html += '<tr>';

        html += '<th>Injury Type</th>';
        html += '<th>Number Of Injuries</th>';
        html += '<th>Number Of Injuries</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody id="tablechart_' + type + '">';
        html += '</tbody>';
    }
    else if (type == '9') {
        html += '<table id="tbl_' + type + '" class="highchart_' + type + ' table table-bordered" style="' + gDisplay + '" data-graph-container-before="1" data-graph-type="column" data-graph-datalabels-enabled="1" data-graph-xaxis-rotation="-25">';
        html += '<caption>Claims Count Of Locations</caption>';
        html += '<thead>';
        html += '<tr>';
        html += '<th></th>';
        html += '<th>Location</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody id="tablechart_' + type + '">';
        html += '</tbody>';

    }
    html += '</table>';
    return html;
}

function LocationByClaimsCount(divisionId) {
    
    var promise = apiPostCall('ClaimDeskWeb/services/v1/reportSearch/YTDInjuryByArea/' + divisionId);
    $.when(promise).done(function (data) {        
        var html = "";
        html += '<table id="tbl_2" class="table table-bordered">';
        html += '<caption><b>Claims Count Of Locations</b></caption>';
        html += '<tbody>';
        html += '<th>Location Id</th>';
        html += '<th>Store Id</th>';
        html += '<th>Type</th>';
        html += '<th>Count</th>';
        html += '<tbody>';

        if (data[2].location != null) {
            for (var i = 0; i < data[2].location.length; i++) {
                var _count = data[2].location[i].count;
                if (true) {

                    html += '<tr>';
                    html += '<td>' + data[2].location[i].location.locationId + '</td>';
                    html += '<td>' + data[2].location[i].location.storeId + '</td>';
                    html += '<td>' + data[2].location[i].location.type + '</td>';
                    html += '<td>' + data[2].location[i].count + '</td>';
                    html += '</tr>';
                }
            }
        }
        html += '</tbody></table>';

        $('#tblDiv7').html(html);        
    });
}





function Comparator(a, b) {
    if (a[1] > b[1]) return -1;
    if (a[1] < b[1]) return 1;
    return 0;
}

function myhighChart(id, obj, chartType) {
    $(id).highcharts({
        navigation: {
            buttonOptions: {
                enabled: false
            }
        },
        chart: {
            type: chartType
        },
        title: {
            text: 'Claims Count Of Locations'
        },
        subtitle: {
            text: ''//'Source: <a href="http://en.wikipedia.org/wiki/List_of_cities_proper_by_population">Wikipedia</a>'
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -0,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            },
            title: {
                text: 'Locations'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Number Of Claims'//'Population (millions)'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'No Claims <b>{point.y}</b>'
        },
        series: [{
            name: '',//'Population',
            data: obj,
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    });
}

function divisionChange() {

}




function getSelectedText() {
    var brands = $('#ddlDivision option:selected');
    var seletedTextArr = new Array();
    $(brands).each(function (index, brand) {
        seletedTextArr.push([$(this).text()]);
    });
    return seletedTextArr;
}

var all = function (array) {
    var deferred = $.Deferred();
    var fulfilled = 0, length = array.length;
    var results = [];

    if (length === 0) {
        deferred.resolve(results);
    } else {
        array.forEach(function (promise, i) {
            $.when(promise()).then(function (value) {
                results[i] = value;
                fulfilled++;
                if (fulfilled === length) {
                    deferred.resolve(results);
                }
            });
        });
    }

    return deferred.promise();
};

