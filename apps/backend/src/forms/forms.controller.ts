import { 
  Body, 
  Controller, 
  Get, 
  Param, 
  Post, 
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { CompileDto } from './dto/compile.dto';

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post()
  async upsert(@Body() dto: CreateFormDto) {
    return this.formsService.upsert(dto.definition);
  }

  @Get(':formId')
  async get(@Param('formId') formId: string) {
    return this.formsService.get(formId);
  }

  @Post('compile')
  @HttpCode(HttpStatus.OK)
  async compile(@Body() dto: CompileDto) {
    return this.formsService.compile(dto.formId);
  }

  @Post(':formId/push-to-n8n')
  @HttpCode(HttpStatus.OK)
  async pushToN8n(@Param('formId') formId: string) {
    return this.formsService.pushToN8n(formId);
  }

  @Get(':formId/compiled')
  async getCompiled(@Param('formId') formId: string) {
    return this.formsService.getCompiled(formId);
  }

  @Get(':formId/runs')
  async getRuns(
    @Param('formId') formId: string,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.formsService.getRuns(formId, limitNum);
  }

  @Post(':formId/activate')
  @HttpCode(HttpStatus.OK)
  async activateWorkflow(@Param('formId') formId: string) {
    return this.formsService.activateWorkflow(formId);
  }

  @Post(':formId/deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivateWorkflow(@Param('formId') formId: string) {
    return this.formsService.deactivateWorkflow(formId);
  }
}
