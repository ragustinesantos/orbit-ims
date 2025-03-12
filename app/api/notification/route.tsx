import { z } from 'zod';
import { dbAddItem, dbGetAllItems } from '@/app/_services/items-service';

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY});


export async function POST(request: Request) {


    try {
        mg.messages.create('sandbox-123.mailgun.org', {
            from: "Excited User <mailgun@YOUR-SANDBOX-DOMAIN>",
            to: ["test@example.com"],
            subject: "Hello",
            text: "Testing some Mailgun awesomness!",
            html: "<h1>Testing some Mailgun awesomness!</h1>"
          })

        

    }catch(error) {

    }

}