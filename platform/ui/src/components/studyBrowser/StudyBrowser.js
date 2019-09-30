import React from 'react';
import PropTypes from 'prop-types';
import { Thumbnail } from './Thumbnail.js';
import './StudyBrowser.styl';

function StudyBrowser(props) {
  const { studies, onThumbnailClick, onThumbnailDoubleClick } = props;

  return (
    <div className="study-browser">
      <div className="scrollable-study-thumbnails">
        {studies
          .map((study, studyIndex) => {
            const { studyInstanceUid } = study;
            return study.thumbnails.map((thumb, thumbIndex) => {
              // TODO: Thumb has more props than we care about?
              const {
                altImageText,
                displaySetInstanceUid,
                imageId,
                instanceNumber,
                numImageFrames,
                seriesDescription,
                seriesNumber,
                stackPercentComplete,
              } = thumb;

              return (
                <Thumbnail
                  key={`${studyIndex}_${thumbIndex}`}
                  id={`${studyIndex}_${thumbIndex}`} // Unused?
                  // Study
                  studyInstanceUid={studyInstanceUid} // used by drop
                  // Thumb
                  altImageText={altImageText}
                  imageId={imageId}
                  instanceNumber={instanceNumber}
                  displaySetInstanceUid={displaySetInstanceUid} // used by drop
                  numImageFrames={numImageFrames}
                  seriesDescription={seriesDescription}
                  seriesNumber={seriesNumber}
                  stackPercentComplete={stackPercentComplete}
                  // Events
                  onClick={onThumbnailClick}
                  onDoubleClick={onThumbnailDoubleClick}
                />
              );
            });
          })
          .flat()}
      </div>
    </div>
  );
}

const noop = () => {};

StudyBrowser.propTypes = {
  studies: PropTypes.arrayOf(
    PropTypes.shape({
      studyInstanceUid: PropTypes.string.isRequired,
      thumbnails: PropTypes.arrayOf(
        PropTypes.shape({
          altImageText: PropTypes.string,
          displaySetInstanceUid: PropTypes.string.isRequired,
          imageId: PropTypes.string,
          instanceNumber: PropTypes.number,
          numImageFrames: PropTypes.number,
          seriesDescription: PropTypes.string,
          seriesNumber: PropTypes.number,
          stackPercentComplete: PropTypes.number,
        })
      ),
    })
  ).isRequired,
  onThumbnailClick: PropTypes.func,
  onThumbnailDoubleClick: PropTypes.func,
};

StudyBrowser.defaultProps = {
  studies: [],
  onThumbnailClick: noop,
  onThumbnailDoubleClick: noop,
};

export { StudyBrowser };
