import sys

import nltk
from nltk.tokenize import word_tokenize
import re
import spacy
import syllapy
from nltk.corpus import cmudict
import textstat

# Load the spaCy language model
nlp = spacy.load("en_core_web_sm")

# Download necessary NLTK resources
nltk.download("punkt")
nltk.download("cmudict")

# Initialize the CMU Pronouncing Dictionary
d = cmudict.dict()


def count_syllables_in_word(word):
    """Return the number of syllables in a word, using cmudict or falling back to syllapy."""
    if word.lower() in d:
        return max(
            [len(list(y for y in x if y[-1].isdigit())) for x in d[word.lower()]]
        )
    else:
        return syllapy.count(word)


def clean_text_for_tokenization(text):
    """Clean the text to prepare for tokenization."""
    text = text.replace("\xa0", " ").replace("\n", " ")
    text = re.sub(r"[^\w\s\'.-]", "", text)
    return text


def segment_text_into_sentences(text):
    """segment text into sentences"""
    doc = nlp(text)
    return [sent.text.strip() for sent in doc.sents]


def tokenize_text(text):
    """Tokenize the text into words."""
    return word_tokenize(text)


def get_fk_readability_score(text):
    """Analyze the text to calculate its Flesch-Kincaid Readability score."""
    cleaned_text = clean_text_for_tokenization(text)
    sentences = segment_text_into_sentences(cleaned_text)
    words = tokenize_text(cleaned_text)
    syllables = sum(count_syllables_in_word(word) for word in words)

    total_words = len(words)
    total_sentences = len(sentences)
    total_syllables = syllables

    print(
        f"Words: {total_words}, Sentences: {total_sentences}, Syllables: {total_syllables}"
    )

    fk_grade = (
        0.39 * (total_words / total_sentences)
        + 11.8 * (total_syllables / total_words)
        - 15.59
    )
    return fk_grade
