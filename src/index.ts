import { execSync } from "child_process";
import fs from 'fs'
import path from 'path'

const log = console.log

function detectPackageManager(): 'npm' | 'yarn' | 'pnpm' {
  if (fs.existsSync('yarn.lock')) return 'yarn'
  if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm'
  return 'npm'
}

function installDeps(pkgManager: string) {
  const install = {
    npm: 'npm install -D',
    yarn: 'yarn add -D',
    pnpm: 'pnpm add -D'
  }[pkgManager]

  const deps = [
    'cz-customizable',
    'commitlint',
    '@commitlint/config-conventional',
    'husky'
  ]

  log(`📦 Installing dependencies with ${pkgManager}...`)
  execSync(`${install} ${deps.join(' ')}`, { stdio: 'inherit' })

  // ✅ 检查是否全局安装了 commitizen
  try {
    execSync('commitizen --version', { stdio: 'ignore' })
    log('✅ Global commitizen already installed')
  } catch {
    log('📦 commitizen not found globally, installing globally...')
    try {
      execSync('npm install -g commitizen', { stdio: 'inherit' })
      log('✅ commitizen installed globally')
    } catch (error) {
      console.error('❌ Failed to install commitizen globally:', error)
    }
  }
}

export function writeConfigFiles() {
  const templateDir = path.join(__dirname, '..', 'templates')
  const rootFiles = ['.cz-config.cjs', 'commitlint.config.ts']
  const huskyDir = path.join(process.cwd(), '.husky')
  const currentYear = new Date().getFullYear()
  const author = 'zack-xy<zack_zhengxiyun@163.com>' 

  // 确保 .husky 目录存在
  if (!fs.existsSync(huskyDir)) {
    fs.mkdirSync(huskyDir, { recursive: true })
  }

  // 写入根目录文件
  rootFiles.forEach(file => {
    const content = fs.readFileSync(path.join(templateDir, file))
    fs.writeFileSync(path.join(process.cwd(), file), content)
    log(`✅ Created ${file}`)
  })

  // 写入 .husky/commit-msg 文件
  const commitMsgContent = fs.readFileSync(path.join(templateDir, 'commit-msg'))
  const commitMsgPath = path.join(huskyDir, 'commit-msg')
  fs.writeFileSync(commitMsgPath, commitMsgContent)

  // 添加执行权限
  fs.chmodSync(commitMsgPath, 0o755)

  log('✅ Created .husky/commit-msg')

  // 写入 LICENSE 文件，替换 year 和 author
  const licenseTemplate = fs.readFileSync(path.join(templateDir, 'LICENSE'), 'utf-8')
  const licenseContent = licenseTemplate
    .replace('{{year}}', String(currentYear))
    .replace('{{author}}', author)

  fs.writeFileSync(path.join(process.cwd(), 'LICENSE'), licenseContent)
  log('✅ Created LICENSE')
}


function setupHusky() {
  execSync('npx husky init', { stdio: 'inherit' })

  const pkgPath = path.resolve('package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  pkg.config = pkg.config || {}
  pkg.config.commitizen = {
    "path": "node_modules/cz-customizable"
  },
  pkg.config['cz-customizable'] = {
    "config": "./.cz-config.cjs"
  }
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
  log('✅ Husky commit-msg hook created')
}

function main() {
  const pkgManager = detectPackageManager()
  installDeps(pkgManager)
  setupHusky()
  writeConfigFiles()
  log('🎉 Commit convention setup complete!')
}

main()
