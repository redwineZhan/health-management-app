#!/usr/bin/env python3
"""
Cursor IDE 集成脚本
提供与 Cursor IDE 的命令行交互能力

Features:
- 检查 Cursor 安装状态
- 打开文件/文件夹
- AI 对话 (通过 Cursor API)
- MCP 服务器管理
- 代码生成/解释/审查

Requirements:
- macOS / Windows / Linux
- Cursor IDE 已安装并登录
"""

import argparse
import json
import os
import platform
import subprocess
import sys
from pathlib import Path
from typing import Optional, Dict, Any, List


class CursorIntegration:
    """Cursor IDE 集成类"""
    
    def __init__(self):
        self.system = platform.system()
        self.cursor_path = self._find_cursor_path()
        self.config_dir = self._find_config_dir()
    
    def _find_cursor_path(self) -> Optional[Path]:
        """查找 Cursor CLI 路径"""
        # 环境变量优先
        env_path = os.environ.get("CURSOR_APP_PATH")
        if env_path:
            cli_path = Path(env_path) / "Contents/Resources/app/bin/cursor"
            if cli_path.exists():
                return cli_path
        
        # 按系统查找
        if self.system == "Darwin":  # macOS
            paths = [
                Path("/Applications/Cursor.app/Contents/Resources/app/bin/cursor"),
                Path.home() / "Applications/Cursor.app/Contents/Resources/app/bin/cursor",
            ]
        elif self.system == "Windows":
            paths = [
                Path(os.environ.get("LOCALAPPDATA", "")) / "Programs/cursor/Cursor.exe",
                Path(os.environ.get("PROGRAMFILES", "")) / "Cursor/Cursor.exe",
            ]
        else:  # Linux
            paths = [
                Path("/usr/bin/cursor"),
                Path("/usr/local/bin/cursor"),
                Path.home() / ".local/bin/cursor",
            ]
        
        for p in paths:
            if p.exists():
                return p
        
        # 尝试 which/where
        try:
            result = subprocess.run(
                ["which" if self.system != "Windows" else "where", "cursor"],
                capture_output=True, text=True
            )
            if result.returncode == 0 and result.stdout.strip():
                return Path(result.stdout.strip().split("\n")[0])
        except Exception:
            pass
        
        return None
    
    def _find_config_dir(self) -> Optional[Path]:
        """查找 Cursor 配置目录"""
        if self.system == "Darwin":
            config_dir = Path.home() / "Library/Application Support/Cursor"
        elif self.system == "Windows":
            config_dir = Path(os.environ.get("APPDATA", "")) / "Cursor"
        else:
            config_dir = Path.home() / ".config/Cursor"
        
        return config_dir if config_dir.exists() else None
    
    def is_installed(self) -> bool:
        """检查 Cursor 是否已安装"""
        return self.cursor_path is not None and self.cursor_path.exists()
    
    def get_version(self) -> Optional[str]:
        """获取 Cursor 版本"""
        if not self.is_installed():
            return None
        
        try:
            result = subprocess.run(
                [str(self.cursor_path), "--version"],
                capture_output=True, text=True, timeout=10
            )
            if result.returncode == 0:
                return result.stdout.strip().split("\n")[0]
        except Exception:
            pass
        return None
    
    def get_user_info(self) -> Optional[Dict[str, Any]]:
        """获取登录用户信息"""
        if not self.config_dir:
            return None
        
        storage_file = self.config_dir / "User/globalStorage/storage.json"
        if not storage_file.exists():
            return None
        
        try:
            with open(storage_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return {
                    "machine_id": data.get("telemetry.machineId", ""),
                    "device_id": data.get("telemetry.devDeviceId", ""),
                }
        except Exception:
            return None
    
    def get_mcp_config(self) -> List[Dict[str, Any]]:
        """获取 MCP 服务器配置"""
        if not self.config_dir:
            return []
        
        # MCP 配置可能在多个位置
        mcp_configs = []
        
        # 用户设置
        settings_file = self.config_dir / "User/settings.json"
        if settings_file.exists():
            try:
                with open(settings_file, 'r', encoding='utf-8') as f:
                    settings = json.load(f)
                    mcp_servers = settings.get("mcp.servers", {})
                    for name, config in mcp_servers.items():
                        mcp_configs.append({"name": name, **config})
            except Exception:
                pass
        
        return mcp_configs
    
    def open_file(self, path: str, line: Optional[int] = None, 
                  new_window: bool = False) -> bool:
        """在 Cursor 中打开文件"""
        if not self.is_installed():
            print("❌ Cursor 未安装", file=sys.stderr)
            return False
        
        cmd = [str(self.cursor_path)]
        
        if new_window:
            cmd.append("--new-window")
        
        if line:
            cmd.extend(["--goto", f"{path}:{line}"])
        else:
            cmd.append(path)
        
        try:
            subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return True
        except Exception as e:
            print(f"❌ 打开失败: {e}", file=sys.stderr)
            return False
    
    def add_mcp_server(self, name: str, command: str, args: List[str] = None,
                       env: Dict[str, str] = None) -> bool:
        """添加 MCP 服务器配置"""
        if not self.is_installed():
            print("❌ Cursor 未安装", file=sys.stderr)
            return False
        
        mcp_config = {
            "name": name,
            "command": command,
        }
        if args:
            mcp_config["args"] = args
        if env:
            mcp_config["env"] = env
        
        cmd = [
            str(self.cursor_path),
            "--add-mcp",
            json.dumps(mcp_config)
        ]
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            return result.returncode == 0
        except Exception as e:
            print(f"❌ 添加 MCP 服务器失败: {e}", file=sys.stderr)
            return False
    
    def status(self) -> Dict[str, Any]:
        """获取完整状态信息"""
        return {
            "installed": self.is_installed(),
            "version": self.get_version(),
            "cli_path": str(self.cursor_path) if self.cursor_path else None,
            "config_dir": str(self.config_dir) if self.config_dir else None,
            "user_info": self.get_user_info(),
            "mcp_servers": self.get_mcp_config(),
            "system": self.system,
        }


def cmd_status(cursor: CursorIntegration, args):
    """显示 Cursor 状态"""
    status = cursor.status()
    
    print("🖱️  Cursor IDE 状态")
    print("=" * 50)
    
    if status["installed"]:
        print(f"✅ 已安装: {status['version']}")
        print(f"   CLI 路径: {status['cli_path']}")
        print(f"   配置目录: {status['config_dir']}")
    else:
        print("❌ 未安装")
        print("   下载地址: https://cursor.com")
        return 1
    
    if status["user_info"]:
        print(f"\n📱 设备信息:")
        print(f"   Device ID: {status['user_info'].get('device_id', 'N/A')[:16]}...")
    
    if status["mcp_servers"]:
        print(f"\n🔌 MCP 服务器 ({len(status['mcp_servers'])} 个):")
        for server in status["mcp_servers"]:
            print(f"   - {server['name']}: {server.get('command', 'N/A')}")
    else:
        print("\n🔌 MCP 服务器: 未配置")
    
    if args.json:
        print("\n" + json.dumps(status, indent=2, ensure_ascii=False))
    
    return 0


def cmd_open(cursor: CursorIntegration, args):
    """在 Cursor 中打开文件"""
    path = os.path.abspath(args.path)
    
    if not os.path.exists(path):
        print(f"❌ 路径不存在: {path}", file=sys.stderr)
        return 1
    
    success = cursor.open_file(path, line=args.line, new_window=args.new_window)
    
    if success:
        if args.line:
            print(f"✅ 已在 Cursor 中打开: {path}:{args.line}")
        else:
            print(f"✅ 已在 Cursor 中打开: {path}")
        return 0
    else:
        return 1


def cmd_mcp_list(cursor: CursorIntegration, args):
    """列出 MCP 服务器"""
    servers = cursor.get_mcp_config()
    
    if not servers:
        print("📭 没有配置 MCP 服务器")
        print("\n添加示例:")
        print('  python3 cursor_cli.py mcp add --name "my-server" --command "node" --args "server.js"')
        return 0
    
    print(f"🔌 MCP 服务器 ({len(servers)} 个)")
    print("=" * 50)
    
    for server in servers:
        print(f"\n📦 {server['name']}")
        print(f"   命令: {server.get('command', 'N/A')}")
        if server.get('args'):
            print(f"   参数: {' '.join(server['args'])}")
        if server.get('env'):
            print(f"   环境变量: {list(server['env'].keys())}")
    
    if args.json:
        print("\n" + json.dumps(servers, indent=2, ensure_ascii=False))
    
    return 0


def cmd_mcp_add(cursor: CursorIntegration, args):
    """添加 MCP 服务器"""
    mcp_args = args.args.split() if args.args else None
    mcp_env = None
    if args.env:
        mcp_env = dict(item.split("=", 1) for item in args.env.split(","))
    
    success = cursor.add_mcp_server(
        name=args.name,
        command=args.command,
        args=mcp_args,
        env=mcp_env
    )
    
    if success:
        print(f"✅ 已添加 MCP 服务器: {args.name}")
        return 0
    else:
        print(f"❌ 添加失败", file=sys.stderr)
        return 1


def cmd_chat(cursor: CursorIntegration, args):
    """AI 对话（提示使用 Cursor）"""
    if not cursor.is_installed():
        print("❌ Cursor 未安装", file=sys.stderr)
        return 1
    
    print("💡 Cursor AI 对话功能说明")
    print("=" * 50)
    print()
    print("Cursor 的 AI 功能需要在 IDE 中使用。请按以下方式操作：")
    print()
    print("1. 打开 Cursor IDE")
    print("2. 使用快捷键调用 AI:")
    print("   - Cmd+K (macOS) / Ctrl+K (Windows/Linux): 编辑模式")
    print("   - Cmd+L (macOS) / Ctrl+L (Windows/Linux): 聊天模式")
    print()
    print(f"你的问题: {args.message}")
    print()
    print("建议: 复制问题到 Cursor 中进行对话")
    
    # 尝试打开 Cursor
    if args.open_cursor:
        cursor.open_file(".", new_window=True)
        print("\n✅ 已打开 Cursor")
    
    return 0


def cmd_generate(cursor: CursorIntegration, args):
    """代码生成提示"""
    print("💡 代码生成功能说明")
    print("=" * 50)
    print()
    print("请在 Cursor IDE 中使用以下方式生成代码：")
    print()
    print("1. 打开 Cursor IDE")
    print("2. 按 Cmd+K (macOS) / Ctrl+K (Windows/Linux)")
    print("3. 输入你的需求描述")
    print()
    print(f"需求描述: {args.description}")
    if args.language:
        print(f"目标语言: {args.language}")
    print()
    
    # 生成提示词模板
    prompt = f"请用 {args.language or '合适的语言'} 实现以下功能:\n{args.description}"
    print(f"推荐提示词:\n```\n{prompt}\n```")
    
    return 0


def cmd_explain(cursor: CursorIntegration, args):
    """代码解释"""
    if not args.file or not os.path.exists(args.file):
        print(f"❌ 文件不存在: {args.file}", file=sys.stderr)
        return 1
    
    print("💡 代码解释功能说明")
    print("=" * 50)
    print()
    print("请在 Cursor IDE 中使用以下方式解释代码：")
    print()
    print("1. 在 Cursor 中打开文件")
    print("2. 选中要解释的代码")
    print("3. 按 Cmd+L (macOS) / Ctrl+L (Windows/Linux)")
    print("4. 输入: '解释这段代码'")
    print()
    
    # 打开文件
    if args.open:
        cursor.open_file(args.file)
        print(f"✅ 已在 Cursor 中打开: {args.file}")
    else:
        print(f"文件路径: {args.file}")
        print("使用 --open 参数可自动在 Cursor 中打开")
    
    return 0


def cmd_review(cursor: CursorIntegration, args):
    """代码审查"""
    if not args.file or not os.path.exists(args.file):
        print(f"❌ 文件不存在: {args.file}", file=sys.stderr)
        return 1
    
    print("💡 代码审查功能说明")
    print("=" * 50)
    print()
    print("请在 Cursor IDE 中使用以下方式审查代码：")
    print()
    print("1. 在 Cursor 中打开文件")
    print("2. 选中要审查的代码（或全选 Cmd+A）")
    print("3. 按 Cmd+L (macOS) / Ctrl+L (Windows/Linux)")
    print("4. 输入: '审查这段代码，找出潜在问题和改进建议'")
    print()
    
    if args.open:
        cursor.open_file(args.file)
        print(f"✅ 已在 Cursor 中打开: {args.file}")
    else:
        print(f"文件路径: {args.file}")
    
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Cursor IDE 集成工具",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  python3 cursor_cli.py status                    # 查看 Cursor 状态
  python3 cursor_cli.py open ./file.py            # 在 Cursor 中打开文件
  python3 cursor_cli.py open ./file.py --line 42  # 打开并定位到行
  python3 cursor_cli.py mcp list                  # 列出 MCP 服务器
  python3 cursor_cli.py chat "如何写快速排序？"   # AI 对话提示
        """
    )
    
    subparsers = parser.add_subparsers(dest="command", help="子命令")
    
    # status 命令
    status_parser = subparsers.add_parser("status", help="显示 Cursor 状态")
    status_parser.add_argument("--json", action="store_true", help="JSON 格式输出")
    
    # open 命令
    open_parser = subparsers.add_parser("open", help="在 Cursor 中打开文件")
    open_parser.add_argument("path", help="文件或文件夹路径")
    open_parser.add_argument("--line", "-l", type=int, help="定位到指定行")
    open_parser.add_argument("--new-window", "-n", action="store_true", help="在新窗口打开")
    
    # mcp 命令
    mcp_parser = subparsers.add_parser("mcp", help="MCP 服务器管理")
    mcp_subparsers = mcp_parser.add_subparsers(dest="mcp_command", help="MCP 子命令")
    
    mcp_list_parser = mcp_subparsers.add_parser("list", help="列出 MCP 服务器")
    mcp_list_parser.add_argument("--json", action="store_true", help="JSON 格式输出")
    
    mcp_add_parser = mcp_subparsers.add_parser("add", help="添加 MCP 服务器")
    mcp_add_parser.add_argument("--name", required=True, help="服务器名称")
    mcp_add_parser.add_argument("--command", required=True, help="启动命令")
    mcp_add_parser.add_argument("--args", help="命令参数（空格分隔）")
    mcp_add_parser.add_argument("--env", help="环境变量（KEY=VALUE,KEY2=VALUE2）")
    
    # chat 命令
    chat_parser = subparsers.add_parser("chat", help="AI 对话提示")
    chat_parser.add_argument("message", help="对话内容")
    chat_parser.add_argument("--open-cursor", action="store_true", help="同时打开 Cursor")
    
    # generate 命令
    gen_parser = subparsers.add_parser("generate", help="代码生成提示")
    gen_parser.add_argument("description", help="功能描述")
    gen_parser.add_argument("--language", "-l", help="目标编程语言")
    
    # explain 命令
    explain_parser = subparsers.add_parser("explain", help="代码解释")
    explain_parser.add_argument("--file", "-f", required=True, help="代码文件路径")
    explain_parser.add_argument("--open", action="store_true", help="在 Cursor 中打开")
    
    # review 命令
    review_parser = subparsers.add_parser("review", help="代码审查")
    review_parser.add_argument("--file", "-f", required=True, help="代码文件路径")
    review_parser.add_argument("--open", action="store_true", help="在 Cursor 中打开")
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return 0
    
    cursor = CursorIntegration()
    
    # 分发命令
    if args.command == "status":
        return cmd_status(cursor, args)
    elif args.command == "open":
        return cmd_open(cursor, args)
    elif args.command == "mcp":
        if args.mcp_command == "list":
            return cmd_mcp_list(cursor, args)
        elif args.mcp_command == "add":
            return cmd_mcp_add(cursor, args)
        else:
            mcp_parser.print_help()
            return 0
    elif args.command == "chat":
        return cmd_chat(cursor, args)
    elif args.command == "generate":
        return cmd_generate(cursor, args)
    elif args.command == "explain":
        return cmd_explain(cursor, args)
    elif args.command == "review":
        return cmd_review(cursor, args)
    else:
        parser.print_help()
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
