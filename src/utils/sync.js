// Multi-Tab Realtime Synchronizer using BroadcastChannel and localStorage fallback

const CHANNEL_NAME = 'delivery_dispatcher_sync';

export function createSyncChannel(onSyncMessage) {
  let broadcastChannel = null;

  if ('BroadcastChannel' in window) {
    try {
      broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
      broadcastChannel.onmessage = (event) => {
        if (event && event.data) {
          onSyncMessage(event.data);
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel init error:', e);
    }
  }

  // LocalStorage fallback for older browsers or cross-window triggers
  const storageListener = (event) => {
    if (event.key === 'delivery_app_trigger_sync') {
      try {
        const data = JSON.parse(event.newValue);
        if (data) {
          onSyncMessage(data);
        }
      } catch (err) {
        // ignore parse error
      }
    }
  };

  window.addEventListener('storage', storageListener);

  return {
    postMessage: (data) => {
      // Send via BroadcastChannel if active
      if (broadcastChannel) {
        try {
          broadcastChannel.postMessage(data);
        } catch (e) {
          console.warn('BroadcastChannel post error:', e);
        }
      }
      // Also update localStorage key to notify other tabs
      try {
        localStorage.setItem('delivery_app_trigger_sync', JSON.stringify({
          ...data,
          _timestamp: Date.now()
        }));
      } catch (e) {
        console.warn('LocalStorage sync post error:', e);
      }
    },
    close: () => {
      if (broadcastChannel) broadcastChannel.close();
      window.removeEventListener('storage', storageListener);
    }
  };
}
