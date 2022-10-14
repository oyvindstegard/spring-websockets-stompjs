'use strict';

var stompClient = null;

const wsUrl = 'ws://localhost:9123/websocket';

const connectBtn = document.getElementById('connect');
const disconnectBtn = document.getElementById('disconnect');
const sendBtn = document.getElementById('send');

function setConnected(connected) {
    if (connected === undefined){
        connectBtn.disabled = true;
        disconnectBtn.disabled = false;
        sendBtn.disabled = true;
        return;
    }

    connectBtn.disabled = connected;
    disconnectBtn.disabled = !connected;
    sendBtn.disabled = !connected;

    if (connected) {
        document.getElementById("conversation").classList.remove("invisible");
    } else {
        document.getElementById("conversation").classList.add("invisible");
    }
    document.getElementById("greetings").innerHTML = '';
}

function connectAndSubscribe() {
    setConnected(undefined);

    const client = new StompJs.Client({
        brokerURL: wsUrl,
        connectHeaders: {
            login: 'user',
            passcode: 'password',
        },
        debug: function (str) {
            console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    client.onConnect = function (frame) {
        // Do something, all subscribes must be done is this callback
        // This is needed because this will be executed after a (re)connect
        console.log("StompJs connected to broker over ws");
        setConnected(true);
        client.subscribe('/topic/greetings', (message) => {
            showGreeting(JSON.parse(message.body).content);
        });
    };

    client.onStompError = function (frame) {
        // Will be invoked in case of error encountered at Broker
        // Bad login/passcode typically will cause an error
        // Complaint brokers will set `message` header with a brief message. Body may contain details.
        // Compliant brokers will terminate the connection after any error
        console.log('Broker reported error: ' + frame.headers['message']);
        console.log('Additional details: ' + frame.body);
    };

    client.activate();

    stompClient = client;
}

function disconnect() {
    if (stompClient) {
        stompClient.deactivate();
        stompClient = null;
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    const name = document.getElementById('name').value;
    stompClient.publish({
        destination: '/app/hello',
        body: JSON.stringify({'name': name}),
        skipContentLengthHeader: true,
    });
}

function showGreeting(message) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `<td>${message}</td>`;
    document.getElementById('greetings').appendChild(newRow);
}

if (typeof StompJs === 'undefined') {
    throw new Error('StompJs is not available');
}

for (let i=0; i<document.forms.length; i++) {
    document.forms.item(i).addEventListener('submit', (e) => e.preventDefault());
}

connectBtn.addEventListener('click', (e) => connectAndSubscribe());
disconnectBtn.addEventListener('click', (e) => disconnect());
sendBtn.addEventListener('click', (e) => sendName());
setConnected(false);
