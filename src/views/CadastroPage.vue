<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/login" text="Voltar" />
        </ion-buttons>
        <ion-title>Cadastro</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size="12" size-md="8" size-lg="5">
            <ion-card-header class="ion-text-center">
              <ion-icon :icon="personAdd" color="primary" size="large" />
              <ion-card-title>Criar conta</ion-card-title>
              <ion-card-subtitle>Preencha os dados para se cadastrar</ion-card-subtitle>
            </ion-card-header>

            <ion-card-content>
              <ion-input
                v-model="nome"
                type="text"
                label="Nome"
                label-placement="floating"
                fill="outline"
                autocomplete="name"
                class="ion-margin-bottom"
              >
                <ion-icon slot="start" :icon="personOutline" aria-hidden="true" />
              </ion-input>

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
                autocomplete="new-password"
                class="ion-margin-bottom"
              >
                <ion-icon slot="start" :icon="lockClosedOutline" aria-hidden="true" />
                <ion-input-password-toggle slot="end" />
              </ion-input>

              <ion-input
                v-model="confirmarSenha"
                type="password"
                label="Confirmar senha"
                label-placement="floating"
                fill="outline"
                autocomplete="new-password"
                class="ion-margin-bottom"
              >
                <ion-icon slot="start" :icon="lockClosedOutline" aria-hidden="true" />
                <ion-input-password-toggle slot="end" />
              </ion-input>

              <!-- TODO: ligar ao signUp do Supabase -->
              <ion-button expand="block" class="ion-margin-top">
                <ion-icon slot="start" :icon="personAdd" />
                Cadastrar
              </ion-button>

              <ion-button expand="block" fill="clear" router-link="/login" class="ion-margin-top">
                Já tem conta? Entrar
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
  IonInput,
  IonInputPasswordToggle,
  IonButton,
  IonIcon,
} from '@ionic/vue';
import { personAdd, personOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';

const nome = ref('');
const email = ref('');
const senha = ref('');
const confirmarSenha = ref('');
</script>
