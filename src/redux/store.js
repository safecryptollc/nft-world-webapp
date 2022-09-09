import { createStore, applyMiddleware, compose } from 'redux';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import thunk from 'redux-thunk';
import rootReducer from './reducers';

const persistConfig = {
  key: 'nft-marketplace',
  storage: storage,
  whitelist: ['auth'] // which reducer want to store
};
const pReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(pReducer,
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ),
);
const persistor = persistStore(store);


export { persistor, store };
