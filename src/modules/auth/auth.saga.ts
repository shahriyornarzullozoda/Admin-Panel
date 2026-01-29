import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import Cookies from 'js-cookie';


function loginApi(data: { email: string; password: string }) {
  return axios.post('https://rest-test.machineheads.ru/auth/token-generate', data);
}
function* login(action: { type: string; payload: { email: string; password: string } }): Generator<
  any, 
  void,
  any  
> {
  try {
    const res: { data: { access_token: string; refresh_token: string } } = yield call(loginApi, action.payload);

    Cookies.set('access_token', res.data.access_token, { expires: 1 });
    Cookies.set('refresh_token', res.data.refresh_token, { expires: 7 });

    yield put({ type: 'AUTH/LOGIN_SUCCESS' });
  } catch (e: any) {
    yield put({
      type: 'AUTH/LOGIN_FAILURE',
      payload: e.response?.data?.message || 'Login failed',
    });
  }
}

export default function* authSaga() {
  yield takeEvery('AUTH/LOGIN_REQUEST', login);
}
