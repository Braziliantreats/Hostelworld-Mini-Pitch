import nodemailer from 'nodemailer';

let transporter = null;

function initEmailService() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('Email not configured. Skipping email alerts.');
    return null;
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  return transporter;
}

export async function sendDealAlert(deals) {
  if (!transporter) {
    transporter = initEmailService();
  }

  if (!transporter) {
    return;
  }

  if (deals.length === 0) {
    return;
  }

  const topDeals = deals.slice(0, 5);
  const destinations = [...new Set(deals.map(d => d.destination))];

  let htmlBody = `
    <h2>✈️ Flight Deals Alert!</h2>
    <p>Great deals found for: <strong>${destinations.join(', ')}</strong></p>

    <h3>Top 5 Deals:</h3>
    <table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%;">
      <tr style="background-color: #f2f2f2;">
        <th>Route</th>
        <th>Dates</th>
        <th>Price/Person</th>
        <th>Target</th>
        <th>Savings</th>
        <th>Source</th>
        <th>Book</th>
      </tr>
  `;

  topDeals.forEach(deal => {
    const savings = Math.round(deal.targetPrice - deal.pricePerPerson);
    const bookLink = deal.bookingUrl ? `<a href="${deal.bookingUrl}">Book</a>` : 'N/A';

    htmlBody += `
      <tr>
        <td>${deal.origin} → ${deal.destination}</td>
        <td>${deal.departureDate} to ${deal.returnDate}</td>
        <td>$${deal.pricePerPerson.toFixed(2)}</td>
        <td>$${deal.targetPrice}</td>
        <td style="color: green;">-$${savings}</td>
        <td>${deal.source}</td>
        <td>${bookLink}</td>
      </tr>
    `;
  });

  htmlBody += `
    </table>
    <p style="margin-top: 20px; font-size: 12px; color: #666;">
      Checked at ${new Date().toLocaleString()}
    </p>
  `;

  const subject = `🎉 Flight Deal Alert: ${destinations.join(' + ')} - ${topDeals[0].destination}`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER,
      subject,
      html: htmlBody
    });

    console.log(`✉️ Deal alert email sent for ${deals.length} deals`);
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
}
