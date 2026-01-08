import { TaskDataState } from '../models/task.models';

/**
 * Conjunto inicial de dados em formato JSON para popular a app
 * na primeira execução. Serve como um "seed" para o armazenamento
 * local no Ionic Storage.
 */
export const seedData: TaskDataState = {
  categories: [
    { id: 'work', name: 'Trabalho', color: '#3b82f6', icon: 'briefcase-outline' },
    { id: 'personal', name: 'Pessoal', color: '#10b981', icon: 'person-outline' },
    { id: 'study', name: 'Estudos', color: '#a855f7', icon: 'school-outline' },
  ],
  projects: [
    {
      id: 'p1',
      categoryId: 'work',
      name: 'Portal do Cliente',
      description: 'Entrega do novo portal web para clientes.',
      color: '#2563eb',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'p2',
      categoryId: 'personal',
      name: 'Reforma da Sala',
      description: 'Pintar, móveis e iluminação.',
      color: '#0ea5e9',
      status: 'new',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'p3',
      categoryId: 'study',
      name: 'Ionic + Angular',
      description: 'Praticar componentes, storage e Capacitor.',
      color: '#9333ea',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
  ],
  tasks: [
    {
      id: 't1',
      projectId: 'p1',
      title: 'Wireframes aprovados',
      description: 'Receber aprovação do cliente.',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false,
      priority: 'high',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 't2',
      projectId: 'p1',
      title: 'Configurar CI/CD',
      description: 'Pipeline com testes e build de produção.',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false,
      priority: 'medium',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 't3',
      projectId: 'p2',
      title: 'Comprar tinta',
      description: 'Cinza claro para paredes.',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      completed: true,
      priority: 'low',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 't4',
      projectId: 'p3',
      title: 'Criar protótipo',
      description: 'Teste com Ionic Storage e rotas.',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false,
      priority: 'high',
      updatedAt: new Date().toISOString(),
    },
  ],
};

