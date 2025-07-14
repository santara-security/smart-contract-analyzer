import axios from "axios";
import { getContractContentList } from "./helpers";
import fs from "fs/promises";
import path from "path";

const results = (success = true, data = {}) => {
  return {
    success: success,
    ...data,
  };
};

const downloadContract = () => {
  var zip = new JSZip();
  for (const contractContent of contract.contents) {
    zip.file(contractContent.path, contractContent.content);
  }
  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, `contract_${contract.address}.zip`);
  });
};

const fetchContract = async (contractAddress, chainInfo) => {
  try {
    const result = await axios.get(
      `https://api.etherscan.io/v2/api?chainid=${chainInfo.id}&module=contract&action=getsourcecode&address=${contractAddress}&apikey=NCUY8QN5NU14K513XD4D6KN6DCU63B6NAR`
    );

    const sourceCodes = result.data.result;
    if (sourceCodes === "Invalid API Key") {
      return results(false, { message: "Invalid API Key" });
    }
    if (sourceCodes[0].SourceCode === "") {
      return results(false, {
        message: "No source code found for this contract",
      });
    }
    
    const contractContents = getContractContentList(
      sourceCodes,
      chainInfo.name
    );
    
    // Save each contract file individually
    const uploadDir = path.join(process.cwd(), "uploads", contractAddress);
    await fs.mkdir(uploadDir, { recursive: true });
    console.log(contractContents);

    // Save each file separately
    for (const content of contractContents) {
      // Ensure the directory structure exists for nested files
      const fullFilePath = path.join(uploadDir, content.path);
      const fileDir = path.dirname(fullFilePath);
      
      await fs.mkdir(fileDir, { recursive: true });
      await fs.writeFile(fullFilePath, content.content);
    }

    return results(true, {
      uploadDir: `/uploads/${contractAddress}/`,
      contractContents: sourceCodes,
      savedFiles: contractContents.map(content => content.path)
    });

    // return results(true, {
    //   status: "success",
    //   filePath: `/uploads/${fileName}`,
    //   contractContents
    // });
  } catch (e) {
    console.error(e);
    return results(false, { message: "unknown error" });
  }
};

export default fetchContract;
