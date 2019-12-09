import { Icon, SelectTree } from '@ohif/ui';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash.clonedeep';

import LabellingTransition from './LabellingTransition.js';
import OHIFLabellingData from './OHIFLabellingData.js';

export default class LabellingFlow extends Component {
  static propTypes = {
    measurementData: PropTypes.object.isRequired,
    labellingDoneCallback: PropTypes.func.isRequired,
    updateLabelling: PropTypes.func.isRequired,
    initialTopDistance: PropTypes.number,
    skipAddLabelButton: PropTypes.bool,
    editLocation: PropTypes.bool,
    editDescription: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    const { location, locationLabel, description } = props.measurementData;

    this.state = {
      location,
      locationLabel,
      description,
      skipAddLabelButton: props.skipAddLabelButton,
      editDescription: props.editDescription,
      editLocation: props.editLocation,
      confirmationState: false,
      displayComponent: true,
    };

    this.mainElement = React.createRef();
    this.descriptionInput = React.createRef();
    this.initialItems = OHIFLabellingData;
    this.currentItems = cloneDeep(this.initialItems);
  }

  componentDidUpdate = () => {
    if (this.state.editDescription) {
      this.descriptionInput.current.focus();
    }
  };

  render() {
    let mainElementClassName = 'labellingComponent';
    if (this.state.editDescription) {
      mainElementClassName += ' editDescription';
    }

    return (
      <LabellingTransition
        displayComponent={this.state.displayComponent}
        onTransitionExit={this.props.labellingDoneCallback}
      >
        <>
          <div
            className={mainElementClassName}
            ref={this.mainElement}
            onMouseLeave={this.fadeOutAndLeave}
            onMouseEnter={this.clearFadeOutTimer}
          >
            {this.labellingStateFragment()}
          </div>
        </>
      </LabellingTransition>
    );
  }

  labellingStateFragment = () => {
    const {
      skipAddLabelButton,
      editLocation,
      description,
      locationLabel,
    } = this.state;

    if (!skipAddLabelButton) {
      return (
        <>
          <button
            type="button"
            className="addLabelButton"
            onClick={this.showLabelling}
          >
            {this.state.location ? 'Edit' : 'Add'} Label
          </button>
        </>
      );
    } else {
      if (editLocation) {
        return (
          <SelectTree
            items={this.currentItems}
            columns={1}
            onSelected={this.selectTreeSelectCallback}
            selectTreeFirstTitle="Assign Label"
          />
        );
      } else {
        return (
          <>
            <div
              className="checkIconWrapper"
              onClick={this.fadeOutAndLeaveFast}
            >
              <Icon name="check" className="checkIcon" />
            </div>
            <div className="locationDescriptionWrapper">
              <div className="location">{locationLabel}</div>
              <div className="description">
                <input
                  id="descriptionInput"
                  ref={this.descriptionInput}
                  defaultValue={description || ''}
                  autoComplete="off"
                  onKeyPress={this.handleKeyPress}
                />
              </div>
            </div>
            <div className="commonButtons">
              <button
                type="button"
                className="commonButton left"
                onClick={this.relabel}
              >
                Relabel
              </button>
              <button
                type="button"
                className="commonButton right"
                onClick={this.setDescriptionUpdateMode}
              >
                {description ? 'Edit ' : 'Add '}
                Description
              </button>
            </div>
            <div className="editDescriptionButtons">
              <button
                type="button"
                className="commonButton left"
                onClick={this.descriptionCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="commonButton right"
                onClick={this.descriptionSave}
              >
                Save
              </button>
            </div>
          </>
        );
      }
    }
  };

  relabel = event => this.setState({ editLocation: true });

  setDescriptionUpdateMode = () => {
    this.descriptionInput.current.focus();
    this.setState({ editDescription: true });
  };

  descriptionCancel = () => {
    const { description = '' } = cloneDeep(this.state);
    this.descriptionInput.current.value = description;
    this.setState({ editDescription: false });
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.descriptionSave();
    }
  };

  descriptionSave = () => {
    const description = this.descriptionInput.current.value;
    this.props.updateLabelling({ description });

    this.setState({
      description,
      editDescription: false,
    });
  };

  selectTreeSelectCallback = (event, itemSelected) => {
    const location = itemSelected.value;
    this.props.updateLabelling({ location });

    this.setState({
      editLocation: false,
      confirmationState: true,
      location: itemSelected.value,
      locationLabel: itemSelected.label,
    });

    if (this.isTouchScreen) {
      this.setTimeout = setTimeout(() => {
        this.setState({
          displayComponent: false,
        });
      }, 2000);
    }
  };

  showLabelling = () => {
    this.setState({
      skipAddLabelButton: true,
      editLocation: false,
    });
  };

  fadeOutAndLeave = () => {
    // Wait for 1 sec to dismiss the labelling component
    this.fadeOutTimer = setTimeout(
      () => this.setState({ displayComponent: false }),
      1000
    );
  };

  fadeOutAndLeaveFast = () => this.setState({ displayComponent: false });

  clearFadeOutTimer = () => {
    if (!this.fadeOutTimer) {
      return;
    }

    clearTimeout(this.fadeOutTimer);
  };
}
