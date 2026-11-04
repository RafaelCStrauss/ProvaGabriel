<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/tab1" text="Voltar" />
        </ion-buttons>
        <ion-title>Receitas</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-button expand="block" fill="clear" router-link="/despesas" class="ion-margin-top">
                Despesas
              </ion-button>
    <ion-content class="ion-padding">
      <LancamentosCrud tabela="receitas" singular="receita" :categorias="categorias" cor="success" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, IonButton } from '@ionic/vue';
import LancamentosCrud from '@/components/LancamentosCrud.vue';

const categorias = ['Salário', 'Freelance', 'Investimentos', 'Outros'];
</script>
