pubnub = new PubNub({
    publishKey: "pub-c-3760f31d-3cac-492d-ae07-926022da7319",
    subscribeKey: "sub-c-b9ade3e4-3af2-11ec-b886-526a8555c638",
    uuid: "michael"
})
pubnub.subscribe({
    channels: ['coffee', 'brew']
});

var ratio_slider = document.getElementById("ratio_slider");
var ratio_value = document.getElementById("ratio_output");
ratio_value.innerHTML = "Ratio: " + ratio_slider.value + "g/l";
ratio_slider.oninput = function () {
    ratio_value.innerHTML = "Ratio: " + this.value + "g/l";
}

var brewtime_slider = document.getElementById("brewtime_slider");
var brewtime_value = document.getElementById("brewtime_output");
brewtime_value.innerHTML = "Brew Time: " + convert(brewtime_slider.value) + "min";
brewtime_slider.oninput = function () {
    brewtime_value.innerHTML = "Brew Time: " + convert(this.value) + "min";
}

var temperature_slider = document.getElementById("temperature_slider");
var temperature_value = document.getElementById("temperature_output");
temperature_value.innerHTML = "Temperature: " + temperature_slider.value + "C";
temperature_slider.oninput = function () {
    temperature_value.innerHTML = "Temperature: " + this.value + "C";
}

var bloomtime_slider = document.getElementById("bloomtime_slider");
var bloomtime_value = document.getElementById("bloomtime_output");
bloomtime_value.innerHTML = "Bloom Time: " + convert(bloomtime_slider.value) + "min";
bloomtime_slider.oninput = function () {
    bloomtime_value.innerHTML = "Bloom Time: " + convert(this.value) + "min";
}

var bloomwater_slider = document.getElementById("bloomwater_slider");
var bloomwater_value = document.getElementById("bloomwater_output");
bloomwater_value.innerHTML = "Bloom Water: " + bloomwater_slider.value + "g";
bloomwater_slider.oninput = function () {
    bloomwater_value.innerHTML = "Bloom Water: " + this.value + "g";
}

var button = document.getElementById("button1");
button.onclick = () => {
    publishBrew(30, ratio_slider.value, brewtime_slider.value, temperature_slider.value,
        bloomtime_slider.value, bloomwater_slider.value)
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

function publishSampleMessage() {
    console.log("Publish to a channel 'coffee'");
    // With the right payload, you can publish a message, add a reaction to a message,
    // send a push notification, or send a small payload called a signal.
    var publishPayload = {
        channel: "coffee",
        message: {
            title: "greeting",
            description: "This is my first message!"
        }
    }
    pubnub.publish(publishPayload, function (status, response) {
        console.log(status, response);
    })
}

function convert(value) {
    return Math.floor(value / 60) + ":" + (value % 60 ? value % 60 : '00')
}