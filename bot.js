// 📁 bot.js import { Bot, session } from "grammy"; import { config } from "dotenv"; config();

const bot = new Bot(process.env.BOT_TOKEN); const ADMIN_ID = parseInt(process.env.ADMIN_ID); const CHANNEL_USERNAME = process.env.CHANNEL_USERNAME;

// 🧠 الجلسة لتخزين حالة المستخدمين bot.use(session({ initial: () => ({ state: null }) }));

// ✅ أمر /start مع التحقق من الاشتراك bot.command("start", async (ctx) => { try { const userId = ctx.from.id; const chatMember = await ctx.api.getChatMember(CHANNEL_USERNAME, userId);

if (["member", "administrator", "creator"].includes(chatMember.status)) {
  await ctx.reply(
    "🎨 أهلاً بك في بوت الواقدي لتصاميم والجرافيكس!\nاختر من القائمة:",
    {
      reply_markup: {
        keyboard: [
          ["🖼 عرض التصاميم", "📝 طلب تصميم"],
          ["💬 تواصل مباشر"]
        ],
        resize_keyboard: true
      }
    }
  );
} else {
  await ctx.reply(`⚠️ يجب الاشتراك في القناة أولاً: ${CHANNEL_USERNAME}`);
}

} catch (error) { console.error("خطأ في التحقق من الاشتراك:", error.message); await ctx.reply("⚠️ حدث خطأ أثناء التحقق من الاشتراك."); } });

// 📸 عرض التصاميم bot.hears("🖼 عرض التصاميم", async (ctx) => { await ctx.reply("📂 إليك بعض من تصاميمنا:"); // يمكنك إضافة صور تصميم هنا لاحقًا });

// 📝 طلب تصميم bot.hears("📝 طلب تصميم", async (ctx) => { ctx.session.state = "awaiting_request"; await ctx.reply("✍️ أرسل تفاصيل التصميم الذي تريده:"); });

bot.on("message:text", async (ctx) => { if (ctx.session.state === "awaiting_request") { ctx.session.state = null; const msg = 📥 طلب جديد من @${ctx.from.username || "بدون معرف"} (ID: ${ctx.from.id}):\n\n${ctx.message.text}; await ctx.reply("✅ تم استلام طلبك وسنقوم بمراجعته قريباً."); await ctx.api.sendMessage(ADMIN_ID, msg); } });

// 💬 تواصل مباشر bot.hears("💬 تواصل مباشر", async (ctx) => { await ctx.reply("🔗 يمكنك التواصل معنا على: @V_i_V_52"); });

// 🚀 تشغيل البوت bot.start();

