<template>
  <ion-page>
    <ion-content class="ion-padding">
      <ion-grid class="ion-justify-content-center ion-align-items-center" style="min-height: 100%">
        <ion-row class="ion-justify-content-center">
          <ion-col size="12" size-md="8" size-lg="5">
            <ion-card-header class="ion-text-center">
              <ion-icon :icon="personCircleOutline" color="primary" size="large" />
              <ion-card-title>Login</ion-card-title>
              <ion-card-subtitle>Entre na sua conta</ion-card-subtitle>
            </ion-card-header>

            <ion-card-content>
              <ion-input
                v-model="email"
                type="email"
                label="E-mail"
                label-placement="floating"
                fill="outline"
                autocomplete="email"
                class="ion-margin-bottom"
              >
                <ion-icon slot="start" :icon="mailOutline" aria-hidden="true" />
              </ion-input>

              <ion-input
                v-model="senha"
                type="password"
                label="Senha"
                label-placement="floating"
                fill="outline"
                autocomplete="current-password"
                class="ion-margin-bottom"
              >
                <ion-icon slot="start" :icon="lockClosedOutline" aria-hidden="true" />
                <ion-input-password-toggle slot="end" />
              </ion-input>

              <!-- TODO: ligar ao login do Supabase -->
              <ion-button expand="block" class="ion-margin-top">
                <ion-icon slot="start" :icon="logIn" />
                Entrar
              </ion-button>

              <ion-button expand="block" fill="clear" router-link="/cadastro" class="ion-margin-top">
                Não tem conta? Cadastre-se
              </ion-button>
            </ion-card-content>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonInput,
  IonInputPasswordToggle,
  IonButton,
  IonIcon,
} from '@ionic/vue';
import { personCircleOutline, mailOutline, lockClosedOutline, logIn } from 'ionicons/icons';

const email = ref('');
const senha = ref('');
</script>
