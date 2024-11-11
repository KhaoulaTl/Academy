import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'; 
import authReducer from "@/lib/slices/auth/auth.slice";
import userSlice from "@/lib/slices/user/user.slice";
import categorySlice from "@/lib/slices/category/category.slice";
import coachSlice from "@/lib/slices/coach/coach.slice";
import playerSlice from "@/lib/slices/player/player.slice";
import parentSlice from "@/lib/slices/parent/parent.slice";
import eventSlice from "@/lib/slices/event/event.slice";
import transactionSlice from "@/lib/slices/transaction/transaction.slice";

// Gestion du storage selon l'environnement
const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem() {
      return Promise.resolve();
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const reducers = combineReducers({
  auth: authReducer,
  user: userSlice,
  category: categorySlice,
  coach: coachSlice,
  player: playerSlice,
  parent: parentSlice,
  event: eventSlice,
  transaction: transactionSlice,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "LOGOUT_ACTION") {
    console.log("Logging out, resetting state");
    state = undefined; // Réinitialisation du state en cas de déconnexion
  }
  return reducers(state, action);
};

const persistConfig = {
  key: "root",
  storage: storage, // Référence au storage correct (web ou noop)
  whitelist: ["auth", "user", "category", "coach"], // State à persister
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disables the serialization check
      immutableCheck: false,   // Disables the immutability check
    }),
});


const persistor = persistStore(store);

setupListeners(store.dispatch);

export { store, persistor };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
