<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-spinner v-if="carregando" class="ion-margin" />
      <ion-text v-if="erro" color="danger">{{ erro }}</ion-text>

      <ion-row>
        <ion-col v-for="c in resumo" :key="c.titulo" size="12" size-md="4">
          <ion-card class="ion-no-margin">
            <ion-card-header>
              <ion-card-subtitle>{{ c.titulo }}</ion-card-subtitle>
              <ion-card-title :color="c.cor">{{ moeda(c.valor) }}</ion-card-title>
            </ion-card-header>
          </ion-card>
        </ion-col>
      </ion-row>

      <ion-card>
        <ion-card-header>
          <ion-card-title>Indicadores</ion-card-title>
        </ion-card-header>
        <ion-list>
          <ion-item v-for="i in indicadores" :key="i.titulo">
            <ion-label>{{ i.titulo }}</ion-label>
            <ion-note slot="end" color="dark">{{ i.valor }}</ion-note>
          </ion-item>
        </ion-list>
        <ion-progress-bar v-if="percentual !== null" :value="Math.min(percentual / 100, 1)" color="danger" />
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-title>Despesas por categoria</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <VueApexCharts
            v-if="pizzaSeries.length > 0"
            type="pie"
            height="320"
            :options="pizzaOptions"
            :series="pizzaSeries"
          />
          <ion-text v-else color="medium">Nenhuma despesa cadastrada ainda.</ion-text>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-title>Receitas e despesas por mês</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <VueApexCharts
            v-if="meses.length > 0"
            type="bar"
            height="320"
            :options="barrasOptions"
            :series="barrasSeries"
          />
          <ion-text v-else color="medium">Nenhum lançamento cadastrado ainda.</ion-text>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonText,
  IonSpinner,
  IonProgressBar,
  onIonViewWillEnter,
} from '@ionic/vue';
import VueApexCharts from 'vue3-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { supabase } from '@/supabase';

interface Lancamento {
  valor: number;
  categoria: string;
  data: string;
}

const receitas = ref<Lancamento[]>([]);
const despesas = ref<Lancamento[]>([]);
const carregando = ref(false);
const erro = ref('');

const escuro = window.matchMedia('(prefers-color-scheme: dark)').matches;

function moeda(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function somar(lista: Lancamento[]) {
  return lista.reduce((total, item) => total + Number(item.valor), 0);
}

async function carregar() {
  carregando.value = true;
  erro.value = '';

  const resReceitas = await supabase.from('receitas').select('valor, categoria, data');
  const resDespesas = await supabase.from('despesas').select('valor, categoria, data');

  carregando.value = false;

  const falha = resReceitas.error ?? resDespesas.error;
  if (falha) {
    erro.value = falha.message;
    return;
  }

  receitas.value = resReceitas.data ?? [];
  despesas.value = resDespesas.data ?? [];
}

onIonViewWillEnter(carregar);

const totalReceitas = computed(() => somar(receitas.value));
const totalDespesas = computed(() => somar(despesas.value));
const saldo = computed(() => totalReceitas.value - totalDespesas.value);

const resumo = computed(() => [
  { titulo: 'Total de receitas', valor: totalReceitas.value, cor: 'success' },
  { titulo: 'Total de despesas', valor: totalDespesas.value, cor: 'danger' },
  { titulo: 'Saldo atual', valor: saldo.value, cor: saldo.value >= 0 ? 'primary' : 'danger' },
]);

const despesasPorCategoria = computed(() => {
  const mapa: Record<string, number> = {};
  for (const d of despesas.value) {
    mapa[d.categoria] = (mapa[d.categoria] ?? 0) + Number(d.valor);
  }
  return mapa;
});

const maiorCategoria = computed(() => {
  const ordenado = Object.entries(despesasPorCategoria.value).sort((a, b) => b[1] - a[1]);
  if (ordenado.length === 0) return '-';
  return `${ordenado[0][0]} (${moeda(ordenado[0][1])})`;
});

const quantidade = computed(() => receitas.value.length + despesas.value.length);

const percentual = computed(() => {
  if (totalReceitas.value === 0) return null;
  return (totalDespesas.value / totalReceitas.value) * 100;
});

const indicadores = computed(() => [
  { titulo: 'Maior categoria de gasto', valor: maiorCategoria.value },
  { titulo: 'Quantidade de lançamentos', valor: String(quantidade.value) },
  {
    titulo: 'Despesas em relação às receitas',
    valor:
      percentual.value === null
        ? '-'
        : `${percentual.value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`,
  },
]);

const pizzaSeries = computed(() => Object.values(despesasPorCategoria.value));

const pizzaOptions = computed<ApexOptions>(() => ({
  labels: Object.keys(despesasPorCategoria.value),
  chart: { background: 'transparent' },
  theme: { mode: escuro ? 'dark' : 'light' },
  legend: { position: 'bottom' },
  tooltip: { y: { formatter: (v: number) => moeda(v) } },
}));

const meses = computed(() => {
  const todos = [...receitas.value, ...despesas.value].map((l) => l.data.slice(0, 7));
  return [...new Set(todos)].sort();
});

function somaDoMes(lista: Lancamento[], mes: string) {
  return somar(lista.filter((l) => l.data.startsWith(mes)));
}

const barrasSeries = computed(() => [
  { name: 'Receitas', data: meses.value.map((m) => somaDoMes(receitas.value, m)) },
  { name: 'Despesas', data: meses.value.map((m) => somaDoMes(despesas.value, m)) },
]);

const barrasOptions = computed<ApexOptions>(() => ({
  chart: { background: 'transparent' },
  theme: { mode: escuro ? 'dark' : 'light' },
  colors: ['#2dd36f', '#eb445a'],
  dataLabels: { enabled: false },
  xaxis: {
    categories: meses.value.map((m) => {
      const [ano, mes] = m.split('-');
      return `${mes}/${ano}`;
    }),
  },
  legend: { position: 'bottom' },
  tooltip: { y: { formatter: (v: number) => moeda(v) } },
}));
</script>
