export const configFTP = {
    host: process.env.FTP_HOST || '',
    user: process.env.FTP_USER || '',
    password: process.env.FTP_PASSWORD || '',
    parallel: 5,
    enabled: !!(process.env.FTP_HOST && process.env.FTP_USER),
}
