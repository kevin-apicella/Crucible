from django.urls import path
from . import views
from .views import *


urlpatterns = [
    path("signup/", SignUpView.as_view(), name="signup"),
    path("landing_page/", LandingPageView.as_view(), name="landing_page"),
    path('gallery_details/', CommunityGalleryDetailsPageView.as_view(), name='gallery_details'),
    path('add/', audit_submission, name='audit_submission'),
    path('like/', carousel_submission, name='carousel_submission'),
    path('notify/', notify_me_submission, name='notify_me_submission'),
    path('onboarding/', OnboardingInitialView.as_view(), name="onboarding_start"),
    path('onboarding/<str:role>/<int:step>/', OnboardingRoleView.as_view(), name='onboarding'),
    path('onboarding/complete',  OnboardingCompleteView.as_view(), name='onboarding_complete'),
    path('construction/', views.under_construction, name='under_construction'),
    path('onboarding/other/', OnboardingOtherView.as_view(), name="onboarding_other"),
]
