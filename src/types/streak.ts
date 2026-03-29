export interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface StreakResponse {
  success: boolean;
  message: string;
  data: UserStreak;
}
