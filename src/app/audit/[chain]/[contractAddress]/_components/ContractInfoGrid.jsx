"use client";
import React from "react";
import { ContractDetails } from "./ContractDetails";
import { AnalysisStatus } from "./AnalysisStatus";

export const ContractInfoGrid = ({ 
  chain, 
  contractAddress, 
  auditLoading, 
  error, 
  analysisData,
  analysisSummary,
  analysisScore,
  honeyPot,
  honeyPotLoading
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ContractDetails chain={chain} contractAddress={contractAddress} />
      <AnalysisStatus 
        error={error} 
        analysisData={analysisData} 
        analysisSummary={analysisSummary}
        analysisScore={analysisScore}
        auditLoading={auditLoading}
        honeyPot={honeyPot}
        honeyPotLoading={honeyPotLoading}
      />
    </div>
  );
};
