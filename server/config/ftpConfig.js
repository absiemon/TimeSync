import ftp from "basic-ftp"; 

const ftpClient = new ftp.Client()

try {
    await ftpClient.access({
        host: 'server.cdthemes.com',
        user: 'superdolphinsltd@superdolphins.com',
        password: '',
        secure: true 
    });
} catch (error) {
    throw new Error(error);
}

export default ftpClient;