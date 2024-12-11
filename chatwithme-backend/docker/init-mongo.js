db = db.getSiblingDB('admin');
db.auth('root', 'root');

db = db.getSiblingDB('chatwithme');
db.createUser({
    user: 'user',
    pwd: 'password',
    roles: [
        {
            role: 'readWrite',
            db: 'chatwithme',
        },
    ],
});
