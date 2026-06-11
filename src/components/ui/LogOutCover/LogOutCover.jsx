
import Spinner from "../Spinner/Spinner";
import styles from "./LogOutCover.module.css";
import { useEffect } from "react";

const LogOutCover = ({ OnFinish }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (["/", "/log-in"].includes(pathname)) OnFinish();
  }, [pathname]);
  return (
    <div
      className={`${styles.layout}   h-100 flex-c  showSmooth column coverredirct`}
    >
      <Spinner size={40} color="black" />
      <h1 className={styles.text}>logging out...</h1>
    </div>
  );
};

export default LogOutCover;
