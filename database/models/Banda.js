const { Model, DataTypes } = require('sequelize');
const sequelize =  require('../db');

class Banda extends Model {}
Banda.init({
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'nombre'
    },
    integrantes: DataTypes.INTEGER,
    fecha_inicio: DataTypes.DATE,
    fecha_separacion: DataTypes.DATE,
    pais: DataTypes.STRING
}, {
    modelName: "banda",
    tableName: "bandas",
    sequelize,
    timestamps: false
})

module.exports = Banda;