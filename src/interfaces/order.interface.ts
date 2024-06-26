export interface Order {
  employee_id: string;
  customer_id: string;
  product_id: string;
  quantity: number;
  order_date: number;
  total_amount: number;
  status: string;
}
