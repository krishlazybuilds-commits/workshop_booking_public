"""
Management command: seed_guest

Creates (or resets) the guest demo user with:
  - Profile filled with realistic sample data
  - 3 Workshop Types (if none exist)
  - 5 sample Workshops (mix of accepted & pending)

Credentials:
  username : guest
  password : fossee@guest

Run:
  python manage.py seed_guest

Safe to run multiple times -- it will reset the guest user
and workshops each time while preserving other data.
"""

from datetime import date, timedelta

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from workshop_app.models import Profile, Workshop, WorkshopType


GUEST_USERNAME = "guest"
GUEST_PASSWORD = "fossee@guest"
GUEST_EMAIL = "guest@fossee.in"
GUEST_FIRST = "Guest"
GUEST_LAST = "User"

GUEST_PROFILE = {
    "title": "Mr",
    "institute": "Indian Institute of Technology, Bombay",
    "department": "computer engineering",
    "phone_number": "9876543210",
    "position": "coordinator",
    "how_did_you_hear_about_us": "FOSSEE website",
    "location": "Mumbai",
    "state": "IN-MH",
    "is_email_verified": True,
}

WORKSHOP_TYPES = [
    {
        "name": "Python",
        "description": (
            "A comprehensive hands-on workshop covering Python programming "
            "fundamentals, data structures, file handling, and introductory "
            "object-oriented programming. Suitable for beginners and "
            "intermediate learners."
        ),
        "duration": 2,
        "terms_and_conditions": (
            "1. Participants must bring their own laptops.\n"
            "2. Python 3.8+ must be pre-installed.\n"
            "3. A stable internet connection is required.\n"
            "4. The coordinator must arrange a computer lab with "
            "projector facilities.\n"
            "5. Minimum 20 participants required."
        ),
    },
    {
        "name": "Scilab",
        "description": (
            "Workshop on Scilab, a free and open-source numerical "
            "computation software. Covers matrix operations, "
            "plotting, Xcos simulation, and basic control system design."
        ),
        "duration": 3,
        "terms_and_conditions": (
            "1. Scilab 6.1+ must be pre-installed.\n"
            "2. Coordinator must ensure all systems are functional.\n"
            "3. Minimum 15 participants required.\n"
            "4. Participants should have a basic understanding of "
            "engineering mathematics."
        ),
    },
    {
        "name": "DWSIM",
        "description": (
            "Introduction to chemical process simulation using DWSIM, "
            "a free, open-source CAPE-OPEN compliant process simulator. "
            "Covers flowsheet design, thermodynamic packages, and "
            "unit operations."
        ),
        "duration": 1,
        "terms_and_conditions": (
            "1. DWSIM latest version must be installed prior to the "
            "workshop.\n"
            "2. Suitable for Chemical Engineering students.\n"
            "3. Minimum 10 participants required."
        ),
    },
]

# (workshop_type_name, days_offset_from_today, status, tnc_accepted)
# status: 0 = Pending, 1 = Accepted
SAMPLE_WORKSHOPS = [
    ("Python", 15, 1, True),
    ("Scilab", 30, 1, True),
    ("Python", -10, 1, True),
    ("DWSIM", 7, 0, True),
    ("Scilab", 45, 0, True),
]


class Command(BaseCommand):
    help = "Create/reset the guest demo user with sample profile data and workshops"

    def handle(self, *args, **options):
        # 1. Create or reset guest user
        user, created = User.objects.get_or_create(
            username=GUEST_USERNAME,
            defaults={
                "email": GUEST_EMAIL,
                "first_name": GUEST_FIRST,
                "last_name": GUEST_LAST,
            },
        )
        user.set_password(GUEST_PASSWORD)
        user.email = GUEST_EMAIL
        user.first_name = GUEST_FIRST
        user.last_name = GUEST_LAST
        user.save()

        if created:
            self.stdout.write(self.style.SUCCESS("  [+] Created user '%s'" % GUEST_USERNAME))
        else:
            self.stdout.write(self.style.WARNING("  [~] Reset user '%s'" % GUEST_USERNAME))

        # 2. Create or update guest profile
        profile, p_created = Profile.objects.get_or_create(user=user)
        for field, value in GUEST_PROFILE.items():
            setattr(profile, field, value)
        profile.save()

        status = "Created" if p_created else "Updated"
        self.stdout.write(self.style.SUCCESS("  [+] %s profile (institute: %s)" % (status, profile.institute)))

        # 3. Create workshop types if none exist
        if WorkshopType.objects.count() == 0:
            for wt_data in WORKSHOP_TYPES:
                WorkshopType.objects.create(**wt_data)
                self.stdout.write(self.style.SUCCESS("  [+] Created workshop type: %s" % wt_data["name"]))
        else:
            self.stdout.write(self.style.SUCCESS(
                "  [+] Workshop types already exist (%d found)" % WorkshopType.objects.count()
            ))

        # 4. Create sample workshops for guest
        deleted_count, _ = Workshop.objects.filter(coordinator=user).delete()
        if deleted_count:
            self.stdout.write(self.style.WARNING("  [~] Removed %d old guest workshop(s)" % deleted_count))

        today = date.today()
        for wt_name, day_offset, status_val, tnc in SAMPLE_WORKSHOPS:
            wt = WorkshopType.objects.filter(name=wt_name).first()
            if not wt:
                self.stdout.write(self.style.ERROR("  [!] Workshop type '%s' not found" % wt_name))
                continue
            Workshop.objects.create(
                coordinator=user,
                workshop_type=wt,
                date=today + timedelta(days=day_offset),
                status=status_val,
                tnc_accepted=tnc,
            )
            status_label = "Accepted" if status_val == 1 else "Pending"
            ws_date = today + timedelta(days=day_offset)
            self.stdout.write(self.style.SUCCESS(
                "  [+] Created workshop: %s on %s [%s]" % (wt_name, ws_date, status_label)
            ))

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS("-" * 48))
        self.stdout.write(self.style.SUCCESS("  Guest user ready!"))
        self.stdout.write(self.style.SUCCESS("  Username : %s" % GUEST_USERNAME))
        self.stdout.write(self.style.SUCCESS("  Password : %s" % GUEST_PASSWORD))
        self.stdout.write(self.style.SUCCESS("-" * 48))
