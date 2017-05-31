/**
 * Vuex
 * http://vuex.vuejs.org/zh-cn/intro.html
 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const now = new Date();
const store = new Vuex.Store({
  actions:{
    initData({ commit }) { commit('INIT_DATA')},
    sendMessage: ({ commit }, content) => commit('SEND_MESSAGE', content),
    selectSession: ({ commit }, id) => commit('SELECT_SESSION', id),
    search: ({ commit }, value) => commit('SET_FILTER_KEY', value)
  },
  getters: {
    user: ({ user }) => user,
//    等于
//  (state) => {
//  return state.user
//},
    filterKey: ({ filterKey }) => filterKey,
    sessions: ({ sessions, filterKey }) => {
      let result = sessions.filter(session => session.user.name.includes(filterKey));
      return result;
    },
    session: ({ sessions, currentSessionId }) => sessions.find(session => session.id === currentSessionId),
    // 当前会话index
    currentId: ({ currentSessionId }) => currentSessionId
  },
    state: {
        // 当前用户
        user: {
            name: 'coffce',
            img: 'static/images/1.jpg',
            userID:0
        },
        // 会话列表
        sessions: [
            {
                id: 1,
                user: {
                    name: '爱新',
                    img: 'static/images/2.png',
                    userID:1
                },
                messages: [
                    {
                        content: '休闲鞋',
                        date: now,
                        id:2
                    }, {
                        content: '123',
                        date: now,
                        id:3
                    },{
                      content:'我自己',
                      date:now,
                      self:true
                  }
                ]
            },
            {
                id: 2,
                user: {
                    name: 'Virue',
                    img: 'static/images/3.jpg'
                },
                messages: []
            }
        ],
        // 当前选中的会话
        currentSessionId: 1,
        // 过滤出只包含这个key的会话
        filterKey: ''
    },
    mutations: {
        INIT_DATA (state) {
            let data = localStorage.getItem('vue-chat-session');
            if (data) {
                state.sessions = JSON.parse(data);
            }
        },
        // 发送消息
        SEND_MESSAGE ({ sessions, currentSessionId }, content) {
            let session = sessions.find(item => item.id === currentSessionId);
            session.messages.push({
                content: content,
                date: new Date(),
                self: true
            });
        },
        // 选择会话
        SELECT_SESSION (state, id) {
            state.currentSessionId = id;
        } ,
        // 搜索
        SET_FILTER_KEY (state, value) {
            state.filterKey = value;
        }
    }
});

store.watch(
    (state) => state.sessions,
    (val) => {
        console.log('CHANGE: ', val);
        localStorage.setItem('vue-chat-session', JSON.stringify(val));
    },
    {
        deep: true
    }
);

export default store;
export const actions = {
    initData: ({ dispatch }) => commit('INIT_DATA'),
    sendMessage: ({ dispatch }, content) => dispatch('SEND_MESSAGE', content),
    selectSession: ({ dispatch }, id) => dispatch('SELECT_SESSION', id),
    search: ({ dispatch }, value) => dispatch('SET_FILTER_KEY', value)
};
