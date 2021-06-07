
exports.after = function (schema, hookName, value, exception) {
    const result = exports.runHooks(schema, hookName, value, exception)
    return result.value
}

exports.runHooks = function (schema, hookName, value, exception, checkForExceptions = false) {
    if (schema.enforcerData && schema.enforcerData.staticData && schema.enforcerData.staticData.hooks) {
        const hooks = schema.enforcerData.staticData.hooks[hookName]
        const length = hooks !== undefined ? hooks.length : 0
        let newValue = value
        let hasException = false

        if (checkForExceptions && length > 0) hasException = exception.hasException

        if (!hasException) {
            for (let i = 0; i < length; i++) {
                const result = hooks[i](value, schema, exception)
                if (result && typeof result === 'object') {
                    if (result.done === true) return result
                    if ('value' in result) newValue = result.value
                    if (result.hasException || exception.hasException) {
                        hasException = true
                        break
                    }
                }

            }
        }

        return {
            done: hasException === true,    // if it has an exception then it is also done
            hasException,
            value: newValue
        }
    } else {
        return {
            done: false,
            hasException: false,
            value: value
        }
    }
}