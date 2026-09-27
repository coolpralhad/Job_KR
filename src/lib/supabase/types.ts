export type Role = "candidate" | "employer" | "admin"
export type VerificationStatus = "pending" | "approved" | "rejected" | "info_requested"
export type JobStatus = "draft" | "pending_payment" | "under_review" | "active" | "paused" | "closed"
export type PaymentStatus = "unpaid" | "pending_confirmation" | "paid"
export type ApplicationStatus = "applied" | "viewed" | "shortlisted" | "interview" | "offer" | "hired" | "rejected"
export type AlertFrequency = "immediately" | "daily" | "weekly"

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: Role
          created_at: string
        }
        Insert: {
          id: string
          role: Role
          created_at?: string
        }
        Update: {
          role?: Role
        }
        Relationships: []
      }
      candidate_profiles: {
        Row: {
          id: string
          full_name: string | null
          career_goals: string[] | null
          location: string | null
          work_status: string | null
          visa_type: string | null
          topik_level: string | null
          available_from: string | null
          skills: string[] | null
          experience_years: number | null
          current_title: string | null
          industry: string | null
          languages: Record<string, unknown>[] | null
          onboarding_step: number
        }
        Insert: {
          id: string
          full_name?: string | null
          career_goals?: string[] | null
          location?: string | null
          work_status?: string | null
          visa_type?: string | null
          topik_level?: string | null
          available_from?: string | null
          skills?: string[] | null
          experience_years?: number | null
          current_title?: string | null
          industry?: string | null
          languages?: Record<string, unknown>[] | null
          onboarding_step?: number
        }
        Update: {
          full_name?: string | null
          career_goals?: string[] | null
          location?: string | null
          work_status?: string | null
          visa_type?: string | null
          topik_level?: string | null
          available_from?: string | null
          skills?: string[] | null
          experience_years?: number | null
          current_title?: string | null
          industry?: string | null
          languages?: Record<string, unknown>[] | null
          onboarding_step?: number
        }
        Relationships: []
      }
      companies: {
        Row: {
          id: string
          legal_name: string
          display_name: string | null
          industry: string | null
          size: string | null
          city: string | null
          website: string | null
          description: string | null
          business_reg_number: string | null
          verification_status: VerificationStatus
          verified_at: string | null
          created_at: string
          logo_url: string | null
          verification_doc_path: string | null
        }
        Insert: {
          id?: string
          legal_name: string
          display_name?: string | null
          industry?: string | null
          size?: string | null
          city?: string | null
          website?: string | null
          description?: string | null
          business_reg_number?: string | null
          verification_status?: VerificationStatus
          verified_at?: string | null
          logo_url?: string | null
          verification_doc_path?: string | null
        }
        Update: {
          legal_name?: string
          display_name?: string | null
          industry?: string | null
          size?: string | null
          city?: string | null
          website?: string | null
          description?: string | null
          business_reg_number?: string | null
          verification_status?: VerificationStatus
          verified_at?: string | null
          logo_url?: string | null
          verification_doc_path?: string | null
        }
        Relationships: []
      }
      employer_profiles: {
        Row: {
          id: string
          company_id: string | null
          job_title: string | null
        }
        Insert: {
          id: string
          company_id?: string | null
          job_title?: string | null
        }
        Update: {
          company_id?: string | null
          job_title?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          id: string
          company_id: string
          title: string
          status: JobStatus
          payment_status: string
          visa_types: string[] | null
          industry: string | null
          city: string | null
          job_type: string | null
          workplace_type: string | null
          salary_min: number | null
          salary_max: number | null
          description: string | null
          requirements: Record<string, unknown> | null
          benefits: string[] | null
          korean_level: string | null
          english_required: string | null
          international_applicants: string | null
          sponsorship: string | null
          relocation: string | null
          overseas_applicants: string | null
          deadline: string | null
          posted_at: string | null
          created_at: string
          questions: Record<string, unknown>[] | null
          topik_level: string | null
          experience_years: string | null
        }
        Insert: {
          id?: string
          company_id: string
          title: string
          status?: JobStatus
          payment_status?: string
          visa_types?: string[] | null
          industry?: string | null
          city?: string | null
          job_type?: string | null
          workplace_type?: string | null
          salary_min?: number | null
          salary_max?: number | null
          description?: string | null
          requirements?: Record<string, unknown> | null
          benefits?: string[] | null
          korean_level?: string | null
          english_required?: string | null
          international_applicants?: string | null
          sponsorship?: string | null
          relocation?: string | null
          overseas_applicants?: string | null
          deadline?: string | null
          posted_at?: string | null
          questions?: Record<string, unknown>[] | null
          topik_level?: string | null
          experience_years?: string | null
        }
        Update: {
          title?: string
          status?: JobStatus
          payment_status?: string
          visa_types?: string[] | null
          industry?: string | null
          city?: string | null
          job_type?: string | null
          workplace_type?: string | null
          salary_min?: number | null
          salary_max?: number | null
          description?: string | null
          requirements?: Record<string, unknown> | null
          benefits?: string[] | null
          korean_level?: string | null
          english_required?: string | null
          international_applicants?: string | null
          sponsorship?: string | null
          relocation?: string | null
          overseas_applicants?: string | null
          deadline?: string | null
          posted_at?: string | null
          questions?: Record<string, unknown>[] | null
          topik_level?: string | null
          experience_years?: string | null
        }
        Relationships: []
      }
      applications: {
        Row: {
          id: string
          job_id: string
          candidate_id: string
          status: ApplicationStatus
          cover_message: string | null
          applied_at: string
          notes: string | null
          answers: Record<string, unknown> | null
        }
        Insert: {
          id?: string
          job_id: string
          candidate_id: string
          status?: ApplicationStatus
          cover_message?: string | null
          applied_at?: string
          notes?: string | null
          answers?: Record<string, unknown> | null
        }
        Update: {
          status?: ApplicationStatus
          cover_message?: string | null
          notes?: string | null
          answers?: Record<string, unknown> | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          id: string
          user_id: string
          type: string
          storage_path: string
          uploaded_at: string
          application_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          storage_path: string
          uploaded_at?: string
          application_id?: string | null
        }
        Update: {
          storage_path?: string
        }
        Relationships: []
      }
      saved_jobs: {
        Row: {
          candidate_id: string
          job_id: string
          saved_at: string
        }
        Insert: {
          candidate_id: string
          job_id: string
          saved_at?: string
        }
        Update: {
          saved_at?: string
        }
        Relationships: []
      }
      job_alerts: {
        Row: {
          id: string
          candidate_id: string
          criteria: Record<string, unknown>
          frequency: AlertFrequency
          active: boolean
          created_at: string
          last_sent_at: string | null
        }
        Insert: {
          id?: string
          candidate_id: string
          criteria: Record<string, unknown>
          frequency?: AlertFrequency
          active?: boolean
          last_sent_at?: string | null
        }
        Update: {
          criteria?: Record<string, unknown>
          frequency?: AlertFrequency
          active?: boolean
          last_sent_at?: string | null
        }
        Relationships: []
      }
      payment_records: {
        Row: {
          id: string
          job_id: string
          amount: number | null
          proof_path: string | null
          reference_code: string
          status: string
          submitted_at: string
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          job_id: string
          amount?: number | null
          proof_path?: string | null
          reference_code: string
          status?: string
          submitted_at?: string
          confirmed_at?: string | null
          confirmed_by?: string | null
        }
        Update: {
          amount?: number | null
          proof_path?: string | null
          status?: string
          confirmed_at?: string | null
          confirmed_by?: string | null
        }
        Relationships: []
      }
      admin_logs: {
        Row: {
          id: string
          admin_id: string
          action: string
          target_type: string | null
          target_id: string | null
          created_at: string
          notes: string | null
        }
        Insert: {
          id?: string
          admin_id: string
          action: string
          target_type?: string | null
          target_id?: string | null
          notes?: string | null
        }
        Update: {
          notes?: string | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          id: string
          sent_by: string | null
          recipient_email: string
          subject: string | null
          sent_at: string
        }
        Insert: {
          id?: string
          sent_by?: string | null
          recipient_email: string
          subject?: string | null
        }
        Update: {
          subject?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
