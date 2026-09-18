class GapScoringService:
    @staticmethod
    def calculate_normalized_gap(
        demand_count: int,
        trend_factor: float,
        trained_capacity: int,
        placement_rate: float,
        scaling_constant: float = 1000.0,
    ) -> float:
        """
        Calculates the standardized skill gap score (0.0 to 100.0):
        Gap Score = min(100, max(0, ((Demand * Trend) - (Trained * PlacementRate)) / Constant * 100))
        """
        effective_demand = demand_count * trend_factor
        effective_supply = trained_capacity * (
            placement_rate / 100.0 if placement_rate > 1 else placement_rate
        )
        raw_gap = effective_demand - effective_supply

        normalized = (raw_gap / scaling_constant) * 100.0
        return round(min(100.0, max(0.0, normalized)), 2)

    @staticmethod
    def is_structurally_oversupplied(
        placement_rate: float,
        local_demand_percentile: int,
        consecutive_quarters: int = 2,
    ) -> bool:
        """
        Oversupply heuristic:
        Placement rate < 25% AND local demand < 20th percentile for >= 2 consecutive quarters.
        """
        return placement_rate < 25.0 and local_demand_percentile < 20 and consecutive_quarters >= 2
