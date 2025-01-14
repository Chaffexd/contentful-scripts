const { richTextFromMarkdown } = require("@contentful/rich-text-from-markdown");

const demoFn = async () => {
  const document = await richTextFromMarkdown(`* item1 * item2`)
  console.log("doc", JSON.stringify(document, null, 4))
};

demoFn();
