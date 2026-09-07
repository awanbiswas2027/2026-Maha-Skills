# ADR-004: PostgreSQL 16 as Canonical Relational Store

## Status
Accepted

## Context
MahaSkills requires ACID transactional guarantees for curriculum approval workflows, monthly placement return audits, and capital budget distributions, alongside rich relational modeling for skills hierarchies and spatial district coordinates.

## Decision
We select **PostgreSQL 16** as the central relational transactional store, leveraging:
* Native declarative table partitioning for high-churn tables (`job_postings` partitioned by month, `placement_records` partitioned by batch year).
* JSONB columns for flexible empirical evidence packages and audit snapshots.
* PostGIS geospatial extensions for district centroid distance calculations.

## Consequences
### Positive
* Proven enterprise reliability, ACID compliance, and open-source licensing without vendor lock-in.
* Partitioning ensures high query throughput as placement records scale to millions over 7 years.
* Seamless pairing with Redis for caching and Elasticsearch for fuzzy taxonomy search.
