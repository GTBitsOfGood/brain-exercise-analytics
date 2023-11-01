"use client";

import React, { useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Poppins } from "next/font/google";
import styles from "./Search.module.css";
import Tag from "./Tag/Tag";

const poppins = Poppins({
  subsets: ["latin-ext"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

interface InputParamsProps {
  setShowAdvancedSearch: (showAdvancedSearch: boolean) => void;
  showAdvancedSearch: boolean;
  country: Set<string>;
  setCountry: (country: Set<string>) => void;
  state: Set<string>;
  setState: (state: Set<string>) => void;
  city: Set<string>;
  setCity: (city: Set<string>) => void;
  active: boolean;
  setActive: (active: boolean) => void;
  dateOfBirth: Set<string>;
  setDateOfBirth: (dob: Set<string>) => void;
  email: Set<string>;
  setEmail: (email: Set<string>) => void;
  joinDate: Set<string>;
  setJoinDate: (joinDate: Set<string>) => void;
  beiChapter: Set<string>;
  setBEIChapter: (chapter: Set<string>) => void;
  secondPhoneNumber: Set<string>;
  setSecondPhoneNumber: (phoneNumber: Set<string>) => void;
  additionalAffiliation: Set<string>;
  setAdditionalAffiliation: (words: Set<string>) => void;
  secondName: Set<string>;
  setSecondName: (name: Set<string>) => void;
}

const Search = (InputParamsProps: InputParamsProps) => {
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className={styles.container}>
      <div className={styles.border}>
        <main className={poppins.variable}>
          <div className={styles["search-no-tags"]}>
            <div className={styles["search-container"]}>
              <input
                className={styles["search-bar"]}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Name"
              />
            </div>
            <FontAwesomeIcon
              className={styles["search-icon"]}
              icon={faSearch}
              size="lg"
              onClick={() => console.log(searchInput)} //eslint-disable-line
            />
            <span
              className={styles["advanced-filter"]}
              onClick={() =>
                InputParamsProps.setShowAdvancedSearch(
                  !InputParamsProps.showAdvancedSearch,
                )
              }
            >
              Advanced Filter
            </span>
          </div>
          <div className={styles.tags}>
            {InputParamsProps.country.size > 0 &&
              Array.from(InputParamsProps.country).map((country, index) => (
                <Tag
                  key={index}
                  title="Country"
                  value={country}
                  list={InputParamsProps.country}
                  setList={InputParamsProps.setCountry}
                />
              ))}
            {InputParamsProps.state.size > 0 &&
              Array.from(InputParamsProps.state).map((state, index) => (
                <Tag
                  key={index}
                  title="State"
                  value={state}
                  list={InputParamsProps.state}
                  setList={InputParamsProps.setState}
                />
              ))}
            {InputParamsProps.city.size > 0 &&
              Array.from(InputParamsProps.city).map((city, index) => (
                <Tag
                  key={index}
                  title="City"
                  value={city}
                  list={InputParamsProps.city}
                  setList={InputParamsProps.setCity}
                />
              ))}
            {InputParamsProps.active && (
              <Tag title="Status" value={InputParamsProps.active} />
            )}
            {InputParamsProps.dateOfBirth.size > 0 &&
              Array.from(InputParamsProps.dateOfBirth).map((dob, index) => (
                <Tag
                  key={index}
                  title="Date of Birth"
                  value={dob}
                  list={InputParamsProps.dateOfBirth}
                  setList={InputParamsProps.setDateOfBirth}
                />
              ))}
            {InputParamsProps.email.size > 0 &&
              Array.from(InputParamsProps.email).map((email, index) => (
                <Tag
                  key={index}
                  title="Email"
                  value={email}
                  list={InputParamsProps.email}
                  setList={InputParamsProps.setEmail}
                />
              ))}
            {InputParamsProps.joinDate.size > 0 &&
              Array.from(InputParamsProps.joinDate).map((joinDate, index) => (
                <Tag
                  key={index}
                  title="Join Date"
                  value={joinDate}
                  list={InputParamsProps.joinDate}
                  setList={InputParamsProps.setJoinDate}
                />
              ))}
            {InputParamsProps.beiChapter.size > 0 &&
              Array.from(InputParamsProps.beiChapter).map((chapter, index) => (
                <Tag
                  key={index}
                  title="BEI Chapter"
                  value={chapter}
                  list={InputParamsProps.beiChapter}
                  setList={InputParamsProps.setBEIChapter}
                />
              ))}
            {InputParamsProps.secondPhoneNumber.size > 0 &&
              Array.from(InputParamsProps.secondPhoneNumber).map(
                (phoneNumber, index) => (
                  <Tag
                    key={index}
                    title="Second Phone Number"
                    value={phoneNumber}
                    list={InputParamsProps.secondPhoneNumber}
                    setList={InputParamsProps.setSecondPhoneNumber}
                  />
                ),
              )}
            {InputParamsProps.additionalAffiliation.size > 0 &&
              Array.from(InputParamsProps.additionalAffiliation).map(
                (words, index) => (
                  <Tag
                    key={index}
                    title="Additional Affiliation"
                    value={words}
                    list={InputParamsProps.additionalAffiliation}
                    setList={InputParamsProps.setAdditionalAffiliation}
                  />
                ),
              )}
            {InputParamsProps.secondName.size > 0 &&
              Array.from(InputParamsProps.secondName).map((name, index) => (
                <Tag
                  key={index}
                  title="Second Name"
                  value={name}
                  list={InputParamsProps.secondName}
                  setList={InputParamsProps.setSecondName}
                />
              ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Search;
