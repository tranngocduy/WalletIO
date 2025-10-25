class WebsocketWrapper {
  seq = 0;
  id = null;
  token = null;
  socket = null;

  constructor(address, authorization) {
    this.seq = 0;
    this.socket = new WebSocket(address, authorization);
  }

  onReceiveToken = data => {
    this.token = data.message.token;
    this.id = data.message.cid || null;
  }

  getReadyState = () => this.socket?.readyState;

  addEventListener = (event, callback) => this.socket?.addEventListener?.(event, callback);

  removeEventListener = (event, callback) => this.socket?.removeEventListener?.(event, callback);

  close = () => {
    this.seq = 0;
    this.id = null;
    this.token = null;
    this.socket?.close?.();
  };

  sendMessage = message => {
    try {
      const payload = message;
      this.socket?.send?.(payload);
    } catch (error) {

    }
  }

  sendPayload = ({ action, sid, message }) => {
    try {
      if (!this.token) throw new Error('Cannot send message without token');

      this.socket?.send?.(JSON.stringify({ action, sid, message, seq: this.seq, token: this.token }));

      this.seq++;
    } catch (error) {

    }
  };

}

export const createObservable = () => {
  const WEBSOCKET_ENDPOINT = `wss://stream.binance.com:9443/ws/btcusdt@ticker`;

  const socket = new WebsocketWrapper(WEBSOCKET_ENDPOINT);

  return socket;
}
