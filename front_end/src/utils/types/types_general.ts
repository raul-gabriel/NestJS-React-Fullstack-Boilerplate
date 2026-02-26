


export type columnas = {
    name: string;
    price: number;
    invoiceDate: string;
    status: string;
  };
  

// types/api.types.ts
export interface ApiResponse<T = null> {
  message: string;
  status: number;
  data?: T;
}