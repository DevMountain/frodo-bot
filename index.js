require(`dotenv`).config()
const { GH_TOKEN, BOT_TOKEN } = process.env
const { Octokit } = require("@octokit/core")
const Discord = require(`discord.js`)
const client = new Discord.Client()
const octokit = new Octokit({ auth: GH_TOKEN })

//create issue in actual dm repo
const createIssue = async (title, label, body) => {
  octokit.request(`POST /repos/{owner}/{repo}/issues`, {
      owner: `DevMountain`,
      repo: `frodo`,
      title, 
      body, 
      labels: [label]
    })
}

//create issue in my test repo
// const createIssue = async (title, label, body) => {
//   let {data: {html_url}} = await octokit.request(`POST /repos/{owner}/{repo}/issues`, {
//     owner: `rileyeh`,
//     repo: `discord-bot-test`,
//     title, 
//     body, 
//     labels: [label]
//   })

//   return html_url
// }

client.on(`ready`, () => {
    console.log(`You're signed in as ${client.user.username}`)
})

const errMsg = `Your message should contain exactly 3 **semi-colon** separated values. Don't worry about casing or spacing.
    
1: 'bug' or 'feature' so that I know where to send the request. 
2: the title of the request/report.
3: the description.

For example: ${"```"}bug; Download Link Broken; Clicking on download link for HTML/CSS lab exercise doesn't work on MacOS 11.4 and Chrome 92${"```"}`


client.on(`message`, async (message) => {
  let msgArr = message.content.split(`;`)
  let [type, title, desc] = msgArr

  if (client.user.username === message.author.username || message.channel.type !== 'dm') return

  if (!type || !title || !desc || msgArr.length > 3) {
    message.channel.send(errMsg)
    return
  }

  type = type.toLowerCase().trim()
  title = title.trim()
  desc = desc.trim()
    
  if (type === `bug` || type === `feature`) {
    let msgType = type === `bug` ? `Bug Report` : `Feature Request`
    let issueTitle = `${title} | ${msgType} from ${message.author.username}`
    let url = await createIssue(issueTitle, type, desc)
    message.channel.send(`Your ${msgType} has been submitted to GitHub and can be viewed/modified at the following link, thanks! ${url}`)
  } else {
    message.channel.send(errMsg)
    return
  }
})


client.login(BOT_TOKEN)