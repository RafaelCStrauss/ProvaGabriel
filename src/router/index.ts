import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';

import TabsPage from '@/views/TabsPage.vue';
import { supabase } from '@/supabase';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/tabs/dashboard',
  },
  {
    path: '/login',
    component: () => import('@/views/LoginPage.vue'),
    meta: { publica: true },
  },
  {
    path: '/cadastro',
    component: () => import('@/views/CadastroPage.vue'),
    meta: { publica: true },
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/dashboard',
      },
      {
        path: 'dashboard',
        component: () => import('@/views/DashboardPage.vue'),
      },
      {
        path: 'receitas',
        component: () => import('@/views/ReceitasPage.vue'),
      },
      {
        path: 'despesas',
        component: () => import('@/views/DespesasPage.vue'),
      },
      {
        path: 'sair',
        component: () => import('@/views/LogoutPage.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  const { data } = await supabase.auth.getSession();
  const logado = data.session !== null;
  const publica = to.meta.publica === true;

  if (!logado && !publica) return '/login';
  if (logado && publica) return '/tabs/dashboard';
  return true;
});

supabase.auth.onAuthStateChange((evento) => {
  if (evento === 'SIGNED_OUT') router.replace('/login');
});

export default router;
