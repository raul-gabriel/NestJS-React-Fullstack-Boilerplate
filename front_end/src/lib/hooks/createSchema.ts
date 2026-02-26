import { z } from 'zod';

type CustomValidateFn = (value: unknown, ctx: z.RefinementCtx) => void;

type FieldConfig = {
  required?: boolean;
  maxLength?: number;
  length?: number;
  oneOf?: string[];
  email?: boolean;
  nullable?: boolean;
  defaultValue?: unknown;
  message?: string;
  type?: 'string' | 'number';
  min?: number;
  max?: number;
  customValidate?: CustomValidateFn;
};

const buildStringField = (key: string, config: FieldConfig): z.ZodTypeAny => {
  let schema = z.string();

  if (config.email) {
    schema = schema.email(config.message ?? `${key} debe ser un email válido`);
  }

  if (config.length !== undefined) {
    schema = schema.length(config.length, config.message ?? `${key} debe tener ${config.length} caracteres`);
  }

  if (config.maxLength !== undefined) {
    schema = schema.max(config.maxLength, config.message ?? `${key} no puede tener más de ${config.maxLength} caracteres`);
  }

  if (config.oneOf?.length) {
    schema = schema.refine(
      (val) => config.oneOf!.includes(val),
      { message: config.message ?? `${key} debe ser uno de: ${config.oneOf!.join(', ')}` },
    );
  }

  if (config.customValidate) {
    schema = schema.superRefine(config.customValidate);
  }

  let base: z.ZodTypeAny = config.required
    ? schema.min(1, config.message ?? `${key} es obligatorio`)
    : schema.optional();

  if (config.nullable) base = base.nullable();
  if (config.defaultValue !== undefined) base = (base as z.ZodDefault<z.ZodTypeAny>).default(config.defaultValue);

  return base;
};

const buildNumberField = (key: string, config: FieldConfig): z.ZodTypeAny => {
  let schema = z.number();

  if (config.min !== undefined) {
    schema = schema.min(config.min, config.message ?? `${key} debe ser al menos ${config.min}`);
  }

  if (config.max !== undefined) {
    schema = schema.max(config.max, config.message ?? `${key} debe ser como máximo ${config.max}`);
  }

  if (config.customValidate) {
    schema = schema.superRefine(config.customValidate);
  }

  let base: z.ZodTypeAny = config.required ? schema : schema.optional();

  if (config.nullable) base = base.nullable();
  if (config.defaultValue !== undefined) base = (base as z.ZodDefault<z.ZodTypeAny>).default(config.defaultValue);

  return base;
};

/**
 * Genera un esquema Zod dinámico a partir de una configuración de campos.
 *
 * @example
 * const schema = createSchema({
 *   nombre:  { required: true, maxLength: 100 },
 *   email:   { required: true, email: true },
 *   edad:    { type: 'number', min: 0, max: 120, nullable: true },
 * });
 */
export const createSchema = (fields: Record<string, FieldConfig>): z.ZodObject<z.ZodRawShape> => {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const [key, config] of Object.entries(fields)) {
    shape[key] = config.type === 'number'
      ? buildNumberField(key, config)
      : buildStringField(key, config);
  }

  return z.object(shape as z.ZodRawShape);
};

// Tipo inferido del schema para usar con react-hook-form u otros
export type InferSchema<T extends z.ZodObject<z.ZodRawShape>> = z.infer<T>;