export const formatNumber = (num) => {
  if (!num) return "N/A";
  return new Intl.NumberFormat().format(num);
};

export const formatSupply = (supply, decimals) => {
  if (!supply || !decimals) return "N/A";
  const divisor = Math.pow(10, parseInt(decimals));
  const formatted = (BigInt(supply) / BigInt(divisor)).toString();
  return formatNumber(formatted);
};
