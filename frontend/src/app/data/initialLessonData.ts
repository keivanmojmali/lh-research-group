export default function initialLessonData(documentName: string): string {
  let variableValue: string = "";

  switch (documentName.toLowerCase()) {
    case "CKLA-G1-LL-Scope-and-Sequence":
      variableValue =
        "The Listening & Learning strand of the Core Knowledge Language Arts program is designed to help students build thebackground knowledge and vocabulary critical to listening and reading comprehension. Through introducing, presenting,and discussing read-alouds in each domain, teachers build students’ listening and reading comprehension and orallanguage skills. For a Unit-by-Unit Alignment of Listening & Learning objectives to the Common Core State Standards,please visit http://www.engageny.org/resource/grade-1-english-language-arts.Each domain anthology is comprised of daily lessons, pausing points, a domain review, a domain assessment, andculminating activities.• Pausing Points: opportunities to review, reinforce, or extend the content taught thus far. Both the decision to pauseand the length of the pause are optional and should be determined by each individual teacher based on the particularclass’s performance.• Domain Review: an opportunity to review and reinforce the material (e.g., core content and vocabulary) in the domainin order to help students prepare for the domain assessment.• Domain Assessment: evaluates students’ understanding and retention of academic vocabulary words and the corecontent targeted in the domain. The results should guide review and remediation the following day.• Culminating Activities: provide remediation and/or enrichment for individual students, small groups, or the whole classbased on the results of the Domain Assessment and students’ Tens scores.";
      break;
    // Add more cases for other document names here
    default:
      break;
  }

  return variableValue ? variableValue.toString() : "";
}
