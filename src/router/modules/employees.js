import Layout from '@/layout'
export default {
  path: '/employess',
  name: 'employees',
  component: Layout,
  children: [{
    path: '',
    component: () => import('@/views/employees'),
    meta: { title: '员工管理', icon: 'people' }
  }]
}
