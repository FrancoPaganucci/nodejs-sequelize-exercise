const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');

// instancia de Express (¿Cómo organizar mejor las carpetas y los archivos, de forma más modular?)
const server = express();
const db = require('./database/db');
const Banda = require('./database/models/Banda');
const PORT = 3000;

// middlewares
server.use(helmet());
server.use(express.json());
server.use(compression());
server.use(cors());


// ========= ROUTING =========

// ========= LOGIN ==========

// ========= GET (READ - CRUD) =========
server.get('/bandas', async (req,res) => {
    // Try catch porque la lectura de la bd puede fallar
    try {
        const bandas = await db.query('SELECT * FROM bandas', {
            type: db.QueryTypes.SELECT
        });

        res.json(bandas)
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error : 'error intente más tarde'})
    };

    // ESTO ES LO QUE ANTES HICIMOS CON SQL DIRECTAMENTE MÁS ARRIBA
    /*Banda.findAll().then(bandas => {
        res.json(bandas);
    }).catch(error => {
        res.send(error.message);
    });*/

    /*db.query('SELECT * FROM canciones',
        { type: sequelize.QueryTypes.SELECT }
    ).then(function(resultados) {
        res.send(resultados);
    })*/
});

// buscar una banda por id USANDO REPLACEMENTS PARA EVITAR SQL INJECTION ATTACKS
server.get('/bandas/:id', async (req,res) => {
    // Try catch porque la lectura de la bd puede fallar
    try {
        const banda = await db.query('SELECT * FROM bandas where id=:idParam', {
            replacements: { idParam: req.params.id },
            type: db.QueryTypes.SELECT
        });

        res.json(banda)
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error : 'error intente más tarde'})
    };
});

//========= POST (CREATE - CRUD) =========
server.post('/bandas', async (req,res) => {

    try {
        const nueva_banda = await db.query(
        `
        INSERT INTO bandas (nombre, integrantes, fecha_inicio, fecha_separacion, pais)
        VALUES (:nombre, :integrantes, :fechaInicio, :fechaSeparacion, :pais)
        `, 
        {
            replacements: {
                nombre: req.body.nombre,
                integrantes: req.body.integrantes,
                fechaInicio: req.body.fechaInicio,
                fechaSeparacion: req.body.fechaSeparacion,
                pais: req.body.pais,
            },
            type: db.QueryTypes.INSERT,
        })
        res.json(nueva_banda);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error : 'error intente más tarde'})
    }

    // ESTO ES LO QUE ANTES HICIMOS CON SQL DIRECTAMENTE MÁS ARRIBA
    /*Banda.create({
        nombre: "Arctic Monkeys",
        integrantes: 4,
        fecha_inicio: new Date(2002, 06, 05),
        fecha_separacion: "",
        pais: "Inglaterra"
    }).then(banda => {
        res.json({banda})
    });*/
})


// ========= PUT (UPDATE - CRUD) ============





// ========= DELETE (DELETE - CRUD) ============ 



// =======================================
// ======= Inicializar el SERVIDOR =======
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);

    // Conectarse a la base de datos cuando levanta el servidor
    // force true: DROP TABLES (no queremos que reinicie las tablas constantemente!)
    db.sync({ force: false }).then(() => {
        console.log("Succesfully connected to database");
    }).catch(error => {
        console.log("Se ha producido un error: " + error);
    });
});
