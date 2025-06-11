export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          company: string | null;
          role: string | null;
          bio: string | null;
          interests: string[] | null;
          looking_for: string[] | null;
          contact_info: any | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          company?: string | null;
          role?: string | null;
          bio?: string | null;
          interests?: string[] | null;
          looking_for?: string[] | null;
          contact_info?: any | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          company?: string | null;
          role?: string | null;
          bio?: string | null;
          interests?: string[] | null;
          looking_for?: string[] | null;
          contact_info?: any | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          start_time: string;
          end_time: string;
          location: string;
          track: string;
          speakers: string[] | null;
          capacity: number | null;
          registration_url: string | null;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          start_time: string;
          end_time: string;
          location: string;
          track: string;
          speakers?: string[] | null;
          capacity?: number | null;
          registration_url?: string | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          start_time?: string;
          end_time?: string;
          location?: string;
          track?: string;
          speakers?: string[] | null;
          capacity?: number | null;
          registration_url?: string | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      pitches: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          contact_info: string;
          tags: string[] | null;
          looking_for: string[] | null;
          stage: string | null;
          industry: string | null;
          likes_count: number;
          comments_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          contact_info: string;
          tags?: string[] | null;
          looking_for?: string[] | null;
          stage?: string | null;
          industry?: string | null;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          contact_info?: string;
          tags?: string[] | null;
          looking_for?: string[] | null;
          stage?: string | null;
          industry?: string | null;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      gatherings: {
        Row: {
          id: string;
          organizer_id: string;
          name: string;
          description: string;
          location: string;
          scheduled_time: string;
          max_attendees: number | null;
          tags: string[] | null;
          attendee_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organizer_id: string;
          name: string;
          description: string;
          location: string;
          scheduled_time: string;
          max_attendees?: number | null;
          tags?: string[] | null;
          attendee_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organizer_id?: string;
          name?: string;
          description?: string;
          location?: string;
          scheduled_time?: string;
          max_attendees?: number | null;
          tags?: string[] | null;
          attendee_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_saves: {
        Row: {
          id: string;
          user_id: string;
          event_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          event_id?: string;
          created_at?: string;
        };
      };
      pitch_interactions: {
        Row: {
          id: string;
          user_id: string;
          pitch_id: string;
          interaction_type: string;
          comment_text: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          pitch_id: string;
          interaction_type: string;
          comment_text?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          pitch_id?: string;
          interaction_type?: string;
          comment_text?: string | null;
          created_at?: string;
        };
      };
      gathering_attendees: {
        Row: {
          id: string;
          user_id: string;
          gathering_id: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          gathering_id: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          gathering_id?: string;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
}