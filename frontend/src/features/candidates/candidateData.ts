import { CourseItem, PathwayQuizQuestion, PathwayQuizAnswers, PathwayRecommendation } from '../../types/api';

export const MOCK_COURSES: CourseItem[] = [
  {
    id: 'course-001',
    course_code: 'ELE-001',
    title_en: 'Electrician (Commercial & Industrial)',
    title_mr: 'विद्युत तंत्रज्ञ (व्यावसायिक व औद्योगिक)',
    title_hi: 'इलेक्ट्रीशियन (व्यावसायिक एवं औद्योगिक)',
    sector_name: 'Power & Green Energy',
    sector_name_mr: 'ऊर्जा आणि हरित ऊर्जा',
    sector_name_hi: 'ऊर्जा एवं हरित ऊर्जा',
    duration_months: 24,
    nsqf_level: 4,
    verified_placement_rate: 74,
    median_salary_inr: 22500,
    time_to_hire_days: 38,
    is_high_demand: true,
    is_scholarship_eligible: true,
    iti_count: 320,
    annual_seats: 12800,
    districts: ['Pune', 'Nashik', 'Chh. Sambhajinagar', 'Nagpur', 'Kolhapur', 'Thane', 'Solapur'],
    description_en: 'Comprehensive hands-on training in single/three-phase wiring, industrial motor controls, safety switchgear, and renewable power integration.',
    description_mr: 'सिंगल आणि थ्री-फेज वायरिंग, औद्योगिक मोटर कंट्रोल्स, सेफ्टी स्विचगिअर आणि सौर ऊर्जा जोडणीचे सर्वसमावेशक प्रात्यक्षिक प्रशिक्षण.',
    description_hi: 'सिंगल एवं थ्री-फेज वायरिंग, औद्योगिक मोटर नियंत्रण, सेफ्टी स्विचगियर और सौर ऊर्जा एकीकरण का व्यापक व्यावहारिक प्रशिक्षण।',
    minimum_education: '10TH',
  },
  {
    id: 'course-002',
    course_code: 'AUT-003',
    title_en: 'EV Powertrain & Battery Diagnostics',
    title_mr: 'ईव्ही पॉवरट्रेन आणि बॅटरी निदान तंत्रज्ञ',
    title_hi: 'ईवी पावरट्रेन एवं बैटरी डायग्नोस्टिक्स',
    sector_name: 'Automotive & Clean Mobility',
    sector_name_mr: 'ऑटोमोटिव्ह आणि ई-मोबिलिटी',
    sector_name_hi: 'ऑटोमोटिव एवं ई-मोबिलिटी',
    duration_months: 12,
    nsqf_level: 4,
    verified_placement_rate: 82,
    median_salary_inr: 26500,
    time_to_hire_days: 28,
    is_high_demand: true,
    is_scholarship_eligible: true,
    iti_count: 85,
    annual_seats: 3200,
    districts: ['Pune', 'Nashik', 'Nagpur', 'Chh. Sambhajinagar'],
    description_en: 'Specialized diagnostic course on electric vehicle drivetrains, high-voltage battery pack assembly, thermal management, and BMS recalibration.',
    description_mr: 'इलेक्ट्रिक वाहनांचे ड्राइव्हट्रेन, हाय-व्होल्टेज बॅटरी पॅक असेंब्ली, थर्मल मॅनेजमेंट आणि बीएमएस रिकॅलिब्रेशनचे विशेष प्रशिक्षण.',
    description_hi: 'इलेक्ट्रिक वाहन ड्राइव्हट्रेन, हाई-वोल्टेज बैटरी पैक असेंबली, थर्मल मैनेजमेंट और बीएमएस का विशेष डायग्नोस्टिक प्रशिक्षण।',
    minimum_education: '10TH',
  },
  {
    id: 'course-003',
    course_code: 'PRC-002',
    title_en: 'CNC Machinist & Precision Operator',
    title_mr: 'सीएनसी मशिनिस्ट आणि अचूक ऑपरेटर',
    title_hi: 'सीएनसी मशीनिस्ट एवं प्रिसिजन ऑपरेटर',
    sector_name: 'Automotive & Capital Goods',
    sector_name_mr: 'ऑटोमोटिव्ह आणि अवजड अभियांत्रिकी',
    sector_name_hi: 'ऑटोमोटिव एवं भारी इंजीनियरिंग',
    duration_months: 24,
    nsqf_level: 4,
    verified_placement_rate: 78,
    median_salary_inr: 24000,
    time_to_hire_days: 32,
    is_high_demand: true,
    is_scholarship_eligible: true,
    iti_count: 210,
    annual_seats: 7500,
    districts: ['Pune', 'Nashik', 'Chh. Sambhajinagar', 'Kolhapur', 'Thane'],
    description_en: 'Master CNC turning, multi-axis milling, G-code/M-code programming, and micrometric tolerance inspection for automotive aerospace suppliers.',
    description_mr: 'ऑटोमोटिव्ह व एरोस्पेस उद्योगांसाठी सीएनसी टर्निंग, मिलिंग, जी-कोड प्रोग्रामिंग आणि सूक्ष्म सहिष्णुता तपासणीचे प्रगत प्रशिक्षण.',
    description_hi: 'ऑटोमोटिव और एयरोस्पेस के लिए सीएनसी टर्निंग, मिलिंग, जी-कोड प्रोग्रामिंग और सटीक टॉलरेंस निरीक्षण का उन्नत प्रशिक्षण।',
    minimum_education: '10TH',
  },
  {
    id: 'course-004',
    course_code: 'GRN-004',
    title_en: 'Solar PV Installer & Rooftop Technician',
    title_mr: 'सोलर पीव्ही इन्स्टॉलर व रूफटॉप तंत्रज्ञ',
    title_hi: 'सोलर पीवी इंस्टॉलर एवं रूफटॉप तकनीशियन',
    sector_name: 'Power & Green Energy',
    sector_name_mr: 'ऊर्जा आणि हरित ऊर्जा',
    sector_name_hi: 'ऊर्जा एवं हरित ऊर्जा',
    duration_months: 12,
    nsqf_level: 4,
    verified_placement_rate: 71,
    median_salary_inr: 21000,
    time_to_hire_days: 42,
    is_high_demand: true,
    is_scholarship_eligible: true,
    iti_count: 140,
    annual_seats: 5600,
    districts: ['Solapur', 'Jalgaon', 'Ahmednagar', 'Nagpur', 'Nashik', 'Pune'],
    description_en: 'Covers installation, grid synchronization, inverter wiring, and maintenance of rooftop and commercial solar photovoltaic arrays.',
    description_mr: 'रूफटॉप व व्यावसायिक सौर फोटोव्होल्टेइक पॅनेल्सची स्थापना, ग्रिड सिंक्रोनाइझेशन, इन्व्हर्टर वायरिंग व नियमित देखभाल.',
    description_hi: 'रूफटॉप एवं वाणिज्यिक सोलर पैनलों की स्थापना, ग्रिड सिंक्रोनाइज़ेशन, इन्वर्टर वायरिंग और नियमित रखरखाव।',
    minimum_education: '10TH',
  },
  {
    id: 'course-005',
    course_code: 'IT-005',
    title_en: 'COPA (Computer Operator & Programming Assistant)',
    title_mr: 'कोपा (संगणक चालक व प्रोग्रॅमिंग सहाय्यक)',
    title_hi: 'कोपा (कंप्यूटर ऑपरेटर एवं प्रोग्रामिंग सहायक)',
    sector_name: 'IT-ITeS & Digital Services',
    sector_name_mr: 'माहिती तंत्रज्ञान व डिजिटल सेवा',
    sector_name_hi: 'सूचना प्रौद्योगिकी एवं डिजिटल सेवाएं',
    duration_months: 12,
    nsqf_level: 3,
    verified_placement_rate: 68,
    median_salary_inr: 19500,
    time_to_hire_days: 45,
    is_high_demand: false,
    is_scholarship_eligible: true,
    iti_count: 380,
    annual_seats: 15200,
    districts: ['Pune', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nashik', 'Chh. Sambhajinagar', 'Amravati', 'Nanded'],
    description_en: 'Database operations, office automation suites, basic Python scripting, cybersecurity fundamentals, and e-governance data entry.',
    description_mr: 'डेटाबेस कार्य, कार्यालयीन स्वयंचलित साधने, मूलभूत पायथॉन स्क्रिप्टिंग, सायबर सुरक्षा आणि ई-प्रशासकीय डेटा व्यवस्थापन.',
    description_hi: 'डेटाबेस संचालन, कार्यालय स्वचालन उपकरण, बुनियादी पायथन स्क्रिप्टिंग, साइबर सुरक्षा और ई-गवर्नेंस डेटा प्रबंधन।',
    minimum_education: '10TH',
  },
  {
    id: 'course-006',
    course_code: 'WLD-006',
    title_en: 'Industrial Welder (GMAW / GTAW / Robotic)',
    title_mr: 'औद्योगिक वेल्डर (जीएमएडब्ल्यू / जीटीएडब्ल्यू / रोबोटिक)',
    title_hi: 'औद्योगिक वेल्डर (जीएमएडब्ल्यू / जीटीएडब्ल्यू / रोबोटिक)',
    sector_name: 'Heavy Industry & Fabrication',
    sector_name_mr: 'अवजड उद्योग व फॅब्रिकेशन',
    sector_name_hi: 'भारी उद्योग एवं फैब्रिकेशन',
    duration_months: 12,
    nsqf_level: 3,
    verified_placement_rate: 76,
    median_salary_inr: 23000,
    time_to_hire_days: 30,
    is_high_demand: true,
    is_scholarship_eligible: true,
    iti_count: 260,
    annual_seats: 9100,
    districts: ['Pune', 'Thane', 'Kolhapur', 'Nagpur', 'Raigad', 'Nashik'],
    description_en: 'Gas Metal Arc, Tungsten Inert Gas welding, pipe welding, and basic collaborative robot welding setups for heavy machinery plants.',
    description_mr: 'गॅस मेटल आर्क, टंगस्टन इनर्ट गॅस वेल्डिंग, पाईप वेल्डिंग आणि अवजड यंत्रसामग्री उद्योगांसाठी रोबोटिक वेल्डिंग प्रात्यक्षिके.',
    description_hi: 'गैस मेटल आर्क, टंगस्टन इनर्ट गैस वेल्डिंग, पाइप वेल्डिंग और भारी मशीनरी संयंत्रों के लिए रोबोटिक वेल्डिंग।',
    minimum_education: '8TH',
  },
  {
    id: 'course-007',
    course_code: 'AGR-007',
    title_en: 'Agro-Processing & Cold Chain Technician',
    title_mr: 'कृषी प्रक्रिया आणि कोल्ड चेन तंत्रज्ञ',
    title_hi: 'कृषि प्रसंस्करण एवं कोल्ड चेन तकनीशियन',
    sector_name: 'Agriculture & Food Processing',
    sector_name_mr: 'कृषी व अन्न प्रक्रिया',
    sector_name_hi: 'कृषि एवं खाद्य प्रसंस्करण',
    duration_months: 12,
    nsqf_level: 4,
    verified_placement_rate: 65,
    median_salary_inr: 18500,
    time_to_hire_days: 48,
    is_high_demand: false,
    is_scholarship_eligible: true,
    iti_count: 95,
    annual_seats: 3400,
    districts: ['Nashik', 'Sangli', 'Kolhapur', 'Ratnagiri', 'Jalgaon'],
    description_en: 'Refrigerated transport equipment, commercial chilling units, post-harvest packaging lines, and food safety quality assurance.',
    description_mr: 'शितगृह यंत्रणा, रेफ्रिजरेटेड वाहतूक उपकरणे, काढणीनंतरचे पॅकेजिंग आणि अन्न सुरक्षा गुणवत्ता मानकांचे प्रशिक्षण.',
    description_hi: 'कोल्ड स्टोरेज संयंत्र, प्रशीतित परिवहन उपकरण, कटाई-उपरांत पैकेजिंग और खाद्य सुरक्षा गुणवत्ता मानक।',
    minimum_education: '10TH',
  },
  {
    id: 'course-008',
    course_code: 'ELC-008',
    title_en: 'Electronics Mechanic & IoT Technician',
    title_mr: 'इलेक्ट्रॉनिक्स मेकॅनिक व आयओटी तंत्रज्ञ',
    title_hi: 'इलेक्ट्रॉनिक्स मैकेनिक एवं आईओटी तकनीशियन',
    sector_name: 'Electronics & Hardware',
    sector_name_mr: 'इलेक्ट्रॉनिक्स आणि हार्डवेअर',
    sector_name_hi: 'इलेक्ट्रॉनिक्स एवं हार्डवेयर',
    duration_months: 24,
    nsqf_level: 4,
    verified_placement_rate: 73,
    median_salary_inr: 22000,
    time_to_hire_days: 40,
    is_high_demand: true,
    is_scholarship_eligible: true,
    iti_count: 180,
    annual_seats: 6800,
    districts: ['Pune', 'Mumbai Suburban', 'Thane', 'Nashik', 'Chh. Sambhajinagar'],
    description_en: 'SMD soldering, microcontroller circuits, industrial sensor calibration, and IoT gateway connectivity for Smart Factory automation.',
    description_mr: 'एसएमडी सोल्डरिंग, मायक्रोकंट्रोलर सर्किट्स, औद्योगिक सेन्सर कॅलिब्रेशन आणि स्मार्ट फॅक्टरी स्वयंचलनासाठी आयओटी गेटवे.',
    description_hi: 'एसएमडी सोल्डरिंग, माइक्रोकंट्रोलर सर्किट, औद्योगिक सेंसर कैलिब्रेशन और स्मार्ट फैक्ट्री ऑटोमेशन के लिए आईओटी गेटवे।',
    minimum_education: '10TH',
  },
];

export const PATHWAY_QUIZ_QUESTIONS: PathwayQuizQuestion[] = [
  {
    id: 1,
    key: 'education',
    title_en: 'What is your current or highest level of education?',
    title_mr: 'आपली सध्याची किंवा सर्वोच्च शैक्षणिक पात्रता काय आहे?',
    title_hi: 'आपकी वर्तमान या उच्चतम शैक्षणिक योग्यता क्या है?',
    subtitle_en: 'This helps filter government vocational trades you are officially eligible for.',
    subtitle_mr: 'यामुळे आपण ज्या शासकीय व्यावसायिक ट्रेड्ससाठी पात्र आहात ते निवडण्यास मदत होते.',
    subtitle_hi: 'इससे उन सरकारी व्यावसायिक ट्रेड्स को चुनने में मदद मिलती है जिनके लिए आप पात्र हैं।',
    options: [
      { id: '8TH', label_en: '8th Pass', label_mr: '८ वी उत्तीर्ण', label_hi: '८वीं उत्तीर्ण', description_en: 'Eligible for foundational trades like Welder & Wireman', description_mr: 'वेल्डर आणि वायरमन यांसारख्या मूलभूत ट्रेड्ससाठी पात्र', description_hi: 'वेल्डर और वायरमैन जैसे बुनियादी ट्रेड्स के लिए पात्र' },
      { id: '10TH', label_en: '10th Pass (SSC)', label_mr: '१० वी उत्तीर्ण (एसएससी)', label_hi: '१०वीं उत्तीर्ण (एसएससी)', description_en: 'Standard qualification for 95% of NCVET/DVET trades', description_mr: '९५% शासकीय आयटीआय कोर्सेससाठी अधिकृत पात्रता', description_hi: '९५% सरकारी आईटीआई पाठ्यक्रमों के लिए मानक योग्यता' },
      { id: '12TH', label_en: '12th Pass (HSC / MCVC)', label_mr: '१२ वी उत्तीर्ण (एचएससी / एमसीव्हीसी)', label_hi: '१२वीं उत्तीर्ण (एचएससी / एमसीवीसी)', description_en: 'Eligible for advanced technical & precision diploma courses', description_mr: 'प्रगत तांत्रिक व अचूक डिप्लोमा अभ्यासक्रमांसाठी पात्र', description_hi: 'उन्नत तकनीकी और डिप्लोमा पाठ्यक्रमों के लिए पात्र' },
      { id: 'GRADUATE', label_en: 'Diploma / Graduate', label_mr: 'पदविका / पदवीधर', label_hi: 'डिप्लोमा / स्नातक', description_en: 'Seeking rapid job-ready industrial upskilling', description_mr: 'उद्योग-केंद्रित जलद कौशल्य संपादन आणि रोजगारासाठी', description_hi: 'उद्योग-उन्मुख त्वरित कौशल वृद्धि और रोजगार हेतु' },
    ],
  },
  {
    id: 2,
    key: 'interest',
    title_en: 'Which area of work naturally interests you most?',
    title_mr: 'कोणत्या प्रकारच्या कामात आपल्याला सर्वाधिक रस आहे?',
    title_hi: 'किस प्रकार के काम में आपकी सबसे अधिक रुचि है?',
    subtitle_en: 'Choose the domain where you enjoy spending time and solving practical challenges.',
    subtitle_mr: 'ज्या क्षेत्रात आपल्याला काम करण्यास व प्रात्यक्षिक समस्या सोडवण्यास आनंद वाटतो ते निवडा.',
    subtitle_hi: 'वह क्षेत्र चुनें जिसमें आपको काम करने और व्यावहारिक समस्याएं हल करने में रुचि हो।',
    options: [
      { id: 'ELECTRICAL_ENERGY', label_en: 'Electrical Systems & Green Energy', label_mr: 'विद्युत यंत्रणा आणि सौर / हरित ऊर्जा', label_hi: 'विद्युत प्रणाली और सौर / हरित ऊर्जा', description_en: 'Wiring, circuits, solar panels, and power infrastructure', description_mr: 'वायरिंग, सर्किट्स, सौर ऊर्जा पॅनेल्स आणि पॉवर ग्रिड', description_hi: 'वायरिंग, सर्किट, सोलर पैनल और पावर ग्रिड' },
      { id: 'AUTOMOTIVE_EV', label_en: 'Automotive, Engines & Electric Vehicles', label_mr: 'ऑटोमोटिव्ह, इंजिन आणि इलेक्ट्रिक वाहने', label_hi: 'ऑटोमोटिव, इंजन और इलेक्ट्रिक वाहन', description_en: 'Modern vehicles, battery packs, and vehicle diagnostics', description_mr: 'आधुनिक वाहने, ईव्ही बॅटरी आणि वाहन दुरुस्ती', description_hi: 'आधुनिक वाहन, ईवी बैटरी और वाहन डायग्नोस्टिक्स' },
      { id: 'PRECISION_MACHINES', label_en: 'Machines, CNC & Metal Fabrication', label_mr: 'यंत्रसामग्री, सीएनसी आणि मेटल फॅब्रिकेशन', label_hi: 'मशीनरी, सीएनसी और मेटल फैब्रिकेशन', description_en: 'Operating computer-controlled tools and manufacturing parts', description_mr: 'संगणक नियंत्रित लेथ, मिलिंग यंत्रे आणि भाग निर्मिती', description_hi: 'कंप्यूटर नियंत्रित मशीन और विनिर्माण पार्ट्स' },
      { id: 'COMPUTERS_DIGITAL', label_en: 'Computers, Office Tech & Digital Operations', label_mr: 'संगणक, डेटा व्यवस्थापन आणि डिजिटल कार्ये', label_hi: 'कंप्यूटर, डेटा प्रबंधन और डिजिटल कार्य', description_en: 'Software tools, database entry, and IT infrastructure', description_mr: 'सॉफ्टवेअर साधने, डेटा एंट्री आणि आयटी सेवा', description_hi: 'सॉफ्टवेयर टूल्स, डेटा एंट्री और आईटी सेवाएं' },
      { id: 'AGRI_FOOD', label_en: 'Agri-Tech & Food Cold Chain', label_mr: 'कृषी तंत्रज्ञान आणि अन्न साठवणूक / प्रक्रिया', label_hi: 'कृषि तकनीक और खाद्य शीत भंडारण / प्रसंस्करण', description_en: 'Post-harvest tech, cold storage, and farm machinery', description_mr: 'काढणीपश्चात तंत्रज्ञान, शीतगृहे व कृषी प्रक्रिया', description_hi: 'कटाई-उपरांत तकनीक, कोल्ड स्टोरेज और कृषि उपकरण' },
    ],
  },
  {
    id: 3,
    key: 'workEnvironment',
    title_en: 'What type of daily work environment do you prefer?',
    title_mr: 'दैनंदिन कामकाजासाठी आपले प्राधान्य कोणत्या वातावरणाला आहे?',
    title_hi: 'दैनिक कामकाज के लिए आप किस प्रकार का वातावरण पसंद करते हैं?',
    subtitle_en: 'Different trades involve active field work, high-tech factories, or indoor desks.',
    subtitle_mr: 'काही ट्रेड्समध्ये कारखान्यातील प्रत्यक्ष काम, तर काहींमध्ये ऑफिस किंवा क्षेत्रीय काम असते.',
    subtitle_hi: 'विभिन्न व्यवसायों में कार्यशाला, आधुनिक कारखाने या इनडोर डेस्क शामिल होते हैं।',
    options: [
      { id: 'SMART_FACTORY', label_en: 'Modern High-Tech Industrial Plant', label_mr: 'आधुनिक हाय-टेक औद्योगिक कारखाना', label_hi: 'आधुनिक हाई-टेक औद्योगिक संयंत्र', description_en: 'Clean, automated manufacturing units with robotics & CNCs', description_mr: 'स्वयंचलित आणि सुरक्षित आधुनिक उत्पादन युनिट्स', description_hi: 'रोबोटिक्स और सीएनसी युक्त आधुनिक विनिर्माण इकाइयां' },
      { id: 'HANDS_ON_WORKSHOP', label_en: 'Hands-on Mechanical / Electrical Workshop', label_mr: 'प्रत्यक्ष मेकॅनिकल / इलेक्ट्रिकल वर्कशॉप', label_hi: 'व्यावहारिक मैकेनिकल / इलेक्ट्रिकल वर्कशॉप', description_en: 'Working with hand tools, testers, and component assembly', description_mr: 'अवजारे, टेस्टर्स आणि प्रत्यक्ष जोडणीचे काम', description_hi: 'उपकरणों, टेस्टर्स और पुर्जों की असेंबली का कार्य' },
      { id: 'INDOOR_OFFICE', label_en: 'Indoor Tech Office or Service Center', label_mr: 'इनडोअर ऑफिस किंवा सर्व्हिस सेंटर', label_hi: 'इनडोर कार्यालय या सर्विस सेंटर', description_en: 'Desk-based operations, screen work, and administrative tools', description_mr: 'डेस्क-आधारित काम, संगणक प्रणाली आणि ग्राहक सेवा', description_hi: 'डेस्क आधारित कार्य, स्क्रीन वर्क और प्रशासनिक टूल्स' },
      { id: 'OUTDOOR_FIELD', label_en: 'Outdoor Sites & Rooftop Installations', label_mr: 'क्षेत्रीय (फील्ड) आणि बाह्य प्रकल्प', label_hi: 'फील्ड एवं बाहरी साइट प्रोजेक्ट्स', description_en: 'On-site installation, solar rooftops, and infrastructure sites', description_mr: 'रूफटॉप सौर ऊर्जा प्रकल्प आणि पायाभूत सुविधा', description_hi: 'रूफटॉप सोलर प्रोजेक्ट्स और ऑन-साइट बुनियादी ढांचा' },
    ],
  },
  {
    id: 4,
    key: 'districtPreference',
    title_en: 'What is your location and job mobility preference in Maharashtra?',
    title_mr: 'महाराष्ट्रात नोकरी आणि प्रशिक्षणासाठी आपली प्राधान्य जागा कोणती?',
    title_hi: 'महाराष्ट्र में नौकरी और प्रशिक्षण हेतु आपकी पसंदीदा जगह कौन सी है?',
    subtitle_en: 'We match opportunities near your district or in high-paying industrial hubs.',
    subtitle_mr: 'आपल्या जिल्ह्यातील किंवा उच्च वेतन देणाऱ्या औद्योगिक केंद्रांमधील संधींची निवड करा.',
    subtitle_hi: 'आपके गृह जिले या उच्च वेतन वाले औद्योगिक केंद्रों में अवसरों का चयन करें।',
    options: [
      { id: 'PUNE_NASHIK_HUB', label_en: 'Major Industrial Hubs (Pune, Nashik, Chh. Sambhajinagar)', label_mr: 'प्रमुख औद्योगिक केंद्रे (पुणे, नाशिक, छत्रपती संभाजीनगर)', label_hi: 'प्रमुख औद्योगिक केंद्र (पुणे, नासिक, छत्रपति संभाजीनगर)', description_en: 'Highest starting salaries, massive automotive & engineering clusters', description_mr: 'सर्वाधिक रोजगार संधी आणि ऑटोमोटिव्ह हब', description_hi: 'सर्वोच्च शुरुआती वेतन और विशाल ऑटोमोटिव क्लस्टर्स' },
      { id: 'MUMBAI_THANE_COASTAL', label_en: 'Mumbai Metropolitan & Coastal Region (MMR, Thane, Raigad)', label_mr: 'मुंबई महानगर व कोकण विभाग (एमएमआर, ठाणे, रायगड)', label_hi: 'मुंबई महानगर एवं तटीय क्षेत्र (एमएमआर, ठाणे, रायगढ़)', description_en: 'Logistics, port operations, power grids, and tech services', description_mr: 'लॉजिस्टिक्स, बंदरगाह, पॉवर ग्रिड आणि टेक सेवा', description_hi: 'लॉजिस्टिक्स, बंदरगाह, पावर ग्रिड और तकनीकी सेवाएं' },
      { id: 'VIDARBHA_MARATHWADA', label_en: 'Vidarbha & Marathwada Hubs (Nagpur MIHAN, Amravati, Nanded)', label_mr: 'विदर्भ व मराठवाडा केंद्रे (नागपूर मिहान, अमरावती, नांदेड)', label_hi: 'विदर्भ एवं मराठवाड़ा केंद्र (नागपुर मिहान, अमरावती, नांदेड़)', description_mr: 'एरोस्पेस, सोलर, लॉजिस्टिक्स आणि वस्त्रोद्योग', description_en: 'Aerospace maintenance, solar installations, and logistics', description_hi: 'एयरोस्पेस, सोलर, लॉजिस्टिक्स और वस्त्र उद्योग' },
      { id: 'HOME_DISTRICT', label_en: 'Near Home / Local District (Any of 36 Districts)', label_mr: 'माझ्या गृह जिल्ह्यात / स्थानिक स्तरावर', label_hi: 'मेरे गृह जिले में / स्थानीय स्तर पर', description_en: 'Preference for local self-employment or nearby ITIs', description_mr: 'स्थानिक स्तरावर स्वयंरोजगार किंवा जवळचे आयटीआय', description_hi: 'स्थानीय स्तर पर स्वरोजगार या नजदीकी आईटीआई' },
    ],
  },
  {
    id: 5,
    key: 'durationPreference',
    title_en: 'What training duration fits your career timeline best?',
    title_mr: 'आपल्या वेळेनुसार प्रशिक्षणाचा कोणता कालावधी सर्वात योग्य वाटतो?',
    title_hi: 'आपकी समयसीमा के अनुसार प्रशिक्षण की कौन सी अवधि सर्वोत्तम है?',
    subtitle_en: 'Short-term diplomas lead to faster placement; 2-year programs lead to higher supervisory career ladders.',
    subtitle_mr: '१ वर्षाच्या कोर्सेसमुळे जलद नोकरी मिळते; २ वर्षांच्या कोर्सेसमुळे प्रगत पदोन्नती मिळते.',
    subtitle_hi: '१ वर्ष के कोर्स त्वरित रोजगार देते हैं; २ वर्ष के कोर्स उच्च पर्यवेक्षी पद देते हैं।',
    options: [
      { id: 'SHORT_12M', label_en: '1-Year Fast Track (12 Months)', label_mr: '१ वर्ष - जलद रोजगार (१२ महिने)', label_hi: '१ वर्ष - त्वरित रोजगार (१२ महीने)', description_en: 'Quickest route into verified industrial employment', description_mr: 'कमीत कमी वेळेत खात्रीशीर रोजगार मिळवण्याचा मार्ग', description_hi: 'न्यूनतम समय में सत्यापित रोजगार पाने का मार्ग' },
      { id: 'STANDARD_24M', label_en: '2-Year Comprehensive Trade (24 Months)', label_mr: '२ वर्षे - सर्वसमावेशक कुशल ट्रेड (२४ महिने)', label_hi: '२ वर्ष - संपूर्ण कुशल ट्रेड (२४ महीने)', description_en: 'In-depth qualification leading to supervisory technician roles', description_mr: 'सखोल ज्ञान व प्रगत तंत्रज्ञ पदासाठी मान्यताप्राप्त पदविका', description_hi: 'गहन ज्ञान और वरिष्ठ तकनीशियन पदों हेतु मान्यता' },
      { id: 'FLEXIBLE', label_en: 'Any Duration (Best Placement Outcome is Priority)', label_mr: 'कालावधी महत्त्वाचा नाही (उत्कृष्ट वेतन व प्लेसमेंट प्राधान्य)', label_hi: 'अवधि मायने नहीं रखती (उत्कृष्ट वेतन और प्लेसमेंट प्राथमिकता)', description_en: 'Focus on highest verified starting salary and career stability', description_mr: 'सर्वोच्च सुरुवातीचे वेतन आणि नोकरीची स्थिरता हेच ध्येय', description_hi: 'सर्वोच्च शुरुआती वेतन और करियर स्थिरता पर ध्यान' },
    ],
  },
];

export function calculateRecommendations(
  answers: PathwayQuizAnswers,
  courses: CourseItem[] = MOCK_COURSES
): PathwayRecommendation[] {
  const scored = courses.map((course) => {
    let score = 60; // base score
    const rationales_en: string[] = [];
    const rationales_mr: string[] = [];
    const rationales_hi: string[] = [];
    const highlights: string[] = [];

    // 1. Education match
    if (answers.education === '8TH') {
      if (course.minimum_education === '8TH') {
        score += 20;
        highlights.push('8th Pass Eligible');
      } else {
        score -= 25;
      }
    } else {
      score += 15;
    }

    // 2. Interest match
    if (answers.interest === 'ELECTRICAL_ENERGY') {
      if (course.course_code === 'ELE-001' || course.course_code === 'GRN-004') {
        score += 25;
        rationales_en.push('Directly matches your interest in electrical circuitry and renewable energy.');
        rationales_mr.push('आपल्या विद्युत यंत्रणा आणि सौर ऊर्जेतील आवडीशी थेट जुळणारा अभ्यासक्रम.');
        rationales_hi.push('आपकी विद्युत प्रणाली और सौर ऊर्जा की रुचि से सीधे मेल खाता है।');
        highlights.push('Interest Match');
      }
    } else if (answers.interest === 'AUTOMOTIVE_EV') {
      if (course.course_code === 'AUT-003' || course.course_code === 'PRC-002') {
        score += 25;
        rationales_en.push('Aligned with high-growth automotive manufacturing and EV mobility.');
        rationales_mr.push('महाराष्ट्रातील ऑटोमोटिव्ह व ईव्ही उद्योगातील वाढत्या मागणीशी सुसंगत.');
        rationales_hi.push('महाराष्ट्र के ऑटोमोटिव और ईवी उद्योग की बढ़ती मांग के अनुकूल।');
        highlights.push('EV & Auto Cluster');
      }
    } else if (answers.interest === 'PRECISION_MACHINES') {
      if (course.course_code === 'PRC-002' || course.course_code === 'WLD-006') {
        score += 25;
        rationales_en.push('Strong match for machine tool programming, fabrication, and precision tolerances.');
        rationales_mr.push('मशिनरी, सीएनसी फॅब्रिकेशन आणि अचूक उत्पादन कौशल्यांसाठी आदर्श.');
        rationales_hi.push('मशीनरी, सीएनसी फैब्रिकेशन और सटीक विनिर्माण कौशल के लिए उपयुक्त।');
        highlights.push('Precision Engineering');
      }
    } else if (answers.interest === 'COMPUTERS_DIGITAL') {
      if (course.course_code === 'IT-005' || course.course_code === 'ELC-008') {
        score += 25;
        rationales_en.push('Fits your interest in computers, data operations, and digital hardware.');
        rationales_mr.push('संगणक, डेटा व्यवस्थापन आणि डिजिटल हार्डवेअरमधील आपल्या आवडीशी सुसंगत.');
        rationales_hi.push('कंप्यूटर, डेटा प्रबंधन और डिजिटल हार्डवेयर में आपकी रुचि के अनुरूप।');
        highlights.push('IT & Digital Skills');
      }
    } else if (answers.interest === 'AGRI_FOOD') {
      if (course.course_code === 'AGR-007' || course.course_code === 'GRN-004') {
        score += 25;
        rationales_en.push('Leverages agro-processing demand and rural cold chain industrialization.');
        rationales_mr.push('कृषी प्रक्रिया आणि ग्रामीण शितगृह साखळीतील मागणीशी परिपूर्ण मेळ.');
        rationales_hi.push('कृषि प्रसंस्करण और कोल्ड चेन औद्योगिकीकरण की मांग से मेल खाता है।');
        highlights.push('Agri-Tech Match');
      }
    }

    // 3. Work environment match
    if (answers.workEnvironment === 'SMART_FACTORY' && (course.course_code === 'PRC-002' || course.course_code === 'AUT-003' || course.course_code === 'ELC-008')) {
      score += 15;
      highlights.push('Smart Factory Environment');
    } else if (answers.workEnvironment === 'OUTDOOR_FIELD' && (course.course_code === 'GRN-004' || course.course_code === 'ELE-001')) {
      score += 15;
      highlights.push('Outdoor & Field Project');
    } else if (answers.workEnvironment === 'INDOOR_OFFICE' && course.course_code === 'IT-005') {
      score += 15;
      highlights.push('Desk & Office Environment');
    }

    // 4. Duration match
    if (answers.durationPreference === 'SHORT_12M' && course.duration_months === 12) {
      score += 10;
      highlights.push('12-Month Fast Track');
    } else if (answers.durationPreference === 'STANDARD_24M' && course.duration_months === 24) {
      score += 10;
      highlights.push('24-Month Comprehensive');
    } else if (answers.durationPreference === 'FLEXIBLE') {
      score += 8;
    }

    // High placement rate bonus
    if (course.verified_placement_rate >= 75) {
      score += 6;
      highlights.push(`High Placement: ${course.verified_placement_rate}%`);
    }

    // Cap score at 98%
    const finalScore = Math.min(98, Math.max(55, score));

    return {
      course,
      matchScore: finalScore,
      rationale_en: rationales_en[0] || `High verified state placement (${course.verified_placement_rate}%) and competitive median starting salary of ₹${course.median_salary_inr.toLocaleString('en-IN')}/month.`,
      rationale_mr: rationales_mr[0] || `शासकीय सत्यापित उच्च प्लेसमेंट दर (${course.verified_placement_rate}%) आणि दरमहा ₹${course.median_salary_inr.toLocaleString('en-IN')} चे सरासरी सुरुवातीचे वेतन.`,
      rationale_hi: rationales_hi[0] || `सरकारी सत्यापित उच्च प्लेसमेंट दर (${course.verified_placement_rate}%) और ₹${course.median_salary_inr.toLocaleString('en-IN')}/माह का औसत शुरुआती वेतन।`,
      highlight_traits: highlights.slice(0, 3),
    };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
}
