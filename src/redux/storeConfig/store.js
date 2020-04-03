import { persistStore } from "redux-persist";
import { createStore, applyMiddleware, compose } from "redux"
import createDebounce from "redux-debounced"
import thunk from "redux-thunk"
import rootReducer from "../reducers/rootReducer"
import persistReducers from "./persistReducers";

const middlewares = [thunk, createDebounce()]

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  persistReducers(rootReducer),
  {},
  composeEnhancers(applyMiddleware(...middlewares))
)
const persistor = persistStore(store);

export { store, persistor }
