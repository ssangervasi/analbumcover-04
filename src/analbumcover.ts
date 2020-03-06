import { Spelling } from "./spelling";

const rephrase = (
	phrase: string,
	spelling: Spelling,
	minWordLength: number = 1
): string | null => {
	if (phrase == null) {
		return null
	}

	var rephrasing = phrase
		.replace(/[0-9!@#$%^&*()_+-=\';:",.></?\\|`~" ]/g, "")

	if (rephrasing.length == 0) {
		if (spelling.isCorrect(rephrasing.toLocaleLowerCase()) == false) {
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

		return null
	}

	var result = null
	var nextWord = findWord(rephrasing, spelling, minWordLength)
	
	if (nextWord != null) {
		result = ""
	}

	while (nextWord != null) {
		result += nextWord

		rephrasing = rephrasing.substring(nextWord.length, rephrasing.length)
		nextWord = findWord(rephrasing, spelling, minWordLength)

		if (nextWord == null) {
			return result
		}
		result += " "
	}
	
	return result
}

function findWord(phrase: string, spelling: Spelling, minLength: number) {
	let minWordLength = Math.max(minLength, 2)
	if (phrase.length < minWordLength) {
		return null
	}

	for (var i = minWordLength; i <= phrase.length; i++) {
		let potentialWord = phrase.substring(0, i)
		let spellingResult = spelling.isCorrect(potentialWord.toLocaleLowerCase())
		
		if (potentialWord.length >= minWordLength) {
			if (spellingResult) {
				return potentialWord.toLocaleLowerCase()
			}
		}
	}

	return null
}

export {
	rephrase
}