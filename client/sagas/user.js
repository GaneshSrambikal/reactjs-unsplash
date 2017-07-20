/*eslint-disable no-constant-condition*/
import {take, put, call, all} from 'redux-saga/effects';
import {push} from 'react-router-redux';
import {GE_ACCESS_TOKEN} from '../constants/action-types';
import {getAccessToken} from '../api/user';
import {setAccessToken} from '../actions/user';

/**
 * get access token flow
 */
export function* getAccessTokenF() {
  while (true) {
    const {code} = yield take(GE_ACCESS_TOKEN);
    // check code define or not
    if (!code) {
      yield put(push('/auth'));
      return;
    }
    const {response, error} = yield call(getAccessToken, code);
    if (response) {
      yield all([
        put(setAccessToken(response)),
        put(push('/'))
      ]);
    } else if (error.code === 401) {
      // handle it when token is invalid
      yield put(push('/auth'));
    } else {
      //TODO: handle common errors
    }
  }
}