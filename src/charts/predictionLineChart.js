const el = document.getElementById('myChart');

const data = {
    labels: ["HTML", "CSS", "JAVASCRIPT", "CHART.JS", "JQUERY", "BOOTSTRP", "END"],
    datasets: [{
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.06
    }]
};

const config = {
    type: 'line',
    data: data,
    options: {}
};


new Chart(
    el,
    config
);