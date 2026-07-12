from odoo import api, models


class TransitReports(models.AbstractModel):
    _name = "transit.reports"
    _description = "Transit Reports"

    # Function 1 : Report Model
    @api.model
    def get_report_summary(self):
        """Return report summary data."""
        return {
            "active_trips": 0,
            "completed_trips": 0,
            "vehicles": 0,
            "drivers": 0,
        }
    
    # Function 2 : Fuel Efficiency
    @api.model
    def calculate_fuel_efficiency(self):
        """
        Fuel Efficiency = Distance / Fuel
        """

        return {
            "distance": 0,
            "fuel": 0,
            "efficiency": 0.0,
        }
    
    # Function 3 : Fleet Utilization
    @api.model
    def calculate_fleet_utilization(self):
        """
        Fleet Utilization Percentage
        """

        return {
            "available": 0,
            "on_trip": 0,
            "utilization": 0.0,
        }
    
    # Function 4 : Operational Cost
    @api.model
    def calculate_operational_cost(self):
        """
        Fuel + Maintenance
        """

        return {
            "fuel_cost": 0,
            "maintenance_cost": 0,
            "total_cost": 0,
        }
    
    # Function 5 : Vehicle ROI
    @api.model
    def calculate_vehicle_roi(self):
        """
        ROI =
        (Revenue - Fuel - Maintenance)
        / Acquisition Cost
        """

        return {
            "revenue": 0,
            "fuel": 0,
            "maintenance": 0,
            "roi": 0.0,
        }
    
    # Function 6 : Monthly Activity
    @api.model
    def get_monthly_activity(self):
        """
        Monthly Trip Activity
        """

        return [
            {"month": "Jan", "trips": 0},
            {"month": "Feb", "trips": 0},
            {"month": "Mar", "trips": 0},
            {"month": "Apr", "trips": 0},
        ]
    
    # Function 7 : Cost Comparison
    @api.model
    def get_cost_comparison(self):
        """
        Fuel vs Maintenance Cost
        """

        return {
            "fuel": [],
            "maintenance": [],
        }
    
    # Function 8 : Report Data
    # This will become the single entry point used by your dashboard/charts.

    @api.model
    def get_report_data(self):
        """
        Complete report data.
        """

        return {
            "summary": self.get_report_summary(),
            "fuel_efficiency": self.calculate_fuel_efficiency(),
            "fleet_utilization": self.calculate_fleet_utilization(),
            "operational_cost": self.calculate_operational_cost(),
            "vehicle_roi": self.calculate_vehicle_roi(),
            "monthly_activity": self.get_monthly_activity(),
            "cost_comparison": self.get_cost_comparison(),
        }