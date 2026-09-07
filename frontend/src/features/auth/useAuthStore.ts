import { create } from 'zustand';
import { UserProfile, UserRole } from '../../types';

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
    label_mr: 'धोरण निर्माता (कौशल्य विभाग)',
    profile: {
      id: 'usr-pm-001',
      keycloak_sub: 'sub-pm-001',
      email: 'secretary.dseei@maharashtra.gov.in',
      full_name: 'Dr. Suhas Diwase, IAS',
      roles: ['POLICY_MAKER'],
      scopes: {
        district_id: undefined,
        district_name: 'All 36 Districts (Statewide)',
      },
    },
  },
  DISTRICT_OFFICER: {
    role: 'DISTRICT_OFFICER',
    label_en: 'District Skill Officer (Pune)',
    label_mr: 'जिल्हा कौशल्य अधिकारी (पुणे)',
    profile: {
      id: 'usr-do-014',
      keycloak_sub: 'sub-do-014',
      email: 'dpo.pune@gov.in',
      full_name: 'Dr. Rajesh Patil',
      roles: ['DISTRICT_OFFICER'],
      scopes: {
        district_id: 14,
        district_name: 'Pune (पुणे)',
        division: 'Pune',
      },
    },
  },
  ITI_PRINCIPAL: {
    role: 'ITI_PRINCIPAL',
    label_en: 'Principal (Govt ITI Aundh)',
    label_mr: 'प्राचार्य (शासकीय आयटीआय औंध)',
    profile: {
      id: 'usr-iti-101',
      keycloak_sub: 'sub-iti-101',
      email: 'principal.aundh@dvet.gov.in',
      full_name: 'Prof. S. N. Shinde',
      roles: ['ITI_PRINCIPAL'],
      scopes: {
        district_id: 14,
        district_name: 'Pune (पुणे)',
        institute_id: 'iti-pune-aundh-01',
      },
    },
  },
  EMPLOYER: {
    role: 'EMPLOYER',
    label_en: 'Employer HR (Tata Motors)',
    label_mr: 'उद्योग भागीदार (टाटा मोटर्स)',
    profile: {
      id: 'usr-emp-501',
      keycloak_sub: 'sub-emp-501',
      email: 'anand.deshmukh@tatamotors.com',
      full_name: 'Anand Deshmukh (VP Talent)',
      roles: ['EMPLOYER'],
      scopes: {
        sector_ids: [3], // Automotive
      },
    },
  },
  SSC_REVIEWER: {
    role: 'SSC_REVIEWER',
    label_en: 'SSC Reviewer (Auto Council)',
    label_mr: 'एसएससी समीक्षक (ऑटोमोटिव्ह कौन्सिल)',
    profile: {
      id: 'usr-ssc-301',
      keycloak_sub: 'sub-ssc-301',
      email: 'meera.kulkarni@asdc.org.in',
      full_name: 'Meera Kulkarni (ASDC Lead)',
      roles: ['SSC_REVIEWER'],
      scopes: {
        sector_ids: [3],
      },
    },
  },
  ADMIN: {
    role: 'ADMIN',
    label_en: 'State Data Steward (Admin)',
    label_mr: 'राज्य डेटा व्यवस्थापक (प्रशासक)',
    profile: {
      id: 'usr-adm-999',
      keycloak_sub: 'sub-adm-999',
      email: 'admin.data@mahaskills.gov.in',
      full_name: 'Kavita Joshi',
      roles: ['ADMIN'],
      scopes: {},
    },
  },
  CANDIDATE: {
    role: 'CANDIDATE',
    label_en: 'Candidate (Prospective Trainee)',
    label_mr: 'प्रशिक्षणार्थी / विद्यार्थी',
    profile: {
      id: 'usr-cand-777',
      keycloak_sub: 'sub-cand-777',
      email: 'rahul.jadhav@gmail.com',
      full_name: 'Rahul Jadhav',
      roles: ['CANDIDATE'],
      scopes: {
        district_id: 20,
        district_name: 'Nashik (नाशिक)',
      },
    },
  },
};

interface AuthState {
  currentPersona: Persona;
  isAuthenticated: boolean;
  setPersona: (role: UserRole) => void;
  switchPersona: (role: UserRole) => void;
  switchDistrict: (districtId: number, districtName: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentPersona: PRESET_PERSONAS.POLICY_MAKER,
  isAuthenticated: true,
  setPersona: (role: UserRole) =>
    set({
      currentPersona: PRESET_PERSONAS[role],
      isAuthenticated: true,
    }),
  switchPersona: (role: UserRole) =>
    set({
      currentPersona: PRESET_PERSONAS[role],
      isAuthenticated: true,
    }),
  switchDistrict: (districtId: number, districtName: string) =>
    set((state) => ({
      currentPersona: {
        ...state.currentPersona,
        profile: {
          ...state.currentPersona.profile,
          scopes: {
            ...state.currentPersona.profile.scopes,
            district_id: districtId,
            district_name: districtName,
          },
        },
      },
    })),
  logout: () => set({ isAuthenticated: false }),
}));
