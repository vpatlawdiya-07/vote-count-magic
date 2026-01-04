
Voting System — Cast & Count Votes (with Authentication & Verification)

Project Overview

A secure, extensible voting platform for casting and counting votes in elections. Supports voter authentication, vote receipts (verification), and an append-only audit trail to detect tampering. Designed for small-to-medium elections (school, college, club) and as a learning foundation for more advanced systems.

Key Features

Core Features

• ✅ Create and manage elections (single-choice by default; extendable)

• ✅ Voter registration and authentication (password / token)

• ✅ Cast votes with receipt-based verification

• ✅ Append-only audit log with optional hash chaining

• ✅ Tally results (real-time and end-of-election)

• ✅ Export results and audit logs (CSV / JSON / PDF)

• ✅ Role-based access (admin vs voter)

• ✅ Responsive React UI + REST API

Constraints Handled

• ✅ No voter can vote more than once (configurable)

• ✅ No double-counting or tampering (append-only audit + receipts)

• ✅ Voting windows enforced (start/end times)

• ✅ Ballot validation (candidate IDs, allowed choices)

• ✅ Configurable election types (anonymous vs identified)

Architecture

Frontend (React)

• Dashboard | Elections | Voters | Cast Vote | Results | Audit Viewer

HTTP/REST API

Backend (Spring Boot)

• Controllers → Services → Repositories

• CRUD operations

• Authentication & authorization

• Vote recording + receipt generation

• Audit log (append-only) and optional hash chaining

• Tallying / reporting

• Export endpoints (CSV/PDF)

JDBC

PostgreSQL Database

• voters | elections | candidates | votes | audit_log

Technology Stack

Backend

• Java 17

• Spring Boot 3.x

• Spring Security (JWT / token auth)

• Spring Data JPA

• PostgreSQL

• Maven

• Lombok

• iText / OpenPDF (PDF generation)

• OpenCSV (CSV export)

Frontend

• React 18

• React Router

• Axios

• CSS3 / Tailwind or Material UI (optional)

Optional

• Docker & docker-compose

• Redis for caching

• GitHub Actions for CI

Prerequisites

• Java 17+

• Node.js 16+ and npm

• PostgreSQL 12+

• Maven 3.6+

• Optional: Docker & docker-compose

Quick Start

1. Database

• Create DB: CREATE DATABASE voting_db;

• Ensure a DB user with access exists.

2. Backend

• cd backend

• Edit src/main/resources/application.properties (or application.yml) with DB credentials and JWT secret: spring.datasource.url=jdbc:postgresql://localhost:5432/voting_db spring.datasource.username=YOUR_USER spring.datasource.password=YOUR_PASSWORD app.jwt.secret=YOUR_SECRET

• Build & run: mvn clean install mvn spring-boot:run

• Backend runs: http://localhost:8080/api

3. Frontend

• cd frontend

• npm install

• npm start

• Frontend runs: http://localhost:3000

User Guide

Admin workflow

• Create an election (id, name, type, start/end, anonymity)

• Add candidates

• Register/import voters (or enable open registration)

• Configure voting rules (one-vote-per-voter, anonymous, verification)

• Generate results once election closes

• View audit trail; export results and logs

Voter workflow

• Register / Login (if required)

• Browse active elections

• Cast vote within election window

• Receive a receipt (hash) containing {election_id, voter_token/anon_id, ballot_summary, timestamp, server_salt-hash}

• Verify recorded vote using receipt verifier endpoint or public audit endpoint

API Endpoints (examples)

Base URL: http://localhost:8080/api

Authentication

• POST /auth/register

• { "voterId": "1001", "name": "John", "password": "pass" }

• POST /auth/login

• { "voterId": "1001", "password": "pass" } -> { "token": "jwt..." }

Elections

• GET  /elections

• POST /elections  (admin)

• GET  /elections/{id}

• PUT  /elections/{id} (admin)

• DELETE /elections/{id} (admin)

Candidates

• GET /elections/{eid}/candidates

• POST /elections/{eid}/candidates (admin)

• PUT /candidates/{id} (admin)

• DELETE /candidates/{id} (admin)

Voters

• GET /voters (admin)

• POST /voters (admin or self-register)

• PUT /voters/{id}

Voting

• POST /elections/{id}/vote

• Auth: Bearer <token> (if required)

• Body (identified election): { "voterId": "1001", "ballot": { "choice": "cand-1" } }

• Body (anonymous election): { "anonId": "session-abc", "ballot": { "choice":"cand-1" } }

• Response: { "status":"recorded", "receipt":"sha256:abcd...", "timestamp":"..." }

Verification / Audit

• GET /audit/receipt/{receipt_hash} -> { found: true, record: {...} }

• GET /audit/election/{id}?limit=100

Results

• GET /elections/{id}/results  (public or admin - configurable)

• GET /elections/{id}/results/export?format=csv|pdf

Export

• GET /export/election/{id}/csv

• GET /export/election/{id}/pdf

Voting Algorithms

1. Plurality (First-Past-The-Post)

• For each recorded ballot: increment candidate count for the chosen candidate.

• Winner: candidate with highest votes.

• Tie-handling: configurable (random, alphabetical, runoff).

Pseudocode: counts = {} for vote in votes: counts[vote.choice] += 1 winner = argmax(counts)

2. Instant-Runoff Voting (IRV) / Ranked Choice

• Round-based elimination:

• Count first choices.

• If candidate >50%, winner.

• Else eliminate candidate(s) with fewest votes; reassign ballots to next preference.

• Repeat until winner or tie.

Notes:

• Validate ballots: preferences reference valid candidate IDs; no duplicates.

• Configurable tie-break rules.

• For large elections consider more advanced algorithms or optimizations.

Security & Vote Verification

• Authentication: JWT or session tokens; passwords stored hashed (bcrypt / Argon2).

• Receipt: SHA-256 hash over (election_id + timestamp + ballot_summary + server_salt). Return to voter for verification.

• Audit Log: Append-only JSON file or audit table. Optionally chain records with prev_hash to detect tampering.

• Privacy:

• Configure anonymous elections: store votes without voter_id, but issue anonymous receipt.

• For identified elections: store voter_id with vote (careful of privacy requirements).

• Integrity:

• Use DB transactions; persist audit record before returning receipt.

• Use HTTPS for all client-server traffic.

Project Structure

voting-system/ ├── backend/ │   ├── src/main/java/com/vote/ │   │   ├── config/ │   │   ├── controller/ │   │   ├── dto/ │   │   ├── entity/ │   │   ├── exception/ │   │   ├── repository/ │   │   └── service/ │   ├── src/main/resources/ │   │   └── application.properties │   └── pom.xml ├── frontend/ │   ├── public/ │   ├── src/ │   │   ├── pages/ │   │   ├── components/ │   │   ├── services/   # axios API wrapper │   │   └── App.js │   └── package.json ├── docs/ │   └── screenshots/ ├── scripts/ │   └── import-sample-data.sh ├── docker-compose.yml └── README.md

Database Schema

Core Tables (relational model)

-- voters voter_id   PK name email password_hash registered BOOLEAN

-- elections election_id PK name type VARCHAR (single|ranked|anonymous) starts TIMESTAMP ends TIMESTAMP config JSON

-- candidates candidate_id PK election_id FK → elections name metadata JSON

-- votes vote_id PK election_id FK → elections voter_id FK → voters (nullable if anonymous) ballot JSON           -- e.g., {"choice":"cand-1"} or {"preferences":["cand-1","cand-2"]} timestamp TIMESTAMP receipt_hash VARCHAR server_salt_id FK (optional)   -- for rotating salts

-- audit_log (append-only) audit_id PK event_type VARCHAR   -- VOTE_CAST, ELECTION_CREATED, etc. payload JSON timestamp TIMESTAMP prev_hash VARCHAR    -- optional for chaining hash VARCHAR

Indexes: votes(election_id), votes(receipt_hash), audit_log(hash)

Screenshot Descriptions

(Place screenshots in docs/screenshots and reference them.)

• dashboard.png — Admin dashboard with active elections, vote counts, recent audit events.

• create-election.png — Form to create elections including time window, anonymity toggle, allowed voters.

• candidates.png — Candidate management page (add/edit/delete).

• cast-vote.png — Voter ballot view (single-choice or ranked interface).

• results.png — Results page with bar chart and detailed counts.

• audit-viewer.png — Append-only audit log view with receipt verifier.

Troubleshooting

Issue: Backend fails to start

• Check PostgreSQL is running and credentials in application.properties are correct.

• Ensure port 8080 is free.

Issue: CORS errors from frontend

• Add CORS config in backend (allow localhost:3000 during development).

Issue: Votes rejected or not recorded

• Confirm election window (starts/ends).

• Check voter registration and one-vote-per-voter config.

• Inspect backend logs and audit_log for errors during write.

Issue: Receipt verification mismatch

• Ensure server_salt used to compute receipt is the same (and stored / rotation handled).

• Verify ballot_summary canonicalization (same ordering and normalization before hashing).

Issue: Concurrent writes causing conflicts

• Use DB transactions / unique constraints to prevent duplicates.

• For high concurrency, prefer database backend over local files.

Production Deployment

Backend

• Build JAR: mvn clean package

• Run: java -jar target/vote-system-1.0.0.jar --spring.profiles.active=prod

Frontend

• Build static bundle: npm run build

• Serve build/ via nginx or static host.

Docker (recommended)

• Provide Dockerfile for backend and frontend and docker-compose.yml:

• Services: db (postgres), backend (app), frontend (nginx), optional redis.

• Use volumes for persistent DB and audit logs.

• Set secrets via environment or secret manager.

Security & Hardening

• Use HTTPS and secure cookies.

• Store secrets in secret manager (not in repo).

• Rotate salts and tokens periodically.

• Limit access to admin endpoints with RBAC.

• Regular backups for DB and audit logs; consider WORM/immutable storage for audit.

Sample Data

SQL inserts (sample) INSERT INTO elections (election_id, name, type, starts, ends) VALUES ('school-2026', 'School Board 2026', 'single', '2026-04-01 00:00:00', '2026-04-01 23:59:59');

INSERT INTO candidates (candidate_id, election_id, name) VALUES ('cand-1','school-2026','Alice Smith'), ('cand-2','school-2026','Bob Jones');

INSERT INTO voters (voter_id, name, email, password_hash, registered) VALUES ('1001','John Doe','john@example.com','$bcrypt$...$',true), ('1002','Jane Roe','jane@example.com','$bcrypt$...$',true);

Example vote record (votes table) vote_id: auto election_id: school-2026 voter_id: 1001 ballot: {"choice":"cand-1"} timestamp: 2026-04-01T10:05:00Z receipt_hash: sha256:abcd1234...

Audit log (append-only)

{ "audit_id": 1, "event_type": "VOTE_CAST", "payload": { "election_id": "school-2026", "voter_id": "1001", "receipt_hash": "sha256:abcd1234..." }, "timestamp": "2026-04-01T10:05:00Z", "prev_hash": null, "hash": "sha256:..." }

Developer Notes

• Validate ballots strictly and normalize JSON before hashing (canonical order).

• Persist audit entry before returning receipt (atomicity).

• For anonymous elections, decouple authentication from ballot record (store anon token only).

• Add unit & integration tests: vote flows, duplicate prevention, tally algorithms.

• Consider separate read model for results to optimize reporting.

Contributing

• Fork, branch, add tests, run the test suite, open a PR describing changes.

• Follow Java/React coding standards and include unit tests for business logic (tallying, receipt generation).

