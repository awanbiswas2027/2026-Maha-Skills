export type UserRole =
  | 'POLICY_MAKER'
  | 'DISTRICT_OFFICER'
  | 'ITI_PRINCIPAL'
  | 'EMPLOYER'
  | 'SSC_REVIEWER'
  | 'ADMIN'
  | 'CANDIDATE';

export interface UserScope {
  district_id?: number;
  district_name?: string;
  division?: string;
  institute_id?: string;
  sector_ids?: number[];
}

export interface UserProfile {
  id: string;
  keycloak_sub: string;
  email: string;
  full_name: string;
  roles: UserRole[];
  scopes: UserScope;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total_count?: number;
    total_pages?: number;
  } | null;
  error?: {
    code: string;
    message: string;
    details?: Array<Record<string, unknown>>;
  } | null;
}
