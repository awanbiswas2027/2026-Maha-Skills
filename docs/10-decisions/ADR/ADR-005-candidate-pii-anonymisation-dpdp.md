# ADR-005: Candidate PII Anonymization & DPDP Act 2023 Compliance

## Status
Accepted

## Context
Under India's Digital Personal Data Protection (DPDP) Act 2023, platforms collecting student data are legally required to practice strict purpose limitation and data minimization. The PRD specifies tracking placement outcomes while safeguarding candidate privacy.

## Decision
1. **Perimeter Pseudonymization:** ITI placement CSV uploads convert student enrollment IDs / roll numbers into irreversible one-way HMAC-SHA256 hashes immediately at the ingestion perimeter. Raw student identifiers are purged from memory before database writes.
2. **Zero Candidate Directory:** MahaSkills provides **no candidate directory**, **no candidate profiles**, and **no candidate search** in v1.
3. **Aggregate Salary Exposure:** Salaries are calculated and displayed to candidates and officials strictly as aggregated statistical metrics (median salary, IQR range, trends), never as individual records.

## Consequences
### Positive
* Absolute statutory compliance with DPDP 2023; zero risk of student PII exfiltration.
* Allows empirical outcome benchmarking without legal or privacy exposure.
