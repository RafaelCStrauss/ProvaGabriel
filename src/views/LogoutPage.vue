<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/tab1" text="Voltar" />
        </ion-buttons>
        <ion-title>Sair</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-grid class="ion-justify-content-center ion-align-items-center" style="min-height: 100%">
        <ion-row class="ion-justify-content-center">
          <ion-col size="12" size-md="8" size-lg="5">
            <ion-card-header class="ion-text-center">
              <ion-icon :icon="logOut" color="primary" size="large" />
              <ion-card-title>Deseja sair?</ion-card-title>
              <ion-card-subtitle>Você precisará entrar novamente para acessar sua conta</ion-card-subtitle>
            </ion-card-header>

            <ion-card-content>
              <ion-button expand="block" color="danger" @click="sair">
                <ion-icon slot="start" :icon="logOut" />
                Sair
              </ion-button>

              <ion-button expand="block" fill="clear" router-link="/tabs/tab1" class="ion-margin-top">
                Cancelar
              </ion-button>
            </ion-card-content>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
} from '@ionic/vue';
import { logOut } from 'ionicons/icons';
import { supabase } from '@/supabase';

const router = useRouter();

async function sair() {
  await supabase.auth.signOut();
  router.replace('/login');
}
</script>
