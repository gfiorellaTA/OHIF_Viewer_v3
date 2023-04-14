import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import PropTypes from 'prop-types';

const DEFAULT_STATE = {
  isCineEnabled: false,
  cines: {
    /*
     * 1: { isPlaying: false, frameRate: 24 };
     */
  },
};

const DEFAULT_CINE = { isPlaying: false, frameRate: 24 };

export const CineContext = createContext(DEFAULT_STATE);

export default function CineProvider({ children, service }) {
  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_CINE': {
        const { id, frameRate, isPlaying = undefined } = action.payload;
        const cines = state.cines;
        const syncedCineIds = service
          .getSyncedViewports(id)
          .map(({ viewportIndex }) => viewportIndex);
        const cineIdsToUpdate = [id, ...syncedCineIds].filter(curId => {
          const curCine = cines[curId] ?? {};
          return (
            curCine.frameRate !== (frameRate ?? curCine.frameRate) ||
            curCine.isPlaying !== (isPlaying ?? curCine.isPlaying)
          );
        });

        cineIdsToUpdate.forEach(currId => {
          let cine = cines[currId];

          if (!cine) {
            cine = { id, ...DEFAULT_CINE };
            cines[currId] = cine;
          }

          cine.frameRate = frameRate ?? cine.frameRate;
          cine.isPlaying = isPlaying ?? cine.isPlaying;
        });

        return { ...state, cines: { ...cines } };
      }
      case 'SET_IS_CINE_ENABLED': {
        return { ...state, ...{ isCineEnabled: action.payload } };
      }
      default:
        return action.payload;
    }
  };

  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);

  const getState = useCallback(() => state, [state]);

  const setIsCineEnabled = useCallback(
    isCineEnabled =>
      dispatch({ type: 'SET_IS_CINE_ENABLED', payload: isCineEnabled }),
    [dispatch]
  );

  const setCine = useCallback(
    ({ id, frameRate, isPlaying }) =>
      dispatch({
        type: 'SET_CINE',
        payload: {
          id,
          frameRate,
          isPlaying,
        },
      }),
    [dispatch]
  );

  /**
   * Sets the implementation of a modal service that can be used by extensions.
   *
   * @returns void
   */
  useEffect(() => {
    if (service) {
      service.setServiceImplementation({ getState, setIsCineEnabled, setCine });
    }
  }, [getState, service, setCine, setIsCineEnabled]);

  const api = {
    getState,
    setCine,
    setIsCineEnabled,
    playClip: (element, playClipOptions) =>
      service.playClip(element, playClipOptions),
    stopClip: element => service.stopClip(element),
  };

  return (
    <CineContext.Provider value={[state, api]}>{children}</CineContext.Provider>
  );
}

CineProvider.propTypes = {
  children: PropTypes.any,
  service: PropTypes.shape({
    setServiceImplementation: PropTypes.func,
  }).isRequired,
};

export const useCine = () => useContext(CineContext);
