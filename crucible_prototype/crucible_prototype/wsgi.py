"""
WSGI config for crucible_prototype project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "crucible_prototype.settings")
os.environ["DJANGO_SETTINGS_MODULE"] = "crucible_prototype.settings"

application = get_wsgi_application()
