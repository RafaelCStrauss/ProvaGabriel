<template>
  <div ref="raiz">
    <ion-card>
      <ion-card-header>
        <ion-card-title>{{ editandoId ? `Editar ${singular}` : `Nova ${singular}` }}</ion-card-title>
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

    <ion-spinner v-if="carregando" class="ion-margin" />

    <ion-text v-else-if="registros.length === 0" color="medium">
      <p class="ion-text-center">Nenhum registro cadastrado ainda.</p>
    </ion-text>

    <ion-card v-for="r in registros" :key="r.id">
      <ion-card-header>
        <ion-card-subtitle>{{ r.categoria }} · {{ formatarData(r.data) }}</ion-card-subtitle>
        <ion-card-title>{{ r.descricao }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-text :color="cor">{{ formatarValor(r.valor) }}</ion-text>
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import {
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

interface Registro {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
}

const props = defineProps<{
  tabela: 'receitas' | 'despesas';
  singular: string;
  categorias: string[];
  cor: 'success' | 'danger';
}>();

const raiz = ref<HTMLElement | null>(null);
const registros = ref<Registro[]>([]);
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

async function carregar() {
  carregando.value = true;
  const { data, error } = await supabase
    .from(props.tabela)
    .select('id, descricao, valor, categoria, data')
    .order('data', { ascending: false });
  carregando.value = false;

  if (error) {
    erro.value = error.message;
    return;
  }
  registros.value = data ?? [];
}

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

  const { error } = editandoId.value
    ? await supabase.from(props.tabela).update(dados).eq('id', editandoId.value)
    : await supabase.from(props.tabela).insert(dados);

  salvando.value = false;

  if (error) {
    erro.value = error.message;
    return;
  }

  limparFormulario();
  await carregar();
}

function editar(r: Registro) {
  editandoId.value = r.id;
  form.descricao = r.descricao;
  form.valor = String(r.valor);
  form.categoria = r.categoria;
  form.data = r.data;
  erro.value = '';

  const conteudo = raiz.value?.closest('ion-content') as unknown as {
    scrollToTop?: (duracao?: number) => Promise<void>;
  } | null;
  conteudo?.scrollToTop?.(300);
}

async function confirmarExclusao(r: Registro) {
  const alerta = await alertController.create({
    header: `Excluir ${props.singular}`,
    message: `Deseja excluir "${r.descricao}"?`,
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      { text: 'Excluir', role: 'destructive', handler: () => excluir(r.id) },
    ],
  });
  await alerta.present();
}

async function excluir(id: string) {
  const { error } = await supabase.from(props.tabela).delete().eq('id', id);
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

function formatarData(data: string) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

onMounted(carregar);
</script>
