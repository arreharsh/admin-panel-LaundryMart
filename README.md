# Laundry Mart Admin Panel

A modern **Admin Dashboard** built with **React**, **Tailwind CSS**, and **Socket.io** to manage laundry bookings and provide **real-time customer support chat**.

This panel is used by admins to monitor orders, update booking status, and communicate live with customers from the Laundry Mart app.

---

## Features

- Admin login
- View all laundry bookings
- Update booking status (Pending / Completed / Cancelled)
- Real-time customer support chat
- Live message updates using Socket.io
- Responsive UI for desktop and tablet

---

## Tech Stack

- React.js
- Tailwind CSS
- Socket.io (real-time chat)
- Axios
- JWT Authentication

---

## Setup

### 1. Install dependencies
```bash
npm install
```
---

### Admin Functionalities
📋 Booking Management

- Fetch all bookings from backend

- Update booking status in real time

- Status updates are reflected instantly

### 📩 Customer Support Chat

- Real-time chat with users

- Powered by Socket.io

- Used for order support and queries

### 🔗 API Integration
- Admin APIs

`POST /api/admin/login`

`GET /api/admin/bookings`

`PATCH /api/admin/booking/:id`

### 🔌 Socket.io Events

- connection

- join_room

- send_message

- receive_message

### 🔐 Security

- JWT-based admin authentication

- Protected admin routes

- Environment variables for configuration

- No sensitive data stored in frontend

### 🎯 Project Purpose

This admin panel is part of the Laundry Mart system and helps admins:

- Manage daily operations

- Track customer orders

- Provide instant support via live chat


