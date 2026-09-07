from typing import List, Tuple
from ..core.security import pseudonymize_candidate_id

class PlacementValidationService:
    MIN_SALARY = 8000.00
    MAX_SALARY = 200000.00

    @classmethod
    def validate_and_anonymize_row(cls, row: dict, row_num: int) -> Tuple[bool, List[dict], dict]:
        errors = []
        candidate_id = row.get("candidate_id", "").strip()
        if not candidate_id:
            errors.append({
                "row_number": row_num,
                "column_name": "candidate_id",
                "error_code": "ERR_INVALID_CANDIDATE_ID",
                "error_message": "Candidate identifier is missing or empty."
            })

        placed = row.get("placed", "").strip().upper()
        if placed not in ("Y", "N"):
            errors.append({
                "row_number": row_num,
                "column_name": "placed",
                "error_code": "ERR_INVALID_BOOLEAN_FLAG",
                "error_message": "Placed flag must be either 'Y' or 'N'."
            })

        salary = None
        if placed == "Y":
            try:
                salary = float(row.get("monthly_salary", 0))
                if not (cls.MIN_SALARY <= salary <= cls.MAX_SALARY):
                    errors.append({
                        "row_number": row_num,
                        "column_name": "monthly_salary",
                        "error_code": "ERR_SALARY_OUT_OF_BOUNDS",
                        "error_message": f"Monthly salary must be between ₹{cls.MIN_SALARY:,.0f} and ₹{cls.MAX_SALARY:,.0f}."
                    })
            except (ValueError, TypeError):
                errors.append({
                    "row_number": row_num,
                    "column_name": "monthly_salary",
                    "error_code": "ERR_INVALID_SALARY_FORMAT",
                    "error_message": "Monthly salary must be a valid numeric decimal."
                })

        if errors:
            return False, errors, {}

        # Cryptographically pseudonymize candidate ID (DPDP Act 2023)
        anonymized_hash = pseudonymize_candidate_id(candidate_id)
        clean_record = {
            "candidate_hash": anonymized_hash,
            "course_code": row.get("course_code"),
            "batch_year": int(row.get("batch_year", 2025)),
            "is_placed": (placed == "Y"),
            "monthly_salary": salary,
            "employer_name": row.get("employer_name") if placed == "Y" else None,
        }
        return True, [], clean_record
