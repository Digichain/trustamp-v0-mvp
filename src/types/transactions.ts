export interface Transaction {
  id: string;
  user_id: string;
  transaction_hash: string | null;
  network: string;
  status: string;
  transaction_type: string;
  title: string | null;
  created_at: string;
  payment_bound: boolean;
}