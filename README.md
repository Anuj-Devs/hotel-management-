# Hotel Management Dashboard

A modern **Hotel Table Management Dashboard** built with **Angular 21** and **Tailwind CSS**, designed to efficiently manage restaurant/hotel table availability, reservations, and occupancy status through an interactive admin panel.

🔗 **Live Demo:** https://table-manage-gt.vercel.app/

---

## Overview

This project is a responsive and interactive hotel table management system that allows administrators to monitor, update, add, and remove table records in real-time.

The application is focused on providing a clean user experience, reactive dashboard statistics, and seamless table management using local storage persistence.

---

## Tech Stack

- **Angular 21**
- **Tailwind CSS**

---

## Features

### 1. Authentication System

The application starts with a secure **Login Page**.

#### Login Features:
- Angular Reactive Form implementation
- Form validation for required fields
- Route Guard protection for unauthorized access
- Session-based authentication flow

Only the following credentials are allowed:

| Username | Password |
|----------|----------|
|   dev    |    123   |
|   mike   |    test  |

Any other credentials will be rejected.

---

## 2. Protected Dashboard

After successful login, users are redirected to the **Dashboard**, where they can monitor the complete table management system.

The dashboard includes real-time statistics:

- **Total Tables**
- **Available Tables**
- **Occupied Tables**
- **Reserved Tables**

### Dashboard Highlights:
- Fully reactive statistics
- Auto re-rendering whenever table data changes
- Dynamic calculation based on current table status
- Clean and modern admin UI

---

## 3. Interactive Stat Cards

Each dashboard statistic card is interactive.

### On Hover:
- Related table cards become highlighted
- Matching data gets visual focus
- Non-related cards fade into background focus state
- Better visualization of table categories

Example:
- Hovering on **Available Tables** highlights only available tables.
- Hovering on **Reserved Tables** highlights reserved tables only.

This improves usability and quick data understanding.

---

## 4. Dynamic Table Cards

Below the statistics section, table cards are displayed visually.

Each card contains table-specific information such as:

- Table Number
- Capacity
- Current Status
- Reservation details (if applicable)
- Other related metadata

### Data Source:
Initial table data is loaded from a **local JSON file**.

After initialization:

- Data is managed locally inside the application
- Updates are stored in **Browser LocalStorage**
- Data persists across page refreshes
- No backend dependency required

---

## 5. Table Management (CRUD Operations + Quick Actions)

The table management system is designed with **dynamic hover-based interactions**, making administration faster, cleaner, and more intuitive.

Hovering over a table card reveals **contextual action icons**, allowing administrators to instantly perform actions based on the table's current status.

### Quick Actions Available:

- **Edit Table** – Open the edit popup modal to update table details
- **Delete Table** – Remove a table instantly
- **Occupied → Available** – One-click status change for occupied tables
- **Reserved → Occupied** – Smart reservation-to-occupied conversion while preserving guest data

---

### Edit Popup Features:

- Edit table details
- Update seating capacity
- Change table status
- Manage guest / reservation information
- Apply status-based updates
- Delete existing table
- Save changes instantly to LocalStorage

---

### Smart Status Actions

#### Occupied Table
If a table is marked as **Occupied**, a quick-action icon becomes available.

**One-click conversion:**

```text
Occupied → Available
```

Features:
- Instant conversion
- No popup required
- Real-time UI update
- Dashboard stats automatically re-render
- LocalStorage updates immediately

This makes checkout handling much faster.

---

#### Reserved Table
If a table is marked as **Reserved**, a swap / convert action becomes available.

**One-click conversion:**

```text
Reserved → Occupied
```

The system automatically preserves:

- Guest Name
- Number of Guests
- Reservation details

This creates a seamless reservation check-in workflow.

---

### Add / Delete Management

Administrators can also:

#### Add New Table
New table creation supports:
- Table number
- Seating capacity
- Status assignment
- Reservation details (optional)

Newly added tables immediately become part of dashboard calculations.

#### Delete Table
Admin can remove a table instantly.

Features:
- Instant removal
- LocalStorage update
- Statistics auto-refresh
- UI re-render without page reload

---

### Dynamic Snackbar Notifications

Every action triggers a **real-time Snackbar / Toast notification** for instant feedback.

Examples:
- Table updated successfully
- Table marked as Available
- Reservation converted to Occupied
- New table added successfully
- Table deleted successfully

### Benefits:
- Better UX
- Clear action confirmation
- Real-time feedback
- Smooth admin interaction

---

### Admin Controls

Administrators can:

✅ Add new table  
✅ Edit existing table  
✅ Delete existing table  
✅ Change availability status instantly  
✅ Convert Reserved tables to Occupied  
✅ Manage reservations and guest details  
✅ Receive instant action feedback via Snackbar  

All updates instantly reflect in:

- Dashboard statistics
- Table card UI
- Hover interactions
- LocalStorage data
- Real-time Snackbar notifications

---

### Edit Popup Features:

- Edit table details
- Update seating capacity
- Change table status
- Manage guest / reservation information
- Apply status-based updates
- Delete existing table
- Save changes instantly to LocalStorage

---

### Smart Status Actions:

#### Occupied Table
If a table is marked as **Occupied**, a quick-action icon becomes available.

**One-click conversion:**
```text
Occupied → Available
```
---

## 6. Local Storage State Management

The project uses **LocalStorage** for persistence.

### Benefits:
- Fast data access
- No API dependency
- Persistent state after refresh
- Easy local testing
- Lightweight architecture

Flow:

```text
JSON Default Data
      ↓
Application Load
      ↓
Store in LocalStorage
      ↓
User Actions (Add / Edit / Delete / Status Update)
      ↓
Update LocalStorage
      ↓
Reactive UI Re-render
      ↓
Dynamic Snackbar Feedback
