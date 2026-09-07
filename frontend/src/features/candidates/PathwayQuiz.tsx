import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PATHWAY_QUIZ_QUESTIONS, calculateRecommendations } from './candidateData';
import { MahaswayamHandoffModal } from './MahaswayamHandoffModal';
import { PathwayQuizAnswers, PathwayRecommendation, CourseItem } from '../../types/api';
import { 
  Compass, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  TrendingUp, 
  Clock, 
  RotateCcw, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../../components/ui/button';

export const PathwayQuiz: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<PathwayQuizAnswers>>({});
  const [recommendations, setRecommendations] = useState<PathwayRecommendation[] | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<CourseItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isMarathi = i18n.language === 'mr';
  const isHindi = i18n.language === 'hi';

  const totalSteps = PATHWAY_QUIZ_QUESTIONS.length;
  const currentQuestion = PATHWAY_QUIZ_QUESTIONS[currentStep];

  const currentAnswerKey = currentQuestion?.key as keyof PathwayQuizAnswers;
  const currentSelectedOption = answers[currentAnswerKey];

  const handleSelectOption = (optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentAnswerKey]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Calculate recommendations
      setIsCalculating(true);
      setTimeout(() => {
        const recs = calculateRecommendations(answers as PathwayQuizAnswers);
        setRecommendations(recs);
        setIsCalculating(false);
      }, 400);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentStep(0);
    setRecommendations(null);
  };

  const handleEnrollClick = (course: CourseItem) => {
    setSelectedCourseForModal(course);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-xl border border-border bg-gradient-to-r from-primary/10 via-card to-card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary mb-2">
              <Compass className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{t('candidates.pathway_quiz_title', '5-Step Career Pathway Quiz')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {recommendations 
                ? t('candidates.top_recommendations', 'Your Top 3 Recommended Career Pathways')
                : (isMarathi ? 'आपल्यासाठी योग्य आयटीआय करिअर मार्ग शोधा' : isHindi ? 'अपने लिए उपयुक्त आईटीआई करियर मार्ग खोजें' : 'Find Your Ideal Vocational ITI Trade')}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-2xl">
              {t('candidates.pathway_quiz_subtitle', 'Discover vocational programs custom-ranked to your education, natural interests, and district mobility.')}
            </p>
          </div>

          {recommendations && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetake}
              className="gap-2 text-xs self-start sm:self-auto shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t('candidates.retake_quiz', 'Retake Quiz')}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Quiz Progress & Question Wizard */}
      {!recommendations && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {/* Progress Bar */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span>
                {t('candidates.step', 'Step')} {currentStep + 1} {t('candidates.of', 'of')} {totalSteps}
              </span>
              <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Title */}
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              {isMarathi 
                ? currentQuestion.title_mr 
                : isHindi 
                ? currentQuestion.title_hi 
                : currentQuestion.title_en}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {isMarathi 
                ? currentQuestion.subtitle_mr 
                : isHindi 
                ? currentQuestion.subtitle_hi 
                : currentQuestion.subtitle_en}
            </p>
          </div>

          {/* Question Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option) => {
              const isSelected = currentSelectedOption === option.id;
              const optionLabel = isMarathi
                ? option.label_mr
                : isHindi
                ? option.label_hi
                : option.label_en;

              const optionDesc = isMarathi
                ? option.description_mr
                : isHindi
                ? option.description_hi
                : option.description_en;

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  className={`w-full text-left rounded-xl border p-4 transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary'
                      : 'border-border bg-background hover:bg-muted/40 hover:border-muted-foreground/30'
                  }`}
                >
                  <div className="space-y-0.5 flex-1">
                    <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span>{optionLabel}</span>
                    </div>
                    {optionDesc && (
                      <p className="text-xs text-muted-foreground">
                        {optionDesc}
                      </p>
                    )}
                  </div>

                  <div className="mt-0.5 shrink-0">
                    <div 
                      className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                        isSelected 
                          ? 'border-primary bg-primary text-white' 
                          : 'border-muted-foreground/40 bg-background'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Stepper Navigation Footer */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-1.5 text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{t('candidates.back', 'Back')}</span>
            </Button>

            <Button
              size="sm"
              onClick={handleNext}
              disabled={!currentSelectedOption || isCalculating}
              className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold"
            >
              <span>
                {currentStep === totalSteps - 1
                  ? t('candidates.get_recommendations', 'View My Recommendations')
                  : t('candidates.next', 'Next Question')}
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Recommendations View */}
      {recommendations && (
        <div className="space-y-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <div className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>
                {isMarathi 
                  ? 'आपल्या उत्तरांवर आधारित क्रमवारी लावण्यात आली आहे' 
                  : isHindi
                  ? 'आपके उत्तरों के आधार पर रैंकिंग की गई है'
                  : 'Ranked based on your specific qualifications and preferences'}
              </span>
            </div>
            <span className="font-medium text-foreground">
              {recommendations.length} {t('candidates.results_count', 'Recommended Trades')}
            </span>
          </div>

          {recommendations.map((rec, index) => {
            const course = rec.course;
            const title = isMarathi
              ? course.title_mr
              : isHindi
              ? course.title_hi
              : course.title_en;

            const sector = isMarathi
              ? course.sector_name_mr
              : isHindi
              ? course.sector_name_hi
              : course.sector_name;

            const rationale = isMarathi
              ? rec.rationale_mr
              : isHindi
              ? rec.rationale_hi
              : rec.rationale_en;

            return (
              <div 
                key={course.id}
                className="rounded-xl border border-border bg-card p-6 shadow-sm hover:border-primary/50 transition-all space-y-4"
              >
                {/* Header with Rank & Match Score */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white font-extrabold text-xs">
                      #{index + 1}
                    </span>
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {course.course_code}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      NSQF {course.nsqf_level} · {course.duration_months} {t('candidates.months', 'months')}
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-3 py-0.5 text-xs font-bold">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{rec.matchScore}% {t('candidates.match_score', 'Match')}</span>
                  </div>
                </div>

                {/* Course Title & Sector */}
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {sector}
                  </p>
                </div>

                {/* Personalized Rationale Callout */}
                <div className="rounded-lg bg-muted/40 border border-border p-3.5 text-xs">
                  <div className="font-semibold text-primary mb-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{t('candidates.why_this_fits', 'Why this fits your profile')}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {rationale}
                  </p>
                  
                  {rec.highlight_traits.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {rec.highlight_traits.map((trait, i) => (
                        <span key={i} className="text-[11px] font-medium bg-background border border-border px-2 py-0.5 rounded text-foreground">
                          ✓ {trait}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Verified Metrics Row */}
                <div className="grid grid-cols-3 gap-2 rounded-lg border border-border bg-background p-3 text-center text-xs">
                  <div>
                    <div className="text-muted-foreground flex items-center justify-center gap-1">
                      <Award className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{t('common.placement_rate', 'Placement')}</span>
                    </div>
                    <div className="mt-1 font-extrabold text-sm sm:text-base text-emerald-700 dark:text-emerald-400">
                      {course.verified_placement_rate}%
                    </div>
                  </div>

                  <div className="border-x border-border">
                    <div className="text-muted-foreground flex items-center justify-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5 text-primary" />
                      <span>{t('common.median_salary', 'Median Salary')}</span>
                    </div>
                    <div className="mt-1 font-extrabold text-sm sm:text-base text-foreground">
                      ₹{course.median_salary_inr.toLocaleString('en-IN')}/mo
                    </div>
                  </div>

                  <div>
                    <div className="text-muted-foreground flex items-center justify-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-amber-600" />
                      <span>{t('candidates.time_to_hire', 'Time-to-Hire')}</span>
                    </div>
                    <div className="mt-1 font-extrabold text-sm sm:text-base text-foreground">
                      {course.time_to_hire_days} {t('candidates.days', 'days')}
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                  <Button
                    onClick={() => handleEnrollClick(course)}
                    className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold"
                  >
                    <span>{t('candidates.enroll_mahaswayam', 'Enroll via Mahaswayam')}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SSO Modal */}
      <MahaswayamHandoffModal
        course={selectedCourseForModal}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCourseForModal(null);
        }}
      />
    </div>
  );
};
