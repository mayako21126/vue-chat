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
  actions:{
    async initData({ dispatch, commit }) {
      await dispatch('initList');
      await dispatch('selectSession',0);
      commit('SHOW');
      commit('INIT_DATA');
    },
    async initList({ commit }) {
      return new Promise((resolve, reject) => {
        httpV.post( config.apis+"/Shop_MessageInfo.ashx", {
          type: 24103,
          UserID:1
        }).then(function (res) {
            if(config.auth(res)){
              var list=[];
              for (var i of res.body.data) {
                var user = JSON.parse(i.UserInfo)
                var tmp={
                  id:i.UserID,
                  user:{
                    img:user[0].Headimgurl,
                    name:user[0].NickName,
                    userID:user[0].UserID
                  }
                }
                list.push(tmp)
              }
              commit('INIT_LIST',list);
            }
            resolve();
        },function(err){
          console.log(err)
          reject();
        })
      })
    },
    sendMessage: ({ commit,state }, content) => {
      return new Promise((resolve, reject) => {
        httpV.post( config.apis+"/Shop_MessageInfo.ashx", {
          type: 24101,
          UserID:state.currentSessionId,
          MSGContent:content,
          GoodID:66
        }).then(function (res) {
          if(config.auth(res)){
            console.log(res)
            commit('SEND_MESSAGE', content)
          }
          resolve();
        },function(err){
          console.log(err)
          reject();
        })
      })

    },
    async selectSession({ commit,state }, id) {
      return new Promise((resolve, reject) => {
        httpV.post( config.apis+"/Shop_MessageInfo.ashx", {
          type: 24102,
          UserID:state.lists[id].id
        }).then(function (res) {
          if(config.auth(res)){
            console.log('await',res)
            commit('SELECT_SESSION', {id:id,data:res.body.data})
          }
          resolve();
        },function(err){
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
        // 当前用户
        user: {
            name: 'coffce',
            img: 'static/images/1.jpg',
            userID:12
        },
        show:false,
        session:{},
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
        filterKey: '',
        selectIndex:0
    },
    mutations: {
        SHOW (state) {
          state.show=true;
        },
         INIT_DATA (state) {
           window.setInterval(function(){
             console.log('刷新')
             store.dispatch('initList');
             store.dispatch('selectSession',state.selectIndex);
           },5000)
            //let data = localStorage.getItem('vue-chat-session');
            //if (data) {
            //    state.sessions = JSON.parse(data);
            //}
        },
        INIT_LIST (state,list) {
        let data = list;
        if (data) {
          state.lists=data;


        }
        },
        // 发送消息
        SEND_MESSAGE ({ sessions, currentSessionId,session ,user}, content) {

            session.messages.push({
              MSGContent: content,
              RegistTime: new Date(),
              UserID: currentSessionId,
              SelfID: user.userID
            });
        },
        // 选择会话
        SELECT_SESSION (state, {id,data}) {
            state.currentSessionId = state.lists[id].id;
            state.selectIndex = id;
            state.session={
            id:state.lists[id].id,
            messages:data,
            user:state.lists[id].user
          }
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
