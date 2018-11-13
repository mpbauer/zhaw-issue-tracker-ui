import Vue from 'vue';
import { isNullOrUndefined } from "../../views/helpers";

const operation = { create: 1, update: 2, delete: 3 };

function updateSyncState(obj, operation, isSynced) {
  obj.syncState = {
    operation: operation,
    synced: isSynced
  };
}

function setProjectSyncState(context, project, op, isSynced) {
  context.commit('setSyncState', {
    targetState: 'projects',
    operation: op,
    isSynced: isSynced,
    objectFinder: projects => projects.find(p => p.clientId === project.clientId)
  });
}

function setIssueSyncState(context, projectId, issue, op, isSynced) {
  context.commit('setSyncState', {
    targetState: 'issues',
    operation: op,
    isSynced: isSynced,
    objectFinder: issues => issues[projectId].find(i => i.clientId === issue.clientId)
  });
}

function isScheduledForDeletion(obj) {
  return !isNullOrUndefined(obj.syncState) && obj.syncState.operation === operation.delete;
}

export default {
  state: {
    projects: [], // This is a simple array which holds the list of projects
    issues: {} // This is an object which acts as a map where the key is the project id
  },
  getters: {
    projects: (state) => state.projects.filter(project => !isScheduledForDeletion(project)),
    getProject: (state) => (id) => {
      return state.projects.find(todo => todo.id === id && !isScheduledForDeletion(todo));
    },
    getIssue: (state) => (projectId) => {
      const issues = state.issues[projectId];
      if (!issues) {
        return null;
      }
      let issuesToDo = issues.filter(issue => issue.status === 'todo' && !isScheduledForDeletion(issue));
      let issuesInProgress = issues.filter(issue => issue.status === 'in_progress' && !isScheduledForDeletion(issue));
      let issuesDone = issues.filter(issue => issue.status === 'done' && !isScheduledForDeletion(issue));
      return {
        issuesToDo: issuesToDo,
        issuesInProgress: issuesInProgress,
        issuesDone: issuesDone
      };
    }
  },
  mutations: {
    updateProjects (state, projects) {
      if(!state.projects) state.projects = [];
      // merge project objects (1 from the server 1 from localStorage)
      projects.forEach(project => {
        const localProject = state.projects.find(entry => entry.id === project.id || entry.clientId === project.clientId);
        if (!isNullOrUndefined(localProject)) {
          const localKeys = Object.keys(localProject);
          localKeys.forEach(key => project[key] = localProject[key]);
        }
      });

      state.projects = projects;
    },
    addProject (state, project) {
      state.projects.push(project);
    },
    updateProject (state, project) {
      const index = state.projects.findIndex(entry => entry.id === project.id || entry.clientId === project.clientId);
      if (index > -1) {
        // Vue.set() is required here because Vue cannot detect updates to individual Array elements
        Vue.set(state.projects, index, project);
      } else {
        state.projects.push(project);
      }
    },
    deleteProject (state, project) {
      const index = state.projects.findIndex(entry => entry.id === project.id || entry.clientId === project.clientId);
      if (index > -1) {
        state.projects.splice(index, 1);
      }
    },
    updateIssues (state, { projectId, issues }) {
      if(!state.issues) state.issues = {};
      // merge project objects (1 from the server 1 from localStorage)
      const localIssuesOfProject = state.issues[projectId];
      const issuesOfProject = issues;
      if (!isNullOrUndefined(issuesOfProject) && !isNullOrUndefined(localIssuesOfProject)) {
        for(let i = 0; i < issuesOfProject.length; i++) {
          const issue = issuesOfProject[i];
          const localIssue = localIssuesOfProject.find(entry => entry.id === issue.id || entry.clientId === issue.clientId);
          if(!isNullOrUndefined(localIssue)) {
            const hasLocalChanges = !isNullOrUndefined(localIssue.syncState) && !localIssue.syncState.synced;
            if (!hasLocalChanges) {
              const keys = Object.keys(localIssue);
              keys.forEach(key => localIssue[key] = issue[key]);
            }
            issuesOfProject[i] = localIssue;
          }
        }
      }
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
        const index = issues.findIndex(entry => entry.id === issue.id || entry.clientId === issue.clientId);
        if (index > -1) {
          issues.splice(index, 1, issue);
          Vue.set(state.issues, projectId, issues);
        }
      }
    },
    deleteIssue (state, { projectId, issue }) {
      let issues = state.issues[projectId];
      if (issues) {
        const index = issues.findIndex(entry => entry.id === issue.id || entry.clientId === issue.clientId);
        if (index > -1) {
          issues.splice(index, 1);
          Vue.set(state.issues, projectId, issues);
        }
      }
    },
    setSyncState (state, payload) {
      let target = state[payload.targetState];
      if (!target) return;

      const obj = payload.objectFinder(target);
      if (isNullOrUndefined(obj)) return;
      updateSyncState(obj, payload.operation, payload.isSynced);
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
      updateSyncState(project, operation.create, true);
      context.commit('addProject', project);
      return Vue.axios.post(`/projects`, project)
        .then(result => context.commit('updateProject', result.data))
        .catch(error => {
          setProjectSyncState(context, project, operation.create, false);
          console.error(error);
          return Promise.reject(error);
        });
    },
    updateProject: function (context, project) {
      context.commit('updateProject', project);
      return Vue.axios.put(`/projects/${project.id}`, project)
        .then(() => setProjectSyncState(context, project, operation.update, true))
        .catch(error => {
          setProjectSyncState(context, project, operation.update, false);
          console.error(error);
          return Promise.reject(error);
        });
    },
    deleteProject: function (context, project) {
      setProjectSyncState(context, project, operation.delete, false);
      return Vue.axios.delete(`/projects/${project.id}`)
        .then(() => context.commit('deleteProject', project))
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
      updateSyncState(issue, operation.create, true);
      context.commit('addIssue', { projectId, issue });
      return Vue.axios.post(`/projects/${projectId}/issues`, issue)
        .then(result => {
          const issue = result.data;
          context.commit('updateIssue', { projectId, issue });
        })
        .catch(error => {
          setIssueSyncState(context, projectId, issue, operation.create, false);
          console.error(error);
          return Promise.reject(error);
        });
    },
    updateIssue: function (context, { projectId, issue }) {
      context.commit('updateIssue', { projectId, issue });
      return Vue.axios.put(`/projects/${projectId}/issues/${issue.id}`, issue)
        .then(() => setIssueSyncState(context, projectId, issue, operation.update, true))
        .catch(error => {
          setIssueSyncState(context, projectId, issue, operation.update, false);
          console.error(error);
          return Promise.reject(error);
        });
    },
    deleteIssue: function (context, { projectId, issue }) {
      setIssueSyncState(context, projectId, issue, operation.delete, false);
      return Vue.axios.delete(`/projects/${projectId}/issues/${issue.id}`)
        .then(() => context.commit('deleteIssue', { projectId, issue }))
        .catch(error => {
          console.error(error);
          return Promise.reject(error);
        });
    },
    syncWithServer: function (context) {
      const promises = [];

      const projects = context.state.projects;
      projects.forEach(project => {
        const needsSync = !isNullOrUndefined(project.syncState) && !project.syncState.synced;
        if (!needsSync) return;
        let promise = undefined;
        switch (project.syncState.operation) {
          case operation.create:
            // update is correct, we don't want to add it twice
            promise = context.dispatch('updateProject', project);
            break;
          case operation.update:
            promise = context.dispatch('updateProject', project);
            break;
          case operation.delete:
            promise = context.dispatch('deleteProject', project);
            break;
        }
        promises.push(promise);
      });

      const issues = context.state.issues;
      const projectIds = Object.keys(issues);
      for (const projectId of projectIds) {
        const issuesOfProject = issues[projectId];
        for(const issue of issuesOfProject) {
          const needsSync = !isNullOrUndefined(issue.syncState) && !issue.syncState.synced;
          if (!needsSync) continue;
          let promise = undefined;
          switch (issue.syncState.operation) {
            case operation.create:
              // update is correct, we don't want to add it twice
              promise = context.dispatch('updateIssue', { projectId, issue });
              break;
            case operation.update:
              promise = context.dispatch('updateIssue', { projectId, issue });
              break;
            case operation.delete:
              promise = context.dispatch('deleteIssue', { projectId, issue });
              break;
          }
          promises.push(promise);
        }
      }

      if (promises.length === 0) return Promise.resolve({ noElements: true });
      return Promise.all(promises);
    }
  }
};
