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
                type="text"
                v-model="nome"
                label="Nome"
                label-placement="floating"
                fill="outline"
                autocomplete="name"
                class="ion-margin-bottom"
              >
                <ion-icon slot="start" :icon="personOutline" aria-hidden="true" />
              </ion-input>

              <ion-input
                type="email"
                v-model="email"
                label="E-mail"
                label-placement="floating"
                fill="outline"
                autocomplete="email"
                class="ion-margin-bottom"
              >
                <ion-icon slot="start" :icon="mailOutline" aria-hidden="true" />
              </ion-input>

              <ion-input
                type="password"
                v-model="senha"
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
                type="password"
                v-model="confirmarSenha"
                label="Confirmar senha"
                label-placement="floating"
                fill="outline"
                autocomplete="new-password"
                class="ion-margin-bottom"
              >
                <ion-icon slot="start" :icon="lockClosedOutline" aria-hidden="true" />
                <ion-input-password-toggle slot="end" />
              </ion-input>
              <ion-text v-if="erro" color="danger">{{ erro }}</ion-text>
              <ion-text v-if="sucesso" color="success">{{ sucesso }}</ion-text>

              <ion-button expand="block" :disabled="carregando" class="ion-margin-top" @click="cadastrar">
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
  IonText,
} from '@ionic/vue';
import { personAdd, personOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';
import { supabase } from '@/supabase';
import { useRouter } from 'vue-router';

const router = useRouter();

const nome = ref('');
const email = ref('');
const senha = ref('');
const confirmarSenha = ref('');
const erro = ref('');
const sucesso = ref('');
const carregando = ref(false);

async function cadastrar() {
  erro.value = '';

  if (senha.value !== confirmarSenha.value) {
    erro.value = 'As senhas não são iguais';
    return;
  }

  carregando.value = true;

  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: senha.value,
    options: { data: { nome: nome.value } },
  });

  if (error) {
    carregando.value = false;
    erro.value = error.message;
    return;
  }

  await supabase.auth.signOut();
  carregando.value = false;
  router.replace('/login');
}
</script>
