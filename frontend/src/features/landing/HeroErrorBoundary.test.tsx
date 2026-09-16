import { HeroErrorBoundary } from './HeroVisual';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

beforeEach(() => {
  global.document = {
    createElement: vi.fn(() => {
      return { textContent: '', innerHTML: '' };
    })
  } as unknown as Document;
});

afterEach(() => {
  delete (global as unknown as { document?: Document }).document;
  vi.restoreAllMocks();
});

const ProblemChild = () => {
  throw new Error('Test error');
};

describe('HeroErrorBoundary', () => {
  it('renders children when there is no error', async () => {
    // We cannot use createRoot without a real DOM.
    // Let's just instantiate the component to test it!
    const boundary = new HeroErrorBoundary({ children: 'Safe Child', onError: vi.fn() });
    expect(boundary.state.hasError).toBe(false);
    expect(boundary.render()).toBe('Safe Child');
  });

  it('catches error, calls onError, and returns null', async () => {
    const onError = vi.fn();
    const boundary = new HeroErrorBoundary({ children: <ProblemChild />, onError });
    
    // Simulate error
    boundary.componentDidCatch(new Error('Test error'));
    
    expect(onError).toHaveBeenCalled();
    boundary.setState = function(s) { Object.assign(this.state, s) };
    boundary.setState({ hasError: true });
    
    expect(boundary.render()).toBeNull();
  });
});
