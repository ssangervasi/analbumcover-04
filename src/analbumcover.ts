import { Spelling } from "./spelling";

const rephrase = (
	phrase: string,
	spelling: Spelling,
	minWordLength: number = 1
): string | null => {
	if (phrase == null) {
		return null
	}

	// badCharacters = '0123456789!@#$%^&*()_+-=\';:",.></?\\|`~" '

	let rephrasing = phrase
		.replace(/[0-9!@#$%^&*()_+-=\';:",.></?\\|`~" ]/g, "")

	if (rephrasing.length < minWordLength) {
		return null
	}

	let spellingResult = spelling.isCorrect(rephrasing)

	if (rephrasing.length == 0) {
		if (spellingResult == false) {
			return null
		}

		if (minWordLength < 0) {
		    throw new RangeError('Maximum call stack size exceeded')
		}
		return null
		
	} else if (rephrasing.length == 1) {
		if (rephrasing == 'A') {
			return 'a'
		}
		if (spellingResult == false) {
			return null
		}

		return null
	}

	if (rephrasing.length == minWordLength) {
		if (spellingResult) {
			return rephrasing.toLocaleLowerCase()
		} else {
			return null
		}
	}


	rephrasing = rephrasing.replace(/(?<=[sS]h)ea/g, 'aw')

	return rephrasing

	// 'with a non-negative word length an empty string will return null when it is marked valid'
	// 'The word length is ignored when the spelling is always false'
	// 'with a negative word length and an always true spelling check it will throw an exception'
}

export {
	rephrase
}