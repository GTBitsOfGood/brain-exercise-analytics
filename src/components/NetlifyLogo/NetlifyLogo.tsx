import styles from "./NetlifyLogo.module.css";

export default function NetlifyLogo() {

    return(
        <a href="https://www.netlify.com/" target="_blank" className={styles.mainContainer}>
            <div className={styles.text}>Built with</div>
            <div className={styles.netlify}></div>
        </a>
    );
}