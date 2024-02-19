import React, { useState, useMemo } from "react";
import DataGrid from "@src/components/DataGrid/DataGrid";
import Pagination from "@src/components/Pagination/Pagination";
import { SortField } from "@/common_utils/types";
import styles from "./VolunteerGrid.module.css";
import Popup from "./Popup/Popup";

interface IVolunteer {
  id: number;
  name: string;
  title: string;
  dateJoined: string;
  status: boolean;
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
  { field: "dateJoined", headerName: "Date Joined", sortable: true },
  { field: "status", headerName: "Status", sortable: true },
  { field: "actions", headerName: "", sortable: false },
];

const VolunteerGrid: React.FC<{ data: IVolunteer[] }> = ({ data }) => {
  const [sortField, setSortField] = useState<SortField | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 10;
  const pageCount = Math.ceil(data.length / itemsPerPage);
  const [popupOpen, setPopupOpen] = useState(false);
  const [deleteVolunteerId, setDeleteVolunteerId] = useState<number | null>(
    null,
  );
  const [excludedIds, setExcludedIds] = useState<number[]>([]);

  const handleConfirmDelete = () => {
    if (deleteVolunteerId !== null) {
      setExcludedIds((current) => [...current, deleteVolunteerId]);
      // eslint-disable-next-line
      data = data.filter(volunteer => !excludedIds.includes(volunteer.id) && volunteer.id !== deleteVolunteerId);
      setDeleteVolunteerId(null);
    }
    setPopupOpen(false);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setDeleteVolunteerId(null);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteVolunteerId(id);
    setPopupOpen(true);
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
        <col style={{ width: "20%" }} />
        <col style={{ width: "20%" }} />
        <col style={{ width: "20%" }} />
      </colgroup>
    );
  }

  // Construct Rows from the currentItems
  const Rows = currentItems.map((volunteer) => (
    <tr key={volunteer.id}>
      <td>{volunteer.name}</td>
      <td>{volunteer.title}</td>
      <td>{volunteer.dateJoined}</td>
      <td>
        <label className={styles.statusToggle}>
          <input type="checkbox" />
          <span />
        </label>
        {volunteer.status ? (
          <span className={styles.statusActive}>Active</span>
        ) : (
          <span className={styles.statusInactive}>Inactive</span>
        )}
      </td>
      <td>
        <text
          className={styles.deleteButton}
          onClick={() => handleDeleteClick(volunteer.id)}
        >
          Delete Account
        </text>
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
      {popupOpen && (
        <Popup onClose={handleClosePopup} onConfirm={handleConfirmDelete} />
      )}
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageCount={pageCount}
      />
    </div>
  );
};

export default VolunteerGrid;
