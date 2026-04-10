<p align="center">
  <img src="https://img.shields.io/badge/Django-3.0-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django 3.0" />
  <img src="https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3" />
  <img src="https://img.shields.io/badge/License-GPL_v3-blue?style=for-the-badge" alt="License GPL v3" />
  <img src="https://img.shields.io/badge/Design-Playful_Geometric-8B5CF6?style=for-the-badge" alt="Playful Geometric" />
</p>

# 🎓 FOSSEE Workshop Booking

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

## 🚀 Getting Started

### Prerequisites

- **Python 3.x**
- **pip**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/krishlazybuilds-commits/workshop_booking_public.git
cd workshop_booking_public

# 2. Create and activate a virtual environment
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run migrations
python manage.py makemigrations
python manage.py migrate

# 5. Create a superuser
python manage.py createsuperuser

# 6. Start the development server
python manage.py runserver
```

### Initial Setup

1. Navigate to `http://localhost:8000/admin` and log in with your superuser credentials
2. Under **Groups**, create a group called `instructor` and assign all permissions
3. By default, new users are coordinators — use the admin panel to promote users to **instructor** and add them to the instructor group

> **Note:** Review `settings.py` /  `.sampleenv` to configure environment variables before deploying.

---

## 📁 Project Structure

```
workshop_booking_public/
├── workshop_app/              # Core application
│   ├── models.py              # User profiles, workshops, choices
│   ├── forms.py               # Registration, login, workshop forms
│   ├── views.py               # View controllers
│   ├── templates/             # Django HTML templates
│   │   └── workshop_app/
│   │       ├── landing.html   # Landing page
│   │       ├── login.html     # Sign-in page
│   │       └── register.html  # Sign-up page
│   └── static/
│       └── workshop_app/
│           ├── css/
│           │   ├── design-tokens.css       # Color, typography & spacing tokens
│           │   ├── playful-geometric.css   # Design system components
│           │   ├── landing.css             # Landing page styles
│           │   ├── signin.css              # Sign-in page styles
│           │   └── signup.css              # Sign-up page styles
│           ├── js/
│           │   └── pg-dropdown.js          # Custom dropdown component
│           └── video/
│               └── geometric-bg.mp4       # Background video for auth panels
├── statistics_app/            # Workshop statistics & analytics
├── cms/                       # Content management
├── teams/                     # Team management
├── workshop_portal/           # Django project settings
├── docs/                      # Documentation
│   └── Getting_Started.md     # Detailed setup guide
├── requirements.txt           # Python dependencies
├── manage.py                  # Django management script
└── LICENSE                    # GNU GPL v3
```

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

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Django 3.0, Python 3 |
| **Database** | SQLite (dev), configurable for PostgreSQL |
| **Frontend** | Vanilla HTML/CSS/JS with custom design system |
| **Styling** | CSS Custom Properties (design tokens), no external CSS frameworks |
| **Components** | Custom JS dropdown library (`pg-dropdown.js`) |
| **Analytics** | Pandas for data processing |

---

## 📄 License

This project is licensed under the **GNU General Public License v3.0** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <sub>Built with ❤️ by <strong>FOSSEE, IIT Bombay</strong></sub>
</p>
