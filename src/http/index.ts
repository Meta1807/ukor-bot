import express from 'express';
import { Client, GuildMember, Collection } from 'discord.js';
import fetch from 'node-fetch';
import xml2js from 'xml2js';
const { stripPrefix } = xml2js.processors;
const jurusan = require('./information.json');

const app = express();
const port = process.env.PORT || 80;

const SSO = 'https://sso.ui.ac.id/cas2';
const URI = (id) => encodeURI(`${process.env.SERVICE_URI || "http://localhost:3000"}/callback/${id}`);

const success = (res, name) => {
  res.send(`
    <h1>
      Akun SSO anda telah sukses di verifikasi
    </h1>
    <p>
      Selamat datang di UKOR FASILKOM UI, ${name}
    </p>
  `);
}

const failed = (res, reason) => {
  res.send(`
    <h1>
      Verifikasi Gagal
    </h1>
    <p>
      ${reason}
    </p>
  `);
}

const http = (client: Client, verifyRequests: Collection<string, GuildMember>) => {
  app.get('/verify/:id', (req, res) => {
    const request = verifyRequests.get(req.params.id);
    if (request)
      res.redirect(`${SSO}/login?service=${URI(req.params.id)}`);
    else
      res.send(`
        <h1>The request does not exist or has expired.</h1>
        <p>Please make another request by typing u!verify in the #verification-request channel.</p>
      `);
  });
  
  app.get('/callback/:id', async (req, res) => {
    const data = await fetch(`${SSO}/serviceValidate?service=${URI(req.params.id)}&ticket=${req.query.ticket}`)
      .then((res) => res.text())
    const parse = await xml2js.parseStringPromise(data, {
      trim: true,
      tagNameProcessors: [stripPrefix],
    });

    if ("authenticationSuccess" in parse.serviceResponse) {
      const data = parse.serviceResponse.authenticationSuccess[0]
      const user = verifyRequests.get(req.params.id)
      if (data.attributes[0].kd_org in jurusan) {
        const role = user.guild.roles.cache
        .find((role) => role.name == process.env.AUTHORIZED_ROLE_NAME);
        user.roles.add(role);
        
        verifyRequests.delete(req.params.id);

        user.send(`Your data has been verified, welcome to UKOR ${data.attributes[0].nama}`);
        return success(res, data.attributes[0].nama);
      } else {
        return failed(res, "Anda bukan mahasiswa Fasilkom UI.")
      }
      
    } else {
      return failed(
        res, 
        "Silahkan melakukan verifikasi ulang dengan mengirim u!verify ke channel #verification-request."
      );
    }
  })

  app.listen(port, () => {
    console.log(`HTTP Server listening at ${process.env.SERVICE_URI || "http://localhost:3000"}`);
  });
};

export default http;
