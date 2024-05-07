import { v4 as uuid } from "uuid";

interface Data {
  [key: string]: string;
}

interface PartialBlock {
  id: string;
  content: string;
}

function getLayoutBlocks(key: string): PartialBlock[] {
  switch (key) {
    case "planning_period_header":
      return [
        {
          id: uuid(),
          type: "heading",
          props: {
            textColor: "default",
            backgroundColor: "default",
            textAlignment: "left",
            level: 2,
          },
          content: [
            {
              type: "text",
              text: "Name:",
              styles: {},
            },
          ],
          children: [],
        },
        {
          id: uuid(),
          type: "heading",
          props: {
            textColor: "default",
            backgroundColor: "default",
            textAlignment: "left",
            level: 2,
          },
          content: [
            {
              type: "text",
              text: "Date:",
              styles: {},
            },
          ],
          children: [],
        },
        {
          id: uuid(),
          content: " ",
        },
      ] as PartialBlock[];
    default:
      return [];
  }
}

//creates an array of partial blocks - each line is a block and each paragraph gets an empty content block between it for spacing
export function createBlocksFromStr(str: string): PartialBlock[] {
  let currentContent: string = "";
  let newFileContent: PartialBlock[] = [];

  for (let i = 0; i < str.length; i++) {
    if (str[i] === "\n" && str[i + 1] !== "\n") {
      // End of a line but not a paragraph
      // Push the currentContent if it's not empty, then reset currentContent
      if (currentContent.trim()) {
        newFileContent.push({
          id: uuid(),
          content: currentContent.trim(),
        });
        currentContent = ""; // Reset current content for the next block
      }
      currentContent += str[i]; // Include the newline character in the next content
    } else if (str[i] === "\n" && str[i + 1] === "\n") {
      // End of a paragraph
      if (currentContent.trim()) {
        newFileContent.push({
          id: uuid(),
          content: currentContent.trim(),
        });
        currentContent = ""; // Reset current content for the next block
      }
      // Push an additional block for the paragraph break
      newFileContent.push({
        id: uuid(),
        content: " ",
      });
      i++; // Skip the next newline character as it's part of the paragraph break
    } else {
      // Continue accumulating characters into the current content
      currentContent += str[i];
    }
  }
  // After the loop, check if there's any remaining content to push
  if (currentContent.trim()) {
    newFileContent.push({
      id: uuid(),
      content: currentContent.trim(),
    });
  }

  return newFileContent;
}
