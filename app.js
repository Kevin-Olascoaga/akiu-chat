var express = require('express');
var app = express();

app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});
var io = require('socket.io')(server);
var fs = require('fs');

//var nombres = fs.readFileSync('chats/namespaces.txt');
var nombres = ['AddNamespaces','Frida-Luis', 'Frida-Kevin', 'Frida-Favian', 'Frida-Uriel'];
var namespaces = [];
var path = [];
var file = JSON.parse('[]');
console.log(nombres);

app.use(express.static(__dirname));

for (let i = 0; i < nombres.length; i++) {
    path[i] = 'chats/' + nombres[i] + '.txt';
    namespaces[i] = io.of('/' + nombres[i]);
    console.log(nombres[i]);

    namespaces[i].on('connection', function (socket) {

        console.log(socket.id);

        fs.open(path[i],'a',function(err, fd){
            if (err) {
                console.log("Se creo el archivo " + path[i]);
            } else {
                console.log("Ya existe el archivo");

                file = JSON.parse('[' + fs.readFileSync(path[i], function(err) {
                    console.log(err);
                }) + ']');

                if (file.length == 0){
                    console.log('vacio');
                };
                namespaces[i].emit('refresh', file);
            }
        });

        socket.on('chat message', function (msg) {
            var data = JSON.parse(msg);
            console.log(msg + ' data: ' + data[1]);
            namespaces[i].emit('chat message', msg);
            console.log('message ' + nombres[i] + ': ' + msg);
            file = JSON.parse('[' + fs.readFileSync(path[i], function(err) {
                    console.log(err);
                }) + ']');
            if (file.length == 0){
                fs.appendFile(path[i], msg, function(err) {
                    if(err) {
                        console.log('error: ' + err);
                    }
                });
            }else {
                fs.appendFile(path[i], ',' + msg, function(err) {
                    if(err) {
                        console.log('error: ' + err);
                    }
                });
            };
        });

        socket.on('AddNamespaces', function(nspc) {
            nombres.push(nspc);
            fs.appendFile('chats/namespaces.txt', msg, function(err) {
                    if(err) {
                        console.log('error: ' + err);
                    }
                });
            console.log('New namespace: ' + msg);
            console.log('All: ' + nombres);
        });

    });


}

// /* Server */
// http.listen(3000, function () {
//     console.log('listening on *:3000');
// });
