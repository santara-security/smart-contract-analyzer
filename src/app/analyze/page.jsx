'use client';
import React from "react";
import { InputField } from "@/components/InputField";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { SelectField } from "@/components/SelectField";
import { chains } from "@/lib/chains";

export const InputToken = function InputToken() {
  // Add state management for form inputs here later
  const [tokenAddress, setTokenAddress] = React.useState("");
  const [chain, setChain] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Analyzing:", { tokenAddress, chain });
  };

  const chainOptions = chains.map((chain) => ({
    value: chain.name,
    label: chain.name.charAt(0).toUpperCase() + chain.name.slice(1),
  }));

  return (
    <div className="bg-transparent z-10 flex flex-col md:flex-row px-8 py-12 gap-8 mt-16 max-w-7xl mx-auto">
      <section className="w-full md:flex-3 md:w-3/4">
        <Card title="Input Token Address to Analyze">
          {/* Add form elements */}
          {/* Wrap form with onSubmit handler if needed */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <InputField
              label="Token Address"
              id="tokenAddress"
              type="text"
              placeholder="Enter token address (e.g., 0x...)"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
            />

            {/* Replace InputField with SelectField for Chain */}
            <SelectField
              label="Chain"
              id="chain"
              options={chainOptions}
              value={chain}
              onChange={(value) => setChain(value)}
            />

            <div className="flex items-center justify-between">
              <Button type="submit">Analyze Token</Button>
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
};

export default InputToken;
