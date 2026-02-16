import { FlashcardFormData } from "../types";
import { DICTIONARY_API_URL } from "../constants";

type DictionaryApiResponse = {
  word: string;
  phonetic?: string;
  phonetics?: { text?: string }[];
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
    }[];
  }[];
}[];

export async function fetchWordDefinition(
  word: string,
): Promise<FlashcardFormData> {
  const trimmedWord = word.trim();

  if (!trimmedWord) {
    return createEmptyFormData();
  }

  try {
    const response = await fetch(`${DICTIONARY_API_URL}/${trimmedWord}`);

    if (!response.ok) {
      return createEmptyFormData(trimmedWord);
    }

    const data: DictionaryApiResponse = await response.json();
    return parseApiResponse(data);
  } catch (error) {
    console.error("Failed to fetch definition:", error);
    return createEmptyFormData(trimmedWord);
  }
}

function parseApiResponse(data: DictionaryApiResponse): FlashcardFormData {
  const entry = data[0];
  const meaning = entry.meanings[0];
  const definition = meaning.definitions[0];

  return {
    word: entry.word,
    phonetic: entry.phonetic || entry.phonetics?.[0]?.text || "",
    partOfSpeech: meaning.partOfSpeech || "",
    definition: definition.definition || "",
    example: definition.example || "",
    vietnamese: "",
  };
}

function createEmptyFormData(word: string = ""): FlashcardFormData {
  return {
    word,
    phonetic: "",
    partOfSpeech: "",
    definition: "",
    example: "",
    vietnamese: "",
  };
}

export function speakWord(word: string): void {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}
