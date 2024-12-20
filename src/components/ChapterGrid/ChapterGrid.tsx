"use client";

import DataGrid from "@src/components/DataGrid/DataGrid";
import Pagination from "@src/components/Pagination/Pagination";
import { IChapterTableEntry, SortField } from "@/common_utils/types";
import { GridColDef } from "@src/utils/types";
import TwoVolunteersIcon from "@src/app/icons/TwoVolunteersIcon";
import AddChapterModal from "@src/components/AddChapterModal/AddChapterModal";
import OperationSuccessModal from "@src/components/OperationSuccessModal/OperationSuccessModal";
import Modal from "@src/components/Modal/Modal";
import { useState } from "react";
import { Row } from "./Row/Row";
import styles from "./ChapterGrid.module.css";

interface ChapterGridProps {
  data: IChapterTableEntry[];
  sortField: SortField | undefined;
  setSortField: React.Dispatch<React.SetStateAction<SortField | undefined>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageCount: number;
  currentPage: number;
  entriesPerPage: number;
  setEntriesPerPage: (arg: number) => void;
  totalEntries: number;
}

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", sortable: true },
  { field: "location", headerName: "Location", sortable: true },
  { field: "founded", headerName: "Founded", sortable: true },
  { field: "volunteers", headerName: "Volunteers", sortable: true },
  { field: "patients", headerName: "Patients", sortable: true },
  { field: "actions", headerName: "", sortable: false },
];

function ColumnSizes() {
  return (
    <colgroup>
      <col style={{ width: "30%" }} />
      <col style={{ width: "20%" }} />
      <col style={{ width: "15%" }} />
      <col style={{ width: "10%" }} />
      <col style={{ width: "10%" }} />
      <col style={{ width: "12%" }} />
    </colgroup>
  );
}

function Header() {
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [chapterCreated, setChapterCreated] = useState<string>();

  return (
    <div className={styles["table-header"]}>
      <div className={styles["table-header-left"]}>
        <TwoVolunteersIcon />
        <p className={styles["table-header-text"]}>BEI / Chapter List</p>
      </div>
      <button
        className={styles["table-header-database-button"]}
        onClick={() => setShowModal(!showModal)}
      >
        Add Chapter
      </button>
      <Modal showModal={showModal} setShowModal={setShowModal}>
        <AddChapterModal
          className={styles.addChapterModalContent}
          setShowModal={setShowModal}
          setShowSuccessModal={setShowSuccessModal}
          setChapterCreated={setChapterCreated}
        />
      </Modal>
      <Modal showModal={showSuccessModal} setShowModal={setShowSuccessModal}>
        <OperationSuccessModal
          className={styles.operationSuccessModal}
          title={chapterCreated}
          subtitle="You have successfully created:"
          description="Find it in Search Chapter page to add more volunteers and patients."
        />
      </Modal>
    </div>
  );
}

export default function ChapterGrid(params: ChapterGridProps) {
  // Construct Rows from the data
  const Rows = params.data.map((chapter) => {
    return <Row key={chapter.name} chapter={chapter} />;
  });

  return (
    <div className={styles.chapterGridWrapper}>
      <div className={styles.chapterGridTable}>
        <DataGrid
          Header={<Header />}
          columns={columns}
          sortField={params.sortField}
          setSortField={params.setSortField}
          ColumnSizes={ColumnSizes}
          Rows={Rows}
        />
      </div>
      <Pagination
        setCurrentPage={params.setCurrentPage}
        pageCount={params.pageCount}
        currentPage={params.currentPage}
        entriesPerPage={params.entriesPerPage}
        setEntriesPerPage={params.setEntriesPerPage}
        totalEntries={params.totalEntries}
      />
    </div>
  );
}
