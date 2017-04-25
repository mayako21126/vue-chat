<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      msg: 'Hello World!'
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
