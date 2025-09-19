import { IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { HybridDefinition } from '../../common/types';

export class CreateFormDto {
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  definition!: HybridDefinition;
}
