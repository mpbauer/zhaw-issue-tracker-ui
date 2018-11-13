<template>
    <v-container fluid grid-list-md>

        <v-layout id="issue-header-panel" v-if="selectedProject" row wrap>
            <h1>{{selectedProject.title}} </h1>
            <v-dialog v-model="showCreateDialog" persistent max-width="600px">
                <v-btn slot="activator" color="primary" dark ><v-icon>add</v-icon>CREATE NEW ISSUE</v-btn>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-card>
                        <v-card-title>
                            <span class="headline">Create a new issue</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs12>
                                        <v-text-field v-model="enteredTitle"
                                                      :rules="titleRules"
                                                      :counter="50"
                                                      label="Title*"
                                                      required>
                                        </v-text-field>
                                    </v-flex>
                                    <v-select xs9
                                            v-model="selectedSeverity"
                                            :items="severities"
                                            :rules="[v => !!v || 'Severity is required']"
                                            label="Severity*"
                                            required
                                    ></v-select>
                                    <v-flex xs3>
                                        <v-menu ref="dueDateMenu"
                                                :close-on-content-click="false"
                                                v-model="dueDateMenu"
                                                :nudge-right="40"
                                                :return-value.sync="selectedDueDate"
                                                lazy
                                                transition="scale-transition"
                                                offset-y
                                                full-width
                                                min-width="290px"
                                        >
                                            <v-text-field
                                                    slot="activator"
                                                    v-model="selectedDueDate"
                                                    label="Due date"
                                                    prepend-icon="event"
                                                    readonly
                                            ></v-text-field>
                                            <v-date-picker v-model="selectedDueDate" no-title scrollable>
                                                <v-spacer></v-spacer>
                                                <v-btn flat color="primary" @click="dueDateMenu = false">Cancel</v-btn>
                                                <v-btn flat color="primary" @click="$refs.dueDateMenu.save(selectedDueDate)">OK</v-btn>
                                            </v-date-picker>
                                        </v-menu>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-text-field v-model="enteredDescription"
                                                      :rules="descriptionRules"
                                                      :counter="150"
                                                      label="Description*"
                                                      required></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" flat @click.native="closeCreateDialog">Close</v-btn>
                            <v-btn color="blue darken-1" flat @click="submitCreation">Save</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-dialog>
        </v-layout>
        <v-layout v-if="issues" row wrap>
            <v-flex xs12 md4>
                <h2 class="swimlane-header">To Do</h2>
                <v-card v-if="issues.issuesToDo">
                    <v-layout row wrap>
                        <v-flex xs12 v-for="issue in issues.issuesToDo"
                                :key="issue.id"
                                :to="'/projects/' + issue.projectId + '/issues/' + issue.id"
                                @click="openEditDialog(issue)">
                            <v-card color="blue-grey darken-2" class="white--text" hover>
                                <v-layout row>
                                    <v-flex xs2>
                                        <img v-if="issue.severity==='Blocker'" class="severity-img" src="../assets/Blocker.svg"/>
                                        <img v-else-if="issue.severity==='Critical'" class="severity-img" src="../assets/Critical.svg"/>
                                        <img v-else-if="issue.severity==='Major'" class="severity-img" src="../assets/Major.svg"/>
                                        <img v-else-if="issue.severity==='Minor'" class="severity-img" src="../assets/Minor.svg"/>
                                    </v-flex>
                                    <v-flex xs10>
                                        <v-card-title class="issue-title-container"  primary-title >
                                            <div class="headline break-text">{{issue.title}}</div>
                                        </v-card-title>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-card-title class="issue-description-container" primary-title>
                                            <div class="break-text">{{issue.description}}</div>
                                        </v-card-title>
                                    </v-flex>
                                </v-layout>
                                <v-divider light></v-divider>
                                <v-card-actions>
                                    <v-btn flat dark @click.native.stop="updateStatus(issue, 'in_progress')">Start now
                                        <v-icon dark right>forward</v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
            <v-flex xs12 md4>
                <h2 class="swimlane-header" >In Progress</h2>
                <v-card v-if="issues.issuesInProgress">
                    <v-layout row wrap>
                        <v-flex xs12 v-for="issue in issues.issuesInProgress"
                                :key="issue.id"
                                :to="'/projects/' + issue.projectId + '/issues/' + issue.id"
                                @click="openEditDialog(issue)">
                            <v-card color="blue-grey darken-2" class="white--text" hover>
                                <v-layout row>
                                    <v-flex xs2>
                                        <img v-if="issue.severity==='Blocker'" class="severity-img" src="../assets/Blocker.svg"/>
                                        <img v-else-if="issue.severity==='Critical'" class="severity-img" src="../assets/Critical.svg"/>
                                        <img v-else-if="issue.severity==='Major'" class="severity-img" src="../assets/Major.svg"/>
                                        <img v-else-if="issue.severity==='Minor'" class="severity-img" src="../assets/Minor.svg"/>
                                    </v-flex>
                                    <v-flex xs10>
                                        <v-card-title class="issue-title-container"  primary-title>
                                            <div class="headline break-text">{{issue.title}}</div>
                                        </v-card-title>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-card-title class="issue-description-container" primary-title>
                                            <div class="break-text">{{issue.description}}</div>
                                        </v-card-title>
                                    </v-flex>
                                </v-layout>
                                <v-divider light></v-divider>
                                <v-card-actions>
                                    <v-btn flat dark @click.stop="updateStatus(issue, 'done')">DONE
                                        <v-icon dark right>check_circle</v-icon>
                                    </v-btn>
                                    <v-btn flat dark @click.stop="updateStatus(issue, 'todo')">CANCEL PROGRESS
                                        <v-icon dark right>cancel</v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
            <v-flex xs12 md4>
                <h2 class="swimlane-header">Done</h2>
                <v-card v-if="issues.issuesDone">
                    <v-layout row wrap>
                        <v-flex xs12 v-for="issue in issues.issuesDone"
                                :key="issue.id"
                                :to="'/projects/' + issue.projectId + '/issues/' + issue.id"
                                @click="openEditDialog(issue)">
                            <v-card color="blue-grey darken-2" class="white--text" hover>
                                <v-layout row>
                                    <v-flex xs2>
                                        <img v-if="issue.severity==='Blocker'" class="severity-img" src="../assets/Blocker.svg"/>
                                        <img v-else-if="issue.severity==='Critical'" class="severity-img" src="../assets/Critical.svg"/>
                                        <img v-else-if="issue.severity==='Major'" class="severity-img" src="../assets/Major.svg"/>
                                        <img v-else-if="issue.severity==='Minor'" class="severity-img" src="../assets/Minor.svg"/>
                                    </v-flex>
                                    <v-flex xs10>
                                        <v-card-title class="issue-title-container"  primary-title>
                                            <div class="headline break-text">{{issue.title}}</div>
                                        </v-card-title>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-card-title class="issue-description-container" primary-title>
                                            <div class="break-text">{{issue.description}}</div>
                                        </v-card-title>
                                    </v-flex>
                                </v-layout>
                                <v-divider light></v-divider>
                                <v-card-actions>
                                    <v-btn flat dark @click.stop="updateStatus(issue, 'in_progress')">RETURN TO
                                        IN-PROGRESS
                                        <v-icon dark right>undo</v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-card>

                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
        <v-dialog v-if="selectedIssue" v-model="showEditDialog" persistent max-width="600px">
            <v-form ref="editForm" v-model="valid" lazy-validation>
                <v-card>
                    <v-card-title xs9>
                        <span class="headline">Edit Project</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12>
                                    <v-text-field v-model="selectedIssue.title"
                                                  :rules="titleRules"
                                                  :counter="50"
                                                  label="Title*"
                                                  required>
                                    </v-text-field>
                                </v-flex>
                                <v-select xs9
                                          v-model="selectedIssue.severity"
                                          :items="severities"
                                          :rules="[v => !!v || 'Severity is required']"
                                          label="Severity*"
                                          required
                                ></v-select>
                                <v-flex xs3>
                                    <v-menu ref="editDueDateMenu"
                                            :close-on-content-click="false"
                                            v-model="editDueDateMenu"
                                            :nudge-right="40"
                                            :return-value.sync="selectedIssue.dueDate"
                                            lazy
                                            transition="scale-transition"
                                            offset-y
                                            full-width
                                            min-width="290px"
                                    >
                                        <v-text-field
                                                slot="activator"
                                                v-model="selectedIssue.dueDate"
                                                label="Due date"
                                                prepend-icon="event"
                                                readonly
                                        ></v-text-field>
                                        <v-date-picker v-model="selectedIssue.dueDate" no-title scrollable>
                                            <v-spacer></v-spacer>
                                            <v-btn flat color="primary" @click="editDueDateMenu = false">Cancel</v-btn>
                                            <v-btn flat color="primary" @click="$refs.editDueDateMenu.save(selectedIssue.dueDate)">OK</v-btn>
                                        </v-date-picker>
                                    </v-menu>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field v-model="selectedIssue.description"
                                                  :rules="descriptionRules"
                                                  :counter="150"
                                                  label="Description*"
                                                  required></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="blue darken-1" flat @click="submitDeletion"><v-icon>delete</v-icon>Delete</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click="closeEditDialog"><v-icon>cancel</v-icon>Cancel</v-btn>
                        <v-btn color="blue darken-1" flat @click="submitUpdate"><v-icon>update</v-icon>Update</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>

        <div id="issue-indicator" >
            <v-layout v-if="performingOperation" row justify-center>
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </v-layout>
            <indicator v-else :type="indicatorType" :message="indicatorMessage"></indicator>
        </div>

    </v-container>
</template>

<script lang="ts">
/* eslint-disable no-array-constructor */
import Vue from 'vue';
const uuidv1 = require('uuid/v1');

import Indicator from './Indicator.vue';
import { IndicatorType } from './IndicatorType.js';
import { httpErrorToErrorMessage, httpErrorToIndicatorType } from './helpers.js';

export default Vue.extend({
  name: 'project-details',
  data () {
    return {
      showCreateDialog: false,
      showEditDialog: false,
      showDeleteDialog: false,

      performingOperation: false,
      indicatorMessage: '',
      indicatorType: IndicatorType.error,

      selectedIssue: null,
      valid: true,
      selectedDueDate: null,
      dueDateMenu: false,
      editDueDateMenu: false,
      enteredDescription: '',
      enteredTitle: '',
      selectedSeverity: null,
      severities: ['Minor', 'Major', 'Critical', 'Blocker'],
      issuesToDo: [],
      issuesInProgress: [],
      issuesDone: [],
      // selectedProject: null,
      // selectedProjectId: null,
      titleRules: [
        v => !!v || 'Title is required',
        v => (v && v.length <= 50) || 'Title must be less than 50 characters'
      ],
      descriptionRules: [
        v => !!v || 'Description is required',
        v => (v && v.length <= 150) || 'Description must be less than 100 characters'
      ]
    };
  },
  mounted () {
    this.performingOperation = true;
    const projectId = this.$route.params.projectId;
    if (!this.selectedProject) {
      this.$store.dispatch('getProject', projectId)
        .then(() => {
          this.performingOperation = false;
          this.indicatorMessage = '';
        })
        .catch(error => this.handleError(error));
    }

    this.$store.dispatch('getIssues', projectId)
      .then(() => {
        this.performingOperation = false;
        this.indicatorMessage = '';
      })
      .catch(error => this.handleError(error));
  },
  computed: {
    issues () {
      return this.$store.getters.getIssue(this.$route.params.projectId);
    },
    selectedProject () {
      return this.$store.getters.getProject(this.$route.params.projectId);
    }
  },
  methods: {
    closeCreateDialog () {
      this.$refs.form.reset();
      this.showCreateDialog = false;
    },
    closeEditDialog () {
      this.$refs.form.reset();
      this.showEditDialog = false;
    },
    openEditDialog (issue) {
      this.showEditDialog = true;
      this.selectedIssue = issue;
    },
    openDeleteDialog (issue) {
      this.showDeleteDialog = true;
      this.selectedIssue = issue;
    },
    updateStatus (issue, status) {
      this.performingOperation = true;
      issue.status = status;
      const projectId = this.$route.params.projectId;
      this.$store.dispatch('updateIssue', { projectId, issue })
        .then(() => {
          this.performingOperation = false;
          this.indicatorMessage = `Successfully updated status for ${issue.title}`;
          this.indicatorType = IndicatorType.success;
        })
        .catch(error => this.handleError(error));
    },
    submitCreation () {
      if (this.$refs.form.validate()) {
        const projectId = this.$route.params.projectId;
        let issue = {
          title: this.enteredTitle,
          description: this.enteredDescription,
          dueDate: this.selectedDueDate,
          projectClientId: uuidv1(),
          clientId: uuidv1(),
          projectId: projectId,
          severity: this.selectedSeverity,
          status: 'todo'
        };

        this.performingOperation = true;
        this.$store.dispatch('createIssue', { projectId, issue })
          .then(() => {
            this.performingOperation = false;
            this.indicatorMessage = `Successfully created ${issue.title}`;
            this.indicatorType = IndicatorType.success;
          })
          .catch(error => this.handleError(error));
        this.closeCreateDialog();
      }
    },
    submitUpdate () {
      if (this.$refs.editForm.validate()) {
        const projectId = this.$route.params.projectId;
        let issue = {
          id: this.selectedIssue.id,
          title: this.selectedIssue.title,
          description: this.selectedIssue.description,
          dueDate: this.selectedIssue.dueDate,
          projectClientId: uuidv1(),
          clientId: uuidv1(),
          projectId: projectId,
          severity: this.selectedIssue.severity,
          status: this.selectedIssue.status
        };

        this.performingOperation = true;
        this.$store.dispatch('updateIssue', { projectId, issue })
          .then(() => {
            this.performingOperation = false;
            this.indicatorMessage = `Successfully edited ${issue.title}`;
            this.indicatorType = IndicatorType.success;
          })
          .catch(error => this.handleError(error));
          this.closeEditDialog();
      }
    },
    submitDeletion () {
      const projectId = this.selectedIssue.projectId;
      const issueId = this.selectedIssue.id;
      this.performingOperation = true;
      this.$store.dispatch('deleteIssue', { projectId, issueId })
        .then(() => {
          this.performingOperation = false;
          this.indicatorMessage = `Successfully deleted ${this.selectedIssue.title}`;
          this.indicatorType = IndicatorType.success;
        })
        .catch(error => this.handleError(error));
        this.closeEditDialog();
    },
    handleError (error) {
      this.performingOperation = false;
      this.indicatorMessage = httpErrorToErrorMessage(error);
      this.indicatorType = httpErrorToIndicatorType(error);
    }
  },
  components: {
    Indicator
  }
});
</script>

<style>
    #issue-header-panel {
        margin-bottom: 50px;
    }

    #issue-indicator {
        margin-top: 50px;
    }

    .issue-title-container{
        padding: 5px 5px 5px 5px;
    }

    .issue-description-container{
        padding-top: 5px;
    }
    .break-text {
        word-break: break-word;
    }
    .severity-img{
        height: 45px;
        padding-top: 5px;
        padding-left: 8px;
    }
    .swimlane-header{
        margin-bottom: 15px;
    }
</style>
