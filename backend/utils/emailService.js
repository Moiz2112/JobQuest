import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Email templates
export const emailTemplates = {
    applicationConfirmation: (studentName, companyName, jobTitle, applicationDate) => ({
        subject: `Application Confirmation - ${jobTitle} at ${companyName}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
                    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
                    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                    .badge { display: inline-block; background: #7C3AED; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; margin-top: 15px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✓ Application Submitted</h1>
                    </div>
                    <div class="content">
                        <p>Dear <strong>${studentName}</strong>,</p>
                        <p>Thank you for your application! We've received your submission for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
                        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7C3AED;">
                            <p><strong>Application Details:</strong></p>
                            <p>Position: ${jobTitle}</p>
                            <p>Company: ${companyName}</p>
                            <p>Applied on: ${applicationDate}</p>
                        </div>
                        <p>The hiring team will review your application and get back to you soon. Keep an eye on your email for updates on your application status.</p>
                        <p>Good luck! 🚀</p>
                        <p>Best regards,<br><strong>JobQuest Team</strong></p>
                        <div class="badge">JobQuest Job Portal</div>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 JobQuest. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    }),

    interviewInvitation: (candidateName, companyName, jobTitle, interviewDate, interviewTime, interviewMode, meetingLink, instructions) => ({
        subject: `Interview Invitation - ${jobTitle} at ${companyName}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
                    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
                    .details-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981; }
                    .details-box h3 { color: #10B981; margin-top: 0; }
                    .detail-item { margin: 10px 0; }
                    .detail-item strong { color: #1F2937; }
                    .cta-button { display: inline-block; background: #7C3AED; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
                    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📅 Interview Invitation</h1>
                    </div>
                    <div class="content">
                        <p>Dear <strong>${candidateName}</strong>,</p>
                        <p>Congratulations! We are pleased to invite you for an interview for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
                        
                        <div class="details-box">
                            <h3>Interview Details</h3>
                            <div class="detail-item"><strong>Date:</strong> ${interviewDate}</div>
                            <div class="detail-item"><strong>Time:</strong> ${interviewTime}</div>
                            <div class="detail-item"><strong>Mode:</strong> ${interviewMode}</div>
                            ${meetingLink ? `<div class="detail-item"><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></div>` : ''}
                        </div>

                        ${instructions ? `<div class="details-box" style="border-left-color: #F59E0B;">
                            <h3 style="color: #F59E0B;">Instructions</h3>
                            <p>${instructions}</p>
                        </div>` : ''}

                        <p>Please confirm your availability by replying to this email or contacting us directly.</p>
                        <p>We look forward to speaking with you!</p>
                        
                        <a href="${meetingLink || '#'}" class="cta-button">Join Interview</a>
                        
                        <p style="margin-top: 30px;">Best regards,<br><strong>${companyName} Hiring Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 JobQuest. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    }),

    applicationStatusUpdate: (candidateName, companyName, jobTitle, status) => ({
        subject: `Application Status Update - ${jobTitle} at ${companyName}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
                    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
                    .status-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border-top: 4px solid #7C3AED; }
                    .status-badge { display: inline-block; background: #7C3AED; color: white; padding: 10px 20px; border-radius: 20px; font-weight: bold; }
                    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📬 Application Status Update</h1>
                    </div>
                    <div class="content">
                        <p>Dear <strong>${candidateName}</strong>,</p>
                        <p>We wanted to update you on your application for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
                        
                        <div class="status-box">
                            <p>Your application status:</p>
                            <div class="status-badge">${status.toUpperCase()}</div>
                        </div>

                        <p>Thank you for your interest in ${companyName}. We appreciate the time you took to apply and look forward to staying connected with you.</p>
                        <p>Best regards,<br><strong>${companyName} Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 JobQuest. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    })
};

export const sendEmail = async (to, template) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: template.subject,
            html: template.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export default { sendEmail, emailTemplates };
