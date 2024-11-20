# views.py
from django.http import JsonResponse
from django.urls import reverse_lazy
from django.views.generic import CreateView, TemplateView, FormView
from django import forms
from django.utils.decorators import method_decorator
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from .forms import CustomUserCreationForm
from django.shortcuts import redirect, render
from django.conf import settings
from .forms import *
from .models import *
from datetime import datetime
import os
import threading
from django.core.mail import send_mail as core_send_mail
from django.core.mail import EmailMultiAlternatives


class EmailThread(threading.Thread):
    def __init__(self, subject, body, from_email, recipient_list, fail_silently, html):
        self.subject = subject
        self.body = body
        self.recipient_list = recipient_list
        self.from_email = from_email
        self.fail_silently = fail_silently
        self.html = html
        threading.Thread.__init__(self)

    def run(self):
        msg = EmailMultiAlternatives(self.subject, self.body, self.from_email, self.recipient_list)
        if self.html:
            msg.attach_alternative(self.html, "text/html")
        msg.send(self.fail_silently)


def send_mail(subject, body, from_email, recipient_list, fail_silently=False, html=None,):
    EmailThread(subject, body, from_email, recipient_list, fail_silently, html).start()


completed_presets = [
    # "IPS1",
    # "EDA1",
    "EDA3",
    # "SA1",
]


class OnboardingInitialView(LoginRequiredMixin, FormView):
    template_name = 'onboarding.html'
    form_class = OnboardingStartForm

    def dispatch(self, request, *args, **kwargs):
        try:
            member = MemberTable.objects.get(member_id_id=self.request.user.id)
            roles = ["Intended Parent", "Egg Donor", "Surrogate"]
            if member.role not in roles:
                return redirect('onboarding_other')
        except MemberTable.DoesNotExist:
            return redirect('signup')
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        if form.cleaned_data['started_journey'] == "yes":
            self.request.session['started_journey'] = True
        elif form.cleaned_data['started_journey'] == "no":
            self.request.session['started_journey'] = False
        try:
            member = MemberTable.objects.get(member_id_id=self.request.user.id)
            role = member.role
        except MemberTable.DoesNotExist:
            return redirect('signup')
        if role == "Intended Parent":
            role = "IP"
            self.request.session['total_steps'] = 9
        elif role == "Egg Donor":
            role = "ED"
            self.request.session['total_steps'] = 9
        elif role == "Surrogate":
            self.request.session['total_steps'] = 17
        self.request.session['role'] = role
        step = 1
        self.request.session['step'] = step
        return redirect('onboarding', role=role, step=step)


class OnboardingOtherView(LoginRequiredMixin, CreateView):
    template_name = "onboarding_other.html"
    form_class = OnboardingOtherForm

    def form_valid(self, form):
        try:
            member = MemberTable.objects.get(member_id_id=self.request.user.id)
        except MemberTable.DoesNotExist:
            raise Http404("Member not found")
        if member.preset_id:
            return redirect('landing_page')
        else:
            member.concerns = form.cleaned_data['concerns']
            member.preset_id = "Other"
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [os.getenv('RECIPIENT1'), settings.DEFAULT_FROM_EMAIL]
            subject = 'Intake Completed - Other User'
            message = (f'This is an automated report triggered by a user completing the FLE (intake survey)\n\n'
            f'Name: {self.request.user.first_name} {self.request.user.last_name}\n'
            f'Email: {self.request.user.email}\n'
            f'Role: {member.role}\n'
            f'Preset id: {member.preset_id}\n'
            f'-----------------------------\n'
            f'This user has registered as a unique role and had the following to share about their situation:\n'
            f'{member.concerns}')
            send_mail(subject, message, from_email, recipient_list)
            member.save()

            return redirect('landing_page')


class OnboardingRoleView(LoginRequiredMixin, FormView):
    template_name = 'onboarding.html'

    def assign_preset_id(self):
        role = self.request.session.get('role')
        if role == "IP":
            question_set = [self.request.session.get('donor_eggs'),
                            self.request.session.get('donor_sperm'),
                            self.request.session.get('need_surrogate')]

            if question_set == ["Yes, fresh eggs", "No - own frozen sperm", "Yes"]:
                self.request.session['preset_id'] = "IPS1"
            elif question_set == ["Yes, frozen eggs", "No - own frozen sperm", "Yes"]:
                self.request.session['preset_id'] = "IPS2"
            elif question_set == ["Yes, fresh eggs", "No - own fresh sperm", "Yes"]:
                self.request.session['preset_id'] = "IPS3"
            elif question_set == ["Yes, frozen eggs", "No - own fresh sperm", "Yes"]:
                self.request.session['preset_id'] = "IPS4"
            elif question_set == ["No, using my own fresh eggs", "Yes - fresh donor sperm", "Yes"]:
                self.request.session['preset_id'] = "IPS5"
            elif question_set == ["No, using my own frozen eggs", "Yes - frozen donor sperm", "Yes"]:
                self.request.session['preset_id'] = "IPS6"
            elif question_set == ["No, using my own fresh eggs", "No - own fresh sperm", "Yes"]:
                self.request.session['preset_id'] = "IPS7"
            elif question_set == ["No, using my own frozen eggs", "No - own fresh sperm", "Yes"]:
                self.request.session['preset_id'] = "IPS8"
            elif question_set == ["No, using my own fresh eggs", "No - own frozen sperm", "Yes"]:
                self.request.session['preset_id'] = "IPS9"
            elif question_set == ["No, using my own frozen eggs", "No - own frozen sperm", "Yes"]:
                self.request.session['preset_id'] = "IPS10"
            elif question_set == ["Yes, fresh eggs", "No - own frozen sperm", "No"]:
                self.request.session['preset_id'] = "IPO1"
            elif question_set == ["Yes, frozen eggs", "No - own frozen sperm", "No"]:
                self.request.session['preset_id'] = "IPO2"
            elif question_set == ["Yes, fresh eggs", "No - own fresh sperm", "No"]:
                self.request.session['preset_id'] = "IPO3"
            elif question_set == ["Yes, frozen eggs", "No - own fresh sperm", "No"]:
                self.request.session['preset_id'] = "IPO4"
            elif question_set == ["No, using my own fresh eggs", "Yes - fresh donor sperm", "No"]:
                self.request.session['preset_id'] = "IPO5"
            elif question_set == ["No, using my own frozen eggs", "Yes - frozen donor sperm", "No"]:
                self.request.session['preset_id'] = "IPO6"
            elif question_set == ["No, using my own fresh eggs", "No - own fresh sperm", "No"]:
                self.request.session['preset_id'] = "IPO7"
            elif question_set == ["No, using my own frozen eggs", "No - own fresh sperm", "No"]:
                self.request.session['preset_id'] = "IPO8"
            elif question_set == ["No, using my own fresh eggs", "No - own frozen sperm", "No"]:
                self.request.session['preset_id'] = "IPO9"
            elif question_set == ["No, using my own frozen eggs", "No - own frozen sperm", "No"]:
                self.request.session['preset_id'] = "IPO10"
            else:
                self.request.session['preset_id'] = "Exception"
            # IPS11 and IPO11 not enabled currently
        elif role == "ED":
            question_set = [
                self.request.session.get('donor_experience'),
                self.request.session.get('bank_donation'),
                self.request.session.get('use_agency')
            ]
            if question_set == ["Yes", "No", "Yes"]:
                self.request.session['preset_id'] = "EDA1"
            elif question_set == ["Yes", "Yes", "Yes"]:
                self.request.session['preset_id'] = "EDA2"
            elif question_set == ["No", "No", "Yes"]:
                self.request.session['preset_id'] = "EDA3"
            elif question_set == ["No", "Yes", "Yes"]:
                self.request.session['preset_id'] = "EDA4"
            elif question_set == ["Yes", "No", "No"]:
                self.request.session['preset_id'] = "EDI1"
            elif question_set == ["Yes", "Yes", "No"]:
                self.request.session['preset_id'] = "EDI2"
            elif question_set == ["No", "No", "No"]:
                self.request.session['preset_id'] = "EDI3"
            elif question_set == ["No", "Yes", "No"]:
                self.request.session['preset_id'] = "EDI4"
            else:
                self.request.session['preset_id'] = None
        elif role == "Surrogate":
            question_set = [
                self.request.session.get('surro_experience'),
                self.request.session.get('willing_to_travel'),
                self.request.session.get('use_agency'),
            ]
            if question_set == ["Yes", "Yes", "Yes"]:
                self.request.session['preset_id'] = "SA1"
            elif question_set == ["Yes", "No", "Yes"]:
                self.request.session['preset_id'] = "SA2"
            elif question_set == ["No", "Yes", "Yes"]:
                self.request.session['preset_id'] = "SA3"
            elif question_set == ["No", "No", "Yes"]:
                self.request.session['preset_id'] = "SA4"
            elif question_set == ["Yes", "Yes", "No"]:
                self.request.session['preset_id'] = "SI1"
            elif question_set == ["Yes", "No", "No"]:
                self.request.session['preset_id'] = "SI2"
            elif question_set == ["No", "Yes", "No"]:
                self.request.session['preset_id'] = "SI3"
            elif question_set == ["No", "No", "No"]:
                self.request.session['preset_id'] = "SI4"
            else:
                self.request.session['preset_id'] = "Exception"
        else:
            self.request.session['preset_id'] = None

    def get(self, request, *args, **kwargs):
        url_step = int(self.kwargs.get('step', 1))

        if 'HTTP_REFERER' in request.META:
            referer = request.META['HTTP_REFERER']
            if f'step={url_step + 1}' in referer:
                correct_step = url_step
            elif f'step={url_step - 1}' in referer:
                correct_step = url_step
            else:
                correct_step = url_step
        else:
            correct_step = url_step
        request.session['step'] = correct_step
        request.session['previous_step'] = max(0, correct_step - 1)

        return super().get(request, *args, **kwargs)

    def get_form_class(self):
        role = self.kwargs.get('role')
        step = int(self.request.session.get('step'))
        if step == 0:
            return OnboardingStartForm
        elif step == 1:
            if role == "IP":
                return OnboardingIpForm1
            elif role == "ED":
                return OnboardingEdForm1
            elif role == "Surrogate":
                return OnboardingSurroForm1
        elif step == 2:
            if role == "IP":
                return OnboardingIpForm2
            elif role == "ED":
                return OnboardingEdForm2
            elif role == "Surrogate":
                return OnboardingSurroForm2
        elif step == 3:
            if role == "IP":
                return OnboardingIpForm3
            elif role == "ED":
                return OnboardingEdForm3
            elif role == "Surrogate":
                return OnboardingSurroForm3
        elif step == 4:
            self.assign_preset_id()
            if role == "Surrogate":
                return OnboardingSurroForm4
            else:
                if self.request.session.get('preset_id') in completed_presets and self.request.session.get('started_journey') == True:
                    return OnboardingCurrentStep
                elif self.request.session.get('preset_id') in completed_presets:
                    self.request.session['step'] = 5
                    self.request.session['preference'] = 0
                    return OnboardingMilestone
                else:
                    self.request.session['step'] = 6
                    self.request.session['preference'] = 0
                    return OnboardingConcernsForm
        elif step == 5:
            if role == "Surrogate":
                return OnboardingSurroForm5
            else:
                return OnboardingMilestone
        elif step == 6:
            if role == "Surrogate":
                return OnboardingSurroForm6
            else:
                return OnboardingConcernsForm
        elif step == 7:
            return OnboardingSurroForm7
        elif step == 8:
            return OnboardingSurroForm8
        elif step == 9:
            return OnboardingSurroForm9
        elif step == 10:
            return OnboardingSurroForm10
        elif step == 11:
            return OnboardingConcernsForm

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        step = self.request.session.get('step')
        role = self.request.session.get('role')
        kwargs['role'] = role
        if step == 4:
            kwargs['preset_id'] = self.request.session.get('preset_id')
        elif step == 5 and role != "Surrogate":
            kwargs['current_milestone'] = self.request.session.get('current_milestone')
            kwargs['preset_id'] = self.request.session.get('preset_id')
        return kwargs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['role'] = self.request.session.get('role')
        context['step'] = int(self.request.session.get('step', 1))
        context['progress_percentage'] = (context['step'] / self.request.session.get("total_steps")) * 100
        context['started_journey'] = self.request.session.get('started_journey')
        context['previous_step'] = int(self.request.session.get('previous_step', 0))
        print(context)
        return context

    def form_valid(self, form):
        role = self.request.session.get('role')
        current_step = int(self.request.session.get('step'))
        if current_step == 0:
            if form.cleaned_data['started_journey'] == "yes":
                self.request.session['started_journey'] = True
            elif form.cleaned_data['started_journey'] == "no":
                self.request.session['started_journey'] = False
        if current_step == 1:
            if role == "IP":
                self.request.session['donor_eggs'] = form.cleaned_data['donor_eggs']
            elif role == "ED":
                self.request.session['donor_experience'] = form.cleaned_data['donor_experience']
            elif role == "Surrogate":
                self.request.session['surro_experience'] = form.cleaned_data['surro_experience']
        elif current_step == 2:
            if role == "IP":
                self.request.session['donor_sperm'] = form.cleaned_data['donor_sperm']
            elif role == "ED":
                self.request.session['bank_donation'] = form.cleaned_data['bank_donation']
            elif role == "Surrogate":
                self.request.session['willing_to_travel'] = form.cleaned_data['willing_to_travel']
        elif current_step == 3:
            if role == "IP":
                self.request.session['need_surrogate'] = form.cleaned_data['need_surrogate']
            elif role == "ED":
                self.request.session['use_agency'] = form.cleaned_data['use_agency']
            elif role == "Surrogate":
                self.request.session['use_agency'] = form.cleaned_data['use_agency']
        elif current_step == 4:
            if role == "Surrogate":
                if form.cleaned_data['international_ip'] == "Yes":
                    self.request.session['international_ip'] = True
                elif form.cleaned_data['international_ip'] == "No":
                    self.request.session['international_ip'] = False
            else:
                self.request.session['current_milestone'] = form.cleaned_data['current_milestone']
        elif current_step == 5:
            if role == "Surrogate":
                self.request.session['stance_termination'] = form.cleaned_data['stance_termination']
            else:
                self.request.session['next_milestone'] = form.cleaned_data['next_milestone']
                self.request.session['milestone_date'] = form.cleaned_data['calendar'].strftime('%Y-%m-%d')
        elif current_step == 6:
            if role == "Surrogate":
                self.request.session['stance_vaccines'] = form.cleaned_data['stance_vaccines']
            else:
                self.request.session['concerns'] = form.cleaned_data['concerns']
        elif current_step == 7:
            self.request.session['stance_embryo_transfer'] = form.cleaned_data['stance_embryo_transfer']
        elif current_step == 8:
            if form.cleaned_data['carry_multiples'] == "Yes":
                self.request.session['carry_multiples'] = True
            elif form.cleaned_data['carry_multiples'] == "No":
                self.request.session['carry_multiples'] = False
        elif current_step == 9:
            if form.cleaned_data['same_sex_carry'] == "Yes":
                self.request.session['same_sex_carry'] = True
            elif form.cleaned_data['same_sex_carry'] == "No":
                self.request.session['same_sex_carry'] = False
        elif current_step == 10:
            if form.cleaned_data['different_lifestyle_carry'] == "Yes":
                self.request.session['different_lifestyle_carry'] = True
            elif form.cleaned_data['different_lifestyle_carry'] == "No":
                self.request.session['different_lifestyle_carry'] = False
        elif current_step == 11:
            self.request.session['concerns'] = form.cleaned_data['concerns']

        next_step = current_step + 1
        self.request.session['step'] = next_step
        if next_step > 6 and role != "Surrogate":
            return redirect('onboarding_complete')
        elif next_step > 11:
            return redirect('onboarding_complete')
        elif self.request.session['step'] == 0:
            return redirect('onboarding_start')
        else:
            return redirect('onboarding', role=role, step=next_step)


class OnboardingCompleteView(LoginRequiredMixin, FormView):
    template_name = 'onboarding_complete.html'
    form_class = OnboardingCompleteForm

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        return kwargs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['role'] = self.request.session.get("role")
        context_fields = [
            'started_journey', 'current_milestone', 'next_milestone', 'milestone_date', 'concerns',
            'donor_eggs', 'donor_sperm', 'need_surrogate',
            'donor_experience', 'bank_donation', 'use_agency',
            'surro_experience', 'willing_to_travel', 'international_ip', 'stance_termination', 'stance_vaccines',
            'stance_embryo_transfer', 'carry_multiples', 'same_sex_carry', 'different_lifestyle_carry',
        ]
        for field in context_fields:
            context[field] = self.request.session.get(field)
        # The following are explicitly to change the formatting of Onboardingcomplete answers in the template
        # THIS LENGTH THING IS JUST FOR YC #####################
        if self.request.session.get('preset_id') == "EDA3":
            if len(context['next_milestone']) > 50:
                self.request.session['next_milestone'] = "Confirm IP interest to proceed for medical screen"
        # END OF YC BLOCK ######################################
        if context['milestone_date']:
            context['converted_date'] = datetime.strptime(context['milestone_date'], "%Y-%m-%d").strftime("%B %d, %Y")
        if context['stance_termination'] == "danger_child":
            context['termination'] = 'Yes - Termination only if danger to child'
        elif context['stance_termination'] == "danger_both":
            context['termination'] = 'Yes - Termination if danger to child or carrier (me)'
        elif context['stance_termination'] == "clinic_rec":
            context['termination'] = 'Yes - Termination if recommended by clinic'
        elif context['stance_termination'] == "ip_request":
            context['termination'] = 'Yes - Termination if requested by IPs'
        elif context['stance_termination'] == "none":
            context['termination'] = "No - I haven't made up my mind"
        return context

    def form_valid(self, form):
        member = MemberTable.objects.get(member_id_id=self.request.user.id)
        if member.preset_id:
            if member.preset_id in completed_presets:
                return redirect('timeline')
            else:
                return redirect('under_construction')
        role = self.request.session.get('role')
        context_fields = [
            'started_journey', 'current_milestone', 'next_milestone', 'milestone_date', 'concerns', 'preset_id'
        ]

        surrogate_fields = [
                            "international_ip", "stance_termination", "stance_vaccines", "stance_embryo_transfer",
                            "carry_multiples", "same_sex_carry", "different_lifestyle_carry"
        ]
        if role == "IP":
            for field in context_fields:
                setattr(member, field, self.request.session.get(field))
            setattr(member, "first_question", self.request.session.get("donor_eggs"))
            setattr(member, "second_question", self.request.session.get("donor_sperm"))
            setattr(member, "third_question", self.request.session.get("need_surrogate"))
            message = (
                f'This is an automated report triggered by a user completing the FLE (not intake survey)\n\n'
                f'Name: {self.request.user.first_name} {self.request.user.last_name}\n'
                f'Email: {self.request.user.email}\n'
                f'Role: {role}\n'
                f'Preset id: {member.preset_id}\n'
                f'-----------------------------\n'
                f'Have you begun your journey: {member.started_journey}\n'
                f'Will you be using donor eggs to create embryos: {member.first_question}\n'
                f'Will you be using donor sperm: {member.second_question}\n'
                f'Will you need to work with a surrogate to carry the pregnancy to term: {member.third_question}\n'
            )
        elif role == "ED":
            for field in context_fields:
                setattr(member, field, self.request.session.get(field))
            setattr(member, "first_question", self.request.session.get("donor_experience"))
            setattr(member, "second_question", self.request.session.get("bank_donation"))
            setattr(member, "third_question", self.request.session.get("use_agency"))
            message = (
                f'This is an automated report triggered by a user completing the FLE (not intake survey)\n\n'
                f'Name:     {self.request.user.first_name} {self.request.user.last_name}\n'
                f'Email:     {self.request.user.email}\n'
                f'Role:     {role}\n'
                f'Preset id:     {member.preset_id}\n'
                f'-----------------------------\n'
                f'Have you begun your journey:     {member.started_journey}\n'
                f'Is this your first time donating eggs:     {member.first_question}\n'
                f'Will you be donating to an egg bank:     {member.second_question}\n'
                f'Will your donation be managed by an agency:     {member.third_question}\n'
            )
        elif role == "Surrogate":
            context_fields.extend(surrogate_fields)
            for field in context_fields:
                setattr(member, field, self.request.session.get(field))
            setattr(member, "first_question", self.request.session.get("surro_experience"))
            setattr(member, "second_question", self.request.session.get("willing_to_travel"))
            setattr(member, "third_question", self.request.session.get("use_agency"))
            message = (
                f'This is an automated report triggered by a user completing the FLE (not intake survey)\n\n'
                f'Name:     {self.request.user.first_name} {self.request.user.last_name}\n'
                f'Email:     {self.request.user.email}\n'
                f'Role:     {role}\n'
                f'Preset id:     {member.preset_id}\n'
                f'-----------------------------\n'
                f'Have you begun your journey:     {member.started_journey}\n'
                f'Is this your first surrogacy journey:     {member.first_question}\n'
                f'Are you willing to travel far:     {member.second_question}\n'
                f'Will your journey be managed by an agency:     {member.third_question}\n'
                f'Willing to work with International IPs:     {member.international_ip}\n'
                f'Personal stance on abortion:     {member.stance_termination}\n'
                f'Personal stance on vaccines:     {member.stance_vaccines}\n'
                f'Stance on embryo transfer:     {member.stance_embryo_transfer}\n'
                f'Open to carrying multiples:     {member.carrying_multiples}\n'
                f'Open to carrying for same-sex:     {member.same_sex_carry}\n'
                f'Open to IPs with different lifestyles:     {member.different_lifestyle_carry}\n'
            )
        member.save()
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [os.getenv('RECIPIENT1'), settings.DEFAULT_FROM_EMAIL]

        if member.preset_id in completed_presets:
            subject = 'Intake Completed - Gantt functional'
            message = message + (
                f'Current milestone:     {member.current_milestone}\n'
                f'Next milestone:     {member.next_milestone}\n'
                f'To be achieved by:     {member.milestone_date}\n'
                f'Concerns:\n'
                f'{member.concerns}'
            )
            send_mail(subject, message, from_email, recipient_list)
            return redirect('timeline')
        else:
            subject = 'Intake Completed - Preset unavailable'
            message = message + (
                f'Concerns:\n'
                f'{member.concerns}'
            )
            send_mail(subject, message, from_email, recipient_list)
            return redirect('under_construction')


class SignUpView(CreateView):
    form_class = CustomUserCreationForm
    template_name = "signup.html"
    success_url = reverse_lazy("landing_page")

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            print(request.user)
            print("User is authenticated")
            return redirect('landing_page')
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        response = super().form_valid(form)
        user = self.object

        login(self.request, user)

        role = form.cleaned_data.get('role')
        other_role = form.cleaned_data.get('other_role')

        member = MemberTable.objects.create(
            member_id=user,
            member_status='early_user',  # This will need to be changed after early access
            role=role
        )

        if role == MemberTable.OTHER:
            member.role = "Other - " + other_role
            member.save()
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [os.getenv('RECIPIENT1'), settings.DEFAULT_FROM_EMAIL]
        subject = 'New account created'
        message = (
            f"This is an automated report triggered by a new user account being created. Note: We don't know if they will complete the FLE.\n\n"       
            f'Name: {user.first_name} {user.last_name}\n'
            f'Email: {user.email}\n'
            f'Role: {role}'
        )
        send_mail(subject, message, from_email, recipient_list)
        return response


class LandingPageView(LoginRequiredMixin, TemplateView):
    template_name = "landing_page.html"
    success_url = reverse_lazy("login")

    def get(self, request, *args, **kwargs):
        try:
            member = MemberTable.objects.get(member_id_id=self.request.user.id)
            if member.preset_id is None:
                return redirect('onboarding_start')
        except MemberTable.DoesNotExist:
            return redirect('signup')
        return super().get(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        member = MemberTable.objects.get(member_id_id=self.request.user.id)
        if member.preset_id in completed_presets:
            context['show_button'] = True
        else:
            context['show_button'] = False
        return context


class CommunityGalleryDetailsPageView(CreateView):
    form_class = UserCreationForm
    template_name = "community_gallery_details.html"
    success_url = reverse_lazy("login")
    
    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        image_name = self.request.GET.get('image', 'crucible-logo.jpg')
        context['image_name'] = image_name
        return context


def audit_submission(request):
    if request.method == 'POST':
        member_id_value = request.user.id
        action_id_value = request.POST.get('action_id_value')
        if member_id_value and action_id_value:
            form = AuditTableM1(action_id_id=action_id_value, member_id_id=member_id_value, )
            form.save()
            return JsonResponse({'status': 'success'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid data'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})


def carousel_submission(request):
    if request.method == 'POST':
        member_like_response = request.POST.get('member_like_response')
        carousel_preferences_id = request.POST.get('carousel_preferences_id')
        member_id = request.user.id
        if member_like_response and carousel_preferences_id and member_id:
            form = CarouselUserReport(member_like_response=member_like_response, carousel_preferences_id_id=carousel_preferences_id, member_id_id=member_id)
            form.save()
            return JsonResponse({'status': 'success'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid data'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})


def notify_me_submission(request):
    if request.method == 'POST':
        user_email = request.user.email
        if user_email:
            form = NotifyMeM1(user_email=user_email)
            form.save()
            return JsonResponse({'status': 'Thank you! Your submission has been recorded'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Your email has already been submitted.  Thank you.'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})


def under_construction(request):
    image_url = "/static/images/under-construction.jpg"
    return render(request, 'under_construction.html', {'image_url': image_url})
