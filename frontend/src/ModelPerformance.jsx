function ModelPerformance() {
  return (
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
            Fraud probability above this threshold is treated
            as high risk and sent for further review.
          </span>
        </div>

        <strong className="threshold-value">
          65%
        </strong>

      </div>

    </section>
  );
}

export default ModelPerformance;
