export const calculateAverage = (values) => {
  if (!values || values.length === 0) return 0;
  
  // Ensure all values are numbers
  const numericValues = values.map(v => parseFloat(v)).filter(v => !isNaN(v));
  
  if (numericValues.length === 0) return 0;

  const sum = numericValues.reduce((acc, curr) => acc + curr, 0);
  return Number((sum / numericValues.length).toFixed(2));
};

export const checkInversion = (initialMoisture, pertenMoisture) => {
  const initial = parseFloat(initialMoisture);
  const perten = parseFloat(pertenMoisture);

  if (isNaN(initial) || isNaN(perten)) {
    return {
      allowed: false,
      reason: 'invalid_input',
      target: 0,
      limit: 0
    };
  }

  // Formula: (Initial + 12.5) / 2
  const targetInversionMoisture = (initial + 12.5) / 2;
  const limitMoisture = targetInversionMoisture + 2.5;

  // Rules
  // 1. Perten > 25% -> No
  if (perten > 25) {
    return {
      allowed: false,
      reason: 'perten_too_high',
      target: targetInversionMoisture,
      limit: limitMoisture
    };
  }

  // 2. Perten <= Limit AND Perten < 25 -> Yes
  // (The condition < 25 is redundant here but explicit in reqs)
  if (perten <= limitMoisture) {
    return {
      allowed: true,
      reason: 'within_limits',
      target: targetInversionMoisture,
      limit: limitMoisture
    };
  }

  // 3. Otherwise -> No
  return {
    allowed: false,
    reason: 'above_inversion_limit',
    target: targetInversionMoisture,
    limit: limitMoisture
  };
};
