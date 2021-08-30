import { ThunkAction } from 'redux-thunk';
import { RootState } from '../reducers';
import { AuthUser, Weighing } from '../../models';
import {
  createWeighing,
  getWeighings,
  updateWeighing,
  deleteWeighing,
  getProfile,
} from '../../util/http';
import { ActionType } from '../action-types';
import { NotificationAction, WeighingsAction, AuthAction } from '../actions';
import { Dispatch } from 'redux';

type WeighingThunk = ThunkAction<
  void,
  RootState,
  unknown,
  WeighingsAction | NotificationAction
>;

type AuthThunk = ThunkAction<
  void,
  RootState,
  unknown,
  AuthAction | NotificationAction
>;

type NotificationThunk = ThunkAction<
  void,
  unknown,
  unknown,
  NotificationAction
>;

const showNotification = (dispatch: Dispatch, action: NotificationAction) => {
  dispatch({ type: ActionType.HIDE_NOTIFICATION });
  setTimeout(() => dispatch(action), 150);
};

export const showSuccessNotification =
  (message: string): NotificationThunk =>
  (dispatch) => {
    showNotification(dispatch, {
      type: ActionType.SHOW_SUCCESS_NOTIFICATION,
      payload: { message },
    });
  };

export const showErrorNotification =
  (message: string): NotificationThunk =>
  (dispatch) => {
    showNotification(dispatch, {
      type: ActionType.SHOW_ERROR_NOTIFICATION,
      payload: { message },
    });
  };

const showErrorOnProtectedRoute = (
  dispatch: Dispatch,
  err: any,
  message: string
) => {
  const isNotAuth = (err.response?.status ?? 401) === 401;
  if (isNotAuth) {
    dispatch({ type: ActionType.LOGOUT_USER });
  }
  showNotification(dispatch, {
    type: ActionType.SHOW_ERROR_NOTIFICATION,
    payload: { message },
  });
};

export const setWeighings = (): WeighingThunk => async (dispatch, getState) => {
  dispatch({ type: ActionType.INIT_WEIGHINGS_HTTP_REQUEST });

  try {
    const { token } = getState().authUser;
    const { data } = await getWeighings(token);
    dispatch({
      type: ActionType.SET_WEIGHINGS,
      payload: { weighings: data },
    });
  } catch (err) {
    dispatch({ type: ActionType.END_WEIGHINGS_HTTP_REQUEST });
    showErrorOnProtectedRoute(dispatch, err, 'Could not get user data');
  }
};

export const addWeighing =
  (weighing: Weighing): WeighingThunk =>
  async (dispatch, getState) => {
    dispatch({ type: ActionType.INIT_WEIGHINGS_HTTP_REQUEST });

    try {
      const { token } = getState().authUser;
      const { data } = await createWeighing(token, weighing);
      dispatch({
        type: ActionType.ADD_WEIGHING,
        payload: {
          weighing: {
            ...weighing,
            id: data.id,
          },
        },
      });
      showNotification(dispatch, {
        type: ActionType.SHOW_SUCCESS_NOTIFICATION,
        payload: { message: 'Weighing added!' },
      });
    } catch (err) {
      dispatch({ type: ActionType.END_WEIGHINGS_HTTP_REQUEST });
      showErrorOnProtectedRoute(dispatch, err, err.message);
    }
  };

export const editWeighing =
  (weighing: Weighing): WeighingThunk =>
  async (dispatch, getState) => {
    dispatch({ type: ActionType.INIT_WEIGHINGS_HTTP_REQUEST });

    try {
      const { token } = getState().authUser;
      await updateWeighing(token, weighing);
      dispatch({
        type: ActionType.EDIT_WEIGHING,
        payload: { weighing },
      });
      showNotification(dispatch, {
        type: ActionType.SHOW_SUCCESS_NOTIFICATION,
        payload: { message: 'Weighing updated!' },
      });
    } catch (err) {
      dispatch({ type: ActionType.END_WEIGHINGS_HTTP_REQUEST });
      showErrorOnProtectedRoute(dispatch, err, err.message);
    }
  };

export const removeWeighing =
  (id: number): WeighingThunk =>
  async (dispatch, getState) => {
    dispatch({ type: ActionType.INIT_WEIGHINGS_HTTP_REQUEST });

    try {
      const { token } = getState().authUser;
      await deleteWeighing(token, id);
      dispatch({
        type: ActionType.DELETE_WEIGHING,
        payload: { id },
      });
      showNotification(dispatch, {
        type: ActionType.SHOW_SUCCESS_NOTIFICATION,
        payload: { message: 'Weighing deleted.' },
      });
    } catch (err) {
      dispatch({ type: ActionType.END_WEIGHINGS_HTTP_REQUEST });
      showErrorOnProtectedRoute(dispatch, err, err.message);
    }
  };

export const setProfile = (): AuthThunk => async (dispatch, getState) => {
  try {
    const { token } = getState().authUser;
    const {
      data: { username },
    } = await getProfile(token);
    dispatch({
      type: ActionType.SET_PROFILE,
      payload: { username },
    });
  } catch (err) {
    showErrorOnProtectedRoute(dispatch, err, 'Could not get user data');
  }
};

export const authenticateUser = (authUser: AuthUser) => ({
  type: ActionType.AUTHENTICATE_USER,
  payload: authUser,
});

export const logoutUser = () => ({
  type: ActionType.LOGOUT_USER,
});

export const hideNotification = () => ({
  type: ActionType.HIDE_NOTIFICATION,
});
