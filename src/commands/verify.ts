import Discord from 'discord.js';
import Command from '../types/command';
import { nanoid } from 'nanoid';
import { verifyRequests } from '../index';

const verify: Command = {
  name: "Verify",
  description: "Self explanatory.",
  execute: (message: Discord.Message, args: Array<string>) => {
    const request = verifyRequests.filter((item) => item.id === message.member.id);
    if (request.size != 0){
      message.reply("Link verifikasi telah terkirim ke DM anda.");
      message.member.send(`Selamat datang di UKOR Fasilkom UI! Silahkan melakukan verifikasi akun SSO UI dengan membuka tautan berikut ini: ${process.env.SERVICE_URI || "https://localhost:3000"}/verify/${request.keyArray()[0]}`);
    }
    else {
      const identifier = nanoid();
      verifyRequests.set(identifier, message.member);
      message.reply("Link verifikasi telah terkirim ke DM anda.")
      message.member.send(`Selamat datang di UKOR Fasilkom UI! Silahkan melakukan verifikasi akun SSO UI dengan membuka tautan berikut ini: ${process.env.SERVICE_URI || "https://localhost:3000"}/verify/${identifier}`);
    }
  },
};

module.exports = verify;
