import { Bot, InlineKeyboard } from "grammy";
import dotenv from "dotenv";

dotenv.config();

const bot = new Bot(process.env.BOT_TOKEN);
const CHANNEL_USERNAME = process.env.CHANNEL_USERNAME;
const ADMIN_ID = process.env.ADMIN_ID;

// ✅ تحقق من الاشتراك الإجباري
async function checkSubscription(ctx) {
  try {
    const member = await ctx.api.getChatMember(CHANNEL_USERNAME, ctx.from.id);
    const status = member.status;
    return status === "member" || status === "administrator" || status === "creator";
  } catch (err) {
    console.error("خطأ في التحقق من الاشتراك:", err.message);
    return false;
  }
}

// ✅ الرد على /start
bot.command("start", async (ctx) => {
  const isSubscribed = await checkSubscription(ctx);
  if (!isSubscribed) {
    return ctx.reply("📢 للمتابعة، الرجاء الاشتراك في القناة أولاً:", {
      reply_markup: new InlineKeyboard().url("🔗 اشترك هنا", `https://t.me/${CHANNEL_USERNAME.replace("@", "")}`)
    });
  }

  const keyboard = new InlineKeyboard()
    .text("🖼 عرض التصاميم", "show_designs")
    .text("📝 طلب تصميم", "request_design")
    .row()
    .text("💬 تواصل مباشر", "contact_admin");

  await ctx.reply("مرحباً بك في بوت الواقدي لتصاميم والجرافيكس 🎨\nاختر من القائمة:", {
    reply_markup: keyboard
  });
});

// ✅ عرض التصاميم
bot.callbackQuery("show_designs", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("📷 هذه بعض التصاميم:\n\n1. تصميم شعار\n2. تصميم بوستر\n3. تصميم سوشيال ميديا");
});

// ✅ طلب تصميم
bot.callbackQuery("request_design", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("📝 الرجاء إرسال تفاصيل التصميم المطلوب (النوع، الفكرة، الألوان، المقاسات):");
  
  bot.on("message:text", async (ctx2) => {
    await ctx2.reply("✅ تم استلام طلبك، سيتم الرد قريباً.");
    await ctx2.api.sendMessage(ADMIN_ID, `📥 طلب تصميم جديد من @${ctx2.from.username || "مستخدم"}:\n\n${ctx2.message.text}`);
  });
});

// ✅ تواصل مباشر
bot.callbackQuery("contact_admin", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("📨 يمكنك التواصل مع المصمم مباشرة:\n@mix_5_11");
});

// ✅ تشغيل البوت
bot.start();
