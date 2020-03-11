const Exception = require('../exception');
const util      = require('../util');

const m1 = 'Unable to determine deserialization schema because too many schemas match. Use of a discriminator or making your schemas more specific would help this problem.'

exports.anyOneOf = function (schema, value, exception, map, action, isSerialize, options) {
    const key = schema.anyOf ? 'anyOf' : 'oneOf';
    const exceptions = [];
    const matches = [];
    schema[key].forEach(subSchema => {
        const childException = new Exception('');
        const mapCopy = new Map(map);

        // if serializing make sure the value validates against this schema before serialize
        if (isSerialize && subSchema.validate(value)) return;

        // serialize or deserialize
        const result = action(childException, mapCopy, subSchema, util.copy(value), options);

        if (childException.hasException) {
            exceptions.push(childException)
        } else {
            // score based on the number of strongly matching properties
            let score = 1;
            if (subSchema.type === 'object') {
                const properties = subSchema.properties || {};
                const keys = Object.keys(value);
                const length = keys.length;
                for (let i = 0; i < length; i++) {
                    const key = keys[i];
                    if (properties.hasOwnProperty(key)) {
                        score++;
                    } else if (subSchema.additionalProperties === false) {
                        score = 0;
                        break;
                    }
                }
            }
            if (score > 0 && !isSerialize && subSchema.validate(result)) score = 0;
            if (score > 0) matches.push({ score, result })
        }
    });
    if (matches.length > 1) {
        matches.sort((a, b) => a.score > b.score ? -1 : 1);
        const highScore = matches[0].score;
        const highs = matches.filter(match => match.score === highScore);
        if (highs.length > 1) {
            const message = isSerialize
                ? 'Unable to determine serialization schema because too many schemas match. Use of a discriminator or making your schemas more specific would help this problem.'
                : 'Unable to determine deserialization schema because too many schemas match. Use of a discriminator or making your schemas more specific would help this problem.'
            exception.message(message)
        } else {
            return util.merge(value, highs[0].result);
        }
    } else if (matches.length === 0) {
        const child = exception.nest('No matching schemas');
        exceptions.forEach(childException => child.push(childException));
    } else {
        return util.merge(value, matches[0].result);
    }
}
