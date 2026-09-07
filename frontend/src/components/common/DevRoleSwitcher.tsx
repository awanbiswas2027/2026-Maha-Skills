import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore, PRESET_PERSONAS } from '../../features/auth/useAuthStore';
import { UserRole } from '../../types';
import { ShieldCheck, ChevronDown, Check } from 'lucide-react';

export const DevRoleSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentPersona, setPersona } = useAuthStore();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const handleSelect = (role: UserRole) => {
    setPersona(role);
    setIsOpen(false);
    if (role === 'CANDIDATE') {
      navigate('/candidate/pathway');
    } else {
      navigate('/dashboard');
    }
  };

  const isMarathi = i18n.language === 'mr';
  const roleLabel = isMarathi ? currentPersona.label_mr : currentPersona.label_en;
  const scopeLabel = currentPersona.profile.scopes.district_name || 'Statewide';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 shadow-sm hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200 transition-colors"
        title="Development Persona & Role Switcher"
      >
        <ShieldCheck className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
        <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
          DEV:
        </span>
        <span className="max-w-[140px] truncate">{roleLabel}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-50"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1.5 z-50 w-72 rounded-lg border border-border bg-card p-2 shadow-xl animate-in fade-in zoom-in-95">
            <div className="px-2 py-1.5 border-b border-border mb-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {isMarathi ? 'विकास भूमिका बदला' : 'Switch Active Persona'}
              </p>
              <p className="text-xs text-foreground font-medium truncate mt-0.5">
                {currentPersona.profile.full_name}
              </p>
              <p className="text-[11px] text-primary truncate">
                {scopeLabel}
              </p>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-0.5">
              {(Object.keys(PRESET_PERSONAS) as UserRole[]).map((role) => {
                const persona = PRESET_PERSONAS[role];
                const isSelected = currentPersona.role === role;
                const label = isMarathi ? persona.label_mr : persona.label_en;

                return (
                  <button
                    key={role}
                    onClick={() => handleSelect(role)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md text-left transition-colors ${
                      isSelected
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{label}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {role}
                      </div>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
