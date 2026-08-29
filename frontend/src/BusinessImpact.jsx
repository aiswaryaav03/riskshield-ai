function BusinessImpact() {
  return (
    <section className="panel business-panel">

      <div className="history-header">

        <div>
          <h2>Business Impact</h2>

          <p>
            Estimated cost of incorrect fraud decisions on the held-out test set.
          </p>
        </div>

        <span className="history-count">
          3,000 Test Transactions
        </span>

      </div>


      <div className="cost-grid">

        <div className="cost-card">
          <span>False Positives</span>
          <strong>91</strong>
          <small>Legitimate transactions flagged</small>
        </div>


        <div className="cost-card">
          <span>False Negatives</span>
          <strong>85</strong>
          <small>Fraud transactions missed</small>
        </div>


        <div className="cost-card">
          <span>FP Cost</span>
          <strong>₹18,200</strong>
          <small>Estimated operational cost</small>
        </div>


        <div className="cost-card">
          <span>FN Cost</span>
          <strong>₹4,25,000</strong>
          <small>Estimated fraud loss</small>
        </div>

      </div>


      <div className="total-cost">

        <div>
          <span>Total Estimated Error Cost</span>

          <small>
            Based on the selected 65% decision threshold.
          </small>
        </div>

        <strong>₹4,43,200</strong>

      </div>


      <div className="business-message">

        <strong>Why this matters</strong>

        <p>
          Missing a fraudulent transaction can be significantly more
          expensive than reviewing a legitimate transaction. RiskShield
          therefore uses a decision threshold to balance fraud detection
          against unnecessary manual reviews.
        </p>

      </div>

    </section>
  );
}

export default BusinessImpact;
