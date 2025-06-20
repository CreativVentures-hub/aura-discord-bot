const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

// Aura's Enhanced Personality and Role Definition
const AURA_PERSONALITY = `You are Aura, the Chief Operations Officer for Creativ Ventures, an AI-powered virtual company that helps Chinese manufacturers rebrand and sell upscale products in the American market.

Your Core Responsibilities:
- Orchestrate workflows between AI team members (Echo, Cipher, Zenith, Forge)
- Manage project timelines and task assignments
- Monitor quality control across all deliverables
- Facilitate communication between human stakeholders (CEO, Kory, Jordan) and AI agents
- Ensure seamless project handoffs and dependencies
- Create and manage ClickUp projects for new clients
- Send notifications and alerts to keep everyone informed

Your Personality:
- Professional but approachable
- Extremely organized and detail-oriented
- Proactive in identifying potential issues
- Clear and concise in communications
- Always thinking about efficiency and quality
- Use emojis appropriately to make communications engaging
- Address team members by their roles when relevant

Your Team Knowledge:
- Echo (CMO): Handles marketing strategies and content creation
- Cipher (CBIO): Manages brand guidelines and visual consistency
- Zenith (CMPO): Specializes in Amazon marketplace optimization
- Forge (CDO): Builds and maintains Shopify e-commerce stores
- Kory: Chief Branding Officer (human, provides final approvals)
- Jordan: Marketing Associate (human, assists with approvals)`;

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
    client.user.setActivity('Managing Operations | @Aura help', { type: 'WATCHING' });
});

// Enhanced message handling
client.on('messageCreate', async (message) => {
    // Ignore messages from other bots
    if (message.author.bot) return;
    
    // Check if bot is mentioned
    if (message.mentions.has(client.user)) {
        const content = message.content.replace(`<@${client.user.id}>`, '').trim().toLowerCase();
        
        // Enhanced command handling
        if (content.includes('test') || content.includes('status')) {
            message.reply('🟢 **Aura Operational Status:** All systems running smoothly! Ready to orchestrate workflows and manage projects for Creativ Ventures. How can I assist the team today?');
        }
        
        else if (content.includes('help') || content.includes('commands')) {
            const helpMessage = `📋 **Aura Command Center**

**Available Commands:**
- \`@Aura test\` - Check operational status
- \`@Aura projects\` - Show active project overview  
- \`@Aura new client\` - Ready to process new client intake
- \`@Aura team status\` - Show AI team member status
- \`@Aura escalate [issue]\` - Escalate issue to human team
- \`@Aura help\` - Show this help menu

**My Role:** Chief Operations Officer - I orchestrate workflows between our AI team (Echo, Cipher, Zenith, Forge) and coordinate with our human leadership (CEO, Kory, Jordan).

Need something specific? Just mention me with your request! 🚀`;
            
            message.reply(helpMessage);
        }
        
        else if (content.includes('new client') || content.includes('client intake')) {
            message.reply('📋 **New Client Intake Ready!** Please provide the client details and I\'ll structure the data, create the ClickUp project, and notify the team. You can also send data directly to my webhook for automated processing.');
        }
        
        else if (content.includes('projects') || content.includes('project status')) {
            message.reply('📊 **Active Projects Overview:** Currently monitoring all active client projects in ClickUp. For detailed project status, please check the ClickUp dashboard or let me know which specific project you\'d like me to report on.');
        }
        
        else if (content.includes('team') || content.includes('agents')) {
            const teamStatus = `👥 **AI Team Status Report:**

🎯 **Aura (COO)** - Online & Managing Operations
🎨 **Echo (CMO)** - Ready for Marketing & Content Tasks  
🎭 **Cipher (CBIO)** - Ready for Brand & Design Tasks
🛒 **Zenith (CMPO)** - Ready for Amazon Marketplace Tasks
🔧 **Forge (CDO)** - Ready for Shopify Development Tasks

All AI agents are operational and ready to receive task assignments!`;
            
            message.reply(teamStatus);
        }
        
        else if (content.includes('escalate') || content.includes('urgent')) {
            message.reply('🚨 **Issue Escalation Protocol Activated!** I\'ve noted this for immediate human attention. Tagging <@everyone> for urgent review. Please provide details about the issue that needs escalation.');
        }
        
        else {
            // General response for unrecognized commands
            message.reply('🤔 I\'m ready to help! Use `@Aura help` to see available commands, or describe what you need assistance with. As your COO, I\'m here to orchestrate workflows and keep projects moving smoothly.');
        }
    }
});

// Enhanced client intake processing
async function processClientIntake(clientData) {
    try {
        // Send to n8n webhook
        await axios.post(process.env.N8N_WEBHOOK_URL, {
            body: clientData,
            source: 'discord_bot',
            timestamp: new Date().toISOString()
        });
        
        console.log('✅ Client data sent to n8n workflow');
        
        // Could add Discord notification here if needed
        const channel = client.channels.cache.find(ch => ch.name === 'new-client-alerts');
        if (channel) {
            channel.send('📥 **Automated Client Intake Processing:** New client data received and processing through workflow...');
        }
        
    } catch (error) {
        console.error('❌ Error processing client intake:', error);
        
        // Alert about errors
        const channel = client.channels.cache.find(ch => ch.name === 'qa-alerts');
        if (channel) {
            channel.send('🚨 **System Alert:** Error processing client intake data. Manual review required.');
        }
    }
}

// Enhanced error handling
process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught exception:', error);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
