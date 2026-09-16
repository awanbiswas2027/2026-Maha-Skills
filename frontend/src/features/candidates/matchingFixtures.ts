import { CourseItem } from '../../types/api';
import { QualificationLevel, QuizLanguage } from './matching';

export interface CourseAdapterData {
  courseCode: string;
  minimumQualification: QualificationLevel;
  taughtSkills: string[];
  mediums: QuizLanguage[];
  sectorId: string;
  sampleSize: number;
  batchYear: string;
  hiringEmployersCountByDistrict?: Record<string, number>;
}

export const DISTRICT_ID_TO_NAME: Record<number, string> = {
  1: 'Mumbai City',
  2: 'Mumbai Suburban',
  3: 'Thane',
  4: 'Palghar',
  5: 'Raigad',
  6: 'Ratnagiri',
  7: 'Sindhudurg',
  8: 'Nashik',
  9: 'Dhule',
  10: 'Nandurbar',
  11: 'Jalgaon',
  12: 'Ahmednagar',
  13: 'Solapur',
  14: 'Pune',
  15: 'Satara',
  16: 'Kolhapur',
  17: 'Sangli',
  18: 'Chh. Sambhajinagar',
  19: 'Jalna',
  20: 'Parbhani',
  21: 'Hingoli',
  22: 'Beed',
  23: 'Nanded',
  24: 'Osmanabad',
  25: 'Latur',
  26: 'Amravati',
  27: 'Buldhana',
  28: 'Akola',
  29: 'Washim',
  30: 'Yavatmal',
  31: 'Nagpur',
  32: 'Wardha',
  33: 'Bhandara',
  34: 'Gondia',
  35: 'Chandrapur',
  36: 'Gadchiroli',
};

export const DISTRICT_NAME_TO_ID: Record<string, number> = Object.entries(
  DISTRICT_ID_TO_NAME
).reduce<Record<string, number>>((acc, [idStr, name]) => {
  acc[name] = Number(idStr);
  return acc;
}, {});

/**
 * Course adapter metadata providing missing fields not yet present on CourseItem:
 * - minimumQualification (aligned with 6 qualification levels)
 * - taughtSkills (course_skill breakdown)
 * - mediums (instruction languages supported)
 * - sectorId (normalized sector identifier)
 * - sampleSize (outcome n)
 * - batchYear (reporting batch period)
 * - hiringEmployersCountByDistrict (active hiring employers)
 */
export const COURSE_ADAPTER_MAP: Record<string, CourseAdapterData> = {
  'ELE-001': {
    courseCode: 'ELE-001',
    minimumQualification: 'PASS_10',
    taughtSkills: [
      'Single and Three Phase Wiring',
      'Industrial Motor Controls',
      'Safety Switchgear',
      'Renewable Power Integration',
    ],
    mediums: ['mr', 'hi', 'en'],
    sectorId: 'energy',
    sampleSize: 142,
    batchYear: '2024-25',
    hiringEmployersCountByDistrict: {
      Pune: 22,
      Nashik: 14,
      'Chh. Sambhajinagar': 11,
      Nagpur: 16,
    },
  },
  'AUT-003': {
    courseCode: 'AUT-003',
    minimumQualification: 'PASS_10',
    taughtSkills: [
      'EV Drivetrains',
      'High-Voltage Battery Pack Assembly',
      'Thermal Management',
      'BMS Recalibration',
    ],
    mediums: ['mr', 'hi', 'en'],
    sectorId: 'automotive',
    sampleSize: 85,
    batchYear: '2024-25',
    hiringEmployersCountByDistrict: {
      Pune: 35,
      Nashik: 18,
      Nagpur: 12,
      'Chh. Sambhajinagar': 15,
    },
  },
  'PRC-002': {
    courseCode: 'PRC-002',
    minimumQualification: 'PASS_10',
    taughtSkills: [
      'CNC Turning',
      'Multi-Axis Milling',
      'G-Code Programming',
      'Tolerance Inspection',
    ],
    mediums: ['mr', 'hi', 'en'],
    sectorId: 'automotive',
    sampleSize: 96,
    batchYear: '2024-25',
    hiringEmployersCountByDistrict: {
      Pune: 28,
      Nashik: 19,
      Kolhapur: 12,
      Thane: 14,
    },
  },
  'GRN-004': {
    courseCode: 'GRN-004',
    minimumQualification: 'PASS_10',
    taughtSkills: [
      'Solar PV Array Installation',
      'Grid Synchronization',
      'Inverter Wiring',
      'Solar Routine Maintenance',
    ],
    mediums: ['mr', 'hi', 'en'],
    sectorId: 'energy',
    sampleSize: 64,
    batchYear: '2024-25',
    hiringEmployersCountByDistrict: {
      Solapur: 18,
      Jalgaon: 14,
      Ahmednagar: 12,
      Nagpur: 10,
      Pune: 15,
    },
  },
  'IT-005': {
    courseCode: 'IT-005',
    minimumQualification: 'PASS_10',
    taughtSkills: [
      'Database Operations',
      'Office Automation Suites',
      'Basic Python Scripting',
      'Cybersecurity Fundamentals',
    ],
    mediums: ['mr', 'hi', 'en'],
    sectorId: 'it',
    sampleSize: 110,
    batchYear: '2024-25',
    hiringEmployersCountByDistrict: {
      Pune: 45,
      'Mumbai City': 62,
      'Mumbai Suburban': 58,
      Nagpur: 21,
    },
  },
  'WLD-006': {
    courseCode: 'WLD-006',
    minimumQualification: 'PASS_8',
    taughtSkills: [
      'Gas Metal Arc Welding',
      'Tungsten Inert Gas Welding',
      'Pipe Welding',
      'Robotic Welding Cells',
    ],
    mediums: ['mr', 'hi', 'en'],
    sectorId: 'manufacturing',
    sampleSize: 88,
    batchYear: '2024-25',
    hiringEmployersCountByDistrict: {
      Pune: 30,
      Thane: 24,
      Kolhapur: 18,
      Nagpur: 14,
    },
  },
  'AGR-007': {
    courseCode: 'AGR-007',
    minimumQualification: 'PASS_10',
    taughtSkills: [
      'Refrigerated Transport Maintenance',
      'Commercial Chilling Equipment',
      'Post-Harvest Packaging Lines',
      'Food Safety Assurance',
    ],
    mediums: ['mr', 'hi', 'en'],
    sectorId: 'agriculture',
    sampleSize: 24, // Intentionally < 30 to support limitedData test cases
    batchYear: '2024-25',
    hiringEmployersCountByDistrict: {
      Nashik: 12,
      Sangli: 8,
      Kolhapur: 7,
      Jalgaon: 6,
    },
  },
  'ELC-008': {
    courseCode: 'ELC-008',
    minimumQualification: 'PASS_10',
    taughtSkills: [
      'SMD Soldering and Desoldering',
      'Microcontroller Programming',
      'Industrial Sensor Calibration',
      'IoT Gateway Configuration',
    ],
    mediums: ['mr', 'hi', 'en'],
    sectorId: 'electronics',
    sampleSize: 52,
    batchYear: '2024-25',
    hiringEmployersCountByDistrict: {
      Pune: 18,
      Thane: 15,
      Nashik: 10,
      'Chh. Sambhajinagar': 9,
    },
  },
};

/**
 * Helper to produce sample mock courses for testing.
 */
export function createMockCourse(overrides: Partial<CourseItem> = {}): CourseItem {
  return {
    id: overrides.id || 'mock-course-001',
    course_code: overrides.course_code || 'MOCK-001',
    title_en: overrides.title_en || 'Mock Vocational Trade',
    title_mr: overrides.title_mr || 'प्रायोगिक व्यवसाय',
    title_hi: overrides.title_hi || 'प्रायोगिक ट्रेड',
    sector_name: overrides.sector_name || 'Engineering & Manufacturing',
    sector_name_mr: overrides.sector_name_mr || 'अभियांत्रिकी व उत्पादन',
    sector_name_hi: overrides.sector_name_hi || 'इंजीनियरिंग एवं विनिर्माण',
    duration_months: overrides.duration_months ?? 12,
    nsqf_level: overrides.nsqf_level ?? 4,
    verified_placement_rate: overrides.verified_placement_rate ?? 75,
    median_salary_inr: overrides.median_salary_inr ?? 22000,
    time_to_hire_days: overrides.time_to_hire_days ?? 35,
    is_high_demand: overrides.is_high_demand ?? true,
    is_scholarship_eligible: overrides.is_scholarship_eligible ?? true,
    iti_count: overrides.iti_count ?? 120,
    annual_seats: overrides.annual_seats ?? 4500,
    districts: overrides.districts || ['Pune', 'Nashik', 'Nagpur'],
    description_en: overrides.description_en || 'Hands-on vocational trade training.',
    description_mr: overrides.description_mr || 'व्यावहारिक व्यावसायिक प्रशिक्षण.',
    description_hi: overrides.description_hi || 'व्यावहारिक व्यावसायिक प्रशिक्षण।',
    minimum_education: overrides.minimum_education || '10TH',
  };
}
