from app.services.gap_scoring_service import GapScoringService

def test_calculate_normalized_gap_score():
    score = GapScoringService.calculate_normalized_gap(
        demand_count=1200,
        trend_factor=1.2,
        trained_capacity=500,
        placement_rate=40.0,
        scaling_constant=1000.0,
    )
    # effective_demand = 1440, effective_supply = 200, raw_gap = 1240 => normalized = 124.0 -> capped at 100.0
    assert score == 100.0

def test_calculate_moderate_gap_score():
    score = GapScoringService.calculate_normalized_gap(
        demand_count=500,
        trend_factor=1.0,
        trained_capacity=400,
        placement_rate=50.0,
        scaling_constant=1000.0,
    )
    # effective_demand = 500, effective_supply = 200, raw_gap = 300 => normalized = 30.0
    assert score == 30.0

def test_oversupply_detection():
    is_oversupplied = GapScoringService.is_structurally_oversupplied(
        placement_rate=18.0,
        local_demand_percentile=15,
        consecutive_quarters=2,
    )
    assert is_oversupplied is True

    not_oversupplied = GapScoringService.is_structurally_oversupplied(
        placement_rate=45.0,
        local_demand_percentile=15,
        consecutive_quarters=2,
    )
    assert not_oversupplied is False
