import { create } from 'zustand';
import { UserProfile, UserRole } from '../../types';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Persona {
  role: UserRole;
  label_en: string;
  label_mr: string;
  profile: UserProfile;
}

export const PRESET_PERSONAS: Record<UserRole, Persona> = {
  POLICY_MAKER: {
    role: 'POLICY_MAKER',
    label_en: 'Policy Maker (DSEEI)',
    label_mr: '???? ???????? (?????? ?????)',
    profile: { id: 'usr-pm-001', keycloak_sub: 'sub-pm-001', email: 'demo.pm@example.gov.in', full_name: 'Officer A. Demo', roles: ['POLICY_MAKER'], scopes: { district_name: 'All 36 Districts (Statewide)' } }
  },
  DISTRICT_OFFICER: {
    role: 'DISTRICT_OFFICER',
    label_en: 'District Skill Officer (Pune)',
    label_mr: '?????? ?????? ??????? (????)',
    profile: { id: 'usr-do-014', keycloak_sub: 'sub-do-014', email: 'demo.do@example.gov.in', full_name: 'Officer B. Demo', roles: ['DISTRICT_OFFICER'], scopes: { district_id: 14, district_name: 'Pune (????)', division: 'Pune' } }
  },
  ITI_PRINCIPAL: {
    role: 'ITI_PRINCIPAL',
    label_en: 'Principal (Govt ITI Aundh)',
    label_mr: '????????? (?????? ?????? ???)',
    profile: { id: 'usr-iti-101', keycloak_sub: 'sub-iti-101', email: 'demo.iti@example.gov.in', full_name: 'Officer C. Demo', roles: ['ITI_PRINCIPAL'], scopes: { district_id: 14, district_name: 'Pune (????)', institute_id: 'iti-pune-aundh-01' } }
  },
  EMPLOYER: {
    role: 'EMPLOYER',
    label_en: 'Employer HR (Tata Motors)',
    label_mr: '?????? ??????? (???? ??????)',
    profile: { id: 'usr-emp-501', keycloak_sub: 'sub-emp-501', email: 'demo.emp@example.gov.in', full_name: 'Employer A. Demo', roles: ['EMPLOYER'], scopes: { sector_ids: [3] } }
  },
  SSC_REVIEWER: {
    role: 'SSC_REVIEWER',
    label_en: 'SSC Reviewer (Auto Council)',
    label_mr: '?????? ??????? (?????????? ???????)',
    profile: { id: 'usr-ssc-301', keycloak_sub: 'sub-ssc-301', email: 'demo.ssc@example.gov.in', full_name: 'Reviewer A. Demo', roles: ['SSC_REVIEWER'], scopes: { sector_ids: [3] } }
  },
  ADMIN: {
    role: 'ADMIN',
    label_en: 'State Data Steward (Admin)',
    label_mr: '????? ???? ?????????? (???????)',
    profile: { id: 'usr-adm-999', keycloak_sub: 'sub-adm-999', email: 'demo.adm@example.gov.in', full_name: 'Admin A. Demo', roles: ['ADMIN'], scopes: {} }
  },
  CANDIDATE: {
    role: 'CANDIDATE',
    label_en: 'Candidate (Prospective Trainee)',
    label_mr: '?????????????? / ??????????',
    profile: { id: 'usr-cand-777', keycloak_sub: 'sub-cand-777', email: 'demo.cand@example.gov.in', full_name: 'Candidate A. Demo', roles: ['CANDIDATE'], scopes: { district_id: 20, district_name: 'Nashik (?????)' } }
  }
};

interface AuthState {
  currentPersona: Persona;
  isAuthenticated: boolean;
  setPersona: (role: UserRole) => void;
  switchPersona: (role: UserRole) => void;
  switchDistrict: (districtId: number, districtName: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentPersona: PRESET_PERSONAS.POLICY_MAKER,
      isAuthenticated: true,
      setPersona: (role) => set({ currentPersona: PRESET_PERSONAS[role], isAuthenticated: true }),
      switchPersona: (role) => set({ currentPersona: PRESET_PERSONAS[role], isAuthenticated: true }),
      switchDistrict: (districtId, districtName) => set((state) => ({
        currentPersona: { ...state.currentPersona, profile: { ...state.currentPersona.profile, scopes: { ...state.currentPersona.profile.scopes, district_id: districtId, district_name: districtName } } }
      })),
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: 'mahaskills.persona',
      storage: createJSONStorage(() => {
        try {
          return sessionStorage;
        } catch {
          return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
        }
      }),
    }
  )
);
