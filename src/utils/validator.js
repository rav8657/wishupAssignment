const regex=/^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/

const isValidStartDate =  (startDate) => {
  return regex.test(startDate)
}

const isValid = (value) => {
  if (typeof value === "undefined" || value === null) return false; 
  return true;
};


const isValidRequestBody = (requestBody) => {
  return Object.keys(requestBody).length > 0 };



const isValidPlanId =  (status) => {
  return ["FREE", "TRIAL", "LITE_1M", "PRO_1M", "LITE_6M", "PRO_6M"].indexOf(status) !== -1;
};



module.exports = {
  isValid,
  isValidRequestBody,
  isValidPlanId,
  isValidStartDate,

};