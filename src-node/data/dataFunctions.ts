export function getReadingLevelAttributes(
  grade: string,
  typeOfPassage: string
): { [key: string]: string } {
  const attributes = {
    Fiction: {
      kindergarten: {
        wordCount: "20-50 words",
        sentenceStructure: "Primarily simple sentences",
        vocabulary: "Basic, frequently-used words",
        content:
          "Simple and relatable stories, often with repetitive themes and patterns",
      },
      "1st": {
        wordCount: "50-100 words",
        sentenceStructure: "Simple sentences with a few compound sentences",
        vocabulary: "Familiar words and sight words",
        content:
          "Simple stories focusing on everyday experiences and imaginative themes",
      },
      "2nd": {
        wordCount: "100-150 words",
        sentenceStructure: "A mix of simple and compound sentences",
        vocabulary: "Simple and some grade-level words",
        content:
          "Stories with clear sequences and basic conflicts and resolutions",
      },
      "3rd": {
        wordCount: "150-200 words",
        sentenceStructure: "Introduction to complex sentences",
        vocabulary: "Introduction to varied vocabulary",
        content:
          "Introduction to character development and simple plot structures",
      },
      "4th": {
        wordCount: "200-250 words",
        sentenceStructure: "Varied sentence starters",
        vocabulary:
          "Varied vocabulary and introduction to multi-syllabic words",
        content: "Introduction to different settings and more complex plots",
      },
      "5th": {
        wordCount: "250-300 words",
        sentenceStructure: "Greater variation in sentence structure",
        vocabulary: "Introduction to figurative language",
        content: "Expanding on character development and introducing sub-plots",
      },
      "6th": {
        wordCount: "300-375 words",
        sentenceStructure: "Balanced mix of sentence structures",
        vocabulary: "Introduction to more abstract and nuanced vocabulary",
        content: "Introduction to themes and symbolism in stories",
      },
      "7th": {
        wordCount: "375-425 words",
        sentenceStructure: "Rich variation with emphasis on rhetorical devices",
        vocabulary: "Advanced vocabulary with more sophisticated language",
        content: "Exploration of complex themes and multiple storylines",
      },
      "8th": {
        wordCount: "425-500 words",
        sentenceStructure: "Advanced structures and nuanced transitions",
        vocabulary: "Advanced figurative language and complex vocabulary",
        content: "In-depth exploration of characters, themes, and symbolism",
      },
      "9th": {
        wordCount: "500-575 words",
        sentenceStructure: "Advanced and varied sentence structures",
        vocabulary: "Rich and sophisticated vocabulary",
        content:
          "Exploration of literary techniques and deeper themes in narratives",
      },
      "10th": {
        wordCount: "575-650 words",
        sentenceStructure: "Emphasis on cohesion and sophisticated structures",
        vocabulary: "Advanced and nuanced vocabulary",
        content:
          "Intensive exploration of complex literary themes and structures",
      },
      "11th": {
        wordCount: "650-725 words",
        sentenceStructure: "Sophisticated structures and rhetorical techniques",
        vocabulary: "High-level figurative language and literary terms",
        content:
          "In-depth exploration of character motivations and literary themes",
      },
      "12th": {
        wordCount: "725-800 words",
        sentenceStructure: "Intricate, layered sentence structures",
        vocabulary: "Mastery of advanced and sophisticated vocabulary",
        content:
          "Complex narratives exploring extensive themes and diverse literary techniques",
      },
    },
    Nonfiction: {
      kindergarten: {
        wordCount: "20-50 words",
        sentenceStructure: "Primarily simple sentences",
        vocabulary: "Basic, frequently-used words",
        content:
          "Simple facts about familiar subjects, primarily concrete concepts",
      },
      "1st": {
        wordCount: "50-100 words",
        sentenceStructure: "Simple sentences with a few compound sentences",
        vocabulary: "Continuation of sight words",
        content: "Simple informative content on known and tangible topics",
      },
      "2nd": {
        wordCount: "100-150 words",
        sentenceStructure: "A mix of simple and compound sentences",
        vocabulary: "Introduction to subject-specific words",
        content:
          "More detailed information on familiar topics with clear main idea",
      },
      "3rd": {
        wordCount: "150-200 words",
        sentenceStructure: "Introduction to complex sentences",
        vocabulary: "Broader range of subject-specific vocabulary",
        content:
          "Introduction to different text structures and information categorization",
      },
      "4th": {
        wordCount: "200-250 words",
        sentenceStructure: "Varied sentence starters",
        vocabulary: "Introduction to technical terminology",
        content:
          "Multi-paragraph texts focusing on specific topics with supporting details",
      },
      "5th": {
        wordCount: "250-300 words",
        sentenceStructure:
          "Even greater variation in sentence length and structure",
        vocabulary: "Introduction to more complex technical terms",
        content:
          "Different perspectives on a topic and introduction to argument structure",
      },
      "6th": {
        wordCount: "300-375 words",
        sentenceStructure: "A balanced mix of sentence structures",
        vocabulary: "Abstract and more complex terminology",
        content:
          "Introduction to advanced text structures and integration of multiple sources",
      },
      "7th": {
        wordCount: "375-425 words",
        sentenceStructure: "Rich variation with emphasis on rhetorical devices",
        vocabulary: "Introduction to specialized jargon",
        content: "Analysis and synthesis of information from varied sources",
      },
      "8th": {
        wordCount: "425-500 words",
        sentenceStructure: "Mastery of varied structures",
        vocabulary: "Advanced technical and subject-specific vocabulary",
        content:
          "Critical evaluation of information and integration of diverse perspectives",
      },
      "9th": {
        wordCount: "500-575 words",
        sentenceStructure: "A combination of varied sentence structures",
        vocabulary: "Advanced abstract and nuanced vocabulary",
        content:
          "Complex analysis of topics and synthesis of multiple information sources",
      },
      "10th": {
        wordCount: "575-650 words",
        sentenceStructure: "Emphasis on fluidity and cohesion in complex texts",
        vocabulary: "Specialized and sophisticated vocabulary",
        content:
          "In-depth exploration and evaluation of topics with multiple viewpoints",
      },
      "11th": {
        wordCount: "650-725 words",
        sentenceStructure:
          "Mastery of varied structures with sophisticated rhetoric",
        vocabulary: "High-level specialized and technical vocabulary",
        content: "Advanced critical analysis and synthesis of complex subjects",
      },
      "12th": {
        wordCount: "725-800 words",
        sentenceStructure: "Emphasis on intricate, layered sentence structures",
        vocabulary:
          "Mastery of advanced, specialized, and technical vocabulary",
        content:
          "Comprehensive exploration of complex topics with nuanced insights",
      },
    },
  };

  return attributes[typeOfPassage][grade] || {};
}
