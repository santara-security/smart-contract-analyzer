"use client";

import React from "react";

export const InputField = ({
  label,
  id,
  type,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-neutral-300 text-sm font-bold mb-2 "
      >
        {label}:
      </label>
      <input
        type={type}
        id={id}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-neutral-800/50"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputField;
