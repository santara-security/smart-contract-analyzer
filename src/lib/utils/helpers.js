const isSingleFileContract = (sourceCode) => {
  return (
    sourceCode.indexOf("pragma") === 0 ||
    sourceCode.indexOf("//") === 0 ||
    sourceCode.indexOf("\r\n") === 0 ||
    sourceCode.indexOf("/*") === 0
  );
};

const isSymbolObject = (network) => {
  return network.indexOf("bsc") >= 0;
};

const isJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

const parseSourceCodeObject = (sourceCode, network) => {
  if (isSymbolObject(network)) {
    const doubleCurlyBracesPattern = /^[{]{2}(.|\r\n)*[}]{2}$/gm;
    if (doubleCurlyBracesPattern.test(sourceCode)) {
      sourceCode = sourceCode.substring(1, sourceCode.length - 1);
      return JSON.parse(sourceCode).sources;
    }
    return JSON.parse(sourceCode);
  } else if (isJsonString(sourceCode)) {
    return JSON.parse(sourceCode);
  }
  return JSON.parse(sourceCode.substr(1, sourceCode.length - 2));
};

const getSourcesObject = (parsedSourceCode, network) => {
  if (isSymbolObject(network)) return Object.entries(parsedSourceCode);
  if (parsedSourceCode.hasOwnProperty("sources")) {
    return Object.entries(parsedSourceCode.sources);
  }
  return Object.entries(parsedSourceCode);
};

export const getContractContentList = (sourceCodes, network) => {
  const contractContent = [];
  for (const sourceCode of sourceCodes) {
    if (isSingleFileContract(sourceCode.SourceCode)) {
      contractContent.push({
        path: "contract.sol",
        content: sourceCode.SourceCode,
      });
    } else {
      const parsedSourceCode = parseSourceCodeObject(
        sourceCode.SourceCode,
        network
      );
      const sourceObjects = getSourcesObject(parsedSourceCode, network).map(
        (sourceObject) => {
          return {
            path: sourceObject[0],
            content: sourceObject[1].content,
          };
        }
      );
      contractContent.push(...sourceObjects);
    }
  }
  return contractContent;
};

export const copyToClipboard = (data) => {
  navigator.clipboard.writeText(data);
};

export const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export const formatTax = (tax) => {
  if (!tax || tax === 0) return "0";
  // Round up to nearest whole number if close to whole number
  const numTax = parseFloat(tax);
  if (numTax > 0.999 && numTax < 1.001) return "1";
  if (numTax > 1.999 && numTax < 2.001) return "2";
  if (numTax > 2.999 && numTax < 3.001) return "3";
  // For other cases, round to 2 decimal places
  return numTax.toFixed(2);
};