import { DisplaySetService, Types } from '@ohif/core';

import getNextSRSeriesNumber from './getNextSRSeriesNumber';

/**
 * Find an SR having the same series description.
 *
 * @param SeriesDescription - is the description to look for
 * @param displaySetService - the display sets to search for DICOM SR in
 * @returns SeriesMetadata from a DICOM SR having the same series description
 */
export default function findSRWithSameSeriesDescription(
  SeriesDescription: string,
  displaySetService: DisplaySetService
): Types.SeriesMetadata {
  const activeDisplaySets = displaySetService.getActiveDisplaySets();
  const srDisplaySets = activeDisplaySets.filter(ds => ds.Modality === 'SR');
  const sameSeries = srDisplaySets.find(
    ds => ds.SeriesDescription === SeriesDescription
  );
  if (sameSeries) {
    console.log('Storing to same series', sameSeries);
    const { instance } = sameSeries;
    const {
      SeriesInstanceUID,
      SeriesDescription,
      SeriesDate,
      SeriesTime,
      SeriesNumber,
      Modality,
    } = instance;
    return {
      SeriesInstanceUID,
      SeriesDescription,
      SeriesDate,
      SeriesTime,
      SeriesNumber,
      Modality,
      InstanceNumber: sameSeries.others.length + 1,
    };
  }

  const SeriesNumber = getNextSRSeriesNumber(displaySetService);
  return { SeriesDescription, SeriesNumber };
}
