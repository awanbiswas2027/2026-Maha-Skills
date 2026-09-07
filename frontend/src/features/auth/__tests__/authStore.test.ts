import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../useAuthStore';

describe('AuthStore & RBAC Persona Switcher (Slice 1 / TEST-SEC-002)', () => {
  beforeEach(() => {
    // Reset to default
    useAuthStore.getState().switchPersona('POLICY_MAKER');
  });

  it('should initialize with POLICY_MAKER as default persona', () => {
    const { currentPersona, isAuthenticated } = useAuthStore.getState();
    expect(isAuthenticated).toBe(true);
    expect(currentPersona.role).toBe('POLICY_MAKER');
    expect(currentPersona.profile.full_name).toContain('IAS');
  });

  it('should allow switching to DISTRICT_OFFICER with scoped jurisdiction', () => {
    useAuthStore.getState().switchPersona('DISTRICT_OFFICER');
    const { currentPersona } = useAuthStore.getState();
    expect(currentPersona.role).toBe('DISTRICT_OFFICER');
    expect(currentPersona.profile.scopes.district_name).toContain('Pune');
    expect(currentPersona.profile.scopes.district_id).toBe(14);
  });

  it('should allow switching to ITI_PRINCIPAL with institute scope', () => {
    useAuthStore.getState().switchPersona('ITI_PRINCIPAL');
    const { currentPersona } = useAuthStore.getState();
    expect(currentPersona.role).toBe('ITI_PRINCIPAL');
    expect(currentPersona.profile.scopes.institute_id).toBe('iti-pune-aundh-01');
  });

  it('should correctly switch to CANDIDATE with candidate profile', () => {
    useAuthStore.getState().switchPersona('CANDIDATE');
    const { currentPersona } = useAuthStore.getState();
    expect(currentPersona.role).toBe('CANDIDATE');
    expect(currentPersona.profile.full_name).toBe('Rahul Jadhav');
  });
});
