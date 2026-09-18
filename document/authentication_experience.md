# MahaSkills Production-Ready Authentication Experience Master Prompt

You are a Principal Frontend Engineer, Backend Engineer, Security Engineer, UX Architect, and Design-System Engineer.

Your task is to EXTEND THE EXISTING MAHASkills PROJECT with a complete production-ready authentication experience:

1. Role-based Login
2. Role-aware Logout
3. Role-aware Signup / Registration
4. Light Mode / Dark Mode
5. Authentication State Management
6. Protected Routes
7. Role-based Redirects
8. Proper Error / Loading / Empty States
9. Frontend ↔ Backend Authentication Integration
10. Responsive + Accessible Authentication UX

IMPORTANT:

DO NOT rewrite the existing application.

Inspect the existing repository first.

Preserve:

- existing architecture
- existing routes
- existing components
- existing design system
- existing API contracts
- existing backend
- existing database
- existing authentication logic if already implemented
- existing working features

Make small, targeted changes where possible.

============================================================
1. READ THE PROJECT FIRST
============================================================

Before writing code, inspect:

- package.json
- frontend structure
- backend structure
- routing
- authentication code
- user model
- role model
- permission model
- API services
- database schema
- existing uiux.md
- existing appflow.md
- existing RBAC/auth documentation
- existing theme implementation
- existing components
- existing Playwright tests

Determine:

- framework
- frontend stack
- backend stack
- current auth mechanism
- current role model
- current session/token model
- current theme system
- existing user flows
- current missing functionality

Do NOT assume the project is empty.

============================================================
2. FIRST CREATE AN IMPLEMENTATION PLAN
============================================================

Before editing code, produce:

A. Current authentication architecture
B. Current role model
C. Current route structure
D. Current theme implementation
E. Missing authentication functionality
F. Required files/components
G. API dependencies
H. Database dependencies
I. Migration requirements if any
J. Testing plan

Then implement.

============================================================
3. ROLE-BASED LOGIN
============================================================

Create a unified login experience.

Do NOT create completely separate login pages for every role unless the existing architecture explicitly requires it.

Use:

/login

with role/stakeholder context where appropriate.

Potential roles should be derived from the existing RBAC implementation / PRD.

Examples may include:

- Administrator
- Government / Policymaker
- Institution
- Employer
- Candidate / Student
- Training Provider

Do not invent roles that do not exist in the project.

The login flow should be:

User
↓
Select role/stakeholder if required
↓
Enter credentials
↓
Submit
↓
Backend authentication
↓
Identity resolution
↓
Organization resolution
↓
Role resolution
↓
Permission resolution
↓
Redirect to authorized dashboard

============================================================
4. LOGIN UX
============================================================

The login page must include:

- MahaSkills branding
- stakeholder/role selector where required
- email/username
- password
- password visibility toggle
- remember me if supported
- forgot password
- login button
- signup link
- light/dark mode toggle
- loading state
- validation state
- authentication error state
- network error state

Do not use placeholder-only labels.

Use proper accessible labels.

============================================================
5. ROLE SELECTION
============================================================

If the system requires the user to select a role before login:

Create a clear role selector.

Each role may have:

- icon
- name
- short description
- selected state
- hover state
- focus state

Example:

Employer
“Manage jobs, hiring demand and candidate matching.”

Candidate
“Build your skill profile, discover jobs and training.”

Institution
“Manage curriculum alignment and learner outcomes.”

Use actual project terminology.

Do not expose administrative roles publicly if registration/authentication policy says they should not be user-selectable.

============================================================
6. ROLE-BASED LOGIN REDIRECT
============================================================

After successful authentication:

DO NOT redirect everyone to the same dashboard.

Resolve the authenticated user's:

- user ID
- role
- permissions
- organization
- data scope

Then determine the appropriate landing page.

Conceptually:

ADMIN
→ Admin Dashboard

EMPLOYER
→ Employer Dashboard

INSTITUTION
→ Institution Dashboard

CANDIDATE
→ Candidate Dashboard

TRAINING_PROVIDER
→ Training Dashboard

Use the actual project roles and dashboards.

If a user has multiple roles:

show a role/context selection screen if required.

============================================================
7. BACKEND AUTHENTICATION
============================================================

Use the existing backend authentication API.

Do NOT fake login success in frontend code.

Expected flow:

Frontend
→ Auth API
→ Credential validation
→ User resolution
→ Role resolution
→ Organization resolution
→ Permission resolution
→ Token/session creation
→ Frontend authenticated state
→ Dashboard

If the backend auth API does not exist:

create a clean typed service abstraction and clearly document the required API contract.

Do not hard-code mock authentication into production paths.

============================================================
8. SIGNUP / REGISTRATION
============================================================

Add:

/signup

But do NOT assume that every stakeholder should have unrestricted public registration.

Design signup according to the actual security model.

Potential registration categories:

Candidate:
Public/self-registration

Employer:
Organization registration → verification/approval

Training Provider:
Provider registration → verification/approval

Institution:
Institution registration → approval

Government/Admin:
Invite-only or admin-created accounts

Use the project's actual policy.

IMPORTANT:

Do not create public signup for highly privileged roles merely for convenience.

============================================================
9. ROLE-AWARE SIGNUP
============================================================

Signup should begin with:

“What type of account are you creating?”

Then show the correct registration form.

Example:

Candidate Signup
- full name
- email
- phone where required
- password
- confirm password
- location
- education
- consent

Employer Signup
- organization name
- organization type
- organization email
- contact person
- password
- verification details

Institution Signup
- institution name
- institution type
- administrator contact
- verification details

Training Provider Signup
- provider name
- contact
- credentials/verification data

Use only fields actually supported by the backend/PRD.

============================================================
10. SIGNUP STATE MACHINE
============================================================

Handle states such as:

FORM
↓
VALIDATING
↓
SUBMITTING
↓
SUCCESS

or:

FORM
↓
SUBMITTING
↓
VERIFICATION_REQUIRED
↓
VERIFIED
↓
ACCOUNT_ACTIVE

or:

SUBMIT
↓
PENDING_APPROVAL
↓
APPROVED
↓
ACTIVE

Use the actual business flow.

Do not automatically log in users if their account requires verification or approval.

============================================================
11. EMAIL / OTP / VERIFICATION
============================================================

If supported by the backend, implement:

- email verification
- OTP
- verification status
- resend verification
- expired verification
- invalid verification
- account approval status

Do not expose secrets.

Use appropriate rate limiting.

============================================================
12. LOGIN ERROR HANDLING
============================================================

Handle distinctly where appropriate:

Invalid credentials
Account disabled
Account locked
Email not verified
Organization not verified
Pending approval
Unauthorized role
Session expired
Network error
Server error

Do not display raw backend exceptions.

Do not expose sensitive account-enumeration information.

============================================================
13. LOGOUT
============================================================

Implement a proper logout flow.

When the user clicks Logout:

1. invalidate session/token where required
2. clear authentication state
3. clear sensitive cached data
4. clear role/organization context
5. clear user-specific query caches
6. redirect to login
7. prevent access to protected pages using browser back navigation

Do not only remove a local boolean such as:

isLoggedIn = false

============================================================
14. ROLE-AWARE LOGOUT
============================================================

Logout must work identically regardless of role:

Admin
Employer
Institution
Candidate
Training Provider

But cleanup must include role-specific cached state where applicable.

Example:

Employer logout
→ clear employer jobs/matches cache

Candidate logout
→ clear candidate profile/recommendation cache

Never allow another user on the same browser/session to inherit stale protected data.

============================================================
15. AUTH STATE MANAGEMENT
============================================================

Create a centralized authentication state.

Conceptually:

AuthState {
    status
    user
    organization
    roles
    permissions
    session
}

Possible status values:

loading
authenticated
unauthenticated
session_expired

Use the project's existing state management solution.

Do not create duplicated auth state across multiple components.

============================================================
16. AUTH HOOKS / SERVICES
============================================================

Create reusable abstractions such as:

useAuth()
useCurrentUser()
usePermissions()
useRole()
useOrganization()
useCan()

And services such as:

authService
sessionService
roleService
organizationService

Use existing naming conventions when available.

============================================================
17. PROTECTED ROUTES
============================================================

Implement route protection.

Examples:

/dashboard
/candidates
/jobs
/training
/admin
/reports

Each route should define required permissions/roles.

Unauthenticated:

→ redirect to /login

Authenticated but unauthorized:

→ show appropriate 403/Access Denied page

Do not simply hide navigation and assume route security exists.

============================================================
18. ROLE-BASED ROUTE PROTECTION
============================================================

Implement something conceptually like:

Route
↓
Authentication check
↓
Role check
↓
Permission check
↓
Organization/data-scope check
↓
Allow

Frontend checks improve UX.

Backend remains the final security authority.

============================================================
19. DIRECT URL PROTECTION
============================================================

Test that users cannot bypass UI restrictions by manually entering URLs.

Example:

Candidate enters:

/admin/users

System must reject access even if the navigation item is hidden.

Likewise:

Employer cannot access institution-only routes.

============================================================
20. LIGHT MODE / DARK MODE
============================================================

Add a global theme system supporting:

LIGHT
DARK

Optional:
SYSTEM

Use the existing design-token architecture where available.

Do NOT simply invert colors.

Create proper semantic tokens for:

background
surface
surface-elevated
text-primary
text-secondary
border
primary
secondary
success
warning
danger
input
focus
overlay

============================================================
21. THEME SWITCHER
============================================================

Place a theme switcher in an appropriate global location.

It should:

- switch instantly
- preserve user context
- persist preference
- respect system preference where configured
- support reduced motion
- work across login/signup and authenticated pages

Do not reload the entire application.

============================================================
22. LIGHT MODE
============================================================

Light mode should be:

- readable
- professional
- restrained
- accessible
- enterprise-oriented

Avoid:

- pure white everywhere
- low contrast gray text
- excessive gradients
- unnecessary shadows
- random colors

============================================================
23. DARK MODE
============================================================

Dark mode should use layered surfaces.

Avoid:

- pure black everywhere
- neon UI
- glowing borders
- excessive gradients
- unreadable muted text
- excessive glassmorphism

Charts, badges, forms, tables, and dialogs must also adapt correctly.

============================================================
24. THEME CONSISTENCY
============================================================

The following must support both themes:

- login
- signup
- dashboards
- sidebar
- topbar
- tables
- forms
- charts
- dialogs
- dropdowns
- tooltips
- notifications
- error pages
- loading states
- empty states

Do not allow “dark mode” to work only on the main page.

============================================================
25. ACCESSIBILITY
============================================================

Ensure:

- keyboard navigation
- visible focus
- semantic labels
- ARIA where needed
- accessible errors
- sufficient contrast
- accessible theme toggle
- accessible role selection
- accessible password toggle
- touch-friendly controls

Do not communicate role selection or errors using color alone.

============================================================
26. RESPONSIVE DESIGN
============================================================

Test:

Desktop
Laptop
Tablet
Mobile

Login and signup should work properly on small screens.

Do not allow:

- horizontal overflow
- clipped forms
- inaccessible password fields
- off-screen buttons
- unusable role selectors

On mobile, prioritize authentication over decorative visuals.

============================================================
27. DATA FLOW
============================================================

Implement this complete flow:

LOGIN:

User
↓
Login Form
↓
Client Validation
↓
POST /auth/login
↓
Backend Authentication
↓
User
↓
Organization
↓
Roles
↓
Permissions
↓
Session/Token
↓
Auth State
↓
Permission-Aware UI
↓
Role Dashboard

SIGNUP:

User
↓
Role Selection
↓
Registration Form
↓
Client Validation
↓
POST /auth/register
↓
Backend Validation
↓
Create User
↓
Create Organization if required
↓
Verification / Approval
↓
Account State
↓
Notification
↓
Login / Pending Approval

LOGOUT:

User
↓
Logout
↓
Backend Session Invalidation
↓
Clear Client Auth State
↓
Clear Sensitive Cache
↓
Redirect /login

============================================================
28. API ABSTRACTION
============================================================

Do not call APIs directly from UI components.

Use a service/API layer.

Example:

api/
  authApi.ts
  userApi.ts
  organizationApi.ts

services/
  authService.ts
  sessionService.ts

Components should interact with services/hooks, not raw fetch calls scattered across the application.

============================================================
29. TYPE SAFETY
============================================================

Define proper TypeScript types for:

User
Role
Permission
Organization
AuthSession
LoginRequest
LoginResponse
SignupRequest
SignupResponse
AuthError
VerificationState

Do not use:

any

unless absolutely necessary and documented.

============================================================
30. SECURITY REQUIREMENTS
============================================================

Never:

- store passwords
- log tokens
- expose refresh tokens unnecessarily
- hard-code secrets
- trust client-provided roles
- trust client-provided organization IDs
- use frontend role checks as backend security
- expose raw backend exceptions

The backend must enforce:

authentication
authorization
organization scope
resource access

============================================================
31. CACHE INVALIDATION
============================================================

When these events occur:

logout
role change
organization change
session expiration
account switch

invalidate relevant user-specific caches.

Example:

auth logout
→ clear candidate queries
→ clear employer queries
→ clear dashboard queries
→ clear notifications
→ clear organization-scoped queries

Do not leave restricted data in memory unnecessarily.

============================================================
32. PLAYWRIGHT TESTING
============================================================

Use Playwright CLI to test the real application.

Test:

LOGIN

- login page
- role selection
- valid login
- invalid login
- loading state
- session failure
- correct role redirect

SIGNUP

- role selection
- candidate registration
- employer registration where supported
- validation errors
- password confirmation
- verification/approval state

LOGOUT

- logout
- redirect
- protected route after logout
- browser back navigation
- cache clearing

THEME

- light mode
- dark mode
- persistence
- mobile theme
- login theme
- signup theme

AUTHORIZATION

- correct dashboard per role
- protected route
- unauthorized route
- direct URL access
- permission-denied state

============================================================
33. VISUAL QA
============================================================

For authentication pages capture screenshots of:

1. Login light desktop
2. Login dark desktop
3. Login light mobile
4. Login dark mobile
5. Signup light
6. Signup dark
7. Role selector
8. Validation error
9. Authentication error
10. Loading state
11. Access denied
12. Session expired

Inspect:

- spacing
- typography
- hierarchy
- alignment
- contrast
- responsive behavior
- theme consistency

Fix visual defects before completion.

============================================================
34. EDGE CASES
============================================================

Test:

- user closes browser during login
- expired session
- invalid refresh/session
- account pending approval
- account disabled
- organization inactive
- multiple roles
- multiple organizations
- role changes while logged in
- browser refresh
- direct protected URL
- network disconnected
- backend unavailable
- logout while API request is active

Define sensible UX for each case.

============================================================
35. DO NOT BREAK EXISTING FEATURES
============================================================

Before changing authentication:

identify existing flows.

After implementation test:

- existing navigation
- existing dashboard
- existing API requests
- existing role-specific pages
- existing theme styles
- existing components

Fix regressions immediately.

============================================================
36. IMPLEMENTATION ORDER
============================================================

PHASE 1
Inspect architecture.

PHASE 2
Document current auth and RBAC behavior.

PHASE 3
Implement/repair authentication service.

PHASE 4
Implement role-based login.

PHASE 5
Implement signup.

PHASE 6
Implement protected routing.

PHASE 7
Implement logout and session cleanup.

PHASE 8
Implement light/dark theme system.

PHASE 9
Update components for both themes.

PHASE 10
Add Playwright tests.

PHASE 11
Run visual QA.

PHASE 12
Fix regressions.

Do not implement everything in one giant file.

============================================================
37. FINAL REVIEW
============================================================

Before declaring completion, verify:

AUTHENTICATION
- login works
- session works
- logout works
- errors work

RBAC
- role resolution works
- permissions work
- protected routes work
- direct URL access is protected

SIGNUP
- role-specific registration works
- verification/approval works where required
- privileged accounts are not unnecessarily open for public registration

THEME
- light mode works
- dark mode works
- theme persists
- all major components support both

SECURITY
- secrets are protected
- frontend does not bypass backend authorization
- stale data is cleared
- organization context is enforced

UX
- responsive
- accessible
- clear
- consistent with uiux.md
- consistent with appflow.md

TESTING
- unit tests
- integration tests
- Playwright tests
- visual verification

============================================================
38. DEFINITION OF DONE
============================================================

[ ] Existing architecture inspected
[ ] Current auth behavior documented
[ ] Role model integrated
[ ] Login implemented
[ ] Role-based redirect implemented
[ ] Signup implemented
[ ] Role-aware signup implemented
[ ] Verification/approval flow handled
[ ] Logout implemented
[ ] Session cleanup implemented
[ ] Protected routes implemented
[ ] Permission checks implemented
[ ] Light mode implemented
[ ] Dark mode implemented
[ ] Theme persistence implemented
[ ] Responsive behavior verified
[ ] Accessibility verified
[ ] API integration verified
[ ] Cache invalidation implemented
[ ] Playwright tests implemented
[ ] Visual screenshots reviewed
[ ] Existing features still work
[ ] No major console errors
[ ] No security-sensitive information leaked
[ ] Documentation updated

============================================================
39. FINAL OUTPUT
============================================================

Do not simply create screenshots or mock pages.

Implement a REAL authentication experience integrated with the existing project.

The final architecture should follow:

USER
↓
ROLE / STAKEHOLDER
↓
LOGIN / SIGNUP
↓
AUTHENTICATION
↓
ORGANIZATION
↓
ROLE
↓
PERMISSIONS
↓
SESSION
↓
PROTECTED ROUTES
↓
AUTHORIZED DASHBOARD
↓
APPLICATION

And:

LOGOUT
↓
SESSION INVALIDATION
↓
CACHE CLEAR
↓
AUTH STATE CLEAR
↓
LOGIN

Both LIGHT and DARK themes must work across the complete experience.

Before coding, inspect. 
Before finishing, test.
Before declaring complete, use Playwright and visually inspect the result.
