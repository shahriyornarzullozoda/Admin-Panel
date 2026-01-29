export const LOGIN_REQUEST = 'AUTH/LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'AUTH/LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'AUTH/LOGIN_FAILURE';

export const loginRequest = (payload: { email: string; password: string }) => ({
  type: LOGIN_REQUEST,
  payload,
});

export const loginSuccess = () => ({ type: LOGIN_SUCCESS });
export const loginFailure = (payload: string) => ({ type: LOGIN_FAILURE, payload });
