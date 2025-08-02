/* eslint-disable import/prefer-default-export */

import { FROM_EMAIL, SMS_BASE_URL } from 'src/config/env';
import axios from 'axios';
import nodemailer, { TransportOptions } from 'nodemailer';
import { google } from 'googleapis';
import logger from './logger';

const clientId = process.env.OAUTH2_CLIENT_ID;
const clientSecret = process.env.OAUTH2_CLIENT_SECRET;
const refreshToken = process.env.OAUTH2_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  'https://developers.google.com/oauthplayground',
);

oauth2Client.setCredentials({
  refresh_token: refreshToken,
});

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  logger.debug(`EMAIL TO: ${to}, SUBJECT: ${subject}, HTML: ${html}`);
  if (!FROM_EMAIL) return;

  try {
    const accessToken = await oauth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'ssfstatesyndicate@gmail.com',
        clientId,
        clientSecret,
        refreshToken,
        accessToken: accessToken.token,
      },
      tls: {
        rejectUnauthorized: false,
      },
    } as TransportOptions);

    const res = await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
    logger.debug(res);
  } catch (err) {
    logger.error(`Error sending email: ${err}`);
    throw err;
  }
};

export const sendSMS = async ({
  to,
  message,
  templateId,
}: {
  to: string;
  message: string;
  templateId: string;
}) => {
  logger.debug(`SMS TO: ${to}, MESSAGE: ${message}`);
  if (!SMS_BASE_URL) return;

  try {
    const smsUrl = `${SMS_BASE_URL}&mobile=${to}&message=${message}&tid=${templateId}`;
    const res = await axios.get(smsUrl);
    if (!res.data.includes('Sent Successfully')) {
      throw res.data;
    }
    logger.debug(res.data);
  } catch (err) {
    logger.error(`Error sending SMS: ${err}`);
    throw err;
  }
};
