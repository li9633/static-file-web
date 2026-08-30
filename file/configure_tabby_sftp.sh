#!/bin/bash

set -e  # 出错立即终止

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 备份目录（使用固定名称以便恢复）
BACKUP_DIR="$HOME/.tabby_config_backup"

# 日志函数
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# 显示帮助信息
show_help() {
    cat << EOF
Tabby SFTP 目录自动汇报配置脚本

用法: $0 [选项]

选项:
  install    安装 Tabby SFTP 配置（默认）
  restore    恢复之前的配置
  status     检查当前配置状态
  help       显示此帮助信息

功能:
  - 自动配置 Bash、Zsh 和 Fish 的 Tabby SFTP 支持
  - 智能创建不存在的配置文件
  - 自动备份原有配置
  - 一键恢复功能

示例:
  $0          # 安装配置
  $0 install  # 安装配置
  $0 restore  # 恢复备份
  $0 status   # 检查状态
EOF
}

# 检查配置状态
check_status() {
    log "检查 Tabby SFTP 配置状态..."
    
    local has_config=0
    
    # 检查 Bash
    if [[ -f "$HOME/.bash_profile" ]] && grep -q "1337;CurrentDir" "$HOME/.bash_profile"; then
        echo -e "${GREEN}✓${NC} Bash 配置已安装"
        has_config=1
    else
        echo -e "${YELLOW}⚠${NC} Bash 配置未安装"
    fi
    
    # 检查 Zsh
    if [[ -f "$HOME/.zshrc" ]] && grep -q "1337;CurrentDir" "$HOME/.zshrc"; then
        echo -e "${GREEN}✓${NC} Zsh 配置已安装"
        has_config=1
    else
        echo -e "${YELLOW}⚠${NC} Zsh 配置未安装"
    fi
    
    # 检查 Fish
    if [[ -f "$HOME/.config/fish/config.fish" ]] && grep -q "1337;CurrentDir" "$HOME/.config/fish/config.fish"; then
        echo -e "${GREEN}✓${NC} Fish 配置已安装"
        has_config=1
    else
        echo -e "${YELLOW}⚠${NC} Fish 配置未安装"
    fi
    
    # 检查备份
    if [[ -d "$BACKUP_DIR" ]]; then
        echo -e "${GREEN}✓${NC} 存在备份文件: $BACKUP_DIR"
    else
        echo -e "${YELLOW}⚠${NC} 无备份文件"
    fi
    
    return $has_config
}

#创建备份
create_backup() {
    log "创建配置备份..."
    mkdir -p "$BACKUP_DIR" || error "无法创建备份目录"
    
    # 备份现有配置文件
    local files_backed_up=0
    
    if [[ -f "$HOME/.bash_profile" ]]; then
        cp "$HOME/.bash_profile" "$BACKUP_DIR/bash_profile.backup"
        files_backed_up=$((files_backed_up + 1))
    fi
    
    if [[ -f "$HOME/.zshrc" ]]; then
        cp "$HOME/.zshrc" "$BACKUP_DIR/zshrc.backup"
        files_backed_up=$((files_backed_up + 1))
    fi
    
    if [[ -f "$HOME/.config/fish/config.fish" ]]; then
        cp "$HOME/.config/fish/config.fish" "$BACKUP_DIR/config.fish.backup"
        files_backed_up=$((files_backed_up + 1))
    fi
    
    log "备份完成 ($files_backed_up 个文件)"
}

# 恢复备份
restore_backup() {
    if [[ ! -d "$BACKUP_DIR" ]]; then
        error "找不到备份目录: $BACKUP_DIR"
    fi
    
    log "开始恢复配置..."
    local files_restored=0
    
    # 恢复 Bash 配置
    if [[ -f "$BACKUP_DIR/bash_profile.backup" ]]; then
        cp "$BACKUP_DIR/bash_profile.backup" "$HOME/.bash_profile"
        log "恢复 Bash 配置"
        ((files_restored++))
    else
        warn "无 Bash 配置备份"
    fi
    
    # 恢复 Zsh 配置
    if [[ -f "$BACKUP_DIR/zshrc.backup" ]]; then
        cp "$BACKUP_DIR/zshrc.backup" "$HOME/.zshrc"
        log "恢复 Zsh 配置"
        ((files_restored++))
    else
        warn "无 Zsh 配置备份"
    fi
    
    # 恢复 Fish 配置
    if [[ -f "$BACKUP_DIR/config.fish.backup" ]]; then
        cp "$BACKUP_DIR/config.fish.backup" "$HOME/.config/fish/config.fish"
        log "恢复 Fish 配置"
        ((files_restored++))
    else
        warn "无 Fish 配置备份"
    fi
    
    # 可选：删除备份目录
    read -p "是否删除备份目录? [y/N] " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$BACKUP_DIR"
        log "备份目录已删除"
    fi
    
    log "恢复完成 ($files_restored 个文件)"
}

# 配置 Bash
configure_bash() {
    local bash_profile="$HOME/.bash_profile"
    local bash_config="export PS1=\"\$PS1\[\e]1337;CurrentDir=\"'\$(pwd)\a\]'"
    
    # 检查是否已配置
    if [[ -f "$bash_profile" ]] && grep -q "1337;CurrentDir" "$bash_profile"; then
        warn "Bash 配置已存在，跳过"
        return 0
    fi
    
    log "配置 Bash..."
    
    # 如果.bash_profile不存在，创建并添加.bashrc加载逻辑
    if [[ ! -f "$bash_profile" ]]; then
        warn "创建新的 .bash_profile 文件"
        cat > "$bash_profile" << 'EOF'
#!/bin/bash
# Tabby SFTP 目录自动汇报配置 (创建于 $(date))

# 加载 .bashrc 如果存在
if [ -f ~/.bashrc ]; then
    . ~/.bashrc
fi

EOF
    fi
    
    # 添加Tabby配置
    echo "# Tabby SFTP 目录自动汇报配置 " >> "$bash_profile"
    echo $bash_config >> "$bash_profile"
    
    # 验证配置
    if grep -q "1337;CurrentDir" "$bash_profile"; then
        log "✓ Bash 配置完成"
    else
        error "Bash 配置失败"
    fi
}

# 配置 Zsh
configure_zsh() {
    local zshrc="$HOME/.zshrc"
    # 保持与官方Wiki一致的配置
    local zsh_config='precmd () { echo -n "\x1b]1337;CurrentDir=$(pwd)\x07" }'
    
    # 检查是否已配置
    if [[ -f "$zshrc" ]] && grep -q "1337;CurrentDir" "$zshrc"; then
        warn "Zsh 配置已存在，跳过"
        return 0
    fi
    
    log "配置 Zsh..."
    
    # 创建文件如果不存在
    if [[ ! -f "$zshrc" ]]; then
        touch "$zshrc"
    fi
    
    # 添加配置
    echo "# Tabby SFTP 目录自动汇报配置 " >> "$zshrc"
    echo "$zsh_config" >> "$zshrc"
    
    # 验证配置
    if grep -q "1337;CurrentDir" "$zshrc"; then
        log "✓ Zsh 配置完成"
    else
        error "Zsh 配置失败"
    fi
}

# 配置 Fish
configure_fish() {
    local fish_config="$HOME/.config/fish/config.fish"
    # 保持与官方Wiki一致的配置
    local fish_config_content='function __tabby_working_directory_reporting --on-event fish_prompt
    echo -en "\e]1337;CurrentDir=$PWD\x7"
end'
    
    # 检查是否已配置
    if [[ -f "$fish_config" ]] && grep -q "1337;CurrentDir" "$fish_config"; then
        warn "Fish 配置已存在，跳过"
        return 0
    fi
    
    log "配置 Fish..."
    
    # 创建目录和文件如果不存在
    mkdir -p "$(dirname "$fish_config")"
    if [[ ! -f "$fish_config" ]]; then
        touch "$fish_config"
    fi
    
    # 添加配置
    echo "# Tabby SFTP 目录自动汇报配置 " >> "$fish_config"
    echo "$fish_config_content" >> "$fish_config"
    
    # 验证配置
    if grep -q "1337;CurrentDir" "$fish_config"; then
        log "✓ Fish 配置完成"
    else
        error "Fish 配置失败"
    fi
}

# 安装配置
install_config() {
    log "开始安装 Tabby SFTP 配置..."
    
    # 创建备份
    create_backup
    
    # 配置各shell
    configure_bash
    configure_zsh
    configure_fish
    
    # 完成信息
    echo
    log "✅ Tabby SFTP 配置完成！"
    echo
    info "请重新启动终端或运行以下命令使配置生效："
    echo "  source ~/.bash_profile  # 对于 Bash"
    echo "  source ~/.zshrc         # 对于 Zsh"
    echo "  source ~/.config/fish/config.fish  # 对于 Fish"
    echo
    info "备份位置: $BACKUP_DIR"
    info "如需恢复，请运行: $0 restore"
}

# 主函数
main() {
    local action="${1:-install}"
    
    case "$action" in
        install|"")
            install_config
            ;;
        restore)
            restore_backup
            ;;
        status)
            check_status
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            error "未知操作: $action"
            show_help
            exit 1
            ;;
    esac
}

# 设置错误处理
trap 'error "脚本执行出错，请检查日志"; exit 1' ERR

# 执行主函数
main "$@"