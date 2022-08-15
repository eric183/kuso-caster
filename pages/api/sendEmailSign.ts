// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from 'sanity';
import { FeedType } from 'types/feed';
import nodemailer from 'nodemailer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT as unknown as number,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_LOGIN_EMAIL, // generated ethereal user
      pass: process.env.SMTP_PASSWORD, // generated ethereal password
    },
  });

  const user = (
    await sanityClient.fetch(`*[_type == "user" && email == $email]`, {
      email: req.query.email,
    })
  )[0];

  if (!user) {
    res.status(400).json({
      error: 'User not found',
    });
    return;
  }
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'kk297466058@gmail.com', // sender address
    to: `${req.query.email}`, // list of receivers
    subject: 'kuso-caster password found', // Subject line
    text: 'Your password is found', // plain text body
    html: `<b>Here is the password: ${user.password}</b>`, // html body
  });

  res
    .status(200)
    .json({ text: 'Your password is sent to your email, please check it out' });
}
