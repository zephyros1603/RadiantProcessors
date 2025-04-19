import re
import subprocess
import sys
# from clean import clean_log_file
# clean_log.py
import re

def clean_log_file(input_file='/Users/sanjanathyady/Desktop/kali-logs/live-session.log', output_file='/Users/sanjanathyady/Desktop/AiBB/Backend/RAG/logs/cleaned-session.log'):
    with open(input_file, 'r', errors='ignore') as f:
        raw = f.read()

    # Remove ANSI escape codes and control sequences
    ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
    cleaned = ansi_escape.sub('', raw)

    # Remove weird control characters (e.g., ^[)
    cleaned = re.sub(r'\x1b\[[0-9;]*[a-zA-Z]', '', cleaned)
    cleaned = re.sub(r'[^\x20-\x7E\r\n]', '', cleaned)

    with open(output_file, 'w') as f:
        f.write(cleaned)

    print(f"[✓] Cleaned log saved to {output_file}")

if __name__ == "__main__":
    clean_log_file()

def get_last_command_output(clean_log_path='/Users/sanjanathyady/Desktop/AiBB/Backend/RAG/logs/cleaned-session.log'):
    try:
        
        with open(clean_log_path, 'r') as f:
            lines = f.readlines()
    except FileNotFoundError:
        return {"cmd": None, "output": None, "error": "Log file not found."}

    commands = []
    current = {"cmd": "", "output": []}

    for line in lines:
        if line.strip().startswith('# '):  # User command
            if current["cmd"]:
                commands.append(current)
                current = {"cmd": "", "output": []}
            current["cmd"] = line.strip()[2:]
        elif current["cmd"]:  # Collect output
            current["output"].append(line.rstrip())

    if current["cmd"]:
        commands.append(current)

    if commands:
        last = commands[-1]
        return {
            "cmd": last['cmd'],
            "output": "\n".join(last['output'])
        }
    else:
        return {"cmd": None, "output": None, "error": "No command found."}

