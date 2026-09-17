import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Compass, 
  BookOpen, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  MapPin 
} from 'lucide-react';
import { HeroVisual } from './HeroVisual';

export const LandingPage: React.FC = () => {
  const { t } = useTranslation('landing');

  const stats = [
    { value: t('facts.d'), key: 'd' },
    { value: t('facts.i'), key: 'i' },
    { value: t('facts.j'), key: 'j' },
    { value: t('facts.p'), key: 'p' },
  ];

  const priorityDistricts = [
    { n: t('clusters.c1n'), s: t('clusters.c1s') },
    { n: t('clusters.c2n'), s: t('clusters.c2s') },
    { n: t('clusters.c3n'), s: t('clusters.c3s') },
    { n: t('clusters.c4n'), s: t('clusters.c4s') },
    { n: t('clusters.c5n'), s: t('clusters.c5s') },
    { n: t('clusters.c6n'), s: t('clusters.c6s') },
  ];

  const steps = [
    t('steps.s1'),
    t('steps.s2'),
    t('steps.s3'),
    t('steps.s4')
  ];

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-24">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-6">
                {t('hero.eyebrow')}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
                {t('hero.title1')}
                <span className="text-primary">{t('hero.title2')}</span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-muted-foreground">
                {t('hero.subtext')}
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <Link
                  to="/candidate/pathway"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
                >
                  <Compass className="h-5 w-5" />
                  <span>{t('hero.ctaPrimary')}</span>
                </Link>

                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3.5 text-base font-semibold text-foreground shadow-sm hover:bg-muted transition-all"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>{t('hero.ctaSecondary')}</span>
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full max-w-md mx-auto md:max-w-none">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Facts Strip */}
      <section className="border-b border-border bg-card py-10">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-center divide-x-0 md:divide-x divide-y md:divide-y-0 divide-border">
            {stats.map((stat) => (
              <div key={stat.key} className="w-full md:w-1/4 p-4 text-center">
                <div className="text-lg font-bold text-foreground">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Two Audiences */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-lg border border-border bg-card p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {t('audiences.traineeTitle')}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {t('audiences.traineeSub')}
                </p>
                <ul className="space-y-3 text-sm text-foreground">
                  {[t('audiences.t1'), t('audiences.t2'), t('audiences.t3')].map((text, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  to="/candidate/courses"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-border bg-muted/50 px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  <BookOpen className="h-4 w-4 shrink-0" />
                  <span>{t('audiences.ctaTrainee')}</span>
                </Link>
                <Link
                  to="/candidate/pathway"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <span>{t('audiences.ctaTrainee2')}</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {t('audiences.officerTitle')}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {t('audiences.officerSub')}
                </p>
                <ul className="space-y-3 text-sm text-foreground">
                  {[t('audiences.o1'), t('audiences.o2'), t('audiences.o3')].map((text, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-border bg-muted/50 px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span>{t('audiences.ctaOfficer')}</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How it works (Timeline) */}
      <section className="py-16 bg-card border-b border-border">
        <div className="container px-4 mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-bold text-foreground mb-10">
            {t('steps.title')}
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {steps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    {idx + 1}
                  </div>
                  <div className="text-sm font-semibold">{step}</div>
                </div>
                {idx < steps.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Priority Clusters */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {t('clusters.title')}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t('clusters.sub')}
              </p>
            </div>
            <Link to="/gap-analysis" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
              <span>{t('clusters.cta')}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {priorityDistricts.map((item, idx) => (
              <div key={idx} className="p-4 rounded-lg border border-border bg-card flex flex-col gap-1">
                <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{item.n}</span>
                </div>
                <div className="text-sm text-muted-foreground pl-6">
                  {item.s}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
