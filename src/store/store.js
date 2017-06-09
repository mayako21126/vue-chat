/**
 * Vuex
 * http://vuex.vuejs.org/zh-cn/intro.html
 */
import Vue from 'vue';
import Vuex from 'vuex';
import config from '../config/config'
import VueResource from 'vue-resource'
Vue.use(Vuex);
Vue.use(VueResource);
var httpV = Vue.http;
httpV.options.emulateJSON = true;
httpV.options.emulateHTTP = true;
const now = new Date();
const store = new Vuex.Store({
  actions: {
    async initData({ dispatch, commit,state }, type) {
      //type 0 pc 1mobile
      commit('CHANGE_TYPE', type);
      await dispatch('initList');
      await dispatch('selectSession', 0);
      commit('SHOW');

      window.setInterval(async function () {
        console.log('刷新')
        await store.dispatch('initList');
        for (var i in state.lists) {
          if (state.lists[i].id == state.currentSessionId) {
            state.selectIndex = i;
          }
        }
        store.dispatch('selectSession', state.selectIndex);
      }, 3000)
      commit('INIT_DATA');

    },
    async initList({ commit,state  }) {
      var type = (state.type == 'pc') ? 24103 : 8103;
      var shopID = 12;
      return new Promise((resolve, reject) => {
        httpV.post(config.apis + state.url, {
          type: type,
          ShopID: shopID
        }).then(function (res) {
          if (config.auth(res)) {
            var list = [];
            if (state.type == 'pc') {
              for (var i of res.body.data) {
                var user = JSON.parse(i.UserInfo)

                var tmp = {
                  id: i.UserID,
                  chatNum: i.ChatNum,
                  user: {
                    img: user[0].Headimgurl,
                    name: user[0].NickName,
                    userID: user[0].UserID
                  }
                };
                list.push(tmp)
              }
            } else {
              for (var i of res.body.data) {
                var user = JSON.parse(i.ShopInfo)
                var tmp = {
                  id: i.shopID,
                  chatNum: i.ChatNum,
                  user: {
                    img: 'static/images/1.jpg',
                    name: user[0].ShopName,
                    userID: i.shopID
                  }
                }
                list.push(tmp)
              }
            }


            commit('INIT_LIST', list);
          }
          resolve();
        }, function (err) {
          console.log(err)
          reject();
        })
      })
    },
    sendMessage: ({ commit,state }, content) => {
      var type = (state.type == 'pc') ? 24101 : 8101;
      var shopID = 12;
      return new Promise((resolve, reject) => {
        httpV.post(config.apis + state.url, {
          type: type,
          UserID: state.currentSessionId,
          MSGContent: content,
          GoodID: 66,
          ShopID: shopID
        }).then(function (res) {
          if (config.auth(res)) {
            commit('SEND_MESSAGE', content)
          }
          resolve();
        }, function (err) {
          console.log(err)
          reject();
        })
      })

    },
    async selectSession({ commit,state }, id) {
      var type = (state.type == 'pc') ? 24102 : 8102;
      var shopID;
      var userid;
      if(state.lists.length<=0){
        return false
      }
      shopID = state.lists[0].id;
      userid = state.lists[id].id;
      return new Promise((resolve, reject) => {
        httpV.post(config.apis + state.url, {
          type: type,
          UserID: userid,
          ShopID: shopID
        }).then(function (res) {
          if (config.auth(res)) {
            commit('SELECT_SESSION', {id: id, data: res.body.data})
          }
          resolve();
        }, function (err) {
          console.log(err)
          reject();
        })
      })
    },
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
    lists: ({ lists, filterKey }) => {
      let result = lists.filter(list => list.user.name.includes(filterKey));
      return result;
    },
    //session: ({ sessions, currentSessionId }) => sessions.find(session => session.id === currentSessionId),
    // 当前会话index
    currentId: ({ currentSessionId }) => currentSessionId
  },
  state: {
    url: 'Shop_MessageInfo.ashx',
    type: 'pc',
    selfID: 12,
    // 当前用户
    user: {
      name: 'coffce',
      img: 'static/images/1.jpg',
      userID: 12
    },
    show: false,
    session: {},
    // 会话列表
    lists: [
      {
        id: 1,
        user: {
          name: '爱新',
          img: 'static/images/2.png',
          userID: 1
        },
        messages: [

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
    sessions: [
      {
        id: 1,
        user: {
          name: '爱新',
          img: 'static/images/2.png',
          userID: 1
        },
        messages: [
          {
            content: '休闲鞋',
            date: now,
            id: 2
          }, {
            content: '123',
            date: now,
            id: 3
          }, {
            content: '我自己',
            date: now,
            self: true
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
    filterKey: '',
    selectIndex: 0
  },
  mutations: {
    CHANGE_TYPE(state, x){
      if (x == 0) {
        state.type = 'pc';
        state.url = 'Shop_MessageInfo.ashx';
        state.selfID = 12;
      } else {
        state.type = 'mobile';
        state.url = 'User_MessageInfo.ashx';
        state.selfID = 1;
      }
    },
    SHOW (state) {
      state.show = true;
    },
    INIT_DATA (state) {

      //let data = localStorage.getItem('vue-chat-session');
      //if (data) {
      //    state.sessions = JSON.parse(data);
      //}
    },
    INIT_LIST (state, list) {
      let data = list;

      if (data) {
        state.lists = data;
      }
    },
    // 发送消息
    SEND_MESSAGE ({ sessions, currentSessionId,session ,user,selfID}, content) {

      session.messages.push({
        MSGContent: content,
        RegistTime: new Date(),
        UserID: currentSessionId,
        SelfID: selfID
      });
    },
    // 选择会话
    SELECT_SESSION (state, {id,data}) {
      state.lists[id].chatNum = 0;
      state.currentSessionId = state.lists[id].id;
      state.selectIndex = id;
      state.session = {
        id: state.lists[id].id,
        messages: data,
        user: state.lists[id].user
      }
    },
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
