from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import *


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ("id", "email", "is_staff", "is_active",)
    list_filter = ("id", "email", "is_staff", "is_active",)
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Permissions", {"fields": ("is_staff", "is_active", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email", "password1", "password2", "is_staff",
                "is_active", "groups", "user_permissions"
            )}
        ),
    )
    search_fields = ("email",)
    ordering = ("email",)


class IntakeReferenceTableAdmin(admin.ModelAdmin):
    list_display = ('preset_id', 'milestone_order', 'milestone_name', 'duration')
    list_filter = ('preset_id', 'milestone_order')
    search_fields = ('preset_id', 'milestone_name')
    ordering = ('preset_id', 'milestone_order')


class MemberTableAdmin(admin.ModelAdmin):
    list_display = ('member_id', 'member_status', 'role', 'concerns', 'preset_id')
    list_filter = ('member_status', 'role')
    search_fields = ('member_id__email', 'member_status', 'role', 'concerns', 'preset_id')
    fields = ('member_id', 'member_status', 'role', 'concerns', 'preset_id')

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.base_fields['concerns'].required = False
        form.base_fields['preset_id'].required = False
        return form


admin.site.register(MemberTable, MemberTableAdmin)
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(CarouselPreferences)
admin.site.register(ActionTable)
admin.site.register(CarouselUserReport)
admin.site.register(AuditTableM1)
admin.site.register(NotifyMeM1)
admin.site.register(IntakeReferenceTable, IntakeReferenceTableAdmin)
