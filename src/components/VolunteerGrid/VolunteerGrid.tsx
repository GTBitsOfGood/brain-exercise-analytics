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

  const currentItems = useMemo(() => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  }, [currentPage, itemsPerPage, data]);

  const handleDelete = (id: number) => {
    setPopupOpen(true);

    const onConfirm = () => {
      data.filter((volunteer) => volunteer.id !== id);
      setPopupOpen(false);
    };

    const onClose = () => {
      setPopupOpen(false);
    };

    return <Popup isOpen={popupOpen} onClose={onClose} onConfirm={onConfirm} />;
  };

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
          onClick={() => handleDelete(volunteer.id)}
        >
          Delete Account
        </text>
      </td>
    </tr>
  ));

  const onClose = () => {
    setPopupOpen(false);
  };

  const onConfirm = () => {
    // Implement the delete functionality here
  };

  return (
    <div className={styles.volunteerGridWrapper}>
      <DataGrid
        columns={volunteersColumns}
        sortField={sortField}
        setSortField={setSortField}
        rows={currentItems}
        ColumnSizes={() => <></>}
        Rows={Rows}
      />
      <Popup isOpen={popupOpen} onClose={onClose} onConfirm={onConfirm} />
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageCount={pageCount}
      />
    </div>
  );
};

export default VolunteerGrid;
