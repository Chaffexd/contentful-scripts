import { SidebarAppSDK } from "@contentful/app-sdk";
import { Paragraph } from "@contentful/f36-components";
import {
  /* useCMA, */ useFieldValue,
  useSDK,
} from "@contentful/react-apps-toolkit";
import { useState } from "react";

const Sidebar = () => {
  const sdk = useSDK<SidebarAppSDK>();

  // by default shows en-US as it's the default language
  const [locales, setLocales] = useFieldValue("locales");

  // comes in the shape of an array of strings
  console.log("FIELD VALUE = ", locales);
  // then gql query can be made
  /* query {
    articleCollection(locale: "en") {
      items {
        slug
      }
    }
  } */

  return (
    <Paragraph>
      Selected Locales:{" "}
      {
        // @ts-expect-error
        locales.map((locale: any) => (
          <li>{locale}</li>
        ))
      }
    </Paragraph>
  );
};

export default Sidebar;
