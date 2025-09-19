import { Module } from '@nestjs/common';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';
import { CompilerModule } from '../compiler/compiler.module';
import { N8nModule } from '../n8n/n8n.module';

@Module({
  imports: [CompilerModule, N8nModule],
  controllers: [FormsController],
  providers: [FormsService],
  exports: [FormsService],
})
export class FormsModule {}
