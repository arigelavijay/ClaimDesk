$(function () {
    $.validator.addMethod('carDamage', function (value, element) {        
        if ($('#check_other').is(':checked') == true) {
            var isCarDamage = $('#car_damage').val() == 'Yes' ? true : false;
            if (isCarDamage) {
                if (value == null || value == '')
                    return false;
                else
                    return true;
            }
            else
                return true;
        }
        else
            return true;        
    }, 'This field is required');

    $.validator.addMethod("checkblankB", function (value, element) {
        if ($("#check_injury").is(":checked") == true && value == '')
            return false;
        else
            return true;
    }, "This field is required.");

    $.validator.addMethod("checkblankC", function (value, element) {
        if ($("#check_other").is(":checked") == true && value == '')
            return false;
        else
            return true;
    }, "This field is required.");

    $('#data').validate({
        onfocusout: function(e) {
            this.element(e);
        },
        rules: {
            claim_desc: {
                required: true
            },
            d_location: {
                required: true,
                carDamage: true
            }
        }
    });

    $('#data').validate().form();
});