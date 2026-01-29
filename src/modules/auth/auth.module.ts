import { ISagaModule } from 'redux-dynamic-modules-saga';
import authReducer from './auth.reducer';
import authSaga from './auth.saga';

export const authModule: ISagaModule<any> = {
  id: 'auth',
  reducerMap: {
    auth: authReducer,
  },
  sagas: [authSaga],
};
