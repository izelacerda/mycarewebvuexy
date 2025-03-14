import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

export default reducers => {
  const persistedReducer = persistReducer(
    {
      key: "mycare",
      storage,
      whitelist: ["auth","customizer"]
    },
    reducers
  );

  return persistedReducer;
};
