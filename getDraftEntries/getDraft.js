const contentful = require("contentful");

// this snippet will return only entries in draft status

const client = contentful.createClient({
  space: "svpfxqr57hom",
  accessToken: CONTENTFUL_CPA_KEY, // preview key
  environment: "master",
  host: "preview.contentful.com",
});

client
  .getEntries({
    content_type: "post",
  })
  .then((response) =>
    console.log(
      "repsonse",
      response.items.filter((item) => item.sys.revision === 0)
    )
  )
  .catch(console.error);
