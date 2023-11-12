import Search from "@src/components/Search/Search";

import PatientGrid from "@src/components/PatientGrid/PatientGrid";
import { sampleUsers } from "@src/utils/patients";
import styles from "./page.module.css";

export default function Page() {
  return (
    <div className={styles["search-container"]}>
      <p className={styles["intro-text"]}>
        To begin viewing analytics, search for a patient here!
      </p>
      <div className={styles["search-wrapper"]}>
        <Search />
      </div>
      <div className={styles["table-wrapper"]}>
        <PatientGrid data={sampleUsers} />
      </div>
    </div>
  );
}
