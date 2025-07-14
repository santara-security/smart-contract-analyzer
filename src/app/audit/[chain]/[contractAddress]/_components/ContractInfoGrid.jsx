"use client";
import React from "react";
import { ContractDetails } from "./ContractDetails";
import { AnalysisStatus } from "./AnalysisStatus";

export const ContractInfoGrid = ({ 
  chain, 
  contractAddress, 
  loading, 
  error, 
  analysisData 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ContractDetails chain={chain} contractAddress={contractAddress} />
      <AnalysisStatus 
        loading={loading} 
        error={error} 
        analysisData={analysisData} 
      />
    </div>
  );
};
