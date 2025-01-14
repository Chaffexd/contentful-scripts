const contentful = require("contentful-management");

// core of API user magement API
const baseUrl = "https://api.contentful.com";
// Team memberships for a team
// const memberships = `/organizations/${organizationId}/teams/${teamId}/team_memberships`;

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN_NA,
});

let currentUserID;

// Call 1: Retrieve the users sys ID
client
  // so you can get firstName + lastName to create fullName and email
  .getCurrentUser()
  .then((user) => {
    currentUserID = user.sys.id;
    const { firstName, lastName, sys } = user;

    const fullName = `${firstName} ${lastName}`;

    // console.log("Full name === ", fullName);
    // console.log("User ID === ", sys.id);

    fetchMemberships(currentUserID);
  })
  .catch(console.error);


client
  .getSpace("eqpzz6sd0w1w")
  .then((space) => space.getTeams())
  .then((teamsCollection) => console.log("TEAMS COLLECTION = ", teamsCollection.items))
  .catch(console.error);

const fetchMemberships = async (userId) => {
  const response = await fetch(
    `${baseUrl}/organizations/<ORGID>/teams/<TEAMID>/team_memberships`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN_NA}`,
      },
    }
  );

  const data = await response.json();

  // console.log("Team Membership data === ", data.items);

  let isInTeam = false;
  let teamName = "";
  let teamID = "";

  data.items.forEach((membership) => {
    // console.log("MEMBERSHIP ", membership.sys)
    // console.log("USER ID", userId)
    if (membership.sys.user.sys.id === userId) {
      isInTeam = true;
      teamName = membership.sys.team.name;
      teamId = membership.sys.team.id;
      return; // Exit forEach loop early since we found the user in a team
    }
  });

  if (isInTeam) {
    // console.log(`User is in team: ${teamName}, Team ID: ${teamId}`);
  } else {
    // console.log("User is not in a team");
  }
};

// fetchMemberships();
