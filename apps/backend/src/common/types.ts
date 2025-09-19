export type Field = {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'number' | 'select' | 'date';
  label: string;
  options?: string[];
  required?: boolean;
  placeholder?: string;
};

export interface FormConfig {
  id: string;
  title: string;
  description?: string;
  fields: Field[];
}

export type AutomationType = 'send_email' | 'append_sheet' | 'slack_notify';

export interface Automation {
  id: string;
  type: AutomationType;
  when?: string; // e.g., "{{orderTotal}} > 500"
  config: Record<string, any>;
}

export interface HybridDefinition {
  form: FormConfig;
  automations: Automation[];
}

export interface CompiledWorkflow {
  name: string;
  nodes: any[];
  connections: Record<string, any>;
}

export interface N8nNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: Record<string, any>;
  credentials?: Record<string, any>;
}

export interface N8nConnection {
  node: string;
  type: string;
  index: number;
}

export interface N8nWorkflow {
  name: string;
  nodes: N8nNode[];
  connections: Record<string, { main: N8nConnection[][] }>;
}
