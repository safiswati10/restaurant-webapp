import React, { useState } from "react";

const SalaryManagement = () => {
  const [salaries, setSalaries] = useState({
    approved: [
      {
        riderId: 1,
        riderName: "John Doe",
        riderPhone: "5556667777",
        riderAccountNum: "123456789",
        riderBankName: "Bank of America",
        riderBankAccountName: "John Doe",
        salaryStatus: "Paid",
        dateOfSalarySending: "2023-10-01",
      },
    ],
    pending: [
      {
        riderId: 2,
        riderName: "Jane Doe",
        riderPhone: "5556668888",
        riderAccountNum: "987654321",
        riderBankName: "Chase",
        riderBankAccountName: "Jane Doe",
        salaryStatus: "Pending",
        dateOfSalarySending: "2023-10-05",
      },
    ],
  });
  const [filter, setFilter] = useState("pending");
  const [monthFilter, setMonthFilter] = useState("");

  const handlePaySalary = (riderId) => {
    const salaryToPay = salaries.pending.find((salary) => salary.riderId === riderId);
    if (salaryToPay) {
      const updatedPending = salaries.pending.filter(
        (salary) => salary.riderId !== riderId
      );
      const updatedApproved = [
        ...salaries.approved,
        { ...salaryToPay, salaryStatus: "Paid" },
      ];
      setSalaries({
        ...salaries,
        pending: updatedPending,
        approved: updatedApproved,
      });
    }
  };

  return (
    <>
      <h2 className="text-center mb-4">Manage Salaries</h2>
      
      <div className="d-flex gap-3 mb-3">
        <button
          className={`btn ${
            filter === "pending" ? "btn-warning" : "btn-secondary"
          }`}
          onClick={() => setFilter("pending")}
        >
          Pending Salaries
        </button>
        <button
          className={`btn ${
            filter === "paid" ? "btn-warning" : "btn-secondary"
          }`}
          onClick={() => setFilter("paid")}
        >
          Paid Salaries
        </button>
        <input
          type="month"
          className="form-control"
          placeholder="Filter by Month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
        />
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Rider ID</th>
            <th>Rider Name</th>
            <th>Rider Phone</th>
            <th>Account Number/IBAN</th>
            <th>Bank Name</th>
            <th>Bank Account Name</th>
            <th>Salary Status</th>
            <th>Date of Salary Sending</th>
            {filter === "pending" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {salaries[filter].map((salary) => (
            <tr key={salary.riderId}>
              <td>{salary.riderId}</td>
              <td>{salary.riderName || 'N/A'}</td>
              <td>{salary.riderPhone || 'N/A'}</td>
              <td>{salary.riderAccountNum || 'N/A'}</td>
              <td>{salary.riderBankName || 'N/A'}</td>
              <td>{salary.riderBankAccountName || 'N/A'}</td>
              <td>{salary.salaryStatus || 'N/A'}</td>
              <td>{salary.dateOfSalarySending || 'N/A'}</td>
              {filter === "pending" && (
                <td>
                  <button
                    onClick={() => handlePaySalary(salary.riderId)}
                    className="btn btn-success"
                  >
                    Pay Salary
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default SalaryManagement;