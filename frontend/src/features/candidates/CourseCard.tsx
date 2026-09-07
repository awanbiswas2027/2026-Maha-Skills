import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CourseItem } from '../../types/api';
import { 
  Building, 
  Clock, 
  TrendingUp, 
  Award, 
  Sparkles, 
  MapPin, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink 
} from 'lucide-react';
import { Button } from '../../components/ui/button';

interface CourseCardProps {
  course: CourseItem;
  onEnrollClick: (course: CourseItem) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onEnrollClick }) => {
  const { t, i18n } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const isMarathi = i18n.language === 'mr';
  const isHindi = i18n.language === 'hi';

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

  const description = isMarathi
    ? course.description_mr
    : isHindi
    ? course.description_hi
    : course.description_en;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/40 flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
              {course.course_code}
            </span>
            <span className="text-xs font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded">
              NSQF {course.nsqf_level}
            </span>
            {course.is_high_demand && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full">
                <Sparkles className="h-3 w-3 text-amber-600" />
                <span>{t('candidates.high_demand', 'High Local Demand')}</span>
              </span>
            )}
            {course.is_scholarship_eligible && (
              <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                {t('candidates.scholarship_eligible', 'MahaDBT Eligible')}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{course.duration_months} {t('candidates.months', 'months')}</span>
          </span>
        </div>

        {/* Course Title */}
        <h3 className="text-lg font-bold text-foreground leading-snug">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 font-medium">
          {sector}
        </p>

        {/* Verified Outcomes Grid */}
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-muted/40 border border-border p-3 text-center">
          <div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Award className="h-3.5 w-3.5 text-emerald-600" />
              <span>{t('common.placement_rate', 'Placement')}</span>
            </div>
            <div className="mt-1 text-base sm:text-lg font-extrabold text-emerald-700 dark:text-emerald-400">
              {course.verified_placement_rate}%
            </div>
          </div>

          <div className="border-x border-border">
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              <span>{t('common.median_salary', 'Salary')}</span>
            </div>
            <div className="mt-1 text-base sm:text-lg font-extrabold text-foreground">
              ₹{(course.median_salary_inr / 1000).toFixed(1)}k
              <span className="text-[10px] font-normal text-muted-foreground">/mo</span>
            </div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              <span>{t('candidates.time_to_hire', 'Time-to-Hire')}</span>
            </div>
            <div className="mt-1 text-base sm:text-lg font-extrabold text-foreground">
              {course.time_to_hire_days}
              <span className="text-[10px] font-normal text-muted-foreground"> {t('candidates.days', 'days')}</span>
            </div>
          </div>
        </div>

        {/* Additional Details (Expandable) */}
        {isExpanded && (
          <div className="mt-3 space-y-3 pt-3 border-t border-border text-xs animate-in fade-in-50 duration-150">
            <p className="text-muted-foreground leading-relaxed">
              {description}
            </p>

            <div className="grid grid-cols-2 gap-2 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-primary" />
                <span>{course.iti_count} {t('candidates.iti_available', 'ITIs offering')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span>{course.annual_seats.toLocaleString('en-IN')} {t('candidates.annual_seats', 'Seats')}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <MapPin className="h-3.5 w-3.5 text-amber-600" />
                <span className="font-medium">{t('common.district', 'Districts')}:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {course.districts.map((d, i) => (
                  <span key={i} className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-foreground">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="mt-5 pt-3 border-t border-border flex items-center justify-between gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <span>{isExpanded ? t('candidates.close', 'Less') : t('candidates.view_details', 'View Details')}</span>
          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        <Button
          onClick={() => onEnrollClick(course)}
          size="sm"
          className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold"
        >
          <span>{t('candidates.enroll_mahaswayam', 'Enroll via Mahaswayam')}</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
