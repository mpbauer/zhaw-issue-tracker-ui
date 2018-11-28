<template>
    <v-app id="inspire">
        <v-navigation-drawer :clipped="$vuetify.breakpoint.lgAndUp" v-model="drawer" class="blue-grey darken-4" fixed app>
            <v-list dense>
                <template v-for="item in items">
                    <v-layout v-if="item.heading" :key="item.heading" row align-center>
                        <v-flex xs6>
                            <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
                        </v-flex>
                        <v-flex xs6 class="text-xs-center">
                            <a class="body-2 black--text">EDIT</a>
                        </v-flex>
                    </v-layout>
                    <v-list-tile v-else :key="item.text" :to="item.link" color="#FFFFFF">
                        <v-list-tile-action>
                            <v-icon dark>{{ item.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>
                                {{ item.text }}
                            </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </template>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" color="blue darken-1" dark app fixed>
            <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
                <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                <span class="hidden-sm-and-down">Kanbana</span>
            </v-toolbar-title>
            <v-text-field flat solo-inverted hide-details prepend-inner-icon="search" label="Search"
                          class="hidden-sm-and-down">
            </v-text-field>
            <v-spacer></v-spacer>
            <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
                <v-btn slot="activator" icon large>
                    <v-avatar size="32px" tile>
                        <img class="rounded-img" src="https://avatars.githubusercontent.com/mpbauer" alt="Vuetify">
                    </v-avatar>
                </v-btn>

                <v-card>
                    <v-list>
                        <v-list-tile avatar>
                            <v-list-tile-avatar>
                                <img src="./assets/logo.png" alt="John">
                            </v-list-tile-avatar>

                            <v-list-tile-content>
                                <v-list-tile-title>Martin & Anastassios</v-list-tile-title>
                                <v-list-tile-sub-title>Students of ZHAW</v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-card>
            </v-menu>
        </v-toolbar>
        <v-content>
            <v-container fluid>
                <v-layout justify-center row fill-height>
                    <router-view></router-view>
                </v-layout>
            </v-container>
        </v-content>
        <div v-show="OnlineOnly">
            <v-snackbar v-if="offlineBefore" v-model="snackbar"
                        :top=true
                        :multi-line="mode === 'multi-line'"
                        :timeout="timeout"
                        :vertical="mode === 'vertical'">
                {{ reconnectText }}
                <v-btn dark flat @click="snackbar = false">Close</v-btn>
            </v-snackbar>
        </div>
        <div v-show="OfflineOnly">
            <v-snackbar v-model="snackbar"
                        :top=true
                        :multi-line="mode === 'multi-line'"
                        :timeout="timeout"
                        :vertical="mode === 'vertical'">
                {{ text }}
                <v-btn dark flat @click="snackbar = false">Close</v-btn>
            </v-snackbar>
        </div>

        <v-snackbar v-model="syncSnackbar.snackbar"
                    :color="syncSnackbar.color"
                    :timeout="syncSnackbar.timeout">
            {{ syncSnackbar.text }}
            <v-btn dark flat @click="syncSnackbar.snackbar = false">Close</v-btn>
        </v-snackbar>
    </v-app>
</template>

<script>
import VueOfflineMixin from 'vue-offline/mixin';
import { isNullOrUndefined } from './views/helpers';

export default {
  mixins: [VueOfflineMixin],
  data: () => {
    return {
      offlineBefore: false,
      onlineState: navigator.onLine,
      fav: true,
      menu: false,
      message: false,
      hints: true,
      showCreateDialog: false,
      drawer: null,
      items: [
        { icon: 'dashboard', text: 'Dashboard', link: '/' },
        { icon: 'view_agenda', text: 'Projects', link: '/projects' },
        { icon: 'settings', text: 'Settings', link: '/settings' }
      ],
      snackbar: true,
      color: 'error',
      mode: 'multi-line',
      timeout: 6000,
      text: 'Oops, it seems that you are currently offline!',
      reconnectText: 'Seems like you are online again, welcome back!',

      syncSnackbar: {
        snackbar: false,
        color: 'primary',
        timeout: 6000,
        text: 'sync sync sync'
      }
    };
  },
  mounted () {
    this.syncWithServer();
  },
  props: {
    source: String
  },
  created () {
    this.$on('online', function () {
      this.syncWithServer();
      console.log('$on(online) method invoked');
      this.snackbar = true;
      this.onlineState = "I'm online now!";
    });
    this.$on('offline', function () {
      console.log('$on(offline) method invoked');
      this.offlineBefore = true;
      this.snackbar = true;
      this.onlineState = "I'm offline now!";
    });
  },
  methods: {
    syncWithServer () {
      this.$store.dispatch('syncWithServer')
        .then(result => {
          if (!isNullOrUndefined(result.noElements) && result.noElements) return;

          this.syncSnackbar.color = 'primary';
          this.syncSnackbar.snackbar = true;
          this.syncSnackbar.text = 'Successfully synced with server.';
        })
        .catch(error => {
          console.error(error);
          this.syncSnackbar.color = 'error';
          this.syncSnackbar.snackbar = true;
          this.syncSnackbar.text = 'Failed to sync with server.';
        });
    }
  }
};
</script>
<style>
    .rounded-img {
        min-height: 45px;
        min-width: 45px;
        border-radius: 50% !important;
    }
</style>
