from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(_("email address"), unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['first_name', 'last_name',]
    objects = CustomUserManager()

    def __str__(self):
        return self.email


class MemberTable(models.Model):
    member_id = models.ForeignKey("CustomUser", on_delete=models.CASCADE,)
    member_status = models.CharField(max_length=50,)
    INTENDED_PARENT = "Intended Parent"
    EGG_DONOR = "Egg Donor"
    SURROGATE = "Surrogate"
    OTHER = "Other"
    UNDEFINED = "Undefined"
    JOURNEY_ROLES = {
        INTENDED_PARENT: "Intended Parent",
        EGG_DONOR: "Egg Donor",
        SURROGATE: "Surrogate",
        OTHER: "Other (Please specify)",
        UNDEFINED: "Undefined"
    }
    role = models.CharField(
        max_length=50,
        choices=JOURNEY_ROLES,
        default=UNDEFINED
    )
    # Intake survey values
    started_journey = models.BooleanField(null=True)
    first_question = models.CharField(max_length=50, default="default")
    second_question = models.CharField(max_length=50, default="default")
    third_question = models.CharField(max_length=50, default="default")
    international_ip = models.BooleanField(null=True)
    stance_termination = models.CharField(max_length=30, null=True)
    stance_vaccines = models.CharField(max_length=20, null=True)
    stance_embryo_transfer = models.CharField(max_length=20, null=True)
    carrying_multiples = models.BooleanField(null=True)
    same_sex_carry = models.BooleanField(null=True)
    different_lifestyle_carry = models.BooleanField(null=True)
    current_milestone = models.CharField(max_length=50, null=True)
    next_milestone = models.CharField(max_length=50, null=True)
    milestone_date = models.DateField(null=True)
    concerns = models.CharField(max_length=400, null=True)
    preset_id = models.CharField(max_length=10, null=True)

    def __str__(self):
        return str(self.member_id)


class CarouselPreferences(models.Model):
    preference_name = models.CharField(max_length=30)
    preference_desc = models.CharField(max_length=100)


class ActionTable(models.Model):
    action_name = models.CharField(max_length=80)
    action_desc = models.CharField(max_length=100)


class CarouselUserReport(models.Model):
    member_id = models.ForeignKey("CustomUser", on_delete=models.CASCADE,)
    carousel_preferences_id = models.ForeignKey("CarouselPreferences", on_delete=models.CASCADE)
    YES = "YA"
    NO = "NO"
    UNDEFINED = "UN"
    LIKE_RESPONSES = {
        YES: "I like this feature",
        NO: "I do not like this feature",
        UNDEFINED: "I have not clicked a button yet",
    }
    member_like_response = models.CharField(
        max_length=2,
        choices=LIKE_RESPONSES,
        default=UNDEFINED
    )
    timestamp = models.DateTimeField(auto_now=True)


class AuditTableM1(models.Model):
    member_id = models.ForeignKey("CustomUser", on_delete=models.CASCADE)
    action_id = models.ForeignKey("ActionTable", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now=True)


class NotifyMeM1(models.Model):
    user_email = models.EmailField(_("email address"), unique=True)
    timestamp = models.DateTimeField(auto_now=True)


class IntakeReferenceTable(models.Model):
    preset_id = models.CharField(max_length=10)
    milestone_order = models.IntegerField()
    milestone_name = models.CharField(max_length=50)
    duration = models.IntegerField()


class IntakeReferenceSubTable(models.Model):
    preset_id = models.CharField(max_length=10)
    milestone_order = models.IntegerField()
    milestone_name = models.CharField(max_length=50)
    duration = models.IntegerField()
