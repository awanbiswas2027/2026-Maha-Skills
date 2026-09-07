# -*- coding: utf-8 -*-
"""
CSS styles and HTML shell templates for MahaSkills Comprehensive Master Architecture Guide.
"""

CSS_STYLES = """
@page {
  size: A4 portrait;
  margin: 12mm 14mm 14mm 14mm;
  @bottom-right {
    content: "Page " counter(page);
    font-size: 8pt;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #64748b;
  }
}

* {
  box-sizing: border-box;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #1e293b;
  background-color: #ffffff;
  font-size: 8.6pt;
  line-height: 1.42;
  margin: 0;
  padding: 0;
}

.page-break {
  page-break-before: always;
}

/* Header & Banner */
.doc-header {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0369a1 100%);
  color: #ffffff;
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.doc-badge-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.doc-badge {
  background: #f59e0b;
  color: #0f172a;
  font-size: 7pt;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.doc-dept {
  font-size: 7.5pt;
  color: #93c5fd;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.doc-title {
  font-size: 16pt;
  font-weight: 900;
  margin: 2px 0 4px 0;
  color: #ffffff;
  letter-spacing: -0.3px;
}

.doc-subtitle {
  font-size: 8.8pt;
  color: #e0f2fe;
  margin: 0;
  font-weight: 500;
}

/* Executive Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin: 10px 0 14px 0;
}

.stat-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px 10px;
  text-align: center;
}

.stat-label {
  font-size: 6.5pt;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.4px;
}

.stat-val {
  font-size: 11pt;
  font-weight: 900;
  color: #0369a1;
  margin-top: 1px;
}

.stat-sub {
  font-size: 6.5pt;
  color: #475569;
}

/* Chapter Headers */
.chapter-header {
  border-bottom: 2px solid #0284c7;
  padding-bottom: 4px;
  margin-top: 14px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chapter-title {
  font-size: 12.5pt;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.chapter-badge {
  background: #0284c7;
  color: #ffffff;
  font-size: 7pt;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

/* Callout Boxes */
.concept-box {
  background: #fefce8;
  border-left: 4px solid #eab308;
  border-radius: 0 6px 6px 0;
  padding: 8px 12px;
  margin: 8px 0;
}

.concept-title {
  font-size: 8.5pt;
  font-weight: 800;
  color: #854d0e;
  margin-bottom: 3px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.concept-body {
  font-size: 8.2pt;
  color: #713f12;
  line-height: 1.4;
}

.tech-box {
  background: #f8fafc;
  border-left: 4px solid #0284c7;
  border-radius: 0 6px 6px 0;
  padding: 8px 12px;
  margin: 8px 0;
}

.tech-title {
  font-size: 8.5pt;
  font-weight: 800;
  color: #0369a1;
  margin-bottom: 3px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.tech-body {
  font-size: 8.2pt;
  color: #1e293b;
  line-height: 1.4;
}

.policy-box {
  background: #f0fdf4;
  border-left: 4px solid #059669;
  border-radius: 0 6px 6px 0;
  padding: 8px 12px;
  margin: 8px 0;
}

.policy-title {
  font-size: 8.5pt;
  font-weight: 800;
  color: #065f46;
  margin-bottom: 3px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.policy-body {
  font-size: 8.2pt;
  color: #064e3b;
  line-height: 1.4;
}

/* Diagram Container */
.diagram-container {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 8px 10px;
  margin: 10px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.diagram-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 4px;
  margin-bottom: 6px;
}

.diagram-heading {
  font-size: 8.5pt;
  font-weight: 800;
  color: #0f172a;
}

.diagram-source {
  font-size: 7pt;
  color: #64748b;
  font-family: monospace;
}

.diagram-caption {
  font-size: 7.2pt;
  color: #475569;
  font-style: italic;
  margin-top: 5px;
  text-align: center;
}

/* Tables */
.spec-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 8pt;
  margin: 8px 0;
}

.spec-table th, .spec-table td {
  border: 1px solid #cbd5e1;
  padding: 6px 8px;
  text-align: left;
  vertical-align: top;
}

.spec-table th {
  background: #f1f5f9;
  color: #0f172a;
  font-weight: 700;
  font-size: 7.5pt;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.spec-table tr:nth-child(even) td {
  background: #f8fafc;
}

/* Formulas & Callouts */
.formula-callout {
  background: #f0f9ff;
  border: 1.5px solid #0284c7;
  border-radius: 6px;
  padding: 8px 12px;
  margin: 8px 0;
  font-family: "Courier New", Courier, monospace;
  font-size: 8.5pt;
  font-weight: 700;
  color: #0369a1;
  text-align: center;
  letter-spacing: 0.2px;
}

.page-num {
  text-align: right;
  font-size: 7.5pt;
  color: #94a3b8;
  font-style: italic;
  margin-top: 6px;
}

p {
  margin: 0 0 6px 0;
}

ul, ol {
  margin: 0 0 6px 0;
  padding-left: 18px;
}

li {
  margin-bottom: 3px;
}

.bold {
  font-weight: 700;
  color: #0f172a;
}
"""

def wrap_html(title, body_content):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{title}</title>
  <style>
{CSS_STYLES}
  </style>
</head>
<body>
{body_content}
</body>
</html>
"""
