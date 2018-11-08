import Vue from 'vue';

export default {
  state: {
    projects: [], // This is a simple array which holds the list of projects
    issues: {} // This is an object which acts as a map where the key is the project id
  },
  getters: {
    projects: (state) => state.projects,
    getProject: (state) => (id) => {
      return state.projects.find(todo => todo.id === id);
    },
    getIssue: (state) => (projectId) => {
      const issues = state.issues[projectId];
      if (!issues) {
        return null;
      }
      let issuesToDo = issues.filter(issue => issue.status === 'todo');
      let issuesInProgress = issues.filter(issue => issue.status === 'in_progress');
      let issuesDone = issues.filter(issue => issue.status === 'done');
      return {
        issuesToDo: issuesToDo,
        issuesInProgress: issuesInProgress,
        issuesDone: issuesDone
      };
    }
  },
  mutations: {
    updateProjects (state, projects) {
      state.projects = projects; // remove once map is used everywhere
    },
    addProject (state, project) {
      state.projects.push(project);
    },
    updateProject (state, project) {
      const index = state.projects.findIndex(entry => entry.id === project.id);
      if (index > -1) {
        // Vue.set() is required here because Vue cannot detect updates to individual Array elements
        Vue.set(state.projects, index, project);
      } else {
        state.projects.push(project);
      }
    },
    deleteProject (state, projectId) {
      const index = state.projects.findIndex(entry => entry.id === projectId);
      if (index > -1) {
        state.projects.splice(index, 1);
      }
    },
    updateIssues (state, { projectId, issues }) {
      Vue.set(state.issues, projectId, issues);
    },
    addIssue (state, { projectId, issue }) {
      let issues = state.issues[projectId];
      if (issues) {
        issues.push(issue);
        Vue.set(state.issues, projectId, issues);
      } else {
        Vue.set(state.issues, projectId, [issue]);
      }
    },
    updateIssue (state, { projectId, issue }) {
      let issues = state.issues[projectId];
      if (issues) {
        const index = issues.findIndex(entry => entry.id === issue.id);
        if (index > -1) {
          issues.splice(index, 1, issue);
          Vue.set(state.issues, projectId, issues);
        }
      }
    },
    deleteIssue (state, { projectId, issueId }) {
      let issues = state.issues[projectId];
      if (issues) {
        const index = issues.findIndex(entry => entry.id === issueId);
        if (index > -1) {
          issues.splice(index, 1);
          Vue.set(state.issues, projectId, issues);
        }
      }
    }
  },
  actions: {
    getAllProjects: function (context) {
      return Vue.axios.get('/projects')
        .then(result => {
          return context.commit('updateProjects', result.data);
        })
        .catch(error => {
          console.error(error);
          return Promise.reject(error);
        });
    },
    getProject: function (context, projectId) {
      return Vue.axios.get(`/projects/${projectId}`)
        .then(result => {
          return context.commit('updateProject', result.data);
        })
        .catch(error => {
          console.error(error);
          return Promise.reject(error);
        });
    },
    createProject: function (context, project) {
      return Vue.axios.post(`/projects`, project)
        .then(result => {
          return context.commit('addProject', result.data);
        })
        .catch(error => {
          console.error(error);
          return Promise.reject(error);
        });
    },
    updateProject: function (context, project) {
      return Vue.axios.put(`/projects/${project.id}`, project)
        .then(result => {
          return context.commit('updateProject', result.data);
        })
        .catch(error => {
          console.error(error);
          return Promise.reject(error);
        });
    },
    deleteProject: function (context, projectId) {
      return Vue.axios.delete(`/projects/${projectId}`)
        .then(() => context.commit('deleteProject', projectId))
        .catch(error => {
          console.error(error);
          return Promise.reject(error);
        });
    },
    getIssues: function (context, projectId) {
      return Vue.axios.get(`/projects/${projectId}/issues`)
        .then(result => {
          const issues = result.data;
          return context.commit('updateIssues', { projectId, issues });
        })
        .catch(error => {
          console.error(error);
          return Promise.reject(error);
        });
    },
    getIssue: function (context, { projectId, issueId }) {
      return Vue.axios.get(`/projects/${projectId}/issues/${issueId}`)
        .then(result => {
          const issues = result.data;
          return context.commit('updateIssue', { projectId, issues });
        })
        .catch(error => {
          console.error(error);
          return Promise.reject(error);
        });
    },
    createIssue: function (context, { projectId, issue }) {
      return Vue.axios.post(`/projects/${projectId}/issues`, issue)
        .then(result => {
          const issue = result.data;
          return context.commit('addIssue', { projectId, issue });
        })
        .catch(error => {
          console.error(error);
          return Promise.reject(error);
        });
    },
    updateIssue: function (context, { projectId, issue }) {
      return Vue.axios.put(`/projects/${projectId}/issues/${issue.id}`, issue)
        .then(result => {
          const issue = result.data;
          return context.commit('updateIssue', { projectId, issue });
        })
        .catch(error => {
          console.error(error);
          return Promise.reject(error);
        });
    },
    deleteIssue: function (context, { projectId, issueId }) {
      return Vue.axios.delete(`/projects/${projectId}/issues/${issueId}`)
        .then(() => context.commit('deleteIssue', { projectId, issueId }))
        .catch(error => {
          console.error(error);
          return Promise.reject(error);
        });
    }
  }
};
