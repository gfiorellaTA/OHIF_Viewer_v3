import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import {
  Button,
  Icon,
  Typography,
  InputText,
  InputDateRange,
  InputSelect,
  InputLabelWrapper,
} from '@ohif/ui';

const StudyListFilter = ({ filtersMeta, filtersValues, numOfStudies }) => {
  const [currentFiltersValues, setcurrentFiltersValues] = useState(
    filtersValues
  );
  const { sortBy, sortDirection } = currentFiltersValues;

  const handleFilterLabelClick = name => {
    let _sortDirection = 1;
    if (sortBy === name) {
      _sortDirection = sortDirection + 1;
      if (_sortDirection > 1) {
        _sortDirection = -1;
      }
    }

    if (numOfStudies <= 100) {
      setcurrentFiltersValues(prevState => ({
        ...prevState,
        sortBy: _sortDirection !== 0 ? name : '',
        sortDirection: _sortDirection,
      }));
    }
  };

  const getFieldInputComponent = inputType => {
    switch (inputType) {
      case 'Text':
        return InputText;
      case 'Select':
        return InputSelect;
      case 'DateRange':
        return InputDateRange;
      case 'None':
        return InputLabelWrapper;
      default:
        break;
    }
  };

  const clearFilters = () => {
    setcurrentFiltersValues(StudyListFilter.defaultProps.filtersValues);
  };

  const isFiltering = () => {
    return Object.keys(currentFiltersValues).some(name => {
      const filterValue = currentFiltersValues[name];
      return filterValue !== StudyListFilter.defaultProps.filtersValues[name];
    });
  };

  return (
    <>
      <div>
        <div className="bg-custom-navyDark">
          <div className="container m-auto relative flex flex-col pt-5">
            <div className="flex flex-row justify-between mb-5 px-12">
              <div className="flex flex-row">
                <Typography
                  variant="h4"
                  className="text-custom-aquaBright mr-6"
                >
                  Study List
                </Typography>
                <div className="flex flex-row items-end">
                  <Button
                    variant="text"
                    size="small"
                    color="inherit"
                    className="text-custom-blueBright"
                    startIcon={<Icon name="info-link" className="w-2" />}
                  >
                    <span className="flex flex-col flex-1">
                      <span>Learn more</span>
                      <span className="opacity-50 pt-1 border-b border-custom-blueBright"></span>
                    </span>
                  </Button>
                </div>
              </div>
              <div className="flex flex-row">
                {isFiltering() && (
                  <Button
                    rounded="full"
                    variant="outlined"
                    color="primary"
                    className="text-custom-blueBright border-custom-blueBright mx-8"
                    startIcon={<Icon name="cancel" />}
                    onClick={clearFilters}
                  >
                    Clear filters
                  </Button>
                )}
                <Typography variant="h4" className="mr-2">
                  {numOfStudies > 100 ? '>100' : numOfStudies}
                </Typography>
                <Typography
                  variant="h6"
                  className="text-custom-grayLight self-end pb-1"
                >
                  Studies
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sticky z-10 border-b-4 border-black" style={{ top: 58 }}>
        <div className="bg-custom-navyDark pt-3 pb-3 ">
          <div className="container m-auto relative flex flex-col">
            <div className="flex flex-row w-full">
              {filtersMeta.map(
                ({
                  name,
                  displayName,
                  inputType,
                  isSortable,
                  gridCol,
                  inputProps,
                }) => {
                  const _isSortable =
                    isSortable && numOfStudies <= 100 && numOfStudies > 0;
                  const _isBeingSorted = sortBy === name;
                  const onLabelClick = () => handleFilterLabelClick(name);
                  const FilterInputComponent = getFieldInputComponent(
                    inputType
                  );

                  return (
                    <div
                      key={name}
                      className={classnames(
                        `w-${gridCol}/24`,
                        'pl-4 first:pl-12'
                      )}
                    >
                      {FilterInputComponent && (
                        <FilterInputComponent
                          key={name}
                          label={displayName}
                          isSortable={_isSortable}
                          isBeingSorted={_isBeingSorted}
                          sortDirection={sortDirection}
                          onLabelClick={onLabelClick}
                          inputProps={inputProps}
                          value={currentFiltersValues[name]}
                          onChange={newValue => {
                            setcurrentFiltersValues(prevState => ({
                              ...prevState,
                              [name]: newValue,
                            }));
                          }}
                        />
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
        {numOfStudies > 100 && (
          <div className="container m-auto">
            <div className="bg-custom-blue text-center text-base py-1 rounded-b">
              <p className="text-white">
                Filter list to 100 studies or less to enable sorting
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

StudyListFilter.defaultProps = {
  filtersMeta: [],
  filtersValues: {},
  numOfStudies: 0,
};

StudyListFilter.propTypes = {
  filtersMeta: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      dsplayName: PropTypes.string,
      inputType: PropTypes.oneOf(['Text', 'Select', 'DateRange', 'None']),
      isSortable: PropTypes.bool,
      gridCol: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    })
  ),
  filtersValues: PropTypes.object,
  numOfStudies: PropTypes.number,
};

export default StudyListFilter;
