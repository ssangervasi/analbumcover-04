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
		    throw new RangeError("Maximum call stack size exceeded")
		}
		
		return null
		
	} else if (rephrasing.length == 1) {
		if (rephrasing == "A") {
			return "a"
		}

		return null
	}

	var result = null
	var nextWord = findWord(rephrasing, spelling, minWordLength)
	
	if (nextWord != null) {
		result = ""
	}

	while (nextWord != null && nextWord.length > 0) {
		let noSpaces = nextWord.replace(" ", "")
		result += nextWord

		rephrasing = rephrasing.substring(noSpaces.length, rephrasing.length)
		nextWord = findWord(rephrasing, spelling, minWordLength)

		if (nextWord == null) {
			return result
		}
	}
	
	return result
}

function findWord(phrase: string, spelling: Spelling, minWordLength: number) {
	if (phrase.length < minWordLength) {
		return null
	}

	for (var i = minWordLength; i <= phrase.length; i++) {
		let potentialWord = phrase.substring(0, i)
		let spellingResult = spelling.isCorrect(potentialWord.toLocaleLowerCase()) && potentialWord.length > 1
		
		if (potentialWord.length == 1) {
			if (potentialWord == "A") {
				return "a" + (phrase.length - 1 > 0 ? " " : "")
			}
		}

		if (spellingResult) {
			let remainingLetters = phrase.length - potentialWord.length
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