import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';

import TabsPage from '../views/TabsPage.vue';
import { supabase } from '@/supabase';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: () => import('@/views/LoginPage.vue'),
  },
  {
    path: '/cadastro',
    component: () => import('@/views/CadastroPage.vue'),
  },
  {
    path: '/receitas',
    component: () => import('@/views/ReceitasPage.vue'),
  },
  {
    path: '/despesas',
    component: () => import('@/views/DespesasPage.vue'),
  },
  {
    path: '/logout',
    component: () => import('@/views/LogoutPage.vue'),
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1',
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue'),
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue'),
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

const paginasPublicas = ['/login', '/cadastro'];

router.beforeEach(async (to) => {
  const { data } = await supabase.auth.getSession();
  const logado = data.session !== null;
  const ehPublica = paginasPublicas.includes(to.path);

  if (!logado && !ehPublica) return '/login';
  if (logado && ehPublica) return '/tabs/tab1';
  return true;
});

export default router;
