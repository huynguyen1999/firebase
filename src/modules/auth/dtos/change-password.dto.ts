import { IsDefined, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  current_password: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MinLength(6, { message: 'Mật khẩu tối thiểu 6 ký tự' })
  new_password: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MinLength(6, { message: 'Mật khẩu tối thiểu 6 ký tự' })
  confirm_password: string;
}
