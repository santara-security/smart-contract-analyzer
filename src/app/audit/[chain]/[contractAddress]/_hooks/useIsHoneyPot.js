"use client";
import { useState, useEffect, useCallback } from "react";

const fetchOnchainData = async (contractAddress, pair) => {
  if (!contractAddress || !pair) {
    throw new Error("Invalid contract address or pairs");
  }

  const honeyPot = fetch(
    `/api/honeypot/is_honey_pot?tokenAddress=${contractAddress}&pair=${pair.address}&chain=${pair.chain}`
  );
  const topHolders = fetch(
    `/api/honeypot/top_holders?tokenAddress=${contractAddress}&chain=${pair.chain}`
  );

  const [honeyPotResponse, topHoldersResponse] = await Promise.all([
    honeyPot,
    topHolders,
  ]);

  const [honeyPotData, topHoldersData] = await Promise.all([
    honeyPotResponse.json(),
    topHoldersResponse.json(),
  ]);

  return {
    honeyPot: honeyPotData,
    topHolders: topHoldersData,
  };
};

export const useIsHoneyPot = (chain, contractAddress) => {
  const [honeypotPairs, setHoneypotPairs] = useState(null);
  const [honeypotTopHolders, setHoneypotTopHolders] = useState(null);
  const [honeyPot, setHoneypot] = useState([]);
  const [loadingHoneypot, setLoadingHoneypot] = useState(false);
  const [errorHoneypot, setErrorHoneypot] = useState(null);

  const fetchTokenInfo = useCallback(async () => {
    if (!chain || !contractAddress) return;
    console.log("Fetching honeypot pairs for:", contractAddress, "on chain:", chain);

    setLoadingHoneypot(true);
    setErrorHoneypot(null);

    try {
      const response = await fetch(
        `/api/honeypot/getpairs?tokenAddress=${contractAddress}&chain=${chain}`
      );
      const resp = await response.json();

      if (!response.ok) {
        setErrorHoneypot("No pairs found for this token.");
        throw new Error(resp.error || "Failed to fetch token information");
      }

      if(resp && resp.hasOwnProperty('error')) {
        console.log('has error');
        setErrorHoneypot(resp.error);
        return;
      }

      setHoneypotPairs(resp);
      const firstPairAddress =
        resp && resp[0] && resp[0].Pair ? resp[0].Pair.Address : undefined;

      console.log("First pair address:", firstPairAddress);
      if (firstPairAddress === undefined) {
        setErrorHoneypot("No pairs found for this token.");
        return;
      }
      const onchainData = await fetchOnchainData(contractAddress, {
        address: firstPairAddress,
        chain: chain,
      });
      setHoneypot([
        {
          ...onchainData.honeyPot,
          pairAddress: firstPairAddress,
        },
      ]);
      setHoneypotTopHolders(onchainData.topHolders);
    } catch (err) {
      setErrorHoneypot(err.message);
    } finally {
      setLoadingHoneypot(false);
    }
  }, [chain, contractAddress]);

  useEffect(() => {
    fetchTokenInfo();
  }, [fetchTokenInfo]);

  const checkHoneypotWithPair = useCallback(
    async (pairAddress) => {
      if (!contractAddress || !pairAddress || !chain) {
        throw new Error(
          "Missing required parameters: contractAddress, pairAddress, or chain"
        );
      }

      setErrorHoneypot(null);

      try {
        const onchainData = await fetchOnchainData(contractAddress, {
          address: pairAddress,
          chain: chain,
        });

        const newHoneypotData = {
          ...onchainData.honeyPot,
          pairAddress: pairAddress,
        };

        // Check if this pair already exists in the array
        setHoneypot((prevHoneypot) => {
          const existingIndex = prevHoneypot.findIndex(
            (item) => item.pairAddress === pairAddress
          );
          if (existingIndex !== -1) {
            // Update existing entry
            const updated = [...prevHoneypot];
            updated[existingIndex] = newHoneypotData;
            return updated;
          } else {
            // Add new entry
            return [...prevHoneypot, newHoneypotData];
          }
        });

        return newHoneypotData;
      } catch (err) {
        setErrorHoneypot(err.message);
        throw err;
      } finally {
        setLoadingHoneypot(false);
      }
    },
    [contractAddress, chain]
  );

  const retryHoneypot = useCallback(() => {
    setLoadingHoneypot(true);
    fetchTokenInfo();
  }, [fetchTokenInfo]);

  return {
    honeypotPairs,
    honeypotTopHolders,
    honeyPot,
    loadingHoneypot,
    errorHoneypot,
    retryHoneypot,
    checkHoneypotWithPair,
  };
};
