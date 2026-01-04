VOTING SYSTEM

A simple, extensible Voting System for casting and counting votes in elections. Supports optional user authentication, vote verification (receipts, audit trail), and demonstrates key programming concepts: file handling, collections, object-oriented design (OOP), and exception handling. This README covers project overview, features, architecture, tech stack, quick start, user guide, API endpoints, voting algorithms, project layout, database schema, screenshot descriptions, troubleshooting, production deployment, and sample data.

Project Overview

This repository implements a voting platform that lets authorized users cast votes and administrators tally results. The system stores vote records persistently (file or database), issues verification receipts, and maintains an append-only audit trail to detect tampering. The design is modular and easy to extend (new voting methods, storage backends, or UI).

Goals:

• Provide a secure, traceable voting flow.

• Demonstrate OOP, file handling, collections, and exception handling.

• Be a learning foundation or baseline for production-grade systems.

Key Features

• Create and manage elections (single-choice by default; extendable).

• Register voters and optionally authenticate them (passwords or tokens).

• Cast votes with receipt-based verification.

• Append-only audit log with optional hash chaining for tamper-detection.

• Tally results (real-time and end-of-election).

• Pluggable persistence: JSON/CSV file storage or SQL DB.

• Input validation and robust exception handling.

• REST API and CLI examples included.
ARCHITECTURE

• Presentation: CLI or REST API (lightweight web server).

• Service Layer: ElectionService, AuthService, TallyService—contains business rules and validation.

• Persistence Layer: FilePersistenceService (JSON/append-only logs) or DBPersistenceService (SQL).

• Models: Voter, Candidate, Election, Ballot, VoteRecord.

• Utilities: Crypto helpers (hash receipts), validators, file helpers, logging.

Separation of concerns enables easy testing and swapping of storage backends.
User Guide (high level)

• Admins:

• Create election: define name, type (single/irv), candidate list, start/end times.

• Add or remove candidates (before election opens).

• Tally results once election is closed.

• Voters:

• Register (if required) and authenticate.

• Cast vote during election window.

• Receive a receipt (hash) to verify vote was recorded.

• Verification:

• Voter checks receipt hash against the audit log endpoint to confirm presence.
API Endpoints

All endpoints respond JSON and use Authorization: Bearer <token> when required.

• POST /api/v1/auth/register

• Request: { "voter_id": "1001", "name":"John", "password":"pass" }

• Response: { "status": "registered", "voter_id": "1001" }

• POST /api/v1/auth/login

• Request: { "voter_id":"1001", "password":"pass" }

• Response: { "token": "<jwt>" }

• POST /api/v1/elections

• Auth: admin

• Request: { "id":"school-2026", "name":"School Board 2026", "type":"single", "starts":"2026-04-01T00:00:00Z", "ends":"2026-04-02T00:00:00Z" }

• Response: { "status":"created", "election_id":"school-2026" }

• POST /api/v1/elections/{id}/candidates

• Request: { "name": "Alice Smith" }

• Response: { "status":"candidate_added", "candidate_id":"c1" }

• POST /api/v1/elections/{id}/vote

• Auth: voter

• Request: { "voter_id":"1001", "ballot": { "choice": "c1" } }
• Response: { "status":"recorded", "receipt":"sha256:..." }

• GET /api/v1/elections/{id}/results

• Auth: admin or public (configurable)

• Response: results JSON with counts and winner(s)

• GET /api/v1/audit/receipt/{receipt_hash}

• Returns whether record exists and timestamp.
Voting Algorithms

Provided examples: Plurality (first-past-the-post) and Instant-Runoff Voting (IRV).

• Plurality (single-choice)

• For each recorded ballot, increment candidate count for ballot.choice.

• Winner = candidate with max votes.

• Tie-handling: configurable (random, run-off, alphabetical).

Pseudocode: counts = map(candidate -> 0) for vote in votes: counts[vote.choice] += 1 winner = argmax(counts)

• Instant-Runoff Voting (IRV) / Ranked-choice

1. Count first-choice votes.

2. If any candidate >50%, they win.

3. Else eliminate candidate(s) with fewest votes; reassign ballots with eliminated candidate to next preference.

4. Repeat until winner(s) decided or tie.

Pseudocode (simplified): while True: counts = count_first_choices(ballots) if max(counts) > total_ballots / 2: return candidate_with_max eliminated = candidates_with_min_count(counts) if all candidates eliminated or tie: handle_tie() ballots = reassign_ballots(ballots, eliminated) remove eliminated from candidates
Project Structure (suggested)

• README.md

• LICENSE

• .env.example

• requirements.txt / package.json / pom.xml

• src/

• models/

• election.py

• voter.py

• candidate.py

• ballot.py

• services/

• election_service.py

• auth_service.py

• persistence_service.py

• tally_service.py
• api/

• app.py

• routes.py

• cli/

• main.py

• utils/

• crypto.py

• validators.py

• file_helpers.py

• data/

• elections.json

• votes.log (append-only)

• users.json

• audit.log

• scripts/

• init_db.py

• import_sample_data.py
• tests/

• test_election.py

• test_tally.py

• test_auth.py       
Database Schema

Two supported persistence models:

1. File-based (JSON / append-only log)

• elections.json: list of elections { "id":"school-2026", "name":"School Board 2026", "type":"single", "candidates":[{"id":"c1","name":"Alice"}], "starts":"...", "ends":"..." }

• votes.log: append-only newline JSON per vote {"election_id":"school-2026","voter_id":"1001","ballot":{"choice":"c1"},"timestamp":"2026-01-01T12:00:00Z","receipt":"sha256:..."}

• users.json: [{"voter_id":"1001","name":"John","password_hash":"$pbkdf2$...", "registered":true}]

2. SQL (example relational schema)

• voters (voter_id PK, name, password_hash, registered BOOLEAN, metadata JSON)

• elections (id PK, name, type, starts TIMESTAMP, ends TIMESTAMP, metadata JSON)

• candidates (id PK, election_id FK, name, metadata JSON)

• votes (id PK, election_id FK, voter_id FK NULLABLE, ballot JSON, timestamp, receipt_hash)

• audit_log (id PK, event_type, payload JSON, timestamp, prev_hash, hash)
Exception Handling & Logging Notes

• Validate inputs and raise domain-specific exceptions (e.g., ElectionNotFoundError, InvalidBallotError, VotingWindowClosedError).

• Log all exception stack traces to a separate error log file.

• Use retries or safe-fail behavior where appropriate (e.g., temporary DB outage).

• Ensure audit.log writes are best-effort and recorded before returning receipt to voter (to avoid lost votes).
Production Deployment

1. Use a real RDBMS (Postgres) rather than file-based storage for concurrency and durability.

2. Environment variables:

• SECRET_KEY, DB_URL, DATA_DIR, AUTH_MODE, LOG_LEVEL

3. Containerization:

• Provide a Dockerfile and docker-compose.yml:

• app service, db service, and volume mounts for persistent data.

4. Backups:

• Schedule DB backups and file backups for audit logs.

• Maintain WORM (write once read many) or immutable storage for audit logs if possible.

5. Security:

• Use HTTPS with valid certificates.

• Restrict admin endpoints behind authentication and role checks.

• Rotate secrets and store them in a secret manager.

6. Scaling:

• For read-heavy operations (results), use caching (Redis).

• For writes, ensure the DB handles concurrency; avoid local files as single source of truth.

7. Monitoring:

• Add health check endpoint (/health).

• Integrate with Prometheus / Grafana for metrics (requests, errors, vote rates).

8. High integrity:

• Consider hardware security modules (HSM) for cryptographic operations.

• Add audit trail immutability (append-only logs

Contributing

• Fork, create a branch, make changes, add tests, and submit a PR.

• Follow code style and include unit tests for new behavior.

• Use descriptive commit messages and link issues.
