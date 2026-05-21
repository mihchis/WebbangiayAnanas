import { IsString, Length } from 'class-validator';

export class Verify2faDto {
  @IsString()
  @Length(6, 6, { message: '2FA code must be exactly 6 digits' })
  code: string;
}
