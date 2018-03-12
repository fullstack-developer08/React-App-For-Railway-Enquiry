let errors = { date: [], trainNumber: [] };

export const validateDate = (date) => {
    errors.date = [];
    if (date === '' || date === undefined) {
        console.log(date);
        errors.date.push('date field is required!')
    }
    return errors;
}

export const validateTrainNumber = (trainNumber) => {
    errors.trainNumber = [];
    if (trainNumber === '') {
        errors.trainNumber.push('train number field is required!')
    }
    return errors;
}