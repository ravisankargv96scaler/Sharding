import React from 'react';

export enum TabId {
  CONCEPT = 'concept',
  STRATEGIES = 'strategies',
  ROUTING = 'routing',
  CHALLENGES = 'challenges',
  CONSISTENT = 'consistent',
  QUIZ = 'quiz'
}

export interface NavItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

export type ShardStatus = 'healthy' | 'warning' | 'critical' | 'offline';

export interface DatabaseNodeProps {
  id: string;
  name: string;
  load: number; // 0 to 100
  status: ShardStatus;
  size?: 'sm' | 'md' | 'lg';
  isExploded?: boolean;
  highlight?: boolean;
}