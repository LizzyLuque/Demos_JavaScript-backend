//// Modelo usuario--Login para Mongoose 
var mongoose = require('mongoose');
// para la validación de que un campo sea único
var uniqueValidator = require('mongoose-unique-validator');


let usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
    }, email: {
        type: String,
        unique: true,
        required: [true, "El correo es necesario"],
    }, password: {
        type: String,
        required: [true, "Le contraseña es obligatoria"],
    },
});

usuarioSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password; return userObject;
}

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
})
module.exports = mongoose.model('User', usuarioSchema);