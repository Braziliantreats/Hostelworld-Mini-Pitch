.PHONY: help setup install dev test lint format type-check build clean docs

help:
	@echo "Hostelworld Mini Pitch - Python Build Commands"
	@echo ""
	@echo "Usage: make [command]"
	@echo ""
	@echo "Commands:"
	@echo "  setup         - Create virtual environment"
	@echo "  install       - Install all dependencies"
	@echo "  dev           - Install dev dependencies"
	@echo "  test          - Run tests with coverage"
	@echo "  lint          - Run linting checks (flake8, pylint)"
	@echo "  format        - Format code with black and isort"
	@echo "  type-check    - Run mypy type checking"
	@echo "  build         - Build distribution packages"
	@echo "  clean         - Clean build artifacts"
	@echo "  docs          - Build documentation"
	@echo "  all           - Run all checks (lint, type-check, test)"

setup:
	python3 -m venv venv
	@echo "Virtual environment created. Activate with: source venv/bin/activate"

install:
	. venv/bin/activate && pip install -r requirements.txt

dev:
	. venv/bin/activate && pip install -e ".[dev,test,docs]"

test:
	. venv/bin/activate && pytest --cov=src tests/ -v

lint:
	. venv/bin/activate && flake8 src/ tests/ && pylint src/ tests/

format:
	. venv/bin/activate && black src/ tests/ && isort src/ tests/

type-check:
	. venv/bin/activate && mypy src/

build:
	. venv/bin/activate && python -m build

clean:
	rm -rf build/ dist/ *.egg-info .pytest_cache/ .mypy_cache/ .coverage htmlcov/
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete

docs:
	. venv/bin/activate && cd docs && make html

all: lint type-check test
	@echo "All checks passed!"
