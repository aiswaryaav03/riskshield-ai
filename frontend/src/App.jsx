import { useState } from "react";
import "./App.css";
import ModelPerformance from "./ModelPerformance";
import RiskSignals from "./RiskSignals";
import BusinessImpact from "./BusinessImpact";

const defaultForm = {
  amount: 45000,
  account_age_days: 5,
  transactions_last_10min: 8,
  transactions_last_1hr: 15,
  avg_transaction_amount: 1800,
  failed_attempts: 3,
  is_new_device: 1,
  is_new_location: 1,
  distance_from_usual_location: 1200,
  hour: 2,
};

function App() {
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = Number(event.target.value);

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const analyzeTransaction = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      const transaction = {
        id: "TXN-" + Date.now().toString().slice(-6),
        time: new Date().toLocaleTimeString(),
        amount: form.amount,
        risk_score: data.risk_score,
        risk_level: data.risk_level,
        recommended_action: data.recommended_action,
        reasons: data.reasons,
        model: data.model,
        threshold: data.threshold,
      };

      setResult(data);
      setHistory((previous) => [transaction, ...previous]);
    } catch (error) {
      console.error(error);
      alert(
        "Could not connect to RiskShield API. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadNormalTransaction = () => {
    setForm({
      amount: 500,
      account_age_days: 500,
      transactions_last_10min: 1,
      transactions_last_1hr: 2,
      avg_transaction_amount: 600,
      failed_attempts: 0,
      is_new_device: 0,
      is_new_location: 0,
      distance_from_usual_location: 5,
      hour: 14,
    });

    setResult(null);
  };

  const loadSuspiciousTransaction = () => {
    setForm(defaultForm);
    setResult(null);
  };

  const total = history.length;

  const high = history.filter(
    (item) => item.risk_level === "HIGH"
  ).length;

  const medium = history.filter(
    (item) => item.risk_level === "MEDIUM"
  ).length;

  const low = history.filter(
    (item) => item.risk_level === "LOW"
  ).length;

  const riskClass = result
    ? result.risk_level.toLowerCase()
    : "";

  return (
    <div className="app">

      <header className="header">
        <div className="logo">
          <div className="logo-icon">R</div>

          <div>
            <h1>RiskShield AI</h1>
            <span>Intelligent Transaction Risk Detection</span>
          </div>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          AI Engine Online
        </div>
      </header>


      <main className="dashboard">

        <div className="page-title">
          <div>
            <h2>Fraud Detection Dashboard</h2>
            <p>
              Monitor and analyze transaction risk using machine learning.
            </p>
          </div>
        </div>


        <section className="stats-grid">

          <div className="stat-card">
            <span>Total Analyzed</span>
            <strong>{total}</strong>
            <small>Transactions</small>
          </div>

          <div className="stat-card high-stat">
            <span>High Risk</span>
            <strong>{high}</strong>
            <small>Requires attention</small>
          </div>

          <div className="stat-card medium-stat">
            <span>Medium Risk</span>
            <strong>{medium}</strong>
            <small>Needs review</small>
          </div>

          <div className="stat-card low-stat">
            <span>Low Risk</span>
            <strong>{low}</strong>
            <small>Approved</small>
          </div>

        </section>


        <div className="main-grid">

          <section className="panel">

            <div className="panel-header">
              <h2>Analyze Transaction</h2>
              <p>
                Enter transaction behaviour and payment details.
              </p>
            </div>


            <div className="quick-buttons">

              <button onClick={loadNormalTransaction}>
                Load Normal Example
              </button>

              <button onClick={loadSuspiciousTransaction}>
                Load Suspicious Example
              </button>

            </div>


            <div className="form-grid">

              <div className="field">
                <label>Transaction Amount (₹)</label>

                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                />
              </div>


              <div className="field">
                <label>Account Age (days)</label>

                <input
                  type="number"
                  name="account_age_days"
                  value={form.account_age_days}
                  onChange={handleChange}
                />
              </div>


              <div className="field">
                <label>Transactions / 10 min</label>

                <input
                  type="number"
                  name="transactions_last_10min"
                  value={form.transactions_last_10min}
                  onChange={handleChange}
                />
              </div>


              <div className="field">
                <label>Transactions / 1 hour</label>

                <input
                  type="number"
                  name="transactions_last_1hr"
                  value={form.transactions_last_1hr}
                  onChange={handleChange}
                />
              </div>


              <div className="field">
                <label>Average Transaction (₹)</label>

                <input
                  type="number"
                  name="avg_transaction_amount"
                  value={form.avg_transaction_amount}
                  onChange={handleChange}
                />
              </div>


              <div className="field">
                <label>Failed Attempts</label>

                <input
                  type="number"
                  name="failed_attempts"
                  value={form.failed_attempts}
                  onChange={handleChange}
                />
              </div>


              <div className="field">
                <label>New Device</label>

                <select
                  name="is_new_device"
                  value={form.is_new_device}
                  onChange={handleChange}
                >
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </select>
              </div>


              <div className="field">
                <label>New Location</label>

                <select
                  name="is_new_location"
                  value={form.is_new_location}
                  onChange={handleChange}
                >
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </select>
              </div>


              <div className="field">
                <label>Distance from Usual Location (km)</label>

                <input
                  type="number"
                  name="distance_from_usual_location"
                  value={form.distance_from_usual_location}
                  onChange={handleChange}
                />
              </div>


              <div className="field">
                <label>Transaction Hour (0-23)</label>

                <input
                  type="number"
                  min="0"
                  max="23"
                  name="hour"
                  value={form.hour}
                  onChange={handleChange}
                />
              </div>

            </div>


            <button
              className="analyze-btn"
              onClick={analyzeTransaction}
              disabled={loading}
            >
              {loading
                ? "Analyzing Transaction..."
                : "Analyze Transaction"}
            </button>

          </section>


          <section className="panel result-panel">

            {!result && (
              <div className="empty-state">

                <div className="shield">
                  🛡️
                </div>

                <h2>Ready to Analyze</h2>

                <p>
                  Submit a transaction to receive an AI-powered
                  fraud risk assessment.
                </p>

              </div>
            )}


            {result && (
              <div className="result">

                <p className="result-label">
                  AI RISK ASSESSMENT
                </p>


                <div className={"risk-card " + riskClass}>

                  <div className="risk-score">
                    {result.risk_score}%
                  </div>

                  <div className="risk-level">
                    {result.risk_level} RISK
                  </div>

                </div>


                <div className="action-box">

                  <div>
                    <span>Recommended Action</span>

                    <strong>
                      {result.recommended_action}
                    </strong>
                  </div>

                  <div className="threshold">
                    <span>Threshold</span>

                    <strong>
                      {result.threshold}%
                    </strong>
                  </div>

                </div>


                <div className="reasons">

                  <h3>
                    Why was this transaction flagged?
                  </h3>

                  {result.reasons.map((reason, index) => (
                    <div
                      className="reason"
                      key={index}
                    >
                      <span>✓</span>
                      {reason}
                    </div>
                  ))}

                </div>


                <div className="model-info">
                  <span>
                    Model: {result.model}
                  </span>

                  <span>
                    Decision threshold: {result.threshold}%
                  </span>
                </div>

              </div>
            )}

          </section>

        </div>


        <section className="panel history-panel">

          <div className="history-header">

            <div>
              <h2>Recent Transactions</h2>

              <p>
                Transactions analyzed during this session.
              </p>
            </div>

            <span className="history-count">
              {history.length} analyzed
            </span>

          </div>


          {history.length === 0 ? (

            <div className="no-history">
              No transactions analyzed yet.
            </div>

          ) : (

            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>Transaction</th>
                    <th>Time</th>
                    <th>Amount</th>
                    <th>Risk Score</th>
                    <th>Risk Level</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {history.map((item) => (

                    <tr key={item.id}>

                      <td>
                        <strong>{item.id}</strong>
                      </td>

                      <td>
                        {item.time}
                      </td>

                      <td>
                        ₹{Number(item.amount).toLocaleString("en-IN")}
                      </td>

                      <td>
                        <strong>
                          {item.risk_score}%
                        </strong>
                      </td>

                      <td>
                        <span
                          className={
                            "badge " +
                            item.risk_level.toLowerCase()
                          }
                        >
                          {item.risk_level}
                        </span>
                      </td>

                      <td>
                        {item.recommended_action}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}
        </section>


        {/* MODEL PERFORMANCE */}

        <section className="panel performance-panel">

          <div className="history-header">

            <div>
              <h2>Model Performance</h2>

              <p>
                Evaluated on a held-out test set of 3,000 transactions.
              </p>
            </div>

            <span className="history-count">
              XGBoost
            </span>

          </div>


          <div className="performance-grid">

            <div className="metric-card">
              <span>ROC-AUC</span>
              <strong>80.65%</strong>
              <small>Overall ranking ability</small>
            </div>


            <div className="metric-card">
              <span>Precision</span>
              <strong>30.53%</strong>
              <small>Fraud alerts that were correct</small>
            </div>


            <div className="metric-card">
              <span>Recall</span>
              <strong>32.00%</strong>
              <small>Fraud cases detected</small>
            </div>


            <div className="metric-card">
              <span>F1 Score</span>
              <strong>31.25%</strong>
              <small>Precision-recall balance</small>
            </div>

          </div>


          <div className="performance-note">

            <div>
              <strong>Decision Threshold</strong>

              <span>
                Transactions with a predicted fraud probability
                above this threshold are sent for further review.
              </span>
            </div>

            <strong className="threshold-value">
              65%
            </strong>

          </div>

        </section>
              <ModelPerformance />
              <RiskSignals form={form} result={result} />
              <BusinessImpact />

      </main>

    </div>
  );
}
export default App;