# Wayne Enterprises Business Intelligence Dashboard

A comprehensive business intelligence dashboard for Wayne Enterprises, featuring real-time analytics across multiple business domains including financial data, HR metrics, security operations, R&D portfolio, and supply chain management.

## 🚀 Features

### Executive Dashboard
- **Executive Summary**: Key performance indicators and business metrics
- **Financial Trends**: Revenue analysis, profit margins, and financial health indicators
- **Business Narrative**: AI-generated insights and recommendations

### HR Analytics
- **Employee Performance**: Performance ratings, satisfaction scores, and retention rates
- **Training Metrics**: Annual training hours and development programs
- **Department Analysis**: Employee distribution across departments and levels

### Security Operations
- **District Performance**: Security metrics by Gotham districts
- **Incident Tracking**: Crime rates, response times, and safety scores
- **Resource Allocation**: Security personnel and equipment distribution

### R&D Portfolio
- **Project Status**: Active, completed, and paused research projects
- **Investment Analysis**: Budget allocation and ROI tracking
- **Technology Categories**: Research focus areas and innovation metrics

### Supply Chain Management
- **Facility Performance**: Operational efficiency and capacity utilization
- **Lead Time Analysis**: Supply chain optimization metrics
- **Quality Control**: Quality scores and compliance tracking

## 🛠️ Technology Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **Pandas**: Data manipulation and analysis
- **NumPy**: Numerical computing
- **Uvicorn**: ASGI server

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: React charting library
- **Lucide React**: Modern icon library

## 📊 Data Sources

The dashboard processes real-time data from multiple CSV datasets:
- `wayne_financial_data.csv` - Financial performance metrics
- `wayne_hr_analytics.csv` - Human resources and employee data
- `wayne_security_data.csv` - Security operations and incident reports
- `wayne_rd_portfolio.csv` - Research and development projects
- `wayne_supply_chain.csv` - Supply chain and facility operations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd wayne-project
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   python main.py
   ```
   The API will be available at `http://localhost:8000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The dashboard will be available at `http://localhost:3000`

## 📁 Project Structure

```
wayne-project/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   └── data_processing.py      # Data analysis functions
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # Main dashboard
│   │   ├── hr/page.tsx        # HR analytics page
│   │   ├── security/page.tsx  # Security page
│   │   ├── rd/page.tsx        # R&D portfolio page
│   │   ├── supply-chain/page.tsx # Supply chain page
│   │   └── components/        # Reusable components
│   ├── package.json
│   └── tailwind.config.js
├── wayne_financial_data.csv
├── wayne_hr_analytics.csv
├── wayne_security_data.csv
├── wayne_rd_portfolio.csv
├── wayne_supply_chain.csv
└── README.md
```

## 🔧 API Endpoints

### Dashboard Overview
- `GET /api/dashboard/overview` - Executive summary metrics

### Financial Analytics
- `GET /api/financial/trends` - Financial performance trends

### HR Analytics
- `GET /api/hr/performance` - Employee performance data

### Security Operations
- `GET /api/security/districts` - District security metrics

### R&D Portfolio
- `GET /api/rd/portfolio` - Research project data

### Supply Chain
- `GET /api/supply-chain/facilities` - Facility performance data

### Business Intelligence
- `GET /api/business/narrative` - AI-generated business insights

## 🎨 UI Components

- **MetricCard**: Displays key performance indicators
- **HRChart**: Interactive HR performance charts
- **SecurityChart**: Security district visualization
- **RDPortfolioChart**: R&D project portfolio charts
- **SupplyChainChart**: Supply chain facility metrics

## 🔒 Security Features

- CORS configuration for secure API access
- Input validation and error handling
- Secure data processing without exposing sensitive information

## 📈 Performance Optimizations

- Efficient data processing with Pandas
- Optimized React components with proper state management
- Responsive design for all device sizes
- Fast API responses with async processing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.

---

**Wayne Enterprises** - Building the future, one innovation at a time. 