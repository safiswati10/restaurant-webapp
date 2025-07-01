import React, { useState } from "react";

const RevenueManagement = () => {
  const [revenue, setRevenue] = useState({
    totalEarnings: "$1000",
    weeklyEarnings: [
      { day: "Monday", earnings: "$200" },
      { day: "Tuesday", earnings: "$150" },
      { day: "Wednesday", earnings: "$300" },
      { day: "Thursday", earnings: "$100" },
      { day: "Friday", earnings: "$250" },
    ],
  });
  const [filter, setFilter] = useState("today");

  return (
    <>
      <h2 className="text-center mb-4">Manage Revenue</h2>

      <div className="d-flex gap-3 mb-3">
        <button
          className={`btn ${
            filter === "today" ? "btn-warning" : "btn-secondary"
          }`}
          onClick={() => setFilter("today")}
        >
          Today
        </button>
        <button
          className={`btn ${
            filter === "weekly" ? "btn-warning" : "btn-secondary"
          }`}
          onClick={() => setFilter("weekly")}
        >
          Weekly
        </button>
        <button
          className={`btn ${
            filter === "monthly" ? "btn-warning" : "btn-secondary"
          }`}
          onClick={() => setFilter("monthly")}
        >
          Monthly
        </button>
        <button
          className={`btn ${
            filter === "untilNow" ? "btn-warning" : "btn-secondary"
          }`}
          onClick={() => setFilter("untilNow")}
        >
          Until Now
        </button>
      </div>

      {filter === "today" && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Today's Earnings</h5>
            <p className="card-text">Total: {revenue.totalEarnings}</p>
          </div>
        </div>
      )}

      {filter === "weekly" && (
        <>
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Weekly Earnings</h5>
              <p className="card-text">Total: {revenue.totalEarnings}</p>
            </div>
          </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Day</th>
                <th>Earnings</th>
              </tr>
            </thead>
            <tbody>
              {revenue.weeklyEarnings.map((item) => (
                <tr key={item.day}>
                  <td>{item.day}</td>
                  <td>{item.earnings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {filter === "monthly" && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Monthly Earnings</h5>
            <p className="card-text">Total: {revenue.totalEarnings}</p>
          </div>
        </div>
      )}

      {filter === "untilNow" && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Total Earnings Until Now</h5>
            <p className="card-text">Total: {revenue.totalEarnings}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default RevenueManagement;
