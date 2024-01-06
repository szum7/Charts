
var incomes = [
    { name: "Income", amount: 100000, from: null, to: null },
    { name: "Income to", amount: 800000, from: null, to: "2024-02" },
    { name: "Income from", amount: 50000, from: "2026-01", to: null },
    { name: "Income from-to", amount: 30000, from: "2024-04", to: "2024-12" }
];

var expenses = [
    { name: "Expense", amount: 300000, from: null, to: null },
    { name: "Expense to", amount: 40000, from: null, to: "2024-05" },
    { name: "Expense from", amount: 150000, from: "2025-02", to: null },
    { name: "Expense from-to", amount: 50000, from: "2025-02", to: "2025-07" }
];

var wealths = [
    { name: "cash1", amount: 5000000 },
    { name: "cash2", amount: 1200000 }
];

var now = "2024-01"; // "yyyy-mm"

console.log(createLabels(now, "2024-01"));
console.log(createMainData(incomes, expenses, wealths, now, "2026-06"));


function createChartData(incomes, expenses, wealths, from, to) {

    var main = createMainData(incomes, expenses, wealths, from, to);
    console.log(main);

    var data = [];

    for (var i = 0; i < main.incomeDatas.length; i++) {
        data.push({
            type: "line",
            label: main.incomeDatas[i].name,
            data: main.incomeDatas[i].points,
            fill: false
        });
    }

    for (var i = 0; i < main.expenseDatas.length; i++) {
        data.push({
            type: "line",
            label: main.expenseDatas[i].name,
            data: main.expenseDatas[i].points,
            fill: false
        });
    }

    data.push({
        type: "bar",
        label: "Flow",
        data: main.flowData,
        fill: true,
        backgroundColor: "rgb(75, 192, 192)"
    });

    data.push({
        type: "line",
        label: "Wealth",
        data: main.wealthData,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.06
    });

    return {
        labels: main.labels,
        data: data
    };

    // var data = [];

    // for (var i = 0; i < incomes.length; i++) {
    //     var item = createTransactionData(incomes[i], from, to);
    //     data.push({
    //         type: "line",
    //         label: incomes[i].name,
    //         data: item,
    //         fill: false
    //     });
    // }

    // for (var i = 0; i < expenses.length; i++) {
    //     var item = createTransactionData(expenses[i], from, to);
    //     data.push({
    //         type: "line",
    //         label: expenses[i].name,
    //         data: item,
    //         fill: false
    //     });
    // }

    // var main = createMainData(incomes, expenses, wealths, from, to);

    // data.push({
    //     type: "bar",
    //     label: "Local flow",
    //     data: main.barChartData,
    //     fill: true,
    //     backgroundColor: "rgb(75, 192, 192)"
    // });

    // data.push({
    //     type: "line",
    //     label: "Wealth",
    //     data: main.data,
    //     fill: false,
    //     borderColor: "rgb(75, 192, 192)",
    //     tension: 0.06
    // });

    // return {
    //     labels: main.labels,
    //     d: data
    // };
}

/// @obj - object
/// @from - "yyyy-mm"
/// @to - "yyyy-mm"
function createTransactionData(obj, from, to) {
    var points = [];

    var currD = strToDate(from);

    while (currD < strToDate(to)) {

        if (isInDataRange(currD, obj.from, obj.to)) {
            points.push(obj.amount);
        } else {
            points.push(null);
        }

        currD = addAMonth(currD);
    }

    return points;
}

/// @currentDate - Date
/// @rangeFrom - "yyyy-mm"
/// @rangeTo - "yyyy-mm"
function isInDataRange(currentDate, rangeFrom, rangeTo) {
    return (!rangeFrom && !rangeTo) ||
    (!rangeFrom && rangeTo && strToDate(rangeTo) >= currentDate) ||
    (!rangeTo && rangeFrom && strToDate(rangeFrom) <= currentDate) ||
    (rangeFrom && strToDate(rangeFrom) <= currentDate && strToDate(rangeTo) >= currentDate);
}

function initTransactionArray(incomes) {
    var array = [];
    for (var i = 0; i < incomes.length; i++) {
        array.push({
            name: incomes[i].name, 
            points: []
        });
    }
    return array;
}

/// @incomes - object[]
/// @expenses - object[]
/// @wealths - object[]
/// @from - "yyyy-mm"
/// @to - "yyyy-mm"
function createMainData(incomes, expenses, wealths, from, to) {
    var startingWealth = wealths.reduce((accumulator, currentObject) => {
        return accumulator + currentObject.amount;
    }, 0);

    var wealthData = [];
    var labels = [];
    var incomeDatas = initTransactionArray(incomes);
    var expenseDatas = initTransactionArray(expenses);
    var flowData = [];

    var currW = startingWealth;
    var currDate = strToDate(from);

    while (currDate < strToDate(to)) {

        var local = 0;

        for (var i = 0; i < incomes.length; i++) {
            var e = incomes[i];
            if (isInDataRange(currDate, e.from, e.to)) {
                currW += e.amount;
                local += e.amount;
                incomeDatas[i].points.push(e.amount);
            } else {
                incomeDatas[i].points.push(null);
            }
        }

        for (var i = 0; i < expenses.length; i++) {
            var e = expenses[i];
            if (isInDataRange(currDate, e.from, e.to)) {
                currW -= e.amount;
                local -= e.amount;
                expenseDatas[i].points.push(-e.amount);
            } else {
                expenseDatas[i].points.push(null);
            }
        }

        // incomes.forEach(e => {
        //     if (isInDataRange(currDate, e.from, e.to)) {
        //         currW += e.amount;
        //         local += e.amount;
        //         incomeData.push(e.amount);
        //     } else {
        //         incomeData.push(null);
        //     }
        // });

        // expenses.forEach(e => {
        //     if (isInDataRange(currDate, e.from, e.to)) {
        //         currW -= e.amount;
        //         local -= e.amount;
        //         expenseData.push(e.amount);
        //     } else {
        //         expenseData.push(null);
        //     }
        // });

        labels.push(dateToLiteral(currDate));
        wealthData.push(currW);
        flowData.push(local);

        currDate = addAMonth(currDate);
    }

    return {
        labels: labels,
        incomeDatas: incomeDatas,
        expenseDatas: expenseDatas,
        flowData: flowData,
        wealthData: wealthData
    };
}

function createLabels(from, to) {

    var count = monthsDiff(strToDate(from), strToDate(to));
    console.log(count);
    var labels = [];

    for (var i = 0; i <= count; i++) {

        var date = strToDate(from);
        date.setMonth(date.getMonth() + i);

        labels.push(date.getFullYear() + "-" + getMonthLiteral(date));
    }

    return labels;
}

function addAMonth(date) {
    date.setMonth(date.getMonth() + 1);
    return date;
}

function dateToLiteral(date) {
    return date.getFullYear() + "-" + getMonthLiteral(date);
}

function getMonthLiteral(date) {
    var month = date.getMonth() + 1;
    if (month < 10) {
        return "0" + month;
    }
    return month;
}

function monthsDiff(date1, date2) {
    var months;
    months = (date2.getFullYear() - date1.getFullYear()) * 12;
    months -= date1.getMonth();
    months += date2.getMonth();
    return months <= 0 ? 0 : months;
}

function strToDate(str) {
    return new Date(str + "-01");
}

const getOrCreateTooltip = (chart) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div');

    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
        tooltipEl.style.borderRadius = '3px';
        tooltipEl.style.color = 'white';
        tooltipEl.style.opacity = 1;
        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.transform = 'translate(-50%, 0)';
        tooltipEl.style.transition = 'all .1s ease';

        const table = document.createElement('table');
        table.style.margin = '0px';

        tooltipEl.appendChild(table);
        chart.canvas.parentNode.appendChild(tooltipEl);
    }

    return tooltipEl;
};

const externalTooltipHandler = (context) => {
    // Tooltip Element
    const { chart, tooltip } = context;
    const tooltipEl = getOrCreateTooltip(chart);

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
    }

    // Set Text
    if (tooltip.body) {
        const titleLines = tooltip.title || [];
        const bodyLines = tooltip.body.map(b => b.lines);

        const tableHead = document.createElement('thead');

        titleLines.forEach(title => {
            const tr = document.createElement('tr');
            tr.style.borderWidth = 0;

            const th = document.createElement('th');
            th.style.borderWidth = 0;
            const text = document.createTextNode(title);

            th.appendChild(text);
            tr.appendChild(th);
            tableHead.appendChild(tr);
        });

        const tableBody = document.createElement('tbody');
        bodyLines.forEach((body, i) => {
            const colors = tooltip.labelColors[i];

            const span = document.createElement('span');
            span.style.background = colors.backgroundColor;
            span.style.borderColor = colors.borderColor;
            span.style.borderWidth = '2px';
            span.style.marginRight = '10px';
            span.style.height = '10px';
            span.style.width = '10px';
            span.style.display = 'inline-block';

            const tr = document.createElement('tr');
            tr.style.backgroundColor = 'inherit';
            tr.style.borderWidth = 0;

            const td = document.createElement('td');
            td.style.borderWidth = 0;

            const text = document.createTextNode(body);

            td.appendChild(span);
            td.appendChild(text);
            tr.appendChild(td);
            tableBody.appendChild(tr);
        });

        const tableRoot = tooltipEl.querySelector('table');

        // Remove old children
        while (tableRoot.firstChild) {
            tableRoot.firstChild.remove();
        }

        // Add new children
        tableRoot.appendChild(tableHead);
        tableRoot.appendChild(tableBody);
    }

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
};


const el = document.getElementById("myChart");
var dd = createChartData(incomes, expenses, wealths, now, "2026-08");

const data = {
    labels: dd.labels, //["HTML", "CSS", "JAVASCRIPT", "CHART.JS", "JQUERY", "BOOTSTRP", "END"],
    datasets: dd.data
    // [
    //     {
    //         label: "My First Dataset",
    //         data: [65, 59, 80, 81, -56, -55, 40],
    //         fill: false,
    //         borderColor: "rgb(75, 192, 192)",
    //         tension: 0.06
    //     },
    //     {
    //         label: "My First Dataset",
    //         data: [65, 59, -56, -55, 40, 1, 2],
    //         fill: false,
    //         borderColor: "rgb(75, 192, 192)",
    //         tension: 0.06
    //     }
    // ]
};

const config = {
    data: data,
    options: {
        interaction: {
            intersect: false,
            mode: "index",
        },
        plugins: {
            title: {
                display: true,
                text: 'Chart.js Line Chart - External Tooltips'
            },
            tooltip: {
                enabled: false,
                position: 'nearest',
                external: externalTooltipHandler
            }            
        }
    }
};


new Chart(
    el,
    config
);