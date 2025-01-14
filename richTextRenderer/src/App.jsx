import React, { useState, useEffect } from "react";
import { BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import "./App.css";

const richTextQuery = `
query {
  richTextResponse(id: "3sX1omATGay16pVFWTAreM") {
    test { 
      json
      links {
        entries {
          block {
            __typename
            ... on Card {
              title
              description
            }
          }
        }
      }
    }
  }
}
`;

const fetchFunction = async () => {
  const response = await fetch(
    "https://graphql.contentful.com/content/v1/spaces/zjwnk63fhue4/environments/master",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer OYUyxBkiK6II8CKMlDSShgFCMcfusNs7X1-kqhCFycA",
      },
      body: JSON.stringify({ query: richTextQuery }),
    }
  );

  const data = await response.json();

  return data;
};

function App() {
  const [richTextData, setRichTextData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await fetchFunction();
      setRichTextData(data);
    };

    fetchData();
  }, []);

  console.log("rich text data = ", richTextData);

  const RichTextOptions = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => {
        return <p>{children}</p>;
      },
      [INLINES.HYPERLINK]: (node, children) => {
        return (
          <a target="_blank" href={node.data.uri}>
            {children}
          </a>
        );
      },
      [BLOCKS.TABLE]: (node, children) => {
        return (
          <table style={{ backgroundColor: "red" }}>
            <tbody>{children}</tbody>
          </table>
        );
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        console.log("node", node.data.target.sys.id);
        const id = node.data.target.sys.id;
        const entry = richTextData;
        if (entry.length < 1) {
          return console.log("nothing found")
        }
      
        console.log("entry", entry?.richTextResponse.test.links.entries.block);
        // consider mapping if you have more embedded entries
        const { title, description } = entry?.richTextResponse.test.links.entries.block[0];

        return (
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        );
      },
    },
  };

  return (
    <div>
      {richTextData &&
        richTextData.richTextResponse &&
        richTextData.richTextResponse.test &&
        documentToReactComponents(
          richTextData.richTextResponse.test.json,
          RichTextOptions
        )}
    </div>
  );
}

export default App;
