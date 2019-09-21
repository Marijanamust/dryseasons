const spicedPg = require("spiced-pg");
let db;

db = spicedPg(`postgres:postgres:postgres@localhost:5432/final`);

exports.addRegister = function(first, last, email, password) {
    return db
        .query(
            `INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id, first, last, imageurl`,
            [first, last, email, password]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getHash = function(email) {
    return db
        .query(`SELECT * FROM users WHERE email=$1`, [email])
        .then(({ rows }) => {
            return rows[0];
        });
};

exports.getUser = function(user_id) {
    return db
        .query(
            `SELECT id,first,last,imageurl, bio FROM users
                WHERE id=$1`,
            [user_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.insertEvent = function(
    name,
    date,
    time,
    location,
    url,
    description,
    user_id
) {
    return db
        .query(
            `INSERT INTO events (name,
            eventdate,
            eventtime,
            location,
            imageurl,
            description,
            host_id)
        VALUES ($1, $2, $3, $4,$5, $6, $7) RETURNING id
        `,
            [name, date, time, location, url, description, user_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.updateAvatar = function(url, user_id) {
    return db
        .query(
            `UPDATE users
        SET imageurl = ($1)
        WHERE id=($2) RETURNING imageurl`,
            [url, user_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.updateBio = function(bio, user_id) {
    return db
        .query(
            `UPDATE users
        SET bio = ($1)
        WHERE id=($2) RETURNING bio`,
            [bio, user_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getLastUsers = function(user_id) {
    return db
        .query(
            `SELECT id,first,last,imageurl, bio FROM users
            WHERE id != ($1)
            ORDER BY id DESC
            LIMIT 3
            `,
            [user_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getMatchingUsers = function(val, user_id) {
    return db
        .query(
            `SELECT id,first,last,imageurl, bio FROM users
        WHERE first || ' ' || last ILIKE $1
        AND id != ($2)`,
            [val + "%", user_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getFriendState = function(profile_id, other_id) {
    return db
        .query(
            `SELECT * FROM friendships
            WHERE (receiver_id= $1 AND sender_id=$2)
            OR (receiver_id=$2 AND sender_id=$1)`,
            [profile_id, other_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.addFriendRequest = function(profile_id, other_id) {
    return db.query(
        `INSERT INTO friendships (sender_id, receiver_id)
        VALUES ($1, $2)`,
        [profile_id, other_id]
    );
};

exports.cancelFriendRequest = function(profile_id, other_id) {
    return db.query(
        `DELETE FROM friendships
        WHERE (sender_id= $1 AND receiver_id=$2)`,
        [profile_id, other_id]
    );
};

exports.acceptFriendRequest = function(profile_id, other_id) {
    return db.query(
        `UPDATE friendships
        SET accepted=true
        WHERE (receiver_id= $1 AND sender_id=$2)`,
        [profile_id, other_id]
    );
};

exports.unfriend = function(profile_id, other_id) {
    return db.query(
        `DELETE FROM friendships
        WHERE (receiver_id= $1 AND sender_id=$2)
        OR (receiver_id=$2 AND sender_id=$1)`,
        [profile_id, other_id]
    );
};

exports.deleteprofile = function(user_id) {
    return db.query(
        `DELETE FROM users
        WHERE id=$1`,
        [user_id]
    );
};

exports.getAllFriends = function(user_id) {
    return db
        .query(
            `
    SELECT users.id, first, last, imageurl, accepted
    FROM friendships
    JOIN users
    ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)
`,
            [user_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getChatMessages = function() {
    return db
        .query(
            `SELECT message, imageurl, first, last, chatmessages.created_at
            FROM chatmessages
            JOIN users ON (sender_id=users.id AND receiver_id IS NULL)
        ORDER BY chatmessages.id DESC
        LIMIT 10`
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.insertMessage = function(sender_id, message, receiver_id) {
    return db.query(
        `INSERT INTO chatmessages (sender_id, message, receiver_id)
        VALUES ($1, $2, $3)`,
        [sender_id, message, receiver_id]
    );
};

exports.getPrivateMessages = function(user_id, other_id) {
    return db
        .query(
            `SELECT message, imageurl, first, last, users.id,chatmessages.created_at
            FROM chatmessages
            JOIN users
            ON (sender_id = $1 AND receiver_id=$2 AND users.id=$1)
            OR (sender_id = $2 AND receiver_id=$1 AND users.id=$2)
            ORDER BY chatmessages.id DESC
        LIMIT 10`,
            [user_id, other_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};
// `SELECT message, imageurl, first, last, chatmessages.created_at
// FROM chatmessages
// WHERE (sender_id = user_id AND receiver_id=other_id)
// OR (sender_id = other_id AND receiver_id=receiver_id)
// JOIN users ON sender_id=users.id AND receiver_id
// ORDER BY chatmessages.id DESC
// LIMIT 10`;
