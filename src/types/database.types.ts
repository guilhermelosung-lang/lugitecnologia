export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      agendamentos: {
        Row: {
          created_at: string
          created_by: string | null
          data_hora_fim: string | null
          data_hora_inicio: string
          deleted_at: string | null
          empresa_id: string
          id: string
          obra_id: string
          observacoes: string | null
          responsavel_id: string | null
          status: string
          tipo: string
          titulo: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data_hora_fim?: string | null
          data_hora_inicio: string
          deleted_at?: string | null
          empresa_id: string
          id?: string
          obra_id: string
          observacoes?: string | null
          responsavel_id?: string | null
          status?: string
          tipo?: string
          titulo: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data_hora_fim?: string | null
          data_hora_inicio?: string
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          obra_id?: string
          observacoes?: string | null
          responsavel_id?: string | null
          status?: string
          tipo?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      ambientes: {
        Row: {
          created_at: string
          empresa_id: string
          id: string
          nome_personalizado: string | null
          obra_id: string
          observacoes: string | null
          tipo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          empresa_id: string
          id?: string
          nome_personalizado?: string | null
          obra_id: string
          observacoes?: string | null
          tipo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          empresa_id?: string
          id?: string
          nome_personalizado?: string | null
          obra_id?: string
          observacoes?: string | null
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ambientes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ambientes_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      auditoria: {
        Row: {
          acao: string
          created_at: string
          dados_anteriores: Json | null
          dados_novos: Json | null
          empresa_id: string
          id: string
          registro_id: string
          tabela: string
          usuario_id: string | null
        }
        Insert: {
          acao: string
          created_at?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          empresa_id: string
          id?: string
          registro_id: string
          tabela: string
          usuario_id?: string | null
        }
        Update: {
          acao?: string
          created_at?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          empresa_id?: string
          id?: string
          registro_id?: string
          tabela?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auditoria_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auditoria_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      beneficiamentos_catalogo: {
        Row: {
          ativo: boolean
          created_at: string
          created_by: string | null
          deleted_at: string | null
          descricao: string | null
          empresa_id: string
          id: string
          nome: string
          preco_unitario: number | null
          tipo: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          descricao?: string | null
          empresa_id: string
          id?: string
          nome: string
          preco_unitario?: number | null
          tipo?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          descricao?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          preco_unitario?: number | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "beneficiamentos_catalogo_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      beneficiamentos_lancamentos: {
        Row: {
          beneficiamento_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          obra_id: string | null
          observacoes: string | null
          peca_referencia: string
          quantidade: number
        }
        Insert: {
          beneficiamento_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          obra_id?: string | null
          observacoes?: string | null
          peca_referencia: string
          quantidade?: number
        }
        Update: {
          beneficiamento_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          obra_id?: string | null
          observacoes?: string | null
          peca_referencia?: string
          quantidade?: number
        }
        Relationships: [
          {
            foreignKeyName: "beneficiamentos_lancamentos_beneficiamento_id_fkey"
            columns: ["beneficiamento_id"]
            isOneToOne: false
            referencedRelation: "beneficiamentos_catalogo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beneficiamentos_lancamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beneficiamentos_lancamentos_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      calculos_box: {
        Row: {
          altura_direita_mm: number
          altura_esquerda_mm: number
          created_at: string
          created_by: string | null
          empresa_id: string
          espessura_mm: number
          id: string
          kit_id: string | null
          lado_abertura: string
          largura_central_mm: number
          largura_inferior_mm: number
          largura_superior_mm: number
          nome: string | null
          obra_id: string | null
          quantidade_folhas: number
          resultado: Json
          tipo_box: string
          tipo_puxador: string | null
        }
        Insert: {
          altura_direita_mm: number
          altura_esquerda_mm: number
          created_at?: string
          created_by?: string | null
          empresa_id: string
          espessura_mm?: number
          id?: string
          kit_id?: string | null
          lado_abertura?: string
          largura_central_mm: number
          largura_inferior_mm: number
          largura_superior_mm: number
          nome?: string | null
          obra_id?: string | null
          quantidade_folhas?: number
          resultado: Json
          tipo_box?: string
          tipo_puxador?: string | null
        }
        Update: {
          altura_direita_mm?: number
          altura_esquerda_mm?: number
          created_at?: string
          created_by?: string | null
          empresa_id?: string
          espessura_mm?: number
          id?: string
          kit_id?: string | null
          lado_abertura?: string
          largura_central_mm?: number
          largura_inferior_mm?: number
          largura_superior_mm?: number
          nome?: string | null
          obra_id?: string | null
          quantidade_folhas?: number
          resultado?: Json
          tipo_box?: string
          tipo_puxador?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calculos_box_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calculos_box_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calculos_box_kit_id_fkey"
            columns: ["kit_id"]
            isOneToOne: false
            referencedRelation: "kits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calculos_box_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      calculos_janela: {
        Row: {
          altura_vao_mm: number
          created_at: string
          created_by: string | null
          empresa_id: string
          espessura_mm: number
          id: string
          kit_id: string | null
          largura_vao_mm: number
          nome: string | null
          obra_id: string | null
          quantidade_folhas: number
          resultado: Json
          tipo_janela: string
        }
        Insert: {
          altura_vao_mm: number
          created_at?: string
          created_by?: string | null
          empresa_id: string
          espessura_mm?: number
          id?: string
          kit_id?: string | null
          largura_vao_mm: number
          nome?: string | null
          obra_id?: string | null
          quantidade_folhas?: number
          resultado: Json
          tipo_janela?: string
        }
        Update: {
          altura_vao_mm?: number
          created_at?: string
          created_by?: string | null
          empresa_id?: string
          espessura_mm?: number
          id?: string
          kit_id?: string | null
          largura_vao_mm?: number
          nome?: string | null
          obra_id?: string | null
          quantidade_folhas?: number
          resultado?: Json
          tipo_janela?: string
        }
        Relationships: [
          {
            foreignKeyName: "calculos_janela_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calculos_janela_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calculos_janela_kit_id_fkey"
            columns: ["kit_id"]
            isOneToOne: false
            referencedRelation: "kits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calculos_janela_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      calculos_espelho_tampo: {
        Row: {
          acabamento_borda: string
          altura_mm: number
          coeficiente_peso: number
          created_at: string
          created_by: string | null
          deleted_at: string | null
          empresa_id: string
          espessura_mm: number
          id: string
          largura_mm: number
          nome: string | null
          obra_id: string | null
          quantidade_furos_fixacao: number
          resultado: Json
          tipo: string
        }
        Insert: {
          acabamento_borda?: string
          altura_mm: number
          coeficiente_peso?: number
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          empresa_id: string
          espessura_mm: number
          id?: string
          largura_mm: number
          nome?: string | null
          obra_id?: string | null
          quantidade_furos_fixacao?: number
          resultado: Json
          tipo?: string
        }
        Update: {
          acabamento_borda?: string
          altura_mm?: number
          coeficiente_peso?: number
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          empresa_id?: string
          espessura_mm?: number
          id?: string
          largura_mm?: number
          nome?: string | null
          obra_id?: string | null
          quantidade_furos_fixacao?: number
          resultado?: Json
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "calculos_espelho_tampo_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calculos_espelho_tampo_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      calculos_peso_vidro: {
        Row: {
          altura_mm: number
          coeficiente_peso: number
          created_at: string
          created_by: string | null
          deleted_at: string | null
          empresa_id: string
          espessura_mm: number
          id: string
          largura_mm: number
          nome: string | null
          numero_pessoas: number
          obra_id: string | null
          resultado: Json
          tipo_instalacao: string
        }
        Insert: {
          altura_mm: number
          coeficiente_peso?: number
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          empresa_id: string
          espessura_mm: number
          id?: string
          largura_mm: number
          nome?: string | null
          numero_pessoas?: number
          obra_id?: string | null
          resultado: Json
          tipo_instalacao?: string
        }
        Update: {
          altura_mm?: number
          coeficiente_peso?: number
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          empresa_id?: string
          espessura_mm?: number
          id?: string
          largura_mm?: number
          nome?: string | null
          numero_pessoas?: number
          obra_id?: string | null
          resultado?: Json
          tipo_instalacao?: string
        }
        Relationships: [
          {
            foreignKeyName: "calculos_peso_vidro_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calculos_peso_vidro_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      calculos_porta: {
        Row: {
          altura_vao_mm: number
          created_at: string
          created_by: string | null
          empresa_id: string
          espessura_mm: number
          id: string
          kit_id: string | null
          lado_dobradica: string | null
          largura_fixo_mm: number | null
          largura_vao_mm: number
          nome: string | null
          obra_id: string | null
          quantidade_dobradicas: number | null
          resultado: Json
          sentido_abertura: string | null
          tipo_porta: string
        }
        Insert: {
          altura_vao_mm: number
          created_at?: string
          created_by?: string | null
          empresa_id: string
          espessura_mm?: number
          id?: string
          kit_id?: string | null
          lado_dobradica?: string | null
          largura_fixo_mm?: number | null
          largura_vao_mm: number
          nome?: string | null
          obra_id?: string | null
          quantidade_dobradicas?: number | null
          resultado: Json
          sentido_abertura?: string | null
          tipo_porta?: string
        }
        Update: {
          altura_vao_mm?: number
          created_at?: string
          created_by?: string | null
          empresa_id?: string
          espessura_mm?: number
          id?: string
          kit_id?: string | null
          lado_dobradica?: string | null
          largura_fixo_mm?: number | null
          largura_vao_mm?: number
          nome?: string | null
          obra_id?: string | null
          quantidade_dobradicas?: number | null
          resultado?: Json
          sentido_abertura?: string | null
          tipo_porta?: string
        }
        Relationships: [
          {
            foreignKeyName: "calculos_porta_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calculos_porta_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calculos_porta_kit_id_fkey"
            columns: ["kit_id"]
            isOneToOne: false
            referencedRelation: "kits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calculos_porta_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      calculos_sacada: {
        Row: {
          abertura: Json | null
          altura_central_mm: number | null
          altura_direita_mm: number | null
          altura_esquerda_mm: number | null
          created_at: string
          created_by: string | null
          empresa_id: string
          espessura_mm: number
          id: string
          kit_id: string | null
          lado_abertura: string | null
          largura_total_mm: number | null
          nome: string | null
          obra_id: string | null
          quantidade_paineis: number | null
          resultado: Json
          segmentos: Json | null
          tipo_sacada: string
        }
        Insert: {
          abertura?: Json | null
          altura_central_mm?: number | null
          altura_direita_mm?: number | null
          altura_esquerda_mm?: number | null
          created_at?: string
          created_by?: string | null
          empresa_id: string
          espessura_mm?: number
          id?: string
          kit_id?: string | null
          lado_abertura?: string | null
          largura_total_mm?: number | null
          nome?: string | null
          obra_id?: string | null
          quantidade_paineis?: number | null
          resultado: Json
          segmentos?: Json | null
          tipo_sacada?: string
        }
        Update: {
          abertura?: Json | null
          altura_central_mm?: number | null
          altura_direita_mm?: number | null
          altura_esquerda_mm?: number | null
          created_at?: string
          created_by?: string | null
          empresa_id?: string
          espessura_mm?: number
          id?: string
          kit_id?: string | null
          lado_abertura?: string | null
          largura_total_mm?: number | null
          nome?: string | null
          obra_id?: string | null
          quantidade_paineis?: number | null
          resultado?: Json
          segmentos?: Json | null
          tipo_sacada?: string
        }
        Relationships: [
          {
            foreignKeyName: "calculos_sacada_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calculos_sacada_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calculos_sacada_kit_id_fkey"
            columns: ["kit_id"]
            isOneToOne: false
            referencedRelation: "kits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calculos_sacada_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      chamados_garantia: {
        Row: {
          created_at: string
          created_by: string | null
          data_abertura: string
          data_resolucao: string | null
          deleted_at: string | null
          descricao: string
          empresa_id: string
          id: string
          obra_id: string
          prioridade: string
          resolucao: string | null
          status: string
          tipo: string
          titulo: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data_abertura?: string
          data_resolucao?: string | null
          deleted_at?: string | null
          descricao: string
          empresa_id: string
          id?: string
          obra_id: string
          prioridade?: string
          resolucao?: string | null
          status?: string
          tipo?: string
          titulo: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data_abertura?: string
          data_resolucao?: string | null
          deleted_at?: string | null
          descricao?: string
          empresa_id?: string
          id?: string
          obra_id?: string
          prioridade?: string
          resolucao?: string | null
          status?: string
          tipo?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "chamados_garantia_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chamados_garantia_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          bairro: string | null
          cep: string | null
          cidade: string | null
          cpf_cnpj: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          email: string | null
          empresa_id: string
          endereco: string | null
          estado: string | null
          filial_id: string | null
          id: string
          nome: string
          observacoes: string | null
          origem: string | null
          responsavel: string | null
          status: string
          telefone: string | null
          updated_at: string
          vendedor_id: string | null
          whatsapp: string | null
        }
        Insert: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email?: string | null
          empresa_id: string
          endereco?: string | null
          estado?: string | null
          filial_id?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          origem?: string | null
          responsavel?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
          vendedor_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email?: string | null
          empresa_id?: string
          endereco?: string | null
          estado?: string | null
          filial_id?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          origem?: string | null
          responsavel?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
          vendedor_id?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clientes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clientes_filial_id_fkey"
            columns: ["filial_id"]
            isOneToOne: false
            referencedRelation: "filiais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clientes_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      convites: {
        Row: {
          created_at: string
          criado_por: string | null
          email: string
          empresa_id: string
          expira_em: string
          filial_id: string | null
          id: string
          nome: string | null
          perfil_id: string
          token: string
          usado_em: string | null
        }
        Insert: {
          created_at?: string
          criado_por?: string | null
          email: string
          empresa_id: string
          expira_em?: string
          filial_id?: string | null
          id?: string
          nome?: string | null
          perfil_id: string
          token?: string
          usado_em?: string | null
        }
        Update: {
          created_at?: string
          criado_por?: string | null
          email?: string
          empresa_id?: string
          expira_em?: string
          filial_id?: string | null
          id?: string
          nome?: string | null
          perfil_id?: string
          token?: string
          usado_em?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "convites_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "convites_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "convites_filial_id_fkey"
            columns: ["filial_id"]
            isOneToOne: false
            referencedRelation: "filiais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "convites_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos: {
        Row: {
          caminho_storage: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          descricao: string | null
          empresa_id: string
          entidade_id: string
          entidade_tipo: string
          id: string
          nome_arquivo: string
          tamanho_bytes: number
          tipo_mime: string | null
        }
        Insert: {
          caminho_storage: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          descricao?: string | null
          empresa_id: string
          entidade_id: string
          entidade_tipo: string
          id?: string
          nome_arquivo: string
          tamanho_bytes: number
          tipo_mime?: string | null
        }
        Update: {
          caminho_storage?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          descricao?: string | null
          empresa_id?: string
          entidade_id?: string
          entidade_tipo?: string
          id?: string
          nome_arquivo?: string
          tamanho_bytes?: number
          tipo_mime?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          assinatura_url: string | null
          casas_decimais: number
          cep: string | null
          chave_pix: string | null
          cidade: string | null
          comissao_padrao: number
          condicoes_comerciais: string | null
          cpf_cnpj: string
          created_at: string
          custo_deslocamento: number
          dados_bancarios: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          garantia_padrao_meses: number
          id: string
          inscricao_estadual: string | null
          logo_url: string | null
          margem_minima: number
          moeda: string
          nome_fantasia: string | null
          percentual_imposto: number
          percentual_perda: number
          plano_expira_em: string | null
          plano_id: string | null
          plano_status: string
          politica_arredondamento: string
          prazo_padrao_dias: number
          preco_minimo_instalacao: number
          razao_social: string
          responsavel: string | null
          telefone: string | null
          texto_garantia: string | null
          unidade_medida: string
          updated_at: string
          validade_orcamento_dias: number
          whatsapp: string | null
        }
        Insert: {
          assinatura_url?: string | null
          casas_decimais?: number
          cep?: string | null
          chave_pix?: string | null
          cidade?: string | null
          comissao_padrao?: number
          condicoes_comerciais?: string | null
          cpf_cnpj: string
          created_at?: string
          custo_deslocamento?: number
          dados_bancarios?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          garantia_padrao_meses?: number
          id?: string
          inscricao_estadual?: string | null
          logo_url?: string | null
          margem_minima?: number
          moeda?: string
          nome_fantasia?: string | null
          percentual_imposto?: number
          percentual_perda?: number
          plano_expira_em?: string | null
          plano_id?: string | null
          plano_status?: string
          politica_arredondamento?: string
          prazo_padrao_dias?: number
          preco_minimo_instalacao?: number
          razao_social: string
          responsavel?: string | null
          telefone?: string | null
          texto_garantia?: string | null
          unidade_medida?: string
          updated_at?: string
          validade_orcamento_dias?: number
          whatsapp?: string | null
        }
        Update: {
          assinatura_url?: string | null
          casas_decimais?: number
          cep?: string | null
          chave_pix?: string | null
          cidade?: string | null
          comissao_padrao?: number
          condicoes_comerciais?: string | null
          cpf_cnpj?: string
          created_at?: string
          custo_deslocamento?: number
          dados_bancarios?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          garantia_padrao_meses?: number
          id?: string
          inscricao_estadual?: string | null
          logo_url?: string | null
          margem_minima?: number
          moeda?: string
          nome_fantasia?: string | null
          percentual_imposto?: number
          percentual_perda?: number
          plano_expira_em?: string | null
          plano_id?: string | null
          plano_status?: string
          politica_arredondamento?: string
          prazo_padrao_dias?: number
          preco_minimo_instalacao?: number
          razao_social?: string
          responsavel?: string | null
          telefone?: string | null
          texto_garantia?: string | null
          unidade_medida?: string
          updated_at?: string
          validade_orcamento_dias?: number
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empresas_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos"
            referencedColumns: ["id"]
          },
        ]
      }
      filiais: {
        Row: {
          ativo: boolean
          cidade: string | null
          codigo: string | null
          created_at: string
          email: string | null
          empresa_id: string
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          responsavel: string | null
          telefone: string | null
          updated_at: string
          usa_configuracao_propria: boolean
        }
        Insert: {
          ativo?: boolean
          cidade?: string | null
          codigo?: string | null
          created_at?: string
          email?: string | null
          empresa_id: string
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          responsavel?: string | null
          telefone?: string | null
          updated_at?: string
          usa_configuracao_propria?: boolean
        }
        Update: {
          ativo?: boolean
          cidade?: string | null
          codigo?: string | null
          created_at?: string
          email?: string | null
          empresa_id?: string
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          responsavel?: string | null
          telefone?: string | null
          updated_at?: string
          usa_configuracao_propria?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "filiais_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      financeiro_lancamentos: {
        Row: {
          categoria: string
          created_at: string
          created_by: string | null
          data_pagamento: string | null
          data_vencimento: string
          deleted_at: string | null
          descricao: string
          empresa_id: string
          forma_pagamento: string | null
          fornecedor_id: string | null
          id: string
          obra_id: string | null
          observacoes: string | null
          orcamento_id: string | null
          status: string
          tipo: string
          valor: number
        }
        Insert: {
          categoria?: string
          created_at?: string
          created_by?: string | null
          data_pagamento?: string | null
          data_vencimento: string
          deleted_at?: string | null
          descricao: string
          empresa_id: string
          forma_pagamento?: string | null
          fornecedor_id?: string | null
          id?: string
          obra_id?: string | null
          observacoes?: string | null
          orcamento_id?: string | null
          status?: string
          tipo: string
          valor: number
        }
        Update: {
          categoria?: string
          created_at?: string
          created_by?: string | null
          data_pagamento?: string | null
          data_vencimento?: string
          deleted_at?: string | null
          descricao?: string
          empresa_id?: string
          forma_pagamento?: string | null
          fornecedor_id?: string | null
          id?: string
          obra_id?: string | null
          observacoes?: string | null
          orcamento_id?: string | null
          status?: string
          tipo?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "financeiro_lancamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financeiro_lancamentos_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financeiro_lancamentos_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financeiro_lancamentos_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      fornecedores: {
        Row: {
          cidade: string | null
          cnpj: string | null
          condicoes_pagamento: string | null
          contato: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          email: string | null
          empresa_id: string
          endereco: string | null
          estado: string | null
          frete: string | null
          id: string
          nome: string
          observacoes: string | null
          pedido_minimo: number | null
          prazo_entrega_dias: number | null
          regioes_atendidas: string | null
          status: string
          telefone: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          cidade?: string | null
          cnpj?: string | null
          condicoes_pagamento?: string | null
          contato?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email?: string | null
          empresa_id: string
          endereco?: string | null
          estado?: string | null
          frete?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          pedido_minimo?: number | null
          prazo_entrega_dias?: number | null
          regioes_atendidas?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          cidade?: string | null
          cnpj?: string | null
          condicoes_pagamento?: string | null
          contato?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email?: string | null
          empresa_id?: string
          endereco?: string | null
          estado?: string | null
          frete?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          pedido_minimo?: number | null
          prazo_entrega_dias?: number | null
          regioes_atendidas?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fornecedores_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fornecedores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_estoque: {
        Row: {
          categoria: string
          created_at: string
          custo_unitario: number | null
          deleted_at: string | null
          empresa_id: string
          filial_id: string | null
          fornecedor_id: string | null
          id: string
          nome: string
          observacoes: string | null
          quantidade_atual: number
          quantidade_minima: number
          unidade: string
          updated_at: string
        }
        Insert: {
          categoria: string
          created_at?: string
          custo_unitario?: number | null
          deleted_at?: string | null
          empresa_id: string
          filial_id?: string | null
          fornecedor_id?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          quantidade_atual?: number
          quantidade_minima?: number
          unidade?: string
          updated_at?: string
        }
        Update: {
          categoria?: string
          created_at?: string
          custo_unitario?: number | null
          deleted_at?: string | null
          empresa_id?: string
          filial_id?: string | null
          fornecedor_id?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          quantidade_atual?: number
          quantidade_minima?: number
          unidade?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "itens_estoque_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_estoque_filial_id_fkey"
            columns: ["filial_id"]
            isOneToOne: false
            referencedRelation: "filiais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_estoque_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
        ]
      }
      kit_itens: {
        Row: {
          created_at: string
          descricao: string
          empresa_id: string
          id: string
          kit_id: string
          quantidade_padrao: number
          tipo: string
          unidade: string
        }
        Insert: {
          created_at?: string
          descricao: string
          empresa_id: string
          id?: string
          kit_id: string
          quantidade_padrao?: number
          tipo?: string
          unidade?: string
        }
        Update: {
          created_at?: string
          descricao?: string
          empresa_id?: string
          id?: string
          kit_id?: string
          quantidade_padrao?: number
          tipo?: string
          unidade?: string
        }
        Relationships: [
          {
            foreignKeyName: "kit_itens_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kit_itens_kit_id_fkey"
            columns: ["kit_id"]
            isOneToOne: false
            referencedRelation: "kits"
            referencedColumns: ["id"]
          },
        ]
      }
      kits: {
        Row: {
          abertura_padrao_lado: string | null
          abertura_padrao_tipo: string | null
          ativo: boolean
          created_at: string
          deleted_at: string | null
          descricao: string | null
          empresa_id: string
          id: string
          nome: string
          sistema_id: string
          updated_at: string
        }
        Insert: {
          abertura_padrao_lado?: string | null
          abertura_padrao_tipo?: string | null
          ativo?: boolean
          created_at?: string
          deleted_at?: string | null
          descricao?: string | null
          empresa_id: string
          id?: string
          nome: string
          sistema_id: string
          updated_at?: string
        }
        Update: {
          abertura_padrao_lado?: string | null
          abertura_padrao_tipo?: string | null
          ativo?: boolean
          created_at?: string
          deleted_at?: string | null
          descricao?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          sistema_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kits_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kits_sistema_id_fkey"
            columns: ["sistema_id"]
            isOneToOne: false
            referencedRelation: "sistemas"
            referencedColumns: ["id"]
          },
        ]
      }
      movimentacoes_estoque: {
        Row: {
          created_at: string
          empresa_id: string
          id: string
          item_id: string
          motivo: string | null
          quantidade: number
          tipo: string
          usuario_id: string | null
        }
        Insert: {
          created_at?: string
          empresa_id: string
          id?: string
          item_id: string
          motivo?: string | null
          quantidade: number
          tipo: string
          usuario_id?: string | null
        }
        Update: {
          created_at?: string
          empresa_id?: string
          id?: string
          item_id?: string
          motivo?: string | null
          quantidade?: number
          tipo?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "movimentacoes_estoque_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentacoes_estoque_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "itens_estoque"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentacoes_estoque_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      medicoes: {
        Row: {
          altura_mm: number | null
          ambiente_id: string
          created_at: string
          created_by: string | null
          diagonal1_mm: number | null
          diagonal2_mm: number | null
          empresa_id: string
          id: string
          largura_mm: number | null
          observacoes: string | null
          obra_id: string
          tipo_medida: string
        }
        Insert: {
          altura_mm?: number | null
          ambiente_id: string
          created_at?: string
          created_by?: string | null
          diagonal1_mm?: number | null
          diagonal2_mm?: number | null
          empresa_id: string
          id?: string
          largura_mm?: number | null
          observacoes?: string | null
          obra_id: string
          tipo_medida?: string
        }
        Update: {
          altura_mm?: number | null
          ambiente_id?: string
          created_at?: string
          created_by?: string | null
          diagonal1_mm?: number | null
          diagonal2_mm?: number | null
          empresa_id?: string
          id?: string
          largura_mm?: number | null
          observacoes?: string | null
          obra_id?: string
          tipo_medida?: string
        }
        Relationships: [
          {
            foreignKeyName: "medicoes_ambiente_id_fkey"
            columns: ["ambiente_id"]
            isOneToOne: false
            referencedRelation: "ambientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medicoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medicoes_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      obras: {
        Row: {
          andar: string | null
          apartamento: string | null
          bloco: string | null
          cliente_id: string
          condominio: string | null
          created_at: string
          created_by: string | null
          data_prevista: string | null
          data_visita: string | null
          deleted_at: string | null
          empresa_id: string
          endereco: string | null
          estacionamento: string | null
          filial_id: string | null
          id: string
          instalador_id: string | null
          medidor_id: string | null
          necessita_andaime: boolean
          necessita_icamento: boolean
          nome: string
          observacoes: string | null
          projetista_id: string | null
          responsavel_local: string | null
          restricoes_horario: string | null
          situacao_acesso: string | null
          status: string
          telefone_local: string | null
          updated_at: string
          vendedor_id: string | null
        }
        Insert: {
          andar?: string | null
          apartamento?: string | null
          bloco?: string | null
          cliente_id: string
          condominio?: string | null
          created_at?: string
          created_by?: string | null
          data_prevista?: string | null
          data_visita?: string | null
          deleted_at?: string | null
          empresa_id: string
          endereco?: string | null
          estacionamento?: string | null
          filial_id?: string | null
          id?: string
          instalador_id?: string | null
          medidor_id?: string | null
          necessita_andaime?: boolean
          necessita_icamento?: boolean
          nome: string
          observacoes?: string | null
          projetista_id?: string | null
          responsavel_local?: string | null
          restricoes_horario?: string | null
          situacao_acesso?: string | null
          status?: string
          telefone_local?: string | null
          updated_at?: string
          vendedor_id?: string | null
        }
        Update: {
          andar?: string | null
          apartamento?: string | null
          bloco?: string | null
          cliente_id?: string
          condominio?: string | null
          created_at?: string
          created_by?: string | null
          data_prevista?: string | null
          data_visita?: string | null
          deleted_at?: string | null
          empresa_id?: string
          endereco?: string | null
          estacionamento?: string | null
          filial_id?: string | null
          id?: string
          instalador_id?: string | null
          medidor_id?: string | null
          necessita_andaime?: boolean
          necessita_icamento?: boolean
          nome?: string
          observacoes?: string | null
          projetista_id?: string | null
          responsavel_local?: string | null
          restricoes_horario?: string | null
          situacao_acesso?: string | null
          status?: string
          telefone_local?: string | null
          updated_at?: string
          vendedor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "obras_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "obras_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "obras_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "obras_filial_id_fkey"
            columns: ["filial_id"]
            isOneToOne: false
            referencedRelation: "filiais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "obras_instalador_id_fkey"
            columns: ["instalador_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "obras_medidor_id_fkey"
            columns: ["medidor_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "obras_projetista_id_fkey"
            columns: ["projetista_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "obras_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      orcamentos: {
        Row: {
          aprovado_em: string | null
          aprovado_por: string | null
          condicoes_pagamento: string | null
          created_at: string
          created_by: string | null
          data_validade: string | null
          desconto_percentual: number
          desconto_valor: number
          empresa_id: string
          id: string
          numero: number
          obra_id: string
          observacoes: string | null
          status: string
          updated_at: string
          validade_dias: number
        }
        Insert: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          condicoes_pagamento?: string | null
          created_at?: string
          created_by?: string | null
          data_validade?: string | null
          desconto_percentual?: number
          desconto_valor?: number
          empresa_id: string
          id?: string
          numero?: number
          obra_id: string
          observacoes?: string | null
          status?: string
          updated_at?: string
          validade_dias?: number
        }
        Update: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          condicoes_pagamento?: string | null
          created_at?: string
          created_by?: string | null
          data_validade?: string | null
          desconto_percentual?: number
          desconto_valor?: number
          empresa_id?: string
          id?: string
          numero?: number
          obra_id?: string
          observacoes?: string | null
          status?: string
          updated_at?: string
          validade_dias?: number
        }
        Relationships: [
          {
            foreignKeyName: "orcamentos_aprovado_por_fkey"
            columns: ["aprovado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      orcamento_itens: {
        Row: {
          area_m2: number | null
          calculo_box_id: string | null
          calculo_janela_id: string | null
          calculo_porta_id: string | null
          calculo_sacada_id: string | null
          created_at: string
          custo_unitario: number
          descricao: string
          empresa_id: string
          id: string
          ordem: number
          orcamento_id: string
          preco_unitario: number
          quantidade: number
          tabela_preco_vidro_id: string | null
          unidade: string
        }
        Insert: {
          area_m2?: number | null
          calculo_box_id?: string | null
          calculo_janela_id?: string | null
          calculo_porta_id?: string | null
          calculo_sacada_id?: string | null
          created_at?: string
          custo_unitario?: number
          descricao: string
          empresa_id: string
          id?: string
          ordem?: number
          orcamento_id: string
          preco_unitario?: number
          quantidade?: number
          tabela_preco_vidro_id?: string | null
          unidade?: string
        }
        Update: {
          area_m2?: number | null
          calculo_box_id?: string | null
          calculo_janela_id?: string | null
          calculo_porta_id?: string | null
          calculo_sacada_id?: string | null
          created_at?: string
          custo_unitario?: number
          descricao?: string
          empresa_id?: string
          id?: string
          ordem?: number
          orcamento_id?: string
          preco_unitario?: number
          quantidade?: number
          tabela_preco_vidro_id?: string | null
          unidade?: string
        }
        Relationships: [
          {
            foreignKeyName: "orcamento_itens_calculo_box_id_fkey"
            columns: ["calculo_box_id"]
            isOneToOne: false
            referencedRelation: "calculos_box"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamento_itens_calculo_janela_id_fkey"
            columns: ["calculo_janela_id"]
            isOneToOne: false
            referencedRelation: "calculos_janela"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamento_itens_calculo_porta_id_fkey"
            columns: ["calculo_porta_id"]
            isOneToOne: false
            referencedRelation: "calculos_porta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamento_itens_calculo_sacada_id_fkey"
            columns: ["calculo_sacada_id"]
            isOneToOne: false
            referencedRelation: "calculos_sacada"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamento_itens_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamento_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamento_itens_tabela_preco_vidro_id_fkey"
            columns: ["tabela_preco_vidro_id"]
            isOneToOne: false
            referencedRelation: "tabela_precos_vidro"
            referencedColumns: ["id"]
          },
        ]
      }
      parametros_calculo: {
        Row: {
          chave: string
          created_at: string
          descricao: string | null
          empresa_id: string
          id: string
          kit_id: string
          unidade: string
          updated_at: string
          valor: number
        }
        Insert: {
          chave: string
          created_at?: string
          descricao?: string | null
          empresa_id: string
          id?: string
          kit_id: string
          unidade?: string
          updated_at?: string
          valor: number
        }
        Update: {
          chave?: string
          created_at?: string
          descricao?: string | null
          empresa_id?: string
          id?: string
          kit_id?: string
          unidade?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "parametros_calculo_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parametros_calculo_kit_id_fkey"
            columns: ["kit_id"]
            isOneToOne: false
            referencedRelation: "kits"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos_tempera: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          empresa_id: string
          fornecedor_id: string | null
          id: string
          numero: number
          obra_id: string
          observacoes: string | null
          status: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          empresa_id: string
          fornecedor_id?: string | null
          id?: string
          numero?: number
          obra_id: string
          observacoes?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          empresa_id?: string
          fornecedor_id?: string | null
          id?: string
          numero?: number
          obra_id?: string
          observacoes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_tempera_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_tempera_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_tempera_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos_tempera_itens: {
        Row: {
          altura_mm: number
          calculo_id: string | null
          calculo_tipo: string | null
          codigo: string
          created_at: string
          descricao: string | null
          empresa_id: string
          espessura_mm: number
          id: string
          largura_mm: number
          observacao_recebimento: string | null
          pedido_id: string
          quantidade: number
          recebido: boolean
          recebido_em: string | null
        }
        Insert: {
          altura_mm: number
          calculo_id?: string | null
          calculo_tipo?: string | null
          codigo: string
          created_at?: string
          descricao?: string | null
          empresa_id: string
          espessura_mm: number
          id?: string
          largura_mm: number
          observacao_recebimento?: string | null
          pedido_id: string
          quantidade?: number
          recebido?: boolean
          recebido_em?: string | null
        }
        Update: {
          altura_mm?: number
          calculo_id?: string | null
          calculo_tipo?: string | null
          codigo?: string
          created_at?: string
          descricao?: string | null
          empresa_id?: string
          espessura_mm?: number
          id?: string
          largura_mm?: number
          observacao_recebimento?: string | null
          pedido_id?: string
          quantidade?: number
          recebido?: boolean
          recebido_em?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_tempera_itens_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_tempera_itens_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos_tempera"
            referencedColumns: ["id"]
          },
        ]
      }
      planos: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          id: string
          limite_obras_mes: number | null
          limite_usuarios: number | null
          nome: string
          ordem: number
          preco_mensal: number
          recursos: string[]
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          limite_obras_mes?: number | null
          limite_usuarios?: number | null
          nome: string
          ordem?: number
          preco_mensal?: number
          recursos?: string[]
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          limite_obras_mes?: number | null
          limite_usuarios?: number | null
          nome?: string
          ordem?: number
          preco_mensal?: number
          recursos?: string[]
        }
        Relationships: []
      }
      planos_corte_perfis: {
        Row: {
          comprimento_barra_mm: number
          created_at: string
          created_by: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          margem_mm: number
          nome: string | null
          obra_id: string | null
          pecas: Json
          resultado: Json
        }
        Insert: {
          comprimento_barra_mm: number
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          margem_mm?: number
          nome?: string | null
          obra_id?: string | null
          pecas: Json
          resultado: Json
        }
        Update: {
          comprimento_barra_mm?: number
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          margem_mm?: number
          nome?: string | null
          obra_id?: string | null
          pecas?: Json
          resultado?: Json
        }
        Relationships: [
          {
            foreignKeyName: "planos_corte_perfis_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planos_corte_perfis_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      planos_corte_vidro: {
        Row: {
          chapa_altura_mm: number
          chapa_largura_mm: number
          created_at: string
          created_by: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          margem_mm: number
          nome: string | null
          obra_id: string | null
          pecas: Json
          resultado: Json
        }
        Insert: {
          chapa_altura_mm: number
          chapa_largura_mm: number
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          margem_mm?: number
          nome?: string | null
          obra_id?: string | null
          pecas: Json
          resultado: Json
        }
        Update: {
          chapa_altura_mm?: number
          chapa_largura_mm?: number
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          margem_mm?: number
          nome?: string | null
          obra_id?: string | null
          pecas?: Json
          resultado?: Json
        }
        Relationships: [
          {
            foreignKeyName: "planos_corte_vidro_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planos_corte_vidro_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      perfil_permissoes: {
        Row: {
          perfil_id: string
          permissao_id: string
        }
        Insert: {
          perfil_id: string
          permissao_id: string
        }
        Update: {
          perfil_id?: string
          permissao_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "perfil_permissoes_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "perfil_permissoes_permissao_id_fkey"
            columns: ["permissao_id"]
            isOneToOne: false
            referencedRelation: "permissoes"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis: {
        Row: {
          created_at: string
          descricao: string | null
          empresa_id: string
          id: string
          nome: string
          sistema: boolean
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          empresa_id: string
          id?: string
          nome: string
          sistema?: boolean
        }
        Update: {
          created_at?: string
          descricao?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          sistema?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "perfis_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      permissoes: {
        Row: {
          chave: string
          descricao: string
          id: string
          modulo: string
        }
        Insert: {
          chave: string
          descricao: string
          id?: string
          modulo: string
        }
        Update: {
          chave?: string
          descricao?: string
          id?: string
          modulo?: string
        }
        Relationships: []
      }
      projetos_esquadria_serralheria: {
        Row: {
          categoria: string
          cor: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          descricao: string
          empresa_id: string
          especificacao: string | null
          id: string
          material: string | null
          observacoes: string | null
          obra_id: string
          quantidade: number
          status: string
          valor_estimado: number | null
        }
        Insert: {
          categoria?: string
          cor?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          descricao: string
          empresa_id: string
          especificacao?: string | null
          id?: string
          material?: string | null
          observacoes?: string | null
          obra_id: string
          quantidade?: number
          status?: string
          valor_estimado?: number | null
        }
        Update: {
          categoria?: string
          cor?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          descricao?: string
          empresa_id?: string
          especificacao?: string | null
          id?: string
          material?: string | null
          observacoes?: string | null
          obra_id?: string
          quantidade?: number
          status?: string
          valor_estimado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projetos_esquadria_serralheria_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projetos_esquadria_serralheria_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      sistemas: {
        Row: {
          ativo: boolean
          created_at: string
          created_by: string | null
          deleted_at: string | null
          descricao: string | null
          empresa_id: string
          espessuras_aceitas: string | null
          fabricante: string | null
          id: string
          imagem_url: string | null
          linha: string | null
          medida_maxima_mm: number | null
          medida_minima_mm: number | null
          modelo: string | null
          nome: string
          peso_maximo_kg: number | null
          tipo: string
          updated_at: string
          versao: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          descricao?: string | null
          empresa_id: string
          espessuras_aceitas?: string | null
          fabricante?: string | null
          id?: string
          imagem_url?: string | null
          linha?: string | null
          medida_maxima_mm?: number | null
          medida_minima_mm?: number | null
          modelo?: string | null
          nome: string
          peso_maximo_kg?: number | null
          tipo: string
          updated_at?: string
          versao?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          descricao?: string | null
          empresa_id?: string
          espessuras_aceitas?: string | null
          fabricante?: string | null
          id?: string
          imagem_url?: string | null
          linha?: string | null
          medida_maxima_mm?: number | null
          medida_minima_mm?: number | null
          modelo?: string | null
          nome?: string
          peso_maximo_kg?: number | null
          tipo?: string
          updated_at?: string
          versao?: string
        }
        Relationships: [
          {
            foreignKeyName: "sistemas_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sistemas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      tabela_precos_vidro: {
        Row: {
          ativo: boolean
          cor: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          empresa_id: string
          espessura_mm: number
          fornecedor_id: string | null
          id: string
          margem_padrao_percentual: number
          observacoes: string | null
          preco_tempera_m2: number
          preco_vidro_m2: number
          tipo_vidro: string
        }
        Insert: {
          ativo?: boolean
          cor?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          empresa_id: string
          espessura_mm: number
          fornecedor_id?: string | null
          id?: string
          margem_padrao_percentual?: number
          observacoes?: string | null
          preco_tempera_m2?: number
          preco_vidro_m2: number
          tipo_vidro: string
        }
        Update: {
          ativo?: boolean
          cor?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          empresa_id?: string
          espessura_mm?: number
          fornecedor_id?: string | null
          id?: string
          margem_padrao_percentual?: number
          observacoes?: string | null
          preco_tempera_m2?: number
          preco_vidro_m2?: number
          tipo_vidro?: string
        }
        Relationships: [
          {
            foreignKeyName: "tabela_precos_vidro_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tabela_precos_vidro_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          ativo: boolean
          created_at: string
          email: string
          empresa_id: string
          filial_id: string | null
          id: string
          nome: string
          perfil_id: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          email: string
          empresa_id: string
          filial_id?: string | null
          id: string
          nome: string
          perfil_id: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          email?: string
          empresa_id?: string
          filial_id?: string | null
          id?: string
          nome?: string
          perfil_id?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_filial_id_fkey"
            columns: ["filial_id"]
            isOneToOne: false
            referencedRelation: "filiais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      aceitar_convite: { Args: { p_token: string }; Returns: string }
      bootstrap_empresa: {
        Args: {
          p_cpf_cnpj: string
          p_nome_usuario: string
          p_razao_social: string
        }
        Returns: string
      }
      current_empresa_id: { Args: Record<string, never>; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database["public"]

export type Tables<
  TableName extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
> = (DefaultSchema["Tables"] & DefaultSchema["Views"])[TableName] extends {
  Row: infer R
}
  ? R
  : never

export type TablesInsert<TableName extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][TableName] extends { Insert: infer I } ? I : never

export type TablesUpdate<TableName extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][TableName] extends { Update: infer U } ? U : never
