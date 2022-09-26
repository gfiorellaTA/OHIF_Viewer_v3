import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon } from '@ohif/ui';

const SegmentItem = ({
  segmentIndex,
  segmentationId,
  label,
  isActive,
  isVisible,
  color,
  isLocked = false,
  onClick,
  onEdit,
  onDelete,
  onColor,
  onToggleVisibility,
  onToggleLocked,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isSegmentIndexHovering, setIsSegmentIndexHovering] = useState(false);

  const onMouseEnter = () => setIsHovering(true);
  const onMouseLeave = () => setIsHovering(false);

  const cssColor = `rgb(${color[0]},${color[1]},${color[2]})`;

  return (
    <div
      className={classnames(
        'group relative flex cursor-pointer bg-primary-dark transition duration-300 text-[12px]',
        {
          'border border-primary-light rounded-sm':
            isHovering || isSegmentIndexHovering,
        },
        {
          'border border-transparent rounded-lg':
            !isHovering && !isSegmentIndexHovering,
        }
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={e => {
        e.stopPropagation();
        onClick(segmentationId, segmentIndex);
      }}
      role="button"
      tabIndex={0}
      data-cy={'segment-item'}
    >
      <div
        onMouseEnter={() => setIsSegmentIndexHovering(true)}
        onMouseLeave={() => setIsSegmentIndexHovering(false)}
      >
        <div
          className={classnames(
            'w-[27px] h-[27px] flex items-center justify-center border-r border-r-black text-[12px]',
            {
              'bg-primary-light text-black': isActive,
              'bg-primary-dark text-aqua-pale': !isActive && isVisible,
              'bg-[#140e2e] opacity-60 text-[#537594]': !isActive && !isVisible,
            }
          )}
        >
          {isSegmentIndexHovering ? (
            <Icon
              name="close"
              className={classnames('w-5 h-5 pr-2')}
              onClick={e => {
                e.stopPropagation();
                onDelete(segmentationId, segmentIndex);
              }}
            />
          ) : (
            <div className={classnames('flex items-center pr-2 ')}>
              {segmentIndex}
            </div>
          )}
        </div>
      </div>
      <div
        className={classnames(
          'flex items-center justify-between w-full pl-2 py-1 text-white border-r border-r-black ',
          {
            'bg-secondary-dark text-primary-light': isActive,
            'bg-primary-dark text-aqua-pale': !isActive && isVisible,
            'bg-[#140e2e] opacity-60 text-[#537594]': !isVisible,
          }
        )}
      >
        <div className={classnames('flex items-center gap-2')}>
          <div
            className={classnames('w-[8px] h-[8px] rounded-full')}
            style={{ backgroundColor: cssColor }}
            onClick={e => {
              e.stopPropagation();
              onColor(segmentationId, segmentIndex);
            }}
          />
          <div>{label}</div>
        </div>
        {!isVisible && !isHovering && (
          <div className="pr-[7px]">
            <Icon
              name="row-hidden"
              className={classnames('w-5 h-5 text-[#3d5871] ')}
              onClick={e => {
                e.stopPropagation();
                onToggleVisibility(segmentationId, segmentIndex);
              }}
            />
          </div>
        )}
        {isHovering && (
          <div className={classnames('flex items-center pr-[7px]')}>
            <Icon
              name="row-edit"
              className={classnames('w-5 h-5', {
                'text-white': isLocked,
                'text-primary-light': !isLocked,
              })}
              onClick={e => {
                e.stopPropagation();
                onEdit(segmentationId, segmentIndex);
              }}
            />
            {isVisible ? (
              <Icon
                name="row-hide"
                className={classnames('w-5 h-5', {
                  'text-white': isLocked,
                  'text-primary-light': !isLocked,
                })}
                onClick={e => {
                  e.stopPropagation();
                  onToggleVisibility(segmentationId, segmentIndex);
                }}
              />
            ) : (
              <Icon
                name="row-unhide"
                className={classnames('w-5 h-5', {
                  'text-white': isLocked,
                  'text-primary-light': !isLocked,
                })}
                onClick={e => {
                  e.stopPropagation();
                  onToggleVisibility(segmentationId, segmentIndex);
                }}
              />
            )}
          </div>
        )}
      </div>
      {/* <div className="relative flex flex-col w-full border-t border-t-black">
        <div className="fl`ex items-center mb-1 ml-2">
          <div className="flex items-center flex-1 text-base text-primary-light">
            <div
              className={classnames(
                'w-3 h-3 mt-1 mr-2 rounded-full cursor-pointer transition duration-300 hover:opacity-80'
              )}
              onClick={e => {
                e.stopPropagation();
                onColor(segmentationId, segmentIndex);
              }}
              style={{ backgroundColor: cssColor }}
            ></div>
            {label}
          </div>
          <div className="flex items-center w-1/3">
            <div className="px-1">
              <Icon
                className={classnames(
                  'text-white w-4 cursor-pointer transition duration-300 hover:opacity-80'
                )}
                name={isVisible ? 'eye-visible' : 'eye-hidden'}
                onClick={e => {
                  // stopPropagation needed to avoid disable the current active item
                  e.stopPropagation();
                  onToggleVisibility(segmentationId, segmentIndex);
                }}
              />
            </div>
            {onToggleLocked !== undefined ? (
              <div className="px-1">
                <Icon
                  className={classnames(
                    'text-white w-4 cursor-pointer transition duration-300 hover:opacity-80'
                  )}
                  name={isLocked ? 'lock' : 'dotted-circle'}
                  onClick={e => {
                    // stopPropagation needed to avoid disable the current active item
                    e.stopPropagation();
                    onToggleLocked(segmentationId, segmentIndex);
                  }}
                />
              </div>
            ) : null}
            <div className="px-1">
              <Icon
                className={classnames(
                  'text-white w-4 cursor-pointer transition duration-300 hover:opacity-80'
                )}
                name={'pencil'}
                onClick={e => {
                  // stopPropagation needed to avoid disable the current active item
                  e.stopPropagation();
                  onEdit(segmentationId, segmentIndex);
                }}
              />
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

SegmentItem.propTypes = {
  segmentIndex: PropTypes.number.isRequired,
  segmentationId: PropTypes.string.isRequired,
  label: PropTypes.string,
  // color as array
  color: PropTypes.array,
  isActive: PropTypes.bool.isRequired,
  isVisible: PropTypes.bool.isRequired,
  isLocked: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleVisibility: PropTypes.func.isRequired,
  onToggleLocked: PropTypes.func,
};

SegmentItem.defaultProps = {
  isActive: false,
};

export default SegmentItem;
