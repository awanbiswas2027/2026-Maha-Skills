# ADR-002: Keycloak OIDC with PKCE for Centralized Identity & Access Management

## Status
Accepted

## Context
MahaSkills serves 7 distinct roles across multiple government departments (DSEEI, DVET), Sector Skill Councils (SSCs), 417+ ITIs, and thousands of industrial employers. Building custom authentication creates substantial compliance, audit, and security risks.

## Decision
We adopt **Keycloak 24** as the centralized Identity and Access Management (IAM) provider, using the **OAuth 2.0 Authorization Code Flow with PKCE** for all authenticated sessions. Keycloak realm roles map to platform permissions, while custom JWT claims inject jurisdictional scopes (`district_id`, `institute_id`, `sector_ids`).

## Consequences
### Positive
* Enterprise-grade identity management with out-of-the-box Multi-Factor Authentication (MFA).
* Interoperable OIDC federation with existing state government portals (Mahaswayam SSO).
* Centralized session revocation and audit logging.

### Negative / Trade-offs
* Introduces a critical infrastructure dependency requiring multi-AZ high-availability deployment.
