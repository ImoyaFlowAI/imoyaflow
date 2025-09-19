import { Injectable, Logger } from '@nestjs/common';
import { HybridDefinition, CompiledWorkflow, N8nWorkflow, N8nNode, N8nConnection } from '../common/types';

@Injectable()
export class CompilerService {
  private readonly logger = new Logger(CompilerService.name);

  /**
   * Compiles a hybrid definition (form + automations) into n8n workflow JSON
   */
  compile(definition: HybridDefinition): CompiledWorkflow {
    this.logger.log(`Compiling form: ${definition.form.title}`);
    
    const nodes: N8nNode[] = [];
    const connections: Record<string, { main: N8nConnection[][] }> = {};

    // Create webhook trigger node
    const webhookNode = this.createWebhookNode(definition.form.id);
    nodes.push(webhookNode);
    connections[webhookNode.name] = { main: [[]] };

    // Process each automation
    for (const automation of definition.automations) {
      this.logger.log(`Processing automation: ${automation.type}`);
      
      switch (automation.type) {
        case 'send_email':
          this.addEmailAutomation(nodes, connections, automation, definition.form);
          break;
        case 'append_sheet':
          this.addSheetAutomation(nodes, connections, automation, definition.form);
          break;
        case 'slack_notify':
          this.addSlackAutomation(nodes, connections, automation, definition.form);
          break;
        default:
          this.logger.warn(`Unknown automation type: ${automation.type}`);
      }
    }

    return {
      name: `${definition.form.title} (compiled)`,
      nodes,
      connections,
    };
  }

  private createWebhookNode(formId: string): N8nNode {
    return {
      id: 'Webhook1',
      name: 'Form Webhook',
      type: 'n8n-nodes-base.webhook',
      typeVersion: 1,
      position: [-300, 0],
      parameters: {
        path: `forms/${formId}`,
        httpMethod: 'POST',
        responseMode: 'onReceived',
        responseData: 'allEntries',
      },
    };
  }

  private addEmailAutomation(
    nodes: N8nNode[],
    connections: Record<string, { main: N8nConnection[][] }>,
    automation: any,
    form: any
  ) {
    const emailNode: N8nNode = {
      id: `Email_${automation.id}`,
      name: `Send Email ${automation.id}`,
      type: 'n8n-nodes-base.gmail',
      typeVersion: 2,
      position: [100, -120 + nodes.length * 20],
      credentials: { gmailOAuth2Api: { id: automation.config.fromCredentialId } },
      parameters: {
        to: this.mapFieldExpression('email', form.fields),
        subject: this.mapFieldExpression('subject', form.fields, automation.config.subject || `Thanks {{name}}`),
        message: this.mapFieldExpression('message', form.fields, automation.config.message || `We received: {{message}}`),
        ...automation.config.overrideParams,
      },
    };

    nodes.push(emailNode);
    this.connectFromWebhook(connections, emailNode.name);
  }

  private addSheetAutomation(
    nodes: N8nNode[],
    connections: Record<string, { main: N8nConnection[][] }>,
    automation: any,
    form: any
  ) {
    const sheetNode: N8nNode = {
      id: `Sheet_${automation.id}`,
      name: `Append to Sheet ${automation.id}`,
      type: 'n8n-nodes-base.googleSheets',
      typeVersion: 3,
      position: [100, 60 + nodes.length * 20],
      credentials: { googleSheetsOAuth2Api: { id: automation.config.sheetCredentialId } },
      parameters: {
        operation: 'append',
        sheetId: automation.config.docId,
        range: automation.config.sheetName || 'Sheet1',
        options: { valueInputMode: 'USER_ENTERED' },
        data: this.createSheetDataExpression(form.fields),
      },
    };

    nodes.push(sheetNode);
    this.connectFromWebhook(connections, sheetNode.name);
  }

  private addSlackAutomation(
    nodes: N8nNode[],
    connections: Record<string, { main: N8nConnection[][] }>,
    automation: any,
    form: any
  ) {
    // Extract threshold from when expression (e.g., "{{orderTotal}} > 500")
    const threshold = this.extractThreshold(automation.when || '{{orderTotal}} > 500');
    const fieldName = this.extractFieldName(automation.when || '{{orderTotal}} > 500');

    // Create IF node
    const ifNode: N8nNode = {
      id: `If_${automation.id}`,
      name: `When ${automation.when || 'condition'}`,
      type: 'n8n-nodes-base.if',
      typeVersion: 2,
      position: [360, -30 + nodes.length * 20],
      parameters: {
        conditions: {
          number: [{
            value1: this.mapFieldExpression(fieldName, form.fields),
            operation: 'larger',
            value2: threshold,
          }],
        },
      },
    };

    // Create Slack node
    const slackNode: N8nNode = {
      id: `Slack_${automation.id}`,
      name: `Slack Notify ${automation.id}`,
      type: 'n8n-nodes-base.slack',
      typeVersion: 2,
      position: [620, -120 + nodes.length * 20],
      credentials: { slackApi: { id: automation.config.slackCredentialId } },
      parameters: {
        resource: 'message',
        operation: 'post',
        channel: automation.config.channel || '#sales',
        text: this.mapFieldExpression('text', form.fields, 
          automation.config.text || `High value lead: {{name}} (${{orderTotal}})`),
      },
    };

    nodes.push(ifNode, slackNode);
    
    // Connect webhook -> IF
    this.connectFromWebhook(connections, ifNode.name);
    
    // Connect IF -> Slack (true branch)
    connections[ifNode.name] = {
      main: [
        [{ node: slackNode.name, type: 'main', index: 0 }],
        []
      ]
    };
  }

  private connectFromWebhook(connections: Record<string, { main: N8nConnection[][] }>, targetNode: string) {
    if (!connections['Form Webhook']) {
      connections['Form Webhook'] = { main: [[]] };
    }
    connections['Form Webhook'].main[0].push({ node: targetNode, type: 'main', index: 0 });
  }

  private mapFieldExpression(fieldId: string, fields: any[], template?: string): string {
    if (template) {
      // Replace {{fieldId}} with n8n expression
      return template.replace(/\{\{(\w+)\}\}/g, (match, fieldName) => {
        return `={{$json["${fieldName}"]}}`;
      });
    }
    
    // Default mapping
    return `={{$json["${fieldId}"]}}`;
  }

  private createSheetDataExpression(fields: any[]): string {
    // Create array expression for Google Sheets
    const fieldNames = fields.map(f => f.id);
    return `={{[${fieldNames.map(name => `$json["${name}"]`).join(',')}]}}`;
  }

  private extractThreshold(expression: string): number {
    const match = expression.match(/>\s*(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  private extractFieldName(expression: string): string {
    const match = expression.match(/\{\{(\w+)\}\}/);
    return match ? match[1] : 'orderTotal';
  }
}
