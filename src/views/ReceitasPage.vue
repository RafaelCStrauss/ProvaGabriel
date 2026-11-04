<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Receitas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <LancamentosCrud tabela="receitas" singular="receita" :categorias="categorias" cor="success" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import LancamentosCrud from '@/components/LancamentosCrud.vue';

const categorias = ['Salário', 'Freelance', 'Investimentos', 'Outros'];
</script>
