import { compile, derivative } from 'mathjs';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title } from 'chart.js';
import { validateRange, findZeros, generatePlotData } from './utils.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title);

document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyze-btn');
    analyzeBtn.addEventListener('click', analyzeFunction);

    document.getElementById('toggle-zeros').addEventListener('change', function() {
        analyzeFunction();  
    });

    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId + '-tab').classList.add('active');
        });
    });
});

function analyzeFunction() {
  const expr = getInputValue('function-input');
  const xMin = parseFloat(getInputValue('x-min'));
  const xMax = parseFloat(getInputValue('x-max'));

  if (!validateRange(xMin, xMax)) {
      alert('Invalid x range.');
      return;
  }

  try {
      const parsed = compile(expr);
      const values = generatePlotData(parsed, xMin, xMax);

      const showZeros = document.getElementById('toggle-zeros').checked;
      const zeros = showZeros ? findZeros(parsed, xMin, xMax) : [];

      renderChart(expr, values, zeros);
      displayDerivative(expr);
      displayZeros(parsed, zeros, showZeros);
  } catch (e) {
      console.error('Error parsing function:', e);
      alert('Invalid function expression.');
  }
}

function getInputValue(id) {
  return document.getElementById(id).value;
}

function renderChart(expr, values, zeros) {
  const ctx = document.getElementById('function-chart').getContext('2d');

  if (window.functionChart) {
      window.functionChart.destroy();
  }

  window.functionChart = new Chart(ctx, {
      type: 'line',
      data: {
          datasets: [
              {
                  label: `f(x) = ${expr}`,
                  data: values,
                  borderColor: 'rgb(115, 145, 145)',
                  borderWidth: 2,
                  tension: 0.1,
                  parsing: false,
              },
              {
                  label: 'Zeros',
                  data: zeros.map(x => ({ x, y: 0 })),
                  borderColor: 'red',
                  backgroundColor: 'red',
                  pointRadius: 5,
                  showLine: false,
              }
          ]
      },
      options: {
          responsive: true,
          scales: {
              x: {
                  type: 'linear',
                  position: 'bottom',
                  title: { display: true, text: 'x' }
              },
              y: {
                  title: { display: true, text: 'f(x)' }
              }
          }
      }
  });
}

function displayDerivative(expr) {
  const derivativeExpr = derivative(expr, 'x').toString();
  document.querySelector('.function-preview').textContent = `f'(x) = ${derivativeExpr}`;
}

//show zeros
function displayZeros(parsed, zeros, showZeros) {
  const resultDiv = document.getElementById('zeros-result');
  resultDiv.innerHTML = '';

  if (showZeros && zeros.length > 0) {
      zeros.forEach((x, i) => {
          const fx = parsed.evaluate({ x });
          const item = document.createElement('div');
          item.className = 'result-item';
          item.innerHTML = `
              <div class="result-label">x${i + 1} = ${x.toFixed(3)}</div>
              <div class="result-value">f(${x.toFixed(3)}) = ${fx.toFixed(3)}</div>
          `;
          resultDiv.appendChild(item);
      });
  } else if (showZeros) {
      const item = document.createElement('div');
      item.className = 'result-item';
      item.textContent = 'No zeros found in the given range.';
      resultDiv.appendChild(item);
  }
}