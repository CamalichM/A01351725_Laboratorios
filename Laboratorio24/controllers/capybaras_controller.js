const path = require('path');
const Capybara = require('../models/capybara');
const User = require('../models/user');

exports.cerveza = (request, response, next) => {
    response.sendFile(path.join(__dirname, '..', 'views', 'cerveza_view.html'));
};

exports.get_cambio = (request, response, next) => {
    console.log('GET /capybaras/cambio');
    response.render('cambio', {
        username: request.session.username ? request.session.username : '',
        info: ''
    }); 
};

exports.post_cambio = (request, response, next) => {
    console.log('POST /capybaras/cambio');
    console.log(request.body);
    const capybara = new Capybara(request.body.nombre, request.body.descripcion, request.body.imagen);
    capybara.delete(request.body.id);
    capybara.change(request.body.id)
    .then(() => {
        request.session.info = capybara.nombre + ' fue registrado con éxito';
        response.redirect('/capybaras');
    })
    .catch(err => console.log(err));
};

exports.get_nuevo = (request, response, next) => {
    console.log('GET /capybaras/nuevo');
    User.fetchAll()
        .then(([usuarios,fielData])=>{
            response.render('nuevo', {
                username: request.session.username ? request.session.username : '',
                info: '',
                usuarios: usuarios,
            });
        }).catch((error)=>{
            console.log(error);
        });
};

exports.post_nuevo = (request, response, next) => {
    console.log('POST /capybaras/nuevo');
    console.log(request.body);
    console.log(request.file);
    const capybara = 
        new Capybara(
            request.body.nombre, request.body.descripcion, 
            request.file.filename, request.body.duenio_id);
    capybara.save()
        .then(() => {
            request.session.info = capybara.nombre + ' fue registrado con éxito';
            response.setHeader('Set-Cookie', 
                'ultimo_capybara='+capybara.nombre+'; HttpOnly');
            response.redirect('/capybaras');
        })
        .catch(err => console.log(err));
};

exports.listar = (request, response, next) => {
    console.log('Ruta /capybaras');
    //console.log(request.get('Cookie').split('=')[1]);
    console.log(request.cookies);
    const info = request.session.info ? request.session.info : '';
    request.session.info = '';
    Capybara.fetchAll()
        .then(([rows, fieldData]) => {
            console.log(rows);
            response.render('lista', {
                capybaras: rows,
                username: request.session.username ? request.session.username : '',
                ultimo_capybara: request.cookies.ultimo_capybara ? request.cookies.ultimo_capybara : '',
                info: info //El primer info es la variable del template, el segundo la constante creada arriba
            }); 
        })
        .catch(err => {
            console.log(err);
        }); 
}

exports.filtrar = (request, response, next) => {
    console.log(request.params.capybara_id);
    //console.log(request.get('Cookie').split('=')[1]);
    console.log(request.cookies);
    const info = request.session.info ? request.session.info : '';
    request.session.info = '';
    Capybara.fetchOne(request.params.capybara_id)
        .then(([rows, fieldData]) => {
            console.log(rows);
            response.render('lista', {
                capybaras: rows,
                username: request.session.username ? request.session.username : '',
                ultimo_capybara: request.cookies.ultimo_capybara ? request.cookies.ultimo_capybara : '',
                info: info //El primer info es la variable del template, el segundo la constante creada arriba
            }); 
        })
        .catch(err => {
            console.log(err);
        }); 
}

exports.buscar = (request, response, next) => {
    console.log(request.params.valor);
    Capybara.fetch(request.params.valor)
        .then(([rows, fieldData]) => {
            console.log(rows);
            response.status(200).json(rows);
        })
        .catch(err => {
            console.log(err);
        }); 
}
