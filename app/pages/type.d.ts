export interface FormType {
  id: number;
  name: string;
  elements: any[];
}

export type FormElementType =
  | 'text'
  | 'textarea'
  | 'date'
  | 'select'
  | 'checkbox'
  | 'radio';

export interface ElementType {
  id: number;
  order: number;
  name: string;
  type: FormElementType;
  label?: string;
  options?: Record<string, any>;
  required: boolean;
  placeholder?: string;
  width: number;
}
