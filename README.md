# Workshop Booking Portal

> A platform for coordinators to propose, book, and manage free FOSS workshops conducted by IIT Bombay instructors — built with Django and a custom Playful Geometric design system.

![screenshot-landing](https://github.com/user-attachments/assets/fef97306-6e5c-40a1-a25a-f4dca176a854)


---

## What It Does

This portal connects **workshop coordinators** with **IIT Bombay instructors** to streamline the booking of free FOSS (Free and Open Source Software) workshops. Coordinators can browse, propose, and track workshops. Instructors manage their availability and respond to proposals. A guest demo mode lets anyone explore the full dashboard instantly with one command.

---

## Features

| Feature | Description |
|---|---|
| Workshop Management | Instructors can create, accept, reject, postpone, or delete workshops |
| Statistics Dashboard | Monthly counts, instructor/coordinator profile stats, upcoming sessions |
| Geographic Visualization | Workshops plotted on a Map of India |
| Analytics | Pie charts by workshop type, profile comment system |
| Playful Geometric UI | Custom design system with animations and micro-interactions |
| Guest Demo Mode | One-command seeding to explore the full dashboard instantly |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Django 3.2 LTS, Python 3.10 / 3.11 |
| Database | SQLite (dev), configurable for PostgreSQL |
| Frontend | Vanilla HTML / CSS / JS, no external CSS frameworks |
| Styling | CSS Custom Properties (design tokens) |
| Analytics | Pandas |
| Config | python-decouple |

---

## Getting Started

### Prerequisites

- Python **3.10 or 3.11** (Python 3.12+ is not supported by this dependency set)
- pip (latest recommended)
- Git (any recent version)

---

### 1. Clone the Repository

```bash
git clone https://github.com/krishlazybuilds-commits/workshop_booking_public.git
cd workshop_booking_public
```

---

### 2. Create & Activate a Virtual Environment

**Windows (PowerShell)**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Windows (Command Prompt)**
```cmd
python -m venv venv
venv\Scripts\activate.bat
```

**macOS / Linux**
```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` at the start of your terminal prompt once active.

---

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

If you already have a virtual environment with Django 5.x, force-reinstall the pinned dependencies:

```bash
pip install --upgrade --force-reinstall -r requirements.txt
```

Key packages installed:

| Package | Purpose |
|---|---|
| `Django>=3.2,<4` | Web framework |
| `pandas` | Data processing for analytics |
| `python-decouple>=3.3` | Environment variable management |
| `django-recurrence==1.11.1` | Recurring event support |
| `coverage` | Test coverage reporting |

---

### 4. Configure Environment Variables

Copy the sample env file:

```bash
cp .sampleenv .env
```

For local development, the defaults work out of the box:

```env
DB_ENGINE=sqlite3
DB_NAME=db.sqlite3
DB_USER=
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=
```

Edit `local_settings.py` with email credentials (placeholder values are fine for local dev since emails print to the console by default):

```python
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = '587'
EMAIL_HOST_USER = 'your@email.com'
EMAIL_HOST_PASSWORD = 'your-password'
EMAIL_USE_TLS = True
SENDER_EMAIL = 'your@email.com'
```

---

### 5. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

### 6. Create a Superuser

```bash
python manage.py createsuperuser
```

Follow the prompts to set a username, email, and password.

---

### 7. Seed the Guest Demo User *(Recommended)*

```bash
python manage.py seed_guest
```

This creates a ready-to-use demo account pre-loaded with sample data:

| | |
|---|---|
| Username | `guest` |
| Password | `fossee@guest` |

What gets seeded:
- A guest coordinator profile, fully filled out
- 3 Workshop Types (Python, Scilab, DWSIM)
- 5 sample workshops with mixed Accepted/Pending statuses

Safe to run multiple times — it resets only the guest user and their workshops.

---

### 8. Start the Development Server

```bash
python manage.py runserver
```

| URL | Page |
|---|---|
| `http://localhost:8000/` | Landing page |
| `http://localhost:8000/workshop/login/` | Sign in |
| `http://localhost:8000/admin/` | Django admin panel |

---

### 9. Initial Admin Setup

1. Go to `http://localhost:8000/admin/` and log in with your superuser credentials
2. Under **Authentication and Authorization → Groups**, create a group called `instructor`
3. Assign **all permissions** to the `instructor` group
4. New users are coordinators by default. To promote a user to instructor:
   - Set their profile `position` to `instructor`
   - Add them to the `instructor` group

---

## Quick Reference

```bash
# Clone
git clone https://github.com/krishlazybuilds-commits/workshop_booking_public.git
cd workshop_booking_public

# Virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1       # Windows PowerShell
# source venv/bin/activate         # macOS/Linux

# Install
pip install -r requirements.txt

# Database
python manage.py makemigrations
python manage.py migrate

# Admin user
python manage.py createsuperuser

# Demo data
python manage.py seed_guest

# Run
python manage.py runserver
```

---

## User Roles

### Instructor
- Create workshops based on availability
- Accept, reject, postpone, or delete proposals
- View monthly statistics and upcoming sessions
- Comment on coordinator profiles

### Coordinator
- Browse and book workshops from instructor posts
- Propose custom workshop dates
- Track workshop status and history

### Guest (Demo)
- Pre-seeded coordinator account for instant exploration
- Login: `guest` / `fossee@guest`

---

## Screenshots

### Sign In

![screenshot-signin](https://github.com/user-attachments/assets/3130a578-900a-42be-9c97-8f051ea461df)


### Register

![screenshot-register](https://github.com/user-attachments/assets/e123e95a-9988-4b0e-8636-bda61eb751e6)


### Dashboard

Once logged in, you land on your coordinator dashboard showing total, accepted, pending, and upcoming workshops at a glance.

![screenshot-dashboard](https://github.com/user-attachments/assets/29ee7e37-d4ab-4d3f-af9d-54fa683e764b)


### Propose a Workshop

Select a workshop type and a preferred date. Proposals only take a minute to fill out.

![screenshot-propose](https://github.com/user-attachments/assets/9b99935b-5689-4c50-9244-cddfe7cf658d)


### Workshop Types

Browse the available workshop catalog — Python, Scilab, DWSIM, and more — with durations and full descriptions.

![screenshot-workshop-types](https://github.com/user-attachments/assets/35729be0-d69c-4463-9c9b-4af05c8686d7)


### Statistics

Filter workshops by date range, type, or state. Export results as CSV or view as a chart.

![screenshot-statistics](https://github.com/user-attachments/assets/490e3504-1492-433c-a318-01835bbe9ba4)


---

## Design System — Playful Geometric

The frontend uses a custom design system with no external CSS frameworks.

- **Design Tokens** — Centralized CSS variables for colors, typography, spacing, and shadows
- **Custom Dropdowns** — `<select>` elements auto-converted into styled comboboxes, pill selectors, and typeahead inputs
- **Card Grids** — Clickable icon cards replacing dropdowns for better UX
- **Page Transitions** — Full-screen wipe animations between auth pages
- **Video Backgrounds** — Looping geometric animation on sign-in/sign-up panels
- **Responsive Layout** — Mobile-first grids that collapse gracefully on small screens

| Component | Variants |
|---|---|
| `pg-dropdown` | `default`, `combobox`, `pills`, `typeahead` |
| Buttons | `btn-candy` (primary), `btn-outline` (secondary) |
| Cards | `card-sticker` with pop shadows |
| Animations | `slide-up`, `pop-in`, `float`, `wiggle`, `spin-slow` |

---

## Project Structure

```
workshop_booking/
├── workshop_app/           # Core application
│   ├── models.py           # Profiles, workshops, comments, testimonials
│   ├── views.py            # View controllers
│   ├── forms.py            # Registration, login, workshop forms
│   ├── send_mails.py       # Email notification logic
│   ├── reminder_script.py  # Workshop reminder automation
│   ├── management/commands/seed_guest.py
│   ├── templates/          # All HTML templates
│   └── static/             # CSS, JS, video assets
├── statistics_app/         # Charts, maps, analytics
├── cms/                    # Content management
├── teams/                  # Team management
├── workshop_portal/        # Django project config (settings, urls, wsgi)
├── docs/                   # Documentation
├── local_settings.py       # Email credentials (not committed)
├── .sampleenv              # Sample environment variables
├── requirements.txt
└── manage.py
```

---

## Running Tests

```bash
# Run all tests
python manage.py test

# Run with coverage
coverage run manage.py test
coverage report
coverage html    # Generates htmlcov/ directory
```

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `ModuleNotFoundError: No module named 'decouple'` | Run `pip install -r requirements.txt` inside your venv |
| `ImportError` from `local_settings` | Ensure `local_settings.py` exists in the project root |
| Database errors after model changes | Run `makemigrations` then `migrate` |
| `(venv)` not showing in terminal | Virtual environment isn't active — re-run the activate command |
| Port 8000 already in use | Use `python manage.py runserver 8080` |
| Static files not loading | Run `python manage.py collectstatic` |

---

## License

Licensed under the **GNU General Public License v3.0** — see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by FOSSEE, IIT Bombay
