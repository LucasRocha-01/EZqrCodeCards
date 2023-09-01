const fs = require("fs");
const PDFDocument = require("pdfkit");
const { createCanvas, loadImage } = require("canvas");
const canvas = createCanvas(376, 667);
const ctx = canvas.getContext("2d");

require("dotenv").config();

const axios = require("axios");

var QRcode = require("qrcode");

function formatString(text) {
	return text
		.replace(/[^\w\s]/gi, "") // Remove special characters
		.replace(/\s+/g, "_"); // Replace spaces with underscores
}

// Função para buscar dados da API
async function fetchDataFromAPI(item) {
	let dataToSend = {
		url: process.env.SITE_URL + item.COD_VENDEDOR,
	};

	try {
		const response = await axios.post(
			"https://api.tinyurl.com/create?api_token=" + process.env.API_KEY_TINYURL,
			dataToSend
		);
		return response.data; // Retorna os dados da API
	} catch (error) {
		console.error("Erro ao buscar dados da API:", error);
		return null;
	}
}

async function generateQRcode(item) {
	let { data } = await fetchDataFromAPI(item);

	let nameArquivo = formatString(item.NOME) + "_" + item.COD_VENDEDOR;

	await new Promise((resolve, reject) => {
		QRcode.toFile(
			`qrcodes/${nameArquivo}.png`,
			data.tiny_url,
			{
				color: {
					dark: "#00F", // Blue dots
					light: "#0000", // Transparent background
				},
			},
			function (err) {
				if (err) throw err;
				console.log("done");
				resolve(nameArquivo);
			}
		);
	});

	return { nameArquivo, data };
}

async function generateCard(item) {
	let { nameArquivo, data } = await generateQRcode(item);

	const nome = formatString(item.NOME).split("_");

	try {
		loadImage("modelos/card.png").then((imageCard) => {
			ctx.drawImage(imageCard, 0, 0);
			// Draw cat with lime helmet
			loadImage(`qrcodes/${nameArquivo}.png`).then((imageQR) => {
				// Write Seller Name
				ctx.font = "25px Arial";
				ctx.textAlign = "center";
				ctx.fillText(`${nome[0]} ${nome[1]}`, 188, 186);
				// Write Seller Phone
				ctx.font = "20px Arial";
				ctx.textAlign = "center";
				ctx.fillText("+55 21 98123-6788", 200, 216);

				// Write Seller Code
				ctx.font = "20px Arial";
				ctx.textAlign = "center";
				ctx.fillText(item.COD_VENDEDOR, 219, 401);

				ctx.drawImage(imageQR, 102, 446, 175, 157);

				canvas.toBuffer("image/png", {
					compressionLevel: 3,
					filters: canvas.PNG_FILTER_NONE,
				});

				fs.writeFileSync(`cards/${nameArquivo}.png`, canvas.toBuffer());

				// Create a document
				const doc = new PDFDocument({ size: "A5" });
				// Pipe its output somewhere, like to a file or HTTP response
				// See below for browser usage
				doc.pipe(fs.createWriteStream(`cards/${nameArquivo}.pdf`));

				// Add an image, constrain it to a given size, and center it vertically and horizontally
				doc.image(`cards/${nameArquivo}.png`, 25, 0, {
					fit: [376, 587],
					align: "center",
					valign: "center",
					link: data.tiny_url,
				});

				// Finalize PDF file
				doc.end();
			});
		});
	} catch (error) {
		console.error("Erro ao carregar a imagem:", err);
	}
}

(async () => {
	// Lê o arquivo JSON externo
	fs.readFile("dados.json", "utf8", async (err, data) => {
		if (err) {
			console.error("Erro ao ler o arquivo JSON:", err);
			return;
		}

		const jsonData = JSON.parse(data);

		for (const item of jsonData) {
			await generateCard(item);
		}
	});
})();
