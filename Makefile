ifeq ($(shell test -e 'backend/.env' && echo -n yes),yes)
	include .env
endif


DIRS := backend
FILES := .env
VM_USER := georgepustovoi
VM_IP := 158.160.139.50
VM_PATH := neuro-cafe

VENV := env
PYTHON_FILE := backend

# parse additional args for commands

args := $(wordlist 2, 100, $(MAKECMDGOALS))
ifndef args
MESSAGE = "No such command (or you pass two or many targets to ). List of possible commands: make help"
else
MESSAGE = "Done"
endif

# docker exec -it <сюда>  psql -d project -U student

backend_dir = backend

HELP_FUN = \
	%help; while(<>){push@{$$help{$$2//'options'}},[$$1,$$3] \
	if/^([\w-_]+)\s*:.*\#\#(?:@(\w+))?\s(.*)$$/}; \
    print"$$_:\n", map"  $$_->[0]".(" "x(20-length($$_->[0])))."$$_->[1]\n",\
    @{$$help{$$_}},"\n" for keys %help; \


# Commands
env:  ##@Environment Create .env file with variables
	@$(eval SHELL:=/bin/bash)
	@cp example.env .env

help: ##@Help Show this help
	@echo -e "Usage: make [target] ...\n"
	@perl -e '$(HELP_FUN)' $(MAKEFILE_LIST)

run_script:
	python3 -m backend.scripts.$(args)

run: clear_port
	python3 -m backend

clear_port:
	@if sudo lsof -t -i tcp:$(APP_PORT); then \
		echo "Clearing port $(APP_PORT)..."; \
		sudo lsof -t -i tcp:$(APP_PORT) | xargs kill -9; \
	else \
		echo "Port $(APP_PORT) is already free"; \
	fi

format:
	poetry run ruff check --fix

db:
	docker-compose -f docker-compose.yml up --build --remove-orphans

revision:
	alembic revision --autogenerate

migrate:
	alembic upgrade $(args)

open_db:
	docker exec -it db psql -d $(DATABASE_NAME) -U $(DATABASE_USERNAME) -p $(DATABASE_PORT)

test:
	poetry run python -m pytest backend/tests --verbosity=2 -s

test-cov:
	poetry run python -m pytest backend/tests --cov-report term --cov-report xml:coverage.xml --cov=.

copy-dirs:
	@for dir in $(DIRS); do \
		scp -r $$dir $(VM_USER)@$(VM_IP):$(VM_PATH); \
	done

copy-files:
	@for file in $(FILES); do \
		scp $$file $(VM_USER)@$(VM_IP):$(VM_PATH)/; \
	done

copy: copy-dirs copy-files
	@echo "Копирование завершено."

start:
	@echo "Создание виртуального окружения..."
	python3 -m venv $(VENV)
	@echo "Активация виртуального окружения и запуск $(PYTHON_FILE)..."
	. $(VENV)/bin/activate && python3 -m $(PYTHON_FILE)
	@echo "Готово."

clear:
	find . -type d -name "__pycache__" -exec rm -rf {} +

%::
	echo $(MESSAGE)

