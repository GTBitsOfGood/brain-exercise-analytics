import React, { useState, useMemo } from "react";
import DataGrid from "@src/components/DataGrid/DataGrid";
import Pagination from "@src/components/Pagination/Pagination";
import { SortField } from "@/common_utils/types";
import styles from "./VolunteerApprovalGrid.module.css";

interface IVolunteer {
  id: number;
  name: string;
  title: string;
  dateRequested: string;
}

interface GridColDef<T> {
  field: string;
  headerName: string;
  sortable?: boolean;
  renderCell?: (params: T) => JSX.Element;
}

const volunteersColumns: GridColDef<IVolunteer>[] = [
  { field: "name", headerName: "Name", sortable: true },
  { field: "title", headerName: "Title", sortable: true },
  { field: "dateRequested", headerName: "Date Requested", sortable: true },
  { field: "actions", headerName: "", sortable: false },
];

const VolunteerGrid: React.FC<{ data: IVolunteer[] }> = ({ data }) => {
  const [sortField, setSortField] = useState<SortField | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 10;
  const pageCount = Math.ceil(data.length / itemsPerPage);
  const [deleteVolunteerId, setDeleteVolunteerId] = useState<number | null>(
    null,
  );
  const [excludedIds, setExcludedIds] = useState<number[]>([]);

  const handleConfirmDelete = (id: number) => {
    setDeleteVolunteerId(id);
    if (deleteVolunteerId !== null) {
      setExcludedIds((current) => [...current, deleteVolunteerId]);
      // eslint-disable-next-line
      data = data.filter(
        (volunteer) =>
          !excludedIds.includes(volunteer.id) &&
          volunteer.id !== deleteVolunteerId,
      );
      setDeleteVolunteerId(null);
    }
  };

  const currentItems = useMemo(() => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return data
      .filter((volunteer) => !excludedIds.includes(volunteer.id))
      .slice(start, end);
  }, [currentPage, itemsPerPage, data, excludedIds]);

  function ColumnSizes() {
    return (
      <colgroup>
        <col style={{ width: "20%" }} />
        <col style={{ width: "20%" }} />
        <col style={{ width: "30%" }} />
        <col style={{ width: "20%" }} />
      </colgroup>
    );
  }

  // Construct Rows from the currentItems
  const Rows = currentItems.map((volunteer) => (
    <tr key={volunteer.id}>
      <td>{volunteer.name}</td>
      <td>{volunteer.title}</td>
      <td>{volunteer.dateRequested}</td>
      <td>
        <div className={styles.actionsContainer}>
          <button
            className={styles.approveButton}
            onClick={() => handleConfirmDelete(volunteer.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9 18.5C13.9706 18.5 18 14.4706 18 9.5C18 4.52944 13.9706 0.5 9 0.5C4.02944 0.5 0 4.52944 0 9.5C0 14.4706 4.02944 18.5 9 18.5ZM13.7071 7.20711C14.0976 6.81658 14.0976 6.18342 13.7071 5.79289C13.3166 5.40237 12.6834 5.40237 12.2929 5.79289L7 11.0858L5.70711 9.79289C5.31658 9.40237 4.68342 9.40237 4.29289 9.79289C3.90237 10.1834 3.90237 10.8166 4.29289 11.2071L6.29289 13.2071C6.68342 13.5976 7.31658 13.5976 7.70711 13.2071L13.7071 7.20711Z"
                fill="#05CD99"
              />
            </svg>
            Approve
          </button>
          <button
            className={styles.denyButton}
            onClick={() => handleConfirmDelete(volunteer.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9 18.5C13.9706 18.5 18 14.4706 18 9.5C18 4.52944 13.9706 0.5 9 0.5C4.02944 0.5 0 4.52944 0 9.5C0 14.4706 4.02944 18.5 9 18.5ZM6.70711 5.79289C6.31658 5.40237 5.68342 5.40237 5.29289 5.79289C4.90237 6.18342 4.90237 6.81658 5.29289 7.20711L7.58579 9.5L5.29289 11.7929C4.90237 12.1834 4.90237 12.8166 5.29289 13.2071C5.68342 13.5976 6.31658 13.5976 6.70711 13.2071L9 10.9142L11.2929 13.2071C11.6834 13.5976 12.3166 13.5976 12.7071 13.2071C13.0976 12.8166 13.0976 12.1834 12.7071 11.7929L10.4142 9.5L12.7071 7.20711C13.0976 6.81658 13.0976 6.18342 12.7071 5.79289C12.3166 5.40237 11.6834 5.40237 11.2929 5.79289L9 8.08579L6.70711 5.79289Z"
                fill="#EA4335"
              />
            </svg>
            Deny
          </button>
        </div>
      </td>
    </tr>
  ));

  return (
    <div className={styles.volunteerGridWrapper}>
      <div className={styles.volunteerGridTable}>
        <DataGrid
          columns={volunteersColumns}
          sortField={sortField}
          setSortField={setSortField}
          rows={currentItems}
          ColumnSizes={ColumnSizes}
          Rows={Rows}
        />
      </div>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageCount={pageCount}
      />
    </div>
  );
};

export default VolunteerGrid;