import fs, { createReadStream } from 'fs'


export const uploadFiles = async (files) => {
        
    try {
        const filesUrl = [];
        for (let i = 0; i < files.length; i++) {
           
            const { path, originalname, mimetype,  filename} = req.files[i];
            const arr = originalname.split('.');
            const newName = Date.now() + '.' + arr[arr.length - 1];
            const readStream = createReadStream(path);
            await ftpClient.uploadFrom(readStream, '/'+ newName).then((res)=>{
                filesUrl.push(newName);
                console.log(res);
            }).catch((err)=>{
                throw new Error(err);
            })
        }
        res.send(filesUrl);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
