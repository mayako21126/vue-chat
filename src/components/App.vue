<script type="text/ecmascript-6">
import { mapActions } from 'vuex'

import Card from '../components/card.vue';
import List from '../components/list';
import TextA from '../components/text';
import Message from '../components/message';

export default {
    components: { Card, List, TextA, Message },
    created () {
      this.initData(0);
    },
  methods:{
    ...mapActions({
      initData: 'initData' // 映射 this.add() 为 this.$store.dispatch('increment')
    })
  }
}
</script>

<template>
<div id="content">
    <div class="sidebar">
        <card></card>
        <list></list>
    </div>
    <div class="main">
        <message></message>
        <textA></textA>
    </div>
</div>
</template>

<style scoped>
  #content {
    margin: 20px auto;
    width: 800px;
    height: 600px;
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
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
  }
  #content .message {
    height: calc(100% - 160px);
  }
  textarea {
    width: 400px;
    height: 300px;
    font-size: 12px;
  }

</style>
