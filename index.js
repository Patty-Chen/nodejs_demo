const http = require('http');
const url = require('url');

const hostname = '127.0.0.1';
const port = 3000;
const userPath = '/user';

const server = http.createServer();

let users = [];
server.on('request',(req, res) => {
    console.log('request');
    const parsedUrl = url.parse(req.url,true);
    console.log(parsedUrl);
    if (parsedUrl.path.indexOf(userPath) === -1)
    {
        res.statusCode = 400;
        res.end('operation not defined');
        return;
    }
    switch (req.method){
        case 'GET':
            console.log('get');
            const userPathIndex = parsedUrl.path.indexOf(userPath + '/');
            if (userPathIndex !== -1){
                let userToQuery = parsedUrl.path.substring(userPathIndex + length(userPathIndex)+ 1);
                let userFound = users.find(u=>u.username === userToQuery);
                res.statusCode = 200;
                res.end(JSON.stringify(userFound));
                break;
            }
            if (parsedUrl.query.address){
                let usersFound = users.filter(u=> u.address === parsedUrl.query.address)
                res.statusCode = 200;
                res.end(JSON.stringify(usersFound));
                break;
            }
            res.statusCode = 200;
            res.end(JSON.stringify(users));
            break;

        case 'POST':
            console.log('post');
            req.on('data',(data)=>{
                if (req.headers['content-type'] === 'application/json'){
                    console.log('get json content');
                    let user = JSON.parse(data.toString());
                    console.log(user);
                    users.push(user);
                }
            });
            req.on('end',()=>{
               res.statusCode = 200;
               res.end('create success');
            });
            break;
        case 'PATCH':
            console.log('patch');
            req.on('data',(data)=>{
                if (req.headers['content-type'] === 'application/json'){
                    console.log('get json content');
                    let user = JSON.parse(data.toString());
                    console.log('user input',user);
                    let userIndexToUpdate = users.findIndex((currentUser)=>currentUser.username === user.username);
                    console.log('userIndexToUpdate',userIndexToUpdate);
                    if (userIndexToUpdate !== -1){
                        users.splice(userIndexToUpdate,1,user);
                    }
                    else{
                        res.statusCode = 200;
                        res.end(`update failed, user ${user.username} not found`);
                    }

                }
            });
            req.on('end',()=>{
                res.statusCode = 200;
                res.end('create success');
            });
            break;
        case 'DELETE':
            if (req.headers['content-type'] === 'application/json'){
                console.log('get json content');
                let user = JSON.parse(data.toString());
                console.log('user input',user);
                let userIndexToUpdate = users.findIndex((currentUser)=>currentUser.username === user.username);
                console.log('userIndexToUpdate',userIndexToUpdate);
                users.splice(userIndexToUpdate,1);
                res.statusCode = 200;
                res.end('delete success');
            }
            break;
    }

});
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});