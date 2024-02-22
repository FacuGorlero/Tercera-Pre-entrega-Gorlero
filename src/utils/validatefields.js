const {CustomError} = require('./error.js');

// Define una función llamada validateFields
const validateFields = (fields, requiredFields) => {
    // Arreglo para almacenar los campos faltantes
    const missingFields = [];
    
    // Objeto para almacenar los campos presentes y sus valores
    const correctObject = {};
  
    // Itera sobre los campos requeridos
    for (const field of requiredFields) {
      // Verifica si el campo está presente en los campos proporcionados
      if (!fields[field]) {
        // Si el campo está ausente, agrégalo a la lista de campos faltantes
        missingFields.push(field);
      } else {
        // Si el campo está presente, agrégalo al objeto correctObject con su valor
        correctObject[field] = fields[field];
      }
    }
  
    // Si hay campos faltantes, lanza un error utilizando la clase CustomError
    if (missingFields.length > 0) {
      throw new CustomError(
        `ERROR: Debe completar los siguientes campos: ${missingFields.join(', ')}`, );
    }
    // Devuelve el objeto con los campos presentes y sus valores
    return correctObject;
  };
  
  // Exporta la función validateFields como módulo
  module.exports= {validateFields}