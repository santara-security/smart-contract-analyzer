import chainsData from "./chains.json";

const allowList = ["base", "bsc", "ethereum"];
const formattedChains = Array.from(chainsData.chains.filter( d => typeof d !== 'undefined'));
const chains = (formattedChains || formattedChains || [])?.filter(chain => allowList.includes(chain.name));

export { chains };
export default chains;