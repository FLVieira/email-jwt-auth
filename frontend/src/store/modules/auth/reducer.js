import produce from 'immer';

const INITIAL_STATE = {
  token: null,
  isLoggedIn: false,
  loading: false,
  user: null,
};

export default function auth(state = INITIAL_STATE, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case '@auth/SIGN_IN_REQUEST': {
        draft.loading = true;
        break;
      }
      case '@auth/SIGN_IN_SUCCESS': {
        draft.token = action.payload.token;
        draft.user = action.payload.user;
        draft.isLoggedIn = true;
        draft.loading = false;
        break;
      }
      case '@auth/SIGN_FAILURE': {
        draft.loading = false;
        break;
      }
      case '@auth/SIGN_OUT': {
        draft.token = null;
        draft.isLoggedIn = false;
        break;
      }
      default:
    }
  });
}
