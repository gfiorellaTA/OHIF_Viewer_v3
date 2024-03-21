import React from 'react';
import { ButtonGroup, InputRange } from '../../components';

const SETTING_TYPES = {
  RANGE: 'range',
  RADIO: 'radio',
  CUSTOM: 'custom',
};

function ToolSettings({ options }) {
  if (!options) {
    return null;
  }

  const renderButtons = option => {
    return option.values?.map(({ label, value: optionValue }, index) => (
      <button
        onClick={() => {
          Array.isArray(option.onChange)
            ? option.onChange.forEach(fn => fn(optionValue))
            : option.onChange(optionValue);
        }}
        key={`button-${option.id}-${index}`}
      >
        {label}
      </button>
    ));
  };

  return (
    <div className="space-y-2 py-2 text-white">
      {options?.map(option => {
        if (option.type === SETTING_TYPES.RANGE) {
          return (
            <div
              className="flex items-center"
              key={option.id}
            >
              <div className="w-1/3 text-[13px]">{option.name}</div>
              <div className="w-2/3">
                <InputRange
                  minValue={option.min}
                  maxValue={option.max}
                  step={option.step}
                  value={option.value}
                  onChange={e =>
                    Array.isArray(option.onChange)
                      ? option.onChange.forEach(fn => fn(e.target.value))
                      : option.onChange(e.target.value)
                  }
                  allowNumberEdit={true}
                  showAdjustmentArrows={false}
                  inputClassName="ml-1 w-4/5 cursor-pointer"
                />
              </div>
            </div>
          );
        }

        if (option.type === SETTING_TYPES.RADIO) {
          return (
            <div
              className="flex items-center justify-between text-[13px]"
              key={option.id}
            >
              <span>{option.name}</span>
              <div className="max-w-1/2">
                <ButtonGroup
                  activeIndex={option.values.findIndex(({ value }) => value === option.value) || 0}
                >
                  {renderButtons(option)}
                </ButtonGroup>
              </div>
            </div>
          );
        }
        if (option.type === SETTING_TYPES.CUSTOM) {
          return (
            <div key={option.id}>
              {typeof option.children === 'function' ? option.children() : option.children}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export default ToolSettings;
