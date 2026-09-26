import { Project, Task, TeamMember } from '../types';

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  { id: 'm1', name: 'Alex Rivera', email: 'alex@taskflow.dev', role: 'Lead Architect', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'm2', name: 'Sarah Chen', email: 'sarah@taskflow.dev', role: 'Frontend Engineer', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { id: 'm3', name: 'Marcus Johnson', email: 'marcus@taskflow.dev', role: 'Product Manager', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'm4', name: 'Elena Rostova', email: 'elena@taskflow.dev', role: 'UI/UX Designer', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80' },
  { id: 'm5', name: 'Devon Vance', email: 'devon@taskflow.dev', role: 'QA Lead', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'NextGen Mobile App Redesign',
    description: 'Complete overhaul of the cross-platform React Native app with modernized design system, offline sync, and real-time push notifications.',
    ownerId: 'm1',
    status: 'Active',
    dueDate: '2026-11-15',
    teamMemberIds: ['m1', 'm2', 'm4'],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'p2',
    name: 'Cloud Infrastructure & Security Hardening',
    description: 'Migrating legacy servers to AWS ECS, setting up automated CI/CD pipelines, and auditing zero-trust authentication policies.',
    ownerId: 'm3',
    status: 'Active',
    dueDate: '2026-10-30',
    teamMemberIds: ['m1', 'm3', 'm5'],
    createdAt: '2026-08-15T14:30:00.000Z'
  },
  {
    id: 'p3',
    name: 'Enterprise Scale Test (1,000 Tasks)',
    description: 'High-volume project benchmark designed to demonstrate react-window virtualization, debounced search, and zero lag operations under 1,000+ items.',
    ownerId: 'm2',
    status: 'Active',
    dueDate: '2026-12-01',
    teamMemberIds: ['m1', 'm2', 'm3', 'm4', 'm5'],
    createdAt: '2026-09-01T08:00:00.000Z'
  }
];

export const INITIAL_TASKS: Task[] = [
  // Project 1 tasks
  {
    id: 't-101',
    projectId: 'p1',
    title: 'Audit existing UI component library',
    description: 'Document current color tokens, typography scales, and component accessibility bottlenecks in Figma.',
    status: 'Completed',
    priority: 'High',
    assigneeId: 'm4',
    dueDate: '2026-09-10',
    createdAt: '2026-08-02T11:00:00.000Z',
    updatedAt: '2026-09-10T16:00:00.000Z'
  },
  {
    id: 't-102',
    projectId: 'p1',
    title: 'Implement Dark Mode design tokens',
    description: 'Set up CSS custom properties and HSL variables to support instant theme switching across all views.',
    status: 'In Progress',
    priority: 'High',
    assigneeId: 'm2',
    dueDate: '2026-10-05',
    createdAt: '2026-08-05T09:15:00.000Z',
    updatedAt: '2026-09-20T12:30:00.000Z'
  },
  {
    id: 't-103',
    projectId: 'p1',
    title: 'Integrate OAuth 2.0 & Biometric Auth',
    description: 'Connect iOS FaceID and Android Fingerprint native modules with JWT refreshToken rotation endpoint.',
    status: 'Todo',
    priority: 'High',
    assigneeId: 'm1',
    dueDate: '2026-10-20',
    createdAt: '2026-08-10T14:00:00.000Z',
    updatedAt: '2026-08-10T14:00:00.000Z'
  },
  {
    id: 't-104',
    projectId: 'p1',
    title: 'Setup automated E2E tests with Playwright',
    description: 'Create test harness for authentication flow, task creation modal, and offline fallback states.',
    status: 'Todo',
    priority: 'Medium',
    assigneeId: 'm5',
    dueDate: '2026-11-01',
    createdAt: '2026-08-12T16:45:00.000Z',
    updatedAt: '2026-08-12T16:45:00.000Z'
  },

  // Project 2 tasks
  {
    id: 't-201',
    projectId: 'p2',
    title: 'Configure Terraform AWS ECS cluster',
    description: 'Provision multi-region Fargate cluster with auto-scaling rules and Application Load Balancer target groups.',
    status: 'In Progress',
    priority: 'High',
    assigneeId: 'm1',
    dueDate: '2026-10-12',
    createdAt: '2026-08-16T10:30:00.000Z',
    updatedAt: '2026-09-22T15:10:00.000Z'
  },
  {
    id: 't-202',
    projectId: 'p2',
    title: 'Penetration testing & vulnerability scan',
    description: 'Run Snyk dependency check, OWASP ZAP automated scanner, and patch critical CVEs.',
    status: 'Todo',
    priority: 'Medium',
    assigneeId: 'm5',
    dueDate: '2026-10-25',
    createdAt: '2026-08-18T13:20:00.000Z',
    updatedAt: '2026-08-18T13:20:00.000Z'
  }
];

// Generator function for 1000 tasks attached to Project 3 ('p3')
export function generate1000Tasks(): Task[] {
  const statuses: Array<Task['status']> = ['Todo', 'In Progress', 'Completed'];
  const priorities: Array<Task['priority']> = ['Low', 'Medium', 'High'];
  const memberIds = ['m1', 'm2', 'm3', 'm4', 'm5'];

  const generated: Task[] = [];
  const baseDate = new Date('2026-09-01').getTime();

  for (let i = 1; i <= 1000; i++) {
    const status = statuses[i % 3];
    const priority = priorities[i % 3];
    const assigneeId = memberIds[i % memberIds.length];
    const dayOffset = (i % 60) + 1;
    const dueDate = new Date(baseDate + dayOffset * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    generated.push({
      id: `t-perf-${i}`,
      projectId: 'p3',
      title: `Virtual Task #${i}: Optimization & Benchmark Test ${i % 10 === 0 ? '[URGENT]' : ''}`,
      description: `Synthetic workload item #${i} to stress test DOM rendering performance, virtualized list scrolling, and memoization pipeline under 1000 items.`,
      status,
      priority,
      assigneeId,
      dueDate,
      createdAt: new Date(baseDate - i * 10000).toISOString(),
      updatedAt: new Date(baseDate).toISOString()
    });
  }

  return generated;
}

export const ALL_INITIAL_TASKS = [...INITIAL_TASKS, ...generate1000Tasks()];
