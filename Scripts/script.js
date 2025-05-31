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

      fileNameDisplay.textContent = `${
        imagePreview.children.length + filesToAdd.length
      } file(s) selected`;

      filesToAdd.forEach((file) => {
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
  const name = formData.get("name");
  const style = formData.get("style");
  const clothing = formData.get("clothing") || "None";
  const discordId = formData.get("discord-id");
  const pack = formData.get("pack");

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

  const previewConfirmed = document.getElementById("preview-confirm").checked;
  const submission = new FormData();

  submission.append("name", name);
  submission.append("description", description);
  submission.append("style", style);
  submission.append("clothing", clothing);
  submission.append("discord-id", discordId);
  submission.append("pack", pack);

  const files = document.getElementById("file").files;

  if (files.length > 0) {
    if (!previewConfirmed) {
      alert("Please confirm the image preview before submitting.");
      return;
    }

    for (let i = 0; i < files.length; i++) {
      submission.append("file", files[i]);
    }
  }

  fetch("https://comissions-production.up.railway.app/submit", {
    method: "POST",
    body: submission,
  })
    .then((res) => {
      if (!res.ok) throw new Error("Server responded with error");
      alert("Order submitted successfully!");
      form.reset();
      document.getElementById("image-preview-wrapper").classList.add("hidden");
      document.querySelector(".form-container").style.display = "none";
    })
    .catch((error) => {
      alert("Error submitting order.");
      console.error("Error:", error);
    });
}

function handleAvatarBaseChange() {
  const style = document.getElementById("style").value;
  const customBaseWrapper = document.getElementById("custom-base-wrapper");
  const clothingOptions = document.getElementById("clothing-options");

  if (style === "Other") {
    customBaseWrapper.classList.remove("hidden");
  } else {
    customBaseWrapper.classList.add("hidden");
  }

  const basesWithClothing = [
    "Regulus",
    "Novabeast",
    "Nardodragon",
    "Protogen",
    "Mayu",
    "Rexouium",
    "Taidum",
    "Regulus 3.0",
  ];

  if (basesWithClothing.includes(style)) {
    clothingOptions.classList.remove("hidden");
  } else {
    clothingOptions.classList.add("hidden");
  }
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
      desc: "The avatar colors are stunning and it gives off a badass vibe.",
    },
    avatar7: {
      title: "Cristal",
      img: "../avatars/77.png",
      desc: "Is it a crystal or a gem? Just me trying to outshine everything. Sparkles included!",
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
