'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { classes, transformDate, transformPhoneNumber } from '@src/utils/utils';
import styles from './Search.module.css';
import Tag from './Tag/Tag';
import { AdvancedSearch } from './AdvancedSearch/AdvancedSearch';
import InputField from '../InputField/InputField';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@src/redux/rootReducer';
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
  resetFields,
} from '@src/redux/reducers/patientSearchReducer';

interface SearchProps {
  className?: string;
  onSubmit?: () => void;
}

export default function Search({ className, onSubmit }: SearchProps) {
  const dispatch = useDispatch();

  const {
    fullName,
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
  } = useSelector((state: RootState) => state.patientSearch);

  // Testing
  console.log({
    fullName,
    active,
    countries: Array.from(countries),
    states: Array.from(states),
    cities: Array.from(cities),
    dateOfBirths: Array.from(dateOfBirths),
    emails: Array.from(emails),
    additionalAffiliations: Array.from(additionalAffiliations),
    dateOfJoins: Array.from(dateOfJoins),
    beiChapters: Array.from(beiChapters),
    secondaryPhoneNumbers: Array.from(secondaryPhoneNumbers),
    secondaryNames: Array.from(secondaryNames),
  });

  console.log(Array.from(emails)[0]);

  const [searchInput, setSearchInput] = useState<string>(fullName);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false);

  const tagsPresent = useMemo(
    () =>
      active !== undefined ||
      countries.size > 0 ||
      states.size > 0 ||
      cities.size > 0 ||
      dateOfBirths.size > 0 ||
      emails.size > 0 ||
      additionalAffiliations.size > 0 ||
      dateOfJoins.size > 0 ||
      beiChapters.size > 0 ||
      secondaryPhoneNumbers.size > 0 ||
      secondaryNames.size > 0,
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
    dispatch(setFullName(searchInput));

    dispatch(setFullName('John Doe'));
    dispatch(setActive(false));
    dispatch(setCountries(new Set(['Country1', 'Country2'])));
    dispatch(setStates(new Set(['State1', 'State2'])));
    dispatch(setCities(new Set(['City1', 'City2'])));
    dispatch(setDateOfBirths(new Set(['1990-01-01', '1992-02-02'])));
    dispatch(setEmails(new Set(['email1@example.com', 'email2@example.com'])));
    dispatch(
      setAdditionalAffiliations(new Set(['Affiliation1', 'Affiliation2']))
    );
    dispatch(setDateOfJoins(new Set(['2020-01-01', '2022-02-02'])));
    dispatch(setBeiChapters(new Set(['Chapter1', 'Chapter2'])));
    dispatch(setSecondaryPhoneNumbers(new Set(['1234567890', '0987654321'])));
    dispatch(
      setSecondaryNames(new Set(['Secondary Name1', 'Secondary Name2']))
    );

    // dispatch(resetFields());

    onSubmit?.();
  }, [searchInput, dispatch, setFullName, onSubmit]);

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
                  category='countries'
                  setAction={setCountries}
                />
              ))}
            {states.size > 0 &&
              Array.from(states).map((state) => (
                <Tag
                  key={`state-${state}`}
                  title='State'
                  value={state}
                  category='states'
                  setAction={setStates}
                />
              ))}
            {cities.size > 0 &&
              Array.from(cities).map((city) => (
                <Tag
                  key={`city-${city}`}
                  title='City'
                  value={city}
                  category='cities'
                  setAction={setCities}
                />
              ))}
            {/* {active !== undefined && (
              <Tag
                key={`active-${active}`}
                title='Status'
                value={'active'}
                transformData={(val) => (val ? 'Active' : 'Inactive')}
                onClick={() => dispatch(setActive(undefined))}
              />
            )} */}
            {dateOfBirths.size > 0 &&
              Array.from(dateOfBirths).map((dob) => (
                <Tag
                  key={`dob-${dob}`}
                  title='Date of Birth'
                  value={dob}
                  category='dateOfBirths'
                  setAction={setDateOfBirths}
                  transformData={transformDate}
                />
              ))}
            {emails.size > 0 &&
              Array.from(emails).map((email) => (
                <Tag
                  key={`email-${email}`}
                  title='Email'
                  value={email}
                  category='emails'
                  setAction={setEmails}
                />
              ))}
            {dateOfJoins.size > 0 &&
              Array.from(dateOfJoins).map((dateOfJoin) => (
                <Tag
                  key={`join-date-${dateOfJoin}`}
                  title='Join Date'
                  value={dateOfJoin}
                  category='dateOfJoins'
                  setAction={setDateOfJoins}
                  transformData={transformDate}
                />
              ))}
            {beiChapters.size > 0 &&
              Array.from(beiChapters).map((chapter) => (
                <Tag
                  key={`bei-chapter-${chapter}`}
                  title='BEI Chapter'
                  value={chapter}
                  category='beiChapters'
                  setAction={setBeiChapters}
                />
              ))}
            {secondaryPhoneNumbers.size > 0 &&
              Array.from(secondaryPhoneNumbers).map((secondaryPhoneNumber) => (
                <Tag
                  key={`phone-number-${secondaryPhoneNumber}`}
                  title='Secondary Phone Number'
                  value={secondaryPhoneNumber}
                  category='secondaryPhoneNumbers'
                  setAction={setSecondaryPhoneNumbers}
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
                    category='additionalAffiliations'
                    setAction={setAdditionalAffiliations}
                  />
                )
              )}
            {secondaryNames.size > 0 &&
              Array.from(secondaryNames).map((secondaryName) => (
                <Tag
                  key={`secondary-name-${secondaryName}`}
                  title='Secondary Name'
                  value={secondaryName}
                  category='secondaryNames'
                  setAction={setSecondaryNames}
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
          {/* <AdvancedSearch onSubmit={onSubmitSearch} /> */}
        </div>
      </div>
    </div>
  );
}
