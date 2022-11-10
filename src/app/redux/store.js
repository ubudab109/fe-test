import { composeWithDevTools } from '@redux-devtools/extension';
import { configureStore } from '@reduxjs/toolkit';
import { applyMiddleware} from 'redux';
import storage from 'redux-persist/lib/storage'
import thunk from "redux-thunk";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import rootReducer from './reducer';

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const appStore = () => {
  const store = configureStore(
    {
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          }
        })
    }, 
    composeWithDevTools(applyMiddleware(thunk))
  );
  const persistor = persistStore(store);
  return {store, persistor};
}

export default appStore;