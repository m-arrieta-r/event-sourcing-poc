# 🚀 Lending Origination System (Event-Sourced)

A robust, functional implementation of a Lending Origination System (LOS) leveraging **Event Sourcing** and **Clean Architecture** principles.

Developed using the [backend-skeleton](https://github.com/miarrietar/backend-skeleton) framework, this project demonstrates a modern approach to managing complex domain lifecycles with a high degree of auditability and state integrity.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Hono](https://img.shields.io/badge/Hono-E36002?style=flat-square&logo=hono&logoColor=white)](https://hono.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Architecture](https://img.shields.io/badge/Architecture-Event--Sourcing-blueviolet?style=flat-square)](#architecture)

---

## 🎯 Project Overview

This repository is a Proof of Concept (POC) for a lending platform inspired by modern fintech architectures (like Nubank). It focuses on:
- **Immutable State:** Reconstructing aggregate state from a stream of domain events.
- **Pure Functions:** Implementing `decide` and `evolve` logic without side effects.
- **Domain-Driven Design (DDD):** Aligning technical implementation with the Lending Origination domain.

## 🏗 Architecture

The project strictly adheres to the patterns defined in the **[backend-skeleton](https://github.com/miarrietar/backend-skeleton)**:

- **Domain Layer:** Pure business logic (`decide` for commands, `evolve` for state transitions).
- **Application Cases:** Orchestration of domain rules and persistence.
- **Infrastructure:** SQLite event store and Hono web server.

### Why Event Sourcing?
By treating every state change as a first-class event, we gain:
- 🛡️ **Complete Audit Trail:** Every decision (approval/rejection) is recorded.
- ⚡ **Temporal Querying:** View the state of any loan at any point in time.
- 🔄 **Scalable Projections:** Easily rebuild read models or transition to different databases.

## ✨ Core Features

- **Request Loan:** Initiate a new lending proposal with personal and financial data.
- **Credit Analysis:** Automated rule evaluation (e.g., Income vs. Amount) to approve or reject proposals.
- **Loan Tracking:** List and monitor the status of all loan applications via REST API.

## 🛠 Tech Stack

- **Runtime:** Node.js (via `tsx`)
- **Language:** TypeScript 5.x
- **Web Framework:** [Hono](https://hono.dev/)
- **Database:** SQLite (Persistent Event Store)
- **Paradigm:** Strict Functional Programming

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
git clone https://github.com/miarrietar/event-sourcing-poc.git
cd event-sourcing-poc
npm install
```

### Running the Application
```bash
# Start the development server (auto-reloading)
npm run dev

# Run E2E tests
npm run test:e2e
```

## 🤝 Reference
This project is an extension and practical implementation of the principles found in the [Backend Skeleton](https://github.com/miarrietar/backend-skeleton). 

