import { Resend } from 'resend';

export default async function handler(req, res) {
    console.log('--- Incoming Form Submission ---');
    console.log('Method:', req.method);

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            console.error('CRITICAL: RESEND_API_KEY is missing from environment variables.');
            return res.status(500).json({ error: 'Server Configuration Error: API Key missing.' });
        }

        const resend = new Resend(apiKey);
        const { name, email, message, expertise, brief } = req.body;

        if (!name || !email || (!message && !brief)) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        console.log(`Processing submission for: ${name} (${email})`);

        const isCareer = !!(expertise || brief);
        const subject = isCareer 
            ? `New Talent Application: ${name}`
            : `New Contact Inquiry: ${name}`;

        const data = await resend.emails.send({
            from: 'Apple and Berry <onboarding@resend.dev>',
            to: ['info@appleberrytech.com'],
            subject: subject,
            reply_to: email,
            html: `
                <div style="font-family: sans-serif; padding: 20px; line-height: 1.6; color: #333;">
                    <h2 style="color: #8DC63F;">${subject}</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    ${expertise ? `<p><strong>Expertise:</strong> ${expertise}</p>` : ''}
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p><strong>Content:</strong></p>
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; border: 1px solid #eee;">
                        ${(message || brief).replace(/\n/g, '<br>')}
                    </div>
                    <p style="font-size: 0.8rem; color: #999; margin-top: 30px;">
                        Sent via Apple and Berry Serverless Core
                    </p>
                </div>
            `,
        });

        console.log('Email sent successfully:', data.id);
        return res.status(200).json({ success: true, id: data.id });

    } catch (error) {
        console.error('HANDLED EXCEPTION:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred';
        return res.status(500).json({ error: errorMessage });
    }
}
