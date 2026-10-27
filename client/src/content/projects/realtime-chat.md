---
title: Real-Time Chat
tagline: Instant messaging with live presence, built on WebSockets.
summary: A responsive real-time chat application where messages appear instantly, online presence stays accurate and conversation history is persisted — built to feel as fast as the messaging apps people already use.
year: '2024'
role: Solo — full stack
team: 1 engineer
status: Case study
stack: [React, Node.js, Express, Socket.io, MongoDB, JWT, Tailwind CSS]
highlights:
  - Bi-directional messaging over Socket.io
  - Live online / offline presence
  - JWT-authenticated socket connections
  - Persistent history in MongoDB
accent: '#7c9cff'
mock: chat
featured: true
order: 2
---

## The problem

Chat feels broken the moment it lags. Messages need to land in milliseconds, presence must be accurate, and nothing can be lost when someone refreshes or drops their connection.

## What I built

A full-stack chat application with a React front end and a Node.js/Express + Socket.io back end. Users sign up, see who is online and exchange messages in real time. Conversations are stored in MongoDB, so history is there whenever they come back.

## Architecture

- **Transport:** Socket.io for real-time events, with REST endpoints for authentication and loading history.
- **Auth:** JWTs are verified during the socket handshake, so only authenticated users can join conversations.
- **Presence:** connect and disconnect events update online status and are broadcast to the relevant users.
- **Persistence:** messages are written to MongoDB before they are acknowledged, keeping the client and the database in sync.
- **UI:** a responsive Tailwind interface that works equally well on desktop and phones.

## What I learned

How to design event contracts between client and server, handle reconnects gracefully, and structure a Node.js server where REST and WebSocket traffic share the same auth and data layers.
