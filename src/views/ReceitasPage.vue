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

    <ion-content class="ion-padding">
      <!-- Formulário (serve para inserir e editar) -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ editandoId ? 'Editar receita' : 'Nova receita' }}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-input
            v-model="form.descricao"
            type="text"
            label="Descrição"
            label-placement="floating"
            fill="outline"
            class="ion-margin-bottom"
          />

          <ion-input
            v-model="form.valor"
            type="number"
            inputmode="decimal"
            label="Valor (R$)"
            label-placement="floating"
            fill="outline"
            class="ion-margin-bottom"
          />

          <ion-select
            v-model="form.categoria"
            label="Categoria"
            label-placement="floating"
            fill="outline"
            class="ion-margin-bottom"
          >
            <ion-select-option v-for="c in categorias" :key="c" :value="c">{{ c }}</ion-select-option>
          </ion-select>

          <ion-input
            v-model="form.data"
            type="date"
            label="Data"
            label-placement="stacked"
            fill="outline"
            class="ion-margin-bottom"
          />

          <ion-text v-if="erro" color="danger">{{ erro }}</ion-text>

          <ion-button expand="block" :disabled="salvando" class="ion-margin-top" @click="salvar">
            <ion-icon slot="start" :icon="editandoId ? checkmark : add" />
            {{ editandoId ? 'Atualizar' : 'Salvar' }}
          </ion-button>

          <ion-button v-if="editandoId" expand="block" fill="clear" @click="limparFormulario">
            Cancelar edição
          </ion-button>
        </ion-card-content>
      </ion-card>

      <!-- Listagem -->
      <ion-spinner v-if="carregando" class="ion-margin" />

      <ion-text v-else-if="receitas.length === 0" color="medium">
        <p class="ion-text-center">Nenhuma receita cadastrada ainda.</p>
      </ion-text>

      <ion-card v-for="r in receitas" :key="r.id">
        <ion-card-header>
          <ion-card-subtitle>{{ r.categoria }} · {{ formatarData(r.data) }}</ion-card-subtitle>
          <ion-card-title>{{ r.descricao }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-text color="success">{{ formatarValor(r.valor) }}</ion-text>
          <ion-row class="ion-justify-content-end">
            <ion-button fill="clear" size="small" @click="editar(r)">
              <ion-icon slot="start" :icon="createOutline" />
              Editar
            </ion-button>
            <ion-button fill="clear" size="small" color="danger" @click="confirmarExclusao(r)">
              <ion-icon slot="start" :icon="trashOutline" />
              Excluir
            </ion-button>

              
          </ion-row>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonText,
  IonRow,
  IonSpinner,
  alertController,
} from '@ionic/vue';
import { add, checkmark, createOutline, trashOutline } from 'ionicons/icons';
import { supabase } from '@/supabase';

interface Receita {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string; // formato AAAA-MM-DD
}

const categorias = ['Salário', 'Freelance', 'Investimentos', 'Outros'];

const receitas = ref<Receita[]>([]);
const carregando = ref(false);
const salvando = ref(false);
const erro = ref('');
const editandoId = ref<string | null>(null);

const form = reactive({
  descricao: '',
  valor: '',
  categoria: '',
  data: '',
});

function limparFormulario() {
  form.descricao = '';
  form.valor = '';
  form.categoria = '';
  form.data = '';
  editandoId.value = null;
  erro.value = '';
}

function validar(): string {
  if (!form.descricao.trim()) return 'Informe a descrição';
  const valor = Number(form.valor);
  if (!form.valor || Number.isNaN(valor) || valor <= 0) return 'Informe um valor maior que zero';
  if (!form.categoria) return 'Escolha uma categoria';
  if (!form.data) return 'Informe a data';
  return '';
}

// LISTAR
async function carregar() {
  carregando.value = true;
  const { data, error } = await supabase
    .from('receitas')
    .select('id, descricao, valor, categoria, data')
    .order('data', { ascending: false });
  carregando.value = false;

  if (error) {
    erro.value = error.message;
    return;
  }
  receitas.value = data ?? [];
}

// INSERIR / EDITAR
async function salvar() {
  erro.value = validar();
  if (erro.value) return;

  salvando.value = true;

  const dados = {
    descricao: form.descricao.trim(),
    valor: Number(form.valor),
    categoria: form.categoria,
    data: form.data,
  };

  // No insert, o user_id é preenchido sozinho pelo banco (default auth.uid())
  const { error } = editandoId.value
    ? await supabase.from('receitas').update(dados).eq('id', editandoId.value)
    : await supabase.from('receitas').insert(dados);

  salvando.value = false;

  if (error) {
    erro.value = error.message;
    return;
  }

  limparFormulario();
  await carregar();
}

function editar(r: Receita) {
  editandoId.value = r.id;
  form.descricao = r.descricao;
  form.valor = String(r.valor);
  form.categoria = r.categoria;
  form.data = r.data;
  erro.value = '';
  document.querySelector('ion-content')?.scrollToTop(300);
}

// EXCLUIR
async function confirmarExclusao(r: Receita) {
  const alerta = await alertController.create({
    header: 'Excluir receita',
    message: `Deseja excluir "${r.descricao}"?`,
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      { text: 'Excluir', role: 'destructive', handler: () => excluir(r.id) },
    ],
  });
  await alerta.present();
}

async function excluir(id: string) {
  const { error } = await supabase.from('receitas').delete().eq('id', id);
  if (error) {
    erro.value = error.message;
    return;
  }
  if (editandoId.value === id) limparFormulario();
  await carregar();
}

function formatarValor(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Evita problema de fuso: não usa new Date() na string AAAA-MM-DD
function formatarData(data: string) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

onMounted(carregar);
</script>
