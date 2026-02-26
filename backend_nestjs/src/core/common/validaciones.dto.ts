import { applyDecorators } from "@nestjs/common";
import { IsNotEmpty, IsOptional, MaxLength } from "class-validator";

export function Obligatorio(campo: string) {
    return applyDecorators(
        IsNotEmpty({ message: `El campo ${campo} no debe estar vacío` }),
    );
}

export function Maximo(limite: number, campo: string) {
    return applyDecorators(
        MaxLength(limite, { message: `El campo ${campo} no debe superar los ${limite} caracteres` })
    );
}


export function Opcional() {
    return applyDecorators(
        IsOptional(),
    );
}