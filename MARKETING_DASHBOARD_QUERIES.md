# Marketing Dashboard Queries

## 📊 **Key Marketing Insights from PPM Tool Users**

### 1. Company Size Distribution
```sql
SELECT 
  company_size,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) as percentage
FROM marketing_insights 
WHERE has_guided_data = true
GROUP BY company_size
ORDER BY count DESC;
```

### 2. Department Usage Analysis
```sql
SELECT * FROM department_analysis ORDER BY total_requests DESC;
```

### 3. Project Complexity vs Company Size
```sql
SELECT 
  company_size,
  project_complexity,
  COUNT(*) as companies,
  STRING_AGG(DISTINCT preferred_tool_1, ', ') as top_tools
FROM marketing_insights 
WHERE has_guided_data = true 
  AND company_size != 'Unknown' 
  AND project_complexity != 'Unknown'
GROUP BY company_size, project_complexity
ORDER BY company_size, companies DESC;
```

### 4. Methodology Preferences by Industry Segment
```sql
SELECT 
  methodology,
  company_size,
  COUNT(*) as usage_count
FROM marketing_insights
CROSS JOIN LATERAL unnest(methodologies) as method(methodology)
WHERE has_guided_data = true
GROUP BY methodology, company_size
ORDER BY methodology, usage_count DESC;
```

### 5. Lead Scoring for Sales Team
```sql
SELECT 
  user_email,
  company_size,
  project_volume,
  user_sophistication,
  departments,
  preferred_tool_1,
  created_at,
  -- Lead score calculation
  CASE 
    WHEN user_count >= 4 THEN 100  -- Enterprise/Large
    WHEN user_count = 3 AND project_volume_annually >= 3 THEN 80  -- Medium with good volume
    WHEN user_count = 2 AND 'Engineering' = ANY(departments) THEN 70  -- Small tech company
    WHEN user_count >= 2 THEN 60  -- Other small/medium
    ELSE 40  -- Micro companies
  END as lead_score
FROM marketing_insights 
WHERE has_guided_data = true
  AND created_at >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY lead_score DESC, created_at DESC;
```

### 6. Feature Interest by Department
```sql
-- Based on top criteria rankings
SELECT 
  dept.department,
  -- Extract top criteria from selected_criteria JSON
  jsonb_object_agg(
    criteria.value->>'name', 
    (criteria.value->>'weight')::integer
  ) as avg_criteria_weights
FROM email_reports er
CROSS JOIN LATERAL unnest(er.departments) as dept(department)
CROSS JOIN LATERAL jsonb_array_elements(er.selected_criteria) as criteria
WHERE er.has_guided_data = true
  AND er.created_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY dept.department
ORDER BY dept.department;
```

### 7. Campaign Segmentation
```sql
-- Identify key segments for targeted campaigns
SELECT 
  'Enterprise Engineering' as segment,
  COUNT(*) as size,
  ARRAY_AGG(DISTINCT preferred_tool_1) as tool_preferences
FROM marketing_insights 
WHERE company_size LIKE '%Enterprise%' 
  AND 'Engineering' = ANY(departments)
  AND has_guided_data = true

UNION ALL

SELECT 
  'Mid-Market Operations' as segment,
  COUNT(*) as size,
  ARRAY_AGG(DISTINCT preferred_tool_1) as tool_preferences
FROM marketing_insights 
WHERE company_size LIKE '%Medium%' 
  AND 'Operations' = ANY(departments)
  AND has_guided_data = true

UNION ALL

SELECT 
  'High-Volume PMOs' as segment,
  COUNT(*) as size,
  ARRAY_AGG(DISTINCT preferred_tool_1) as tool_preferences
FROM marketing_insights 
WHERE project_volume LIKE '%High%'
  AND has_guided_data = true

ORDER BY size DESC;
```

## 🎯 **Campaign Use Cases**

### **Email Sequences:**
- **Enterprise prospects** (user_count >= 4): Focus on scalability, security, portfolio management
- **Engineering teams**: Highlight integrations, flexibility, technical features  
- **Non-technical users**: Emphasize ease of use, templates, training/support

### **Content Personalization:**
- **High-volume users**: Case studies about efficiency gains, automation
- **Complex projects**: ROI calculators, advanced features demos
- **Multi-department**: Collaboration features, cross-functional workflows

### **Sales Prioritization:**
- Lead score > 80: Immediate sales outreach
- Lead score 60-80: Nurture sequence with relevant content
- Lead score < 60: Educational content track

## 📈 **Analytics Tracking**

Monitor these KPIs from the marketing_insights view:
- Conversion rate by company size
- Feature interest by department
- Tool preference trends over time
- Geographic distribution (via user_agent parsing)
- Guided completion rate vs. manual users
