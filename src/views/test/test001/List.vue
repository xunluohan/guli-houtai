<template>
  <div>test001
    <el-button type="primary" v-if="$btnBP('btn.Test111.add')">添加</el-button>
    <el-button type="warning" v-if="$btnBP('btn.Test111.update')">修改</el-button>
    <el-button type="danger" v-if="$btnBP('btn.Test111.remove')">删除</el-button>
  </div>
</template>

<script>
export default {
  name: '',
}
</script>

<style lang="less" scoped>

</style>
