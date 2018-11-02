import Api from '@/services/Api';

export default {
  getAllProjects () {
    return Api().get('/projects');
  },
  getIssues (projectId) {
    return Api().get(`/projects/${projectId}/issues`);
  }
};
