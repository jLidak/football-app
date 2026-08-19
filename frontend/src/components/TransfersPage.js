import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import PlayerImageSmall from "./PlayerImageSmall"; // Ensure this component is properly implemented
import UsePagination from "./UsePagination";
import PaginationComponent from "./PaginationComponent";

const BASE_URL = "http://localhost:8080";

const transferTypeMap = {
  TRANSFER: "Transfer",
  LOAN: "Loan",
  END_LOAN: "End of Loan",
};

const TransfersPage = () => {
  const [transfers, setTransfers] = useState([]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    currentResults,
    handlePageChange,
  } = UsePagination(transfers, 10);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/player-contracts/all`)
      .then((response) => {
        const sortedTransfers = response.data.sort(
          (a, b) => new Date(b.startDate) - new Date(a.startDate),
        );
        setTransfers(sortedTransfers);
      })
      .catch((error) => console.error("Error fetching transfers:", error));
  }, []);

  const getPreviousTeam = (playerId, currentStartDate) => {
    const previousTransfer = transfers.find(
      (transfer) =>
        transfer.player.id === playerId &&
        new Date(transfer.startDate) < new Date(currentStartDate),
    );
    return previousTransfer ? previousTransfer.team : null;
  };

  return (
    <Container fluid>
      <Row>
        <Col md={3} className="bg-light border-right">
          <Sidebar />
        </Col>
        <Col md={9}>
          <h2 className="mt-4 mb-4">Transfers</h2>
          <Table striped bordered hover className="align-middle">
            <thead>
              <tr>
                <th>Image</th>
                <th>Player</th>
                <th>From Team</th>
                <th>To Team</th>
                <th>Transfer Fee</th>
                <th>Salary</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Transfer Type</th>
              </tr>
            </thead>
            <tbody>
              {currentResults.map((transfer) => {
                const previousTeam = getPreviousTeam(
                  transfer.player.id,
                  transfer.startDate,
                );
                return (
                  <tr key={transfer.id}>
                    <td className="text-center">
                      {transfer.player ? (
                        <Link to={`/player/${transfer.player.id}`}>
                          <PlayerImageSmall player={transfer.player} />
                        </Link>
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td className="text-center">
                      {transfer.player ? (
                        <Link to={`/player/${transfer.player.id}`}>
                          {`${transfer.player.firstName} ${transfer.player.lastName}`}
                        </Link>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="text-center">
                      {previousTeam ? (
                        <Link to={`/team/${previousTeam.id}`}>
                          {previousTeam.name}
                        </Link>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="text-center">
                      {transfer.team ? (
                        <Link to={`/team/${transfer.team.id}`}>
                          {transfer.team.name}
                        </Link>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="text-center">
                      ${transfer.transferFee?.toLocaleString() || "Free"}
                    </td>
                    <td className="text-center">
                      ${transfer.salary?.toLocaleString() || "N/A"}
                    </td>
                    <td className="text-center">{transfer.startDate}</td>
                    <td className="text-center">
                      {transfer.endDate || "Ongoing"}
                    </td>
                    <td className="text-center">
                      {transferTypeMap[transfer.transferType] || "Unknown"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default TransfersPage;
