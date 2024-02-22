class CustomError extends Error {
  constructor(message) {
    super(message);
    this.error = message;
  }
}
  // Exporta la clase CustomError como módulo
module.exports = {CustomError}
  