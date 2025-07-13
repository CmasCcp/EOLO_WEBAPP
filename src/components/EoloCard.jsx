import React from "react";

const EoloCard = ({titulo, lateral, body}) => {
  return (
    <div className="card p-4 shadow-sm my-3">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h5 className="fw-bold mb-1">{titulo}</h5>
          <p className="mb-0 text-muted" style={{ maxWidth: "500px" }}>{body}
          </p>
        </div>
        <div>
          <h5 className="fw-bold">{lateral}</h5>
        </div>
      </div>
    </div>
  );
};

export default EoloCard;
