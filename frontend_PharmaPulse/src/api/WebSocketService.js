import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// Add global polyfill
if (typeof global === 'undefined') {
  window.global = window;
}

// WebSocket connection configuration
const WS_BASE_URL = 'http://localhost:8090/ws';

/**
 * Creates a WebSocket connection with configurable subscriptions
 * @param {string} token - Authentication token
 * @param {Array} subscriptions - Array of subscription configs: [{topic: '/topic/example', callback: (data) => {}}]
 * @param {Object} options - Additional configuration options
 * @returns {Client} STOMP client instance
 */
export const createWebSocketConnection = (
  token,
  subscriptions = [],
  options = {},
) => {
  if (!token) {
    throw new Error('Authentication token is missing');
  }

  const {
    debug = false,
    reconnectDelay = 5000,
    heartbeatIncoming = 4000,
    heartbeatOutgoing = 4000,
    onConnectCallback = null,
    onErrorCallback = null,
    onDisconnectCallback = null,
  } = options;

  const client = new Client({
    webSocketFactory: () => new SockJS(WS_BASE_URL),
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: function (str) {
      if (debug) console.log('STOMP: ' + str);
    },
    reconnectDelay,
    heartbeatIncoming,
    heartbeatOutgoing,
    onConnect: () => {
      console.log('Connected to WebSocket');

      // Set up all subscriptions
      subscriptions.forEach(({ topic, callback }) => {
        client.subscribe(topic, (message) => {
          try {
            const data = JSON.parse(message.body);
            console.log(`WebSocket data received from ${topic}:`, data);
            callback(data);
          } catch (error) {
            console.error(
              `Error parsing WebSocket message from ${topic}:`,
              error,
            );
            callback({});
          }
        });
      });

      // Call the optional onConnect callback
      if (onConnectCallback) onConnectCallback(client);
    },
    onStompError: (frame) => {
      console.error('WebSocket Error:', frame.headers.message);
      if (onErrorCallback) onErrorCallback(frame);
    },
    onWebSocketError: (event) => {
      console.error('WebSocket connection error:', event);
      if (onErrorCallback) onErrorCallback(event);
    },
    onDisconnect: () => {
      console.log('Disconnected from WebSocket');
      if (onDisconnectCallback) onDisconnectCallback();
    },
  });

  client.activate();
  return client;
};

/**
 * Safely disconnects a WebSocket client
 * @param {Client} client - STOMP client to disconnect
 */
export const disconnectWebSocket = (client) => {
  if (client && client.connected) {
    return new Promise((resolve) => {
      client.deactivate();
      resolve();
    });
  }
  return Promise.resolve();
};

/**
 * Pre-configured WebSocket connections for specific features
 */
export const webSocketConnections = {
  // Connection for expiry counts (preserves backward compatibility)
  connectExpiryCounts: (token, onCountsReceived) => {
    return createWebSocketConnection(token, [
      { topic: '/topic/expiry-counts', callback: onCountsReceived },
    ]);
  },

  // Connection for stock availability
  connectStockCounts: (token, onStockCountsReceived) => {
    return createWebSocketConnection(token, [
      { topic: '/topic/stock-counts', callback: onStockCountsReceived },
    ]);
  },

  connectExpiredStock: (token, onExpiredStockReceived) => {
    return createWebSocketConnection(token, [
      { topic: '/topic/expired-batches', callback: onExpiredStockReceived },
    ]);
  },

  connectDashboardCounts: (token, onDashboardCountsReceived) => {
    return createWebSocketConnection(token, [
      {
        topic: '/topic/employee/dashboard/counts',
        callback: onDashboardCountsReceived,
      },
    ]);
  },

  // Add more pre-configured connections as needed
};
