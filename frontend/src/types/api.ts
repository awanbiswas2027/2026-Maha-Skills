import { ApiResponse, UserProfile } from './index';

export type UserMeResponse = ApiResponse<UserProfile>;

export interface LmiAggregate {
  total_vacancies: number;
  top_sectors: Array<{
    sector_id: number;
    name: string;
    openings: number;
    growth_rate: number;
  }>;
}

export type SeverityLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface GapScoreItem {
  id: string;
  district_id: number;
  district_name_en: string;
  district_name_mr: string;
  district_name_hi: string;
  sector_id: number;
  sector_name: string;
  job_role_title_en: string;
  job_role_title_mr: string;
  job_role_title_hi: string;
  qp_code: string;
  nsqf_level: number;
  demand_count: number;
  trained_capacity: number;
  placement_rate: number;
  gap_score: number;
  severity_level: SeverityLevel;
  trend_direction: 'RISING' | 'STABLE' | 'FALLING';
}

export interface DistrictGapAggregate {
  id: number;
  code: string;
  name_en: string;
  name_mr: string;
  name_hi: string;
  division: 'Konkan' | 'Pune' | 'Nashik' | 'Chhatrapati Sambhajinagar' | 'Amravati' | 'Nagpur';
  total_vacancies: number;
  total_capacity: number;
  average_gap_score: number;
  severity_level: SeverityLevel;
  critical_trades_count: number;
  iti_count: number;
  has_oversupply_alert: boolean;
  oversupply_trades_count: number;
}

export interface OversupplyAlert {
  id: string;
  district_name: string;
  trade_title: string;
  placement_rate: number;
  local_demand_percentile: number;
  consecutive_quarters: number;
  intake_capacity: number;
  recommended_reduction_percent: number;
}


export interface RecommendationItem {
  id: string;
  recommendation_code: string;
  job_role: string;
  recommendation_type: 'ADD_MODULE' | 'UPDATE_UNIT' | 'NEW_QUALIFICATION' | 'RETIRE_COURSE';
  status: string;
}

export interface CourseItem {
  id: string;
  course_code: string;
  title_en: string;
  title_mr: string;
  title_hi: string;
  sector_name: string;
  sector_name_mr: string;
  sector_name_hi: string;
  duration_months: number;
  nsqf_level: number;
  verified_placement_rate: number;
  median_salary_inr: number;
  time_to_hire_days: number;
  is_high_demand: boolean;
  is_scholarship_eligible: boolean;
  iti_count: number;
  annual_seats: number;
  districts: string[];
  description_en: string;
  description_mr: string;
  description_hi: string;
  minimum_education: '8TH' | '10TH' | '12TH' | 'GRADUATE';
}

export interface PathwayQuizOption {
  id: string;
  label_en: string;
  label_mr: string;
  label_hi: string;
  description_en?: string;
  description_mr?: string;
  description_hi?: string;
}

export interface PathwayQuizQuestion {
  id: number;
  key: string;
  title_en: string;
  title_mr: string;
  title_hi: string;
  subtitle_en: string;
  subtitle_mr: string;
  subtitle_hi: string;
  options: PathwayQuizOption[];
}

export interface PathwayQuizAnswers {
  education: string;
  interest: string;
  workEnvironment: string;
  districtPreference: string;
  durationPreference: string;
}

export interface PathwayRecommendation {
  course: CourseItem;
  matchScore: number;
  rationale_en: string;
  rationale_mr: string;
  rationale_hi: string;
  highlight_traits: string[];
}

