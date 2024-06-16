import { User } from "../schema/user";

const tokenTemplate = (data: { name: string; token: string }) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login Token</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f7f7f7;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #4caf50;
        color: white;
        padding: 10px 20px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      }
      .content {
        padding: 20px;
        color: #333333;
      }
      .content p {
        margin: 0 0 20px;
      }
      .token {
        font-size: 24px;
        font-weight: bold;
        background-color: #e0e0e0;
        padding: 10px;
        text-align: center;
        border-radius: 8px;
        margin: 20px 0;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 12px;
        color: #999999;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Stamped</h1>
      </div>
      <div class="content">
        <p>Dear ${data.name},</p>
        <p>Thank you for choosing Stamped. Below is your login token:</p>
        <div class="token">${data.token}</div>
        <p>
          Please use this code within your Stamped Chrome extension to access
          your account.
        </p>
        <p>If you did not request this code, please ignore this email.</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 Stamped. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`;
};

const notifyTemplate = (data: { date: string; location: string }) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Visa Slot Availability Notification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f7f7f7;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #4caf50;
        color: white;
        padding: 10px 20px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      }
      .content {
        padding: 20px;
        color: #333333;
      }
      .content p {
        margin: 0 0 20px;
      }
      .details {
        font-size: 18px;
        font-weight: bold;
        background-color: #e0e0e0;
        padding: 10px;
        text-align: center;
        border-radius: 8px;
        margin: 20px 0;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 12px;
        color: #999999;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Stamped</h1>
      </div>
      <div class="content">
        <p>Dear User,</p>
        <p>
          We are pleased to inform you that a visa slot is now available. Here
          are the details:
        </p>
        <div class="details">
          <p><strong>Dates:</strong> ${data.date}</p>
          <p><strong>Location:</strong> ${data.location}</p>
        </div>
        <p>
          Please log in to your visa account to book your slot as soon as
          possible, as availability is limited.
        </p>
        <p>
          If you did not sign up for visa slot notifications, please ignore this
          email.
        </p>
      </div>
      <div class="footer">
        <p>&copy; 2024 Stamped. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`;
};
export function sendToken({
  to,
  subject,
  token,
}: {
  to: string;
  subject: string;
  token: string;
}): Promise<{ status: boolean; data?: any; error?: any }> {
  return new Promise((resolve, _reject) => {
    const raw = JSON.stringify({
      from: {
        email: "visa@stamped.one",
        name: "Tanish",
      },
      to: [
        {
          email: to,
        },
      ],
      subject: subject,
      html_part: tokenTemplate({ name: to.split("@")[0], token: token }),
    });

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("X-AUTH-TOKEN", process.env.EMAIL_TOKEN || "");
    fetch(`https://stamped.ipzmarketing.com/api/v1/send_emails`, {
      method: "POST",
      headers: headers,
      body: raw,
      redirect: "follow",
    })
      .then((response) => response.text())
      .then((result) => {
        resolve({ status: true, data: result });
      })
      .catch((error) => {
        console.log("error", error);
        resolve({ status: false, error: error });
      });
  });
}

export function notifyUserEmail({
  to,
  subject,
  date,
  location,
}: {
  to: string;
  subject: string;
  date: string;
  location: string;
}): Promise<{ status: boolean; data?: any; error?: any }> {
  return new Promise((resolve, _reject) => {
    const raw = JSON.stringify({
      from: {
        email: "visa@stamped.one",
        name: "Stamped",
      },
      to: [
        {
          email: to,
        },
      ],
      subject: subject,
      html_part: notifyTemplate({
        date: date,
        location: location,
      }),
    });

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("X-AUTH-TOKEN", process.env.EMAIL_TOKEN || "");

    fetch(`https://stamped.ipzmarketing.com/api/v1/send_emails`, {
      method: "POST",
      headers: headers,
      body: raw,
      redirect: "follow",
    })
      .then((response) => response.text())
      .then((result) => {
        resolve({ status: true, data: result });
      })
      .catch((error) => {
        console.log("error", error);
        resolve({ status: false, error: error });
      });
  });
}

export const notifyAllUsers = async ({
  date,
  location,
}: {
  date: string;
  location: string;
}) => {
  const allUser = await User.find({});
  allUser.forEach((user) => {
    if (user.email) {
      notifyUserEmail({
        to: user.email,
        subject: "Visa Slot Available | Stamped",
        date: date,
        location: location,
      });
    }
  });
};
