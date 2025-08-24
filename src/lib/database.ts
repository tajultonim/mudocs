export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string | null
          created_at: string
          extra_meta: Json | null
          id: string
          ip: string | null
          is_admin_action: boolean
          target_id: string | null
          target_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string
          extra_meta?: Json | null
          id?: string
          ip?: string | null
          is_admin_action?: boolean
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string
          extra_meta?: Json | null
          id?: string
          ip?: string | null
          is_admin_action?: boolean
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      authors: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          body: string
          created_at: string
          file_id: string | null
          id: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          file_id?: string | null
          id?: string
          user_id?: string
        }
        Update: {
          body?: string
          created_at?: string
          file_id?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "document_with_publishers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      document_author: {
        Row: {
          author_id: string
          created_at: string
          document_id: string
          id: string
          order: number
        }
        Insert: {
          author_id: string
          created_at?: string
          document_id: string
          id?: string
          order?: number
        }
        Update: {
          author_id?: string
          created_at?: string
          document_id?: string
          id?: string
          order?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_author_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_author_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "document_with_publishers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_author_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_tag: {
        Row: {
          created_at: string
          document_id: string
          id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          document_id: string
          id?: string
          tag_id: string
        }
        Update: {
          created_at?: string
          document_id?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_tag_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "document_with_publishers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_tag_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_tag_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          cover_path: string
          created_at: string
          ddc: string | null
          deleted_at: string | null
          description: string | null
          doi: string | null
          download_count: number
          extra_meta: Json | null
          id: string
          isbn_13: string[] | null
          language: Database["public"]["Enums"]["language_type"] | null
          status: string | null
          title: string
          type: string
          updated_at: string | null
          uploader_id: string | null
        }
        Insert: {
          cover_path?: string
          created_at?: string
          ddc?: string | null
          deleted_at?: string | null
          description?: string | null
          doi?: string | null
          download_count?: number
          extra_meta?: Json | null
          id?: string
          isbn_13?: string[] | null
          language?: Database["public"]["Enums"]["language_type"] | null
          status?: string | null
          title: string
          type: string
          updated_at?: string | null
          uploader_id?: string | null
        }
        Update: {
          cover_path?: string
          created_at?: string
          ddc?: string | null
          deleted_at?: string | null
          description?: string | null
          doi?: string | null
          download_count?: number
          extra_meta?: Json | null
          id?: string
          isbn_13?: string[] | null
          language?: Database["public"]["Enums"]["language_type"] | null
          status?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          uploader_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_uploader_id_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          cover_mime_type: Database["public"]["Enums"]["cover_mime_type"]
          cover_path: string
          created_at: string
          document_id: string
          download_count: number
          extra_meta: Json
          file_path: string
          id: string
          mime_type: Database["public"]["Enums"]["file_mime_type"]
          order: number
          pages: number
          publisher_id: string | null
          sha256_hash: string
          size_bytes: number
          status: Database["public"]["Enums"]["file_status"]
          title: string
          uploader_id: string | null
          year: string | null
        }
        Insert: {
          cover_mime_type: Database["public"]["Enums"]["cover_mime_type"]
          cover_path: string
          created_at?: string
          document_id: string
          download_count?: number
          extra_meta?: Json
          file_path: string
          id?: string
          mime_type: Database["public"]["Enums"]["file_mime_type"]
          order?: number
          pages: number
          publisher_id?: string | null
          sha256_hash: string
          size_bytes: number
          status?: Database["public"]["Enums"]["file_status"]
          title: string
          uploader_id?: string | null
          year?: string | null
        }
        Update: {
          cover_mime_type?: Database["public"]["Enums"]["cover_mime_type"]
          cover_path?: string
          created_at?: string
          document_id?: string
          download_count?: number
          extra_meta?: Json
          file_path?: string
          id?: string
          mime_type?: Database["public"]["Enums"]["file_mime_type"]
          order?: number
          pages?: number
          publisher_id?: string | null
          sha256_hash?: string
          size_bytes?: number
          status?: Database["public"]["Enums"]["file_status"]
          title?: string
          uploader_id?: string | null
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_document_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "document_with_publishers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_document_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_publisher_fkey1"
            columns: ["publisher_id"]
            isOneToOne: false
            referencedRelation: "publishers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_uploader_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pdl: {
        Row: {
          created_at: string
          document_id: string
          edition: string | null
          id: string
          is_rental: boolean
          pages: number | null
          pdl_no: string
          publisher_id: string | null
          year: string | null
        }
        Insert: {
          created_at?: string
          document_id?: string
          edition?: string | null
          id?: string
          is_rental?: boolean
          pages?: number | null
          pdl_no: string
          publisher_id?: string | null
          year?: string | null
        }
        Update: {
          created_at?: string
          document_id?: string
          edition?: string | null
          id?: string
          is_rental?: boolean
          pages?: number | null
          pdl_no?: string
          publisher_id?: string | null
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pdl_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "document_with_publishers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pdl_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pdl_publisher_id_fkey"
            columns: ["publisher_id"]
            isOneToOne: false
            referencedRelation: "publishers"
            referencedColumns: ["id"]
          },
        ]
      }
      publishers: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string
          extra_meta: Json | null
          id: string
          ip: string
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          extra_meta?: Json | null
          id?: string
          ip: string
          token: string
          user_id: string
        }
        Update: {
          created_at?: string
          extra_meta?: Json | null
          id?: string
          ip?: string
          token?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          banned_until: string | null
          created_at: string
          download_count: number | null
          email: string
          extra_meta: Json | null
          full_name: string | null
          id: string
          image_url: string | null
          intro: string | null
          is_verified: boolean
          password_hash: string
          roles: string[]
          upload_count: number | null
          username: string
        }
        Insert: {
          banned_until?: string | null
          created_at?: string
          download_count?: number | null
          email: string
          extra_meta?: Json | null
          full_name?: string | null
          id?: string
          image_url?: string | null
          intro?: string | null
          is_verified?: boolean
          password_hash: string
          roles: string[]
          upload_count?: number | null
          username: string
        }
        Update: {
          banned_until?: string | null
          created_at?: string
          download_count?: number | null
          email?: string
          extra_meta?: Json | null
          full_name?: string | null
          id?: string
          image_url?: string | null
          intro?: string | null
          is_verified?: boolean
          password_hash?: string
          roles?: string[]
          upload_count?: number | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      document_with_publishers: {
        Row: {
          cover_path: string | null
          created_at: string | null
          ddc: string | null
          deleted_at: string | null
          description: string | null
          doi: string | null
          download_count: number | null
          extra_meta: Json | null
          file_publisher_id: string | null
          id: string | null
          isbn_13: string[] | null
          language: Database["public"]["Enums"]["language_type"] | null
          pdl_publisher_id: string | null
          status: string | null
          title: string | null
          type: string | null
          updated_at: string | null
          uploader_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_publisher_fkey1"
            columns: ["file_publisher_id"]
            isOneToOne: false
            referencedRelation: "publishers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_uploader_id_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pdl_publisher_id_fkey"
            columns: ["pdl_publisher_id"]
            isOneToOne: false
            referencedRelation: "publishers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      create_file_upload: {
        Args: {
          author_ids: string[]
          cover_path: string
          description: string
          extra_meta: Json
          file_path: string
          hash: string
          language?: string
          mime_type: string
          publisher_id?: string
          size_bytes: number
          tag_ids: string[]
          title: string
          type: string
          user_id: string
          year?: string
        }
        Returns: string
      }
      increase_download_count: {
        Args: { file_id: string }
        Returns: string
      }
      pg_execute_sql: {
        Args: { arguments: Json; sql: string }
        Returns: Record<string, unknown>[]
      }
    }
    Enums: {
      cover_mime_type: "image/png"
      document_type: "book" | "paper" | "note" | "other"
      file_mime_type: "application/pdf" | "application/epub+zip" | "text/plain"
      file_status: "uploading" | "live" | "unpublished"
      language_type: "bn" | "en" | "other"
      status_type: "live" | "deleted" | "unpublished"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      cover_mime_type: ["image/png"],
      document_type: ["book", "paper", "note", "other"],
      file_mime_type: ["application/pdf", "application/epub+zip", "text/plain"],
      file_status: ["uploading", "live", "unpublished"],
      language_type: ["bn", "en", "other"],
      status_type: ["live", "deleted", "unpublished"],
    },
  },
} as const
