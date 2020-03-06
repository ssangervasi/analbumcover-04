import UIKit

struct Spelling {
	func isCorrect(_ str: String) -> Bool {
		
		print(str)
		
//		return ["the", "quick", "bro", "brown", "fox", "jumped", "over", "the", "lazy", "dog"].contains(str)
		return ["i", "gave", "you", "the", "chance", "of", "aiding", "me", "willingly"].contains(str)
	}
}


func rephrase(phrase: String?, spelling: Spelling, minWordLength: Int) -> String? {
	if phrase == nil {
		return nil
	}
	
	var rephrasing = phrase!
//		.replace(/[0-9!@#$%^&*()_+-=\';:",.></?\\|`~" ]/g, "")
	
	if rephrasing.count == 0 {
		if spelling.isCorrect(rephrasing.lowercased()) == false {
			return nil
		}
		if minWordLength < 0 {
			assertionFailure("max call stack")
		}
		
		return nil
		
	} else if rephrasing.count == 1 {
		if rephrasing == "A" {
			return "a"
		}
		
		return nil
	}
	
	
	var result: String?
	var nextWord = findWord(rephrasing, spelling, minWordLength)
	
	if nextWord != nil {
		result = ""
	}
	
	while (nextWord != nil) {
		result! += nextWord!
		
		let newLength = rephrasing.count - (nextWord!.replacingOccurrences(of: " ", with: "")).count
		rephrasing = String(rephrasing.suffix(newLength))
		nextWord = findWord(rephrasing, spelling, minWordLength)
		
		if (nextWord == nil) {
			return result
		}
		
		result! += " "
	}
	
	return result
}

func findWord(_ phrase: String, _ spelling: Spelling, _ minWordLength: Int) -> String? {
	if phrase.count < minWordLength {
		return nil
	}
	
	for i in minWordLength...phrase.count {
		let potentialWord = String(phrase.prefix(i))
		let spellingResult = spelling.isCorrect(potentialWord.lowercased())
		
		if potentialWord.count == 0 {
			if minWordLength < 0 {
				assertionFailure("max call stack")
			}
			
			return nil
			
		} else if potentialWord.count == 1 {
			if potentialWord == "A" {
				return "a"
			}
		}
		
		if potentialWord.count >= minWordLength {
			if spellingResult {
				return potentialWord.lowercased()
			}
		}
	}

	return nil
}





print("\"" + (rephrase(phrase: "igaveyouthechanceofaidingmewillingly", spelling: Spelling(), minWordLength: 1) ?? "-1") + "\"")






