let selectedFiles = [];

const fileInput = document.getElementById("file");

if (fileInput) {
  fileInput.addEventListener("change", function () {
    const previewWrapper = document.getElementById("image-preview-wrapper");
    const imagePreview = document.getElementById("image-preview");
    const fileNameDisplay = document.getElementById("file-name");
    const previewConfirm = document.getElementById("preview-confirm");

    if (fileInput.files && fileInput.files.length > 0) {
      const currentCount = imagePreview.children.length;
      const maxAllowed = 5;
      const filesToAdd = [...fileInput.files].slice(
        0,
        maxAllowed - currentCount
      );

      filesToAdd.forEach((file) => selectedFiles.push(file));

      fileNameDisplay.textContent = `${
        imagePreview.children.length + filesToAdd.length
      } file(s) selected`;

      filesToAdd.forEach((file, fileIndex) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const wrapper = document.createElement("div");
          wrapper.style.position = "relative";
          wrapper.style.display = "inline-block";
          wrapper.style.margin = "10px";

          const img = document.createElement("img");
          img.src = e.target.result;
          img.alt = "Uploaded Preview";
          img.style.maxWidth = "450px";
          img.style.borderRadius = "8px";
          img.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.2)";

          const removeBtn = document.createElement("button");
          removeBtn.textContent = "✖";
          removeBtn.style.position = "absolute";
          removeBtn.style.top = "5px";
          removeBtn.style.right = "5px";
          removeBtn.style.background = "rgba(0,0,0,0.5)";
          removeBtn.style.color = "#fff";
          removeBtn.style.border = "none";
          removeBtn.style.borderRadius = "50%";
          removeBtn.style.cursor = "pointer";
          removeBtn.style.width = "24px";
          removeBtn.style.height = "24px";
          removeBtn.style.display = "flex";
          removeBtn.style.alignItems = "center";
          removeBtn.style.justifyContent = "center";
          removeBtn.onclick = () => {
            const index = selectedFiles.indexOf(file);
            if (index !== -1) selectedFiles.splice(index, 1);
            wrapper.remove();
            if (imagePreview.children.length === 0) {
              previewWrapper.classList.add("hidden");
              fileNameDisplay.textContent = "No file chosen";
              previewConfirm.checked = false;
              previewConfirm.required = false;
            } else {
              fileNameDisplay.textContent = `${imagePreview.children.length} file(s) selected`;
            }
          };

          wrapper.appendChild(img);
          wrapper.appendChild(removeBtn);
          imagePreview.appendChild(wrapper);
        };
        reader.readAsDataURL(file);
      });

      previewWrapper.classList.remove("hidden");
      previewConfirm.checked = false;
      previewConfirm.required = true;

      fileInput.value = "";
    } else {
      fileNameDisplay.textContent = "No file chosen";
      previewWrapper.classList.add("hidden");
      previewConfirm.required = false;
    }
  });
}

function openForm(packName) {
  const formContainer = document.querySelector(".form-container");
  const clothingOptions = document.getElementById("clothing-options");
  const warningBox = document.getElementById("premium-warning");
  const clothingField = document.getElementById("clothing");
  const styleField = document.getElementById("style");

  formContainer.style.display = "block";

  if (["Ultimate Pack", "Celestial Pack"].includes(packName)) {
    warningBox.classList.remove("hidden");
  } else {
    warningBox.classList.add("hidden");
  }

  if (["Premium Pack", "Ultimate Pack", "Celestial Pack"].includes(packName)) {
    clothingOptions.classList.remove("hidden");
    clothingOptions.style.display = "block";
  } else {
    clothingOptions.style.display = "none";
    if (clothingField) clothingField.value = "None";
  }

  let formTitle = document.getElementById("form-title");
  if (!formTitle) {
    formTitle = document.createElement("h2");
    formTitle.id = "form-title";
    formContainer.insertBefore(formTitle, formContainer.firstChild);
  }
  formTitle.innerText = `Order Form for ${packName}`;

  document.getElementById("selected-pack").value = packName;

  if (styleField && styleField.value === "Unspecified") {
    styleField.value = "Regulus";
    handleAvatarBaseChange();
  }

  window.scrollTo({
    top: formContainer.offsetTop,
    behavior: "smooth",
  });
}

async function submitForm(event) {
  event.preventDefault();

  const form = document.getElementById("order-form");
  const formData = new FormData(form);

  const description = formData.get("description");
  const name = formData.get("name");
  const style = formData.get("style");
  const clothing = formData.get("clothing") || "None";
  const discordId = formData.get("discord-id");
  const pack = formData.get("pack");

  let baseToSend = style;
  if (style === "Other") {
    const customBaseInput = document.getElementById("custom-base").value.trim();
    baseToSend = customBaseInput !== "" ? customBaseInput : "None";
  }

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
    await showModal({
      message:
        "🚫 Inappropriate content detected. Please remove any profanity or links.",
      confirmText: "Understood",
    });
    return;
  }

  const previewConfirmed = document.getElementById("preview-confirm").checked;
  if (selectedFiles.length > 0 && !previewConfirmed) {
    await showModal({
      message: "📷 Please confirm the image preview before submitting.",
      confirmText: "Okay",
    });
    return;
  }

  const highTierPacks = ["Ultimate Pack", "Celestial Pack"];
  if (highTierPacks.includes(pack)) {
    const confirm = await showModal({
      message: `⚠️ You are ordering a high-tier commission with advanced features.\nAre you sure you want to continue?`,
      confirmText: "Yes, continue",
      cancelText: "Cancel",
    });

    if (!confirm) return;
  }

  document.querySelector(".submit").disabled = true;
  document.getElementById("submission-overlay").classList.remove("hidden");

  const submission = new FormData();
  submission.append("name", name);
  submission.append("description", description);
  submission.append("style", baseToSend);
  submission.append("clothing", clothing);
  submission.append("discord-id", discordId);
  submission.append("pack", pack);

  if (selectedFiles.length > 0) {
    selectedFiles.forEach((file) => {
      submission.append("file", file);
    });
  }

  try {
    const res = await fetch("https://commissions-1e9a.onrender.com/submit", {
      method: "POST",
      body: submission,
    });

    if (!res.ok) throw new Error("Server responded with error");

    form.reset();
    selectedFiles = [];
    document.getElementById("image-preview-wrapper").classList.add("hidden");
    document.querySelector(".form-container").style.display = "none";
    document.getElementById("premium-warning").classList.add("hidden");
    document.getElementById("submission-overlay").classList.add("hidden");
    document.getElementById("submission-success").classList.remove("hidden");
  } catch (error) {
    document.getElementById("submission-overlay").classList.add("hidden");
    await showModal({
      message:
        "❌ An error occurred while submitting your order. Please try again later.",
      confirmText: "Okay",
    });
    console.error("Error:", error);
  } finally {
    document.querySelector(".submit").disabled = false;
  }
}

function showModal({ message, confirmText = "OK", cancelText, type = "info" }) {
  return new Promise((resolve) => {
    const modal = document.getElementById("custom-modal");
    const messageBox = document.getElementById("modal-message");
    const confirmBtn = document.getElementById("modal-confirm");
    const cancelBtn = document.getElementById("modal-cancel");

    messageBox.innerHTML = message;
    confirmBtn.textContent = confirmText;

    if (cancelText) {
      cancelBtn.textContent = cancelText;
      cancelBtn.classList.remove("hidden");
    } else {
      cancelBtn.classList.add("hidden");
    }

    modal.classList.remove("hidden");

    const cleanup = () => {
      confirmBtn.onclick = null;
      cancelBtn.onclick = null;
      modal.classList.add("hidden");
    };

    confirmBtn.onclick = () => {
      cleanup();
      resolve(true);
    };

    cancelBtn.onclick = () => {
      cleanup();
      resolve(false);
    };
  });
}

function closeSuccess() {
  document.getElementById("submission-success").classList.add("hidden");
}

function handleAvatarBaseChange() {
  const styleField = document.getElementById("style");
  const style = styleField.value;
  const customBaseWrapper = document.getElementById("customBaseWrapper");
  const clothingOptions = document.getElementById("clothing-options");
  const clothingField = document.getElementById("clothing");

  if (customBaseWrapper) {
    if (style === "Other") {
      customBaseWrapper.classList.remove("hidden");
    } else {
      customBaseWrapper.classList.add("hidden");
    }
  }

  const basesWithClothing = [
    "Regulus",
    "Novabeast",
    "Nardoragon",
    "Protogen",
    "Mayu",
    "Rexouium",
    "Taidum",
    "Regulus 3.0",
    "Other",
  ];

  if (clothingOptions) {
    if (basesWithClothing.includes(style)) {
      clothingOptions.classList.remove("hidden");
    } else {
      clothingOptions.classList.add("hidden");
      if (clothingField) clothingField.value = "None";
    }
  }
}

function openDetails(avatar) {
  const avatarData = {
    avatar1: {
      title: "Erolic",
      img: "../avatars/11.png",
      desc: "A fusion of Erolis with a twist of originality and flair.",
    },
    avatar2: {
      title: "Erolis",
      img: "../avatars/22.png",
      desc: "My signature avatar—beloved and currently in use.",
    },
    avatar3: {
      title: "Mistic",
      img: "../avatars/33.png",
      desc: "The very first avatar I ever created. Where it all began.",
    },
    avatar4: {
      title: "Null",
      img: "../avatars/44.png",
      desc: "A meaningful creation that holds a special place in my journey.",
    },
    avatar5: {
      title: "Loufy",
      img: "../avatars/55.png",
      desc: "The first commission I fully brought to life—simple but proud.",
    },
    avatar6: {
      title: "Ara",
      img: "../avatars/66.png",
      desc: "Striking colors and a bold presence—an avatar with attitude.",
    },
    avatar7: {
      title: "Cristal",
      img: "../avatars/77.png",
      desc: "A sparkling gem of personality, designed to steal the spotlight.",
    },
    avatar8: {
      title: "Stas",
      img: "../avatars/88.jpg",
      desc: "A stealthy feline warrior, sworn to protect the city in silence.",
    },
    avatar9: {
      title: "Kenith",
      img: "../avatars/99.png",
      desc: "A mysterious purple dragon with a sharp mind—and maybe a fiery side too.",
    },
    avatar10: {
      title: "Blaze",
      img: "../avatars/111.png",
      desc: "Blue and white creature. He's very fluffy too!",
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
  document.getElementById("premium-warning").classList.add("hidden");
}
