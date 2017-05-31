<script type="text/ecmascript-6">
import { actions } from '../store/store';
import { mapActions,mapGetters} from 'vuex'

export default {
  data(){
    return{
      content:''
    }
  },
    computed:{
      ...mapGetters([
        'user',
        'session'
      ])
    },
    methods: {
      ...mapActions({
        sendMessage: 'sendMessage' // 映射 this.add() 为 this.$store.dispatch('increment')
      }),
        onKeyup (e) {
            if (e.keyCode === 13 && this.content.length) {
                this.sendMessage(this.content);
                this.content = '';
            }
        }
    }
};
</script>

<template>
<div class="text">
    <textarea placeholder="按 Enter 发送" v-model="content" @keyup="onKeyup"></textarea>
</div>
</template>

<style  scoped>
  .text {
    height: 160px;
    border-top: solid 1px #ddd;
  }
  .text textarea {
    padding: 10px;
    height: 100%;
    width: 100%;
    border: none;
    outline: none;
    font-family: "Micrsofot Yahei";
    resize: none;
  }

</style>
