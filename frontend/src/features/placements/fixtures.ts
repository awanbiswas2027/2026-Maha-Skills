/**
 * Placement Return Fixtures & Deterministic CSV Generators
 * Provides seeded mock datasets, sanctioned courses, and historical batch records.
 */

import { CANONICAL_PLACEMENT_HEADERS, PlacementBatchErrorItem, PlacementBatchRecord } from './model';

export const SAMPLE_DATA = true;

/**
 * Sanctioned vocational course codes for Pune Model ITI (ITI-PUNE-01).
 */
export const SANCTIONED_COURSE_CODES: readonly string[] = [
  'CTS-ELE-01', // Electrician
  'CTS-FIT-01', // Fitter
  'CTS-WLD-01', // Welder
  'CTS-COPA-01', // Computer Operator and Programming Assistant
  'CTS-MRAC-01', // Mechanic Refrigeration and Air Conditioning
  'CTS-DM-01', // Draughtsman Mechanical
  'CTS-EVT-01', // Electric Vehicle Technician
  'CTS-ROB-01', // Industrial Robotics Specialist
];

const SAMPLE_EMPLOYERS = [
  'Tata Motors Ltd',
  'Bajaj Auto Ltd',
  'Bharat Forge Ltd',
  'Thermax Ltd',
  'Kirloskar Brothers',
  'Mahindra & Mahindra',
  'L&T Heavy Engineering',
  'Cummins India Ltd',
];

const SAMPLE_JOB_ROLES = [
  'Junior Electrical Technician',
  'Assembly Line Fitter',
  'MIG Welder Specialist',
  'Data Entry Operator',
  'HVAC Maintenance Associate',
  'CAD Drafting Assistant',
  'EV Battery Assembly Operator',
  'Automation Support Technician',
];

/**
 * Deterministic PRNG using Linear Congruential Generator (LCG).
 */
function createLcg(seed = 123456789) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Generate a deterministic 64-character hex candidate hash.
 */
function pseudoHash(index: number): string {
  const hexChars = '0123456789abcdef';
  let hash = '';
  let val = (index * 2654435761) >>> 0;
  for (let i = 0; i < 64; i++) {
    val = (Math.imul(1103515245, val) + 12345) >>> 0;
    hash += hexChars[val % 16];
  }
  return hash;
}

export interface GenerateValidCsvOptions {
  rowCount?: number;
  batchYear?: number;
  seed?: number;
}

/**
 * Generates a valid CSV string adhering strictly to RFC 4180 and schema constraints.
 */
export function generateValidCsv(options: GenerateValidCsvOptions = {}): string {
  const { rowCount = 20, batchYear = 2026, seed = 42 } = options;
  const rand = createLcg(seed);

  const lines: string[] = [CANONICAL_PLACEMENT_HEADERS.join(',')];

  for (let i = 0; i < rowCount; i++) {
    const candidateHash = pseudoHash(i + 1);
    const courseCode = SANCTIONED_COURSE_CODES[Math.floor(rand() * SANCTIONED_COURSE_CODES.length)];
    const isPlaced = rand() > 0.25; // 75% placed
    const placedFlag = isPlaced ? 'Y' : 'N';

    let employer = '';
    let jobRole = '';
    let salary = '';
    let months = '';

    if (isPlaced) {
      employer = SAMPLE_EMPLOYERS[Math.floor(rand() * SAMPLE_EMPLOYERS.length)];
      jobRole = SAMPLE_JOB_ROLES[Math.floor(rand() * SAMPLE_JOB_ROLES.length)];
      const salaryInt = Math.floor(rand() * 40000) + 15000; // ₹15,000 to ₹55,000
      salary = `${salaryInt}.00`;
      months = String(Math.floor(rand() * 12)); // 0 to 11 months
    }

    lines.push(
      [candidateHash, courseCode, String(batchYear), placedFlag, employer, jobRole, salary, months].join(
        ','
      )
    );
  }

  return lines.join('\r\n');
}

export interface GenerateInvalidCsvOptions {
  errorType:
    | 'MALFORMED_HEADER'
    | 'INVALID_CANDIDATE_ID'
    | 'UNSANCTIONED_COURSE'
    | 'OUT_OF_RANGE_BATCH_YEAR'
    | 'INVALID_BOOLEAN_FLAG'
    | 'MISSING_EMPLOYER'
    | 'MISSING_JOB_ROLE'
    | 'SALARY_OUT_OF_BOUNDS'
    | 'INVALID_MONTHS'
    | 'MULTIPLE_ERRORS'
    | 'EMPTY_ROWS';
}

/**
 * Generates test CSV strings with intentional schema errors for validation tests.
 */
export function generateInvalidCsv(options: GenerateInvalidCsvOptions): string {
  const { errorType } = options;

  if (errorType === 'EMPTY_ROWS') {
    return CANONICAL_PLACEMENT_HEADERS.join(',') + '\r\n';
  }

  if (errorType === 'MALFORMED_HEADER') {
    return 'student_id,course,year,status,company,role,pay\r\nvalid_hash_1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab,CTS-ELE-01,2026,Y,Tata,Tech,20000,2';
  }

  const baseHeaders = CANONICAL_PLACEMENT_HEADERS.join(',');
  const validHash = pseudoHash(1);

  switch (errorType) {
    case 'INVALID_CANDIDATE_ID':
      return `${baseHeaders}\r\nxyz,CTS-ELE-01,2026,Y,Tata Motors Ltd,Junior Electrical Technician,22000.00,2`;

    case 'UNSANCTIONED_COURSE':
      return `${baseHeaders}\r\n${validHash},CTS-INVALID-99,2026,Y,Tata Motors Ltd,Junior Electrical Technician,22000.00,2`;

    case 'OUT_OF_RANGE_BATCH_YEAR':
      return `${baseHeaders}\r\n${validHash},CTS-ELE-01,2018,Y,Tata Motors Ltd,Junior Electrical Technician,22000.00,2`;

    case 'INVALID_BOOLEAN_FLAG':
      return `${baseHeaders}\r\n${validHash},CTS-ELE-01,2026,YES,Tata Motors Ltd,Junior Electrical Technician,22000.00,2`;

    case 'MISSING_EMPLOYER':
      return `${baseHeaders}\r\n${validHash},CTS-ELE-01,2026,Y,,Junior Electrical Technician,22000.00,2`;

    case 'MISSING_JOB_ROLE':
      return `${baseHeaders}\r\n${validHash},CTS-ELE-01,2026,Y,Tata Motors Ltd,,22000.00,2`;

    case 'SALARY_OUT_OF_BOUNDS':
      return `${baseHeaders}\r\n${validHash},CTS-ELE-01,2026,Y,Tata Motors Ltd,Junior Electrical Technician,5000.00,2\r\n${validHash},CTS-ELE-01,2026,Y,Tata Motors Ltd,Junior Electrical Technician,350000.00,2`;

    case 'INVALID_MONTHS':
      return `${baseHeaders}\r\n${validHash},CTS-ELE-01,2026,Y,Tata Motors Ltd,Junior Electrical Technician,22000.00,-5\r\n${validHash},CTS-ELE-01,2026,Y,Tata Motors Ltd,Junior Electrical Technician,22000.00,48`;

    case 'MULTIPLE_ERRORS':
      return `${baseHeaders}\r\nshort,CTS-FAKE-99,1999,MAYBE,,,4000.00,-1`;

    default:
      return `${baseHeaders}\r\n`;
  }
}

/**
 * Three historical batch records demonstrating all BE §H.3 batch statuses.
 */
export const HISTORICAL_BATCHES: PlacementBatchRecord[] = [
  {
    batch_id: '9b1d84a2-1111-4001-8001-000000000001',
    institute_id: 'ITI-PUNE-01',
    academic_year: '2025-2026',
    batch_month: 7,
    status: 'LOADED',
    row_count: 240,
    accepted_count: 240,
    rejected_count: 0,
    error_csv_url: null,
    created_at: '2026-07-04T10:15:00.000Z',
    updated_at: '2026-07-04T10:16:30.000Z',
  },
  {
    batch_id: '9b1d84a2-2222-4002-8002-000000000002',
    institute_id: 'ITI-PUNE-01',
    academic_year: '2025-2026',
    batch_month: 8,
    status: 'PARTIALLY_FAILED',
    row_count: 156,
    accepted_count: 151,
    rejected_count: 5,
    error_csv_url: '/api/v1/ingestion/placements/uploads/9b1d84a2-2222-4002-8002-000000000002/errors.csv',
    created_at: '2026-08-03T14:22:00.000Z',
    updated_at: '2026-08-03T14:23:45.000Z',
  },
  {
    batch_id: '9b1d84a2-3333-4003-8003-000000000003',
    institute_id: 'ITI-PUNE-01',
    academic_year: '2026-2027',
    batch_month: 9,
    status: 'FAILED',
    row_count: 85,
    accepted_count: 0,
    rejected_count: 85,
    error_csv_url: '/api/v1/ingestion/placements/uploads/9b1d84a2-3333-4003-8003-000000000003/errors.csv',
    created_at: '2026-09-02T09:05:00.000Z',
    updated_at: '2026-09-02T09:05:40.000Z',
  },
];

/**
 * Row rejection items for historical batch 2 (PARTIALLY_FAILED).
 */
export const HISTORICAL_BATCH_ERRORS: Record<string, PlacementBatchErrorItem[]> = {
  '9b1d84a2-2222-4002-8002-000000000002': [
    {
      row_number: 14,
      column_name: 'course_code',
      rejected_value: 'CTS-AERO-01',
      error_code: 'PLA_UNSANCTIONED_COURSE',
      error_message: 'The specified course code is not sanctioned for this institute.',
    },
    {
      row_number: 42,
      column_name: 'monthly_salary',
      rejected_value: '5000.00',
      error_code: 'PLA_SALARY_OUT_OF_BOUNDS',
      error_message: 'Monthly salary must be between ₹8,000 and ₹2,00,000.',
    },
    {
      row_number: 67,
      column_name: 'candidate_id',
      rejected_value: '[hidden]',
      error_code: 'PLA_INVALID_CANDIDATE_ID',
      error_message: 'Candidate identifier is missing or malformed.',
    },
    {
      row_number: 99,
      column_name: 'employer_name',
      rejected_value: '',
      error_code: 'PLA_MISSING_EMPLOYER_NAME',
      error_message: 'Employer name is mandatory for placed candidates.',
    },
    {
      row_number: 112,
      column_name: 'months_to_placement',
      rejected_value: '-1',
      error_code: 'PLA_INVALID_MONTHS_TO_HIRE',
      error_message: 'Months to placement must be an integer between 0 and 36.',
    },
  ],
};
