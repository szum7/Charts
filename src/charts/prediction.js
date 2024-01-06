/* 
 * # ========
 * #  README
 * # ========
 * 
 * ## About
 * 
 * "Prediction" chart. Predicts the amount of cash you'll have each month based on incomes and expenses.
 * Use an input.js file for the data input. See parameters documentation below.
 * 
 * ## Parameters
 * 
 * @now
 *  type: string
 *  format: "yyyy-mm"
 *  description: The current year and month.
 * 
 * @incomes
 *  type: object[]
 *  example: [{ name: "transaction", amount: 100, from: "2021-01", to: null }]
 *  template: { name: "", amount: 0, from: "", to: "" }
 * 
 * @expenses
 *  type: object[]
 *  example: [{ name: "transaction", amount: 100, from: "2021-01", to: null }]
 * 
 * @wealth
 *  description: The amount of wealth at the last second of the previous' month last day. In other words: (@now - 1s)
 * 
 * 
 * ## Results
 * 
 * @@Points
 *  description: In terms of wealth, a point marks the amount of cash you're going to have at the end of that month (last day, last sec) after paying every expense and receiving every incomes in that month.
 * 
 */

function createChartData(incomes, expenses, wealths, from, to) {

    var main = createPointsAndLabels(incomes, expenses, wealths, from, to);

    var data = [];

    for (var i = 0; i < main.incomeDatas.length; i++) {
        data.push({
            type: "line",
            label: main.incomeDatas[i].name,
            data: main.incomeDatas[i].points,
            fill: false,
            borderColor: "rgba(111, 237, 76, 0.25)",
            backgroundColor: "rgba(111, 237, 76, 0.25)"
        });
    }

    for (var i = 0; i < main.expenseDatas.length; i++) {
        data.push({
            type: "line",
            label: main.expenseDatas[i].name,
            data: main.expenseDatas[i].points,
            fill: false,
            borderColor: "rgba(207, 64, 64, 0.25)",
            backgroundColor: "rgba(207, 64, 64, 0.25)"
        });
    }

    data.push({
        type: "bar",
        label: "Flow",
        data: main.flowData,
        fill: true,
        backgroundColor: "rgb(75, 192, 192)",
        order: 99
    });

    data.push({
        type: "line",
        label: "Wealth",
        data: main.wealthData,
        fill: false,
        borderColor: "rgb(75, 50, 255)",
        tension: 0.06,
        order: 98
    });

    return {
        labels: main.labels,
        data: data
    };
}

/// @incomes - object[]
/// @expenses - object[]
/// @wealths - object[]
/// @from - "yyyy-mm"
/// @to - "yyyy-mm"
function createPointsAndLabels(incomes, expenses, wealths, from, to) {

    var wealthData = [];
    var labels = [];
    var incomeDatas = initTransactionArray(incomes);
    var expenseDatas = initTransactionArray(expenses);
    var flowData = [];

    var startingWealth = wealths.reduce((accumulator, currentObject) => {
        return accumulator + currentObject.amount;
    }, 0);

    var currWealth = startingWealth;
    var currDate = strToDate(from);

    while (currDate < strToDate(to)) {

        var local = 0;

        for (var i = 0; i < incomes.length; i++) {
            var e = incomes[i];
            if (isInDataRange(currDate, e.from, e.to)) {
                currWealth += e.amount;
                local += e.amount;
                incomeDatas[i].points.push(e.amount);
            } else {
                incomeDatas[i].points.push(null);
            }
        }

        for (var i = 0; i < expenses.length; i++) {
            var e = expenses[i];
            if (isInDataRange(currDate, e.from, e.to)) {
                currWealth -= e.amount;
                local -= e.amount;
                expenseDatas[i].points.push(-e.amount);
            } else {
                expenseDatas[i].points.push(null);
            }
        }

        flowData.push(local);
        labels.push(dateToLiteral(currDate));
        wealthData.push(currWealth);

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

/// @currentDate - Date
/// @rangeFrom - "yyyy-mm"
/// @rangeTo - "yyyy-mm"
function isInDataRange(currentDate, rangeFrom, rangeTo) {
    return (!rangeFrom && !rangeTo) ||
    (!rangeFrom && rangeTo && strToDate(rangeTo) >= currentDate) ||
    (!rangeTo && rangeFrom && strToDate(rangeFrom) <= currentDate) ||
    (rangeFrom && strToDate(rangeFrom) <= currentDate && strToDate(rangeTo) >= currentDate);
}

/// @transactions - object[]
function initTransactionArray(transactions) {
    var array = [];
    for (var i = 0; i < transactions.length; i++) {
        array.push({
            name: transactions[i].name, 
            points: []
        });
    }
    return array;
}

/// @date - Date
function addAMonth(date) {
    date.setMonth(date.getMonth() + 1);
    return date;
}

/// @date - Date
function dateToLiteral(date) {
    return date.getFullYear() + "-" + getMonthLiteral(date);
}

/// @date - Date
function getMonthLiteral(date) {
    var month = date.getMonth() + 1;
    if (month < 10) {
        return "0" + month;
    }
    return month;
}

/// @str - string
function strToDate(str) {
    return new Date(str + "-01");
}

const getOrCreateTooltip = (chart) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div');

    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.style.background = 'rgba(0, 0, 0, 0.6)';
        tooltipEl.style.borderRadius = '3px';
        tooltipEl.style.color = 'white';
        tooltipEl.style.opacity = 0.9;
        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.transform = 'translate(-50%, 0)';
        tooltipEl.style.transition = 'all .1s ease';

        const table = document.createElement('table');
        table.style.margin = '10px';

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
            span.style.borderRadius = '5px';
            span.style.marginRight = '10px';
            span.style.height = '10px';
            span.style.width = '10px';
            span.style.display = 'inline-block';
            
            const tr = document.createElement('tr');
            tr.style.backgroundColor = 'inherit';
            tr.style.textAlign = 'right';
            tr.style.height = '25px';
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
var chartData = createChartData(incomes, expenses, wealths, now, to);

const data = {
    labels: chartData.labels,
    datasets: chartData.data
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
                text: 'Prediction chart'
            },
            tooltip: {
                enabled: false,
                position: 'nearest',
                external: externalTooltipHandler
            },
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    family: "'Courier New', Courier, monospace" // doesn't seem to work
                }
            }
        }
    }
};

new Chart(
    el,
    config
);