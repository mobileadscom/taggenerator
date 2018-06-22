import Vue from 'vue'
import Router from 'vue-router'
import TagGenerator from '@/components/TagGenerator'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'TagGenerator',
      component: TagGenerator
    }
  ]
})
