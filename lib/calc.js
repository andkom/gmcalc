(() => {
  let tubes = [];

  const form = document.querySelector('#form');
  const tubeSelect = document.querySelector('#tube');

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

  function findTubeBySlug(slug) {
    return tubes.find((tube) => tube.slug === slug);
  }

  function applyHash() {
    const slug = window.location.hash.replace(/^#/, '').trim();
    if (!slug) {
      return;
    }
    const tube = findTubeBySlug(slug);
    if (!tube) {
      return;
    }
    tubeSelect.value = slug;
    tubeSelect.dispatchEvent(new Event('change', {bubbles: true}));
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

    function pluralize(value, one, other) {
      return Math.abs(value) === 1 ? one : other;
    }

    try {
      checkInput(doseInput);
      checkInput(dosePeriodInput);
      checkInput(countInput);
      checkInput(countPeriodInput);

      let doseUnitLabel, dosePeriodLabel, countPeriodLabel;
      const countLabel = pluralize(count, 'count', 'counts');

      switch (doseUnit) {
        case 'ur':
          usvh = dose / 100;
          doseUnitLabel = 'µR';
          break;
        case 'usv':
          usvh = dose;
          doseUnitLabel = 'µSv';
          break;
        default:
          throw new Error('Invalid dose unit');
      }

      switch (dosePeriodUnit) {
        case 's':
          usvh = usvh / (dosePeriod / 3600);
          dosePeriodLabel = pluralize(dosePeriod, 'second', 'seconds');
          break;
        case 'm':
          usvh = usvh / (dosePeriod / 60);
          dosePeriodLabel = pluralize(dosePeriod, 'minute', 'minutes');
          break;
        case 'h':
          usvh = usvh / dosePeriod;
          dosePeriodLabel = pluralize(dosePeriod, 'hour', 'hours');
          break;
        default:
          throw new Error('Invalid dose period');
      }

      switch (countPeriodUnit) {
        case 's':
          cpm = count / (countPeriod / 60);
          countPeriodLabel = pluralize(countPeriod, 'second', 'seconds');
          break;
        case 'm':
          cpm = count / countPeriod;
          countPeriodLabel = pluralize(countPeriod, 'minute', 'minutes');
          break;
        case 'h':
          cpm = count / (countPeriod * 60);
          countPeriodLabel = pluralize(countPeriod, 'hour', 'hours');
          break;
        default:
          throw new Error('Invalid count period');
      }

      const urs = usvh / 3600 * 100;
      const urh = usvh * 100;
      const usvs = usvh / 3600;
      const cps = cpm / 60;

      result.classList.remove('text-danger');
      result.textContent =
        formatNumber(dose, 2) + ' ' + doseUnitLabel + '/' +
        (dosePeriod !== 1 ? formatNumber(dosePeriod, 2) + ' ' : '') + dosePeriodLabel + ' = ' +
        formatNumber(count, 2) + ' ' + countLabel + '/' +
        (countPeriod !== 1 ? formatNumber(countPeriod, 2) + ' ' : '') + countPeriodLabel;

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

  function getTubeLabel(tube) {
    const parts = [tube.name];
    if (tube.originalName) {
      parts.push('(' + tube.originalName + ')');
    }
    if (tube.source) {
      parts.push('[' + tube.source + ']');
    }
    return parts.join(' ');
  }

  function populateTubes() {
    tubes.forEach((tube) => {
      const option = document.createElement('option');
      option.value = tube.slug;
      option.textContent = getTubeLabel(tube);
      tubeSelect.appendChild(option);
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    calculate();
  });

  tubeSelect.addEventListener('change', (event) => {
    const key = event.target.value;

    if (key) {
      const tube = findTubeBySlug(key);
      if (!tube) {
        return;
      }
      Object.entries(tube.data).forEach(([key, value]) => {
        const input = document.querySelector('#' + key);
        if (input) {
          input.value = value;
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

  async function init() {
    try {
      const response = await fetch('data/tubes.json', {cache: 'no-cache'});
      if (!response.ok) {
        throw new Error('Failed to load tubes data');
      }
      tubes = await response.json();
      populateTubes();
      applyHash();
      calculate();
    } catch (err) {
      result.classList.add('text-danger');
      result.textContent = err.message || String(err);
    }
  }

  init();
})();
