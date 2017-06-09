<script type="text/ecmascript-6">
  import { mapGetters,mapState} from 'vuex'
export default {
  data(){
    return {

    }
  },
  computed: {
    ...mapGetters([
      'user'
    ]),
    ...mapState({
      'session':'session',
      'selfID':'selfID',
      'show':'show'
    })
  },
  mounted () {
    this.$nextTick(
      function(){
        var el = this.$el;
        el.scrollTop = el.scrollTop + el.scrollHeight - el.clientHeight
      }
    )},
  methods:{
    showTime(x,xx){
      if(xx!=0){
        var date = new Date(this.session.messages[xx-1].RegistTime);
        var date1 = new Date(x);

        if((date1 - date)<1000*60){
          return false;
        }else{
          return true;
        }

      }else{
        return true;
      }


    }
  },
    filters: {
        // 将日期过滤为 hour:minutes
        time (date) {
            if (typeof date === 'string') {
                date = new Date(date);
            }
            return date.getHours() + ':' + date.getMinutes();
        }
    },
    directives: {
        // 发送消息后滚动到底部
        'scroll-bottom':function(el) {
          componentUpdated: {

            setTimeout(()=>{el.scrollTop = el.scrollTop + el.scrollHeight - el.clientHeight},5);
          }
        }
    }
};
</script>

<template>
<div class="message" v-scroll-bottom="session.messages" >
    <ul v-if="show">
        <li v-for="(item,index) in session.messages">
            <p class="time" v-if="showTime(item.RegistTime,index)">
                <span>{{ item.RegistTime | time }}</span>
            </p>
            <div class="main" :class="{ self: item.SelfID == selfID}">
                <img class="avatar" width="30" height="30" :src="item.SelfID == selfID ? user.img : session.user.img" />
                <div class="text">{{ item.MSGContent }}</div>
            </div>
        </li>
    </ul>
</div>

</template>

<style scoped>
  .message {
    padding: 10px 15px;
    overflow-y: scroll;
  }
  .message li {
    margin-bottom: 15px;
  }
  .message .time {
    margin: 7px 0;
    text-align: center;
  }
  .message .time > span {
    display: inline-block;
    padding: 0 18px;
    font-size: 12px;
    color: #fff;
    border-radius: 2px;
    background-color: #dcdcdc;
  }
  .message .avatar {
    float: left;
    margin: 0 10px 0 0;
    border-radius: 3px;
  }
  .message .text {
    display: inline-block;
    position: relative;
    padding: 0 10px;
    max-width: calc(100% - 40px);
    min-height: 30px;
    line-height: 2.5;
    font-size: 12px;
    text-align: left;
    word-break: break-all;
    background-color: #fafafa;
    border-radius: 4px;
  }
  .message .text:before {
    content: " ";
    position: absolute;
    top: 9px;
    right: 100%;
    border: 6px solid transparent;
    border-right-color: #fafafa;
  }
  .message .self {
    text-align: right;
  }
  .message .self .avatar {
    float: right;
    margin: 0 0 0 10px;
  }
  .message .self .text {
    background-color: #b2e281;
  }
  .message .self .text:before {
    right: inherit;
    left: 100%;
    border-right-color: transparent;
    border-left-color: #b2e281;
  }

</style>
