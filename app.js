pubnub = new PubNub({
    publishKey: "pub-c-3760f31d-3cac-492d-ae07-926022da7319",
    subscribeKey: "sub-c-b9ade3e4-3af2-11ec-b886-526a8555c638",
    uuid: "michael"
})
pubnub.subscribe({
    channels: ['coffee']
});

var ratio_slider = document.getElementById("ratio_slider");
var ratio_value = document.getElementById("ratio_value");
ratio_value.innerHTML = ratio_slider.value + "g/l";
ratio_slider.oninput = function () {
    ratio_value.innerHTML = this.value + "g/l";
}

var brewtime_slider = document.getElementById("brewtime_slider");
var brewtime_value = document.getElementById("brewtime_value");
brewtime_value.innerHTML = convert(brewtime_slider.value) + "min";
brewtime_slider.oninput = function () {
    brewtime_value.innerHTML = convert(this.value) + "min";
}

var temperature_slider = document.getElementById("temperature_slider");
var temperature_value = document.getElementById("temperature_value");
temperature_value.innerHTML = temperature_slider.value + "C";
temperature_slider.oninput = function () {
    temperature_value.innerHTML = this.value + "C";
}

var bloomtime_slider = document.getElementById("bloomtime_slider");
var bloomtime_value = document.getElementById("bloomtime_value");
bloomtime_value.innerHTML = convert(bloomtime_slider.value) + "min";
bloomtime_slider.oninput = function () {
    bloomtime_value.innerHTML = convert(this.value) + "min";
}

var bloomwater_slider = document.getElementById("bloomwater_slider");
var bloomwater_value = document.getElementById("bloomwater_value");
bloomwater_value.innerHTML = bloomwater_slider.value + "g";
bloomwater_slider.oninput = function () {
    bloomwater_value.innerHTML = this.value + "g";
}


pubnub.addListener({
    status: function (statusEvent) {
        if (statusEvent.category === "PNConnectedCategory") {
            publishSampleMessage();
        }
    },
    message: function (msg) {
        console.log(msg.message.title);
        console.log(msg.message.description);
    },
    presence: function (presenceEvent) {
        // This is where you handle presence. Not important for now :)
    }
})


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