import express from 'express';
import { Client, GuildMember, Collection } from 'discord.js';
import fetch from 'node-fetch';
import xml2js from 'xml2js';
const { stripPrefix } = xml2js.processors;

const app = express();
const port = 3000;

const SSO = 'https://sso.ui.ac.id/cas2';
const URI = (id) => encodeURI(`${process.env.SERVICE_URI || "http://localhost:3000"}/callback/${id}`);

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

      const role = user.guild.roles.cache
        .find((role) => role.name == "Authorized");
      user.roles.add(role);
      
      verifyRequests.delete(req.params.id);
      user.send(`Your data has been verified, welcome to UKOR ${data.attributes[0].nama}`);
      res.send(`
        <h1>
          Akun SSO anda telah sukses di verifikasi
        </h1>
        <p>
          Selamat datang di UKOR FASILKOM UI, ${data.attributes[0].nama}
        </p>
      `);
    } else {
      res.send(`
        <h1>
          Verifikasi Gagal
        </h1>
        <p>
          Silahkan melakukan verifikasi ulang dengan mengirim u!verify ke channel #verification-request.
        </p>
      `);
    }
  })

  app.listen(port, () => {
    console.log(`HTTP Server listening at ${process.env.SERVICE_URI || "http://localhost:3000"}`);
  });
};

export default http;
