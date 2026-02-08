(() => {
  const tube = document.querySelector('#tube');
  const form = document.querySelector('#form');

  const doseInput = document.querySelector('#dose');
  const doseUnitInput = document.querySelector('#doseUnit');
  const dosePeriodInput = document.querySelector('#dosePeriod');
  const dosePeriodUnitInput = document.querySelector('#dosePeriodUnit');
  const countInput = document.querySelector('#count');
  const countPeriodInput = document.querySelector('#countPeriod');
  const countPeriodUnitInput = document.querySelector('#countPeriodUnit');

  const result = document.querySelector('#result');
  const resultUrs = document.querySelector('#resultUrs');
  const resultUrh = document.querySelector('#resultUrh');
  const resultUsvs = document.querySelector('#resultUsvs');
  const resultUsvh = document.querySelector('#resultUsvh');
  const resultCps = document.querySelector('#resultCps');
  const resultCpm = document.querySelector('#resultCpm');
  const resultCpmToUrh = document.querySelector('#resultCpmToUrh');
  const resultCpmToUsvh = document.querySelector('#resultCpmToUsvh');
  const resultCpmToUrs = document.querySelector('#resultCpmToUrs');
  const resultCpmToUsvs = document.querySelector('#resultCpmToUsvs');
  const resultCpsToUrh = document.querySelector('#resultCpsToUrh');
  const resultCpsToUsvh = document.querySelector('#resultCpsToUsvh');
  const resultCpsToUrs = document.querySelector('#resultCpsToUrs');
  const resultCpsToUsvs = document.querySelector('#resultCpsToUsvs');
  const resultCpsTo10Usv = document.querySelector('#resultCpsTo10Usv');
  const resultCpsPerUrs = document.querySelector('#resultCpsPerUrs');

  const resultCells = [
    resultUrs, resultUrh, resultUsvs, resultUsvh, resultCps, resultCpm, resultCpmToUrh, resultCpmToUsvh, resultCpmToUrs,
    resultCpmToUsvs, resultCpsToUrh, resultCpsToUsvh, resultCpsToUrs, resultCpsToUsvs, resultCpsTo10Usv, resultCpsPerUrs
  ];

  function applyHash() {
    const key = window.location.hash.replace(/^#/, '').trim();

    if (!key || !key in tubes) {
      return;
    }

    tube.value = key;
    tube.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function calculate() {
    let usvh = 0;
    let cpm = 0;

    const dose = parseFloat(doseInput.value);
    const doseUnit = doseUnitInput.value;
    const dosePeriod = parseFloat(dosePeriodInput.value);
    const dosePeriodUnit = dosePeriodUnitInput.value;
    const count = parseFloat(countInput.value);
    const countPeriod = parseFloat(countPeriodInput.value);
    const countPeriodUnit = countPeriodUnitInput.value;

    function checkInput(input) {
      const value = input.value;

      if (!value) {
        input.focus();
        throw new Error('Please enter dose');
      }

      if (Number.isNaN(Number(value))) {
        input.focus();
        throw new Error('Please enter valid number');
      }

      if (Number(value) <= 0) {
        input.focus();
        throw new Error('Please enter positive number greater than zero');
      }
    }

    function formatNumber(value, decimals) {
      if (Number.isNaN(value) || !Number.isFinite(value)) {
        return '?';
      }

      const fixed = value.toFixed(decimals);
      return fixed.replace(/\.?0+$/, '');
    }

    try {
      checkInput(doseInput);
      checkInput(dosePeriodInput);
      checkInput(countInput);
      checkInput(countPeriodInput);

      switch (doseUnit) {
        case 'ur':
          usvh = dose / 100;
          break;
        case 'usv':
          usvh = dose;
          break;
        default:
          throw new Error('Invalid dose unit');
      }

      switch (dosePeriodUnit) {
        case 'second':
          usvh = usvh / (dosePeriod / 3600);
          break;
        case 'minute':
          usvh = usvh / (dosePeriod / 60);
          break;
        case 'hour':
          usvh = usvh / dosePeriod;
          break;
        default:
          throw new Error('Invalid dose period');
      }

      switch (countPeriodUnit) {
        case 'second':
          cpm = count / (countPeriod / 60);
          break;
        case 'minute':
          cpm = count / countPeriod;
          break;
        case 'hour':
          cpm = count / (countPeriod * 60);
          break;
        default:
          throw new Error('Invalid count period');
      }

      result.classList.remove('text-danger');
      result.textContent =
        formatNumber(dose, 2) + ' ' + doseUnit + '/' +
        formatNumber(dosePeriod, 2) + ' ' + dosePeriodUnit + ' = ' +
        formatNumber(count, 2) + ' counts/' +
        formatNumber(countPeriod, 2) + ' ' + countPeriodUnit;

      const urs = usvh / 3600 * 100;
      const urh = usvh * 100;
      const usvs = usvh / 3600;
      const cps = cpm / 60;

      resultUrs.textContent = formatNumber(urs, 3);
      resultUrh.textContent = formatNumber(urh, 3);
      resultUsvs.textContent = formatNumber(usvs, 3);
      resultUsvh.textContent = formatNumber(usvh, 3);
      resultCps.textContent = formatNumber(cps, 3);
      resultCpm.textContent = formatNumber(cpm, 3);
      resultCpmToUrh.textContent = formatNumber(cpm / urh, 3);
      resultCpmToUsvh.textContent = formatNumber(cpm / usvh, 3);
      resultCpmToUrs.textContent = formatNumber(cpm / urs, 3);
      resultCpmToUsvs.textContent = formatNumber(cpm / usvs, 3);
      resultCpsToUrh.textContent = formatNumber(cps / urh, 3);
      resultCpsToUsvh.textContent = formatNumber(cps / usvh, 3);
      resultCpsToUrs.textContent = formatNumber(cps / urs, 3);
      resultCpsToUsvs.textContent = formatNumber(cps / usvs, 3);
      resultCpsTo10Usv.textContent = formatNumber(cps * 10. / usvh, 3);
      resultCpsPerUrs.textContent = formatNumber(cps / urs, 3);
    } catch (err) {
      result.classList.add('text-danger');
      result.textContent = err.message || String(err);

      resultCells.forEach((cell) => {
        cell.textContent = '?';
      });
    }
  }

  Object.keys(tubes).forEach((key) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = tubes[key].name;
    tube.appendChild(option);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    calculate();
  });

  tube.addEventListener('change', (event) => {
    const key = event.target.value;

    if (key) {
      const settings = tubes[key].settings;

      Object.keys(settings).forEach((settingKey) => {
        const input = document.querySelector('#' + settingKey);
        if (input) {
          input.value = settings[settingKey];
        }
      });

      window.location.hash = key;
      calculate();
    } else {
      window.location.hash = '';
      form.reset();
      calculate();
    }
  });

  form.addEventListener('reset', () => {
    window.setTimeout(() => {
      window.location.hash = '';
      calculate();
    }, 0);
  });

  window.addEventListener('hashchange', applyHash);

  applyHash();
  calculate();
})();
