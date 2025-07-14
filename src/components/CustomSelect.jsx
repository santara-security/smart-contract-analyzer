'use client';

import React, { useState, useRef, useEffect } from 'react';

export const CustomSelect = ({ options, value, onChange, placeholder = "Select an option" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(placeholder);
  const selectRef = useRef(null);

  useEffect(() => {
    const selectedOption = options.find(option => option.value === value);
    if (selectedOption) {
      setSelectedLabel(selectedOption.label);
    } else {
      setSelectedLabel(placeholder);
    }
  }, [value, options, placeholder]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectRef]);

  const handleOptionClick = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-neutral-200 leading-tight focus:outline-none focus:shadow-outline bg-neutral-800/50 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedLabel}
      </button>
      {isOpen && (
        <ul className="absolute z-10 w-full bg-neutral-800 border border-neutral-700 rounded mt-1 max-h-60 overflow-auto">
          {options.map((option) => (
            <li
              key={option.value}
              className="px-3 py-2 cursor-pointer hover:bg-neutral-700 text-neutral-200"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
