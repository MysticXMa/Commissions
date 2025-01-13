function openForm(tier) {
    document.getElementById('form-title').innerText = `Order Form for ${tier}`;
    document.getElementById('selected-pack').value = tier;
    document.querySelector('.form-container').style.display = 'block';

    window.scrollTo({
        top: document.querySelector('.form-container').offsetTop,
        behavior: 'smooth'
    });
}

const WEBHOOK_URL = 'https://discord.com/api/webhooks/1328015749138354247/4wKcq_jUMl_xIn1DLa4-73bEI6XnwKbQ1drgal4qdATo_h8vvsPOY-fdfA203iwfvppZ';

function submitForm(event) {
    event.preventDefault();

    const form = document.getElementById('order-form');
    const formData = new FormData(form);
    const description = formData.get('description');

    const curseWords = [
        "shit", "fuck", "bitch", "asshole", "damn", "hell", "bastard", "slut", "whore",
        "dick", "cock", "pussy", "cunt", "motherfucker", "fag", "bastard", "retard",
        "idiot", "douche", "prick", "twat", "douchebag", "faggot", "nigger", "spic", "chink",
        "kike", "gook", "jap", "raghead", "sandnigger", "coon", "tranny", "queer", "dyke",
        "bitchass", "shithead", "fuckhead", "dickhead", "piss", "pissed", "ass", "asswipe",
        "assclown", "cockhead", "shitfuck", "motherfucking", "fucker", "cum", "cocksucker",
        "cockroach", "butthole", "dickbag", "dickhead", "clit", "fistfuck", "blowjob", "handjob",
        "smegma", "scumbag", "fucktard", "bastardized", "sodomy", "peckerwood", "prickhead", "shitshow",
        "shitstain", "whorehouse", "chickenfucker", "cockblock", "penis", "testicles", "nutsack",
        "shitstorm", "motherfucking", "cockmongler", "jizz", "gash", "pube", "bootyhole", "pussylicker",
        "pissflap", "dingleberry", "bitchboy", "shitlicker", "fistbump", "shitstain", "cockmaster",
        "suckass", "dickrider", "buttfucker", "skank", "cumdumpster", "bastardization", "fatass",
        "dickface", "cumguzzler", "cuntface", "assfucker", "fuckyourself", "fuckinghell", "asswipe",
        "crackwhore", "skankwhore", "dickfuck", "shitass", "fuckingidiot", "cockwhore", "dicklicker"
    ];

    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const containsURL = urlPattern.test(description);
    const containsCurseWord = curseWords.some(curse => {
        const regex = new RegExp(`\\b${curse}\\b`, 'i');
        return regex.test(description);
    });
    const containsAtSymbol = description.includes('@');

    if (containsURL) {
        alert('URLs are not allowed in the description.');
        return;
    }

    if (containsCurseWord) {
        alert('Please avoid using inappropriate language in the description.');
        return;
    }

    if (containsAtSymbol) {
        alert('The "@" symbol is not allowed in the description.');
        return;
    }

    const message = {
        username: 'Commissions Bot',
        embeds: [{
            title: 'New Order Submission',
            color: 3447003,
            fields: [
                { name: 'Name', value: formData.get('name') || 'N/A' },
                { name: 'Avatar Description', value: description || 'N/A' },
                { name: 'Avatar Base', value: formData.get('style') || 'N/A' },
                { name: 'Clothing Options', value: formData.get('clothing') || 'None' },
                { name: 'Discord ID', value: formData.get('discord-id') || 'N/A' },
            ],
            timestamp: new Date().toISOString(),
        }],
    };

    const file = formData.get('file');
    console.log('File:', file);

    if (file && file.size > 0) {
        const reader = new FileReader();
        reader.onload = () => {
            const fileData = reader.result.split(',')[1];
            const fileType = file.type.split('/')[1];
            console.log('File Type:', fileType);

            if (fileType === 'png' || fileType === 'jpeg' || fileType === 'jpg') {
                message.embeds[0].image = { url: 'attachment://image.' + fileType };
                console.log('Image attachment URL:', message.embeds[0].image.url);

                sendMessageToDiscord(message, file);
            } else {
                alert('Unsupported file type. Please upload a PNG or JPEG image.');
                console.error('Unsupported file type:', fileType);
            }
        };
        reader.readAsDataURL(file);
    } else {
        sendMessageToDiscord(message);
    }
}

function sendMessageToDiscord(message, file = null) {
    const formData = new FormData();
    formData.append('payload_json', JSON.stringify(message));

    if (file) {
        formData.append('file', file);
    }

    fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
    })
        .then(() => {
            alert('Order submitted successfully!');
            document.getElementById('order-form').reset();
        })
        .catch((error) => {
            alert('Error submitting order.');
            console.error('Error:', error);
        });
}
