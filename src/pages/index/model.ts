import * as indexApi from './service';

export default {
  namespace: 'index',
  state: {
    count:1
  },

  effects: {
    * effectsDemo(_, { call, put }) {
      console.log(_);
      const { status, data } = yield call(indexApi.demo, {});
      if (status === 'ok') {
        yield put({ type: 'save',
          payload: {
            topData: data,
          } });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    add(state, { payload }){
      return {...state,count:payload.data+state.count}
    },
    jian(state,{payload}){
       return {...state,count:state.count-payload.data}
    }
  },

};
