(($, tubes) => {
  const select_tube = $('#tube');
  const form_factor = $('#form_factor');

  $.each(tubes, (key, tube) => {
    $('<option/>', {
      val: key,
      text: tube.name
    }).appendTo(select_tube);
  });

  select_tube.change(function () {
    const key = $(this).val();
    if (key) {
      $.each(tubes[key].settings, (k, v) => {
        $('#' + k).val(v);
      });

      form_factor.submit();
    } else {
      form_factor[0].reset();
    }
  });

  form_factor.submit((event) => {
    event.preventDefault();

    let usvh = 0;
    let cpm = 0;

    const dose_input = $('#dose');
    const dose_unit_input = $('#dose_unit');
    const dose_period_input = $('#dose_period');
    const dose_period_unit_input = $('#dose_period_unit');
    const count_input = $('#count');
    const count_period_input = $('#count_period');
    const count_period_unit_input = $('#count_period_unit');

    const result = $('#result').val('?').removeClass('text-danger');
    const result_urs = $('#result_urs').html('?');
    const result_urh = $('#result_urh').html('?');
    const result_usvs = $('#result_usvs').html('?');
    const result_usvh = $('#result_usvh').html('?');
    const result_cps = $('#result_cps').html('?');
    const result_cpm = $('#result_cpm').html('?');
    const result_cpm_to_urh = $('#result_cpm_to_urh').html('?');
    const result_cpm_to_usvh = $('#result_cpm_to_usvh').html('?');
    const result_cpm_to_urs = $('#result_cpm_to_urs').html('?');
    const result_cpm_to_usvs = $('#result_cpm_to_usvs').html('?');
    const result_cps_to_urh = $('#result_cps_to_urh').html('?');
    const result_cps_to_usvh = $('#result_cps_to_usvh').html('?');
    const result_cps_to_urs = $('#result_cps_to_urs').html('?');
    const result_cps_to_usvs = $('#result_cps_to_usvs').html('?');
    const result_cps_to_10usv = $('#result_cps_to_10usv').html('?');
    const result_cps_per_urs = $('#result_cps_per_urs').html('?');

    const dose = parseFloat(dose_input.val());
    const dose_unit = dose_unit_input.val();
    const dose_period = parseFloat(dose_period_input.val());
    const dose_period_unit = dose_period_unit_input.val();
    const count = parseFloat(count_input.val());
    const count_period = parseFloat(count_period_input.val());
    const count_period_unit = count_period_unit_input.val();

    function check_input(input) {
      const value = input.val();

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
          usvh = dose / 100;
          break;

        case 'usv':
          usvh = dose;
          break;

        default:
          throw Error('Invalid dose unit');
      }

      switch (dose_period_unit) {
        case 'second':
          usvh = usvh / (dose_period / 3600);
          break;

        case 'minute':
          usvh = usvh / (dose_period / 60);
          break;

        case 'hour':
          usvh = usvh / dose_period;
          break;

        default:
          throw Error('Invalid dose period');
      }

      switch (count_period_unit) {
        case 'second':
          cpm = count / (count_period / 60);
          break;

        case 'minute':
          cpm = count / count_period;
          break;

        case 'hour':
          cpm = count / (count_period * 60);
          break;

        default:
          throw Error('Invalid count period');
      }

      result.html(dose.toFixed(2) + " " + dose_unit + "/" + dose_period.toFixed(2) + " " + dose_period_unit + " = " + count.toFixed(2) + " counts/" + count_period.toFixed(2) + " " + count_period_unit + ":");

      const urs = usvh / 3600 * 100;
      const urh = usvh * 100;
      const usvs = usvh / 3600;
      const cps = cpm / 60;

      result_urs.html(urs.toFixed(5));
      result_urh.html(urh.toFixed(5));

      result_usvs.html(usvs.toFixed(5));
      result_usvh.html(usvh.toFixed(5));

      result_cps.html(cps.toFixed(5));
      result_cpm.html(cpm.toFixed(5));

      result_cpm_to_urh.html((cpm / urh).toFixed(5));
      result_cpm_to_usvh.html((cpm / usvh).toFixed(5));

      result_cpm_to_urs.html((cpm / urs).toFixed(5));
      result_cpm_to_usvs.html((cpm / usvs).toFixed(5));

      result_cps_to_urh.html((cps / urh).toFixed(5));
      result_cps_to_usvh.html((cps / usvh).toFixed(5));

      result_cps_to_urs.html((cps / urs).toFixed(5));
      result_cps_to_usvs.html((cps / usvs).toFixed(5));

      result_cps_to_10usv.html((cps * 10. / usvh).toFixed(5));
      result_cps_per_urs.html((cps / urs).toFixed(5));
    } catch (err) {
      result.addClass('text-danger');
      result.html(err);
    }
  });
})(jQuery, tubes);
