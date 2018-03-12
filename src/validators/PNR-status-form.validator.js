let errors = { PNRNumber: [] };

export const validatePNRNumber = (pnr) => {
    errors.PNRNumber = [];
    if (pnr === '') {
        errors.PNRNumber.push('PNR number field is required!')
    }
    return errors;
}