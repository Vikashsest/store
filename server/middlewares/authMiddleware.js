import redisClient from "../config/redis.js";
export default async function checkAuth(req, res, next) {
  try {
    const { sid } = req.signedCookies;

    if (!sid) {
      res.clearCookie("sid");
      return res.status(401).json({ error: "Not logged In!" });
    }
    // const [payload, OldSignature] = token.split(".");
    // const jsonPayload = Buffer.from(payload, "base64url").toString();
    // const newSignuatre = crypto
    //   .createHash("sha256")
    //   .update(jsonPayload)
    //   .update(mySecretKey)
    //   .update(mySecretKey)
    //   .digest("base64url");
    // if (OldSignature !== newSignuatre) {
    //   res.clearCookie("token");
    //   return res.status(401).json({ error: "Not logged In!" });
    // }
    // const { id, expiry: expireTimeStamp } = JSON.parse(jsonPayload);
    // const currentTimeStamp = Math.round(Date.now() / 1000);
    // if (currentTimeStamp > expireTimeStamp) {
    //   res.clearCookie("token");
    //   return res.status(401).json({ error: "Not logged In!" });
    // }

    // const sesion = await Sesion.findById(sid);
    // const sesion = await redisClient.json.get(`session:${sid}`);
    // if (!sesion) {
    //   return res.status(401).json({ error: "Invalid sesion" });
    // }
    const session = await redisClient.hGetAll(`session:${sid}`);

    if (!session || !session.userId) {
      return res.status(401).json({ error: "Invalid session" });
    }
    // const user = await User.findById(sesion.userId).select("-password");
    // if (!user) {
    //   return res.status(401).json({ message: "User not found" });
    // }
    req.user = { _id: session.userId, rootDirId: session.rootDirId };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authenticated" });
  }
}
