const pick = (
  invalidFields: Record<string, unknown>,
  validFields: string[]
) => {
  const result: Record<string, unknown> = {};
  const keys = Object.keys(invalidFields);
  validFields.map((value) => {
    const isValid = keys.includes(value);
    if (isValid) {
      result[value] =invalidFields[value]
    }
  });
  return result;
};


export default pick;





