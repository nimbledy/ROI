let chart = null;

window.onload = () => {
    updateChart('daily');
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => updateChart(currentPeriod));
    });
};

let currentPeriod = 'daily';

async function fetchChartData(period) {
    const response = await fetch('output.json');
    const data = await response.json();
    return data[period];
}

function getSelectedCoins() {
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    return Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.id);
}

async function updateChart(period) {
    const data = await fetchChartData(period);
    const selectedCoins = getSelectedCoins();
    
    const datasets = data.datasets.filter(dataset => selectedCoins.includes(dataset.label));

    if (chart) {
        chart.destroy();
    }

    const ctx = document.getElementById('roiChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    currentPeriod = period;  // Update the current period
}