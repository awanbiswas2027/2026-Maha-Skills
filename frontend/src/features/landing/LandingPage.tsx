import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Compass, 
  BookOpen, 
  BarChart3, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  MapPin 
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMarathi = i18n.language === 'mr';

  const stats = [
    { value: '36', label_en: 'Districts Covered', label_mr: 'जिल्हे समाविष्ट' },
    { value: '417+', label_en: 'Government ITIs', label_mr: 'शासकीय आयटीआय' },
    { value: '2,200+', label_en: 'NSQF Job Roles', label_mr: 'एनएसक्यूएफ जॉब रोल्स' },
    { value: '62%+', label_en: 'Target Placement Rate', label_mr: 'उद्दिष्ट रोजगार दर' },
  ];

  const priorityDistricts = [
    { name_en: 'Pune & Pimpri-Chinchwad', name_mr: 'पुणे व पिंपरी-चिंचवड', sector_en: 'Automotive, EV & IT/ITeS', sector_mr: 'ऑटोमोटिव्ह, ईव्ही आणि आयटी' },
    { name_en: 'Nashik', name_mr: 'नाशिक', sector_en: 'Auto Ancillaries & Agro-Tech', sector_mr: 'ऑटो सुटे भाग आणि कृषी प्रक्रिया' },
    { name_en: 'Chh. Sambhajinagar', name_mr: 'छत्रपती संभाजीनगर', sector_en: 'Precision Engineering & MSME', sector_mr: 'अचूक अभियांत्रिकी व एमएसएमई' },
    { name_en: 'Nagpur (MIHAN)', name_mr: 'नागपूर (मिहान)', sector_en: 'Logistics & Aviation Maintenance', sector_mr: 'लॉजिस्टिक्स आणि एरोस्पेस' },
    { name_en: 'Kolhapur', name_mr: 'कोल्हापूर', sector_en: 'Foundry, Textiles & Machinery', sector_mr: 'फाउंड्री, वस्त्रोद्योग व यंत्रे' },
    { name_en: 'Konkan / Ratnagiri', name_mr: 'कोकण / रत्नागिरी', sector_en: 'Marine Processing & Agri-Tech', sector_mr: 'सागरी प्रक्रिया व कृषी तंत्रज्ञान' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-24">
        <div className="container px-4 mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            {isMarathi 
              ? 'महाराष्ट्र शासन · समस्या विवरण क्र. २६१३४' 
              : 'Government of Maharashtra · Problem Statement ID: 26134'}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
            {isMarathi ? (
              <>
                उद्योग मागणी आणि व्यावसायिक अभ्यासक्रम संरेखनासाठी{' '}
                <span className="text-primary underline decoration-amber-500 decoration-wavy decoration-2">
                  अधिकृत मंच
                </span>
              </>
            ) : (
              <>
                Closing the Loop Between Live Industry Demand and{' '}
                <span className="text-primary underline decoration-amber-500 decoration-wavy decoration-2">
                  Vocational Curriculum Design
                </span>
              </>
            )}
          </h1>

          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            {isMarathi 
              ? 'थेट उद्योग मागणीचे विश्लेषण करून आयटीआय व तंत्रनिकेतन अभ्यासक्रमात जलद सुधारणा, जिल्हास्तरीय प्रशिक्षण आराखडे आणि युवकांसाठी सत्यापित रोजगार मार्गदर्शन.'
              : 'Empirically connecting real-time industrial hiring signals with NCVET vocational curriculum design, dynamic district training plans, and transparent student career guidance.'}
          </p>

          {/* Dual Action Entry Points */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/candidate/pathway"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-all"
            >
              <Compass className="h-5 w-5" />
              <span>{isMarathi ? 'करिअर दिशा चाचणी घ्या' : 'Take Career Pathway Quiz'}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3.5 text-base font-semibold text-foreground shadow-sm hover:bg-muted transition-all"
            >
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>{isMarathi ? 'प्रशासकीय डॅशबोर्ड उघडा' : 'Access Government Portal'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Counter Bar */}
      <section className="border-b border-border bg-card py-10">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-muted/40 border border-border">
                <div className="text-3xl sm:text-4xl font-extrabold text-primary font-mono">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs sm:text-sm font-medium text-muted-foreground">
                  {isMarathi ? stat.label_mr : stat.label_en}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual Pathway Feature Cards */}
      <section className="py-16 bg-background">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              {isMarathi ? 'दोन मुख्य प्रवेशद्वारे' : 'Two Dedicated Portals'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {isMarathi 
                ? 'प्रशिक्षणार्थी युवकांसाठी आणि शासकीय व उद्योग भागधारकांसाठी स्वतंत्र सुविधा'
                : 'Tailored experiences for citizen trainees and policy decision-makers.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Card 1: Candidates */}
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm flex flex-col justify-between hover:border-primary/50 transition-colors">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-5">
                  <Compass className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {isMarathi ? 'विद्यार्थी व उमेदवारांसाठी' : 'For Trainees & Youth'}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {isMarathi 
                    ? 'आपल्या शैक्षणिक पात्रतेनुसार आणि आवडीनुसार सर्वात योग्य व्यावसायिक अभ्यासक्रम शोधा.'
                    : 'Discover high-demand vocational trades backed by real government-verified placement statistics.'}
                </p>

                <ul className="mt-6 space-y-3 text-sm text-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{isMarathi ? '५ प्रश्नांची सोपी करिअर दिशा चाचणी' : '5-step adaptive career guidance quiz'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{isMarathi ? 'सत्यापित सरासरी वेतन व नोकरी मिळण्याचा कालावधी' : 'Verified median starting salaries (₹) & time-to-hire'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{isMarathi ? 'महास्वयं पोर्टलद्वारे थेट प्रवेश नोंदणी' : 'Direct course enrollment handoff via Mahaswayam SSO'}</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-border flex items-center gap-3">
                <Link
                  to="/candidate/courses"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-muted/50 px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>{isMarathi ? 'अभ्यासक्रम शोधा' : 'Browse Courses'}</span>
                </Link>
                <Link
                  to="/candidate/pathway"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <span>{isMarathi ? 'चाचणी सुरू करा' : 'Start Quiz'}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Card 2: Government & Industry */}
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm flex flex-col justify-between hover:border-primary/50 transition-colors">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 mb-5">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {isMarathi ? 'शासकीय अधिकारी व उद्योग भागीदारांसाठी' : 'For Officials, ITIs & Employers'}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {isMarathi 
                    ? 'कौशल्य तूट विश्लेषण, अभ्यासक्रम पुनरावलोकन आणि जिल्हा प्रशिक्षण आराखडे.'
                    : 'Evidence-based tools for DSEEI policy makers, district skill officers, and industry liaisons.'}
                </p>

                <ul className="mt-6 space-y-3 text-sm text-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{isMarathi ? '३६ जिल्ह्यांचा थेट कौशल्य तूट हीटमॅप' : 'Live 36-district skill shortage heatmaps'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{isMarathi ? 'स्वयंचलित अभ्यासक्रम सुधारणा पुरावा संच' : 'Automated curriculum evidence dossiers & review workflows'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{isMarathi ? 'आयटीआय साधनसामग्री तूट व जिल्हा प्रशिक्षण योजना' : 'Annual District Training Plans & equipment deficit audits'}</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <Link
                  to="/dashboard"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium hover:bg-foreground/90"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>{isMarathi ? 'अधिकारी / नियोक्त्यांसाठी प्रवेश' : 'Enter Stakeholder Workbench'}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Priority Industrial Districts & Sectors */}
      <section className="py-14 border-t border-border bg-muted/20">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {isMarathi ? 'प्राधान्य औद्योगिक जिल्हे व क्षेत्रे' : 'Priority Industrial Clusters'}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isMarathi ? 'थेट उद्योग मागणीचे प्रमुख क्लस्टर्स' : 'Core economic zones tracked in Phase 1'}
              </p>
            </div>
            <Link to="/gap-analysis" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              <span>{isMarathi ? 'पूर्ण विश्लेषण पहा' : 'View Full Heatmap'}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {priorityDistricts.map((item, idx) => (
              <div key={idx} className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <MapPin className="h-4 w-4 text-amber-600" />
                  <span>{isMarathi ? item.name_mr : item.name_en}</span>
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span>{isMarathi ? item.sector_mr : item.sector_en}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
