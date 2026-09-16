/**
 * MahaSkills — Employer Portal Synthetic Fixtures
 * Problem Statement ID: 26134
 *
 * Synthetic mock data for industrial skill needs, pulse surveys, syllabus reviews,
 * and valid/invalid GSTIN specimens.
 * In compliance with DPDP Act 2023: no personal identity data or candidate identifiers.
 */

import type { SkillNeed, Survey, CurriculumReview } from './model';

export const SAMPLE_DATA = true;

export const MOCK_SKILL_NEEDS: SkillNeed[] = [
  {
    id: 'sn_pune_ev_001',
    quarter: '2026-Q3',
    jobRole: 'EV Powertrain Assembly Technician',
    skills: ['High Voltage Battery Safety', 'CAN Bus Diagnostics', 'Wire Harness Routing', 'DC Fast Charging Protocol'],
    headcount: 120,
    district: 'Pune',
    districtId: 14,
    nsqfLevel: 4,
    urgency: 'IMMEDIATE',
    createdAt: '2026-08-10T09:30:00Z',
  },
  {
    id: 'sn_aurangabad_cnc_002',
    quarter: '2026-Q4',
    jobRole: 'CNC 5-Axis Precision Milling Operator',
    skills: ['G-Code Programming', 'Fanuc Controller Operation', 'Geometric Dimensioning & Tolerancing (GD&T)', 'Carbide Tool Setting'],
    headcount: 85,
    district: 'Chhatrapati Sambhajinagar',
    districtId: 19,
    nsqfLevel: 5,
    urgency: 'QUARTERLY',
    createdAt: '2026-08-12T14:15:00Z',
  },
  {
    id: 'sn_nagpur_solar_003',
    quarter: '2026-Q4',
    jobRole: 'Rooftop Solar & Micro-Inverter Grid Integrator',
    skills: ['PV String Sizing', 'Microinverter Commissioning', 'Earthing & Lightning Arrestor Installation', 'Net Metering Compliance'],
    headcount: 60,
    district: 'Nagpur',
    districtId: 9,
    nsqfLevel: 4,
    urgency: 'QUARTERLY',
    createdAt: '2026-08-15T11:00:00Z',
  },
  {
    id: 'sn_nashik_agri_004',
    quarter: '2027-Q1',
    jobRole: 'Smart Cold Chain Refrigeration Technician',
    skills: ['R-32/R-410A Eco Refrigerant Recovery', 'IoT Temperature Loggers', 'Cold Room Humidity Management', 'Condenser Coil Servicing'],
    headcount: 45,
    district: 'Nashik',
    districtId: 20,
    nsqfLevel: 4,
    urgency: 'FUTURE',
    createdAt: '2026-08-18T16:45:00Z',
  },
];

export const MOCK_SURVEYS: Survey[] = [
  {
    id: 'srv_ev_pulse_2026_q3',
    title: 'Rapid Industry Pulse: EV Powertrain & Battery Tech Skills',
    titleMr: 'त्वरित उद्योग नाडी: ईव्ही पॉवरट्रेन आणि बॅटरी तंत्रज्ञान कौशल्ये',
    titleHi: 'त्वरित उद्योग पल्स: ईवी पावरट्रेन और बैटरी तकनीक कौशल',
    description: '2-minute survey on emergent high-voltage safety and tooling requirements in western Maharashtra clusters.',
    sectorId: 3,
    sectorName: 'Automotive & Electric Mobility',
    estimatedMinutes: 2,
    opensAt: '2026-08-01T00:00:00Z',
    closesAt: '2026-09-30T23:59:59Z',
    questions: [
      {
        id: 'q1_hv_readiness',
        sequence: 1,
        prompt: 'How critical is certified high-voltage (>60V DC) safety training for entry-level floor hires?',
        promptMr: 'प्रवेश-स्तरीय कर्मचाऱ्यांसाठी प्रमाणित हाय-व्होल्टेज (>६०V DC) सुरक्षा प्रशिक्षण किती महत्त्वपूर्ण आहे?',
        promptHi: 'प्रवेश-स्तरीय कर्मचारियों के लिए प्रमाणित हाई-वोल्टेज (>60V DC) सुरक्षा प्रशिक्षण कितना महत्वपूर्ण है?',
        type: 'rating',
        minRating: 1,
        maxRating: 5,
        required: true,
      },
      {
        id: 'q2_diagnostic_tooling',
        sequence: 2,
        prompt: 'Which diagnostic communication bus protocol is most utilized in your plant workshops?',
        promptMr: 'तुमच्या वर्कशॉप्समध्ये कोणती डायग्नोस्टिक कम्युनिकेशन प्रोटोकॉल सर्वाधिक वापरली जाते?',
        promptHi: 'आपकी वर्कशॉप्स में कौन सा डायग्नोस्टिक संचार प्रोटोकॉल सबसे अधिक उपयोग किया जाता है?',
        type: 'single',
        options: [
          { label: 'CAN Bus 2.0B / CAN-FD', value: 'can_bus' },
          { label: 'Ethernet BroadR-Reach', value: 'broadr_reach' },
          { label: 'LIN Bus', value: 'lin_bus' },
          { label: 'Proprietary OEM Protocol', value: 'proprietary' },
        ],
        required: true,
      },
      {
        id: 'q3_top_skill_deficits',
        sequence: 3,
        prompt: 'Select the top skill gaps observed in fresh vocational (ITI) apprentices:',
        promptMr: 'नवीन आयटीआय प्रशिक्षणार्थींमध्ये आढळणाऱ्या प्रमुख कौशल्य त्रुटी निवडा:',
        promptHi: 'नए आईटीआई प्रशिक्षुओं में देखी जाने वाली शीर्ष कौशल कमियों का चयन करें:',
        type: 'multi',
        options: [
          { label: 'High-voltage insulation testing', value: 'hv_insulation' },
          { label: 'Wiring harness pinning and crimping', value: 'crimping' },
          { label: 'Battery thermal management troubleshooting', value: 'thermal_mgmt' },
          { label: 'Digital multimeter & oscilloscope fluency', value: 'multimeter_scope' },
        ],
        required: true,
      },
      {
        id: 'q4_apprentice_willingness',
        sequence: 4,
        prompt: 'How likely is your firm to host dual-system ITI apprenticeships in the upcoming intake cycle?',
        promptMr: 'येत्या शैक्षणिक सत्रात दुहेरी-प्रणाली आयटीआय प्रशिक्षणार्थींना सामावून घेण्याची तुमची तयारी किती आहे?',
        promptHi: 'आगामी चक्र में दोहरी-प्रणाली आईटीआई प्रशिक्षुओं को शामिल करने की आपकी तैयारी कितनी है?',
        type: 'rating',
        minRating: 1,
        maxRating: 5,
        required: true,
      },
    ],
  },
  {
    id: 'srv_cnc_robotics_2026_q3',
    title: 'Precision Tooling & CNC Automation Pulse',
    titleMr: 'प्रिसिजन टूलिंग आणि सीएनसी ऑटोमेशन नाडी सर्वेक्षण',
    titleHi: 'प्रिसिजन टूलिंग और सीएनसी ऑटोमेशन पल्स सर्वेक्षण',
    description: 'Assessing the shift towards 5-axis machining and robotic deburring in industrial belts.',
    sectorId: 5,
    sectorName: 'Capital Goods & Industrial Automation',
    estimatedMinutes: 2,
    opensAt: '2026-08-15T00:00:00Z',
    closesAt: '2026-10-15T23:59:59Z',
    questions: [
      {
        id: 'q1_five_axis_demand',
        sequence: 1,
        prompt: 'Rate the urgency for 5-axis CNC operator talent over the next 12 months:',
        promptMr: 'पुढील १२ महिन्यांत ५-अॅक्सिस सीएनसी ऑपरेटर कुशल मनुष्यबळाची निकड नोंदवा:',
        promptHi: 'अगले 12 महीनों में 5-एक्सिस सीएनसी ऑपरेटर कुशल जनशक्ति की आवश्यकता का मूल्यांकन करें:',
        type: 'rating',
        minRating: 1,
        maxRating: 5,
        required: true,
      },
      {
        id: 'q2_controller_type',
        sequence: 2,
        prompt: 'Primary machine controller platform deployed in production lines:',
        promptMr: 'उत्पादन युनिटमध्ये मुख्यत्वे वापरले जाणारे मशीन कंट्रोलर प्लॅटफॉर्म:',
        promptHi: 'उत्पादन यूनिट में मुख्य रूप से उपयोग किया जाने वाला मशीन कंट्रोलर प्लेटफॉर्म:',
        type: 'single',
        options: [
          { label: 'Fanuc 0i-MF / 31i', value: 'fanuc' },
          { label: 'Siemens Sinumerik 828D / 840D', value: 'siemens' },
          { label: 'Heidenhain TNC 640', value: 'heidenhain' },
          { label: 'Mitsubishi M800/M80', value: 'mitsubishi' },
        ],
        required: true,
      },
      {
        id: 'q3_equipment_sharing',
        sequence: 3,
        prompt: 'Are you open to sharing CNC equipment time for advanced ITI instructor practicals?',
        promptMr: 'आयटीआय प्रशिक्षकांच्या प्रगत प्रात्यक्षिकांसाठी तुमचे सीएनसी मशिन शेअर करण्यास तयार आहात का?',
        promptHi: 'क्या आप आईटीआई प्रशिक्षकों के उन्नत व्यावहारिक प्रशिक्षण के लिए अपनी सीएनसी मशीन साझा करने को तैयार हैं?',
        type: 'single',
        options: [
          { label: 'Yes, during weekend shifts', value: 'yes_weekends' },
          { label: 'Yes, sponsored CSR facility hours', value: 'yes_csr' },
          { label: 'Under evaluation with management', value: 'evaluating' },
          { label: 'Not feasible currently', value: 'no' },
        ],
        required: true,
      },
    ],
  },
];

export const MOCK_CURRICULUM_REVIEWS: CurriculumReview[] = [
  {
    id: 'rev_auto_ev_01',
    draftSyllabusId: 'syl_draft_ev_mech_v3',
    draftTitle: 'Electric Vehicle Service Specialist (NSQF Level 4 - Trade Syllabus 2026)',
    courseCode: 'MECH-EV-2026',
    verdict: 'ENDORSED',
    comment: 'Curriculum matches Tier-1 supplier expectations. Battery isolation safety module is well structured.',
    reviewerOrganization: 'Western Maharashtra Auto Component Consortium',
    submittedAt: '2026-08-05T10:14:00Z',
  },
  {
    id: 'rev_solar_pv_02',
    draftSyllabusId: 'syl_draft_solar_grid_v2',
    draftTitle: 'Solar Photovoltaic Microgrid Installer (NSQF Level 4)',
    courseCode: 'ELEC-PV-2026',
    verdict: 'CHANGES_SUGGESTED',
    comment: 'Requires dedicated practical lab hours for hybrid inverter configuration and bidirectional net-meter testing.',
    reviewerOrganization: 'Vidarbha Renewable Energy Developers Association',
    submittedAt: '2026-08-11T16:20:00Z',
  },
];

export const MOCK_GSTIN_SAMPLES = {
  valid: [
    { gstin: '27AAPFU0939F1ZV', state: 'Maharashtra', code: '27', entity: 'Private Company' },
    { gstin: '27AAACT2727Q1ZW', state: 'Maharashtra', code: '27', entity: 'Enterprise Corp' },
    { gstin: '07AAAAA0000A1Z4', state: 'Delhi', code: '07', entity: 'State Office' },
    { gstin: '24AAACW3000P1ZH', state: 'Gujarat', code: '24', entity: 'Manufacturing Ltd' },
    { gstin: '29AABCT1332L1ZA', state: 'Karnataka', code: '29', entity: 'Tech Solutions' },
  ],
  invalid: [
    { gstin: '', reason: 'empty' },
    { gstin: '27AAPFU0939F1Z', reason: 'too_short' },
    { gstin: '27AAPFU0939F1ZVA', reason: 'too_long' },
    { gstin: '00AAPFU0939F1ZV', reason: 'invalid_state_code_00' },
    { gstin: '39AAPFU0939F1ZV', reason: 'invalid_state_code_39' },
    { gstin: '27123450939F1ZV', reason: 'invalid_pan_format' },
    { gstin: '27AAPFU0939F1AV', reason: 'fourteenth_char_not_z' },
    { gstin: '27AAPFU0939F1Z0', reason: 'checksum_mismatch' },
  ],
};
