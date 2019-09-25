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
            `SELECT id,first,last,imageurl FROM users
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
    location_lat,
    location_lng,
    address,
    url,
    description,
    category,
    user_id
) {
    return db
        .query(
            `INSERT INTO events (name,
            eventdate,
            eventtime,
            location_lat,
            location_lng,address,
            imageurl,
            description,category,
            host_id)
        VALUES ($1, $2, $3, $4,$5, $6, $7, $8,$9,$10) RETURNING id
        `,
            [
                name,
                date,
                time,
                location_lat,
                location_lng,
                address,
                url,
                description,
                category,
                user_id
            ]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getEvent = function(id) {
    return db
        .query(
            `
    SELECT events.id, name,
    eventdate,
    eventtime,
    location_lat,
    location_lng,address,
    events.imageurl AS eventimage,
    description,category,
    host_id, users.first, users.last, users.imageurl AS userimage
    FROM events
    JOIN users
    ON (events.id = $1 AND host_id = users.id)

`,
            [id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.attend = function(event_id, user_id) {
    return db
        .query(
            `INSERT INTO atendees (event_id, user_id)
        VALUES ($1, $2)
        `,
            [event_id, user_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.unattend = function(event_id, user_id) {
    return db.query(
        `DELETE FROM atendees
            WHERE (event_id=$1 AND user_id=$2)
        `,
        [event_id, user_id]
    );
};

exports.getAtendees = function(event_id) {
    return db
        .query(
            `
    SELECT users.first, users.last, users.imageurl AS userimage, users.id
    FROM atendees
    JOIN users
    ON ( atendees.event_id= $1 AND atendees.user_id = users.id)

`,
            [event_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.updateEvent = function(
    name,
    date,
    time,
    location_lat,
    location_lng,
    address,
    url,
    description,
    category,
    event_id
) {
    return db
        .query(
            `UPDATE events
        SET name = ($1), eventdate = ($2), eventtime =($3), location_lat=($4),
        location_lng=($5), address=($6),imageurl=($7), description=($8),category=($9)
        WHERE id=($10) RETURNING eventtime`,
            [
                name,
                date,
                time,
                location_lat,
                location_lng,
                address,
                url,
                description,
                category,
                event_id
            ]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.updateEventNoFile = function(
    name,
    date,
    time,
    location_lat,
    location_lng,
    address,
    description,
    category,
    event_id
) {
    return db
        .query(
            `UPDATE events
        SET name = ($1), eventdate = ($2), eventtime =($3), location_lat=($4), location_lng=($5), address=($6),description=($7),category=($8)
        WHERE id=($9)`,
            [
                name,
                date,
                time,
                location_lat,
                location_lng,
                address,
                description,
                category,
                event_id
            ]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getMyEvents = function(id) {
    return db
        .query(
            `
    SELECT events.id, name,host_id,
    eventdate,
    eventtime,address,
    events.imageurl AS eventimage
    FROM events
    JOIN atendees
    ON (events.host_id = $1 AND events.id=atendees.event_id)
    OR (atendees.user_id=$1 AND events.id=atendees.event_id)
    WHERE eventdate > now()
    ORDER BY eventdate ASC

`,
            [id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getThisWeek = function() {
    return db
        .query(
            `
    SELECT events.id, name,
    eventdate,
    eventtime,address,
    events.imageurl AS eventimage
    FROM events
    WHERE eventdate > now() AND eventdate < now() + interval '1 week'
    ORDER BY eventdate ASC

`
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getCategory = function(category) {
    return db
        .query(
            `
    SELECT events.id, name,
    eventdate,
    eventtime,
    events.imageurl AS eventimage
    FROM events
    WHERE events.category ILIKE ($1) AND eventdate > now()- interval '1 day'
    ORDER BY eventdate ASC

`,
            [category + "%"]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getAllEvents = function() {
    return db
        .query(
            `
    SELECT events.id, name,
    eventdate,
    eventtime,
    events.imageurl AS eventimage
    FROM events
    WHERE eventdate > now()- interval '1 day'
    ORDER BY eventdate ASC

`
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getPopular = function() {
    return db
        .query(
            `SELECT events.id, events.id, name,
            eventdate,
            eventtime,
            events.imageurl AS eventimage, events.address ,COUNT(event_id) AS event_count
    FROM events LEFT JOIN atendees
    ON events.id = atendees.event_id AND eventdate > now()- interval '1 day'
    GROUP BY events.id
    ORDER BY event_count DESC
    LIMIT 10`
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
