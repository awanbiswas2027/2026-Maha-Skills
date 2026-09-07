from app.services.placement_service import PlacementValidationService

def test_placement_row_valid():
    row = {
        "candidate_id": "STUDENT_2025_001",
        "course_code": "CTS-ELE-01",
        "batch_year": "2025",
        "placed": "Y",
        "monthly_salary": "24000.00",
        "employer_name": "Tata Motors Ltd",
    }
    valid, errors, clean = PlacementValidationService.validate_and_anonymize_row(row, 1)
    assert valid is True
    assert len(errors) == 0
    assert clean["is_placed"] is True
    assert clean["monthly_salary"] == 24000.00
    # Candidate ID must be pseudonymized into a 64-char hex string
    assert len(clean["candidate_hash"]) == 64
    assert clean["candidate_hash"] != "STUDENT_2025_001"

def test_placement_salary_out_of_bounds():
    row = {
        "candidate_id": "STUDENT_2025_002",
        "course_code": "CTS-ELE-01",
        "batch_year": "2025",
        "placed": "Y",
        "monthly_salary": "5000.00", # Below 8000 min wage
        "employer_name": "Local Garage",
    }
    valid, errors, clean = PlacementValidationService.validate_and_anonymize_row(row, 2)
    assert valid is False
    assert any(e["error_code"] == "ERR_SALARY_OUT_OF_BOUNDS" for e in errors)
