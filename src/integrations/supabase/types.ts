export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bill_of_lading_documents: {
        Row: {
          bl_number: string | null
          company_name: string | null
          created_at: string | null
          field1: string | null
          field2: string | null
          field3: string | null
          field4: string | null
          field5: string | null
          field6: string | null
          field7: string | null
          field8: string | null
          field9: string | null
          id: string
          raw_document: Json | null
          transaction_id: string
          updated_at: string | null
        }
        Insert: {
          bl_number?: string | null
          company_name?: string | null
          created_at?: string | null
          field1?: string | null
          field2?: string | null
          field3?: string | null
          field4?: string | null
          field5?: string | null
          field6?: string | null
          field7?: string | null
          field8?: string | null
          field9?: string | null
          id?: string
          raw_document?: Json | null
          transaction_id: string
          updated_at?: string | null
        }
        Update: {
          bl_number?: string | null
          company_name?: string | null
          created_at?: string | null
          field1?: string | null
          field2?: string | null
          field3?: string | null
          field4?: string | null
          field5?: string | null
          field6?: string | null
          field7?: string | null
          field8?: string | null
          field9?: string | null
          id?: string
          raw_document?: Json | null
          transaction_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bill_of_lading_documents_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_documents: {
        Row: {
          bill_from: Json | null
          bill_to: Json | null
          billable_items: Json | null
          created_at: string | null
          date: string | null
          id: string
          invoice_number: string | null
          subtotal: number | null
          tax: number | null
          tax_total: number | null
          total: number | null
          transaction_id: string
          updated_at: string | null
        }
        Insert: {
          bill_from?: Json | null
          bill_to?: Json | null
          billable_items?: Json | null
          created_at?: string | null
          date?: string | null
          id?: string
          invoice_number?: string | null
          subtotal?: number | null
          tax?: number | null
          tax_total?: number | null
          total?: number | null
          transaction_id: string
          updated_at?: string | null
        }
        Update: {
          bill_from?: Json | null
          bill_to?: Json | null
          billable_items?: Json | null
          created_at?: string | null
          date?: string | null
          id?: string
          invoice_number?: string | null
          subtotal?: number | null
          tax?: number | null
          tax_total?: number | null
          total?: number | null
          transaction_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_documents_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          document_subtype: string | null
          id: string
          network: string
          raw_document: Json | null
          status: string
          title: string | null
          transaction_hash: string
          transaction_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          document_subtype?: string | null
          id?: string
          network: string
          raw_document?: Json | null
          status?: string
          title?: string | null
          transaction_hash: string
          transaction_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          document_subtype?: string | null
          id?: string
          network?: string
          raw_document?: Json | null
          status?: string
          title?: string | null
          transaction_hash?: string
          transaction_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
