import { PrismaClient } from "@prisma/client";
import { getTokenWithBlockscout } from "src/app/api/token/route";

const prisma = new PrismaClient();

const getOrCreateToken = async (contractAddress, chain) => {
  const token = await prisma.token.findUnique({
    where: {
      address: contractAddress,
      chain: chain,
    },
  });

  if (token) return null;

  await getTokenWithBlockscout({
    tokenAddress: contractAddress,
    chain,
    successCallback: async (data) => {
      console.log(data);
      await prisma.token.create({
        data: {
          address: data.address,
          chain: chain,
          name: data.name,
          symbol: data.symbol,
        },
      });
    },
    errorCallback: (error) => {
      console.error("Error fetching token info:", error);
      throw error;
    },
  });
};

const Layout = (props) => {
  const { children, params } = props;
  setTimeout(async () => {
    const p = await params;
    await getOrCreateToken(p.contractAddress, p.chain);
  }, 2000);
  return <>{children}</>;
};

export default Layout;
