import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class N8nClient {
  private readonly logger = new Logger(N8nClient.name);
  private http: AxiosInstance;

  constructor(private configService: ConfigService) {
    const baseUrl = this.configService.get<string>('N8N_BASE_URL');
    const apiKey = this.configService.get<string>('N8N_API_KEY');

    this.http = axios.create({
      baseURL: baseUrl?.replace(/\/+$/, ''),
      headers: apiKey ? { 'X-N8N-API-KEY': apiKey } : {},
      timeout: 30000,
    });

    this.logger.log(`N8nClient initialized with base URL: ${baseUrl}`);
  }

  async createWorkflow(payload: any) {
    try {
      this.logger.log('Creating workflow in n8n...');
      const { data } = await this.http.post('/rest/workflows', payload);
      this.logger.log(`Workflow created with ID: ${data.id}`);
      return data;
    } catch (error) {
      this.logger.error('Failed to create workflow in n8n', error.response?.data || error.message);
      throw error;
    }
  }

  async updateWorkflow(id: string | number, payload: any) {
    try {
      this.logger.log(`Updating workflow ${id} in n8n...`);
      const { data } = await this.http.patch(`/rest/workflows/${id}`, payload);
      this.logger.log(`Workflow ${id} updated successfully`);
      return data;
    } catch (error) {
      this.logger.error(`Failed to update workflow ${id} in n8n`, error.response?.data || error.message);
      throw error;
    }
  }

  async getWorkflow(id: string | number) {
    try {
      const { data } = await this.http.get(`/rest/workflows/${id}`);
      return data;
    } catch (error) {
      this.logger.error(`Failed to get workflow ${id} from n8n`, error.response?.data || error.message);
      throw error;
    }
  }

  async getExecutions(workflowId?: string | number, limit = 20) {
    try {
      const params: any = { limit };
      if (workflowId) {
        params.workflowId = workflowId;
      }
      const { data } = await this.http.get('/rest/executions', { params });
      return data;
    } catch (error) {
      this.logger.error('Failed to get executions from n8n', error.response?.data || error.message);
      throw error;
    }
  }

  async activateWorkflow(id: string | number) {
    try {
      this.logger.log(`Activating workflow ${id} in n8n...`);
      const { data } = await this.http.post(`/rest/workflows/${id}/activate`);
      this.logger.log(`Workflow ${id} activated successfully`);
      return data;
    } catch (error) {
      this.logger.error(`Failed to activate workflow ${id} in n8n`, error.response?.data || error.message);
      throw error;
    }
  }

  async deactivateWorkflow(id: string | number) {
    try {
      this.logger.log(`Deactivating workflow ${id} in n8n...`);
      const { data } = await this.http.post(`/rest/workflows/${id}/deactivate`);
      this.logger.log(`Workflow ${id} deactivated successfully`);
      return data;
    } catch (error) {
      this.logger.error(`Failed to deactivate workflow ${id} in n8n`, error.response?.data || error.message);
      throw error;
    }
  }
}
