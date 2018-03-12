let errors = { fromStation: [], toStation: [], date: [] };

export const validateFromStation = (fromStation) => {
    errors.fromStation = [];
    if (fromStation === '' || fromStation === undefined) {
        errors.fromStation.push('From station field is required!')
    }
    return errors;
}

export const validateToStation = (toStation) => {
    errors.toStation = [];
    if (toStation === '' || toStation === undefined) {
        errors.toStation.push('To station field is required!')
    }
    return errors;
}

export const validateDate = (date) => {
    errors.date = [];
    if (date === '' || date === undefined) {
        errors.date.push('date field is required!')
    }
    return errors;
}