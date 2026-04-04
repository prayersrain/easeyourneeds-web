/**
 * Script to update Xendit webhook URL
 * Run after ngrok starts to automatically register webhook URL
 * 
 * Usage: npx tsx --env-file=.env.local scripts/update-xendit-webhook.ts
 */

async function updateXenditWebhook() {
  console.log("🔄 Updating Xendit webhook URL...\n");

  const secretKey = process.env.XENDIT_SECRET_KEY;
  const ngrokUrl = process.env.NGROK_URL;

  if (!secretKey) {
    console.error("❌ XENDIT_SECRET_KEY not found in .env.local");
    process.exit(1);
  }

  if (!ngrokUrl) {
    console.error("❌ NGROK_URL not provided");
    console.log("\nUsage:");
    console.log("  1. Set NGROK_URL in .env.local");
    console.log("  2. Or run: set NGROK_URL=https://xxxx.ngrok-free.app && npx tsx --env-file=.env.local scripts/update-xendit-webhook.ts");
    process.exit(1);
  }

  const webhookUrl = `${ngrokUrl}/api/webhooks/xendit`;
  console.log(`📡 Webhook URL: ${webhookUrl}\n`);

  try {
    // 1. Get existing webhooks
    console.log("📋 Checking existing webhooks...");
    const getResponse = await fetch("https://api.xendit.co/callback_urls", {
      method: "GET",
      headers: {
        "Authorization": `Basic ${Buffer.from(secretKey + ":").toString("base64")}`,
        "Content-Type": "application/json",
      },
    });

    if (!getResponse.ok) {
      const errorText = await getResponse.text();
      console.error(`❌ Failed to get webhooks (${getResponse.status}):`, errorText);
      process.exit(1);
    }

    const existingWebhooks = await getResponse.json();
    console.log(`Found ${existingWebhooks.length} existing webhook(s)\n`);

    // 2. Delete old webhooks (to avoid duplicates)
    for (const webhook of existingWebhooks) {
      console.log(`🗑️  Deleting old webhook: ${webhook.url}`);
      await fetch(`https://api.xendit.co/callback_urls?id=${webhook.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Basic ${Buffer.from(secretKey + ":").toString("base64")}`,
        },
      });
    }

    // 3. Create new webhook
    console.log("\n➕ Creating new webhook...");
    const createResponse = await fetch("https://api.xendit.co/callback_urls", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${Buffer.from(secretKey + ":").toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: webhookUrl,
        authentication: {
          type: "HEADER",
          key: "x-callback-token",
          value: process.env.XENDIT_WEBHOOK_TOKEN,
        },
      }),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error(`❌ Failed to create webhook (${createResponse.status}):`, errorText);
      process.exit(1);
    }

    const result = await createResponse.json();
    console.log("\n✅ Webhook registered successfully!");
    console.log(`   URL: ${result.url}`);
    console.log(`   ID: ${result.id}`);
    console.log("\n🧪 You can now test payments in Xendit sandbox.");

  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

updateXenditWebhook();
