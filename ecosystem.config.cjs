// pm2 process for vistaar-backend (Express). Port from .env (PORT=4300).
module.exports = {
  apps: [{ name: 'vistaar-backend', script: 'server.js', cwd: '/srv/vistaar-backend',
    exec_mode: 'fork', max_memory_restart: '300M', env: { NODE_ENV: 'production' } }],
};
