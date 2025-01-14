import { FieldAppSDK } from "@contentful/app-sdk";
import { Paragraph } from "@contentful/f36-components";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";

const Field = () => {
  const sdk = useSDK<FieldAppSDK>();

  return (
    <Paragraph>
      <input type="file" />
    </Paragraph>
  );
};

export default Field;
