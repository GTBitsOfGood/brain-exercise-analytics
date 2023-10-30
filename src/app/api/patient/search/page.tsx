"use client";

import React, { useState } from "react";
import NavigationPanel from "@src/components/NavigationPanel/NavigationPanel";
import { AdvancedSearch } from "@src/components/Search/AdvancedSearch/AdvancedSearch";
import { Poppins } from "next/font/google";
import Search from "@src/components/Search/Search";
import styles from "./page.module.css";

const poppins = Poppins({
  subsets: ["latin-ext"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function Page() {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false);
  const [country, setCountry] = useState<string[]>([]); // values chosen before the aply button
  const [state, setState] = useState<string[]>([]);
  const [city, setCity] = useState<string[]>([]);
  const [active, setActive] = useState(true);
  const [dateOfBirth, setDateOfBirth] = useState<string[]>([]);
  const [email, setEmail] = useState<string[]>([]);
  const [additionalAffliction, setAdditionalAffliction] = useState<string[]>([]);
  const [joinDate, setJoinDate] = useState<string[]>([]);
  const [beiChapter, setBeiChapter] = useState<string[]>([]);
  const [secondPhoneNumber, setSecondPhoneNumber] = useState<string[]>([]);
  const [secondName, setSecondName] = useState<string[]>([]);

  return (
    <div className={styles.wrapper}>
      <div className={styles["navigation-panel"]}>
        <NavigationPanel />
      </div>
      <main className={poppins.variable}>
        <div className={styles["text-wrapper"]}>
          <div className={styles["rest-of-page"]}>
            <span className={styles["intro-text"]}>
              To begin viewing analytics, search for a patient here!
            </span>
            <Search
              showAdvancedSearch={showAdvancedSearch}
              setShowAdvancedSearch={setShowAdvancedSearch}
            />
            {showAdvancedSearch && (
              <AdvancedSearch
                country={country}
                setCountry={setCountry}
                city={city}
                setCity={setCity}
                state={state}
                setState={setState}
                active={active}
                setActive={setActive}
                dateOfBirth={dateOfBirth}
                setDateOfBirth={setDateOfBirth}
                email={email}
                setEmail={setEmail}
                additionalAffiliation={additionalAffliction}
                setAdditionalAffiliation={setAdditionalAffliction}
                joinDate={joinDate}
                setJoinDate={setJoinDate}
                beiChapter={beiChapter}
                setBEIChapter={setBeiChapter}
                secondPhoneNumber={secondPhoneNumber}
                secondName={secondName}
                setSecondName={setSecondName}
                setSecondPhoneNumber={setSecondPhoneNumber}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
