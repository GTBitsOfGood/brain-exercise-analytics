'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { classes, transformDate, transformPhoneNumber } from '@src/utils/utils';
import styles from './Search.module.css';
import Tag from './Tag/Tag';
import { AdvancedSearch } from './AdvancedSearch/AdvancedSearch';
import InputField from '../InputField/InputField';
import {
  setFullName,
  setActive,
  setCountries,
  setStates,
  setCities,
  setDateOfBirths,
  setEmails,
  setAdditionalAffiliations,
  setDateOfJoins,
  setBeiChapters,
  setSecondaryPhoneNumbers,
  setSecondaryNames,
} from '@src/redux/reducers/patientSearchReducer';
import { RootState } from '@src/redux/rootReducer';

interface SearchProps {
  className?: string;
  onSubmit?: () => void;
}

export default function Search({ className, onSubmit }: SearchProps) {
  const [searchInput, setSearchInput] = useState<string>('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false);

  const dispatch = useDispatch();
  const {
    active,
    countries,
    states,
    cities,
    dateOfBirths,
    emails,
    additionalAffiliations,
    dateOfJoins,
    beiChapters,
    secondaryPhones: secondaryPhoneNumbers,
    secondaryNames,
  } = useSelector((state: RootState) => state.patientSearch);

  const tagsPresent = useMemo(
    () =>
      active !== undefined ||
      countries.length > 0 ||
      states.length > 0 ||
      cities.length > 0 ||
      dateOfBirths.length > 0 ||
      emails.length > 0 ||
      additionalAffiliations.length > 0 ||
      dateOfJoins.length > 0 ||
      beiChapters.length > 0 ||
      secondaryPhoneNumbers.length > 0 ||
      secondaryNames.length > 0,
    [
      active,
      countries,
      states,
      cities,
      dateOfBirths,
      emails,
      additionalAffiliations,
      dateOfJoins,
      beiChapters,
      secondaryPhoneNumbers,
      secondaryNames,
    ]
  );
  const onSubmitSearch = useCallback(() => {
    setFullName(searchInput);
    onSubmit?.();
  }, [searchInput, setFullName, onSubmit]);

  return (
    <div className={classes(styles.wrapper, className)}>
      <div className={styles.border}>
        <div className={styles['search-no-tags']}>
          <div className={styles['search-container']}>
            <InputField
              className={styles['search-bar']}
              inputFieldClassName={styles['search-bar-input']}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder='Name'
            />
          </div>
          <FontAwesomeIcon
            className={styles['search-icon']}
            icon={faSearch}
            size='lg'
            onClick={onSubmitSearch}
            style={{ height: 28 }}
          />
          <p
            className={styles['advanced-filter']}
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          >
            Advanced Filter
          </p>
        </div>
        {tagsPresent ? (
          <div className={styles.tags}>
            {countries.size > 0 &&
              Array.from(countries).map((country) => (
                <Tag
                  key={`country-${country}`}
                  title='Country'
                  value={country}
                  setList={setCountries}
                />
              ))}
            {states.size > 0 &&
              Array.from(states).map((state) => (
                <Tag
                  key={`state-${state}`}
                  title='State'
                  value={state}
                  setList={setStates}
                />
              ))}
            {cities.size > 0 &&
              Array.from(cities).map((city) => (
                <Tag
                  key={`city-${city}`}
                  title='City'
                  value={city}
                  setList={setCities}
                />
              ))}
            {active !== undefined && (
              <Tag
                key={`active-${active}`}
                title='Status'
                value={active}
                transformData={(val) => (val ? 'Active' : 'Inactive')}
                onClick={() => setActive(undefined)}
              />
            )}
            {dateOfBirths.size > 0 &&
              Array.from(dateOfBirths).map((dob) => (
                <Tag
                  key={`dob-${dob}`}
                  title='Date of Birth'
                  value={dob}
                  setList={setDateOfBirths}
                  transformData={transformDate}
                />
              ))}
            {emails.size > 0 &&
              Array.from(emails).map((email) => (
                <Tag
                  key={`email-${email}`}
                  title='Email'
                  value={email}
                  setList={setEmails}
                />
              ))}
            {dateOfJoins.size > 0 &&
              Array.from(dateOfJoins).map((dateOfJoin) => (
                <Tag
                  key={`join-date-${dateOfJoin}`}
                  title='Join Date'
                  value={dateOfJoin}
                  setList={setDateOfJoins}
                  transformData={transformDate}
                />
              ))}
            {beiChapters.size > 0 &&
              Array.from(beiChapters).map((chapter) => (
                <Tag
                  key={`bei-chapter-${chapter}`}
                  title='BEI Chapter'
                  value={chapter}
                  setList={setBeiChapters}
                />
              ))}
            {secondaryPhoneNumbers.size > 0 &&
              Array.from(secondaryPhoneNumbers).map((secondaryPhoneNumber) => (
                <Tag
                  key={`phone-number-${secondaryPhoneNumber}`}
                  title='Secondary Phone Number'
                  value={secondaryPhoneNumber}
                  setList={setSecondaryPhoneNumbers}
                  transformData={transformPhoneNumber}
                />
              ))}
            {additionalAffiliations.size > 0 &&
              Array.from(additionalAffiliations).map(
                (additionalAffiliation) => (
                  <Tag
                    key={`additional-affiliation-${additionalAffiliation}`}
                    title='Additional Affiliation'
                    value={additionalAffiliation}
                    setList={setAdditionalAffiliations}
                  />
                )
              )}
            {secondaryNames.size > 0 &&
              Array.from(secondaryNames).map((secondaryName) => (
                <Tag
                  key={`secondary-name-${secondaryName}`}
                  title='Secondary Name'
                  value={secondaryName}
                  setList={setSecondaryNames}
                />
              ))}
          </div>
        ) : null}
        <div
          className={classes(
            styles['advanced-search-container'],
            showAdvancedSearch && styles['advanced-search-container-show']
          )}
        >
          <AdvancedSearch
            active={active}
            setActive={setActive}
            setCountries={setCountries}
            setStates={setStates}
            setCities={setCities}
            setDateOfBirths={setDateOfBirths}
            setEmails={setEmails}
            setAdditionalAffiliations={setAdditionalAffiliations}
            setDateOfJoins={setDateOfJoins}
            setBeiChapters={setBeiChapters}
            setSecondaryPhoneNumbers={setSecondaryPhoneNumbers}
            setSecondaryNames={setSecondaryNames}
            onSubmit={onSubmitSearch}
          />
        </div>
      </div>
    </div>
  );
}
