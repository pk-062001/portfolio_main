---
title: StayScape
tagline: An Airbnb-style marketplace for listing and booking stays.
summary: A two-sided lodging marketplace where hosts publish properties with photo galleries and guests browse, filter and book — with secure authentication and a responsive booking journey.
year: '2023'
role: Solo — full stack
team: 1 engineer
status: Case study
stack: [React, Node.js, Express, MongoDB, JWT, Cloudinary]
highlights:
  - Host and guest flows in one product
  - Cloudinary-backed image uploads
  - JWT-secured listings and bookings
  - Responsive search and booking UI
accent: '#3fd0a4'
mock: marketplace
featured: true
order: 3
---

## The problem

Marketplaces are hard because they serve two audiences at once. Hosts need simple tools to publish and manage listings; guests need fast discovery and a booking flow they trust.

## What I built

StayScape covers the core of a short-term-rental marketplace: host onboarding, listing creation with image galleries, browsing and filtering for guests, listing detail pages and booking — all behind secure authentication.

## Architecture

- **API:** Express REST resources for users, listings and bookings, following an MVC structure.
- **Auth:** JWT authentication with ownership checks, so only a listing's host can edit or delete it.
- **Media:** images upload straight to Cloudinary and are delivered through its CDN, keeping the API server lean.
- **Data:** MongoDB models for listings, bookings and users, with references between them for host dashboards.

## What I learned

How to model a two-sided marketplace, enforce ownership rules cleanly, and offload media to a CDN so the application stays fast.
