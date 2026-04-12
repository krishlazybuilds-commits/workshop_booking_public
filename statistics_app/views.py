# Python Imports
import datetime as dt
import pandas as pd

# Django Imports
from django.template.loader import get_template
from django.template import RequestContext
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.shortcuts import render, redirect
from django.urls import reverse
from django.utils import timezone
from django.http import HttpResponse

# Local Imports
from workshop_app.models import (
    Profile, User, has_profile, Workshop, WorkshopType, Testimonial,
    states
)
from teams.models import Team
from .forms import FilterForm


def is_instructor(user):
    '''Check if the user is having instructor rights'''
    return user.groups.filter(name='instructor').exists()


def is_email_checked(user):
    if hasattr(user, 'profile'):
        return user.profile.is_email_verified
    else:
        return False


def _get_sample_data():
    """Generate realistic sample workshop data for non-authenticated users."""
    import json
    from datetime import date, timedelta

    base = date.today() - timedelta(days=60)

    sample_workshops = [
        {"coordinator": "Aarav Sharma", "institute": "IIT Bombay", "instructor": "Priya Mehta", "workshop": "Scilab", "date": base + timedelta(days=2)},
        {"coordinator": "Sneha Iyer", "institute": "NIT Trichy", "instructor": "Rajesh Kumar", "workshop": "Python", "date": base + timedelta(days=5)},
        {"coordinator": "Vikram Desai", "institute": "COEP Pune", "instructor": "Anita Joshi", "workshop": "OpenFOAM", "date": base + timedelta(days=8)},
        {"coordinator": "Meera Nair", "institute": "BITS Pilani", "instructor": "Suresh Reddy", "workshop": "DWSIM", "date": base + timedelta(days=11)},
        {"coordinator": "Rohit Gupta", "institute": "IIT Delhi", "instructor": "Kavita Singh", "workshop": "Scilab", "date": base + timedelta(days=13)},
        {"coordinator": "Deepa Krishnan", "institute": "VIT Vellore", "instructor": "Manoj Tiwari", "workshop": "Python", "date": base + timedelta(days=15)},
        {"coordinator": "Arjun Patel", "institute": "DAIICT Gandhinagar", "instructor": "Priya Mehta", "workshop": "R", "date": base + timedelta(days=18)},
        {"coordinator": "Fatima Begum", "institute": "JNTU Hyderabad", "instructor": "Arun Verma", "workshop": "eSim", "date": base + timedelta(days=20)},
        {"coordinator": "Kiran Rao", "institute": "IIT Madras", "instructor": "Rajesh Kumar", "workshop": "OpenFOAM", "date": base + timedelta(days=22)},
        {"coordinator": "Pooja Bhatt", "institute": "NIT Warangal", "instructor": "Sunita Devi", "workshop": "Scilab", "date": base + timedelta(days=25)},
        {"coordinator": "Rahul Saxena", "institute": "IIT Kanpur", "instructor": "Kavita Singh", "workshop": "DWSIM", "date": base + timedelta(days=27)},
        {"coordinator": "Nisha Agarwal", "institute": "BHU Varanasi", "instructor": "Manoj Tiwari", "workshop": "Python", "date": base + timedelta(days=29)},
        {"coordinator": "Siddharth Jain", "institute": "IIIT Hyderabad", "instructor": "Anita Joshi", "workshop": "R", "date": base + timedelta(days=31)},
        {"coordinator": "Ananya Mishra", "institute": "NIT Rourkela", "instructor": "Suresh Reddy", "workshop": "Scilab", "date": base + timedelta(days=34)},
        {"coordinator": "Venkat Subramanian", "institute": "Anna University", "instructor": "Priya Mehta", "workshop": "eSim", "date": base + timedelta(days=36)},
        {"coordinator": "Tanvi Kulkarni", "institute": "COEP Pune", "instructor": "Arun Verma", "workshop": "Python", "date": base + timedelta(days=38)},
        {"coordinator": "Aditya Banerjee", "institute": "Jadavpur University", "instructor": "Rajesh Kumar", "workshop": "OpenFOAM", "date": base + timedelta(days=40)},
        {"coordinator": "Shreya Das", "institute": "IIT Kharagpur", "instructor": "Kavita Singh", "workshop": "DWSIM", "date": base + timedelta(days=42)},
        {"coordinator": "Manish Pandey", "institute": "NIT Jaipur", "instructor": "Sunita Devi", "workshop": "Scilab", "date": base + timedelta(days=44)},
        {"coordinator": "Lakshmi Pillai", "institute": "CUSAT Kochi", "instructor": "Manoj Tiwari", "workshop": "Python", "date": base + timedelta(days=46)},
        {"coordinator": "Nikhil Chopra", "institute": "PEC Chandigarh", "instructor": "Anita Joshi", "workshop": "R", "date": base + timedelta(days=48)},
        {"coordinator": "Priyanka Reddy", "institute": "CBIT Hyderabad", "instructor": "Priya Mehta", "workshop": "eSim", "date": base + timedelta(days=50)},
        {"coordinator": "Gaurav Sinha", "institute": "IIT Roorkee", "instructor": "Suresh Reddy", "workshop": "OpenFOAM", "date": base + timedelta(days=52)},
        {"coordinator": "Swati Dubey", "institute": "MNNIT Allahabad", "instructor": "Arun Verma", "workshop": "Python", "date": base + timedelta(days=54)},
        {"coordinator": "Harish Menon", "institute": "NIT Calicut", "instructor": "Rajesh Kumar", "workshop": "Scilab", "date": base + timedelta(days=56)},
        {"coordinator": "Divya Rajan", "institute": "IIT Guwahati", "instructor": "Kavita Singh", "workshop": "DWSIM", "date": base + timedelta(days=58)},
        {"coordinator": "Amit Thakur", "institute": "NIT Hamirpur", "instructor": "Sunita Devi", "workshop": "R", "date": base + timedelta(days=60)},
        {"coordinator": "Ritu Sharma", "institute": "IIT BHU", "instructor": "Manoj Tiwari", "workshop": "eSim", "date": base + timedelta(days=62)},
        {"coordinator": "Saurabh Malik", "institute": "DTU Delhi", "instructor": "Anita Joshi", "workshop": "Python", "date": base + timedelta(days=64)},
        {"coordinator": "Kavya Nambiar", "institute": "NIT Surathkal", "instructor": "Priya Mehta", "workshop": "Scilab", "date": base + timedelta(days=66)},
    ]

    # State chart data
    sample_states = json.dumps(["Maharashtra", "Tamil Nadu", "Karnataka", "Telangana",
                                "Delhi", "West Bengal", "Kerala", "Gujarat",
                                "Rajasthan", "Uttar Pradesh"])
    sample_state_counts = json.dumps([8, 5, 4, 3, 3, 2, 2, 1, 1, 1])

    # Workshop type chart data
    sample_types = json.dumps(["Scilab", "Python", "OpenFOAM", "DWSIM", "R", "eSim"])
    sample_type_counts = json.dumps([7, 8, 4, 4, 3, 4])

    return sample_workshops, sample_states, sample_state_counts, sample_types, sample_type_counts


class _SamplePage:
    """A lightweight page-like object for sample data (avoids needing Paginator)."""

    def __init__(self, items):
        self._items = items
        self.number = 1
        self.paginator = self
        self.count = len(items)
        self.num_pages = 1

    def start_index(self):
        return 1

    @property
    def has_previous(self):
        return False

    @property
    def has_next(self):
        return False

    def __iter__(self):
        return iter(self._items)

    def __bool__(self):
        return bool(self._items)

    def __len__(self):
        return len(self._items)


class _SampleWorkshop:
    """Lightweight object mimicking Workshop model field access for the template."""

    def __init__(self, data):
        self.coordinator = _SampleUser(data["coordinator"], data["institute"])
        self.instructor = _SampleUser(data["instructor"])
        self.workshop_type = _SampleType(data["workshop"])
        self.date = data["date"]


class _SampleUser:
    def __init__(self, full_name, institute=None):
        self._full_name = full_name
        self.profile = _SampleProfile(institute) if institute else _SampleProfile("")

    def get_full_name(self):
        return self._full_name


class _SampleProfile:
    def __init__(self, institute):
        self.institute = institute


class _SampleType:
    def __init__(self, name):
        self.name = name


def workshop_public_stats(request):
    user = request.user
    form = FilterForm()

    # ── Non-authenticated users get sample data ──────────────────
    if not user.is_authenticated:
        sample_rows, ws_states, ws_count, ws_type, ws_type_count = _get_sample_data()
        objects = _SamplePage([_SampleWorkshop(row) for row in sample_rows])
        context = {
            "form": form,
            "objects": objects,
            "ws_states": ws_states,
            "ws_count": ws_count,
            "ws_type": ws_type,
            "ws_type_count": ws_type_count,
        }
        return render(request, 'statistics_app/workshop_public_stats.html', context)

    # ── Authenticated users get real data ────────────────────────
    from_date = request.GET.get('from_date')
    to_date = request.GET.get('to_date')
    state = request.GET.get('state')
    workshoptype = request.GET.get('workshop_type')
    show_workshops = request.GET.get('show_workshops')
    sort = request.GET.get('sort')
    download = request.GET.get('download')

    if from_date and to_date:
        form = FilterForm(
            start=from_date, end=to_date, state=state, type=workshoptype,
            show_workshops=show_workshops, sort=sort
        )
        workshops = Workshop.objects.filter(
            date__range=(from_date, to_date), status=1
        ).order_by(sort)
        if state:
            workshops = workshops.filter(coordinator__profile__state=state)
        if workshoptype:
            workshops = workshops.filter(workshop_type_id=workshoptype)
    else:
        today = timezone.now()
        upto = today + dt.timedelta(days=15)
        workshops = Workshop.objects.filter(
            date__range=(today, upto), status=1
            ).order_by("date")
    if show_workshops:
        if is_instructor(user):
            workshops = workshops.filter(instructor_id=user.id)
        else:
            workshops = workshops.filter(coordinator_id=user.id)
    if download:
        data = workshops.values(
            "workshop_type__name", "coordinator__first_name",
            "coordinator__last_name", "instructor__first_name",
            "instructor__last_name", "coordinator__profile__state",
            "date", "status"
        )
        df = pd.DataFrame(list(data))
        if not df.empty:
            df.status.replace(
                [0, 1, 2], ['Pending', 'Success', 'Reject'], inplace=True
            )
            codes, states_map = list(zip(*states))
            df.coordinator__profile__state.replace(
                codes, states_map, inplace=True
            )
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename=statistics.csv'
            output_file = df.to_csv(response, index=False)
            return response
        else:
            messages.add_message(request, messages.WARNING, "No data found")
    ws_states, ws_count = Workshop.objects.get_workshops_by_state(workshops)
    ws_type, ws_type_count = Workshop.objects.get_workshops_by_type(workshops)
    paginator = Paginator(workshops, 30)
    page = request.GET.get('page')
    workshops = paginator.get_page(page)
    context = {"form": form, "objects": workshops, "ws_states": ws_states,
               "ws_count": ws_count, "ws_type": ws_type,
               "ws_type_count": ws_type_count}
    return render(
        request, 'statistics_app/workshop_public_stats.html', context
    )


@login_required
def team_stats(request, team_id=None):
    user = request.user
    teams = Team.objects.all()
    if team_id:
        team = teams.get(id=team_id)
    else:
        team = teams.first()
    if not team.members.filter(user_id=user.id).exists():
        messages.add_message(
            request, messages.INFO, "You are not added to the team"
        )
        return redirect(reverse("workshop_app:index"))

    member_workshop_data = {}
    for member in team.members.all():
        workshop_count = Workshop.objects.filter(
            instructor_id=member.user.id).count()
        member_workshop_data[member.user.get_full_name()] = workshop_count
    team_labels = list(member_workshop_data.keys())
    ws_count = list(member_workshop_data.values())
    return render(
        request, 'statistics_app/team_stats.html',
        {'team_labels': team_labels, "ws_count": ws_count, 'all_teams': teams,
         'team_id': team.id}
    )
