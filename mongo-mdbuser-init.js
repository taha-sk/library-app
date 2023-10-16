db.createUser({
    user: 'mdbuser',
    pwd: 'mdbuser123',
    roles: [{
        role: 'readWrite',
        db: 'libraryApp'
    }]
});