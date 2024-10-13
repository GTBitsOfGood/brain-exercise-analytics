import { CSSProperties } from "react";
import { classes } from "@src/utils/utils";

import { useRouter } from "next/navigation";
import styles from "./Modal.module.scss";

interface Props {
  showModal: boolean;
  setShowModal: (newShowModal: boolean) => void;
  disableBackgroundClick?: boolean;
  className?: string;
  style?: CSSProperties;
  children: React.ReactElement;
  link?: string;
}

export default function Modal({
  showModal,
  setShowModal,
  disableBackgroundClick,
  className,
  style,
  children,
  link,
}: Props) {
  const router = useRouter();
  if (!showModal) {
    return null;
  }
  return (
    <div className={classes(styles.modal, className)} style={style}>
      <div
        className={styles.modalBackground}
        {...(disableBackgroundClick
          ? {}
          : {
              onClick: () => {
                if (link) {
                  router.push(link);
                }
                setShowModal(false);
              },
            })}
      />
      {children}
    </div>
  );
}
