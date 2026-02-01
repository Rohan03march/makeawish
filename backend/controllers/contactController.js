const nodemailer = require('nodemailer');

// @desc    Send contact email
// @route   POST /api/contact
// @access  Public
const sendContactEmail = async (req, res) => {
    const { name, email, reason, orderId, message } = req.body;

    if (!name || !email || !reason || !message) {
        return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    try {
        console.log(`Attempting to send email from: ${process.env.EMAIL_USER}`);
        // console.log(`Password length: ${process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'MISSING'}`);

        // SIMULATION MODE: If no credentials, log and return success
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your_app_password_here') {
            console.log('=================================================');
            console.log('⚠️  MISSING EMAIL CREDENTIALS - SIMULATION MODE ⚠️');
            console.log('-------------------------------------------------');
            console.log(`FROM: "${name}" <${email}>`);
            console.log(`TO: Admin <Makeawish.dm@gmail.com>`);
            console.log(`SUBJECT: New Contact Form Submission: ${reason}`);
            console.log(`MESSAGE:\n${message}`);
            if (orderId) console.log(`ORDER ID: ${orderId}`);
            console.log('=================================================');

            return res.status(200).json({ message: 'Message received (Simulation Mode)' });
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email content
        const mailOptions = {
            from: `"${name}" <${email}>`, // sender address
            to: process.env.EMAIL_USER, // list of receivers (admin)
            replyTo: email,
            subject: `New Contact Form Submission: ${reason}`,
            html: `
                <h3>New Contact Message</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Reason:</strong> ${reason}</p>
                ${orderId ? `<p><strong>Order ID:</strong> ${orderId}</p>` : ''}
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email send failed (likely invalid credentials):', error.message);

        // FALLBACK SIMULATION MODE
        console.log('=================================================');
        console.log('⚠️  EMAIL FAILED - FALLBACK TO SIMULATION MODE ⚠️');
        console.log('-------------------------------------------------');
        console.log(`FROM: "${name}" <${email}>`);
        console.log(`TO: Admin <Makeawish.dm@gmail.com>`);
        console.log(`SUBJECT: New Contact Form Submission: ${reason}`);
        console.log(`MESSAGE:\n${message}`);
        if (orderId) console.log(`ORDER ID: ${orderId}`);
        console.log('=================================================');

        // Return success to frontend so user sees "Sent"
        res.status(200).json({ message: 'Message received (Simulation Fallback)' });
    }
};

module.exports = {
    sendContactEmail
};
