require(`dotenv`).config()
const { GH_TOKEN, BOT_TOKEN } = process.env
const { Octokit } = require("@octokit/core")
const Discord = require(`discord.js`)
const client = new Discord.Client()
const octokit = new Octokit({ auth: GH_TOKEN })

const postToTest = async (title, label, body) => {
  octokit.request(`POST /repos/{owner}/{repo}/issues`, {
      owner: `DevMountain`,
      repo: `frodo`,
      title, 
      body, 
      labels: [label]
    })
}

client.on(`message`, message => {
  let type = message.content.split(` `)[0].toLowerCase()

  if (client.user.username === message.author.username || message.channel.type !== 'dm') return

  if (type === `bug` || type === `feature`) {
    let msgType = type === `bug` ? `Bug Report` : `Feature Request`
    let title = `${msgType} from ${message.author.username}`
    postToTest(title, type, message.content)
    message.channel.send(`Your ${msgType} has been submitted to GitHub, thanks!`)
  } else {
    message.channel.send(`The first word of your message needs to be 'bug' or 'feature' (case insensitive) so that I know where to send it.`)
  }
})

client.login(BOT_TOKEN)