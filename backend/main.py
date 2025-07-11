from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import numpy as np
from typing import Dict, List, Optional
from datetime import datetime
import json

app = FastAPI(
    title="Wayne Enterprises Business Intelligence API",
    description="API for Wayne Enterprises dashboard data and analytics",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load datasets
def load_data():
    try:
        financial_data = pd.read_csv("../wayne_financial_data.csv")
        hr_data = pd.read_csv("../wayne_hr_analytics.csv")
        security_data = pd.read_csv("../wayne_security_data.csv")
        rd_data = pd.read_csv("../wayne_rd_portfolio.csv")
        supply_chain_data = pd.read_csv("../wayne_supply_chain.csv")
        return financial_data, hr_data, security_data, rd_data, supply_chain_data
    except Exception as e:
        print(f"Error loading data: {e}")
        return None, None, None, None, None

financial_data, hr_data, security_data, rd_data, supply_chain_data = load_data()

# Check if data was loaded successfully
if any(data is None for data in [financial_data, hr_data, security_data, rd_data, supply_chain_data]):
    print("Warning: Some data files could not be loaded. API may not function properly.")

@app.get("/")
async def root():
    return {"message": "Wayne Enterprises Business Intelligence API"}

@app.get("/api/dashboard/overview")
async def get_dashboard_overview():
    """Get executive summary metrics for the dashboard"""
    try:
        # Check if data is available
        if financial_data is None or hr_data is None or security_data is None or rd_data is None:
            raise HTTPException(status_code=500, detail="Data not available")
        
        # Financial metrics
        latest_financial = financial_data[financial_data['Year'] == 2024].iloc[-1]
        total_revenue = financial_data[financial_data['Year'] == 2024]['Revenue_M'].sum()
        total_profit = financial_data[financial_data['Year'] == 2024]['Net_Profit_M'].sum()
        
        # HR metrics
        latest_hr = hr_data[hr_data['Date'].str.startswith('2024')].iloc[-1]
        avg_retention = hr_data[hr_data['Date'].str.startswith('2024')]['Retention_Rate_Pct'].mean()
        avg_satisfaction = hr_data[hr_data['Date'].str.startswith('2024')]['Employee_Satisfaction_Score'].mean()
        
        # Calculate total employees from latest data
        latest_date = hr_data['Date'].max()
        latest_hr_data = hr_data[hr_data['Date'] == latest_date]
        total_employees = len(latest_hr_data)
        
        # Security metrics
        latest_security = security_data[security_data['Date'].str.startswith('2024')].iloc[-1]
        avg_safety_score = security_data[security_data['Date'].str.startswith('2024')]['Public_Safety_Score'].mean()
        
        # R&D metrics
        active_projects = len(rd_data[rd_data['Status'] == 'Active'])
        total_rd_budget = rd_data[rd_data['Status'] == 'Active']['Budget_Allocated_M'].sum()
        
        return {
            "financial": {
                "total_revenue_m": round(total_revenue, 2),
                "total_profit_m": round(total_profit, 2),
                "profit_margin_pct": round((total_profit / total_revenue) * 100, 2),
                "latest_revenue_m": round(latest_financial['Revenue_M'], 2)
            },
            "hr": {
                "avg_retention_pct": round(avg_retention, 2),
                "avg_satisfaction_score": round(avg_satisfaction, 2),
                "total_employees": total_employees
            },
            "security": {
                "avg_safety_score": round(avg_safety_score, 2),
                "total_incidents": int(security_data[security_data['Date'].str.startswith('2024')]['Security_Incidents'].sum())
            },
            "rd": {
                "active_projects": active_projects,
                "total_budget_m": round(total_rd_budget, 2),
                "completion_rate_pct": round((len(rd_data[rd_data['Status'] == 'Completed']) / len(rd_data)) * 100, 2)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing overview data: {str(e)}")

@app.get("/api/financial/trends")
async def get_financial_trends():
    """Get financial performance trends by division"""
    try:
        # Group by division and quarter
        financial_trends = financial_data.groupby(['Division', 'Quarter', 'Year']).agg({
            'Revenue_M': 'sum',
            'Net_Profit_M': 'sum',
            'RD_Investment_M': 'sum',
            'Market_Share_Pct': 'mean'
        }).reset_index()
        
        # Convert to format suitable for charts
        divisions = financial_data['Division'].unique()
        quarters = financial_data['Quarter'].unique()
        years = financial_data['Year'].unique()
        
        revenue_data = []
        profit_data = []
        
        for division in divisions:
            div_data = financial_trends[financial_trends['Division'] == division]
            revenue_series = {
                "name": division,
                "data": []
            }
            profit_series = {
                "name": division,
                "data": []
            }
            
            for year in years:
                for quarter in quarters:
                    period_data = div_data[(div_data['Year'] == year) & (div_data['Quarter'] == quarter)]
                    if not period_data.empty:
                        revenue_series["data"].append({
                            "period": f"{year} {quarter}",
                            "value": round(period_data['Revenue_M'].iloc[0], 2)
                        })
                        profit_series["data"].append({
                            "period": f"{year} {quarter}",
                            "value": round(period_data['Net_Profit_M'].iloc[0], 2)
                        })
            
            revenue_data.append(revenue_series)
            profit_data.append(profit_series)
        
        return {
            "revenue_trends": revenue_data,
            "profit_trends": profit_data,
            "divisions": divisions.tolist(),
            "periods": [f"{year} {quarter}" for year in years for quarter in quarters]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing financial trends: {str(e)}")

@app.get("/api/hr/performance")
async def get_hr_performance():
    """Get HR performance metrics by department and level"""
    try:
        # Get latest data for each department and level
        latest_date = hr_data['Date'].max()
        latest_hr = hr_data[hr_data['Date'] == latest_date]
        
        # Performance by department
        dept_performance = latest_hr.groupby('Department').agg({
            'Retention_Rate_Pct': 'mean',
            'Employee_Satisfaction_Score': 'mean',
            'Training_Hours_Annual': 'mean',
            'Performance_Rating': 'mean'
        }).reset_index()
        
        # Performance by level
        level_performance = latest_hr.groupby('Employee_Level').agg({
            'Retention_Rate_Pct': 'mean',
            'Employee_Satisfaction_Score': 'mean',
            'Training_Hours_Annual': 'mean',
            'Performance_Rating': 'mean'
        }).reset_index()
        
        # Employee distribution
        employee_distribution = latest_hr.groupby(['Department', 'Employee_Level']).size().reset_index(name='count')
        
        return {
            "department_performance": dept_performance.to_dict('records'),
            "level_performance": level_performance.to_dict('records'),
            "employee_distribution": employee_distribution.to_dict('records'),
            "latest_date": latest_date
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing HR data: {str(e)}")

@app.get("/api/security/districts")
async def get_security_districts():
    """Get security performance by district"""
    try:
        # Get latest data for each district
        latest_date = security_data['Date'].max()
        latest_security = security_data[security_data['Date'] == latest_date]
        
        # District performance
        district_performance = latest_security.groupby('District').agg({
            'Security_Incidents': 'sum',
            'Response_Time_Minutes': 'mean',
            'Public_Safety_Score': 'mean',
            'Crime_Prevention_Effectiveness_Pct': 'mean',
            'Employee_Safety_Index': 'mean'
        }).reset_index()
        
        # Historical trends by district
        district_trends = security_data.groupby(['District', 'Date']).agg({
            'Security_Incidents': 'sum',
            'Public_Safety_Score': 'mean'
        }).reset_index()
        
        # Convert to chart format
        districts = security_data['District'].unique()
        dates = sorted(security_data['Date'].unique())
        
        incidents_data = []
        safety_data = []
        
        for district in districts:
            dist_data = district_trends[district_trends['District'] == district]
            incidents_series = {
                "name": district,
                "data": []
            }
            safety_series = {
                "name": district,
                "data": []
            }
            
            for date in dates:
                period_data = dist_data[dist_data['Date'] == date]
                if not period_data.empty:
                    incidents_series["data"].append({
                        "date": date,
                        "value": int(period_data['Security_Incidents'].iloc[0])
                    })
                    safety_series["data"].append({
                        "date": date,
                        "value": round(period_data['Public_Safety_Score'].iloc[0], 2)
                    })
            
            incidents_data.append(incidents_series)
            safety_data.append(safety_series)
        
        return {
            "district_performance": district_performance.to_dict('records'),
            "incidents_trends": incidents_data,
            "safety_trends": safety_data,
            "districts": districts.tolist(),
            "latest_date": latest_date
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing security data: {str(e)}")

@app.get("/api/rd/portfolio")
async def get_rd_portfolio():
    """Get R&D portfolio analysis"""
    try:
        # Portfolio summary by division
        portfolio_summary = rd_data.groupby('Division').agg({
            'Project_ID': 'count',
            'Budget_Allocated_M': 'sum',
            'Budget_Spent_M': 'sum',
            'Commercialization_Potential': lambda x: (x == 'Very High').sum()
        }).reset_index()
        portfolio_summary.columns = ['Division', 'Project_Count', 'Budget_Allocated_M', 'Budget_Spent_M', 'High_Potential_Projects']
        
        # Status distribution
        status_distribution = rd_data.groupby('Status').size().reset_index(name='count')
        
        # Commercialization potential
        potential_distribution = rd_data.groupby('Commercialization_Potential').size().reset_index(name='count')
        
        # Timeline adherence
        timeline_data = rd_data.groupby('Division').agg({
            'Timeline_Adherence_Pct': 'mean'
        }).reset_index()
        
        # Security classification
        security_distribution = rd_data.groupby('Security_Classification').size().reset_index(name='count')
        
        return {
            "portfolio_summary": portfolio_summary.to_dict('records'),
            "status_distribution": status_distribution.to_dict('records'),
            "potential_distribution": potential_distribution.to_dict('records'),
            "timeline_data": timeline_data.to_dict('records'),
            "security_distribution": security_distribution.to_dict('records'),
            "total_projects": len(rd_data),
            "active_projects": len(rd_data[rd_data['Status'] == 'Active'])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing R&D data: {str(e)}")

@app.get("/api/supply-chain/facilities")
async def get_supply_chain_facilities():
    """Get supply chain performance by facility"""
    try:
        # Check if data is available
        if supply_chain_data is None:
            raise HTTPException(status_code=500, detail="Supply chain data not available")
        
        # Get latest data for each facility
        latest_date = supply_chain_data['Date'].max()
        latest_supply = supply_chain_data[supply_chain_data['Date'] == latest_date]
        
        # Calculate additional metrics for each facility
        facility_performance = []
        for facility in latest_supply['Facility_Location'].unique():
            facility_data = latest_supply[latest_supply['Facility_Location'] == facility]
            
            # Calculate operational efficiency based on quality score and disruptions
            avg_quality = facility_data['Quality_Score_Pct'].mean()
            total_disruptions = facility_data['Supply_Chain_Disruptions'].sum()
            operational_efficiency = max(0, avg_quality - (total_disruptions * 2))  # Reduce efficiency based on disruptions
            
            # Calculate production capacity (monthly volume)
            production_capacity = facility_data['Monthly_Production_Volume'].sum()
            
            # Calculate capacity utilization (assuming 100% is the target)
            capacity_utilization = min(100, (production_capacity / 200000) * 100)  # Normalize to 200k units as 100%
            
            # Calculate lead time
            lead_time = facility_data['Lead_Time_Days'].mean()
            
            # Calculate quality score
            quality_score = facility_data['Quality_Score_Pct'].mean()
            
            facility_performance.append({
                'Facility_Name': facility,
                'Facility_Type': facility_data['Product_Line'].iloc[0],
                'Operational_Efficiency_Pct': round(operational_efficiency, 1),
                'Production_Capacity_Units': int(production_capacity),
                'Capacity_Utilization_Pct': round(capacity_utilization, 1),
                'Lead_Time_Days': round(lead_time, 1),
                'Quality_Score': round(quality_score, 1),
                'Cost_Per_Unit': round(facility_data['Cost_Per_Unit'].mean(), 2),
                'Supply_Chain_Disruptions': int(total_disruptions),
                'Sustainability_Rating': facility_data['Sustainability_Rating'].iloc[0],
                'Vendor_Count': int(facility_data['Vendor_Count'].mean()),
                'Inventory_Turnover': round(facility_data['Inventory_Turnover'].mean(), 1),
                'Carbon_Footprint_MT': round(facility_data['Carbon_Footprint_MT'].mean(), 1)
            })
        
        # Production trends by facility
        production_trends = supply_chain_data.groupby(['Facility_Location', 'Date']).agg({
            'Monthly_Production_Volume': 'sum',
            'Quality_Score_Pct': 'mean'
        }).reset_index()
        
        # Convert to chart format
        facilities = supply_chain_data['Facility_Location'].unique()
        dates = sorted(supply_chain_data['Date'].unique())
        
        production_data = []
        quality_data = []
        
        for facility in facilities:
            fac_data = production_trends[production_trends['Facility_Location'] == facility]
            production_series = {
                "name": facility,
                "data": []
            }
            quality_series = {
                "name": facility,
                "data": []
            }
            
            for date in dates:
                period_data = fac_data[fac_data['Date'] == date]
                if not period_data.empty:
                    production_series["data"].append({
                        "date": date,
                        "value": int(period_data['Monthly_Production_Volume'].iloc[0])
                    })
                    quality_series["data"].append({
                        "date": date,
                        "value": round(period_data['Quality_Score_Pct'].iloc[0], 2)
                    })
            
            production_data.append(production_series)
            quality_data.append(quality_series)
        
        return {
            "facility_performance": facility_performance,
            "production_trends": production_data,
            "quality_trends": quality_data,
            "facilities": facilities.tolist(),
            "latest_date": latest_date
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing supply chain data: {str(e)}")

@app.get("/api/news/narrative")
async def get_news_narrative():
    """Get compelling business narrative for newspaper style section"""
    try:
        # Calculate key insights for narrative
        latest_financial = financial_data[financial_data['Year'] == 2024].iloc[-1]
        latest_security = security_data[security_data['Date'].str.startswith('2024')].iloc[-1]
        
        # Find top performing division
        top_division = financial_data[financial_data['Year'] == 2024].groupby('Division')['Revenue_M'].sum().idxmax()
        
        # Find most improved district
        district_improvement = security_data.groupby('District').agg({
            'Public_Safety_Score': lambda x: x.iloc[-1] - x.iloc[0]
        }).reset_index()
        most_improved_district = district_improvement.loc[district_improvement['Public_Safety_Score'].idxmax(), 'District']
        
        # R&D breakthrough
        high_potential_projects = rd_data[rd_data['Commercialization_Potential'] == 'Very High']
        breakthrough_project = high_potential_projects.iloc[0] if len(high_potential_projects) > 0 else rd_data.iloc[0]
        
        narrative = {
            "headline": f"Wayne Enterprises Reports Record Growth: {top_division} Leads the Charge",
            "subheadline": "Security Operations Show Dramatic Improvement Across Gotham",
            "key_points": [
                f"{top_division} division achieved {round(latest_financial['Revenue_M'], 1)}M in latest quarter",
                f"Public safety scores improved by {round(district_improvement['Public_Safety_Score'].max(), 2)} points in {most_improved_district}",
                f"R&D breakthrough: {breakthrough_project['Project_Name']} shows {breakthrough_project['Commercialization_Potential']} potential",
                f"Employee satisfaction reaches {round(hr_data[hr_data['Date'].str.startswith('2024')]['Employee_Satisfaction_Score'].mean(), 1)}/10"
            ],
            "metrics": {
                "revenue_growth": round(((latest_financial['Revenue_M'] - financial_data[financial_data['Year'] == 2023]['Revenue_M'].iloc[-1]) / financial_data[financial_data['Year'] == 2023]['Revenue_M'].iloc[-1]) * 100, 2),
                "safety_improvement": round(district_improvement['Public_Safety_Score'].max(), 2),
                "active_projects": len(rd_data[rd_data['Status'] == 'Active']),
                "employee_count": int(latest_financial['Employee_Count'])
            }
        }
        
        return narrative
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating narrative: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 