export const otpTemplate = (name: string, otp: string) => `
  <div style="font-family: Arial; padding: 20px;">
    <h2>Hello ${name},</h2>
    <p>Your OTP code is:</p>
    <h1 style="color: #2c3e50;">${otp}</h1>
    <p>This code expires in 10 minutes.</p>
  </div>
`;

export const welcomeTemplate = (name: string) => `
  <div style="font-family: Arial; padding: 20px;">
    <h2>Welcome ${name} 🎉</h2>
    <p>Your restaurant account has been successfully created.</p>
    <p>We're excited to have you onboard!</p>
  </div>
`;

export const passwordResetTemplate = (name: string, resetLink: string) => `
  <div style="font-family: Arial; padding: 20px;">
    <h2>Hello ${name},</h2>
    <p>Click the button below to reset your password:</p>
    <a href="${resetLink}" 
       style="background: #3498db; padding: 10px 15px; color: white; text-decoration: none;">
       Reset Password
    </a>
    <p>If you didn’t request this, ignore this email.</p>
  </div>
`;