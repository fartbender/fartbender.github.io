var current_parameter = null;
var current_series = [50, 50, 50, 50, 50]

var options = {
    series: [50, 50, 50, 50, 50],
    chart: {
        height: 350,
        type: 'radialBar',
    },
    plotOptions: {
        radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
                margin: 5,
                size: '30%',
                background: 'transparent',
                image: undefined,
            },
            dataLabels: {
                name: {
                    show: false,
                },
                value: {
                    show: false,
                }
            }
        }
    },
    colors: ['#836258', '#836258', '#836258', '#836258', '#836258'],
    labels: ['Bloom Water', 'Bloom Time', 'Temperature', 'Brew Time', 'Ratio'],



    responsive: [{
        breakpoint: 50,
        options: {
            legend: {
                show: false
            }
        }
    }]
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

var previous_angle = 0;

function adjustParameter(angle) {
    if (!current_parameter) {
        return;
    }

    var increment;
    if (previous_angle < angle) {
        increment = 1;
        previous_angle = angle;
    } else {
        increment = -1
        previous_angle = angle;
    }

    var updated_series;

    switch (current_parameter) {
        case "ratio":
            var parameter_updated = clamp(current_series[4] + increment, 0, 100)
            updated_series = [current_series[0], current_series[1], current_series[2], current_series[3], parameter_updated]
            break;
        case "brew_time":
            var parameter_updated = clamp(current_series[3] + increment, 0, 100)
            updated_series = [current_series[0], current_series[1], current_series[2], parameter_updated, current_series[4]]
            break;
        case "temperature":
            var parameter_updated = clamp(current_series[2] + increment, 0, 100)
            updated_series = [current_series[0], current_series[1], parameter_updated, current_series[3], current_series[4]]
            break;
        case "bloom_time":
            var parameter_updated = clamp(current_series[1] + increment, 0, 100)
            updated_series = [current_series[0], parameter_updated, current_series[2], current_series[3], current_series[4]]
            break;
        case "bloom_water":
            var parameter_updated = clamp(current_series[0] + increment, 0, 100)
            updated_series = [parameter_updated, current_series[1], current_series[2], current_series[3], current_series[4]]
            break;
    }

    chart.updateOptions({
        series: updated_series,
    })
    current_series = updated_series;

}


function selectParameter(name) {
    switch (name) {
        case "ratio":
            chart.updateOptions({
                colors: ['#836258', '#836258', '#836258', '#836258', '#2F9FF4'],
            })
            current_parameter = "ratio"
            break;
        case "brew_time":
            chart.updateOptions({
                colors: ['#836258', '#836258', '#836258', '#2F9FF4', '#836258'],
            })
            current_parameter = "brew_time"
            break;
        case "temperature":
            chart.updateOptions({
                colors: ['#836258', '#836258', '#2F9FF4', '#836258', '#836258'],
            })
            current_parameter = "temperature"
            break;
        case "bloom_time":
            chart.updateOptions({
                colors: ['#836258', '#2F9FF4', '#836258', '#836258', '#836258'],
            })
            current_parameter = "bloom_time"
            break;
        case "bloom_water":
            chart.updateOptions({
                colors: ['#2F9FF4', '#836258', '#836258', '#836258', '#836258'],
            })
            current_parameter = "bloom_water"
            break;
    }
}

function clamp(num, min, max) {
    return num <= min ?
        min :
        num >= max ?
        max :
        num
}