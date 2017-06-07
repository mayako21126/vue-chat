<script type="text/ecmascript-6">
import { actions } from '../store/store';
import { mapActions,mapGetters,mapState} from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'sessions','lists'
    ]),
    ...mapState({
      'currentId':'currentSessionId',
      'show':'show'
    })
  },methods:{
    ...mapActions({
      selectSession: 'selectSession'
    })
  }
};
</script>

<template>
<div class="list">
    <ul v-if="show">
        <li v-for="(item,i) in lists" :class="{ active: item.id === currentId }" @click="selectSession(i)" >
            <img class="avatar"  width="30" height="30" :alt="item.user.name" :src="item.user.img">
            <p class="name">{{item.user.name}}</p>
        </li>
    </ul>
</div>
</template>

<style scoped >
  .list li {
    padding: 12px 15px;
    border-bottom: 1px solid #292C33;
    cursor: pointer;
    transition: background-color 0.1s;
  }
  .list li:hover {
    background-color: rgba(255, 255, 255, 0.03);
  }
  .list li.active {
    background-color: rgba(255, 255, 255, 0.1);
  }
  .list .avatar,
  .list .name {
    vertical-align: middle;
  }
  .list .avatar {
    border-radius: 2px;
  }
  .list .name {
    display: inline-block;
    margin: 0 0 0 15px;
  }

</style>
