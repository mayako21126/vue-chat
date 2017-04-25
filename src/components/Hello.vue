<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button @click="change">xx</button>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      msg: 'Hello World!'
    }
  },
  methods:{
    change(){
      this.msg='xxx';
    }
  }
}
</script>

<style scoped>
  :root {
    --mainColor: red;
    --danger-theme: {
      color: white;
      border:1px solid sienna;
    };
  }
  a{
    color: var(--mainColor);
  }
  span {
    @apply --danger-theme;
  }
</style>
