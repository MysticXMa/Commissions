const fileInput = document.getElementById("file");

if (fileInput) {
  fileInput.addEventListener("change", function () {
    const previewWrapper = document.getElementById("image-preview-wrapper"),
      imagePreview = document.getElementById("image-preview"),
      fileNameDisplay = document.getElementById("file-name"),
      previewConfirm = document.getElementById("preview-confirm");

    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      fileNameDisplay.textContent = file.name;

      // Read and display the file
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        previewWrapper.classList.remove("hidden");
        previewConfirm.checked = false;
        previewConfirm.required = true;
      };
      reader.readAsDataURL(file);
    } else {
      fileNameDisplay.textContent = "No file chosen";
      previewWrapper.classList.add("hidden");
      previewConfirm.required = false;
    }
  });
}

function handleImagePreview() {
  const fileInput = document.getElementById("file"),
    fileNameDisplay = document.getElementById("file-name"),
    previewWrapper = document.getElementById("image-preview-wrapper"),
    previewImg = document.getElementById("image-preview"),
    previewConfirm = document.getElementById("preview-confirm"),
    file = fileInput.files[0];

  if (file) {
    fileNameDisplay.textContent = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      previewWrapper.classList.remove("hidden");
      previewConfirm.required = true;
    };
    reader.readAsDataURL(file);
  } else {
    fileNameDisplay.textContent = "No file chosen";
    previewWrapper.classList.add("hidden");
    previewConfirm.required = false;
  }
}

function openForm(tier) {
  const formContainer = document.querySelector(".form-container");
  const clothingOptions = document.getElementById("clothing-options");

  formContainer.style.display = "block";

  if (tier === "Premium Pack" || tier === "Ultimate Pack") {
    clothingOptions.style.display = "block";
  } else {
    clothingOptions.style.display = "none";
  }

  let formTitle = document.getElementById("form-title");

  if (!formTitle) {
    formTitle = document.createElement("h2");
    formTitle.id = "form-title";
    formContainer.insertBefore(formTitle, formContainer.firstChild);
  }

  formTitle.innerText = `Order Form for ${tier}`;

  document.getElementById("selected-pack").value = tier;
}

const WEBHOOK_URL =
  "https://discord.com/api/webhooks/1328015749138354247/4wKcq_jUMl_xIn1DLa4-73bEI6XnwKbQ1drgal4qdATo_h8vvsPOY-fdfA203iwfvppZ";

function submitForm(event) {
  event.preventDefault();
  const form = document.getElementById("order-form"),
    formData = new FormData(form),
    description = formData.get("description"),
    selectedPack = formData.get("pack"),
    name = formData.get("name"),
    style = formData.get("style"),
    clothing = formData.get("clothing") || "None",
    discordId = formData.get("discord-id");

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
  ];
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  if (
    urlPattern.test(description) ||
    curseWords.some((curse) =>
      new RegExp(`\\b${curse}\\b`, "i").test(description)
    ) ||
    description.includes("@")
  ) {
    alert("Inappropriate content detected.");
    return;
  }

  if (
    curseWords.some((curse) => new RegExp(`\\b${curse}\\b`, "i").test(name)) ||
    curseWords.some((curse) =>
      new RegExp(`\\b${curse}\\b`, "i").test(discordId)
    )
  ) {
    alert("Inappropriate content detected in name or Discord ID.");
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
  const previewConfirmed = document.getElementById("preview-confirm").checked;

  if (file && file.size > 0) {
    if (!previewConfirmed) {
      alert("Please confirm the image preview before submitting.");
      return;
    }

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
        alert("Unsupported file type.");
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
    const previewConfirmed = document.getElementById("preview-confirm").checked;
    if (!previewConfirmed) {
      alert("Please confirm the image preview before submitting.");
      return;
    }
    formData.append("file", file, filename);
  }

  fetch(WEBHOOK_URL, { method: "POST", body: formData })
    .then(() => {
      alert("Order submitted successfully!");
      document.getElementById("order-form").reset();
      const formContainer = document.querySelector(".form-container");
      formContainer.style.display = "none";
    })
    .catch((error) => {
      alert("Error submitting order.");
      console.error("Error:", error);
    });
}

function openDetails(avatar) {
  const avatarData = {
    avatar1: {
      title: "Erolic",
      img: "avatars/11.png",
      desc: "A blend between Erolis and its own unique style.",
    },
    avatar2: {
      title: "Erolis",
      img: "avatars/22.png",
      desc: "My most loved avatar and the one I currently use.",
    },
    avatar3: {
      title: "Mistic",
      img: "avatars/33.png",
      desc: "My first-ever avatar!",
    },
    avatar4: {
      title: "Null",
      img: "avatars/44.png",
      desc: "A special avatar I made as a gift for my boyfriend.",
    },
    avatar5: {
      title: "Loufy",
      img: "avatars/55.png",
      desc: "My first finished commission.",
    },
    avatar6: {
      title: "Ara",
      img: "avatars/66.png",
      desc: "The avatar colors are stunning, and it gives off a badass vibe.",
    },
    avatar7: {
      title: "Cristal",
      img: "avatars/77.png",
      desc: "Is it a crystal or a gem? Nah, it’s just me trying to outshine everything around me. Sparkles included!",
    },
  };

  const avatarInfo = avatarData[avatar];
  if (!avatarInfo) return;

  document.getElementById("avatar-title").innerText = avatarInfo.title;
  document.getElementById("avatar-img").src = avatarInfo.img;
  document.getElementById("avatar-desc").innerText = avatarInfo.desc;

  const modal = document.getElementById("avatar-details");
  modal.style.display = "flex";
  modal.classList.add("show");
}

function closeDetails() {
  const modal = document.getElementById("avatar-details");
  modal.classList.remove("show");
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

function cancelOrder() {
  const formContainer = document.querySelector(".form-container");
  formContainer.style.display = "none";
}
