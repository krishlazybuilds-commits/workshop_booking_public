<p align="center">
  <img src="https://img.shields.io/badge/Django-3.0-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django 3.0" />
  <img src="https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3" />
  <img src="https://img.shields.io/badge/License-GPL_v3-blue?style=for-the-badge" alt="License GPL v3" />
  <img src="https://img.shields.io/badge/Design-Playful_Geometric-8B5CF6?style=for-the-badge" alt="Playful Geometric" />
</p>

# 🎓 FOSSEE Workshop Booking Portal

> A platform for coordinators to **propose, book, and manage** free FOSS (Free and Open Source Software) workshops conducted by **IIT Bombay** instructors — built with Django and a modern **Playful Geometric** design system.

---

## ✨ Highlights

| Feature | Description |
|---------|-------------|
| 📋 **Workshop Management** | Instructors can create, accept, reject, postpone, or delete workshops |
| 📊 **Statistics Dashboard** | Monthly counts, instructor/coordinator profile stats, upcoming workshops |
| 🗺️ **Geographic Visualization** | Workshops plotted over the Map of India |
| 📈 **Analytics** | Pie charts by workshop type, profile comment system |
| 🎨 **Playful Geometric UI** | Modern design system with custom components, animations, and micro-interactions |
| 👤 **Guest Demo Mode** | One-command seeding to explore the full dashboard instantly |

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| **Python** | 3.8 or higher |
| **pip** | Latest recommended |
| **Git** | Any recent version |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/krishlazybuilds-commits/workshop_booking_public.git
cd workshop_booking_public
```

---

### Step 2 — Create & Activate a Virtual Environment

**Windows (PowerShell):**

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**

```cmd
python -m venv venv
venv\Scripts\activate.bat
```

**macOS / Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

> **Tip:** You should see `(venv)` at the beginning of your terminal prompt once the virtual environment is active.

---

### Step 3 — Install Dependencies

```bash
pip install -r requirements.txt
```

This installs:

| Package | Purpose |
|---------|---------|
| `Django>=3.0.7` | Web framework |
| `pandas` | Data processing for statistics & analytics |
| `python-decouple>=3.3` | Environment variable management |
| `django-recurrence` | Recurring event support |
| `pyaml` | YAML configuration parsing |
| `coverage` | Test coverage reporting |

---

### Step 4 — Configure Environment Variables

1. Copy the sample environment file:

   ```bash
   cp .sampleenv .env
   ```

2. Edit `.env` with your settings (only needed for **production** — defaults work for local dev):

   ```env
   DB_ENGINE=sqlite3           # Default, no change needed for dev
   DB_NAME=db.sqlite3          # Default, no change needed for dev
   DB_USER=                    # Leave blank for SQLite
   DB_PASSWORD=                # Leave blank for SQLite
   DB_HOST=localhost
   DB_PORT=
   ```

3. Edit `local_settings.py` with email credentials (can use placeholder values for local dev since `EMAIL_BACKEND` defaults to console):

   ```python
   EMAIL_HOST = 'smtp.gmail.com'       # Or your SMTP host
   EMAIL_PORT = '587'
   EMAIL_HOST_USER = 'your@email.com'
   EMAIL_HOST_PASSWORD = 'your-password'
   EMAIL_USE_TLS = True
   SENDER_EMAIL = 'your@email.com'
   ```

> **Note:** In development, emails are printed to the console by default (`EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'`), so placeholder values work fine.

---

### Step 5 — Run Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

### Step 6 — Create a Superuser (Admin)

```bash
python manage.py createsuperuser
```

Follow the prompts to set a username, email, and password.

---

### Step 7 — Seed the Guest Demo User *(Recommended)*

```bash
python manage.py seed_guest
```

This creates a ready-to-use demo account pre-loaded with sample data:

| | |
|---|---|
| **Username** | `guest` |
| **Password** | `fossee@guest` |

**What gets seeded:**

- ✅ A guest user with a fully filled-out coordinator profile
- ✅ 3 Workshop Types (Python, Scilab, DWSIM) — if none exist yet
- ✅ 5 sample workshops (mix of Accepted & Pending statuses)

> **Safe to run multiple times** — it resets the guest user and their workshops while preserving all other data.

---

### Step 8 — Run the Development Server

```bash
python manage.py runserver
```

Open your browser and navigate to:

| URL | Page |
|-----|------|
| `http://localhost:8000/` | Landing page |
| `http://localhost:8000/workshop/login/` | Sign in (use guest credentials or your superuser) |
| `http://localhost:8000/admin/` | Django admin panel |

---

### Step 9 — Initial Admin Setup

1. Navigate to `http://localhost:8000/admin/` and log in with your **superuser** credentials
2. Under **Authentication and Authorization → Groups**, create a group called `instructor`
3. Assign **all permissions** to the `instructor` group
4. By default, new users are **coordinators** — use the admin panel to promote users:
   - Change their profile `position` to `instructor`
   - Add them to the `instructor` group

---

## 📋 Quick Reference — All Commands

```bash
# Clone
git clone https://github.com/krishlazybuilds-commits/workshop_booking_public.git
cd workshop_booking_public

# Virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1          # Windows PowerShell
# source venv/bin/activate           # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Database setup
python manage.py makemigrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Seed demo data (optional but recommended)
python manage.py seed_guest

# Start server
python manage.py runserver
```

---

## 📁 Project Structure

```
workshop_booking/
├── workshop_app/                  # Core application
│   ├── models.py                  # User profiles, workshops, comments, testimonials
│   ├── forms.py                   # Registration, login, workshop forms
│   ├── views.py                   # View controllers
│   ├── urls.py                    # App URL routing
│   ├── admin.py                   # Admin panel configuration
│   ├── send_mails.py              # Email notification logic
│   ├── reminder_script.py         # Workshop reminder automation
│   ├── management/
│   │   └── commands/
│   │       └── seed_guest.py      # Guest demo user seeder
│   ├── templates/
│   │   └── workshop_app/
│   │       ├── landing.html       # Landing / home page
│   │       ├── login.html         # Sign-in page
│   │       ├── register.html      # Sign-up page
│   │       ├── dashboard.html     # User dashboard
│   │       ├── propose_workshop.html
│   │       ├── view_profile.html
│   │       ├── workshop_status_coordinator.html
│   │       ├── workshop_status_instructor.html
│   │       └── ...                # + more templates
│   ├── static/
│   │   └── workshop_app/
│   │       ├── css/
│   │       │   ├── design-tokens.css       # Color, typography & spacing tokens
│   │       │   ├── playful-geometric.css   # Design system components
│   │       │   ├── dashboard.css           # Dashboard styles
│   │       │   ├── landing.css             # Landing page styles
│   │       │   ├── signin.css / signup.css  # Auth page styles
│   │       │   ├── profile.css             # Profile page styles
│   │       │   ├── statistics.css          # Statistics page styles
│   │       │   └── ...                     # + more page-specific styles
│   │       ├── js/
│   │       │   ├── pg-dropdown.js          # Custom dropdown component
│   │       │   └── ...                     # jQuery, Bootstrap, etc.
│   │       └── video/
│   │           └── geometric-bg.mp4        # Auth panel background video
│   ├── templatetags/              # Custom Django template tags
│   └── tests/                     # Unit & integration tests
├── statistics_app/                # Workshop statistics & analytics
│   ├── views.py                   # Stats views (charts, maps, tables)
│   └── templates/                 # Statistics templates
├── cms/                           # Content management system
│   ├── models.py                  # CMS pages, banners
│   └── views.py                   # CMS page rendering
├── teams/                         # Team management
│   ├── models.py                  # Team member model
│   └── admin.py                   # Team admin panel
├── workshop_portal/               # Django project configuration
│   ├── settings.py                # Main settings
│   ├── urls.py                    # Root URL configuration
│   └── wsgi.py                    # WSGI entry point
├── docs/                          # Documentation
│   └── Getting_Started.md         # Legacy setup guide
├── local_settings.py              # Email credentials (not committed)
├── .sampleenv                     # Sample environment variables
├── requirements.txt               # Python dependencies
├── manage.py                      # Django management script
├── .coveragerc                    # Test coverage configuration
├── .travis.yml                    # CI configuration
└── LICENSE                        # GNU GPL v3
```

---

## 🎨 Design System — *Playful Geometric*

The frontend is powered by a custom design system featuring:

- **Design Tokens** — Centralized CSS variables for colors, typography, spacing, shadows & radii
- **Custom Dropdown Components** — Auto-converting `<select>` elements into styled comboboxes, pill selectors, and typeahead inputs with accent bars and keyboard navigation
- **Interactive Card Grids** — Clickable icon cards replacing dropdown selects for better UX
- **Page Transition Overlays** — Full-screen wipe animations with designer typography between auth pages
- **Video Backgrounds** — Looping geometric animation on the sign-in/sign-up branding panels
- **Responsive Layout** — Mobile-first grid layouts that gracefully collapse on smaller screens

### Component Variants

| Component | Variants |
|-----------|----------|
| `pg-dropdown` | `default`, `combobox`, `pills`, `typeahead` |
| Buttons | `btn-candy` (primary), `btn-outline` (secondary) |
| Cards | `card-sticker` with pop shadows |
| Animations | `slide-up`, `pop-in`, `float`, `wiggle`, `spin-slow` |

---

## 👥 User Roles

### 🎤 Instructor
- Create workshops based on availability
- Accept, reject, postpone, or delete workshop proposals
- View monthly workshop statistics and upcoming sessions
- Read and post comments on coordinator profiles

### 📝 Coordinator
- Browse and book workshops from instructor posts
- Propose custom workshop dates based on their convenience
- Track workshop status and history

### 👤 Guest (Demo)
- Pre-seeded coordinator account for instant exploration
- Comes with sample workshops and a filled profile
- Login: `guest` / `fossee@guest`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------:|
| **Backend** | Django 3.0, Python 3 |
| **Database** | SQLite (dev), configurable for PostgreSQL |
| **Frontend** | Vanilla HTML/CSS/JS with custom design system |
| **Styling** | CSS Custom Properties (design tokens), no external CSS frameworks |
| **Components** | Custom JS dropdown library (`pg-dropdown.js`) |
| **Analytics** | Pandas for data processing |
| **Config** | python-decouple for environment management |

---

## 🧪 Running Tests

```bash
# Run all tests
python manage.py test

# Run with coverage
coverage run manage.py test
coverage report
coverage html          # Generates htmlcov/ directory
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError: No module named 'decouple'` | Run `pip install -r requirements.txt` inside your venv |
| `ImportError` from `local_settings` | Ensure `local_settings.py` exists in the project root with email variables |
| Database errors after model changes | Run `python manage.py makemigrations && python manage.py migrate` |
| `(venv)` not showing in terminal | Your virtual environment isn't active — re-run the activate command |
| Port 8000 already in use | Use `python manage.py runserver 8080` to run on a different port |
| Static files not loading | Run `python manage.py collectstatic` if serving with a production server |

---

## 📄 License

This project is licensed under the **GNU General Public License v3.0** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <sub>Built with ❤️ by <strong>FOSSEE, IIT Bombay</strong></sub>
</p>
