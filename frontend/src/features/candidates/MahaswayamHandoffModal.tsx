
import { useTranslation } from 'react-i18next';
import { CourseItem } from '../../types/api';
import { ExternalLink, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { Button } from '../../components/ui/button';

interface MahaswayamHandoffModalProps {
  course: CourseItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MahaswayamHandoffModal: React.FC<MahaswayamHandoffModalProps> = ({
  course,
  isOpen,
  onClose,
}) => {
  const { t, i18n } = useTranslation();
  const isMarathi = i18n.language === 'mr';
  const isHindi = i18n.language === 'hi';

  if (!isOpen || !course) return null;

  const courseTitle = isMarathi
    ? course.title_mr
    : isHindi
    ? course.title_hi
    : course.title_en;

  const sectorName = isMarathi
    ? course.sector_name_mr
    : isHindi
    ? course.sector_name_hi
    : course.sector_name;

  const handleProceed = () => {
    // Direct handoff to Mahaswayam official portal with pre-filled trade qualification code
    const mahaswayamUrl = `https://admission.dvet.gov.in/?trade_code=${encodeURIComponent(
      course.course_code
    )}&source=mahaskills_lmi`;
    window.open(mahaswayamUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={t('candidates.close', 'Close')}
        >
          <X className="h-5 w-5" />
        </button>

        {/* State Emblem / Government Header */}
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-lg">
            म
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t('candidates.sso_modal_title', 'Mahaswayam Portal Handoff')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isMarathi 
                ? 'महाराष्ट्र शासन कौशल्य विकास व उद्योजकता विभाग (DVET)' 
                : 'Government of Maharashtra Skill Development & Entrepreneurship'}
            </p>
          </div>
        </div>

        {/* Selected Course Summary */}
        <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-mono font-bold text-primary">{course.course_code}</span>
            <span>NSQF {t('common.nsqf_level', 'Level')} {course.nsqf_level}</span>
          </div>
          <h4 className="mt-1 font-bold text-foreground text-base">
            {courseTitle}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {sectorName} · {course.duration_months} {t('candidates.months', 'months')}
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3 text-xs">
            <div>
              <span className="text-muted-foreground">{t('common.placement_rate', 'Placement Rate')}:</span>{' '}
              <strong className="text-emerald-700 font-semibold">{course.verified_placement_rate}%</strong>
            </div>
            <div>
              <span className="text-muted-foreground">{t('common.median_salary', 'Median Salary')}:</span>{' '}
              <strong className="text-primary font-semibold">₹{course.median_salary_inr.toLocaleString('en-IN')}/mo</strong>
            </div>
          </div>
        </div>

        {/* Handoff Explanation Notice */}
        <div className="mt-4 space-y-2.5 text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              {t('candidates.sso_modal_desc', 'You are being redirected to the official Mahaswayam admissions portal (mahaswayam.gov.in) with your pre-filled trade qualification code.')}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>
              {isMarathi
                ? 'डीपीडीपी कायदा २०२३ नुसार कोणतीही वैयक्तिक माहिती साठवली जात नाही.'
                : 'DPDP Act 2023 compliant: No personal identifiers are stored or shared without explicit consent.'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            {t('candidates.close', 'Close')}
          </Button>
          <Button
            onClick={handleProceed}
            className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <span>{t('candidates.sso_redirect_btn', 'Continue to Mahaswayam')}</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
