const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');

//dotenv
const dotenv = require('dotenv')
dotenv.config()
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//importando comandos
const fs = require('node:fs')
const path = require('node:path')

const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

client.commands = new Collection()

for (const file of commandFiles){
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    if('data' in command && 'execute' in command){
        client.commands.set(command.data.name, command)
    }else{
        console.log('Esse comando em '+ filePath + ' esta com "data" ou "execute" ausente')
    }
}

console.log(client.commands)

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`PRONTO LIGOU MAJOR! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(TOKEN);

//LISTENER DE INTERACOES
client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand()) return
    const command = interaction.client.commands.get(interaction.commandName)
    if(!command){
        console.log('comando nao encontrado')
        return
    }
    try{
        await command.execute(interaction)
    }catch(err){
        console.error(err)
        await interaction.reply("Houve um erro ao executar esse comando!")
    }
})
