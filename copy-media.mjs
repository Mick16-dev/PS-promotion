import { copyFileSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

const brain = join(homedir(), '.gemini', 'antigravity', 'brain', 'dce758e7-4070-4b73-b302-19d813d9e6c0')
const pub = new URL('./public', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')

copyFileSync(join(brain, 'media__1773347264307.png'), join(pub, 'pipe-before.png'))
console.log('✅ pipe-before.png copied')

copyFileSync(join(brain, 'media__1773347274891.png'), join(pub, 'plumber-after.png'))
console.log('✅ plumber-after.png copied')
