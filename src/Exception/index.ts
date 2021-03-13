import { getAlert } from './config'
import * as util from 'util'

const inspect = util.inspect.custom || 'inspect'

export interface Message {
  code: string
  level: string
	message: string
	reference: string
}

export class Exception {
	public header: string
	public data: {
		at: {
			[key: string]: Exception
		}
		nest: Exception[]
		messages: Array<Message>
	} = { at: {}, nest: [], messages: [] }

	constructor (header: string) {
		this.header = header
	}

	public at (key: string | number): Exception {
		const at = this.data.at
		if (!at[key]) at[key] = new Exception('')
		return at[key]
	}

	public get hasException () : boolean {
		const children = this.data
		if (children.messages.length) return true

		const nest = children.nest
		const length = nest.length
		for (let i = 0; i < length; i++) {
			if (nest[i].hasException) return true
		}

		const keys = Object.keys(children.at)
		const length2 = keys.length
		for (let i = 0; i < length2; i++) {
			if (children.at[keys[i]].hasException) return true
		}

		return false
	}

	public message (code: string, reference: string, ...args: unknown[]): Exception {
    const { level, message, reference: ref } = getAlert(code, ...args)
    if (level !== 'ignore') {
      this.data.messages.push({
        code,
        level,
        message,
        reference: reference || ref
      })
    }
		return this
	}

	public nest (header: string): Exception {
		const exception = new Exception(header)
		this.push(exception)
		return exception
	}

	public push (exception: Exception): Exception {
		this.data.nest.push(exception)
		return exception
	}

	public toString (): string {
		return toString(this, null, '')
	}

	[inspect] () {
		if (this.hasException) {
			return '[ EnforcerException: ' + toString(this, null, '  ') + ' ]';
		} else {
			return '[ EnforcerException ]';
		}
	}
}

function toString (context: Exception, parent: Exception | null, prefix: string) : string {
	if (!context.hasException) return ''

	const prefixPlus = prefix + '  '
	const children = context.data
	let result = ''

	if (context.header) result += (parent ? prefix : '') + context.header

	const at = children.at
	const atKeys = Object.keys(at).filter(key => at[key].hasException)
	const singleAtKey = atKeys.length === 1
	atKeys.forEach(key => {
		const exception = children.at[key]
		if (context.header || !singleAtKey || children.nest.length > 0 || children.messages.length > 0) {
			result += '\n' + prefixPlus + 'at: ' + key + toString(exception, context, prefixPlus)
		} else {
			result += ' > ' + key + toString(exception, context, prefix)
		}
	})

	children.nest.forEach(exception => {
		if (exception.hasException) result += '\n' + toString(exception, context, prefixPlus);
	})

	children.messages.forEach(message => {
		result += '\n' + prefixPlus + message
	})

	return result
}