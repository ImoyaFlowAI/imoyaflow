export interface Field {
  id: string
  type: 'text' | 'email' | 'textarea' | 'number' | 'select' | 'date'
  label: string
  required?: boolean
  placeholder?: string
  options?: string[]
}

export interface FormConfig {
  id: string
  title: string
  description?: string
  fields: Field[]
}

export type AutomationType = 'send_email' | 'append_sheet' | 'slack_notify'

export interface Automation {
  id: string
  type: AutomationType
  when?: string
  config: Record<string, any>
}

export interface HybridDefinition {
  form: FormConfig
  automations: Automation[]
}

export interface CompiledWorkflow {
  name: string
  nodes: any[]
  connections: Record<string, any>
}

export interface Template {
  id: string
  name: string
  description: string
  category: string
  definition: HybridDefinition
  preview?: string
}

export interface FormRun {
  id: string
  status: 'success' | 'error' | 'running'
  startedAt: string
  finishedAt?: string
  summary?: any
}
