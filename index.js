const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.once('ready', () => {
  console.log(`ログイン成功: ${client.user.tag}`);
});

client.on('messageCreate', async message => {

  if (message.content.startsWith('!play')) {

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply("VCに入ってください");
    }

    const url = message.content.split(' ')[1];

    if (!url) {
      return message.reply("YouTubeリンクを入れてください");
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator
    });

    const stream = ytdl(url, { filter: 'audioonly' });

    const player = createAudioPlayer();
    const resource = createAudioResource(stream);

    player.play(resource);
    connection.subscribe(player);

    message.reply("再生します 🎵");
  }

});

client.login(process.env.TOKEN);
