<template>
    <v-app id="inspire">
        <v-navigation-drawer :clipped="$vuetify.breakpoint.lgAndUp" v-model="drawer" class="blue-grey darken-4" fixed
                             app>
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
                                <v-list-tile-title>Martin & Anastasios</v-list-tile-title>
                                <v-list-tile-sub-title>Students of ZHAW</v-list-tile-sub-title>
                            </v-list-tile-content>

                            <v-list-tile-action>
                                <v-btn
                                        :class="fav ? 'red--text' : ''"
                                        icon
                                        @click="fav = !fav"
                                >
                                    <v-icon>explore</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list>

                    <v-divider></v-divider>

                    <v-list>
                        <v-list-tile>
                            <v-list-tile-action>
                                <v-switch v-model="message" color="purple"></v-switch>
                            </v-list-tile-action>
                            <v-list-tile-title>Enable messages</v-list-tile-title>
                        </v-list-tile>

                        <v-list-tile>
                            <v-list-tile-action>
                                <v-switch v-model="hints" color="purple"></v-switch>
                            </v-list-tile-action>
                            <v-list-tile-title>Enable hints</v-list-tile-title>
                        </v-list-tile>
                    </v-list>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn flat @click="menu = false">Cancel</v-btn>
                        <v-btn color="primary" flat @click="menu = false">Save</v-btn>
                    </v-card-actions>
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
    </v-app>
</template>

<script>
export default {
  data: () => {
    return ({
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
      ]
    });
  },
  props: {
    source: String
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
