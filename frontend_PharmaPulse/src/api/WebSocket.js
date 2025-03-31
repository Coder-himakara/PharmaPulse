import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// Add global polyfill
if (typeof global === 'undefined') {
    window.global = window;
}

export const connectExpiryCounts = (token, onCountsReceived) => {
    if (!token) {
        throw new Error('Authentication token is missing');
    }

    console.log('Connecting with token:', token);

    const client = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8090/ws'),
        connectHeaders: {
            'Authorization': `Bearer ${token}`
        },
        debug: function (str) {
            console.log('STOMP: ' + str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
            console.log('Connected to WebSocket');
            client.subscribe('/topic/expiry-counts', (message) => {
                try {
                    const data = JSON.parse(message.body);
                    console.log('WebSocket data received:', data);
                    onCountsReceived(data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                    onCountsReceived({});
                }
            });
        },
        onStompError: (frame) => {
            console.error('WebSocket Error:', frame.headers.message);
        },
        onWebSocketError: (event) => {
            console.error('WebSocket connection error:', event);
        },
        onDisconnect: () => {
            console.log('Disconnected from WebSocket');
        }
    });

    // Wrap activation in try-catch
    client.activate();
    return client;

};