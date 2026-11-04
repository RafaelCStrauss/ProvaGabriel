<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="dashboard" href="/tabs/dashboard">
          <ion-icon aria-hidden="true" :icon="statsChart" />
          <ion-label>Dashboard</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="receitas" href="/tabs/receitas">
          <ion-icon aria-hidden="true" :icon="trendingUp" />
          <ion-label>Receitas</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="despesas" href="/tabs/despesas">
          <ion-icon aria-hidden="true" :icon="trendingDown" />
          <ion-label>Despesas</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="sair" href="/tabs/sair">
          <ion-icon aria-hidden="true" :icon="logOut" />
          <ion-label>Sair</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { statsChart, trendingUp, trendingDown, logOut } from 'ionicons/icons';
</script>
