function openForm(tier) {
  document.getElementById("form-title").innerText = `Order Form for ${tier}`;
  document.getElementById("selected-pack").value = tier;

  const formContainer = document.querySelector(".form-container");
  formContainer.style.display = "block";

  switch (tier) {
    case "Starter Pack":
      formContainer.style.boxShadow = "0 4px 15px rgba(177, 177, 177, 0.8)";
      formContainer.style.background =
        "linear-gradient(to bottom, #ececec, #d1d1d1)";
      formContainer.style.border = "2px solid rgb(160, 160, 160)";
      break;

    case "Premium Pack":
      formContainer.style.boxShadow = "0 4px 25px rgba(255, 192, 0, 0.9)";
      formContainer.style.background =
        "linear-gradient(to bottom, #fff5c1, #ffcc5c)";
      formContainer.style.border = "2px solid rgb(255, 214, 149)";
      break;

    case "Ultimate Pack":
      formContainer.style.boxShadow = "0 4px 45px rgba(66, 202, 255, 0.9)";
      formContainer.style.background =
        "linear-gradient(to bottom, #cce7ff, #66b8d8)";
      formContainer.style.border = "3px solid rgb(170, 234, 255)";
      break;

    default:
      formContainer.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
      formContainer.style.background = "#f7f7f7";
      formContainer.style.border = "1px solid #d0d0d0";
      break;
  }

  window.scrollTo({
    top: formContainer.offsetTop,
    behavior: "smooth",
  });
}

const WEBHOOK_URL =
  "https://discord.com/api/webhooks/1328015749138354247/4wKcq_jUMl_xIn1DLa4-73bEI6XnwKbQ1drgal4qdATo_h8vvsPOY-fdfA203iwfvppZ";

function submitForm(event) {
  event.preventDefault();

  const form = document.getElementById("order-form");
  const formData = new FormData(form);
  const description = formData.get("description");
  const selectedPack = formData.get("pack");
  const name = formData.get("name");
  const style = formData.get("style");
  const clothing = formData.get("clothing") || "None";
  const discordId = formData.get("discord-id");

  const curseWords = [
    "shit",
    "fuck",
    "bitch",
    "asshole",
    "damn",
    "hell",
    "bastard",
    "slut",
    "whore",
    "dick",
    "cock",
    "pussy",
    "cunt",
    "motherfucker",
    "fag",
    "bastard",
    "retard",
    "idiot",
    "douche",
    "prick",
    "twat",
    "douchebag",
    "faggot",
    "nigger",
    "spic",
    "chink",
    "kike",
    "gook",
    "jap",
    "raghead",
    "sandnigger",
    "coon",
    "tranny",
    "queer",
    "dyke",
    "bitchass",
    "shithead",
    "fuckhead",
    "dickhead",
    "piss",
    "pissed",
    "ass",
    "asswipe",
    "assclown",
    "cockhead",
    "shitfuck",
    "motherfucking",
    "fucker",
    "cum",
    "cocksucker",
    "cockroach",
    "butthole",
    "dickbag",
    "dickhead",
    "clit",
    "fistfuck",
    "blowjob",
    "handjob",
    "smegma",
    "scumbag",
    "fucktard",
    "bastardized",
    "sodomy",
    "peckerwood",
    "prickhead",
    "shitshow",
    "shitstain",
    "whorehouse",
    "chickenfucker",
    "cockblock",
    "penis",
    "testicles",
    "nutsack",
    "shitstorm",
    "motherfucking",
    "cockmongler",
    "jizz",
    "gash",
    "pube",
    "bootyhole",
    "pussylicker",
    "pissflap",
    "dingleberry",
    "bitchboy",
    "shitlicker",
    "fistbump",
    "shitstain",
    "cockmaster",
    "suckass",
    "dickrider",
    "buttfucker",
    "skank",
    "cumdumpster",
    "bastardization",
    "fatass",
    "dickface",
    "cumguzzler",
    "cuntface",
    "assfucker",
    "fuckyourself",
    "fuckinghell",
    "asswipe",
    "crackwhore",
    "skankwhore",
    "dickfuck",
    "shitass",
    "fuckingidiot",
    "cockwhore",
    "dicklicker",
  ];

  const urlPattern = /(https?:\/\/[^\s]+)/g;

  if (urlPattern.test(description)) {
    alert("URLs are not allowed in the description.");
    return;
  }

  if (
    curseWords.some((curse) =>
      new RegExp(`\\b${curse}\\b`, "i").test(description)
    )
  ) {
    alert("Please avoid using inappropriate language in the description.");
    return;
  }

  if (description.includes("@")) {
    alert('The "@" symbol is not allowed in the description.');
    return;
  }

  if (
    curseWords.some((curse) => new RegExp(`\\b${curse}\\b`, "i").test(name))
  ) {
    alert("Please avoid using inappropriate language in the name.");
    return;
  }

  if (
    curseWords.some((curse) =>
      new RegExp(`\\b${curse}\\b`, "i").test(discordId)
    )
  ) {
    alert("Please avoid using inappropriate language in the Discord Name.");
    return;
  }

  const message = {
    username: "Commissions Bot",
    embeds: [
      {
        title: `New Order Submission`,
        color: 15844367,
        fields: [
          { name: "Name", value: name || "N/A", inline: true },
          { name: "Discord ID", value: discordId || "N/A", inline: true },
          { name: "Avatar Base", value: style || "N/A", inline: true },
          { name: "Clothing Options", value: clothing || "None", inline: true },
          { name: "Selected Pack", value: selectedPack || "N/A", inline: true },
          { name: "Description", value: description || "N/A" },
        ],
        footer: {
          text: "Mystic's VRChat Avatar Commissions",
          icon_url: "https://example.com/logo.png",
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const file = formData.get("file");

  if (file && file.size > 0) {
    const reader = new FileReader();
    reader.onload = () => {
      const fileType = file.type.split("/")[1];

      if (["png", "jpeg", "jpg"].includes(fileType)) {
        message.embeds[0].image = { url: "attachment://reference." + fileType };
        message.embeds[0].fields.push({
          name: "Reference Image",
          value: "Attached below.",
        });
        sendMessageToDiscord(message, file, `reference.${fileType}`);
      } else {
        alert("Unsupported file type. Please upload a PNG or JPEG image.");
      }
    };
    reader.readAsDataURL(file);
  } else {
    sendMessageToDiscord(message);
  }
}

function sendMessageToDiscord(message, file = null, filename = null) {
  const formData = new FormData();
  formData.append("payload_json", JSON.stringify(message));

  if (file && filename) {
    formData.append("file", file, filename);
  }

  fetch(WEBHOOK_URL, {
    method: "POST",
    body: formData,
  })
    .then(() => {
      alert("Order submitted successfully!");
      document.getElementById("order-form").reset();
    })
    .catch((error) => {
      alert("Error submitting order.");
      console.error("Error:", error);
    });
}
