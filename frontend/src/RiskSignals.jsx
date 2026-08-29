function RiskSignals({ form, result }) {
  if (!result) {
    return null;
  }

  const signals = [
    {
      name: "Transaction Amount",
      value: form.amount,
      score: form.amount >= 10000 ? 100 : form.amount >= 5000 ? 65 : 20,
    },
    {
      name: "Transaction Velocity",
      value: form.transactions_last_10min,
      score:
        form.transactions_last_10min >= 7
          ? 100
          : form.transactions_last_10min >= 4
          ? 60
          : 20,
    },
    {
      name: "New Location",
      value: form.is_new_location ? "Yes" : "No",
      score: form.is_new_location ? 100 : 10,
    },
    {
      name: "New Device",
      value: form.is_new_device ? "Yes" : "No",
      score: form.is_new_device ? 90 : 10,
    },
    {
      name: "Distance from Usual",
      value: form.distance_from_usual_location + " km",
      score:
        form.distance_from_usual_location >= 500
          ? 100
          : form.distance_from_usual_location >= 100
          ? 65
          : 15,
    },
    {
      name: "Failed Attempts",
      value: form.failed_attempts,
      score:
        form.failed_attempts >= 3
          ? 90
          : form.failed_attempts >= 1
          ? 50
          : 10,
    },
    {
      name: "Account Age",
      value: form.account_age_days + " days",
      score:
        form.account_age_days <= 7
          ? 90
          : form.account_age_days <= 30
          ? 55
          : 10,
    },
    {
      name: "Transaction Hour",
      value: form.hour + ":00",
      score:
        form.hour <= 5 || form.hour >= 23
          ? 80
          : 20,
    },
  ];

  return (
    <section className="panel signals-panel">

      <div className="history-header">

        <div>
          <h2>Risk Signal Analysis</h2>

          <p>
            Behavioural signals contributing to the transaction assessment.
          </p>
        </div>

        <span className="history-count">
          Explainable AI
        </span>

      </div>


      <div className="signals-list">

        {signals.map((signal) => (

          <div className="signal-row" key={signal.name}>

            <div className="signal-info">

              <span className="signal-name">
                {signal.name}
              </span>

              <span className="signal-value">
                {signal.value}
              </span>

            </div>


            <div className="signal-bar-container">

              <div
                className="signal-bar"
                style={{ width: signal.score + "%" }}
              />

            </div>


            <span className="signal-score">
              {signal.score}
            </span>

          </div>

        ))}

      </div>


      <div className="signals-footer">

        <span>
          Model decision
        </span>

        <strong>
          {result.risk_level} — {result.risk_score}%
        </strong>

      </div>

    </section>
  );
}

export default RiskSignals;
