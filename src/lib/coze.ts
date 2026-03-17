export const initializeCozeSDK = () => {
  const token = import.meta.env.VITE_COZE_TOKEN;
  
  console.log('Debug Coze SDK Initialization:');
  console.log('Token:', token ? `${token.substring(0, 10)}...` : 'NOT FOUND');
  console.log('Token length:', token?.length);
  console.log('Token valid format:', token?.startsWith('pat_'));
  
  if (!token) {
    console.error('VITE_COZE_TOKEN not found in environment variables');
    return;
  }

  // Monitor network errors
  const originalFetch = window.fetch;
  (window as any).fetch = function(resource: any, ...rest: any[]) {
    if (typeof resource === 'string' && resource.includes('api.coze.com')) {
      console.log('Coze API Request:', resource);
    }
    return originalFetch.call(window, resource, ...rest).then((response: any) => {
      if (typeof resource === 'string' && resource.includes('api.coze.com')) {
        console.log(`Coze API Response: ${response.status}`, resource);
        if (response.status === 502) {
          console.error('502 Bad Gateway from Coze API');
          console.error('Response headers:', {
            'content-type': response.headers.get('content-type'),
            'server': response.headers.get('server')
          });
          // Clone response to log body
          response.clone().text().then((text: string) => {
            console.error('Response body:', text);
          });
        }
      }
      return response;
    });
  };

  const initCoze = () => {
    console.log('Checking if CozeWebSDK is available...');
    console.log('window.CozeWebSDK type:', typeof (window as any).CozeWebSDK);
    
    if ((window as any).CozeWebSDK) {
      try {
        console.log('Initializing Coze SDK...');
        console.log('Bot ID: 7617975548819931141');
        console.log('Token (first 20 chars):', token.substring(0, 20) + '...');
        console.log('isIframe: true');
        
        // Intercept errors from WebChatClient
        const sdk = (window as any).CozeWebSDK;
        console.log('Available SDK methods:', Object.keys(sdk));
        
        const client = new sdk.WebChatClient({
          config: {
            bot_id: '7617975548819931141',
          },
          componentProps: {
            title: 'Coze Chat',
          },
          auth: {
            type: 'token',
            token: token,
            onRefreshToken: function () {
              console.log('Refreshing Coze token...');
              return token;
            },
            onTokenFailed: function (error: any) {
              console.error('Token authentication failed:', error);
            }
          },
          isIframe: true,
          debug: true // Enable debug mode if available
        });
        
        console.log('Coze SDK initialized successfully');
        console.log('Client object keys:', Object.keys(client));
        
        // Listen for client errors
        if (client && typeof client.on === 'function') {
          client.on('error', (error: any) => {
            console.error('Coze Client Error Event:', error);
          });
          client.on('ready', () => {
            console.log('Coze Client Ready');
          });
        }
        
      } catch (error) {
        console.error('Error initializing Coze SDK:', error);
        console.error('Error type:', (error as any)?.constructor?.name);
        console.error('Error message:', (error as any)?.message);
        console.error('Error stack:', (error as any)?.stack);
        
        // Log full error object
        console.error('Full error object:', JSON.stringify(error, null, 2));
      }
    } else {
      console.warn('CozeWebSDK still not available');
      console.warn('Window keys with Coze:', Object.keys(window).filter(k => k.toLowerCase().includes('coze')));
    }
  };

  // Wait for SDK to be loaded
  if ((window as any).CozeWebSDK) {
    console.log('SDK already loaded on window');
    initCoze();
  } else {
    console.log('Waiting for SDK to load...');
    // Wait for custom event from HTML
    window.addEventListener('coze-sdk-loaded', () => {
      console.log('Got coze-sdk-loaded event');
      initCoze();
    }, { once: true });
    
    // Fallback: retry after 2 seconds
    setTimeout(() => {
      if ((window as any).CozeWebSDK) {
        console.log('Coze SDK loaded after timeout');
        initCoze();
      } else {
        console.error('Coze SDK failed to load after 2 seconds');
        console.log('Available globals:', Object.keys(window).filter(k => k.match(/[A-Z]/)).slice(0, 20));
      }
    }, 2000);
  }
};




