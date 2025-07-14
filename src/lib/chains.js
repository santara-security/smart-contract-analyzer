import chainsData from "./chains.json";

const allowList = ["base"];
const chains = chainsData.chains.filter((chain) =>
  allowList.includes(chain.name)
);

export { chains };
export default chains;
