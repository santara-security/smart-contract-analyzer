'use client';

import React from "react";
import { CustomSelect } from "./CustomSelect";

export const SelectField = ({ label, id, options, value, onChange, placeholder, ...rest }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-neutral-300 text-sm font-bold mb-2">
        {label}:
      </label>
      <CustomSelect
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};
