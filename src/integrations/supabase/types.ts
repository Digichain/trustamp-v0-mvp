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
          blNumber: string | null
          carrierName: string | null
          company_name: string | null
          consignee: Json | null
          created_at: string | null
          document_id: string
          id: string
          links: Json | null
          notifyParty: Json | null
          packages: Json | null
          placeOfDelivery: string | null
          placeOfReceipt: string | null
          portOfDischarge: string | null
          portOfLoading: string | null
          raw_document: Json | null
          scac: string | null
          shipper: Json | null
          updated_at: string | null
          vessel: string | null
          voyageNo: string | null
        }
        Insert: {
          bl_number?: string | null
          blNumber?: string | null
          carrierName?: string | null
          company_name?: string | null
          consignee?: Json | null
          created_at?: string | null
          document_id: string
          id?: string
          links?: Json | null
          notifyParty?: Json | null
          packages?: Json | null
          placeOfDelivery?: string | null
          placeOfReceipt?: string | null
          portOfDischarge?: string | null
          portOfLoading?: string | null
          raw_document?: Json | null
          scac?: string | null
          shipper?: Json | null
          updated_at?: string | null
          vessel?: string | null
          voyageNo?: string | null
        }
        Update: {
          bl_number?: string | null
          blNumber?: string | null
          carrierName?: string | null
          company_name?: string | null
          consignee?: Json | null
          created_at?: string | null
          document_id?: string
          id?: string
          links?: Json | null
          notifyParty?: Json | null
          packages?: Json | null
          placeOfDelivery?: string | null
          placeOfReceipt?: string | null
          portOfDischarge?: string | null
          portOfLoading?: string | null
          raw_document?: Json | null
          scac?: string | null
          shipper?: Json | null
          updated_at?: string | null
          vessel?: string | null
          voyageNo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bill_of_lading_documents_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          document_subtype: string | null
          id: string
          network: string
          raw_document: Json | null
          signed_document: Json | null
          status: string
          title: string | null
          transaction_hash: string
          transaction_type: string
          updated_at: string | null
          user_id: string
          wrapped_document: Json | null
        }
        Insert: {
          created_at?: string | null
          document_subtype?: string | null
          id?: string
          network: string
          raw_document?: Json | null
          signed_document?: Json | null
          status?: string
          title?: string | null
          transaction_hash: string
          transaction_type: string
          updated_at?: string | null
          user_id: string
          wrapped_document?: Json | null
        }
        Update: {
          created_at?: string | null
          document_subtype?: string | null
          id?: string
          network?: string
          raw_document?: Json | null
          signed_document?: Json | null
          status?: string
          title?: string | null
          transaction_hash?: string
          transaction_type?: string
          updated_at?: string | null
          user_id?: string
          wrapped_document?: Json | null
        }
        Relationships: []
      }
      invoice_documents: {
        Row: {
          bill_from: Json | null
          bill_to: Json | null
          billable_items: Json | null
          created_at: string | null
          date: string | null
          document_id: string
          id: string
          invoice_number: string | null
          subtotal: number | null
          tax: number | null
          tax_total: number | null
          total: number | null
          updated_at: string | null
        }
        Insert: {
          bill_from?: Json | null
          bill_to?: Json | null
          billable_items?: Json | null
          created_at?: string | null
          date?: string | null
          document_id: string
          id?: string
          invoice_number?: string | null
          subtotal?: number | null
          tax?: number | null
          tax_total?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Update: {
          bill_from?: Json | null
          bill_to?: Json | null
          billable_items?: Json | null
          created_at?: string | null
          date?: string | null
          document_id?: string
          id?: string
          invoice_number?: string | null
          subtotal?: number | null
          tax?: number | null
          tax_total?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_documents_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_recipients: {
        Row: {
          created_at: string | null
          id: string
          recipient_user_id: string | null
          transaction_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          recipient_user_id?: string | null
          transaction_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          recipient_user_id?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_recipients_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          recipient_user_id: string
          transaction_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          recipient_user_id: string
          transaction_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          recipient_user_id?: string
          transaction_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      secrets: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      transaction_documents: {
        Row: {
          created_at: string | null
          document_data: Json | null
          document_id: string | null
          id: string
          transaction_id: string | null
        }
        Insert: {
          created_at?: string | null
          document_data?: Json | null
          document_id?: string | null
          id?: string
          transaction_id?: string | null
        }
        Update: {
          created_at?: string | null
          document_data?: Json | null
          document_id?: string | null
          id?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_documents_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_documents_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          created_at: string | null
          id: string
          network: string
          payment_bound: boolean | null
          status: string
          title: string | null
          transaction_hash: string
          transaction_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          network: string
          payment_bound?: boolean | null
          status?: string
          title?: string | null
          transaction_hash: string
          transaction_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          network?: string
          payment_bound?: boolean | null
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
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
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
