// test kodu 1
// test kodu 2
const { execSync } = require('child_process');
const fs = require('fs');

// Function to upload to IPFS using command line
async function uploadToIPFS(filePath) {
    try {
        const result = execSync(`ipfs add ${filePath}`, { encoding: 'utf-8', env: process.env });
        const cid = result.split(' ')[1];
        return cid;
    } catch (error) {
        console.error('Error uploading to IPFS:', error);
        throw error;
    }
}

// CID ile dosyayı indirme fonksiyonu
async function downloadFromIPFS(cid) {
    try {
        const content = execSync(`ipfs cat ${cid}`, {
            encoding: 'utf-8',
            env: process.env,
        });
        return content;
    } catch (error) {
        console.error('Error downloading from IPFS:', error);
        throw error;
    }
}
async function main() {
    try {
        // Create a test file fs.writeFileSync('test.txt', 'Hello, IPFS!');
        // Upload to IPFS const ipfsCid = await uploadToIPFS('test.txt');
        console.log('Uploaded to IPFS, CID:', ipfsCid);
        // Download from IPFS const ipfsContent = await downloadFromIPFS(ipfsCid);
        console.log('Downloaded from IPFS, content:', ipfsContent);
        // Clean up fs.unlinkSync('test.txt');
    } catch (error) {
        console.error('An error occurred in main:', error);
    }
}
main();
// test kodu 3