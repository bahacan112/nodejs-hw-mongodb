import nodemailer from "nodemailer";

// **SMTP bağlantısını oluştur**
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT), // 📌 Port numarasını sayıya çevir
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// **Şifre sıfırlama e-postası gönderme fonksiyonu**
export const sendResetEmail = async (email, token) => {
  try {
    // 📌 `email` boş mu kontrol et
    if (!email) {
      console.error("❌ Hata: E-posta adresi eksik!");
      throw new Error("E-posta adresi sağlanmadı.");
    }

    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"Borsa Asistan" <${process.env.SMTP_FROM}>`, // 📌 Daha profesyonel görünmesi için ad ekledik
      to: email,
      subject: "Şifre Sıfırlama Talebi",
      html: `
        <p>Merhaba,</p>
        <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>Bu bağlantı sadece 5 dakika geçerlidir.</p>
      `,
    };

    // 📌 SMTP bağlantısının çalıştığını görmek için log ekleyelim
    console.log("📩 Gönderilecek e-posta:", mailOptions);

    // **E-posta gönder**
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ E-posta başarıyla gönderildi!", info.response);
    return true;
  } catch (error) {
    console.error("❌ E-posta gönderme hatası:", error);
    return false;
  }
};
