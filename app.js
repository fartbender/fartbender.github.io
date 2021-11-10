pubnub = new PubNub({
    publishKey: "pub-c-3760f31d-3cac-492d-ae07-926022da7319",
    subscribeKey: "sub-c-b9ade3e4-3af2-11ec-b886-526a8555c638",
    uuid: "michael"
})
pubnub.subscribe({
    channels: ['manul']
});