import contentful from "contentful-management";

// Requires Space ID, Env, and Taxonomy concept ID or concept SCHEME ID
const spaceId = "y44f0yph0jif";
const environmentId = "stg";
const taxonomyScheme = {
  sys: {
    type: "Link",
    linkType: "TaxonomyConceptScheme",
    id: "4xBjD8LVpDZPhhgeTQPNHH",
  },
};

const plainClient = contentful.createClient(
  {
    accessToken: process.env.CONTENTFUL_CMA_KEY,
  },
  { type: "plain" }
);

async function addTaxonomyToContentTypes() {
  try {
    const contentTypes = await plainClient.contentType.getMany({
      spaceId,
      environmentId,
    });

    for (const contentType of contentTypes.items) {
      console.log(`Processing content type: ${contentType.name}`);

      // Ensure metadata and taxonomy exist
      contentType.metadata = contentType.metadata || {};
      contentType.metadata.taxonomy = contentType.metadata.taxonomy || [];

      // Check if taxonomy already exists
      const taxonomyExists = contentType.metadata.taxonomy.some(
        (taxonomy) => taxonomy.sys.id === taxonomyLink.sys.id
      );

      if (taxonomyExists) {
        console.log(
          `Taxonomy link already exists for content type: ${contentType.name}`
        );
        continue;
      }

      // Check if adding a new taxonomy exceeds the limit
      if (contentType.metadata.taxonomy.length >= 10) {
        console.log(
          `Cannot add taxonomy link to ${contentType.name} - maximum limit of 10 reached`
        );
        continue;
      }

      // Add taxonomy link
      contentType.metadata.taxonomy.push(taxonomyScheme);

      // Update the content type
      const updatedContentType = await plainClient.contentType.update(
        {
          spaceId,
          environmentId,
          contentTypeId: contentType.sys.id,
        },
        contentType
      );

      console.log(
        `Updated content type: ${updatedContentType.name} (ID: ${updatedContentType.sys.id})`
      );

      // Publish the updated content type
      await plainClient.contentType.publish(
        {
          spaceId,
          environmentId,
          contentTypeId: updatedContentType.sys.id,
        },
        updatedContentType
      );

      console.log(`Published content type: ${contentType.name}`);
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

addTaxonomyToContentTypes();
