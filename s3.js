const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets");
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET
});

exports.upload = function(req, res, next) {
    if (!req.file) {
        next();
    } else {
        const filename = `${req.session.user.user_id}/${req.file.filename}`;

        const { mimetype, size, path } = req.file;
        const promise = s3
            .putObject({
                Bucket: "spicedling",
                ACL: "public-read",
                Key: filename,
                Body: fs.createReadStream(path),
                ContentType: mimetype,
                ContentLength: size
            })
            .promise();
        promise
            .then(() => {
                next();
                fs.unlink(path, () => {});
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(500);
            });
    }
};

exports.delete = function(user_id) {
    var params = {
        Bucket: "spicedling",
        Prefix: user_id + "/"
    };
    let promises = [];

    const promise = s3
        .listObjectsV2(params)
        .promise()
        .then(function(data) {
            console.log("data", data);
            data["Contents"].forEach(function(arrayItem) {
                promises.push(
                    s3
                        .deleteObject({
                            Bucket: "spicedling",
                            Key: arrayItem["Key"]
                        })
                        .promise()
                );
            });
        });
    return promise.then(() => {
        return Promise.all(promises).then(() => {
            var params = {
                Bucket: "spicedling",
                Prefix: user_id + "/"
            };
            s3.listObjectsV2(params, function(err, data) {
                console.log("CHECK ARE THERE STILL IMAGES", data["Contents"]);
            });
        });
    });
};
