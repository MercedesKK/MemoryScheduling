<template>
  <a-page-header style="border: 1px solid rgb(235, 237, 240)" title="内存管理项目" sub-title="同济大学软件学院 张靖凯 2455650395@qq.com" />
  <HomeView />
</template>

<script>
import HomeView from './components/HomeView.vue'

export default {
  name: 'App',
  components: {
    HomeView,
  }
}
</script>

<style></style>
