const JOIN_STR = '&';

// This code finds the first unique index to add to the presentation id so that
// two viewports containing the same display set in the same type of viewport
// can have different presentation information.  This allows comparison of
// a single display set in two or more viewports, when the user has simply
// dragged and dropped the view in twice.  For example, it allows displaying
// bone, brain and soft tissue views of a single display set, and to still
// remember the specific changes to each viewport.
const addUniqueIndex = (arr, key, viewports) => {
  arr.push(0);
  for (let displayInstance = 0; displayInstance < 128; displayInstance++) {
    arr[arr.length - 1] = displayInstance;
    const testId = arr.join(JOIN_STR);
    if (
      !viewports.find(
        it => it.viewportOptions?.presentationIds?.[key] === testId
      )
    ) {
      break;
    }
  }
};

const getLutId = (ds): string => {
  if (!ds || !ds.options) return 'default';
  if (ds.options.id) return ds.options.id;
  const arr = Object.entries(ds.options).map(([key, val]) => `${key}=${value}`);
  if (!arr.length) return 'default';
  return arr.join('&');
};

export type PresentationIds = {
  positionPresentationId?: string;
  lutPresentationId?: string;
};

/**
 * Gets a set of presentation IDs for a viewport.  The presentation IDs are
 * used to remember the presentation state of the viewport when it is navigated
 * to different layouts.
 *
 * The design of this is setup to allow preserving the view information in the
 * following cases:
 *
 *
 *      * If a set of display sets was previously displayed in the same initial
 *        position as it is currently being asked to be displayed,
 *        then remember the camera position as previously displayed
 *
 *      * If a set of display sets was previously displayed with the same initial
 *        LUT conditions, then remember the last LUT displayed for that display set
 *        and re-apply it.
 *
 *      * Otherwise, apply the initial hanging protocol specified LUT and camera
 *        position to new display sets.
 *
 * This means generating two presentationId keys:
 *
 *  `positionPresentationId`
 *
 *  Used for getting the camera/initial position state sync values.
 *  This is a combination of:
 *      * `viewportOptions.id`
 *      * `viewportOptions.orientation`
 *      * display set UID's - as displayed for this viewport, excluding seg
 *      * a unique index number if the previous key is already displayed
 *
 * `lutPresentationId`
 *
 * Used for getting the voi LUT information.  Generated from:
 *
 *       * `displaySetOption[0].options` - including the id if present
 *       * displaySetUID's
 *       * a unique index number if the previously generated key is already
 *         displayed.
 *
 * @param viewport requiring a presentation Id
 * @param viewports is the list of viewports being shown.  Any presentation ID's
 *         among them must not be re-used in order to have each viewport have it's own presentation ID.
 * @returns PresentationIds
 */
const getPresentationId = (viewport, viewports): PresentationIds => {
  if (!viewport) return;
  const {
    viewportOptions,
    displaySetInstanceUIDs,
    displaySetOptions,
  } = viewport;
  if (!viewportOptions || !displaySetInstanceUIDs?.length) {
    return;
  }

  const { id, orientation } = viewportOptions;
  const lutId = getLutId(displaySetOptions[0]);

  const positionPresentationArr = [orientation || 'acquisition'];
  if (id) positionPresentationArr.push(id);
  const lutPresentationArr = [lutId];

  for (const uid of displaySetInstanceUIDs) {
    positionPresentationArr.push(uid);
    lutPresentationArr.push(uid);
  }

  addUniqueIndex(positionPresentationArr, 'positionPresentationId', viewports);
  addUniqueIndex(lutPresentationArr, 'lutPresentationId', viewports);

  const lutPresentationId = lutPresentationArr.join(JOIN_STR);
  const positionPresentationId = positionPresentationArr.join(JOIN_STR);
  return { lutPresentationId, positionPresentationId };
};

export default getPresentationId;
