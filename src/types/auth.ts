
import { User, Session } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  is_admin: boolean | null;
  preferred_theme: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
}
