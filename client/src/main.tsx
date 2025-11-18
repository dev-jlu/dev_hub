import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from './apollo/client';

import { Provider as ReduxProvider } from 'react-redux';
import { store } from './app/store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </ReduxProvider>
  </StrictMode>,
)
