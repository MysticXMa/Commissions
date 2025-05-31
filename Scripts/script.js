const fileInput = document.getElementById("file");

if (fileInput) {
  fileInput.addEventListener("change", function () {
    const previewWrapper = document.getElementById("image-preview-wrapper");
    const imagePreview = document.getElementById("image-preview");
    const fileNameDisplay = document.getElementById("file-name");
    const previewConfirm = document.getElementById("preview-confirm");

    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      fileNameDisplay.textContent = file.name;

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

function handleImagePreview(input) {
  const previewWrapper = document.getElementById("image-preview-wrapper");
  const previewList = document.getElementById("image-preview-list");
  const fileName = document.getElementById("file-name");

  previewList.innerHTML = "";
  fileName.textContent = input.files.length + " file(s) selected";

  if (input.files.length > 0) {
    previewWrapper.classList.remove("hidden");
  }

  Array.from(input.files).forEach((file) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.classList.add("preview-image");
      previewList.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

function openForm(packName) {
  const formContainer = document.querySelector(".form-container");
  const clothingOptions = document.getElementById("clothing-options");
  const warningBox = document.getElementById("premium-warning");

  formContainer.style.display = "block";

  if (["Ultimate Pack", "Celestial Pack"].includes(packName)) {
    warningBox.classList.remove("hidden");
  } else {
    warningBox.classList.add("hidden");
  }

  if (["Premium Pack", "Ultimate Pack", "Celestial Pack"].includes(packName)) {
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
  formTitle.innerText = `Order Form for ${packName}`;

  document.getElementById("selected-pack").value = packName;

  window.scrollTo({
    top: formContainer.offsetTop,
    behavior: "smooth",
  });
}

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
  ];
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  const isInappropriate = (text) =>
    urlPattern.test(text) ||
    curseWords.some((word) => new RegExp(`\\b${word}\\b`, "i").test(text)) ||
    text.includes("@");

  if (
    isInappropriate(description) ||
    isInappropriate(name) ||
    isInappropriate(discordId)
  ) {
    alert("Inappropriate content detected.");
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
          { name: "Clothing Options", value: clothing, inline: true },
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

  fetch("/submit", {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      if (!res.ok) throw new Error("Server responded with error");
      alert("Order submitted successfully!");
      document.getElementById("order-form").reset();
      document.querySelector(".form-container").style.display = "none";
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
      img: "../avatars/11.png",
      desc: "A blend between Erolis and its own unique style.",
    },
    avatar2: {
      title: "Erolis",
      img: "../avatars/22.png",
      desc: "My most loved avatar and the one I currently use.",
    },
    avatar3: {
      title: "Mistic",
      img: "../avatars/33.png",
      desc: "My first-ever avatar!",
    },
    avatar4: {
      title: "Null",
      img: "../avatars/44.png",
      desc: "A special avatar I made as a gift for my boyfriend.",
    },
    avatar5: {
      title: "Loufy",
      img: "../avatars/55.png",
      desc: "My first finished commission.",
    },
    avatar6: {
      title: "Ara",
      img: "../avatars/66.png",
      desc: "The avatar colors are stunning, and it gives off a badass vibe.",
    },
    avatar7: {
      title: "Cristal",
      img: "../avatars/77.png",
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
  document.querySelector(".form-container").style.display = "none";
}
