import { createClient } from "contentful";
import contentful from "contentful-management";
import dotenv from "dotenv";
dotenv.config({ path: "/Users/shane.chaffe/Documents/Code/codeSnippetsCtfl/.env.local" });

// This is for Philips
const spaceId = process.env.CONTENTFUL_SPACE_ID;
const environmentId = "stg";

// createClient
const jsClient = createClient({
  space: spaceId,
  host: "preview.contentful.com",
  environment: environmentId,
  accessToken: process.env.CONTENTFUL_CPA_KEY,
});

const fetchEntriesWithoutTitleAndDelete = async () => {
  try {
    const managementClient = contentful.createClient(
      {
        accessToken: process.env.CONTENTFUL_CMA_KEY,
      },
      { type: "plain" }
    );

    const contentTypes = await managementClient.contentType.getMany({
      spaceId,
      environmentId,
    });

    // console.log("Content Types =", contentTypes);

    const contentTypeInfo = contentTypes.items.map((contentType) => ({
      id: contentType.sys.id,
      displayField: contentType.displayField,
    }));

    const allUntitledEntries = [];

    for (const { id: contentTypeID, displayField } of contentTypeInfo) {
      try {
        const entriesWithoutDisplayField = await jsClient.getEntries({
          [`fields.${displayField}[exists]`]: false,
          content_type: contentTypeID,
        });

        const untitledEntryIds = entriesWithoutDisplayField.items.map(
          (untitledEntry) => untitledEntry.sys.id
        );

        if (untitledEntryIds.length > 0) {
          console.log(`🚨 Found Untitled Entries =`, untitledEntryIds);
          allUntitledEntries.push(...untitledEntryIds);
        }
      } catch (error) {
        console.error(
          `Error fetching data for content type "${contentTypeID}":`,
          error
        );
      }
    }

    console.log(`✅ All Untitled Entries Collected:`, allUntitledEntries);
    console.log(`🚨 There are ${allUntitledEntries.length} untitled entries`);

    // Delete each untitled entry
    for (const entryId of allUntitledEntries) {
      try {
        await managementClient.entry.delete({
          spaceId,
          environmentId,
          entryId,
        });
        console.log(`🗑️ Successfully deleted entry: ${entryId}`);
      } catch (error) {
        console.error(`❌ Error deleting entry ${entryId}:`, error);
      }
    }
  } catch (error) {
    console.error("Error fetching entries:", error);
  }
};

fetchEntriesWithoutTitleAndDelete();
