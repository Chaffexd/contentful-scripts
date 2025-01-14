const contentful = require("contentful-management");

const cma = contentful.createClient(
  {
    accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN_NA,
  },
  {
    type: "plain",
    defaults: {
      spaceId: "auzjf8fz9kg1",
      environmentId: "testlab",
    },
  }
);

const myFn = async () => {
  const asset1 = await cma.asset.get({ assetId: "5shLAd5ebvFEsHODBmcdEX" });
  const asset2 = await cma.asset.get({
    "fields.title[match]": "editor-homepage-config",
  });
  const asset3 = await cma.asset.get({
    "metadata.tags.sys.id[in]": "editorHomepageConfig",
  });

  console.log("Asset 1 =", asset1);
  /*   console.log("Asset 2 =", asset2);
        console.log("Asset 3 =", asset3); */
};

myFn()