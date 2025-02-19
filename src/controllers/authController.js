import createError from "http-errors";
import User from "../db/models/User.js";
import jwt from "jsonwebtoken";
import Session from "../db/models/Session.js";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Kullanıcı zaten var mı?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(409, "Email already in use"));
    }

    // Kullanıcıyı oluştur (şifre modelde hashlenecek)
    const newUser = new User({
      name,
      email,
      password, // Şifre modelde hashlenecek, burada hashleme yapma!
    });

    await newUser.save(); // Model içindeki `pre("save")` middleware çalışacak

    // Şifreyi göstermeden yanıtı döndür
    res.status(201).json({
      status: 201,
      message: " Successfully registered a user!",
      data: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(401, "Invalid email or password"));
    }

    // Model içindeki comparePassword metodunu kullan
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(createError(401, "Invalid password"));
    }

    // Token oluştur
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Önceki oturumları sil
    await Session.deleteMany({ userId: user._id });

    // Yeni oturum oluştur
    await Session.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // Refresh token'i cookie olarak ekleyelim
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      status: 200,
      message: "Successfully logged in a user!",
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return next(createError(401, "Refresh token not provided"));
    }

    // Tokenin var olup olmadığını kontrol et
    const session = await Session.findOne({ refreshToken });
    if (!session) {
      return next(createError(403, "Invalid refresh token"));
    }

    // Refresh token süresi dolmuş mu?
    if (new Date() > session.refreshTokenValidUntil) {
      await Session.deleteOne({ _id: session._id });
      return next(createError(403, "Refresh token expired"));
    }

    // Kullanıcıyı doğrula
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // **Yeni refresh token oluştur**
    const newRefreshToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    // **Yeni access token oluştur**
    const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    // **Eski oturumu sil ve yeni oturum oluştur**
    await Session.deleteOne({ _id: session._id });
    await Session.create({
      userId: decoded.id,
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // **Yeni refresh token'i çerez olarak ekleyelim**
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      status: 200,
      message: "Successfully refreshed a session!",
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return next(createError(401, "Refresh token not provided"));
    }

    // Tokeni veritabanından sil
    await Session.deleteOne({ refreshToken });

    // Çerezleri temizle
    res.clearCookie("refreshToken");

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
