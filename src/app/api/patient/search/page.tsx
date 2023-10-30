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
  const [country, setCountry] = useState<Set<string>>(new Set<string>());
  const [state, setState] = useState<Set<string>>(new Set<string>());
  const [city, setCity] = useState<Set<string>>(new Set<string>());
  const [active, setActive] = useState(true);
  const [dateOfBirth, setDateOfBirth] = useState<Set<string>>(
    new Set<string>(),
  );
  const [email, setEmail] = useState<Set<string>>(new Set<string>());
  const [additionalAffliction, setAdditionalAffliction] = useState<Set<string>>(
    new Set<string>(),
  );
  const [joinDate, setJoinDate] = useState<Set<string>>(new Set<string>());
  const [beiChapter, setBeiChapter] = useState<Set<string>>(new Set<string>());
  const [secondPhoneNumber, setSecondPhoneNumber] = useState<Set<string>>(
    new Set<string>(),
  );
  const [secondName, setSecondName] = useState<Set<string>>(new Set<string>());

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
