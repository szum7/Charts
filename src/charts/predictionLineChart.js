
var incomes = [
    { name: "Income",           amount: 100000,     from: null,         to: null },
    { name: "Income to",        amount: 800000,     from: null,         to: "2024-02" },
    { name: "Income from",      amount: 50000,      from: "2026-01",    to: null },
    { name: "Income from-to",   amount: 30000,      from: "2024-04",    to: "2024-12" }
];

var expenses = [
    { name: "Expense",          amount: 300000,     from: null,         to: null },
    { name: "Expense to",       amount: 40000,      from: null,         to: "2024-05" },
    { name: "Expense from",     amount: 150000,     from: "2025-02",    to: null },
    { name: "Expense from-to",  amount: 50000,      from: "2025-02",    to: "2025-07" }
];

var wealths = [
    { name: "cash1", amount: 5000000 },
    { name: "cash2", amount: 1200000 }
];

var now = "2024-01"; // "yyyy-mm"

console.log(createLabels(now, "2024-01"));
console.log(createMainData(incomes, expenses, wealths, now, "2026-06"));


function createChartData(incomes, expenses, wealths, from, to) {

    var data = [];

    for(var i = 0; i < incomes.length; i++) {
        var item = createTransactionData(incomes[i], from, to);
        data.push({
            label: incomes[i].name,
            data: item.data,
            fill: false,
            borderColor: 'rgb(0, 255, 0)',
            tension: 0.06
        });
    }

    for(var i = 0; i < expenses.length; i++) {
        var item = createTransactionData(expenses[i], from, to);
        data.push({
            label: expenses[i].name,
            data: item.data,
            fill: false,
            borderColor: 'rgb(255, 0, 0)',
            tension: 0.06
        });
    }

    var main = createMainData(incomes, expenses, wealths, from, to);
    data.push({
        label: "Flow",
        data: main.data,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.06
    });

    return {
        labels: main.labels,
        d: data
    };

    // {
    //     label: 'My First Dataset',
    //     data: [65, 59, 80, 81, -56, -55, 40],
    //     fill: false,
    //     borderColor: 'rgb(75, 192, 192)',
    //     tension: 0.06
    // },
}

/// @obj - object
/// @from - "yyyy-mm"
/// @to - "yyyy-mm"
function createTransactionData(obj, from, to) {
    var l = [];
    var d = [];

    var currD = strToDate(from);
    // if (obj.from && strToDate(obj.from) > currD) {
    //     currD = strToDate(obj.from);
    // }

    // var endD = strToDate(to);
    // if (obj.to && strToDate(obj.to) < endD) {
    //     endD = strToDate(obj.to);
    // }

    while (currD < strToDate(to)) {

        if ((!obj.from && !obj.to) || 
            (!obj.from && obj.to && strToDate(obj.to) >= currD) || 
            (!obj.to && obj.from && strToDate(obj.from) <= currD) || 
            (obj.from && strToDate(obj.from) <= currD && strToDate(obj.to) >= currD)) {
            d.push(obj.amount);
        } else {
            d.push(null);            
        }

        l.push(dateToLiteral(currD));

        currD = addAMonth(currD);
    }

    return { label: l, data: d };
}

function createMainData(incomes, expenses, wealths, from, to) {
    var startingWealth = wealths.reduce((accumulator, currentObject) => {
        return accumulator + currentObject.amount;
    }, 0);

    var l = [];
    var d = [];

    var currW = startingWealth;
    var currD = strToDate(from);

    while (currD < strToDate(to)) {

        incomes.forEach(e => {
            if ((!e.from && !e.to) || 
                (!e.from && e.to && strToDate(e.to) >= currD) || 
                (!e.to && e.from && strToDate(e.from) <= currD) || 
                (e.from && strToDate(e.from) <= currD && strToDate(e.to) >= currD)) {
                currW += e.amount;
            }
        });

        expenses.forEach(e => {
            if ((!e.from && !e.to) || 
                (!e.from && e.to && strToDate(e.to) >= currD) || 
                (!e.to && e.from && strToDate(e.from) <= currD) || 
                (e.from && strToDate(e.from) <= currD && strToDate(e.to) >= currD)) {
                currW -= e.amount;
            }
        });

        l.push(dateToLiteral(currD));
        d.push(currW);

        currD = addAMonth(currD);
    }

    return {
        labels: l,
        data: d
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


const el = document.getElementById('myChart');
var dd = createChartData(incomes, expenses, wealths, now, "2026-08");

const data = {
    labels: dd.labels, //["HTML", "CSS", "JAVASCRIPT", "CHART.JS", "JQUERY", "BOOTSTRP", "END"],
    datasets: dd.d
    // [
    //     {
    //         label: 'My First Dataset',
    //         data: [65, 59, 80, 81, -56, -55, 40],
    //         fill: false,
    //         borderColor: 'rgb(75, 192, 192)',
    //         tension: 0.06
    //     },
    //     {
    //         label: 'My First Dataset',
    //         data: [65, 59, -56, -55, 40, 1, 2],
    //         fill: false,
    //         borderColor: 'rgb(75, 192, 192)',
    //         tension: 0.06
    //     }
    // ]
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