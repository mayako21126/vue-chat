<script type="text/ecmascript-6">
  import { mapActions } from 'vuex'
  import Message from '../components/message';
  import TextA from '../components/text';

  export default {
    components: { TextA, Message },
    created () {
      this.initData();
    },
    methods:{
      ...mapActions({
        initData: 'initData', // 映射 this.add() 为 this.$store.dispatch('increment')
        selectSession: 'selectSession'
      })
    }
  }
</script>

<template>
  <div id="content">
      <message></message>
      <textA></textA>
  </div>
</template>

<style scoped>
  body {
    overflow: hidden;
  }
  #content {
    margin: 0px auto;
    width: 100vw;
    height: calc(100vh - 0px);
    overflow: hidden;
    border-radius: 3px;
  }
  #content .sidebar,
  #content .main {
    height: 100%;
  }
  #content .sidebar {
    float: left;
    width: 200px;
    color: #f4f4f4;
    background-color: #2e3238;
  }
  #content .main {
    position: relative;
    overflow: hidden;
    background-color: #eee;
  }
  #content .text {

    height: 80px;
    width: 100%;
    bottom: 0;
    left: 0;
  }
  #content .message {
    height: calc(100vh - 80px);
  }
  textarea {

  }
  #content .text textarea{
    height: auto;
  }

</style>
