const comparison = document.querySelector('.comparison');
if (comparison) {
  const slider = comparison.querySelector('.compare-input');
  const render = () => {
    comparison.style.setProperty('--split', slider.value + '%');
    slider.setAttribute('aria-valuetext', slider.value + '% monochrome');
  };
  slider.addEventListener('input', render);
  render();
}
