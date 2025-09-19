import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { N8nClient } from './n8n.client';

@Module({
  imports: [ConfigModule],
  providers: [N8nClient],
  exports: [N8nClient],
})
export class N8nModule {}
