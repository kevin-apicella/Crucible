# Makefile commands for quickstart and daily dev usage

# Define the root directory for this project, currently "." TODO: This should be moved into /apps/crucible-django in the future
ROOT_DIR := .

# Define the path to the django project directory
DJANGO_DIR := crucible_prototype

# Define a path for the virtual environment to be created in, within the root dir
VENV_DIR := venv

# Database URL (adjust as needed for your local setup)
DATABASE_URL ?= postgres://postgres:postgres@localhost:5432/crucible_prototype

# Determine the operating system
UNAME_S := $(shell uname -s)

# Postgres local variable values
PG_USER := crucible_user
PG_PASSWORD := crucible_password
PG_DB := crucible_prototype
PG_VERSION := 14.12

# Versioned name for use in a variety of scripts
PG_VERSIONED_NAME := postgresql@14

# Database commands
ifeq ($(UNAME_S),Linux)
    # For Debian-based systems (e.g., Ubuntu)
    PG_VERSION := $(shell pg_lsclusters | tail -n1 | awk '{print $$1}')
    PG_CLUSTER := $(shell pg_lsclusters | tail -n1 | awk '{print $$2}')
    dev-start-db:
			@echo "Checking PostgreSQL database status..."
			@if sudo pg_ctlcluster $(PG_VERSION) $(PG_CLUSTER) status > /dev/null 2>&1; then \
				echo "PostgreSQL database is already running."; \
			else \
				echo "Starting PostgreSQL database..."; \
				sudo pg_ctlcluster $(PG_VERSION) $(PG_CLUSTER) start; \
				echo "PostgreSQL database started."; \
			fi

    dev-stop-db:
	    @echo "Stopping local PostgreSQL database..."
	    @sudo pg_ctlcluster $(PG_VERSION) $(PG_CLUSTER) stop

    dev-db-status:
	    @echo "Checking PostgreSQL database status..."
	    @sudo pg_ctlcluster $(PG_VERSION) $(PG_CLUSTER) status
else
    # For macOS and other systems
    dev-start-db:
			@echo "Starting PostgreSQL..."
			@brew services restart $(PG_VERSIONED_NAME)
			@sleep 3  # Give PostgreSQL a moment to start up
			@if ! pg_isready -q; then \
				echo "PostgreSQL service restarted but is not running. Checking logs..."; \
				tail -n 100 /opt/homebrew/var/log/$(PG_VERSIONED_NAME).log; \
				echo ""; \
				echo "Please check the above log output for errors."; \
				echo "You may need to manually resolve issues before proceeding."; \
				exit 1; \
			fi
			@echo "PostgreSQL started successfully."

    dev-stop-db:
	    @echo "Stopping local PostgreSQL database..."
	    @brew services stop postgresql

    dev-db-status:
	    @echo "Checking PostgreSQL database status..."
	    @brew services info postgresql
endif

### Virtual environment commands

# Assert that you are within the virutal environment
assert-venv:
	echo "Checking for virtual environment..."
	@if [ -z "$$VIRTUAL_ENV" ]; then \
		echo ""; \
		echo ""; \
		echo ""; \
		echo ""; \
		echo "ERROR: Not running in a virtual environment!"; \
		echo "It's crucial to run Django and manage dependencies in a virtual environment."; \
		echo "This isolates the project's dependencies from your system-wide Python packages."; \
		echo ""; \
		echo "If you haven't created a virtual environment yet, run:"; \
		echo "make venv"; \
		echo ""; \
		echo "To activate the virtual environment, run:"; \
		echo "source $(ROOT_DIR)/$(VENV_DIR)/bin/activate"; \
		echo ""; \
		echo "After activating the virtual environment, your prompt should change."; \
		echo "Then you can run your make commands again."; \
		exit 1; \
	else \
		echo "Virtual environment is active."; \
	fi

# Create virtual environment
venv:
	@echo "Checking for virtual environment..."
	@if [ ! -d "$(ROOT_DIR)/$(VENV_DIR)" ]; then \
		echo "Virtual environment not found. Creating new virtual environment..."; \
		python3 -m venv $(ROOT_DIR)/$(VENV_DIR); \
		echo "Virtual environment created at $(ROOT_DIR)/$(VENV_DIR)"; \
		echo "To activate, run: source $(ROOT_DIR)/$(VENV_DIR)/bin/activate"; \
	else \
		echo "Virtual environment already exists at $(ROOT_DIR)/$(VENV_DIR)"; \
		echo "To activate, run: source $(ROOT_DIR)/$(VENV_DIR)/bin/activate"; \
	fi

# Install python dependencies within venv
venv-pip-install:
	@make assert-venv
	@echo "Installing Python dependencies..."
	@pip install -r requirements.txt

# List outdated packages
venv-pip-get-outdated:
	@make assert-venv
	@echo ""
	@echo "Checking for outdated packages..."
	@pip list --outdated
	@echo ""
	@echo "To upgrade a package, run: pip install --upgrade package_name"
	@echo "After upgrading, don't forget to update requirements.txt:"
	@echo "pip freeze > requirements.txt"

# Destroy the venv to start fresh
venv-remove-destructive:
	@echo "Checking for existing virtual environment..."
	@if [ -d "$(ROOT_DIR)/$(VENV_DIR)" ]; then \
		echo "Virtual environment found at $(ROOT_DIR)/$(VENV_DIR)"; \
		echo "Removing virtual environment..."; \
		rm -rf $(ROOT_DIR)/$(VENV_DIR); \
		echo "Virtual environment has been removed."; \
		echo "If you were using this environment, please exit your current shell or run 'deactivate'."; \
	else \
		echo "No virtual environment found at $(ROOT_DIR)/$(VENV_DIR)"; \
		echo "Nothing to uninstall."; \
	fi

### All setup commands

# One-time setup command, will fail early on certain actions if partially committed
first-time-setup:
	@echo "Setting up your environment"
	@make setup-system-deps
	@if [ "$(shell uname)" = "Darwin" ]; then \
		make setup-postgres-mac; \
	elif [ "$(shell uname)" = "Linux" ]; then \
		make setup-postgres-linux; \
	else \
		echo "Unsupported operating system"; \
		exit 1; \
	fi
	@make venv

# Setup an environment variable dotfile for local development. 
#  Preqrequistes:
#    - Virtual env is active, dependencies already installed
#    - Django is installed
setup-env-local-dotfile:
	@echo "Creating .env.local file..."
	@if [ -f .env.local ]; then \
		echo ".env.local file already exists. Backing up to .env.local.bak"; \
		mv .env.local .env.local.bak; \
	fi
	@echo "CRUCIBLE_DB_URL=postgres://crucible_user:crucible_password@localhost:5432/crucible_prototype" > .env.local
	@echo "CRUCIBLE_DEBUG=True" >> .env.local
	@echo "CRUCIBLE_SECRET_KEY=$(shell make generate-secret-key-silent)" >> .env.local
	@echo "CRUCIBLE_ALLOWED_HOSTS=localhost,127.0.0.1" >> .env.local
	@echo "PG_USER=crucible_user" >> .env.local
	@echo "PG_PASSWORD=crucible_password" >> .env.local
	@echo "PG_DB=crucible_prototype" >> .env.local
	@echo ".env.local file created successfully."

# Install system deps, these vary by environment
setup-system-deps:
	@echo "Installing system dependencies..."
	@if [ "$(shell uname)" = "Darwin" ]; then \
		brew install cairo pkg-config xz $(PG_VERSIONED_NAME); \
	elif [ "$(shell uname)" = "Linux" ]; then \
		sudo apt-get update && sudo apt-get install -y libcairo2-dev pkg-config postgresql libpq-dev python3.10-venv libgirepository1.0-dev; \
	else \
		echo "Unsupported operating system"; \
		exit 1; \
	fi

# Setup postgres server
setup-postgres-linux:
	@echo "===== PostgreSQL Setup ====="
	@echo "Note: You may see 'could not change directory' warnings during this process."
	@echo "These warnings are harmless and related to permission differences between your user and the postgres user."
	@echo "The setup will proceed correctly despite these warnings."
	@echo "=============================\n"
	@echo "Setting up PostgreSQL user and database..."
	@if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw $(PG_DB); then \
		echo "Database $(PG_DB) already exists."; \
	else \
		sudo -u postgres createdb $(PG_DB); \
		echo "Database $(PG_DB) created."; \
	fi
	@if sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$(PG_USER)'" | grep -q 1; then \
		echo "User $(PG_USER) already exists."; \
	else \
		sudo -w -u postgres psql -c "CREATE USER $(PG_USER) WITH PASSWORD '$(PG_PASSWORD)';" 2>/dev/null; \
		echo "User $(PG_USER) created."; \
	fi
	@sudo -w -u postgres psql -c "ALTER USER $(PG_USER) WITH SUPERUSER;" 2>/dev/null
	@sudo -w -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $(PG_DB) TO $(PG_USER);" 2>/dev/null
	@echo "\nPostgreSQL user and database setup complete."
	@echo "If you encountered any errors during this process, please review them and seek assistance if needed."

setup-postgres-mac:
	@echo "Setting up PostgreSQL on macOS..."
	@if [ ! -d /opt/homebrew/var/$(PG_VERSIONED_NAME) ]; then \
		@make dev-stop-db \
		rm -rf /opt/homebrew/var/$(PG_VERSIONED_NAME); \
		mkdir -p /opt/homebrew/var/$(PG_VERSIONED_NAME); \
		initdb --locale=C -E UTF-8 /opt/homebrew/var/$(PG_VERSIONED_NAME); \
	fi
	@make dev-start-db
	@sleep 3  # Give PostgreSQL a moment to start up
	@if ! psql -d postgres -c '\q' 2>/dev/null; then \
		createdb; \
	fi
	@if ! psql -d $(PG_DB) -c '\q' 2>/dev/null; then \
		createdb $(PG_DB); \
	fi
	@if ! psql -d $(PG_DB) -c "SELECT 1 FROM pg_roles WHERE rolname='$(PG_USER)'" | grep -q 1; then \
		psql -d $(PG_DB) -c "CREATE USER $(PG_USER) WITH PASSWORD '$(PG_PASSWORD)' SUPERUSER;"; \
	fi
	@echo "PostgreSQL setup on macOS complete."


# Setup the django environment
setup-django:
	@make assert-venv
	@make venv-pip-install
	@echo "Setting up Django project..."
	@if [ ! -d "$(DJANGO_DIR)" ]; then \
		echo "Setting up database..."; \
		DATABASE_URL=$(DATABASE_URL) python $(DJANGO_DIR)/manage.py makemigrations; \
		DATABASE_URL=$(DATABASE_URL) python $(DJANGO_DIR)/manage.py migrate; \
		echo "Creating superuser..."; \
		DATABASE_URL=$(DATABASE_URL) python $(DJANGO_DIR)/manage.py createsuperuser; \
	else \
		echo "Django project already exists. Updating..."; \
		DATABASE_URL=$(DATABASE_URL) python $(DJANGO_DIR)/manage.py makemigrations; \
		DATABASE_URL=$(DATABASE_URL) python $(DJANGO_DIR)/manage.py migrate; \
	fi
	@echo "Django setup complete!"

# Django commands
dev-start-django:
	@make assert-venv
	@echo "Starting Django development server..."
	@python $(DJANGO_DIR)/manage.py runserver

dev-django-generate-migrations:
	@make assert-venv
	@echo "Creating new migrations..."
	@python $(DJANGO_DIR)/manage.py makemigrations

dev-django-migrate:
	@make assert-venv
	@echo "Applying migrations..."
	@python $(DJANGO_DIR)/manage.py migrate

dev-start-django-dbshell:
	@make assert-venv
	@echo "Starting database shell..."
	@python $(DJANGO_DIR)/manage.py dbshell

dev-start-django-shell:
	@make assert-venv
	@echo "Starting Django shell..."
	@python $(DJANGO_DIR)/manage.py shell

dev-test-django:
	@make assert-venv
	@echo "Running tests..."
	@python $(DJANGO_DIR)/manage.py test

dev-django-collectstatic:
	@make assert-venv
	@echo "Collecting static files..."
	@python $(DJANGO_DIR)/manage.py collectstatic --noinput

dev-django-createsuperuser:
	@make assert-venv
	@echo "Creating a superuser..."
	@python $(DJANGO_DIR)/manage.py createsuperuser

# Enhanced start-dev command
dev-start-web:
	@make assert-venv
	@make dev-start-db
	@make dev-start-django

# Local environment only commands
generate-secret-key:
	@echo "Generating new Django secret key..."
	@python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
	@echo "Copy this key and update your .env file with: CRUCIBLE_SECRET_KEY=<generated_key>"

generate-secret-key-silent:
	@python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# This ensures that Make will run these targets even if a file with the same name exists, and it won't check for file timestamps.
.PHONY: assert-venv venv venv-pip-install venv-pip-get-outdated venv-remove-destructive \
        first-time-setup setup-env-local-dotfile setup-system-deps setup-postgres-linux setup-postgres-mac setup-django \
        dev-start-db dev-stop-db dev-db-status \
        dev-start-django dev-django-generate-migrations dev-django-migrate \
        dev-start-django-dbshell dev-start-django-shell dev-test-django \
        dev-django-collectstatic dev-django-createsuperuser \
        dev-start-web generate-secret-key generate-secret-key-silent
