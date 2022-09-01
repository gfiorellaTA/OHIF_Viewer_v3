import { getEnabledElement } from '../state';
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';

const TriggerAlgorithm = ({ viewports, servicesManager }) => {
  let count = 0;

  // pass all the data here and configure them
  const { UINotificationService } = servicesManager.services;

  // setting active viewport reference to element variable
  const element = getEnabledElement(viewports.activeViewportIndex);
  if (!element) {
    return;
  }

  // Check if there are multiple layers and remove the main one
  const all_layers = cornerstone.getLayers(element);
  if (all_layers.length > 1) {
    cornerstone.removeLayer(element, all_layers[1].layerId);
    cornerstone.updateImage(element);
  }

  const enabled_element = cornerstone.getEnabledElement(element);
  if (!enabled_element || !enabled_element.image) {
    return;
  }

  const tool_data = cornerstoneTools.getToolState(element, 'RectangleRoi');
  const stack = tool_data;

  // Add our tool, and set it's mode
  if (!stack) {
    cornerstoneTools.setToolActive('RectangleRoi', {
      mouseButtonMask: 1,
    });
  }
  // Pull event from cornerstone-tools
  const { EVENTS } = cornerstoneTools;

  // Adding event listener to checking when user is done deriving a measurement
  element.addEventListener(EVENTS.MEASUREMENT_COMPLETED, function(e) {
    // let allROIToolData = {};
    // let toolROITypes = [
    //   'StackScroll',
    //   'Pan',
    //   'Zoom',
    //   'Wwwc',
    //   'EllipticalRoi',
    //   'RectangleRoi',
    //   'ArrowAnnotate',
    //   'Length',
    //   'CobbAngle',
    //   'Angle',
    //   'Bidirectional',
    //   'FreehandRoi',
    //   'Calibration',
    // ]; // whatever the types you are using and wanting to save

    // for (let i = 0; i < toolROITypes.length; i++) {
    //   let toolROIType = toolROITypes[i];
    //   let toolROIData = cornerstoneTools.getToolState(element, toolROIType);

    //   if (toolROIData !== undefined) {
    //     allROIToolData[toolROITypes[i]] = toolROIData;
    //   }
    // }
    // let toolROIDataString = JSON.stringify(allROIToolData);

    // const crtlsState = cornerstoneTools.store;
    // const modules = cornerstoneTools.store.modules;

    const event_data = e.detail;
    const toolState =
      cornerstoneTools.globalImageIdSpecificToolStateManager.toolState;

    if (Object.keys(toolState).length > 0) {
      cornerstoneTools.globalImageIdSpecificToolStateManager.restoreToolState(
        {}
      );
      cornerstone.updateImage(element);
      cornerstoneTools.addToolState(
        element,
        'RectangleRoi',
        event_data.measurementData
      );
    }
  });

  // adding event listener for when user starts to get new dimensions
  element.addEventListener(EVENTS.MEASUREMENT_ADDED, () => {
    const toolState =
      cornerstoneTools.globalImageIdSpecificToolStateManager.toolState;

    // if (Object.keys(toolState).length > 0) {
    //   if (count === 1) {
    //     return;
    //   } else {
    //     UINotificationService.show({
    //       title: 'Overwrite Alert',
    //       message:
    //         'Taking new dimensions would remove previously selected ones',
    //       type: 'warning',
    //       duration: 7000,
    //     });
    //     count++;
    //   }
    // }
  });
};

export default TriggerAlgorithm;
