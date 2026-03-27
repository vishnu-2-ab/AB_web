import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { name, email, message, expertise, brief } = req.body;

        // Determine if this is a career application or a general contact
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
                <div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
                    <h2>${subject}</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    ${expertise ? `<p><strong>Expertise:</strong> ${expertise}</p>` : ''}
                    <p><strong>Message/Brief:</strong></p>
                    <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">
                        ${message || brief}
                    </div>
                </div>
            `,
        });

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Submission Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
