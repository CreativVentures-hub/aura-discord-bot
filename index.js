const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

// Create Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ]
});

// When bot is ready
client.once('ready', () => {
    console.log(`✅ Aura is online as ${client.user.tag}!`);
    client.user.setActivity('Managing Operations', { type: 'WATCHING' });
});

// Listen for messages mentioning the bot
client.on('messageCreate', async (message) => {
    // Ignore messages from other bots
    if (message.author.bot) return;
    
    // Check if bot is mentioned
    if (message.mentions.has(client.user)) {
        const content = message.content.replace(`<@${client.user.id}>`, '').trim();
        
        // Handle different commands
        if (content.toLowerCase().includes('test')) {
            message.reply('🟢 Aura operational! Ready to manage projects.');
        }
        
        if (content.toLowerCase().includes('new client')) {
            message.reply('📋 Ready to process new client. Please provide client details.');
        }
    }
});

// Handle client intake data (from external sources)
async function processClientIntake(clientData) {
    try {
        // Send to n8n webhook
        await axios.post(process.env.N8N_WEBHOOK_URL, {
            body: clientData,
            source: 'discord_bot'
        });
        
        console.log('✅ Client data sent to n8n workflow');
    } catch (error) {
        console.error('❌ Error processing client intake:', error);
    }
}

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
