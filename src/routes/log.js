const user = require('../models/user');
const jwt = require('jsonwebtoken');
const moment = require('moment');

module.exports = function (app) {
    app.post('/log', (req, res) => {
        var puesto = "";
        var pass = "";
        var username = "";
        var name = "";
        var user_req = req.body.Username;
        //console.log(user_req);
        var encontrado;
        user.getUserByAdminUsername(user_req, (err, data) => {
            if (err){
                res.status(500).send({message: 'Error al comprobar usuario'});
            }else{
                var array = data[0];
                if (!array || array.length <= 0 ) {
                    user.getUserByAsistantUsername(user_req, (err, data) => {
                        if (err) {
                            res.status(500).send({message: 'Error al comprobar usuario'});
                        } else {
                            var array = data[0];
                            if (!array || array.length <= 0 ) {
                                user.getUserByMedicUsername(user_req, (err, data) => {
                                    if (err){
                                        res.status(500).send({message: 'Error al comprobar usuario'});
                                    }else{
                                        var array = data[0];
                                        if (!array || array.length <= 0 ) {
                                            encontrado = false;
                                            res.json({ 
                                                success: false,
                                                message: 'El usuario indicado no existe',
                                            });
                                        } else {
                                            puesto = "Médico";
                                            pass = data[0].password;
                                            username = data[0].username;
                                            name = data[0].name; 
                                            id_medico = data[0].id_medico;
                                            permisos = data[0].permisos
                                            if (pass != req.body.Password) {
                                                res.json({ 
                                                    success: false,
                                                    message: 'La contraseña indicada no es correcta',
                                                });
                                            } else{
                                                const payload = {
                                                    puesto: puesto,
                                                    username: username,
                                                };
                                                var token = jwt.sign(payload, app.get('secret'), {
                                                    expiresIn: '10080m' // expires in half an hour
                                                });
                                                var expiraEn = new Date();
                                                expiraEn.setMinutes(expiraEn.getMinutes() + 10080);
                                                res.json({
                                                    success: true,
                                                    message: 'Bienvenido',
                                                    puesto: puesto,
                                                    username: name,
                                                    expiresIn: expiraEn,
                                                    token: token,
                                                    id: id_medico,
                                                    permisos
                                                });
                                            }
                                        }
                                    }
                                });
                            } else {
                                puesto = "Asistente";
                                console.log(data[0]);
                                pass = data[0].password;
                                username = data[0].password;
                                name = data[0].name; 
                                id = data[0].id_asistente;
                                permisos = data[0].permisos;
                                if (pass != req.body.Password) {
                                    res.json({ 
                                        success: false,
                                        message: 'La contraseña indicada no es correcta',
                                    });
                                } else{
                                    const payload = {
                                        puesto: puesto,
                                        username: username,
                                    };
                                    var token = jwt.sign(payload, app.get('secret'), {
                                        expiresIn: '10080m' // expires in half an hour
                                    });
                                    var expiraEn = new Date();
                                    expiraEn.setMinutes(expiraEn.getMinutes() + 10080);
                                    res.json({
                                        success: true,
                                        message: 'Bienvenido',
                                        puesto: puesto,
                                        username: name,
                                        expiresIn: expiraEn,
                                        token: token,
                                        id: id,
                                        permisos: permisos
                                    });
                                }
                            }
                        }
                    });
                    
                } else {
                    puesto = "Administrador";
                    pass = data[0].password;
                    username = data[0].password;
                    name = data[0].name; 
                    if (pass != req.body.Password) {
                        res.json({ 
                            success: false,
                            message: 'La contraseña indicada no es correcta',
                        });
                    } else{
                        const payload = {
                            puesto: puesto,
                            username: username,
                        };
                        var token = jwt.sign(payload, app.get('secret'), {
                            expiresIn: '10080m' // expires in half an hour
                        });
                        var expiraEn = new Date();
                        expiraEn.setMinutes(expiraEn.getMinutes() + 10080);
                        res.json({
                            success: true,
                            message: 'Bienvenido',
                            puesto: puesto,
                            username: name,
                            expiresIn: expiraEn,
                            token: token,
                        });
                    }
                }
            }
        });
    });

    


    //LOGIN DE CLIENTE MOVILE APP
    app.post('/logM', (req, res) => {
        user.getUserByUsername(req.body.Username, (err, data) => {
            if (err){
                res.status(500).send({message: 'Error al comprobar usuario'});
            }else{
                var array = data[0];
                if (!array || array.length <= 0 ) {
                    //res.json({ success: false, message: 'Authentication failed. User not found.' });
                    res.json({ 
                        success: false,
                        message: 'El usuario indicado no existe',
                    });
                } else if (data) {
                    if (data[0].password != req.body.Password) {
                        res.json({ 
                            success: false,
                            message: 'La contraseña indicada no es correcta',
                        });
                    } else{
                        if (data[0].webApp != '1'){
                            res.json({ 
                                success: false,
                                message: 'El usuario no tiene permisos para acceder a este sitio.',
                            });
                        }else{
                            const payload = {
                                idUsuario: data[0].id_user,
                                username: data[0].username,
                                idEmpresa: data[0].id_empresa,
                                Empresa: data[0].nombre_empresa,
                            };
                            var token = jwt.sign(payload, app.get('secret'), {
                                //expiresIn: '10080m' // expires in half an hour
                            });
                            var expiraEn = new Date();
                            expiraEn.setMinutes(expiraEn.getMinutes() + 10080);
                            res.json({
                                success: true,
                                message: 'Bienvenido',
                                empresa: data[0].empresa,
                                username: data[0].username,
                                expiresIn: expiraEn,
                                token: token,
                                Dominio: data[0].dominio,
                            });
                        }
                    }
                }
            }
        });
    });

}