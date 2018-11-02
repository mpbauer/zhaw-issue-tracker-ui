import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './views/Dashboard.vue';
import Projects from './views/Projects.vue';
import ProjectDetails from './views/ProjectDetails.vue';

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/', component: Dashboard },
    {
      path: '/projects',
      component: Projects
    },
    {
      path: '/projects/:projectId',
      component: ProjectDetails
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import(/* webpackChunkName: "about" */ './views/Settings.vue')
    }
  ]
});
