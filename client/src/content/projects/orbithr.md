---
title: OrbitHR
tagline: Multi-tenant HR & attendance platform with geofenced selfie check-ins.
summary: A full HR operating system for companies of any size — employees check in with geolocation and a selfie verified against an office geofence, while HR runs leave, payroll and announcements from a live dashboard. Every organisation is fully isolated inside one deployment.
year: '2026'
role: Solo — architecture, backend, frontend
team: 1 engineer
status: Live
live: https://orbit-hr-frontend.vercel.app/login
stack: [React, Node.js, Express, MongoDB, Socket.io, JWT, PDFKit, Leaflet, Recharts, Tailwind CSS]
highlights:
  - Tenant-isolated data — every query scoped by organisation
  - Geofenced selfie check-in using Haversine distance
  - Live attendance map with a real-time Socket.io feed
  - Bulk payroll runs with PDF payslips and an audit log
accent: '#ff6b35'
featured: true
order: 1
---

## The problem

Small and mid-sized companies still track attendance on spreadsheets or buy hardware punch-clocks. Field and hybrid teams make it worse: there is no reliable way to know *who* checked in, *where* they were and whether it was really them — and payroll is assembled by hand at the end of the month.

## What I built

OrbitHR is a single MERN application that serves many companies at once.

**For employees** — JWT login scoped to an organisation slug, check-in/out with browser geolocation and a camera selfie, attendance history, regularisation requests for missed punches, leave applications with live balances, downloadable PDF payslips, a holiday calendar and company announcements.

**For admins, HR and managers** — employee management with soft-deactivation (HR data is never hard-deleted), a live attendance dashboard on a Leaflet map with geofence circles and a real-time check-in feed, leave approvals, bulk payroll generation with PDF export, office and geofence configuration, and analytics for attendance trends and department breakdowns.

## Architecture

- **Multi-tenancy:** a shared database with an `organisation` key on every document. Middleware resolves the tenant from the authenticated user and scopes every query, so cross-tenant reads are impossible by construction. The same email can exist in different organisations.
- **Access control:** four roles — admin, HR, manager, employee — enforced at the route level, with an audit log on sensitive actions such as employee edits, leave decisions and payroll runs.
- **Geofencing:** check-ins are validated server-side using the Haversine distance between the device position and the configured office radius — the client is never trusted.
- **Real-time:** Socket.io rooms per organisation push check-ins to the admin dashboard instantly.
- **Documents:** PDFKit renders payslips on the server, so they look identical everywhere.
- **Migration path:** a one-off script backfilled existing single-tenant data into a default organisation, so the switch to multi-tenancy needed no downtime.

## Hard parts

- Keeping attendance **idempotent per day**, which makes offline-first sync a safe next step.
- Designing tenant scoping as a default rather than something each endpoint has to remember.
- Making camera and geolocation capture work in the browser on any phone, with no native app.

## What's next

Offline check-in queues, mock-location detection in a React Native client that reuses the same API, and moving selfie storage to S3/Cloudinary.
