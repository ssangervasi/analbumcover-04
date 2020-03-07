import { Spelling } from "./spelling";

const rephrase = (
	phrase: string,
	spelling: Spelling,
	minWordLength: number = 1
): string | null => {
	if (phrase == null) {
		return null
	}

	var rephrasing = phrase.replace(/[0-9!@#$%^&*()_+-=\';:",.></?\\|`~" ]/g, "")

	if (rephrasing.length == 0) {
		if (spelling.isCorrect(rephrasing.toLocaleLowerCase()) == false) {
			return null
		}

		if (minWordLength < 0) {
		    throw new RangeError("Maximum call stack size exceeded")
		}
		
		return null	
	}

	var result = null
	var nextWord = findWord(rephrasing, spelling, minWordLength)
	
	if (nextWord != null) {
		result = ""
	}

	while (nextWord != null && nextWord.length > 0) {
		result += nextWord

		rephrasing = rephrasing.substring(nextWord.replace(" ", "").length, rephrasing.length)
		nextWord = findWord(rephrasing, spelling, minWordLength)
	}
	
	return result
}

function findWord(phrase: string, spelling: Spelling, minWordLength: number) {
	if (phrase.length < minWordLength) {
		return null
	}

	for (var i = minWordLength; i <= phrase.length; i++) {
		let potentialWord = phrase.substring(0, i)
		let isSpellingCorrect = spelling.isCorrect(potentialWord.toLocaleLowerCase()) && potentialWord.length > 1
		
		let remainingLetters = phrase.length - potentialWord.length

		if (potentialWord.length == 1) {
			if (potentialWord == "A") {
				return "a" + (remainingLetters > 0 ? " " : "")
			}
		}

		if (isSpellingCorrect) {
			if (remainingLetters > 0 && remainingLetters < minWordLength) {
				return ""
			}
			return potentialWord.toLocaleLowerCase() + (remainingLetters > 0 ? " " : "")
		}
	}

	return null
}

export {
	rephrase
}