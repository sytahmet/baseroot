
// test kodu 1
// test kodu 2
const { Connection, PublicKey, Keypair, Transaction, SystemProgram, sendAndConfirmTransaction, TransactionInstruction } = require("@solana/web3.js");
const express = require('express');
const multer = require('multer');
const bs58 = require("bs58");
const crypto = require('crypto');
const pinataSDK = require('@pinata/sdk');
const fs = require('fs');
const { execSync } = require('child_process');

const programId = new PublicKey("D4vE1yXw3n3G86V9G9R71T5iG6K7T26F5rL7iP8JdC7f");
const rpcUrl = "http://localhost:8899";


// Pinata API Key ve Secret
const pinataApiKey = '7897c4f703cea434a751'; // Buraya kendi API Keyinizi ekleyin
const pinataSecretApiKey = 'd1cf21c8d019b2519aee7179f4446fc44e7e33035a06782004d050e99acd7556'; // Buraya kendi Secret API Keyinizi ekleyin
// Pinata SDK'yı Başlat
const pinata = pinataSDK(pinataApiKey, pinataSecretApiKey);
// Pinata ile dosyayı IPFS'e yükleme fonksiyonu
async function uploadToIPFS(filePath) {
    try {
        const readableStreamForFile = fs.createReadStream(filePath);
        const options = {
            pinataMetadata: {
                name: 'My File',
            },
            pinataOptions: {
                cidVersion: 0,
            }
        };
        const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
        return result.IpfsHash;
    } catch (error) {
        console.error('Error uploading to IPFS (Pinata):', error);
        throw error;
    }
}

async function sendDataToSolana(researchHash, researchCid, owner) {
    try {
        const connection = new Connection(rpcUrl, "confirmed");

        const instruction = new TransactionInstruction({
            keys: [
                { pubkey: owner, isSigner: true, isWritable: true },
            ],
            programId,
            data: Buffer.from(
                Uint8Array.from([
                    ...[1],
                    ...Array(32).fill(0),
                    ...Array.from(new Uint8Array(Buffer.from(researchHash, 'hex'))),
                    ...Array.from(new Uint8Array(Buffer.from(researchCid))),
                ])
            ),
        });

        const transaction = new Transaction().add(instruction);
        const signature = await sendAndConfirmTransaction(connection, transaction, [keypair]);
        console.log("Transaction confirmed with signature:", signature);
        return signature;
    } catch (error) {
        console.error("Error sending data to Solana:", error);
        throw error;
    }
}
const keypair = Keypair.fromSecretKey(bs58.decode("31X23H4c3U51Q6zJqj38T9c97z3zB6f3t9t8J1zK9b9zB9zF4v3G8n4T7j8v9m5x7t2c1j4b5v6n9m8x7c4b5n2v1"));
async function calculateHash(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
}

// CID ile dosyayı indirme fonksiyonu
async function downloadFromIPFS(cid) {
    try {
        const content = execSync(`ipfs cat ${cid}`, { encoding: 'utf-8', env: process.env });
        return content;
    } catch (error) {
        console.error('Error downloading from IPFS:', error);
        throw error;
    }
}
async function main() {
    try {
        // Create a test file
        fs.writeFileSync('test.txt', 'Hello, Pinata!');
        // Upload to IPFS via Pinata
        const ipfsCid = await uploadToIPFS('test.txt');
        console.log('Uploaded to IPFS (Pinata), CID:', ipfsCid);
        // Download from IPFS
        const ipfsContent = await downloadFromIPFS(ipfsCid);
        console.log('Downloaded from IPFS, content:', ipfsContent);
        // Clean up
        fs.unlinkSync('test.txt');
    } catch (error) {
        console.error('An error occurred in main:', error);
    }
}

const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const owner = req.body.owner;

        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        const filePath = file.path;

        // 1. Upload to IPFS
        const cid = await uploadToIPFS(filePath);

        // 2. Calculate hash
        const hash = await calculateHash(filePath);

        // 3. Send data to Solana
        const solanaResult = await sendDataToSolana(hash, cid, owner);

        // Delete the file after successful upload
        fs.unlinkSync(filePath);

        res.json({ cid, hash, solanaResult });
    } catch (error) {
        console.error('Error processing file upload:', error);
        res.status(500).send('An error occurred during file upload.');
    }
});



// test kodu 3