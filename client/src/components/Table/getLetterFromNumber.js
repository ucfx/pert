function getLetterFromNumber(number) {
    let result = "";
    const baseCharCode = "A".charCodeAt(0);

    while (number > 0) {
        const remainder = (number - 1) % 26;
        result = String.fromCharCode(baseCharCode + remainder) + result;
        number = Math.floor((number - 1) / 26);
    }

    return result;
}

export default getLetterFromNumber;
