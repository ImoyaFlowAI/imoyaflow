import { 
  Body, 
  Controller, 
  Headers, 
  Param, 
  Post, 
  HttpCode,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import axios from 'axios';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private configService: ConfigService) {}

  @Post(':path')
  @HttpCode(HttpStatus.OK)
  async receive(
    @Param('path') path: string,
    @Body() payload: any,
    @Headers('x-signature') signature?: string,
  ) {
    this.logger.log(`Received webhook for path: ${path}`);

    // Verify signature if provided
    if (signature) {
      const isValid = this.verifySignature(payload, signature);
      if (!isValid) {
        this.logger.warn(`Invalid signature for webhook ${path}`);
        throw new BadRequestException('Invalid signature');
      }
    }

    // For MVP, we'll just log the payload and return success
    // In production, this would forward to the actual n8n webhook
    this.logger.log(`Webhook payload for ${path}:`, JSON.stringify(payload, null, 2));

    // TODO: Forward to n8n webhook URL
    // const n8nUrl = `${this.configService.get('N8N_BASE_URL')}/webhook/${path}`;
    // await this.forwardToN8n(n8nUrl, payload);

    return {
      ok: true,
      formPath: path,
      received: payload,
      timestamp: new Date().toISOString(),
    };
  }

  private verifySignature(payload: any, signature: string): boolean {
    const secret = this.configService.get<string>('WEBHOOK_SIGNING_SECRET');
    if (!secret) {
      this.logger.warn('No webhook signing secret configured');
      return true; // Allow if no secret configured
    }

    const expectedSignature = `sha256=${crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex')}`;

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );
  }

  private async forwardToN8n(url: string, payload: any): Promise<void> {
    try {
      this.logger.log(`Forwarding to n8n: ${url}`);
      await axios.post(url, payload, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      this.logger.log('Successfully forwarded to n8n');
    } catch (error) {
      this.logger.error('Failed to forward to n8n:', error.message);
      throw error;
    }
  }
}
