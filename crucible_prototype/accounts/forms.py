# Forms.py
from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from .models import *


class CustomUserCreationForm(UserCreationForm):
    ROLE_CHOICES = [
        (MemberTable.INTENDED_PARENT, MemberTable.JOURNEY_ROLES[MemberTable.INTENDED_PARENT]),
        (MemberTable.EGG_DONOR, MemberTable.JOURNEY_ROLES[MemberTable.EGG_DONOR]),
        (MemberTable.SURROGATE, MemberTable.JOURNEY_ROLES[MemberTable.SURROGATE]),
        (MemberTable.OTHER, MemberTable.JOURNEY_ROLES[MemberTable.OTHER]),
    ]

    role = forms.ChoiceField(choices=ROLE_CHOICES, widget=forms.RadioSelect)
    other_role = forms.CharField(required=False, max_length=50)

    class Meta:
        model = CustomUser
        fields = ('first_name', 'last_name', 'email')

    def clean(self):
        cleaned_data = super().clean()
        if cleaned_data.get('role') == MemberTable.OTHER and not cleaned_data.get('other_role'):
            raise forms.ValidationError("Please specify your role if you selected 'Other'.")
        return cleaned_data


class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = CustomUser
        fields = ("email",)


class AuditSubmission(forms.ModelForm):

    class Meta:
        model = AuditTableM1

        fields = [
            "member_id",
            "action_id",
        ]
        

class CarouselSubmission(forms.ModelForm):

    class Meta:
        model = CarouselUserReport

        fields = [
            "member_like_response",
            "carousel_preferences_id",
            "member_id",
        ]


class NotifyMeSubmission(forms.ModelForm):

    class Meta:
        model = NotifyMeM1

        fields = [
            "user_email"
        ]


class OnboardingStartForm(forms.Form):
    started_journey = forms.ChoiceField(
        widget=forms.RadioSelect,
        choices=[("yes", 'Yes'), ("no", 'No')],
        )

    def __init__(self, *args, **kwargs):
        kwargs.pop("role", None)
        super().__init__(*args, **kwargs)
        self.header = "Have you started your journey?"
        self.subtext = "(If so, congratulations - we’ll check in later about how far along you are so we can propose where to go from here. If not, we’re excited to help you get ready.)"

    def get_fields_with_types(self):
        return [(field, self.get_field_type_class(field)) for field in self]

    def get_field_type_class(self, field):
        if isinstance(field.field, forms.ChoiceField):
            return 'checkbox-row input'
        elif isinstance(field.field, forms.CharField):
            return ''
        return 'required-field'


class OnboardingIpForm1(forms.Form):
    donor_eggs = forms.ChoiceField(
        choices=[('Yes, fresh eggs', 'Yes, fresh eggs'),
                 ('Yes, frozen eggs', 'Yes, frozen eggs'),
                 ('No, using my own fresh eggs', 'No, using my own fresh eggs'),
                 ('No, using my own frozen eggs', "No, using my own frozen eggs"),
                 ('Donor', 'No, using donor embryos (not related to me)')],
        widget=forms.RadioSelect,
        required=True
    )

    def __init__(self, *args, **kwargs):
        kwargs.pop("role", None)
        super().__init__(*args, **kwargs)
        self.header = "Will you be using donor eggs to create embryos?"
        self.subtext = "Please select the option that best describes your situation. You can use Crucible's <a href='https://crucible.care/donorgpt' target='_blank' rel='noopener noreferrer'>DonorGPT</a> to quickly validate your options for eggs."

    def get_fields_with_types(self):
        return [(field, self.get_field_type_class(field)) for field in self]

    def get_field_type_class(self, field):
        if isinstance(field.field, forms.ChoiceField):
            return 'checkbox-row input'
        elif isinstance(field.field, forms.CharField):
            return ''
        return ''


class OnboardingIpForm2(forms.Form):
    donor_sperm = forms.ChoiceField(
        choices=[('Yes - fresh donor sperm', 'Yes - fresh donor sperm'),
                 ('Yes - frozen donor sperm', 'Yes - frozen donor sperm'),
                 ('No - own fresh sperm', 'No - own fresh sperm'),
                 ('No - own frozen sperm', 'No - own frozen sperm'),
                 ],
        widget=forms.RadioSelect,
    )

    def __init__(self, *args, **kwargs):
        kwargs.pop("role", None)
        super().__init__(*args, **kwargs)
        self.header = "Will you be using donor sperm?"
        self.subtext = "Please select the option that best describes your situation. You can use Crucible's <a href='https://crucible.care/donorgpt' target='_blank' rel='noopener noreferrer'>DonorGPT</a> to quickly validate your options for sperm. "

    def get_fields_with_types(self):
        return [(field, self.get_field_type_class(field)) for field in self]

    def get_field_type_class(self, field):
        if isinstance(field.field, forms.ChoiceField):
            return 'checkbox-row input'
        elif isinstance(field.field, forms.CharField):
            return ''
        return ''


class OnboardingIpForm3(forms.Form):
    need_surrogate = forms.ChoiceField(
        choices=[('Yes', 'Yes'), ('No', 'No')],
        widget=forms.RadioSelect,
    )

    def __init__(self, *args, **kwargs):
        kwargs.pop("role", None)
        super().__init__(*args, **kwargs)
        self.header = "Will you need to work with a surrogate to carry the pregnancy to term?"
        self.subtext = "At this point in time, Crucible supports only gestational carriers, not traditional surrogates (who use their own egg + serve as carrier). Gestational carriers are not biologically related to the embryo in any way."

    def get_fields_with_types(self):
        return [(field, self.get_field_type_class(field)) for field in self]

    def get_field_type_class(self, field):
        if isinstance(field.field, forms.ChoiceField):
            return 'checkbox-row input'
        elif isinstance(field.field, forms.CharField):
            return ''
        return ''


class OnboardingCurrentStep(forms.Form):
    current_milestone = forms.ChoiceField(
        choices=[],
        widget=forms.Select(attrs={'class': 'form-control'},
                            )
    )

    def __init__(self, *args, **kwargs):
        kwargs.pop("role", None)
        preset_id = kwargs.pop('preset_id', None)
        super().__init__(*args, **kwargs)
        self.header = "Where are you in the journey right now?"
        self.subtext = ('Scroll down the list, and select the stage that applies best to your current situation. '
                        'This helps us "anchor" forward - so we can show you what to do from here onwards. ')
        retrieve_values_from_db = IntakeReferenceTable.objects.filter(preset_id=preset_id)
        build_pulldown_list = retrieve_values_from_db.values_list('milestone_name', 'milestone_name')
        self.fields['current_milestone'].choices = [('', '')] + list(build_pulldown_list)

    def get_fields_with_types(self):
        return [(field, self.get_field_type_class(field)) for field in self]

    def get_field_type_class(self, field):
        if isinstance(field.field, forms.ChoiceField):
            return 'checkbox-row input'
        elif isinstance(field.field, forms.CharField):
            return ''
        return ''


class OnboardingMilestone(forms.Form):
    next_milestone = forms.ChoiceField(
        choices=[],
        widget=forms.Select(attrs={'class': 'form-control', 'id': 'milestone-select'})
    )
    calendar = forms.DateField(required=True, widget=forms.TextInput(attrs={'class': 'calendar datepicker', 'id': 'calendar-input', 'style': 'display: none;'}))

    def __init__(self, *args, **kwargs):
        current_milestone = kwargs.pop('current_milestone', None)
        preset_id = kwargs.pop('preset_id', None)
        role = kwargs.pop('role', None)
        super().__init__(*args, **kwargs)
        if role == "IP":
            self.header = "What milestone do you want to achieve, and by when?"
            self.subtext = 'Now that you have let us know your primary goal, let us know what date you have in mind to achieve it. This helps us "anchor" backwards so you can stay on track. If a date is not selectable, we recommend allocating more time.'
        elif role == "ED":
            self.header = "What milestone do you want to achieve, and by when?"
            self.subtext = "It's not all about the stim cycle. Some may be focused on getting compensated by a certain date before their mortgage closes; others may be focused on being totally recovered by Thanksgiving. You'll get to select the date in the next screen."
        else:
            self.header = "What milestone do you want to achieve, and by when?"
            self.subtext = 'Now that you have let us know your primary goal, let us know what date you have in mind to achieve it. This helps us "anchor" backwards so you can stay on track. If a date is not selectable, we recommend allocating more time.'
        if current_milestone:
            try:
                current_milestone_duration = IntakeReferenceTable.objects.get(milestone_name=current_milestone, preset_id=preset_id).duration
                current_milestone_order = IntakeReferenceTable.objects.get(milestone_name=current_milestone, preset_id=preset_id).milestone_order
                milestone_data = IntakeReferenceSubTable.objects.filter(milestone_order__gte=current_milestone_order, preset_id=preset_id)
            except IntakeReferenceTable.DoesNotExist:
                milestone_data = IntakeReferenceSubTable.objects.get(preset_id=preset_id)
        else:
            milestone_data = IntakeReferenceSubTable.objects.filter(milestone_order__gt=0, preset_id=preset_id)
            current_milestone_order = 1

        milestone_choices = [(x.milestone_name, x.milestone_name) for x in milestone_data]
        self.fields['next_milestone'].choices = [('', 'Select a preference')] + milestone_choices
        self.milestone_durations = {}
        for m in milestone_data:
            self.milestone_durations[m.milestone_name] = m.duration - current_milestone_duration

    def get_fields_with_types(self):
        return [(field, self.get_field_type_class(field)) for field in self]

    def get_field_type_class(self, field):
        if isinstance(field.field, forms.ChoiceField):
            return 'checkbox-row input'
        elif isinstance(field.field, forms.DateField):
            return ''
        return ''

    def clean(self):
        cleaned_data = super().clean()
        return cleaned_data


class OnboardingConcernsForm(forms.Form):
    concerns = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-concerns',
            'rows': 8,
            'style': 'resize:none;'
        }),
        max_length=400,
        required=False
    )

    def __init__(self, *args, **kwargs):
        role = kwargs.pop('role', None)
        super().__init__(*args, **kwargs)
        self.header = "What are you most worried about?"
        if role == "IP":
            self.subtext = "We know this whole thing may feel crazy.\nMost intended parents are stressed about how much this is going to cost, how long everything is going to take, whether you can really trust a 3rd party with a process so intimate, how to not be taken advantage of. Everyone is anxious about different things - whatever you feel comfortable sharing with us, we'll make a note of it."
        elif role == "ED":
            self.subtext = "We have been in your shoes.\nEgg donors worry about staying safe, their long term fertility health, being overstimulated, how to tell their friends and family, taking time off work and school. Everyone will be anxious about different things - whatever you're willing to share with us, we'll make a note of it."
        elif role == "Surrogate":
            self.subtext = "You're thinking about doing something that may not be easy or comfortable for you but will really change someone's life. It's normal to be anxious (especially if it's your first time), and different GCs will be anxious about different things. Whatever you feel comfortable sharing with us, we'll make a note of it."

    def get_fields_with_types(self):
        return [(field, self.get_field_type_class(field)) for field in self]

    def get_field_type_class(self, field):
        if isinstance(field.field, forms.ChoiceField):
            return 'checkbox-row input'
        elif isinstance(field.field, forms.CharField):
            return ''
        return ''


class OnboardingEdForm1(forms.Form):
    donor_experience = forms.ChoiceField(
        choices=[('Yes', 'Yes'), ('No', 'No')],
        widget=forms.RadioSelect,
    )

    def __init__(self, *args, **kwargs):
        kwargs.pop("role", None)
        super().__init__(*args, **kwargs)
        self.header = "Is this your first time donating eggs?"
        self.subtext = "We’ll tailor your to-do list differently if you’ve done this before."

    def get_fields_with_types(self):
        return [(field, self.get_field_type_class(field)) for field in self]

    def get_field_type_class(self, field):
        if isinstance(field.field, forms.ChoiceField):
            return 'checkbox-row input'
        elif isinstance(field.field, forms.CharField):
            return ''
        return ''


class OnboardingEdForm2(forms.Form):
    bank_donation = forms.ChoiceField(
        choices=[('Yes', 'Yes'), ('No', 'No')],
        widget=forms.RadioSelect,
    )

    def __init__(self, *args, **kwargs):
        kwargs.pop("role", None)
        super().__init__(*args, **kwargs)
        self.header = "Will you be donating to an egg bank?"
        self.subtext = 'If you’re undecided, default to "no". You can always change your answers later.'

    def get_fields_with_types(self):
        return [(field, self.get_field_type_class(field)) for field in self]

    def get_field_type_class(self, field):
        if isinstance(field.field, forms.ChoiceField):
            return 'checkbox-row input'
        elif isinstance(field.field, forms.CharField):
            return ''
        return ''


class OnboardingEdForm3(forms.Form):
    use_agency = forms.ChoiceField(
        choices=[('Yes', 'Yes'), ('No', 'No')],
        widget=forms.RadioSelect,
    )

    def __init__(self, *args, **kwargs):
        kwargs.pop("role", None)
        super().__init__(*args, **kwargs)
        self.header = "Will your donation be managed by an agency?"
        self.subtext = "We'll tailor your to-do list differently if you have an agency coordinator communicating on your behalf with IPs and handling some of the admin load for you."

    def get_fields_with_types(self):
        return [(field, self.get_field_type_class(field)) for field in self]

    def get_field_type_class(self, field):
        if isinstance(field.field, forms.ChoiceField):
            return 'checkbox-row input'
        elif isinstance(field.field, forms.CharField):
            return ''
        return ''


class OnboardingSurroForm1(forms.Form):
    surro_experience = forms.ChoiceField(
        choices=[('Yes', 'Yes'), ('No', 'No')],
        widget=forms.RadioSelect,
    )

    def __init__(self, *args, **kwargs):
        kwargs.pop("role", None)
        super().__init__(*args, **kwargs)
        self.header = "Will this be your first surrogacy journey?"
        self.subtext = "We’ll tailor your to-do list differently if you’ve done this before."

    def get_fields_with_types(self):
        return [(field, self.get_field_type_class(field)) for field in self]

    def get_field_type_class(self, field):
        if isinstance(field.field, forms.ChoiceField):
            return 'checkbox-row input'
        elif isinstance(field.field, forms.CharField):
            return ''
        return ''


class OnboardingSurroForm2(forms.Form):
    willing_to_travel = forms.ChoiceField(
        choices=[('Yes', 'Yes'), ('No', 'No')],
        widget=forms.RadioSelect,
    )

    def __init__(self, *args, **kwargs):
        kwargs.pop("role", None)
        super().__init__(*args, **kwargs)
        self.header = "Are you willing to travel far for the embryo transfer (e.g. out of state)?"
        self.subtext = "For a variety of reasons (including highest success rates), the intended parents' choice of fertility clinic may be far away from you, requiring a long drive or a flight."

    def get_fields_with_types(self):
        return [(field, self.get_field_type_class(field)) for field in self]

    def get_field_type_class(self, field):
        if isinstance(field.field, forms.ChoiceField):
            return 'checkbox-row input'
        elif isinstance(field.field, forms.CharField):
            return ''
        return ''


class OnboardingSurroForm3(forms.Form):
    use_agency = forms.ChoiceField(
        choices=[('Yes', 'Yes'), ('No', 'No')],
        widget=forms.RadioSelect,
    )

    def __init__(self, *args, **kwargs):
        kwargs.pop("role", None)
        super().__init__(*args, **kwargs)
        self.header = "Will your journey be managed by an agency?"
        self.subtext = "We’ll tailor your to-do list differently if you have an agency coordinator sharing the load."

    def get_fields_with_types(self):
        return [(field, self.get_field_type_class(field)) for field in self]

    def get_field_type_class(self, field):
        if isinstance(field.field, forms.ChoiceField):
            return 'checkbox-row input'
        elif isinstance(field.field, forms.CharField):
            return ''
        return ''


class OnboardingCompleteForm(forms.Form):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.role = kwargs.pop('role', None)
        self.started_journey = kwargs.pop('started_journey', None)
        self.donor_eggs = kwargs.pop('donor_eggs', None)
        self.donor_sperm = kwargs.pop('donor_sperm', None)
        self.need_surrogate = kwargs.pop('need_surrogate', None)
        self.donor_experience = kwargs.pop('donor_experience', None)
        self.egg_donation = kwargs.pop('egg_donation', None)
        self.use_agency = kwargs.pop('use_agency', None)
        self.preference = kwargs.pop('preference', None)
        self.milestone = kwargs.pop('milestone', None)
        self.milestone_date = kwargs.pop('milestone_date', None)
        self.concerns = kwargs.pop('concerns', None)

    def get_fields_with_types(self):
        return [(field, self.get_field_type_class(field)) for field in self]

    def get_field_type_class(self, field):
        if isinstance(field.field, forms.ChoiceField):
            return 'checkbox-row input'
        elif isinstance(field.field, forms.CharField):
            return ''
        return ''


class OnboardingSurroForm4(forms.Form):
    international_ip = forms.ChoiceField(
        choices=[('Yes', 'Yes'), ('No', 'No')],
        widget=forms.RadioSelect,
    )

    def __init__(self, *args, **kwargs):
        kwargs.pop("role", None)
        kwargs.pop("preset_id", None)
        super().__init__(*args, **kwargs)
        self.header = "Are you willing to work with international intended parents?"
        self.subtext = "Many hopeful IPs need to seek surrogacy in the US because it is unavailable in their country of origin.  They may speak a different language from you, and will not be as available to co-attend your appointments - but are every bit as sincere as local IPs in appreciating your help to form their family."

    def get_fields_with_types(self):
        return [(field, self.get_field_type_class(field)) for field in self]

    def get_field_type_class(self, field):
        if isinstance(field.field, forms.ChoiceField):
            return 'checkbox-row input'
        elif isinstance(field.field, forms.CharField):
            return ''
        return ''


class OnboardingSurroForm5(forms.Form):
    stance_termination = forms.ChoiceField(
        choices=[('danger_child', 'Yes - Termination only if danger to child'),
                 ('danger_both', 'Yes - Termination if danger to child or carrier (me)'),
                 ('clinic_rec', 'Yes - Termination if recommended by clinic'),
                 ('ip_request', 'Yes - Termination if requested by IPs'),
                 ('none', "No - I haven't made up my mind")
                 ],
        widget=forms.RadioSelect,
    )

    def __init__(self, *args, **kwargs):
        kwargs.pop("role", None)
        super().__init__(*args, **kwargs)
        self.header = "Do you have a personal stance on abortion?"
        self.subtext = "We know this is a sensitive question.\nEvery GC / surrogate's stance is valid and to be upheld. Different people have different opinions of what constitutes medical necessity. At this time, please select the option that best describes you. We know beliefs can evolve and will support you."

    def get_fields_with_types(self):
        return [(field, self.get_field_type_class(field)) for field in self]

    def get_field_type_class(self, field):
        if isinstance(field.field, forms.ChoiceField):
            return 'checkbox-row input'
        elif isinstance(field.field, forms.CharField):
            return ''
        return ''


class OnboardingSurroForm6(forms.Form):
    stance_vaccines = forms.ChoiceField(
        choices=[('No vaccines', 'Yes - Prefer no vaccinations'),
                 ('Vaccines okay', 'Yes - Okay with vaccinations'),
                 ('None', 'No - Undecided on vaccinations'),
                 ],
        widget=forms.RadioSelect,
    )

    def __init__(self, *args, **kwargs):
        kwargs.pop("role", None)
        super().__init__(*args, **kwargs)
        self.header = "Do you have a personal stance on getting vaccinated?"
        self.subtext = "We know this is a sensitive question.\nEveryone's personal definitions of risk are valid and some people are more / less open to getting vaccinated (e.g. flu, TDAP, COVID). At this point in time, please select the option that best describes you. We know beliefs can evolve and will support you."

    def get_fields_with_types(self):
        return [(field, self.get_field_type_class(field)) for field in self]

    def get_field_type_class(self, field):
        if isinstance(field.field, forms.ChoiceField):
            return 'checkbox-row input'
        elif isinstance(field.field, forms.CharField):
            return ''
        return ''


class OnboardingSurroForm7(forms.Form):
    stance_embryo_transfer = forms.ChoiceField(
        choices=[('Single transfer', 'Yes - Transfer single embryos only'),
                 ('Transfer multiple', 'Yes - Okay to transfer multiple embryos'),
                 ('None', 'No - Undecided on embryo transfer stance'),
                 ],
        widget=forms.RadioSelect,
    )

    def __init__(self, *args, **kwargs):
        kwargs.pop("role", None)
        super().__init__(*args, **kwargs)
        self.header = "Do you have a personal stance on the number of embryos to transfer each time?"
        self.subtext = "In the U.S., transferring a single embryo is generally agreed upon as the safest protocol for the health and safety of the carrier and baby. (Note: Even single embryo transfers can split, resulting in a multiple pregnancy.) We know beliefs can evolve and will support you."

    def get_fields_with_types(self):
        return [(field, self.get_field_type_class(field)) for field in self]

    def get_field_type_class(self, field):
        if isinstance(field.field, forms.ChoiceField):
            return 'checkbox-row input'
        elif isinstance(field.field, forms.CharField):
            return ''
        return ''


class OnboardingSurroForm8(forms.Form):
    carry_multiples = forms.ChoiceField(
        choices=[('Yes', 'Yes - Open to carrying multiples'),
                 ('No', 'No - Singleton pregnancy only'),
                 ],
        widget=forms.RadioSelect,
    )

    def __init__(self, *args, **kwargs):
        kwargs.pop("role", None)
        super().__init__(*args, **kwargs)
        self.header = "Are you open to carrying multiples?"
        self.subtext = "GCs / surrogates carrying multiples for their families are compensated additionally to cover the additional risk. That said, multiples vs singleton pregnancies are more likely to be high risk pregnancies with additional delivery challenges and longer recovery complications."

    def get_fields_with_types(self):
        return [(field, self.get_field_type_class(field)) for field in self]

    def get_field_type_class(self, field):
        if isinstance(field.field, forms.ChoiceField):
            return 'checkbox-row input'
        elif isinstance(field.field, forms.CharField):
            return ''
        return ''


class OnboardingSurroForm9(forms.Form):
    same_sex_carry = forms.ChoiceField(
        choices=[('Yes', 'Yes - Open to same-sex'),
                 ('No', 'No - only heterosexual couples/people'),
                 ],
        widget=forms.RadioSelect,
    )

    def __init__(self, *args, **kwargs):
        kwargs.pop("role", None)
        super().__init__(*args, **kwargs)
        self.header = "Are you open to carrying for same-sex intended parents?"
        self.subtext = "Every GC / surrogate has a different vision for which IPs they feel most connected to, out of the many deserving ones out there. Many IPs seeking surrogacy services are same-sex male couples or gay single intended dads."

    def get_fields_with_types(self):
        return [(field, self.get_field_type_class(field)) for field in self]

    def get_field_type_class(self, field):
        if isinstance(field.field, forms.ChoiceField):
            return 'checkbox-row input'
        elif isinstance(field.field, forms.CharField):
            return ''
        return ''


class OnboardingSurroForm10(forms.Form):
    different_lifestyle_carry = forms.ChoiceField(
        choices=[('Yes', 'Yes - Open to different religions/lifestyles'),
                 ('No', 'No - must share my religion/lifestyle'),
                 ],
        widget=forms.RadioSelect,
    )

    def __init__(self, *args, **kwargs):
        kwargs.pop("role", None)
        super().__init__(*args, **kwargs)
        self.header = "Are you open to carrying for IPs who don't share your religion or lifestyle?"
        self.subtext = "Every GC / surrogate has a unique vision for a journey that will make them feel seen, celebrated and in integrity. At this point in time, please select the option that best describes you."

    def get_fields_with_types(self):
        return [(field, self.get_field_type_class(field)) for field in self]

    def get_field_type_class(self, field):
        if isinstance(field.field, forms.ChoiceField):
            return 'checkbox-row input'
        elif isinstance(field.field, forms.CharField):
            return ''
        return ''


class OnboardingOtherForm(forms.ModelForm):
    concerns = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-concerns',
            'rows': 8,
            'style': 'resize:none;'
        }),
        max_length=400,
        required=False
    )

    class Meta:
        model = MemberTable
        fields = ['concerns']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.header = "Thank you for your interest in Crucible!"
        self.subtext = "Currently our team is hard at work developing tools for IPs, egg donors, and surrogates, but our commitment to these users may also mean expanding our focus.  We would be honored to hear a bit about your situation and understand what Crucible can do for you."

    def get_fields_with_types(self):
        return [(field, self.get_field_type_class(field)) for field in self]

    def get_field_type_class(self, field):
        if isinstance(field.field, forms.ChoiceField):
            return 'checkbox-row input'
        elif isinstance(field.field, forms.CharField):
            return ''
        return ''