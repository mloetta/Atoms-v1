const { ActivityType } = require("discord.js");
const EventBuild = require("../utils/event.build");

const activities = [
  { name: 'Competing in Minecraft Bedwars.', type: ActivityType.Playing },
  { name: 'c148 - Aria Math.', type: ActivityType.Listening },
  { name: 'melo\'s code.', type: ActivityType.Watching },
  { name: 'fortnite bugha vs kreo.', type: ActivityType.Streaming, url: 'https://www.twitch.tv/chillhopradio' }
];

let activityIndex = 0;

module.exports = new EventBuild(
  "ready",
  "ready",
  async (client) => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Function to set activity
    const setActivity = () => {
      const activity = activities[activityIndex];
      client.user.setPresence({
        activities: [{ name: activity.name, type: activity.type, url: activity.url }],
        status: 'online'
      });
      activityIndex = (activityIndex + 1) % activities.length;
    };

    // Set activity rotation every 1 min
    setInterval(setActivity, 100 * 1000);
  }
);