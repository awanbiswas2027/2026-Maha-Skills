# Keycloak Identity & Realm Setup (MahaSkills)

This directory contains the canonical realm configuration and documentation for the MahaSkills Keycloak Identity Provider (IAM).

## Overview

MahaSkills uses a hybrid authentication model:
- **Staff Users** (`POLICY_MAKER`, `DISTRICT_OFFICER`, `ITI_PRINCIPAL`, `SSC_REVIEWER`, `ADMIN`) authenticate through Keycloak SSO (OpenID Connect 1.0).
- **Public & Enterprise Users** (`CANDIDATE`, `EMPLOYER`) authenticate locally via in-app credential authentication in the backend API.

The realm configuration is defined in [`realm-mahaskills.json`](realm-mahaskills.json).

---

## Local Development Setup

### 1. Starting Keycloak

To start the Keycloak container with automatic realm import:

```bash
docker compose up -d keycloak
```

When started, Keycloak reads the mounted realm configuration from `/opt/keycloak/data/import/realm-mahaskills.json` and imports the `mahaskills` realm, its client `mahaskills-api`, and all associated mappers and roles.

Credentials for the Keycloak Admin Console are read from your `.env` file:
- `KEYCLOAK_ADMIN`
- `KEYCLOAK_ADMIN_PASSWORD`
- `KEYCLOAK_CLIENT_SECRET`

> **Note on Client Secret Substitution:**  
> The realm import JSON contains `${KEYCLOAK_CLIENT_SECRET}` as a placeholder for `mahaskills-api.secret`. During startup with `--import-realm`, Keycloak replaces this placeholder with the value of the container environment variable `KEYCLOAK_CLIENT_SECRET`. No secret literal is stored in the repository.

### 2. Admin Console

Once the container is healthy (check with `docker compose ps`), access the Keycloak administration console at:
```
http://localhost:8080/admin
```
Log in using your configured `KEYCLOAK_ADMIN` and `KEYCLOAK_ADMIN_PASSWORD`. Select the **`mahaskills`** realm from the top-left dropdown.

---

## Staff User Management

To add a new staff user manually:

1. In the **`mahaskills`** realm, navigate to **Manage** > **Users** > **Add user**.
2. Enter:
   - **Username** (e.g. `dpo.pune`)
   - **Email** (e.g. `dpo.pune@maharashtra.gov.in`)
   - **First name** and **Last name**
   - Toggle **Email verified** to **ON**.
3. Click **Create**.
4. Switch to the **Credentials** tab:
   - Click **Set password**, enter a temporary password, and toggle **Temporary** OFF.
5. Switch to the **Role mapping** tab:
   - Click **Assign role** > Filter by realm roles.
   - Select exactly one of the 5 staff roles:
     - `POLICY_MAKER`
     - `DISTRICT_OFFICER`
     - `ITI_PRINCIPAL`
     - `SSC_REVIEWER`
     - `ADMIN`
6. Switch to the **Attributes** tab:
   - Add the jurisdictional scoping attributes corresponding to the user's role:
     - `district_id` (e.g., `14` for Pune)
     - `district_name` (e.g., `Pune`)
     - `division` (e.g., `Pune`)
     - `institute_id` (e.g., `ITI-PUN-001`, required for `ITI_PRINCIPAL`)
     - `sector_ids` (e.g., `[101, 102]`, required for `SSC_REVIEWER`)
     - `employer_id` (e.g., `EMP-001`)

---

## Obtaining a Token via Direct Access Grant (Dev Only)

In development and CI environments, the client `mahaskills-api` has **Direct Access Grants** enabled (`directAccessGrantsEnabled=true`). This allows developers and automated test suites to mint real RS256 access tokens directly without a web browser.

```bash
curl -X POST "http://localhost:8080/realms/mahaskills/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=mahaskills-api" \
  -d "client_secret=${KEYCLOAK_CLIENT_SECRET}" \
  -d "username=dpo.pune" \
  -d "password=${STAFF_USER_PASSWORD}" \
  -d "grant_type=password"
```

The resulting JSON contains an `access_token` signed with Keycloak's RS256 private key with:
- `iss`: `http://localhost:8080/realms/mahaskills`
- `aud`: `mahaskills-api`
- `realm_access.roles`: `["DISTRICT_OFFICER"]`
- `district_id`: `14`
- `district_name`: `Pune`

---

## Security & Production Hardening Equivalents

The following local configuration choices are strictly for local development and CI testing:

| Feature | Local Development / CI Setting | Production Equivalent | Rationale |
|:---|:---|:---|:---|
| **Server Startup Mode** | `start-dev --import-realm` | `kc.sh start --optimized` | `start-dev` disables production security checks and TLS requirements. Production uses pre-built images with PostgreSQL backend. |
| **Authentication Flow** | Direct Access Grants (`directAccessGrantsEnabled=true`) | Authorization Code Flow with PKCE (`standardFlowEnabled=true`) | Direct access grants require passing raw user credentials through client apps. Production browsers use standards-compliant PKCE redirects. |
| **Transport Layer** | HTTP on port 8080 | HTTPS/TLS on port 443 with HSTS | Cleartext HTTP risks token interception. Production terminates TLS at API Gateway (Kong) / Ingress with valid Gov CA certificates. |
| **Database** | Embedded H2 (dev ephemeral) | Managed PostgreSQL 16 cluster with High Availability | Ephemeral storage loses state on rebuild; production requires durable transactional storage and replica failover. |
