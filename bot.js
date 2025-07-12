const { Telegraf, Markup } = require("telegraf");
const dotenv = require("dotenv");
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// ✅ تحقق الاشتراك الإجباري
bot.use(async (ctx, next) => {
  if (!ctx.from) return;
  try {
    const member = await ctx.telegram.getChatMember(process.env.CHANNEL_USERNAME, ctx.from.id);
    if (["left", "kicked"].includes(member.status)) {
      return ctx.reply(
        `🚫 للاستخدام، اشترك أولاً في القناة: ${process.env.CHANNEL_USERNAME}`,
        Markup.inlineKeyboard([
          Markup.button.url("🔗 اشترك الآن", `https://t.me/${process.env.CHANNEL_USERNAME.replace("@", "")}`)
        ])
      );
    }
    return next();
  } catch (err) {
    console.error("Subscription check error:", err);
    ctx.reply("⚠️ حدث خطأ أثناء التحقق من الاشتراك.");
  }
});

// ✅ رسالة البدء
bot.start((ctx) => {
  ctx.reply(
    `🎨 مرحباً بك في بوت *الواقدي لتصاميم والجرافيكس*!\n\nاختر من القائمة أدناه للمتابعة 👇`,
    {
      parse_mode: "Markdown",
      reply_markup: Markup.keyboard([
        ["🖼 عرض التصاميم"],
        ["📝 طلب تصميم"],
        ["💬 تواصل مباشر"]
      ]).resize(),
    }
  );
});

// ✅ عرض التصاميم
bot.hears("🖼 عرض التصاميم", (ctx) => {
  ctx.replyWithMediaGroup([
    {
      type: "photo",
      media: "https://via.placeholder.com/600x400.png?text=تصميم+1",
      caption: "🎨 تصميم 1"
    },
    {
      type: "photo",
      media: "https://via.placeholder.com/600x400.png?text=تصميم+2",
      caption: "🎨 تصميم 2"
    }
  ]);
});

// ✅ طلب تصميم
let awaitingDesign = new Set();

bot.hears("📝 طلب تصميم", (ctx) => {
  awaitingDesign.add(ctx.from.id);
  ctx.reply("✍️ أرسل الآن تفاصيل التصميم الذي تريده:");
});

bot.on("text", async (ctx) => {
  if (awaitingDesign.has(ctx.from.id)) {
    const message = `📥 *طلب تصميم جديد*\n\n👤 من: @${ctx.from.username || "بدون معرف"}\n🆔 ID: ${ctx.from.id}\n\n💬 الطلب:\n${ctx.message.text}`;
    try {
      await ctx.telegram.sendMessage(process.env.ADMIN_ID, message, { parse_mode: "Markdown" });
      ctx.reply("✅ تم إرسال طلبك بنجاح، سنتواصل معك قريباً.");
    } catch (e) {
      console.error("خطأ في إرسال الطلب:", e);
      ctx.reply("⚠️ حدث خطأ أثناء إرسال الطلب.");
    }
    awaitingDesign.delete(ctx.from.id);
  }
});

// ✅ تواصل مباشر
bot.hears("💬 تواصل مباشر", (ctx) => {
  ctx.reply(
    "💬 للتواصل المباشر معنا، راسلنا على معرف الدعم الفني:",
    Markup.inlineKeyboard([
      Markup.button.url("📩 راسلنا", "https://t.me/YourSupportBot")
    ])
  );
});

bot.launch();
console.log("✅ البوت يعمل بنجاح...");
