import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompilerService } from '../compiler/compiler.service';
import { N8nClient } from '../n8n/n8n.client';
import { HybridDefinition, CompiledWorkflow } from '../common/types';

@Injectable()
export class FormsService {
  private readonly logger = new Logger(FormsService.name);

  constructor(
    private prisma: PrismaService,
    private compiler: CompilerService,
    private n8nClient: N8nClient,
  ) {}

  async upsert(definition: HybridDefinition) {
    this.logger.log(`Upserting form: ${definition.form.title}`);
    
    const { form, automations } = definition;
    
    // Save/Upsert Form + Automations atomically
    await this.prisma.$transaction(async (tx) => {
      await tx.form.upsert({
        where: { id: form.id },
        update: { 
          title: form.title, 
          schemaJson: form,
          updatedAt: new Date(),
        },
        create: {
          id: form.id,
          title: form.title,
          schemaJson: form,
        },
      });

      // Replace automations (simple approach for MVP)
      await tx.automation.deleteMany({ where: { formId: form.id } });
      
      for (const automation of automations) {
        await tx.automation.create({
          data: {
            id: automation.id,
            type: automation.type,
            whenExpr: automation.when ?? null,
            configJson: automation.config,
            formId: form.id,
          },
        });
      }
    });

    this.logger.log(`Form ${form.id} saved successfully`);
    return definition;
  }

  async get(formId: string) {
    const form = await this.prisma.form.findUnique({
      where: { id: formId },
      include: { automations: true, compiled: true },
    });

    if (!form) {
      throw new NotFoundException(`Form with ID ${formId} not found`);
    }

    // Map to the HybridDefinition shape
    return {
      form: {
        id: form.id,
        title: form.title,
        description: (form.schemaJson as any)?.description,
        fields: (form.schemaJson as any)?.fields ?? [],
      },
      automations: form.automations.map(a => ({
        id: a.id,
        type: a.type as any,
        when: a.whenExpr ?? undefined,
        config: a.configJson as any,
      })),
    } as HybridDefinition;
  }

  async compile(formId: string) {
    this.logger.log(`Compiling form: ${formId}`);
    
    const definition = await this.get(formId);
    const compiledWorkflow = this.compiler.compile(definition);

    // Save compiled workflow to database
    const saved = await this.prisma.compiledWorkflow.upsert({
      where: { formId },
      create: {
        formId,
        name: compiledWorkflow.name,
        webhookPath: `forms/${definition.form.id}`,
        n8nJson: compiledWorkflow as any,
      },
      update: {
        name: compiledWorkflow.name,
        n8nJson: compiledWorkflow as any,
        updatedAt: new Date(),
      },
      select: { 
        id: true, 
        name: true, 
        webhookPath: true, 
        n8nJson: true, 
        n8nWorkflowId: true 
      },
    });

    this.logger.log(`Form ${formId} compiled successfully`);
    return { 
      compiled: compiledWorkflow, 
      compiledId: saved.id,
      webhookPath: saved.webhookPath,
    };
  }

  async pushToN8n(formId: string) {
    this.logger.log(`Pushing form ${formId} to n8n...`);
    
    const compiled = await this.getCompiled(formId);
    const definition = await this.get(formId);
    
    try {
      // Create or update workflow in n8n
      const n8nWorkflow = await this.n8nClient.createWorkflow({
        name: compiled.name,
        nodes: compiled.nodes,
        connections: compiled.connections,
        active: false, // Start inactive for safety
      });

      // Get the compiled workflow to get webhook path
      const compiled = await this.getCompiled(formId);
      
      // Update database with n8n workflow ID
      await this.prisma.compiledWorkflow.update({
        where: { formId },
        data: { n8nWorkflowId: n8nWorkflow.id.toString() },
      });

      this.logger.log(`Form ${formId} pushed to n8n with ID: ${n8nWorkflow.id}`);
      return {
        n8nWorkflowId: n8nWorkflow.id,
        webhookUrl: `${process.env.N8N_BASE_URL}/webhook/forms/${formId}`,
        status: 'created',
      };
    } catch (error) {
      this.logger.error(`Failed to push form ${formId} to n8n:`, error.message);
      throw error;
    }
  }

  async getCompiled(formId: string) {
    const compiled = await this.prisma.compiledWorkflow.findUnique({
      where: { formId },
    });

    if (!compiled) {
      throw new NotFoundException(`Compiled workflow for form ${formId} not found`);
    }

    return compiled.n8nJson as CompiledWorkflow;
  }

  async getRuns(formId: string, limit = 20) {
    const compiled = await this.prisma.compiledWorkflow.findUnique({
      where: { formId },
    });

    if (!compiled || !compiled.n8nWorkflowId) {
      return { items: [], formId };
    }

    try {
      const executions = await this.n8nClient.getExecutions(compiled.n8nWorkflowId, limit);
      return {
        items: executions.data || [],
        formId,
        total: executions.total || 0,
      };
    } catch (error) {
      this.logger.error(`Failed to get runs for form ${formId}:`, error.message);
      return { items: [], formId, error: error.message };
    }
  }

  async activateWorkflow(formId: string) {
    const compiled = await this.prisma.compiledWorkflow.findUnique({
      where: { formId },
    });

    if (!compiled || !compiled.n8nWorkflowId) {
      throw new NotFoundException(`No n8n workflow found for form ${formId}`);
    }

    await this.n8nClient.activateWorkflow(compiled.n8nWorkflowId);
    this.logger.log(`Workflow for form ${formId} activated`);
    return { status: 'activated' };
  }

  async deactivateWorkflow(formId: string) {
    const compiled = await this.prisma.compiledWorkflow.findUnique({
      where: { formId },
    });

    if (!compiled || !compiled.n8nWorkflowId) {
      throw new NotFoundException(`No n8n workflow found for form ${formId}`);
    }

    await this.n8nClient.deactivateWorkflow(compiled.n8nWorkflowId);
    this.logger.log(`Workflow for form ${formId} deactivated`);
    return { status: 'deactivated' };
  }
}
