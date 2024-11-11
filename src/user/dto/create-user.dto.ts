import {IsEmail, IsInt, IsNotEmpty, IsPositive, IsString} from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    role_id: number
}
