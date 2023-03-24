import microscopyManager from './tools/microscopyManager';
import { ServicesManager, CommandsManager, ExtensionManager } from '@ohif/core';
import styles from './utils/styles';
import callInputDialog from './utils/callInputDialog';

export default function getCommandsModule({
  servicesManager,
  commandsManager,
  extensionManager,
}: {
  servicesManager: ServicesManager;
  commandsManager: CommandsManager;
  extensionManager: ExtensionManager;
}) {
  const {
    viewportGridService,
    toolbarService,
    uiDialogService,
    cornerstoneViewportService,
    customizationService,
    measurementService,
  } = servicesManager.services;

  const actions = {
    // Measurement tool commands:
    deleteMeasurement: ({ uid }) => {
      if (uid) {
        const roiAnnotation = microscopyManager.getAnnotation(uid);
        if (roiAnnotation) microscopyManager.removeAnnotation(roiAnnotation);
      }
    },

    setLabel: ({ uid }) => {
      const roiAnnotation = microscopyManager.getAnnotation(uid);

      callInputDialog({
        uiDialogService,
        title: 'Enter your annotation',
        defaultValue: '',
        callback: (value: string, action: string) => {
          switch (action) {
            case 'save': {
              roiAnnotation.setLabel(value);
              microscopyManager.triggerRelabel(roiAnnotation);
            }
          }
        },
      });
    },

    setToolActive: ({ toolName, toolGroupId = 'MICROSCOPY' }) => {
      if (
        [
          'line',
          'box',
          'circle',
          'point',
          'polygon',
          'freehandpolygon',
          'freehandline',
        ].indexOf(toolName) >= 0
      ) {
        // TODO: read from configuration
        let options = {
          geometryType: toolName,
          vertexEnabled: true,
          styleOptions: styles.default,
        } as any;
        if ('line' === toolName) {
          options.minPoints = 2;
          options.maxPoints = 2;
        } else if ('point' === toolName) {
          delete options.styleOptions;
          delete options.vertexEnabled;
        }

        microscopyManager.activateInteractions([['draw', options]]);
      } else if (toolName == 'dragPan') {
        microscopyManager.activateInteractions([['dragPan']]);
      }
    },

    rotateViewport: ({ rotation }) => {},
    flipViewportHorizontal: () => {},
    flipViewportVertical: () => {},
    invertViewport: ({ element }) => {},
    resetViewport: () => {},
    scaleViewport: ({ direction }) => {},
    scroll: ({ direction }) => {},
    incrementActiveViewport: () => {
      const { activeViewportIndex, viewports } = viewportGridService.getState();
      const nextViewportIndex = (activeViewportIndex + 1) % viewports.length;
      viewportGridService.setActiveViewportIndex(nextViewportIndex);
    },
    decrementActiveViewport: () => {
      const { activeViewportIndex, viewports } = viewportGridService.getState();
      const nextViewportIndex =
        (activeViewportIndex - 1 + viewports.length) % viewports.length;
      viewportGridService.setActiveViewportIndex(nextViewportIndex);
    },

    toggleOverlays: () => {
      // overlay
      const overlays = document.getElementsByClassName(
        'microscopy-viewport-overlay'
      );
      let onoff = false; // true if this will toggle on
      for (let i = 0; i < overlays.length; i++) {
        if (i === 0) onoff = overlays.item(0).classList.contains('hidden');
        overlays.item(i).classList.toggle('hidden');
      }

      // overview
      const { activeViewportIndex, viewports } = viewportGridService.getState();
      microscopyManager.toggleOverviewMap(activeViewportIndex);
    },
    toggleAnnotations: () => {
      microscopyManager.toggleROIsVisibility();
    },
  };

  const definitions = {
    deleteMeasurement: {
      commandFn: actions.deleteMeasurement,
      storeContexts: [] as any[],
      options: {},
    },
    setLabel: {
      commandFn: actions.setLabel,
      storeContexts: [] as any[],
      options: {},
    },
    setToolActive: {
      commandFn: actions.setToolActive,
      storeContexts: [] as any[],
      options: {},
    },
    rotateViewportCW: {
      commandFn: actions.rotateViewport,
      storeContexts: [] as any[],
      options: { rotation: 90 },
    },
    rotateViewportCCW: {
      commandFn: actions.rotateViewport,
      storeContexts: [] as any[],
      options: { rotation: -90 },
    },
    incrementActiveViewport: {
      commandFn: actions.incrementActiveViewport,
      storeContexts: [] as any[],
    },
    decrementActiveViewport: {
      commandFn: actions.decrementActiveViewport,
      storeContexts: [] as any[],
    },
    flipViewportHorizontal: {
      commandFn: actions.flipViewportHorizontal,
      storeContexts: [] as any[],
      options: {},
    },
    flipViewportVertical: {
      commandFn: actions.flipViewportVertical,
      storeContexts: [] as any[],
      options: {},
    },
    resetViewport: {
      commandFn: actions.resetViewport,
      storeContexts: [] as any[],
      options: {},
    },
    scaleUpViewport: {
      commandFn: actions.scaleViewport,
      storeContexts: [] as any[],
      options: { direction: 1 },
    },
    scaleDownViewport: {
      commandFn: actions.scaleViewport,
      storeContexts: [] as any[],
      options: { direction: -1 },
    },
    fitViewportToWindow: {
      commandFn: actions.scaleViewport,
      storeContexts: [] as any[],
      options: { direction: 0 },
    },
    toggleOverlays: {
      commandFn: actions.toggleOverlays,
      storeContexts: [] as any[],
      options: {},
    },
    toggleAnnotations: {
      commandFn: actions.toggleAnnotations,
      storeContexts: [] as any[],
      options: {},
    },
  };

  return {
    actions,
    definitions,
    defaultContext: 'MICROSCOPY',
  };
}
