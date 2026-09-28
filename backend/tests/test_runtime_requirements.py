"""Tests ensuring all runtime dependencies imported by app/ are declared in requirements.txt.

Prevents production container failures where dev-only packages are imported at runtime.
Specifically guarantees passlib[argon2] and argon2-cffi are present in requirements.txt.
"""

from __future__ import annotations

import ast
import os
import re
import sys
from pathlib import Path

# Mapping of Python top-level import module names to distribution package names in requirements.txt
KNOWN_MODULE_TO_PACKAGE: dict[str, str] = {
    "jose": "python-jose",
    "argon2": "argon2-cffi",
    "pydantic_settings": "pydantic-settings",
    "sklearn": "scikit-learn",
    "multipart": "python-multipart",
    "email_validator": "email-validator",
    "psycopg2": "psycopg2-binary",
}


def _get_backend_root() -> Path:
    """Return the absolute path to the backend directory."""
    return Path(__file__).resolve().parent.parent


def parse_requirements_packages(requirements_path: Path) -> set[str]:
    """Parse normalized package names from requirements.txt."""
    if not requirements_path.is_file():
        raise FileNotFoundError(f"requirements.txt not found at {requirements_path}")

    packages: set[str] = set()
    for raw_line in requirements_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        match = re.match(r"^([A-Za-z0-9_.\-]+)", line)
        if match:
            packages.add(match.group(1).lower().replace("_", "-"))
    return packages


def get_app_third_party_imports(app_dir: Path) -> set[str]:
    """Inspect all Python files under app_dir using AST and return top-level third-party imports."""
    if not app_dir.is_dir():
        raise FileNotFoundError(f"App directory not found at {app_dir}")

    imported_modules: set[str] = set()
    for root, _, files in os.walk(app_dir):
        for file in files:
            if file.endswith(".py"):
                file_path = Path(root) / file
                content = file_path.read_text(encoding="utf-8")
                tree = ast.parse(content, filename=str(file_path))
                for node in ast.walk(tree):
                    if isinstance(node, ast.Import):
                        for alias in node.names:
                            imported_modules.add(alias.name.split(".")[0])
                    elif isinstance(node, ast.ImportFrom) and node.level == 0 and node.module:
                        imported_modules.add(node.module.split(".")[0])

    stdlib = sys.stdlib_module_names
    return {mod for mod in imported_modules if mod not in stdlib and mod != "app"}


def resolve_module_to_package(module_name: str) -> str:
    """Resolve a Python top-level import name to its distribution package name."""
    if module_name in KNOWN_MODULE_TO_PACKAGE:
        return KNOWN_MODULE_TO_PACKAGE[module_name]
    return module_name.lower().replace("_", "-")


def check_runtime_requirements(
    app_dir: Path, requirements_path: Path
) -> tuple[set[str], set[tuple[str, str]]]:
    """Validate app imports against requirements.txt.

    Returns:
        tuple of (all_third_party_imports, missing_module_package_pairs).
    """
    declared_packages = parse_requirements_packages(requirements_path)
    app_imports = get_app_third_party_imports(app_dir)

    missing: set[tuple[str, str]] = set()
    for module_name in app_imports:
        pkg_name = resolve_module_to_package(module_name)
        if pkg_name not in declared_packages:
            missing.add((module_name, pkg_name))

    return app_imports, missing


def test_all_app_imports_covered_in_requirements() -> None:
    """Verify that every third-party top-level module imported in app/ is declared in requirements.txt."""
    backend_root = _get_backend_root()
    app_dir = backend_root / "app"
    requirements_path = backend_root / "requirements.txt"

    app_imports, missing = check_runtime_requirements(app_dir, requirements_path)

    assert len(app_imports) > 0, "Expected to find third-party imports in app/"
    assert not missing, (
        f"Third-party imports under app/ are missing from requirements.txt: "
        f"{sorted(missing)}. Production container build will fail."
    )


def test_passlib_and_argon2_explicitly_covered() -> None:
    """Verify passlib[argon2] and argon2-cffi are both present in requirements.txt."""
    backend_root = _get_backend_root()
    requirements_path = backend_root / "requirements.txt"
    declared_packages = parse_requirements_packages(requirements_path)

    assert "passlib" in declared_packages, (
        "passlib must be listed as a runtime dependency in requirements.txt"
    )
    assert "argon2-cffi" in declared_packages, (
        "argon2-cffi must be listed as a runtime dependency in requirements.txt"
    )

    raw_lines = [
        line.strip()
        for line in requirements_path.read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.strip().startswith("#")
    ]
    has_passlib_argon2 = any(
        line.startswith("passlib[argon2]") or (line.startswith("passlib") and "argon2" in line)
        for line in raw_lines
    )
    assert has_passlib_argon2, (
        "passlib must be declared with the [argon2] extra in requirements.txt"
    )


def test_runtime_requirements_fails_on_missing_dependency() -> None:
    """Verify that the verification logic correctly fails if a dependency is omitted."""
    fake_declared = {"fastapi", "pydantic"}
    fake_imports = {"fastapi", "passlib", "sqlalchemy"}

    missing = {
        (mod, resolve_module_to_package(mod))
        for mod in fake_imports
        if resolve_module_to_package(mod) not in fake_declared
    }

    assert ("passlib", "passlib") in missing
    assert ("sqlalchemy", "sqlalchemy") in missing
    assert ("fastapi", "fastapi") not in missing
