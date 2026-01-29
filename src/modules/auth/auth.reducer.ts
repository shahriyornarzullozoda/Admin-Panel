interface AuthState {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
 loading: false,
  error: null,
  isAuthenticated: false,
};

export default function authReducer(state = initialState, action: any) {
  switch (action.type) {
    case 'AUTH/LOGIN_REQUEST':
      return { ...state, loading: true, error: null };

    case 'AUTH/LOGIN_SUCCESS':
      return { ...state, loading: false, isAuthenticated: true };

    case 'AUTH/LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}
