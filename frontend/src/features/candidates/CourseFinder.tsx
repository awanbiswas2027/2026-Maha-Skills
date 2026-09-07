import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MOCK_COURSES } from './candidateData';
import { CourseCard } from './CourseCard';
import { MahaswayamHandoffModal } from './MahaswayamHandoffModal';
import { CourseItem } from '../../types/api';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  Compass, 
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export const CourseFinder: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedNsqf, setSelectedNsqf] = useState('ALL');
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<CourseItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isMarathi = i18n.language === 'mr';
  const isHindi = i18n.language === 'hi';

  // Extract unique districts and sectors
  const districts = useMemo(() => {
    const dSet = new Set<string>();
    MOCK_COURSES.forEach(c => c.districts.forEach(d => dSet.add(d)));
    return Array.from(dSet).sort();
  }, []);

  const sectors = useMemo(() => {
    const sSet = new Set<string>();
    MOCK_COURSES.forEach(c => sSet.add(c.sector_name));
    return Array.from(sSet).sort();
  }, []);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return MOCK_COURSES.filter(course => {
      // Search matching title (en/mr/hi), code, sector
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const matchesTitle = 
          course.title_en.toLowerCase().includes(query) ||
          course.title_mr.toLowerCase().includes(query) ||
          course.title_hi.toLowerCase().includes(query) ||
          course.course_code.toLowerCase().includes(query) ||
          course.sector_name.toLowerCase().includes(query);

        if (!matchesTitle) return false;
      }

      // District match
      if (selectedDistrict !== 'ALL') {
        if (!course.districts.includes(selectedDistrict)) return false;
      }

      // Sector match
      if (selectedSector !== 'ALL') {
        if (course.sector_name !== selectedSector) return false;
      }

      // NSQF match
      if (selectedNsqf !== 'ALL') {
        if (course.nsqf_level !== Number(selectedNsqf)) return false;
      }

      return true;
    });
  }, [searchQuery, selectedDistrict, selectedSector, selectedNsqf]);

  const handleEnrollClick = (course: CourseItem) => {
    setSelectedCourseForModal(course);
    setIsModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDistrict('ALL');
    setSelectedSector('ALL');
    setSelectedNsqf('ALL');
  };

  const hasActiveFilters = searchQuery !== '' || selectedDistrict !== 'ALL' || selectedSector !== 'ALL' || selectedNsqf !== 'ALL';

  return (
    <div className="space-y-6">
      {/* Top Header & Context Banner */}
      <div className="rounded-xl border border-border bg-gradient-to-r from-primary/10 via-card to-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary mb-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{t('candidates.verified_stats', 'Government-Verified Outcomes')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {t('candidates.course_finder_title', 'Verified Course Directory')}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-2xl">
              {t('candidates.course_finder_subtitle', 'Explore government-verified vocational ITI trades with real placement rates, starting salaries, and hiring timelines.')}
            </p>
          </div>

          <Link
            to="/candidate/pathway"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all shrink-0"
          >
            <Compass className="h-4 w-4" />
            <span>{t('candidates.pathway_quiz_title', 'Take Pathway Quiz')}</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('candidates.search_placeholder', 'Search trade title, code, or skill keyword...')}
              className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t('common.filter', 'Reset')}</span>
            </Button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* District Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0 hidden sm:block" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">{t('candidates.filter_district', 'All Districts')}</option>
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Sector Filter */}
          <div>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">{t('candidates.filter_sector', 'All Sectors')}</option>
              {sectors.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* NSQF Level Filter */}
          <div>
            <select
              value={selectedNsqf}
              onChange={(e) => setSelectedNsqf(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">{t('candidates.filter_nsqf', 'All NSQF Levels')}</option>
              <option value="3">NSQF Level 3</option>
              <option value="4">NSQF Level 4</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <div>
          <span>{filteredCourses.length} {t('candidates.results_count', 'Available Courses Found')}</span>
        </div>
        <div className="font-medium text-foreground">
          {t('candidates.all_courses', 'Showing verified NCVET/DVET curriculum data')}
        </div>
      </div>

      {/* Course Cards Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEnrollClick={handleEnrollClick}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-12 text-center bg-card">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-60" />
          <h3 className="font-bold text-base text-foreground">
            {isMarathi ? 'कोणतेही अभ्यासक्रम सापडले नाहीत' : isHindi ? 'कोई पाठ्यक्रम नहीं मिला' : 'No courses found'}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {isMarathi 
              ? 'कृपया आपले शोध निकष बदला किंवा सर्व फिल्टर्स रीसेट करा.' 
              : 'Try clearing some of your search filters or browse all active ITI trades.'}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="mt-4 text-xs"
          >
            {t('common.filter', 'Clear Filters')}
          </Button>
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
