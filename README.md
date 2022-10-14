# Example code: using Spring websocket and StompJs

Based on code from Spring guide:

- https://github.com/spring-guides/gs-messaging-stomp-websocket/tree/8aacf08c73059b241d0a40f36abb6d5569d8508a
- https://spring.io/guides/gs/messaging-stomp-websocket/

## With modifications

- Use StompJs instead of SockJS.
- Remove use of JQuery from frontend code.
- Small improvements to frontend connected state handling.
- Remove Gradle support.
- Remove Maven wrapper cruft.
- Restructure to a minimal complete working example.
- Upgrade Spring Boot.
- Change default server port to 9123.

## Requirements

Java 17+ and Maven.

## How to run and observe

1. `mvn spring-boot:run`
2. Open browser at [localhost:9123](http://localhost:9123)
3. Open browser developer tools, network tab.
4. Click connect button, observe web socket request with response 101.
5. Click on response tab for the websocket request to see STOMP protocol messages over the active link.
6. Type your name and click send button.
7. Message goes from frontend over websocket to backend. Backend replies to all subscribers of topic over websocket and 
   message is displayed in frontend.
8. You can open multiple tabs and connect several frontend clients. Then messages will be broadcast to every subscribed
   client.
