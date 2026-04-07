// common success sender with all info
export const sendSuccess = async (res: any, data: any, message?: string) => {
  return res.status(200).json({ data, message, status: "success" });
};

// common error sender with all info
export const sendError = async (
  res: any,
  message: any,
  stateCode: number = 500,
  error?: any
) => {
  return res
    .status(stateCode)
    .json({ message: message, error, status: "error" });
};
