export interface Member {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  country: string;
  city: string;
}

export interface MemberCreate {
  first_name: string;
  last_name: string;
  birth_date: string;
  country: string;
  city: string;
}

export interface MemberUpdate {
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  country?: string;
  city?: string;
}

export interface MemberWithUpcomingBirthday extends Member {
  days_until_birthday: number;
  age_turning: number;
}

export interface AIMessageRequest {
  member_id: number;
  tone?: "friendly" | "formal";
  localize_language?: boolean;
}

export interface AIExplainability {
  model_name: string;
  key_parameters: Record<string, any>;
  prompt_method: string;
  rationale: string;
}

export interface AIMessageResponse {
  message: string;
  explainability: AIExplainability;
}
