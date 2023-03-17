import { id } from './id';
import React, { Suspense } from 'react';
import getPanelModule from './getPanelModule';
import getCommandsModule from './getCommandsModule';

import { useViewportGrid } from '@ohif/ui';
import getDicomMicroscopySopClassHandler from './DicomMicroscopySopClassHandler';
import getDicomMicroscopySRSopClassHandler from './DicomMicroscopySRSopClassHandler';

const Component = React.lazy(() => {
  return import('./DicomMicroscopyViewport');
});

const MicroscopyViewport = (props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );
};

/**
 * You can remove any of the following modules if you don't need them.
 */
export default {
  /**
   * Only required property. Should be a unique value across all extensions.
   * You ID can be anything you want, but it should be unique.
   */
  id,

  /**
   * ViewportModule should provide a list of viewports that will be available in OHIF
   * for Modes to consume and use in the viewports. Each viewport is defined by
   * {name, component} object. Example of a viewport module is the CornerstoneViewport
   * that is provided by the Cornerstone extension in OHIF.
   */
  getViewportModule({ servicesManager, extensionManager }) {

    const ExtendedMicroscopyViewport = (props) => {
      console.log('Creating an extended microscopy viewport');
      const {
        displaySets,
        viewportIndex,
        viewportLabel,
        dataSource,
        viewportOptions,
        displaySetOptions,
      } = props;

      const [viewportGrid, viewportGridService] = useViewportGrid();
      const { viewports, activeViewportIndex } = viewportGrid;

      return (
        <MicroscopyViewport
          servicesManager={servicesManager}
          extensionManager={extensionManager}
          activeViewportIndex={activeViewportIndex}
          setViewportActive={(viewportIndex: number) => {
            viewportGridService.setActiveViewportIndex(viewportIndex);
          }}
          viewportData={viewportOptions}
          {...props}
        />
      );
    };

    return [
      {
        name: 'microscopy-dicom',
        component: ExtendedMicroscopyViewport
      },
    ];
  },

  /**
   * SopClassHandlerModule should provide a list of sop class handlers that will be
   * available in OHIF for Modes to consume and use to create displaySets from Series.
   * Each sop class handler is defined by a { name, sopClassUids, getDisplaySetsFromSeries}.
   * Examples include the default sop class handler provided by the default extension
   */
  getSopClassHandlerModule({
    servicesManager,
    commandsManager,
    extensionManager,
  }) {
    return [
      getDicomMicroscopySopClassHandler({
        servicesManager,
        extensionManager
      }),
      getDicomMicroscopySRSopClassHandler({
        servicesManager,
        extensionManager,
      }),
    ];
  },

  getPanelModule,

  getCommandsModule,
};
