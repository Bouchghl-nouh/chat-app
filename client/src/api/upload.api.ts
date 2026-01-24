import axios from "axios";

export const uploadFileToUrl = async (uploadUrl: string, file: File) => {
  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type, 
    },
  });
};
