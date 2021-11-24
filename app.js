//parameters
var ratio_param = 55 //50g / l, remember to convert
var brew_time_param = 180
var temperature_param = 93
var bloom_time_param = 30
var bloom_water_param = 60

//pubnub
pubnub = new PubNub({
    publishKey: "pub-c-3760f31d-3cac-492d-ae07-926022da7319",
    subscribeKey: "sub-c-b9ade3e4-3af2-11ec-b886-526a8555c638",
    uuid: "michael"
})
pubnub.subscribe({
    channels: ['coffee', 'brew']
});

var brewing = false;

var button = document.getElementById("knob");
button.style.backgroundColor = "#4CAF50"

button.onclick = () => {
    if (!brewing) {
        button.style.backgroundColor = "#af4c4c"
        button.innerHTML = "Abort"
        publishBrew(25, ratio_param, brew_time_param, temperature_param,
            bloom_time_param, bloom_water_param)
        brewing = true;
    } else {
        button.style.backgroundColor = "#4CAF50"
        button.innerHTML = "Brew"
        publishStopBrew();
        brewing = false;
    }
};

pubnub.addListener({
    status: function (statusEvent) {
        if (statusEvent.category === "PNConnectedCategory") {
            publishSampleMessage();
        }
    },
    message: function (msg) {
        console.log(msg.message);
    },
    presence: function (presenceEvent) {
        // This is where you handle presence. Not important for now :)
    }
})

function publishBrew(beans, ratio, brew_time, temperature, bloom_time, bloom_water) {
    var publishPayload = {
        channel: "brew",
        message: {
            beans: beans,
            ratio: ratio,
            brew_time: brew_time,
            temperature: temperature,
            bloom_time: bloom_time,
            bloom_water: bloom_water
        }
    }
    pubnub.publish(publishPayload, function (status, response) {
        console.log(status, response);
    })
}

function publishStopBrew() {
    var publishPayload = {
        channel: "brew",
        message: {
            abort: "true"
        }
    }
    pubnub.publish(publishPayload, function (status, response) {
        console.log(status, response);
    })
}



//the rest
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

var ratio = 16

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
            var text = document.getElementById("ratio_value")
            ratio_param = 1000 / calculateParameter("ratio", parameter_updated)
            text.innerHTML = "1:" + calculateParameter("ratio", parameter_updated)
            break;
        case "brew_time":
            var parameter_updated = clamp(current_series[3] + increment, 0, 100)
            updated_series = [current_series[0], current_series[1], current_series[2], parameter_updated, current_series[4]]
            var text = document.getElementById("brew_time_value")
            brew_time_param = calculateParameter("brew_time", parameter_updated).toFixed(0)
            text.innerHTML = secondsToMinutes(calculateParameter("brew_time", parameter_updated).toFixed(0)) + "m"
            break;
        case "temperature":
            var parameter_updated = clamp(current_series[2] + increment, 0, 100)
            updated_series = [current_series[0], current_series[1], parameter_updated, current_series[3], current_series[4]]
            var text = document.getElementById("temperature_value")
            temperature_param = calculateParameter("temperature", parameter_updated).toFixed(1)
            text.innerHTML = calculateParameter("temperature", parameter_updated).toFixed(1) + "C"
            break;
        case "bloom_time":
            var parameter_updated = clamp(current_series[1] + increment, 0, 100)
            updated_series = [current_series[0], parameter_updated, current_series[2], current_series[3], current_series[4]]
            var text = document.getElementById("bloom_time_value")
            bloom_time_param = calculateParameter("bloom_time", parameter_updated).toFixed(0)
            text.innerHTML = calculateParameter("bloom_time", parameter_updated).toFixed(0) + "s"
            break;
        case "bloom_water":
            var parameter_updated = clamp(current_series[0] + increment, 0, 100)
            updated_series = [parameter_updated, current_series[1], current_series[2], current_series[3], current_series[4]]
            var text = document.getElementById("bloom_water_value")
            bloom_water_param = calculateParameter("bloom_water", parameter_updated).toFixed(0)
            text.innerHTML = calculateParameter("bloom_water", parameter_updated).toFixed(0) + "g"
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




//ratio 1:10 - 1:20 
//brew time 2:00 - 4:00 5s 
//temperature 80-100
//bloom time 0-60
//bloom water 0-100


function calculateParameter(name, pct) {
    var value = 0;

    switch (name) {
        case "ratio":
            value = convertRange(pct, [0, 100], [10, 20]);
            break;
        case "brew_time":
            value = convertRange(pct, [0, 100], [120, 240]);
            break;
        case "temperature":
            value = convertRange(pct, [0, 100], [80, 100]);
            break;
        case "bloom_time":
            value = convertRange(pct, [0, 100], [0, 60]);
            break;
        case "bloom_water":
            value = convertRange(pct, [0, 100], [0, 100]);
            break;
    }

    return value;
}

function convertRange(value, r1, r2) {
    return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}

function clamp(num, min, max) {
    return num <= min ?
        min :
        num >= max ?
        max :
        num
}

function secondsToMinutes(value) {
    return Math.floor(value / 60) + ":" + (value % 60 ? value % 60 : '00')
}