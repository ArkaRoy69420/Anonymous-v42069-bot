module.exports = (p, q) => {
    const range = q - (p + 1);
    const randomNumber = Math.floor(Math.random() * range + p);
    return randomNumber;
};