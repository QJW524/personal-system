# VPS Deployment Specification

## Purpose

Define the GitHub Actions and Docker Compose deployment baseline for the VPS.

## Requirements

### Requirement: Deployment triggers
The system SHALL offer a GitHub Actions deployment workflow that runs on pushes to `main` and on manual dispatch.

#### Scenario: Code is pushed to main
- **WHEN** a commit is pushed to the `main` branch
- **THEN** GitHub Actions invokes the remote deployment script over SSH

#### Scenario: A manual deployment is requested
- **WHEN** an operator manually dispatches the deployment workflow
- **THEN** GitHub Actions invokes the same remote deployment script over SSH

### Requirement: Ordered Docker Compose rollout
The remote deployment script SHALL update the `main` checkout, build images, start PostgreSQL and Redis, run Prisma production migrations, and then update the web service.

#### Scenario: A deployment runs successfully
- **WHEN** the deployment script runs with a valid `APP_DIR`
- **THEN** it pulls `origin/main`, builds images, starts `db` and `redis`, runs the `migrate` service, starts `web`, and prints service status

#### Scenario: A production migration fails
- **WHEN** the Prisma production migration exits unsuccessfully
- **THEN** the deployment script exits before updating the web service

### Requirement: SSH connection verification
The system SHALL provide a manually dispatched GitHub Actions workflow for checking VPS SSH access and Docker availability.

#### Scenario: An operator runs the connection check
- **WHEN** the operator manually dispatches the connection verification workflow
- **THEN** GitHub Actions connects to the VPS and reports basic host and Docker information
