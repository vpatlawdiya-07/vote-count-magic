import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VoteReceiptRequest {
  email: string;
  voterName: string;
  voteId: string;
  signature: string;
  timestamp: string;
  candidateName: string;
  electionTitle: string;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      email, 
      voterName, 
      voteId, 
      signature, 
      timestamp, 
      candidateName,
      electionTitle 
    }: VoteReceiptRequest = await req.json();

    console.log("Sending vote receipt to:", email);

    const formattedDate = new Date(timestamp).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'long'
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
            <div style="width: 80px; height: 80px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 40px;">✓</span>
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Vote Successfully Cast!</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 16px;">Your vote has been securely recorded</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
              Dear ${voterName},
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
              Thank you for participating in the <strong>${electionTitle}</strong>. Your vote has been encrypted and securely recorded in our system.
            </p>
            
            <!-- Verification ID Box -->
            <div style="background-color: #ecfdf5; border: 2px solid #10b981; border-radius: 12px; padding: 25px; margin-bottom: 25px; text-align: center;">
              <p style="color: #059669; font-size: 14px; font-weight: 600; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 1px;">
                Your Vote Verification ID
              </p>
              <p style="font-family: 'Courier New', monospace; font-size: 18px; color: #065f46; background-color: #ffffff; padding: 15px 20px; border-radius: 8px; margin: 0; word-break: break-all; border: 1px solid #a7f3d0;">
                ${voteId}
              </p>
              <p style="color: #6b7280; font-size: 13px; margin: 15px 0 0;">
                Save this ID to verify your vote was counted correctly
              </p>
            </div>
            
            <!-- Vote Details -->
            <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
              <h3 style="color: #374151; font-size: 16px; margin: 0 0 15px; font-weight: 600;">Vote Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="color: #6b7280; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">Election</td>
                  <td style="color: #374151; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500;">${electionTitle}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">Candidate</td>
                  <td style="color: #374151; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500;">${candidateName}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">Timestamp</td>
                  <td style="color: #374151; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">Digital Signature</td>
                  <td style="font-family: 'Courier New', monospace; color: #374151; font-size: 12px; padding: 8px 0; text-align: right;">${signature}</td>
                </tr>
              </table>
            </div>
            
            <!-- Security Notice -->
            <div style="display: flex; align-items: center; gap: 10px; padding: 15px; background-color: #f0fdf4; border-radius: 8px; margin-bottom: 25px;">
              <span style="font-size: 20px;">🔒</span>
              <p style="color: #166534; font-size: 14px; margin: 0;">
                Your vote is encrypted and anonymous. Only you can verify your vote using the ID above.
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
              If you did not cast this vote, please contact election officials immediately.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              This is an automated message from VoteSecure Election System.<br>
              Please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "VoteSecure <onboarding@resend.dev>",
        to: [email],
        subject: `Your Vote Receipt - ${electionTitle}`,
        html: htmlContent,
      }),
    });

    const emailResponse = await response.json();
    console.log("Email response:", emailResponse);

    if (!response.ok) {
      throw new Error(emailResponse.message || "Failed to send email");
    }

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-vote-receipt function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
