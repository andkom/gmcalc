$(function() {
    var tubes = window.tubes || {};
    var select_tube = $('#tube');
    var form_factor = $('#form_factor');

    $.each(tubes, function(key, tube) {
        $('<option/>', {
            val: key,
            text: tube.name
        }).appendTo(select_tube);
    });

    select_tube.change(function() {
        var key = $(this).val();
                          console.log(key);
        if (key) {
            $.each(tubes[key].settings, function(k, v) {
                $('#' + k).val(v);
            });

            form_factor.submit();
        } else {
            form_factor[0].reset();
        }
    });

    form_factor.submit(function(event) {
        event.preventDefault();

        var usvh = 0;
        var cpm = 0;

        var dose_input = $('#dose');
        var dose_unit_input = $('#dose_unit');
        var dose_period_input = $('#dose_period');
        var dose_period_unit_input = $('#dose_period_unit');
        var count_input = $('#count');
        var count_period_input = $('#count_period');
        var count_period_unit_input = $('#count_period_unit');

        var result_input = $('#result').val('?').css('color', '');
        var result_urs_input = $('#result_urs').val('?');
        var result_urh_input = $('#result_urh').val('?');
        var result_usvs_input = $('#result_usvs').val('?');
        var result_usvh_input = $('#result_usvh').val('?');
        var result_cps_input = $('#result_cps').val('?');
        var result_cpm_input = $('#result_cpm').val('?');
        var result_cpm_to_urh_input = $('#result_cpm_to_urh').val('?');
        var result_cpm_to_usvh_input = $('#result_cpm_to_usvh').val('?');
        var result_cpm_to_urs_input = $('#result_cpm_to_urs').val('?');
        var result_cpm_to_usvs_input = $('#result_cpm_to_usvs').val('?');
        var result_cps_to_urh_input = $('#result_cps_to_urh').val('?');
        var result_cps_to_usvh_input = $('#result_cps_to_usvh').val('?');
        var result_cps_to_urs_input = $('#result_cps_to_urs').val('?');
        var result_cps_to_usvs_input = $('#result_cps_to_usvs').val('?');
        var result_cps_to_10usv_input = $('#result_cps_to_10usv').val('?');
        var result_cps_per_urs_input = $('#result_cps_per_urs').val('?');

        var dose = parseFloat(dose_input.val());
        var dose_unit = dose_unit_input.val();
        var dose_period = parseFloat(dose_period_input.val());
        var dose_period_unit = dose_period_unit_input.val();
        var count = parseFloat(count_input.val());
        var count_period = parseFloat(count_period_input.val());
        var count_period_unit = count_period_unit_input.val();

        function check_input(input) {
            var value = input.val();

            if (!value) {
                input.focus();
                throw 'Please enter dose';
            }

            if (isNaN(value)) {
                input.focus();
                throw 'Please enter valid number';
            }

            if (value <= 0) {
                input.focus();
                throw 'Please enter positive number greater than zero';
            }
        }

        try {
            check_input(dose_input);
            check_input(dose_period_input);
            check_input(count_input);
            check_input(count_period_input);

            switch (dose_unit) {
                case 'ur':
                    usvh = dose / 100.;
                    break;

                case 'usv':
                    usvh = dose / 1.;
                    break;

                default:
                    throw 'Invalid dose unit';
            }

            switch (dose_period_unit) {
                case 'second':
                    usvh = usvh / (dose_period / 3600.);
                    break;

                case 'minute':
                    usvh = usvh / (dose_period / 60.);
                    break;

                case 'hour':
                    usvh = usvh / dose_period;
                    break;

                default:
                    throw 'Invalid dose period';
            }

            switch (count_period_unit) {
                case 'second':
                    cpm = count / (count_period / 60.);
                    break;

                case 'minute':
                    cpm = count / count_period;
                    break;

                case 'hour':
                    cpm = count / (count_period * 60.);
                    break;

                default:
                    throw 'Invalid count period';
            }

            result_input.val(dose.toFixed(2) + " " + dose_unit + "/" + dose_period.toFixed(2) + " " + dose_period_unit + " = " + count.toFixed(2) + " counts/" + count_period.toFixed(2) + " " + count_period_unit);

            var urs = usvh / 3600. * 100.;
            var urh = usvh * 100.;
            var usvs = usvh / 3600.;
            var cps = cpm / 60.;

            result_urs_input.val(urs.toFixed(5));
            result_urh_input.val(urh.toFixed(5));

            result_usvs_input.val(usvs.toFixed(5));
            result_usvh_input.val(usvh.toFixed(5));

            result_cps_input.val(cps.toFixed(5));
            result_cpm_input.val(cpm.toFixed(5));

            result_cpm_to_urh_input.val((cpm / urh).toFixed(5));
            result_cpm_to_usvh_input.val((cpm / usvh).toFixed(5));

            result_cpm_to_urs_input.val((cpm / urs).toFixed(5));
            result_cpm_to_usvs_input.val((cpm / usvs).toFixed(5));

            result_cps_to_urh_input.val((cps / urh).toFixed(5));
            result_cps_to_usvh_input.val((cps / usvh).toFixed(5));

            result_cps_to_urs_input.val((cps / urs).toFixed(5));
            result_cps_to_usvs_input.val((cps / usvs).toFixed(5));

            result_cps_to_10usv_input.val((cps * 10. / usvh).toFixed(5));
            result_cps_per_urs_input.val((cps / urs).toFixed(5));
        } catch (err) {
            result_input.css('color', 'red');
            result_input.val(err);
        }
    });
});