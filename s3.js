const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET
});

exports.upload = function(req, res, next) {
    if (!req.file) {
        next();
    } else {
        // console.log("FILE DATA", req.file);
        // console.log("USER", req.session.user.user_id);
        const filename = `${req.session.user.user_id}/${req.file.filename}`;
        console.log("FILENAME", filename);
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
        Bucket: "spicedling" /* required */,
        Prefix: user_id + "/" // Can be your folder name
    };
    let promises = [];

    const promise = s3
        .listObjectsV2(params)
        .promise()
        .then(function(data) {
            console.log("data", data);
            data["Contents"].forEach(function(arrayItem) {
                // console.log(arrayItem["Key"]);
                console.log("PROMISES", promises);
                promises.push(
                    s3
                        .deleteObject({
                            Bucket: "spicedling",
                            Key: arrayItem["Key"]
                        })
                        .promise()
                );
                // console.log("To BE DELETED OBJECT", promises);
            });
        });
    return promise.then(() => {
        console.log("About to wait for promises");
        return Promise.all(promises).then(() => {
            var params = {
                Bucket: "spicedling" /* required */,
                Prefix: user_id + "/" // Can be your folder name
            };
            s3.listObjectsV2(params, function(err, data) {
                console.log("CHECK ARE THERE STILL IMAGES", data["Contents"]);
            });
        });
    });
};
