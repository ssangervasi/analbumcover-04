import {
	rephrase,
} from './analbumcover'

import { initNodehun, NodehunSpelling, Spelling } from './spelling'

class AlwaysTrueSpelling implements Spelling {
	constructor() { }

	isCorrect(_word: string): boolean {
		return true
	}
}

class AlwaysFalseSpelling implements Spelling {
	constructor() { }

	isCorrect(_word: string): boolean {
		return false
	}
}

function setCharAt(str: string, index: number, chr: string): string {
	if(index > str.length-1) return str
	return str.substr(0,index) + chr + str.substr(index+1)
}

function makeBadString(length: number): string {
	var result = ''

	const characters = '0123456789!@#$%^&*()_+-=\';:",.></?\\|`~" '
	const charactersLength = characters.length
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}

	return result
}

function makeGoodString(length: number): string {
	var result = ''

	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
	const charactersLength = characters.length
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}
	if (result.toLocaleLowerCase() == result) {
		result = setCharAt(result, 0, result.charAt(0).toLocaleUpperCase())
	}
	return result
}

describe('rephrase with an empty string', () => {
	const str = ''
	const nonNegativeWordLengths = [0, 1, 2, 3]
	const negativeAndNonNegativeWordLengths = [-3, -2, -1, 0, 1, 2, 3]

	nonNegativeWordLengths.forEach((wordLength) => {
		test('with a non-negative word length an empty string will return null when it is marked valid', () => {
			const rephrased = rephrase(str, new AlwaysTrueSpelling, wordLength)
			expect(rephrased).toEqual(null)
		})
	})

	negativeAndNonNegativeWordLengths.forEach((wordLength) => {
		test('The word length is ignored when the spelling is always false', () => {
			const rephrased = rephrase(str, new AlwaysFalseSpelling, wordLength)
			expect(rephrased).toEqual(null)
		})
	})

	test('with a negative word length and an always true spelling check it will throw an exception', () => {
		expect(
			function () { rephrase(str, new AlwaysTrueSpelling, -1) }
		).toThrow(new RangeError('Maximum call stack size exceeded'))
	})
})

describe('rephrase with non alpha numeric values', () => {
	for (var i = 1; i < 25; i++) {
		const length = i
		const id = makeBadString(length)

		describe(`for the string ${id}`, () => {
			for (var j = 1; j < length; j++) {
				const wordCount = j
				test(`all non alpha numerics should be stripped out and null still returned with a true spelling using wordcound ${wordCount}`, () => {
					const rephrased = rephrase(id, new AlwaysTrueSpelling, wordCount)
					expect(rephrased).toEqual(null)
				})

				test(`all non alpha numerics should be stripped out and null still returned with a false spelling using wordcound ${wordCount}`, () => {
					const rephrased = rephrase(id, new AlwaysFalseSpelling, wordCount)
					expect(rephrased).toEqual(null)
				})
			}
		})
	}
})

describe('rephrase when the word length is greater than the phrase length', () => {
	for (var i = 1; i < 25; i++) {
		const length = i
		const str = makeGoodString(length)

		test('it should simply return null back for a true word spelling', () => {
			const rephrased = rephrase(str, new AlwaysTrueSpelling, length + 1)
			expect(rephrased).toEqual(null)
		})

		test('it should simply return null back for a false word spelling', () => {
			const rephrased = rephrase(str, new AlwaysFalseSpelling, length + 1)
			expect(rephrased).toEqual(null)
		})
	}
})

describe('for single character string', () => {
	describe('the A character is a valid character phrase', () => {
		const letter = 'A'

		test(`always true spelling doesn't matter for ${letter}, the single letter is returned`, () => {
			const rephrased = rephrase(letter, new AlwaysTrueSpelling, 1)
			expect(rephrased).toEqual('a')
		})

		test(`always false spelling doesn't matter for ${letter}, the single letter is returned`, () => {
			const rephrased = rephrase(letter, new AlwaysFalseSpelling, 1)
			expect(rephrased).toEqual('a')
		})
	})

	describe('all other single characters are not allowed', () => {
		const validSingleLetters = 'BCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')

		validSingleLetters.forEach((letter) => {
			test(`always true spelling doesn't matter for ${letter}, null is returned`, () => {
				const rephrased = rephrase(letter, new AlwaysTrueSpelling, 1)
				expect(rephrased).toEqual(null)
			})

			test(`always false spelling doesn't matter for ${letter}, null is returned`, () => {
				const rephrased = rephrase(letter, new AlwaysFalseSpelling, 1)
				expect(rephrased).toEqual(null)
			})
		})
	})
})

describe('rephrase when the word length is equal than the phrase length, and greater than one', () => {
	for (var i = 2; i < 25; i++) {
		const length = i
		const str = makeGoodString(length)

		test(`it should simply return the ${str} string back back for a true word spelling`, () => {
			const rephrased = rephrase(str, new AlwaysTrueSpelling, length)
			expect(rephrased).toEqual(str.toLocaleLowerCase())
		})

		test('it should simply return null back for a false word spelling', () => {
			const rephrased = rephrase(str, new AlwaysFalseSpelling, length)
			expect(rephrased).toEqual(null)
		})
	}
})

describe('when output would be the same as the input', () => {
	class FourLetterWords implements Spelling {
		constructor() { }

		isCorrect(word: string): boolean {
			return word.length == 4
		}
	}

	test('that null is returned', () => {
		const rephrased = rephrase('some word pair', new FourLetterWords, 4)
		expect(rephrased).toBeNull
	})
})

describe('When the spelling returns a word is valid on even intervals', () => {
	for( var i = 2; i < 10; i++) {
		const wordSize = i
		class ConsistentWords implements Spelling {
			constructor(private size: number) { }
	
			isCorrect(word: string): boolean {
				return word.length == this.size
			}
		}
		for (var j = wordSize * 2; j < wordSize * 10; j++) {
			const length = j
			const str = makeGoodString(length)
	
			test(`the ${str} phrase should be broken up in sets of ${wordSize}`, () => {
				const rephrased = rephrase(str, new ConsistentWords(wordSize), wordSize)
				expect(rephrase).not.toBeNull
	
				const words = rephrased!!.split(' ')
				expect(words.length).toEqual(Math.floor(str.length / wordSize))
			})
		}
	}
})

describe('When using an actual dictionary with extras',  () => {
	const phrase = 'AnAlbumCoverFor600AlexPlease'

	class TrebekSpelling implements Spelling {
		constructor() { }

		isCorrect(word: string): boolean {
			return ['an', 'album', 'cover', 'for', 'alex'].includes(word)
		}
	}

	test('real words should be pulled out and a space denoting extras existed', () => {
		const rephrased = rephrase(phrase, new TrebekSpelling, 2)
		expect(rephrased).toEqual('an album cover for alex ')
	})
})

describe('When using an actual dictionary with no extras',  () => {
	const phrase = 'AnAlbumCoverFor600Alex!'

	class TrebekSpelling implements Spelling {
		constructor() { }

		isCorrect(word: string): boolean {
			return ['an', 'album', 'cover', 'for', 'alex'].includes(word)
		}
	}

	test('real words should be pulled out', () => {
		const rephrased = rephrase(phrase, new TrebekSpelling, 2)
		expect(rephrased).toEqual('an album cover for alex')
	})
})

describe('When using a Sean Connery dictionary dictionary with extras',  () => {
	const phrase = 'AnAlbumCoverFor600AlexPlease'

	class TrebekSpelling implements Spelling {
		constructor() { }

		isCorrect(word: string): boolean {
			return ['anal', 'bum', 'cover', 'for', 'alex'].includes(word)
		}
	}

	test('real words should be pulled out and a space denoting extras existed', () => {
		const rephrased = rephrase(phrase, new TrebekSpelling, 2)
		expect(rephrased).toEqual('anal bum cover for alex ')
	})
})

describe('When using a Sean Connery dictionary with no extras',  () => {
	const phrase = 'AnAlbumCoverFor600Alex'

	class TrebekSpelling implements Spelling {
		constructor() { }

		isCorrect(word: string): boolean {
			return ['anal', 'bum', 'cover', 'for', 'alex'].includes(word)
		}
	}

	test('real words should be pulled out', () => {
		const rephrased = rephrase(phrase, new TrebekSpelling, 2)
		expect(rephrased).toEqual('anal bum cover for alex')
	})
})

describe('When using the same spelling library as the CLI', () => {
	describe('when checking "An Album Cover For 600 Alex"', () => {
		const phrase = 'An Album Cover For 600 Alex!'

		const parameters = [
			[1, 'a '],
			[2, 'an alb um co '],
			[3, 'anal bum cove '],
			[4, 'anal '],
			[5, null],
			[6, null]
		]

		parameters.forEach(([minLetters, result]) => {
			test(`with min letters of ${minLetters} we should get ${result}`, async () => {
				const nodehun = await initNodehun()
				const spelling = new NodehunSpelling(nodehun)
				const rephrased = rephrase(phrase, spelling, minLetters as number)
		
				expect(rephrased).toEqual(result)
			})
		})
	})

	describe('when checking "An Album Cover" we get different results than having more after the word cover', () => {
		const phrase = 'An Album Cover'

		const parameters = [
			[1, 'a '],
			[2, 'an alb um co '],
			[3, 'anal bum cover'],
			[4, 'anal '],
			[5, null],
			[6, null]
		]

		parameters.forEach(([minLetters, result]) => {
			test(`with min letters of ${minLetters} we should get ${result}`, async () => {
				const nodehun = await initNodehun()
				const spelling = new NodehunSpelling(nodehun)
				const rephrased = rephrase(phrase, spelling, minLetters as number)
		
				expect(rephrased).toEqual(result)
			})
		})
	})

	describe('when checking "An Album Cover F" we get different results than having many more words after the word cover', () => {
		const phrase = 'An Album Cover F'

		const parameters = [
			[1, 'a '],
			[2, 'an alb um co '],
			[3, 'anal bum '],
			[4, 'anal '],
			[5, null],
			[6, null]
		]

		parameters.forEach(([minLetters, result]) => {
			test(`with min letters of ${minLetters} we should get ${result}`, async () => {
				const nodehun = await initNodehun()
				const spelling = new NodehunSpelling(nodehun)
				const rephrased = rephrase(phrase, spelling, minLetters as number)
		
				expect(rephrased).toEqual(result)
			})
		})
	})
	
	describe('when checking "The quick brown fox jumped over the lazy dog"', () => {
		const phrase = 'The quick brown fox jumped over the lazy dog'

		const parameters = [
			[1, 'the quick bro '],
			[2, 'the quick bro '],
			[3, 'the quick bro '],
			[4, null],
			[5, null],
		]

		parameters.forEach(([minLetters, result]) => {
			test(`with min letters of ${minLetters} we should get ${result}`, async () => {
				const nodehun = await initNodehun()
				const spelling = new NodehunSpelling(nodehun)
				const rephrased = rephrase(phrase, spelling, minLetters as number)
		
				expect(rephrased).toEqual(result)
			})
		})
	})

	describe('when checking "I gave you the chance of aiding me willingly, but you have elected the way of pain."', () => {
		const phrase = 'I gave you the chance of aiding me willingly, but you have elected the way of pain.'

		const parameters = [
			[1, null],
			[2, null],
		]

		parameters.forEach(([minLetters, result]) => {
			test(`with min letters of ${minLetters} we should get ${result}`, async () => {
				const nodehun = await initNodehun()
				const spelling = new NodehunSpelling(nodehun)
				const rephrased = rephrase(phrase, spelling, minLetters as number)
		
				expect(rephrased).toEqual(result)
			})
		})
	})

	describe('when checking "\'Poor attack, you chump! Ire!\'"', () => {
		const phrase = "'Poor attack, you chump! Ire!'"

		const parameters = [
			[1, 'poo rat ta ck yo '],
			[2, 'poo rat ta ck yo '],
			[3, 'poo rat tack you chum '],
			[4, 'poor attack '],
			[5, null],
			[6, null],
		]

		parameters.forEach(([minLetters, result]) => {
			test(`with min letters of ${minLetters} we should get ${result}`, async () => {
				const nodehun = await initNodehun()
				const spelling = new NodehunSpelling(nodehun)
				const rephrased = rephrase(phrase, spelling, minLetters as number)
		
				expect(rephrased).toEqual(result)
			})
		})
	})

	describe('when the remaining letters after finding a word is less than the min letter count, we should throw words away', () => {
		const parameters = [
			["'Poor attack, yourself", 4, 'poor attack your self'],
			["'Poor attack, yourself ", 4, 'poor attack your self'],
			["'Poor attack, yourself q", 4, 'poor attack your '],
			["'Poor attack, yourself qu", 4, 'poor attack your '],
			["'Poor attack, yourself qui", 4, 'poor attack your '],
			["'Poor attack, yourself quic", 4, 'poor attack your self '],
			["'Poor attack, yourself quick", 4, 'poor attack your self quick']
		]

		parameters.forEach(([phrase, minLetters, result]) => {
			test(`with min letters of ${minLetters}, "${phrase}" should turn into "${result}"`, async () => {
				const nodehun = await initNodehun()
				const spelling = new NodehunSpelling(nodehun)
				const rephrased = rephrase(phrase as string, spelling, minLetters as number)
		 
				expect(rephrased).toEqual(result)
			})
		})
	});
})
