pubnub = new PubNub({
    publishKey: "pub-c-3760f31d-3cac-492d-ae07-926022da7319",
    subscribeKey: "sub-c-b9ade3e4-3af2-11ec-b886-526a8555c638",
    uuid: "michael"
})
pubnub.subscribe({
    channels: ['manual']
});

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = () => {
    output.innerHTML = slider.value;
}