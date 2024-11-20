
# Crucible prototype repo


## Quickstart Guide

This guide will help you set up and run the project on your local machine.

### Prerequisites

- Python 3.10+
- Make

#### Adding prerequisites on macOS
1. Install dependencies with Homebrew
   ```
   brew install make pyenv
   ```

2. Use pyenv to use install and use a specific version of python (3.10.x), and update your local shell to alias "python" appropriately
   ```
   pyenv install 3.10
   pyenv global 3.10
   eval "$(pyenv init -)"
   ```

3. Update your shell config
    a. For zsh:
    ```
    echo -e 'if command -v pyenv 1>/dev/null 2>&1; then\n  eval "$(pyenv init -)"\nfi' >> ~/.zshrc
    ```

    b. For bash:
    ```
    echo -e 'if command -v pyenv 1>/dev/null 2>&1; then\n  eval "$(pyenv init -)"\nfi' >> ~/.bash_profile
    ```

4. Validate your shell config changes
   The last few lines should now be:
   ```sh
     if command -v pyenv 1>/dev/null 2>&1; then
       eval "$(pyenv init -)"
     fi
   ```

### First-Time Setup
0. Before we begin, make sure system dependencies are installed:

   Run: 
   ```
   $ make --version
   ```
   You should see "GNU Make ..."

   Run:
   ```
   $ python --version
   ```
   You should see "Python 3.10.___", e.g. Python 3.10.14

1. Clone the repository:
   ```
   git clone <repository-url>
   cd <project-directory>
   ```

2. Run the first-time setup command:
   ```
   make first-time-setup
   ```
   This command will:
   - Install system dependencies
   - Set up a local PostgreSQL database
   - Create a virtual environment (venv)

3. Activate the virtual environment:
   ```
   source venv/bin/activate
   ```
   Sadly this can't be done within a makefile.

4. Install pip requirements
  ```
  make venv-pip-install
  ```
  This command will:
   - Install pip requirements into the virtual environment (venv)

5. Setup your local environment variables:
  ```
  make setup-env-local-dotfile
  ```
  This command will:
   - Create a .env.local file
   - Populate the .env.local file with effective defaults, including a generated secret key to use in local dev. 

6.  Run the django setup command:
  ```
  make setup-django
  ```
  This command will:
   - Create migrations (if needed)
   - Run migrations

7. You're ready to start your environment!
   ```
   make dev-start-web
   ```
   Note: when using this command, you may need to provide your password for `sudo` usage. 

### Daily Development Workflow

1. Start the PostgreSQL database:
   ```
   make dev-start-db
   ```

2. Activate the virtual environment (if not already activated):
   ```
   source venv/bin/activate
   ```

3. Start the Django development server:
   ```
   make dev-start-django
   ```

4. Visit `http://localhost:8000` in your web browser to see the application running.

### Useful Commands

- Check database status:
  ```
  make dev-db-status
  ```

- Stop the database:
  ```
  make dev-stop-db
  ```

- Generate new migrations:
  ```
  make dev-django-generate-migrations
  ```

- Apply migrations:
  ```
  make dev-django-migrate
  ```

- Run tests:
  ```
  make dev-test-django
  ```

- Collect static files:
  ```
  make dev-django-collectstatic
  ```

- Create a superuser:
  ```
  make dev-django-createsuperuser
  ```

- Start both database and Django server:
  ```
  make dev-start-web
  ```

- Check for outdated packages:
  ```
  make venv-pip-get-outdated
  ```

### Virtual Environment Management

- Create a new virtual environment:
  ```
  make venv
  ```

- Install Python dependencies:
  ```
  make venv-pip-install
  ```

- Remove the virtual environment (use with caution):
  ```
  make venv-remove-destructive
  ```

### Troubleshooting

If you encounter any issues during setup or development:

1. Ensure you're in the project's root directory.
2. Make sure your virtual environment is activated.
3. Check that PostgreSQL is running and properly configured.
4. Review any error messages and consult the project documentation or seek assistance if needed.

For more detailed information about each command, refer to the comments in the Makefile.

## Makefile Maintenance and Upgrade Guide

### When to Update the Makefile

1. New Dependencies: When adding new project dependencies.
2. Workflow Changes: When development or deployment workflows change.
3. Tool Updates: When updating versions of tools or languages used in the project.
4. New Features: When adding new features that require specific setup or commands.

### How to Modify the Makefile

1. Adding a New Command
   Example: Adding a command to run a new linter

   ```makefile
   dev-run-linter:
       @make assert-venv
       @echo "Running linter..."
       @flake8 $(DJANGO_DIR)

   .PHONY: dev-run-linter
   ```

2. Updating an Existing Command
   Example: Updating the database URL in the create-env-file command

   ```makefile
   create-env-file:
       @echo "CRUCIBLE_DB_URL=postgres://user:pass@newhost:5432/dbname" > .env.local
       # ... rest of the command
   ```

3. Removing an Obsolete Command
   - Delete the command definition
   - Remove it from the .PHONY list

4. Modifying System Dependencies
   Example: Adding a new system dependency

   ```makefile
   setup-system-deps:
       @echo "Installing system dependencies..."
       @if [ "$(shell uname)" = "Linux" ]; then \
           sudo apt-get update && sudo apt-get install -y libcairo2-dev pkg-config postgresql libpq-dev python3.10-venv libgirepository1.0-dev new-dependency-package; \
       # ... rest of the command
   ```

5. Updating for New Project Structure
   Example: Changing the Django directory

   ```makefile
   DJANGO_DIR := new/path/to/django/project
   ```

### Best Practices for Makefile Updates

1. Document Changes: Add comments explaining significant changes.
2. Test Thoroughly: Test all modified commands on a fresh system.
3. Update README: Reflect any new or changed commands in the project documentation.
4. Version Control: Commit Makefile changes with clear, descriptive messages.
5. Communicate: Inform the team about significant Makefile updates.

Remember to keep the Makefile DRY (Don't Repeat Yourself) and use variables for values that might change across different parts of the Makefile.
