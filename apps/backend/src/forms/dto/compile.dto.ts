import { IsNotEmpty, IsString } from 'class-validator';

export class CompileDto {
  @IsNotEmpty()
  @IsString()
  formId!: string;
}
