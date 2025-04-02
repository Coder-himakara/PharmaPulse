import {
  webSocketConnections,
  disconnectWebSocket as disconnect,
} from './WebSocketService';

// Re-export the functions from the old file but use the new implementation
export const connectExpiryCounts = webSocketConnections.connectExpiryCounts;
export const connectStockCounts = webSocketConnections.connectStockCounts;
export const disconnectWebSocket = disconnect;

// If you had any other functions in WebSocket.js, keep them but update
// their implementation to use the new service
