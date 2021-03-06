<template>
    <v-layout row>
        <v-flex xs12>
            <v-layout row wrap>
                <h1>Project Overview </h1>
                <v-dialog v-model="showCreateDialog" persistent max-width="600px">
                    <v-btn slot="activator" color="primary" dark><v-icon>add</v-icon>CREATE NEW PROJECT</v-btn>
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <v-card>
                            <v-card-title>
                                <span class="headline">Create a new project</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout wrap>
                                        <v-flex xs12>
                                            <v-text-field v-model="title"
                                                          :rules="titleRules"
                                                          :counter="50"
                                                          label="Title*"
                                                          required>
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field v-model="description"
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
                                <v-btn color="blue darken-1" flat @click="closeCreateDialog">Close</v-btn>
                                <v-btn color="blue darken-1" flat @click="submitCreation">
                                    Save
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-form>
                </v-dialog>
            </v-layout>
            <v-card v-if="projects.length > 0"  class="projects-card">
                <v-list two-line subheader>
                    <v-list-tile v-for="project in projects" :key="project.id" avatar :to="'/projects/' + project.id">
                        <v-list-tile-avatar>
                            <v-icon class="grey lighten-1 white--text">folder</v-icon>
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title>{{ project.title }}</v-list-tile-title>
                            <v-list-tile-sub-title>{{ project.description }}</v-list-tile-sub-title>
                        </v-list-tile-content>

                        <v-list-tile-action>
                            <v-btn icon ripple>
                                <v-icon color="grey lighten-1" @click.prevent="openEditDialog(project)">edit</v-icon>
                            </v-btn>
                        </v-list-tile-action>

                        <v-list-tile-action>
                            <v-btn icon ripple>
                                <v-icon color="grey lighten-1" @click.prevent="openDeleteDialog(project)">delete</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
            </v-card>

            <v-card v-else class="projects-card">
                <div>
                    <v-alert :value="true" type="info">
                        No projects available.
                    </v-alert>
                </div>
            </v-card>

            <v-layout v-if="performingOperation" row justify-center>
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </v-layout>
            <indicator v-else :type="indicatorType" :message="indicatorMessage"></indicator>

        </v-flex>

        <v-layout row justify-center>
            <v-dialog v-if="selectedProject" v-model="showDeleteDialog" max-width="600px" @input="closeDeleteDialog">
                <v-card>
                    <v-card-title class="headline">Do you really want to delete the project '{{selectedProject.title}}' ?</v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1"
                               flat="flat"
                               @click="closeDeleteDialog"
                        >Cancel
                        </v-btn>
                        <v-btn color="green darken-1"
                               flat="flat"
                               @click="submitDeletion"
                        >
                            Delete
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-if="selectedProject" v-model="showEditDialog" persistent max-width="600px">
                <v-form ref="editForm" v-model="valid" lazy-validation>
                    <v-card>
                        <v-card-title>
                            <span class="headline">Edit Project</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs12>
                                        <v-text-field v-model="selectedProject.title"
                                                      :rules="titleRules"
                                                      :counter="50"
                                                      label="Title*"
                                                      required>
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-text-field v-model="selectedProject.description"
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
                            <v-btn color="blue darken-1" flat @click="closeEditDialog">Cancel</v-btn>
                            <v-btn color="blue darken-1" flat @click="submitUpdate">
                                Update
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-dialog>
        </v-layout>
    </v-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import VueOfflineMixin from 'vue-offline/mixin';

import Indicator from './Indicator.vue';
import { IndicatorType } from './IndicatorType.js';
import { httpErrorToErrorMessage, httpErrorToIndicatorType } from './helpers.js';

const uuidv1 = require('uuid/v1');

export default Vue.extend({
  name: 'projects',
  mixins: [VueOfflineMixin],
  data () {
    return {
      showCreateDialog: false,
      showDeleteDialog: false,
      showEditDialog: false,

      performingOperation: false,
      indicatorType: IndicatorType.error,
      indicatorMessage: '',

      selectedProject: null,
      valid: true,
      description: '',
      title: '',
      titleRules: [
        (v) => !!v || 'Title is required',
        (v) => (v && v.length <= 50) || 'Title must be less than 50 characters'
      ],
      descriptionRules: [
        v => !!v || 'Description is required',
        v => (v && v.length <= 150) || 'Description must be less than 150 characters'
      ]
    };
  },
  mounted () {
    this.performingOperation = true;
    this.$store.dispatch('getAllProjects')
      .then(() => {
        this.performingOperation = false;
        this.indicatorMessage = '';
      })
      .catch(error => this.handleError(error));
  },
  created () {
    this.$on('online', function () {
      this.indicatorMessage = '';
    });
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
    closeDeleteDialog () {
      this.showDeleteDialog = false;
    },
    openEditDialog (project) {
      this.showEditDialog = true;
      this.selectedProject = project;
    },
    openDeleteDialog (project) {
      this.showDeleteDialog = true;
      this.selectedProject = project;
    },
    submitCreation () {
      if (this.$refs.form.validate()) {
        let project = {
          clientId: uuidv1(),
          title: this.title,
          description: this.description,
          active: true
        };

        this.performingOperation = true;
        this.$store.dispatch('createProject', project)
          .then(() => {
            this.indicatorType = IndicatorType.success;
            this.indicatorMessage = `Successfully created project ${project.title}`;
            this.performingOperation = false;
          })
          .catch(error => this.handleError(error));
        this.closeCreateDialog();
      }
    },
    submitUpdate () {
      if (this.$refs.editForm.validate()) {
        let project = {
          id: this.selectedProject.id,
          clientId: uuidv1(),
          title: this.selectedProject.title,
          description: this.selectedProject.description,
          active: true
        };

        this.performingOperation = true;
        this.$store.dispatch('updateProject', project)
          .then(() => {
            this.indicatorType = IndicatorType.success;
            this.indicatorMessage = `Successfully updated project ${project.title}`;
            this.performingOperation = false;
          })
          .catch(error => this.handleError(error));
        this.closeEditDialog();
      }
    },
    submitDeletion () {
      this.performingOperation = true;
      this.$store.dispatch('deleteProject', this.selectedProject)
        .then(() => {
          this.indicatorType = IndicatorType.success;
          this.indicatorMessage = `Successfully deleted project ${this.selectedProject.title}`;
          this.performingOperation = false;
        })
        .catch(error => this.handleError(error));
      this.closeDeleteDialog();
    },
    handleError (error) {
      this.performingOperation = false;
      this.indicatorMessage = httpErrorToErrorMessage(error);
      this.indicatorType = httpErrorToIndicatorType(error);
    }
  },
  computed: {
    ...mapGetters(['projects'])
  },
  components: {
    Indicator
  }
});
</script>
<style>
    .projects-card {
        margin-top: 10px;
    }
</style>
