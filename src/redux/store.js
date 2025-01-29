import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import billsReducer from './slices/billsSlice';

const persistConfig = {
  key: 'root',
  storage
};

const persistedReducer = persistReducer(persistConfig, billsReducer);

export const store = configureStore({
  reducer: {
    bills: persistedReducer
  }
});

export const persistor = persistStore(store);
