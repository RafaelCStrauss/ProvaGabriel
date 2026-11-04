<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Despesas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <LancamentosCrud tabela="despesas" singular="despesa" :categorias="categorias" cor="danger" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import LancamentosCrud from '@/components/LancamentosCrud.vue';

const categorias = ['Alimentação', 'Transporte', 'Moradia', 'Educação', 'Lazer', 'Saúde', 'Outros'];
</script>
